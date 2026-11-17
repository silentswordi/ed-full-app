import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';

export const PDF_RANGE_CHUNK_SIZE = 65536; // 64 KB per PDF.js range request

export interface PdfByteRangeReader {
  totalSize: number;
  readRange: (begin: number, end: number) => Promise<Uint8Array>;
}

/**
 * Custom PDFDataRangeTransport that streams 64 KB byte ranges on-demand from a File/Blob
 * or chunked IndexedDB store without ever loading the whole PDF into memory.
 */
export class AsyncRangePdfTransport extends pdfjsLib.PDFDataRangeTransport {
  private aborted = false;
  private readRangeFn: (begin: number, end: number) => Promise<Uint8Array>;

  constructor(
    length: number,
    initialData: Uint8Array | null,
    progressiveDone: boolean,
    readRangeFn: (begin: number, end: number) => Promise<Uint8Array>
  ) {
    super(length, initialData, progressiveDone);
    this.readRangeFn = readRangeFn;
  }

  override requestDataRange(begin: number, end: number): void {
    if (this.aborted) return;
    const clampedBegin = Math.max(0, begin);
    const clampedEnd = Math.min(this.length, Math.max(clampedBegin, end));

    this.readRangeFn(clampedBegin, clampedEnd)
      .then((bytes) => {
        if (this.aborted) return;
        this.onDataRange(begin, bytes);
      })
      .catch(() => {
        if (!this.aborted) {
          this.onDataRange(begin, new Uint8Array(0));
        }
      });
  }

  override abort(): void {
    this.aborted = true;
  }
}

export function createBlobRangeReader(blob: Blob): PdfByteRangeReader {
  return {
    totalSize: blob.size,
    readRange: async (begin: number, end: number) => {
      const safeStart = Math.max(0, begin);
      const safeEnd = Math.min(blob.size, Math.max(safeStart, end));
      if (safeEnd <= safeStart) return new Uint8Array(0);
      const buf = await blob.slice(safeStart, safeEnd).arrayBuffer();
      return new Uint8Array(buf);
    },
  };
}

export interface OpenedPdfRangeDocument {
  task: PDFDocumentLoadingTask;
  pdf: PDFDocumentProxy;
}

/**
 * Opens a PDF document using on-demand range requests.
 * For small PDFs (<= 512 KB), passes the whole bytes directly;
 * for larger PDFs (including 250+ MB textbooks), streams only needed 64 KB chunks.
 */
export async function openPdfFromRangeReader(
  reader: PdfByteRangeReader
): Promise<OpenedPdfRangeDocument> {
  const totalSize = reader.totalSize;

  if (totalSize <= 512 * 1024) {
    const fullBytes = await reader.readRange(0, totalSize);
    const task = pdfjsLib.getDocument({
      data: fullBytes,
      disableAutoFetch: true,
    });
    const pdf = await task.promise;
    return { task, pdf };
  }

  const initialLen = Math.min(totalSize, PDF_RANGE_CHUNK_SIZE);
  const initialData = await reader.readRange(0, initialLen);
  const transport = new AsyncRangePdfTransport(
    totalSize,
    initialData,
    initialLen >= totalSize,
    reader.readRange
  );

  const task = pdfjsLib.getDocument({
    range: transport,
    rangeChunkSize: PDF_RANGE_CHUNK_SIZE,
    disableAutoFetch: true,
    disableStream: true,
  });

  const pdf = await task.promise;
  return { task, pdf };
}
