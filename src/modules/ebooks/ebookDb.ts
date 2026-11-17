import { PdfByteRangeReader } from './pdfRangeTransport';
import { EbookRecord } from './types';

const DB_NAME = 'clinical_ebook_library_db';
const DB_VERSION = 2;
const BOOKS_STORE = 'books';
const ASSETS_STORE = 'assets';

// Store PDFs larger than 8 MB as 4 MB IndexedDB chunks to prevent mobile IPC / OOM crashes
export const PDF_CHUNK_SIZE = 4 * 1024 * 1024;
export const PDF_CHUNK_THRESHOLD = 8 * 1024 * 1024;

export interface StoredAsset {
  key: string;
  bookId: string;
  blob: Blob;
}

export interface PdfChunkManifest {
  chunked: true;
  totalSize: number;
  chunkSize: number;
  chunkCount: number;
  mimeType: string;
}

export interface SaveEbookResult {
  pdfBinarySaved: boolean;
}

function openEbookDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(BOOKS_STORE)) {
        const store = db.createObjectStore(BOOKS_STORE, { keyPath: 'id' });
        store.createIndex('addedAt', 'addedAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(ASSETS_STORE)) {
        const assetStore = db.createObjectStore(ASSETS_STORE, { keyPath: 'key' });
        assetStore.createIndex('bookId', 'bookId', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB.'));
  });
}

function putBookRecord(db: IDBDatabase, book: EbookRecord): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKS_STORE, 'readwrite');
    tx.objectStore(BOOKS_STORE).put(book);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to save book record.'));
  });
}

function putAssetsBatch(db: IDBDatabase, batch: StoredAsset[]): Promise<void> {
  if (batch.length === 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSETS_STORE, 'readwrite');
    const store = tx.objectStore(ASSETS_STORE);
    for (const asset of batch) {
      store.put(asset);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to save book assets.'));
  });
}

function deleteAssetsByKeyPrefix(db: IDBDatabase, bookId: string, keyPrefix: string): Promise<void> {
  return new Promise((resolve) => {
    const tx = db.transaction(ASSETS_STORE, 'readwrite');
    const store = tx.objectStore(ASSETS_STORE);
    const idx = store.index('bookId');
    const req = idx.openKeyCursor(IDBKeyRange.only(bookId));
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        if (String(cursor.primaryKey).startsWith(keyPrefix)) {
          store.delete(cursor.primaryKey);
        }
        cursor.continue();
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

export async function getAllEbooks(): Promise<EbookRecord[]> {
  const db = await openEbookDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKS_STORE, 'readonly');
    const store = tx.objectStore(BOOKS_STORE);
    const req = store.getAll();

    req.onsuccess = () => {
      const items = (req.result as EbookRecord[]) || [];
      items.sort((a, b) => b.addedAt - a.addedAt);
      resolve(items);
    };
    req.onerror = () => reject(req.error ?? new Error('Failed to load books.'));
    tx.oncomplete = () => db.close();
  });
}

/**
 * Saves an EbookRecord, batches regular assets safely, and streams large source PDFs
 * in 4 MB sequential chunks so 250+ MB files never crash mobile browser memory or IDB IPC.
 */
export async function saveEbook(
  book: EbookRecord,
  assets: StoredAsset[] = [],
  sourcePdfFile?: Blob | null,
  onSaveProgress?: (percent: number) => void
): Promise<SaveEbookResult> {
  const db = await openEbookDb();
  let pdfBinarySaved = true;

  try {
    // 1. Always persist searchable text & chapters first
    await putBookRecord(db, book);

    // 2. Save regular assets (e.g. EPUB images) in bounded batches (~20 items / <= 12 MB per tx)
    if (assets.length > 0) {
      let currentBatch: StoredAsset[] = [];
      let currentBatchBytes = 0;

      const flushBatch = async () => {
        if (currentBatch.length === 0) return;
        await putAssetsBatch(db, currentBatch);
        currentBatch = [];
        currentBatchBytes = 0;
      };

      try {
        for (let i = 0; i < assets.length; i++) {
          const item = assets[i];
          currentBatch.push(item);
          currentBatchBytes += item.blob.size;
          if (currentBatch.length >= 20 || currentBatchBytes >= 12 * 1024 * 1024) {
            await flushBatch();
            await new Promise((r) => setTimeout(r, 0));
          }
        }
        await flushBatch();
      } catch {
        // Keep the saved text book even if storage quota is tight for all embedded media
        pdfBinarySaved = false;
      }
    }

    // 3. Save source PDF Blob sequentially in chunks when > 8 MB
    if (sourcePdfFile && sourcePdfFile.size > 0) {
      try {
        if (sourcePdfFile.size <= PDF_CHUNK_THRESHOLD) {
          await putAssetsBatch(db, [
            {
              key: `${book.id}::pdf`,
              bookId: book.id,
              blob: sourcePdfFile,
            },
          ]);
        } else {
          const totalSize = sourcePdfFile.size;
          const chunkCount = Math.ceil(totalSize / PDF_CHUNK_SIZE);

          for (let idx = 0; idx < chunkCount; idx++) {
            const start = idx * PDF_CHUNK_SIZE;
            const end = Math.min(totalSize, start + PDF_CHUNK_SIZE);
            const sliceBlob = sourcePdfFile.slice(start, end, 'application/pdf');
            await putAssetsBatch(db, [
              {
                key: `${book.id}::pdf_chunk_${idx}`,
                bookId: book.id,
                blob: sliceBlob,
              },
            ]);
            if (onSaveProgress) {
              onSaveProgress(94 + Math.round(((idx + 1) / chunkCount) * 5));
            }
            // Yield between chunks so GC and UI remain responsive
            await new Promise((r) => setTimeout(r, 0));
          }

          const manifest: PdfChunkManifest = {
            chunked: true,
            totalSize,
            chunkSize: PDF_CHUNK_SIZE,
            chunkCount,
            mimeType: 'application/pdf',
          };
          await putAssetsBatch(db, [
            {
              key: `${book.id}::pdf_manifest`,
              bookId: book.id,
              blob: new Blob([JSON.stringify(manifest)], { type: 'application/json' }),
            },
          ]);
        }
      } catch {
        // Storage quota exceeded on device: remove partial PDF binary chunks while keeping full text book
        pdfBinarySaved = false;
        await deleteAssetsByKeyPrefix(db, book.id, `${book.id}::pdf`);
      }
    }
  } finally {
    db.close();
  }

  return { pdfBinarySaved };
}

export async function getEbookAsset(key: string): Promise<Blob | null> {
  const db = await openEbookDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSETS_STORE, 'readonly');
    const store = tx.objectStore(ASSETS_STORE);
    const req = store.get(key);

    req.onsuccess = () => {
      const record = req.result as StoredAsset | undefined;
      resolve(record?.blob ?? null);
    };
    req.onerror = () => reject(req.error ?? new Error('Failed to load asset.'));
    tx.oncomplete = () => db.close();
  });
}

/**
 * Returns an on-demand byte-range reader for a stored PDF (supports both chunked
 * 250+ MB PDFs and legacy single-blob PDFs) without ever loading the whole file into RAM.
 */
export async function getPdfRangeReader(bookId: string): Promise<PdfByteRangeReader | null> {
  const manifestBlob = await getEbookAsset(`${bookId}::pdf_manifest`);
  if (manifestBlob) {
    try {
      const manifest = JSON.parse(await manifestBlob.text()) as PdfChunkManifest;
      if (manifest && manifest.chunked && manifest.totalSize > 0 && manifest.chunkSize > 0) {
        // Tiny 2-chunk LRU cache avoids hitting IndexedDB repeatedly on consecutive 64 KB reads
        const chunkCache = new Map<number, Blob>();
        const getChunkBlob = async (chunkIdx: number): Promise<Blob | null> => {
          const cached = chunkCache.get(chunkIdx);
          if (cached) return cached;
          const blob = await getEbookAsset(`${bookId}::pdf_chunk_${chunkIdx}`);
          if (!blob) return null;
          if (chunkCache.size >= 2) {
            const firstKey = chunkCache.keys().next().value;
            if (firstKey !== undefined) chunkCache.delete(firstKey);
          }
          chunkCache.set(chunkIdx, blob);
          return blob;
        };

        return {
          totalSize: manifest.totalSize,
          readRange: async (begin: number, end: number) => {
            const safeStart = Math.max(0, begin);
            const safeEnd = Math.min(manifest.totalSize, Math.max(safeStart, end));
            const length = safeEnd - safeStart;
            if (length <= 0) return new Uint8Array(0);

            const out = new Uint8Array(length);
            const startChunk = Math.floor(safeStart / manifest.chunkSize);
            const endChunk = Math.floor((safeEnd - 1) / manifest.chunkSize);
            let outOffset = 0;

            for (let cIdx = startChunk; cIdx <= endChunk; cIdx++) {
              const chunkBlob = await getChunkBlob(cIdx);
              if (!chunkBlob) return new Uint8Array(0);

              const chunkGlobalStart = cIdx * manifest.chunkSize;
              const localStart = Math.max(0, safeStart - chunkGlobalStart);
              const localEnd = Math.min(chunkBlob.size, safeEnd - chunkGlobalStart);
              if (localEnd > localStart) {
                const sliceBuf = await chunkBlob.slice(localStart, localEnd).arrayBuffer();
                const view = new Uint8Array(sliceBuf);
                out.set(view, outOffset);
                outOffset += view.byteLength;
              }
            }

            return outOffset === length ? out : out.subarray(0, outOffset);
          },
        };
      }
    } catch {
      // Fall through to legacy single-blob lookup
    }
  }

  const singleBlob = await getEbookAsset(`${bookId}::pdf`);
  if (!singleBlob || singleBlob.size === 0) return null;

  return {
    totalSize: singleBlob.size,
    readRange: async (begin: number, end: number) => {
      const safeStart = Math.max(0, begin);
      const safeEnd = Math.min(singleBlob.size, Math.max(safeStart, end));
      if (safeEnd <= safeStart) return new Uint8Array(0);
      const buf = await singleBlob.slice(safeStart, safeEnd).arrayBuffer();
      return new Uint8Array(buf);
    },
  };
}

export async function saveEbookAssets(assets: StoredAsset[]): Promise<void> {
  if (assets.length === 0) return;
  const db = await openEbookDb();
  try {
    await putAssetsBatch(db, assets);
  } finally {
    db.close();
  }
}

export async function updateEbookMeta(
  id: string,
  updates: { title?: string; author?: string }
): Promise<EbookRecord | null> {
  const db = await openEbookDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKS_STORE, 'readwrite');
    const store = tx.objectStore(BOOKS_STORE);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const existing = getReq.result as EbookRecord | undefined;
      if (!existing) {
        resolve(null);
        return;
      }
      const updated: EbookRecord = {
        ...existing,
        title: updates.title !== undefined ? updates.title.trim() || existing.title : existing.title,
        author: updates.author !== undefined ? updates.author.trim() || undefined : existing.author,
      };
      const putReq = store.put(updated);
      putReq.onsuccess = () => resolve(updated);
      putReq.onerror = () => reject(putReq.error ?? new Error('Failed to update book metadata.'));
    };

    getReq.onerror = () => reject(getReq.error ?? new Error('Failed to find book.'));
    tx.oncomplete = () => db.close();
  });
}

export async function deleteEbook(id: string): Promise<void> {
  const db = await openEbookDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([BOOKS_STORE, ASSETS_STORE], 'readwrite');
    const bookStore = tx.objectStore(BOOKS_STORE);
    const assetStore = tx.objectStore(ASSETS_STORE);

    bookStore.delete(id);

    const idx = assetStore.index('bookId');
    const cursorReq = idx.openKeyCursor(IDBKeyRange.only(id));
    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (cursor) {
        assetStore.delete(cursor.primaryKey);
        cursor.continue();
      }
    };

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      const err = tx.error ?? new Error('Failed to delete book.');
      db.close();
      reject(err);
    };
  });
}
