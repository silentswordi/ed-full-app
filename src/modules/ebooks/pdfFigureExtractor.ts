import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { getEbookAsset, getPdfRangeReader, saveEbookAssets, StoredAsset } from './ebookDb';
import { openPdfFromRangeReader } from './pdfRangeTransport';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export interface PdfFigureBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  yRatioTop: number;
  yRatioBottom: number;
}

export interface PdfExtractedFigure {
  assetKey: string;
  pageNumber: number;
  index: number;
  yRatioTop: number;
  yRatioBottom: number;
  width: number;
  height: number;
  nearbyCaption?: string;
  anchorSnippet?: string;
}

interface RawGraphicBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  isRaster: boolean;
  complexity: number;
}

function applyPointTransform(x: number, y: number, m: number[]): [number, number] {
  const pt = [x, y];
  pdfjsLib.Util.applyTransform(pt, m);
  return [pt[0], pt[1]];
}

function transformRectToViewport(
  ux0: number,
  uy0: number,
  ux1: number,
  uy1: number,
  ctm: number[],
  pageW: number,
  pageH: number
): { minX: number; minY: number; maxX: number; maxY: number } | null {
  const corners = [
    applyPointTransform(ux0, uy0, ctm),
    applyPointTransform(ux1, uy0, ctm),
    applyPointTransform(ux0, uy1, ctm),
    applyPointTransform(ux1, uy1, ctm),
  ];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [cx, cy] of corners) {
    if (!Number.isFinite(cx) || !Number.isFinite(cy)) return null;
    if (cx < minX) minX = cx;
    if (cy < minY) minY = cy;
    if (cx > maxX) maxX = cx;
    if (cy > maxY) maxY = cy;
  }

  minX = Math.max(0, Math.min(pageW, minX));
  maxX = Math.max(0, Math.min(pageW, maxX));
  minY = Math.max(0, Math.min(pageH, minY));
  maxY = Math.max(0, Math.min(pageH, maxY));

  if (maxX <= minX || maxY <= minY) return null;
  return { minX, minY, maxX, maxY };
}

function mergeNearbyBoxes(boxes: RawGraphicBox[], gap: number): RawGraphicBox[] {
  const list = boxes.map((b) => ({ ...b }));
  let changed = true;
  let guard = 0;

  while (changed && guard < 40) {
    changed = false;
    guard++;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const overlapsX = a.minX - gap <= b.maxX && a.maxX + gap >= b.minX;
        const overlapsY = a.minY - gap <= b.maxY && a.maxY + gap >= b.minY;
        if (overlapsX && overlapsY) {
          list[i] = {
            minX: Math.min(a.minX, b.minX),
            minY: Math.min(a.minY, b.minY),
            maxX: Math.max(a.maxX, b.maxX),
            maxY: Math.max(a.maxY, b.maxY),
            isRaster: a.isRaster || b.isRaster,
            complexity: a.complexity + b.complexity,
          };
          list.splice(j, 1);
          changed = true;
          j--;
        }
      }
    }
  }

  return list;
}

/**
 * Inspects a PDF page operator list using CTM tracking to locate all embedded
 * photos, medical diagrams, flowcharts, and vector algorithms.
 */
export async function detectPageFigureBoxes(
  page: PDFPageProxy,
  pageTextLength = 500
): Promise<PdfFigureBox[]> {
  const viewport = page.getViewport({ scale: 1 });
  const pageW = Math.max(1, viewport.width);
  const pageH = Math.max(1, viewport.height);

  const opList = await page.getOperatorList();
  const OPS = pdfjsLib.OPS;

  let ctm: number[] = [...viewport.transform];
  const stack: number[][] = [];
  const rawBoxes: RawGraphicBox[] = [];

  for (let i = 0; i < opList.fnArray.length; i++) {
    const fn = opList.fnArray[i];
    const args = opList.argsArray[i];

    if (fn === OPS.save) {
      stack.push([...ctm]);
      continue;
    }
    if (fn === OPS.restore) {
      if (stack.length > 0) ctm = stack.pop()!;
      continue;
    }
    if (fn === OPS.transform && Array.isArray(args) && args.length >= 6) {
      ctm = pdfjsLib.Util.transform(ctm, args as number[]);
      continue;
    }
    if (fn === OPS.paintFormXObjectBegin) {
      stack.push([...ctm]);
      if (Array.isArray(args?.[0]) && args[0].length >= 6) {
        ctm = pdfjsLib.Util.transform(ctm, args[0] as number[]);
      }
      continue;
    }
    if (fn === OPS.paintFormXObjectEnd) {
      if (stack.length > 0) ctm = stack.pop()!;
      continue;
    }

    if (
      fn === OPS.paintImageXObject ||
      fn === OPS.paintInlineImageXObject ||
      fn === OPS.paintInlineImageXObjectGroup ||
      fn === OPS.paintImageMaskXObject ||
      fn === OPS.paintImageMaskXObjectGroup ||
      fn === OPS.paintImageXObjectRepeat ||
      fn === OPS.paintImageMaskXObjectRepeat ||
      fn === OPS.paintXObject
    ) {
      const rect = transformRectToViewport(0, 0, 1, 1, ctm, pageW, pageH);
      if (!rect) continue;
      const w = rect.maxX - rect.minX;
      const h = rect.maxY - rect.minY;
      // Skip tiny bullet icons and full-page background layers over dense text
      if (w < 38 || h < 38) continue;
      if (w > pageW * 0.97 && h > pageH * 0.97 && pageTextLength > 220) continue;

      rawBoxes.push({
        ...rect,
        isRaster: true,
        complexity: 1,
      });
      continue;
    }

    if ((fn === OPS.constructPath || fn === OPS.rawFillPath) && Array.isArray(args)) {
      let ux0 = Infinity;
      let uy0 = Infinity;
      let ux1 = -Infinity;
      let uy1 = -Infinity;

      const minMax = args[2] as ArrayLike<number> | undefined;
      if (minMax && typeof minMax.length === 'number' && minMax.length >= 4) {
        ux0 = minMax[0];
        uy0 = minMax[1];
        ux1 = minMax[2];
        uy1 = minMax[3];
      } else if (Array.isArray(args[1])) {
        const coords = args[1] as number[];
        for (let k = 0; k + 1 < coords.length; k += 2) {
          const x = coords[k];
          const y = coords[k + 1];
          if (typeof x !== 'number' || typeof y !== 'number') continue;
          if (x < ux0) ux0 = x;
          if (y < uy0) uy0 = y;
          if (x > ux1) ux1 = x;
          if (y > uy1) uy1 = y;
        }
      }

      if (!Number.isFinite(ux0) || !Number.isFinite(ux1)) continue;
      const rect = transformRectToViewport(ux0, uy0, ux1, uy1, ctm, pageW, pageH);
      if (!rect) continue;
      const w = rect.maxX - rect.minX;
      const h = rect.maxY - rect.minY;

      // Ignore full-page frames/backgrounds and single hairlines
      if (w > pageW * 0.9 && h > pageH * 0.9) continue;
      if ((w < 6 && h < 6) || (h < 3 && w > 24) || (w < 3 && h > 24)) continue;

      const pathData = Array.isArray(args[1]) ? args[1][0] : args[1];
      const opsCount = Array.isArray(args[0])
        ? args[0].length
        : pathData && typeof (pathData as ArrayLike<number>).length === 'number'
          ? Math.max(1, Math.floor((pathData as ArrayLike<number>).length / 3))
          : 1;
      rawBoxes.push({
        ...rect,
        isRaster: false,
        complexity: opsCount,
      });
    }
  }

  if (rawBoxes.length === 0) return [];

  const merged = mergeNearbyBoxes(rawBoxes, 14);
  const valid = merged.filter((box) => {
    const w = box.maxX - box.minX;
    const h = box.maxY - box.minY;
    if (box.isRaster) {
      return w >= 42 && h >= 42 && !(w > pageW * 0.97 && h > pageH * 0.97 && pageTextLength > 220);
    }
    // Vector algorithms / flowcharts / diagrams have multiple shapes & substantial bounds
    return box.complexity >= 4 && w >= 95 && h >= 64 && !(w > pageW * 0.94 && h > pageH * 0.94);
  });

  if (valid.length === 0) return [];

  const pad = 8;
  return valid
    .map((box) => {
      const minX = Math.max(0, box.minX - pad);
      const minY = Math.max(0, box.minY - pad);
      const maxX = Math.min(pageW, box.maxX + pad);
      const maxY = Math.min(pageH, box.maxY + pad);
      return {
        minX,
        minY,
        maxX,
        maxY,
        yRatioTop: minY / pageH,
        yRatioBottom: maxY / pageH,
      };
    })
    .sort((a, b) => a.minY - b.minY);
}

interface PageTextLineHint {
  text: string;
  viewportY: number;
}

const CAPTION_START_REGEX =
  /^(?:fig\.?|figure|table|box|algorithm|شکل|جدول|نمودار|الگوریتم)\s+[\d۰-۹]+(?:[.\-–][\d۰-۹]+)?/i;

function collectPageTextLineHints(
  items: Array<Record<string, unknown>>,
  viewportTransform: number[]
): PageTextLineHint[] {
  const lines: PageTextLineHint[] = [];
  let current = '';
  let currentY = 0;
  let lastPdfY: number | null = null;

  const push = () => {
    const trimmed = current.replace(/\s+/g, ' ').trim();
    if (trimmed.length >= 4) {
      const pt = [0, currentY];
      pdfjsLib.Util.applyTransform(pt, viewportTransform);
      lines.push({ text: trimmed, viewportY: pt[1] });
    }
    current = '';
  };

  for (const raw of items) {
    if (!('str' in raw) || typeof raw.str !== 'string') continue;
    const str = raw.str;
    const tr = Array.isArray(raw.transform) ? (raw.transform as number[]) : [10, 0, 0, 10, 0, 0];
    const y = tr[5] ?? 0;
    const fontSize = Math.max(6, Math.hypot(tr[0] || 0, tr[1] || 0) || 10);

    if (lastPdfY !== null && Math.abs(y - lastPdfY) > fontSize * 0.6) {
      push();
      current = str;
      currentY = y;
    } else {
      if (!current) currentY = y;
      if (current && str && !current.endsWith(' ') && !str.startsWith(' ')) {
        current += ' ';
      }
      current += str;
    }
    lastPdfY = y;
    if (raw.hasEOL) {
      push();
      lastPdfY = null;
    }
  }
  push();
  return lines;
}

function findFigureAnchors(
  box: PdfFigureBox,
  lineHints: PageTextLineHint[]
): { nearbyCaption?: string; anchorSnippet?: string } {
  let bestCaption: { text: string; dist: number } | null = null;
  let bestAnchor: { text: string; dist: number } | null = null;

  for (const line of lineHints) {
    // Prefer lines right below box.maxY, or up to 90px above box.minY
    const belowDist = line.viewportY >= box.maxY - 12 ? line.viewportY - box.maxY : Infinity;
    const aboveDist = line.viewportY <= box.minY + 12 ? box.minY - line.viewportY : Infinity;

    if (CAPTION_START_REGEX.test(line.text)) {
      const dist = Math.min(belowDist <= 180 ? belowDist : Infinity, aboveDist <= 90 ? aboveDist + 25 : Infinity);
      if (dist < Infinity && (!bestCaption || dist < bestCaption.dist)) {
        bestCaption = { text: line.text.slice(0, 72), dist };
      }
    } else if (line.text.length >= 24) {
      const dist = Math.min(belowDist <= 140 ? belowDist : Infinity, aboveDist <= 100 ? aboveDist : Infinity);
      if (dist < Infinity && (!bestAnchor || dist < bestAnchor.dist)) {
        bestAnchor = { text: line.text.slice(0, 80), dist };
      }
    }
  }

  return {
    nearbyCaption: bestCaption?.text,
    anchorSnippet: bestAnchor?.text,
  };
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        canvas.toBlob(
          (pngBlob) => {
            if (pngBlob) resolve(pngBlob);
            else reject(new Error('Failed to export figure canvas'));
          },
          'image/png'
        );
      },
      'image/webp',
      0.9
    );
  });
}

async function extractAndCachePageFigures(
  bookId: string,
  pdfDoc: PDFDocumentProxy,
  pageNumber: number
): Promise<PdfExtractedFigure[]> {
  const page = await pdfDoc.getPage(pageNumber);
  let pageCanvas: HTMLCanvasElement | null = null;

  try {
    const viewport = page.getViewport({ scale: 1 });
    const textContent = await page.getTextContent();
    let pageTextLength = 0;
    for (const item of textContent.items) {
      if ('str' in item) pageTextLength += item.str.length;
    }

    const boxes = await detectPageFigureBoxes(page, pageTextLength);
    const metaKey = `${bookId}::pdf_page_meta_v3_${pageNumber}`;

    if (boxes.length === 0) {
      const emptyMetaBlob = new Blob([JSON.stringify([])], { type: 'application/json' });
      await saveEbookAssets([{ key: metaKey, bookId, blob: emptyMetaBlob }]);
      return [];
    }

    const lineHints = collectPageTextLineHints(
      textContent.items as unknown as Array<Record<string, unknown>>,
      viewport.transform
    );

    const renderScale = 1.8;
    const renderViewport = page.getViewport({ scale: renderScale });
    pageCanvas = document.createElement('canvas');
    pageCanvas.width = Math.max(1, Math.floor(renderViewport.width));
    pageCanvas.height = Math.max(1, Math.floor(renderViewport.height));

    const ctx = pageCanvas.getContext('2d');
    if (!ctx) return [];

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: renderViewport,
      canvas: pageCanvas,
    }).promise;

    const assetsToSave: StoredAsset[] = [];
    const extracted: PdfExtractedFigure[] = [];

    for (let idx = 0; idx < boxes.length; idx++) {
      const b = boxes[idx];
      const sx = Math.max(0, Math.floor(b.minX * renderScale));
      const sy = Math.max(0, Math.floor(b.minY * renderScale));
      const sw = Math.min(pageCanvas.width - sx, Math.max(1, Math.ceil((b.maxX - b.minX) * renderScale)));
      const sh = Math.min(pageCanvas.height - sy, Math.max(1, Math.ceil((b.maxY - b.minY) * renderScale)));

      if (sw < 24 || sh < 24) continue;

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = sw;
      cropCanvas.height = sh;
      const cropCtx = cropCanvas.getContext('2d');
      if (!cropCtx) continue;

      cropCtx.fillStyle = '#ffffff';
      cropCtx.fillRect(0, 0, sw, sh);
      cropCtx.drawImage(pageCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

      const figBlob = await canvasToBlob(cropCanvas);
      // Release backing bitmap immediately
      cropCanvas.width = 0;
      cropCanvas.height = 0;

      const assetKey = `${bookId}::pdf_fig_${pageNumber}_${idx}`;
      assetsToSave.push({ key: assetKey, bookId, blob: figBlob });

      const anchors = findFigureAnchors(b, lineHints);
      extracted.push({
        assetKey,
        pageNumber,
        index: idx,
        yRatioTop: b.yRatioTop,
        yRatioBottom: b.yRatioBottom,
        width: Math.round(b.maxX - b.minX),
        height: Math.round(b.maxY - b.minY),
        nearbyCaption: anchors.nearbyCaption,
        anchorSnippet: anchors.anchorSnippet,
      });
    }

    assetsToSave.push({
      key: metaKey,
      bookId,
      blob: new Blob([JSON.stringify(extracted)], { type: 'application/json' }),
    });

    await saveEbookAssets(assetsToSave);
    return extracted;
  } finally {
    if (pageCanvas) {
      pageCanvas.width = 0;
      pageCanvas.height = 0;
    }
    try {
      page.cleanup();
    } catch {
      // ignore cleanup error
    }
  }
}

/**
 * Loads all figures/algorithms for a PDF page range. Reads pre-cached crops from IndexedDB first,
 * and lazily renders + caches any uncached pages via byte-range streaming (never loading 250+ MB into RAM).
 */
export async function loadPdfChapterFigures(
  bookId: string,
  pageStart: number,
  pageEnd: number,
  isCancelled?: () => boolean,
  onPageExtracted?: (pageNumber: number, figs: PdfExtractedFigure[]) => void,
  priorityPages?: number[]
): Promise<Record<number, PdfExtractedFigure[]>> {
  const start = Math.max(1, pageStart);
  const end = Math.max(start, pageEnd);
  const result: Record<number, PdfExtractedFigure[]> = {};
  const missingPages: number[] = [];

  for (let p = start; p <= end; p++) {
    if (isCancelled?.()) return result;
    const cachedMetaBlob = await getEbookAsset(`${bookId}::pdf_page_meta_v3_${p}`);
    if (cachedMetaBlob) {
      try {
        const text = await cachedMetaBlob.text();
        result[p] = JSON.parse(text) as PdfExtractedFigure[];
        continue;
      } catch {
        // Re-extract if corrupted
      }
    }
    missingPages.push(p);
  }

  if (missingPages.length === 0) return result;

  // Order missing pages so priority pages (e.g. focused search topic pages) extract first
  const prioritySet = new Set(priorityPages || []);
  const orderedMissing = [
    ...missingPages.filter((p) => prioritySet.has(p)),
    ...missingPages.filter((p) => !prioritySet.has(p)),
  ];

  const rangeReader = await getPdfRangeReader(bookId);
  if (!rangeReader || rangeReader.totalSize === 0 || isCancelled?.()) return result;

  let pdfDoc: PDFDocumentProxy | null = null;
  let task: PDFDocumentLoadingTask | null = null;

  try {
    const opened = await openPdfFromRangeReader(rangeReader);
    task = opened.task;
    pdfDoc = opened.pdf;
    if (!pdfDoc || isCancelled?.()) return result;

    let processedCount = 0;
    for (const p of orderedMissing) {
      if (isCancelled?.()) break;
      if (p > pdfDoc.numPages) continue;
      const pageFigs = await extractAndCachePageFigures(bookId, pdfDoc, p);
      result[p] = pageFigs;
      onPageExtracted?.(p, pageFigs);
      processedCount++;
      if (processedCount % 10 === 0) {
        await pdfDoc.cleanup().catch(() => {});
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  } catch {
    // Gracefully return whatever pages succeeded
  } finally {
    if (pdfDoc) {
      await pdfDoc.cleanup().catch(() => {});
    }
    if (task && typeof task.destroy === 'function') {
      await task.destroy().catch(() => {});
    }
  }

  return result;
}
