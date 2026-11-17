import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { normalizeSearchText } from '../../utils/smartSearch';
import { StoredAsset } from './ebookDb';
import { createBlobRangeReader, openPdfFromRangeReader } from './pdfRangeTransport';
import {
  BookDirection,
  EbookChapter,
  EbookFormat,
  EbookRecord,
  EbookTopic,
  ParseProgress,
  TocSource,
} from './types';

export interface ParseEbookResult {
  book: EbookRecord;
  assets: StoredAsset[];
  sourcePdfFile?: File;
}

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function cleanTitle(raw: string | null | undefined, fallback: string): string {
  const cleaned = (raw || '').replace(/\s+/g, ' ').trim();
  return cleaned || fallback;
}

function cleanFileNameToTitle(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'کتاب بدون عنوان';
}

export function detectBookDirection(
  chapters: EbookChapter[],
  language?: string,
  title?: string
): BookDirection {
  const sampleParts: string[] = [];
  if (title) sampleParts.push(title);
  for (let i = 0; i < chapters.length && sampleParts.join(' ').length < 6000; i++) {
    sampleParts.push(chapters[i].title);
    for (let j = 0; j < chapters[i].topics.length && sampleParts.join(' ').length < 6000; j++) {
      sampleParts.push(chapters[i].topics[j].title);
      sampleParts.push(chapters[i].topics[j].content.slice(0, 1200));
    }
  }
  const sample = sampleParts.join(' ');
  const rtlChars = (sample.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []).length;
  const ltrChars = (sample.match(/[A-Za-z]/g) || []).length;

  if (rtlChars > 20 || ltrChars > 20) {
    return rtlChars >= ltrChars * 0.35 ? 'rtl' : 'ltr';
  }

  const lang = (language || '').toLowerCase();
  if (/^(fa|ar|ur|he|ps|ku)/.test(lang)) return 'rtl';
  if (/^(en|fr|de|es|it|pt|ru|nl)/.test(lang)) return 'ltr';
  return rtlChars >= ltrChars ? 'rtl' : 'ltr';
}

const KEEP_HYPHEN_PREFIXES = new Set([
  'non', 'life', 'self', 'well', 'high', 'low', 'long', 'short', 'anti', 'pre',
  'post', 'co', 'cross', 'half', 'full', 'all', 'first', 'two', 'three', 'four',
  'five', 'multi', 'semi', 'inter', 'intra', 'extra', 'pseudo', 'sub', 'super',
  'ultra', 'over', 'under', 're', 'out', 'end', 'mid', 'neo', 'pan', 'open',
  'closed', 'acute', 'chronic', 'right', 'left', 'upper', 'lower', 'broad',
]);

/**
 * Repairs PDF line-wrap hyphenation bugs such as "dis - eases" -> "diseases",
 * "pulmo - nary" -> "pulmonary", "fre - quent" -> "frequent", and
 * "life- threatening" -> "life-threatening".
 */
export function cleanBrokenHyphens(text: string): string {
  if (!text) return text;
  // 1. "word - word" (spaces on both sides of ASCII hyphen between lowercase/alpha word halves)
  let cleaned = text.replace(/\b([A-Za-z]{2,})\s+-\s+([a-z]{2,})\b/g, (_m, left: string, right: string) => {
    const lowLeft = left.toLowerCase();
    if (KEEP_HYPHEN_PREFIXES.has(lowLeft)) {
      return `${left}-${right}`;
    }
    return `${left}${right}`;
  });
  // 2. "life- threatening" -> "life-threatening" (trailing space right after hyphen inside a compound)
  cleaned = cleaned.replace(/\b([A-Za-z]{2,})-\s+([a-z]{2,})\b/g, (_m, left: string, right: string) => {
    const lowLeft = left.toLowerCase();
    if (KEEP_HYPHEN_PREFIXES.has(lowLeft) || right === 'year' || right === 'old' || right === 'threatening') {
      return `${left}-${right}`;
    }
    return `${left}${right}`;
  });
  return cleaned;
}

export function stripFigureTokens(text: string): string {
  return text
    .replace(/\[\[PDF_FIG:\d+:\d+\]\]/g, ' ')
    .replace(/\[\[H[23]:([^\]]+)\]\]/g, ' $1 ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Detects textbook running headers, footers, page numbers, and watermark/copyright lines
 * such as "509 CHAPTER 43 Wrist and Forearm Injuries", "508 PART II Trauma",
 * "CHAPTER 22 Chest Pain 205", "Page 12 of 400", or "Copyright © ...".
 */
export function isRunningHeaderOrFooterLine(line: string): boolean {
  const txt = line.trim();
  if (!txt) return false;
  if (txt.length > 120) return false;

  // Bare 1-4 digit page numbers or "- 508 -" / "Page 508" / "صفحه ۱۲"
  if (/^[\d۰-۹]{1,4}$/.test(txt)) return true;
  if (/^[-–—]\s*[\d۰-۹]{1,4}\s*[-–—]$/.test(txt)) return true;
  if (/^(?:Page|صفحه)\s+[\d۰-۹]+(?:\s+(?:of|از)\s+[\d۰-۹]+)?$/i.test(txt)) return true;

  // Running book headers with leading or trailing page number + CHAPTER / PART / SECTION / UNIT
  if (/^[\d۰-۹]{1,4}\s+(?:CHAPTER|PART|SECTION|UNIT)\b(?:\s+[\dIVXLCDM]+)?(?:\s+.*)?$/i.test(txt)) {
    return true;
  }
  if (/^(?:CHAPTER|PART|SECTION|UNIT)\s+[\dIVXLCDM]+\b.*\s+[\d۰-۹]{1,4}$/i.test(txt)) {
    return true;
  }
  if (/^[\d۰-۹]{1,4}\s+(?:فصل|بخش|گفتار)\s+[\d۰-۹]+(?:\s+.*)?$/.test(txt)) {
    return true;
  }
  if (/^(?:فصل|بخش|گفتار)\s+[\d۰-۹]+.*\s+[\d۰-۹]{1,4}$/.test(txt)) {
    return true;
  }

  // Publisher / download watermarks / copyright footers
  if (
    /^(?:Downloaded\s+(?:for|by|from)\b|Copyright\b|©\s*\d{4}\b|All\s+rights\s+reserved\b|Elsevier\s+(?:Inc|Ltd)|McGraw[-\s]?Hill|Lippincott|UpToDate|https?:\/\/\S+$)/i.test(
      txt
    )
  ) {
    return true;
  }

  return false;
}

function finalizeTopic(
  title: string,
  content: string,
  order: number,
  pageStart?: number,
  pageEnd?: number,
  htmlContent?: string
): EbookTopic {
  const safeTitle = cleanTitle(title, `موضوع ${order + 1}`);
  const safeContent = cleanBrokenHyphens(content).replace(/\n{3,}/g, '\n\n').trim();
  const searchableContent = stripFigureTokens(safeContent);
  return {
    id: createId('topic'),
    title: safeTitle,
    normalizedTitle: normalizeSearchText(safeTitle),
    content: safeContent,
    htmlContent: htmlContent?.trim() || undefined,
    normalizedContent: normalizeSearchText(searchableContent),
    pageStart,
    pageEnd,
    order,
  };
}

function finalizeChapter(
  title: string,
  topics: EbookTopic[],
  order: number,
  pageStart?: number,
  pageEnd?: number
): EbookChapter {
  const safeTitle = cleanTitle(title, `سرفصل ${order + 1}`);
  const reordered = topics.map((t, idx) => ({ ...t, order: idx }));
  return {
    id: createId('chap'),
    title: safeTitle,
    normalizedTitle: normalizeSearchText(safeTitle),
    pageStart,
    pageEnd,
    order,
    topics: reordered,
  };
}

/**
 * Removes duplicate paragraphs/sections (>= 60 normalized chars) across topics/chapters,
 * and discards orphan page numbers/headings that belonged strictly to skipped duplicate blocks.
 */
function deduplicateTopicBlocks(content: string, seenLongBlocks: Set<string>): string {
  if (!content) return '';
  const blocks = content.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const kept: string[] = [];
  let pendingShort: string[] = [];
  let droppedDuplicateCount = 0;
  let keptSubstantialCount = 0;

  for (const blk of blocks) {
    if (/^\[\[PDF_FIG:\d+:\d+\]\]$/.test(blk)) {
      if (!seenLongBlocks.has(blk)) {
        seenLongBlocks.add(blk);
        kept.push(...pendingShort, blk);
        pendingShort = [];
      }
      continue;
    }

    const cleaned = cleanBrokenHyphens(blk);
    // Drop isolated running page numbers, chapter/part banners, and footers
    const unwrapped = cleaned.replace(/^\[\[H[23]:([\s\S]+?)\]\]$/, '$1').trim();
    if (isRunningHeaderOrFooterLine(unwrapped)) {
      continue;
    }

    const plainNorm = normalizeSearchText(stripFigureTokens(cleaned));
    if (plainNorm.length >= 60) {
      if (seenLongBlocks.has(plainNorm)) {
        // Any short headers right before this duplicate block belonged to the duplicated page/section
        pendingShort = [];
        droppedDuplicateCount++;
        continue;
      }
      seenLongBlocks.add(plainNorm);
      kept.push(...pendingShort, cleaned);
      pendingShort = [];
      keptSubstantialCount++;
    } else if (plainNorm.length > 0) {
      pendingShort.push(cleaned);
    }
  }

  // Only keep trailing short lines if this topic isn't just leftover headers from a skipped duplicate page
  if (pendingShort.length > 0 && (droppedDuplicateCount === 0 || keptSubstantialCount > 0)) {
    kept.push(...pendingShort);
  }

  return kept.join('\n\n').trim();
}

/**
 * Normalizes any book (including older cached IndexedDB records) so only Main Topics
 * exist under each chapter — merging deep sub-topics ("A › B › C") and artificial
 * page-range chunks ("Chapter (1–5)", "صفحه 3") and stripping duplicate shared-page blocks.
 */
export function consolidateBookMainTopics(book: EbookRecord): EbookRecord {
  const artificialPageTitleRegex = /^(?:صفحه\s+[\d۰-۹]+|صفحات\s+[\d۰-۹]+\s+تا\s+[\d۰-۹]+|.+\s*\([\d۰-۹]+(?:[–-][\d۰-۹]+)?\))$/;
  const seenBookLongBlocks = new Set<string>();
  const seenHtmlTopicSignatures = new Set<string>();

  const consolidatedChapters: EbookChapter[] = [];

  for (const chapter of book.chapters) {
    const getMainTopicTitle = (rawTitle: string): string => {
      if (artificialPageTitleRegex.test(rawTitle.trim())) {
        return chapter.title;
      }
      if (rawTitle.includes(' › ')) {
        const parts = rawTitle
          .split(' › ')
          .map((p) => p.trim())
          .filter(Boolean);
        if (parts.length > 0) {
          if (parts[0] === chapter.title && parts.length > 1) {
            return parts[1];
          }
          return parts[0];
        }
      }
      return rawTitle.trim();
    };

    const merged: EbookTopic[] = [];
    for (const topic of chapter.topics) {
      const mainTitle = getMainTopicTitle(topic.title) || chapter.title;
      const last = merged[merged.length - 1];

      if (last && last.title === mainTitle) {
        const combinedContent = [last.content, topic.content].filter(Boolean).join('\n\n').trim();
        const combinedHtml =
          last.htmlContent || topic.htmlContent
            ? [
                last.htmlContent || (last.content ? `<p>${last.content}</p>` : ''),
                topic.title !== mainTitle ? `<h4>${topic.title}</h4>` : '',
                topic.htmlContent || (topic.content ? `<p>${topic.content}</p>` : ''),
              ]
                .filter(Boolean)
                .join('\n')
            : undefined;
        const pStart =
          typeof last.pageStart === 'number' && typeof topic.pageStart === 'number'
            ? Math.min(last.pageStart, topic.pageStart)
            : (last.pageStart ?? topic.pageStart);
        const pEnd =
          typeof last.pageEnd === 'number' && typeof topic.pageEnd === 'number'
            ? Math.max(last.pageEnd, topic.pageEnd)
            : (topic.pageEnd ?? last.pageEnd);

        last.content = combinedContent;
        last.htmlContent = combinedHtml;
        last.normalizedContent = normalizeSearchText(stripFigureTokens(combinedContent));
        last.pageStart = pStart;
        last.pageEnd = pEnd;
      } else {
        merged.push({
          ...topic,
          title: mainTitle,
          normalizedTitle: normalizeSearchText(mainTitle),
          normalizedContent:
            topic.normalizedContent || normalizeSearchText(stripFigureTokens(topic.content)),
        });
      }
    }

    // Deduplicate identical blocks/pages across topics and across chapters
    const deduped: EbookTopic[] = [];
    for (const t of merged) {
      if (t.htmlContent) {
        const normBody = normalizeSearchText(stripFigureTokens(t.content));
        if (normBody.length >= 120) {
          if (seenHtmlTopicSignatures.has(normBody)) {
            continue;
          }
          seenHtmlTopicSignatures.add(normBody);
        }
        const cleanedText = cleanBrokenHyphens(t.content);
        deduped.push({
          ...t,
          content: cleanedText,
          normalizedContent: normalizeSearchText(stripFigureTokens(cleanedText)),
          order: deduped.length,
        });
      } else {
        const uniqueContent = deduplicateTopicBlocks(t.content, seenBookLongBlocks);
        if (!uniqueContent) {
          continue;
        }
        deduped.push({
          ...t,
          content: uniqueContent,
          normalizedContent: normalizeSearchText(stripFigureTokens(uniqueContent)),
          order: deduped.length,
        });
      }
    }

    if (deduped.length > 0) {
      consolidatedChapters.push({
        ...chapter,
        topics: deduped,
        order: consolidatedChapters.length,
      });
    }
  }

  return {
    ...book,
    schemaVersion: 2,
    chapters:
      consolidatedChapters.length > 0
        ? consolidatedChapters
        : book.chapters.map((c, idx) => ({ ...c, order: idx })),
  };
}

function resolveRelativePath(baseFilePath: string, relativeHref: string): string {
  const cleanHref = relativeHref.split('#')[0].split('?')[0].trim();
  if (!cleanHref) return baseFilePath;
  if (cleanHref.startsWith('/')) return cleanHref.slice(1);

  const baseParts = baseFilePath.split('/');
  baseParts.pop();
  for (const part of cleanHref.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') {
      baseParts.pop();
    } else {
      baseParts.push(part);
    }
  }
  return baseParts.join('/');
}

function extractFragment(href: string): string | undefined {
  const idx = href.indexOf('#');
  if (idx === -1) return undefined;
  const frag = href.slice(idx + 1).trim();
  if (!frag) return undefined;
  try {
    return decodeURIComponent(frag);
  } catch {
    return frag;
  }
}

function parseXmlDoc(xmlText: string): Document {
  return new DOMParser().parseFromString(xmlText, 'application/xml');
}

function parseHtmlDoc(htmlText: string): Document {
  return new DOMParser().parseFromString(htmlText, 'text/html');
}

function getElementsByTagLocalName(root: Document | Element, localName: string): Element[] {
  const target = localName.toLowerCase();
  const all = Array.from(root.getElementsByTagName('*'));
  return all.filter((el) => (el.localName || el.tagName.split(':').pop() || '').toLowerCase() === target);
}

function sanitizeRichHtml(
  root: Element,
  sourcePath: string,
  bookId: string,
  assetPathSet?: Set<string>
): string {
  const clone = root.cloneNode(true) as Element;
  clone.querySelectorAll('script, style, iframe, object, embed, link, meta, noscript, audio, video').forEach((el) => el.remove());

  const findAssetKey = (rawSrc: string): string | null => {
    const trimmed = rawSrc.trim();
    if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return null;
    }
    const resolved = resolveRelativePath(sourcePath, trimmed);
    let decoded = resolved;
    try {
      decoded = decodeURIComponent(resolved);
    } catch {
      // Keep resolved
    }
    if (!assetPathSet) return `${bookId}::${decoded.toLowerCase()}`;
    const decodedLower = decoded.toLowerCase();
    const resolvedLower = resolved.toLowerCase();
    if (assetPathSet.has(decodedLower)) return `${bookId}::${decodedLower}`;
    if (assetPathSet.has(resolvedLower)) return `${bookId}::${resolvedLower}`;

    // Fallback suffix/basename lookup when EPUB XHTML paths omit or alter parent directories
    const cleanFile = decodedLower.split('#')[0].split('?')[0];
    const fileName = cleanFile.split('/').pop() || '';
    if (fileName) {
      for (const candidate of assetPathSet) {
        if (candidate.endsWith(`/${cleanFile}`) || candidate === cleanFile) {
          return `${bookId}::${candidate}`;
        }
      }
      for (const candidate of assetPathSet) {
        if (candidate.endsWith(`/${fileName}`) || candidate === fileName) {
          return `${bookId}::${candidate}`;
        }
      }
    }
    return null;
  };

  // Strip event handlers & unsafe URLs, rewrite image sources to IndexedDB asset markers
  const allElements = [clone, ...Array.from(clone.querySelectorAll('*'))];
  for (const el of allElements) {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const val = attr.value.trim();
      if (name.startsWith('on') || val.toLowerCase().startsWith('javascript:')) {
        el.removeAttribute(attr.name);
        continue;
      }
      if (name === 'style') {
        // Keep clean layout styles only if harmless; strip absolute positioning that breaks mobile flow
        el.removeAttribute('style');
      }
    }

    const tag = el.tagName.toLowerCase();
    if (tag === 'img') {
      const src = el.getAttribute('src') || '';
      const assetKey = findAssetKey(src);
      if (assetKey) {
        el.setAttribute('data-ebook-asset', assetKey);
        el.removeAttribute('src');
      } else if (!src.startsWith('data:')) {
        el.removeAttribute('src');
      }
    } else if (tag === 'image') {
      // SVG <image xlink:href="...">
      const href = el.getAttribute('href') || el.getAttribute('xlink:href') || '';
      const assetKey = findAssetKey(href);
      if (assetKey) {
        el.setAttribute('data-ebook-asset', assetKey);
      }
    }
  }

  return clone.innerHTML.trim();
}

function extractReadableTextFromRoot(root: Element): string {
  const clone = root.cloneNode(true) as Element;
  clone.querySelectorAll('script, style, svg, noscript, meta, link').forEach((el) => el.remove());

  const blockTags = new Set([
    'p', 'div', 'section', 'article', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'pre', 'tr', 'dt', 'dd', 'figcaption',
  ]);

  const lines: string[] = [];
  let buffer = '';

  const flushBuffer = () => {
    const trimmed = buffer.replace(/\s+/g, ' ').trim();
    if (trimmed) lines.push(trimmed);
    buffer = '';
  };

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      buffer += node.textContent || '';
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    if (tag === 'br') {
      flushBuffer();
      return;
    }

    const isBlock = blockTags.has(tag);
    if (isBlock) flushBuffer();

    if (tag === 'tr') {
      const cells = Array.from(el.children)
        .map((c) => (c.textContent || '').replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      if (cells.length > 0) {
        lines.push(cells.join(' | '));
      }
      return;
    }

    for (const child of Array.from(el.childNodes)) {
      walk(child);
    }

    if (isBlock) flushBuffer();
  };

  walk(clone);
  flushBuffer();

  return lines.join('\n\n').trim();
}

function hasVisualMedia(htmlContent: string): boolean {
  return (
    htmlContent.includes('data-ebook-asset=') ||
    htmlContent.includes('<img') ||
    htmlContent.includes('<svg') ||
    htmlContent.includes('<table')
  );
}

function splitHtmlByHeadings(
  htmlText: string,
  fallbackTitle: string,
  sourcePath: string,
  bookId: string,
  assetPathSet?: Set<string>
): Array<{ title: string; content: string; htmlContent: string }> {
  const doc = parseHtmlDoc(htmlText);
  const body = doc.body || doc.documentElement;
  if (!body) return [];

  const clone = body.cloneNode(true) as Element;
  clone.querySelectorAll('script, style, noscript').forEach((el) => el.remove());

  const headings = Array.from(clone.querySelectorAll('h1, h2'));
  if (headings.length <= 1) {
    const text = extractReadableTextFromRoot(clone);
    const rich = sanitizeRichHtml(clone, sourcePath, bookId, assetPathSet);
    return text || hasVisualMedia(rich)
      ? [{ title: cleanTitle(headings[0]?.textContent, fallbackTitle), content: text, htmlContent: rich }]
      : [];
  }

  const sections: Array<{ title: string; nodes: Node[] }> = [];
  let currentTitle = fallbackTitle;
  let currentNodes: Node[] = [];
  const headingSet = new Set<Element>(headings);

  const collectLeaves = (container: Element) => {
    for (const child of Array.from(container.childNodes)) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        if (headingSet.has(el)) {
          if (currentNodes.length > 0) {
            sections.push({ title: currentTitle, nodes: currentNodes });
          }
          currentTitle = cleanTitle(el.textContent, fallbackTitle);
          currentNodes = [];
          continue;
        }
        if (el.querySelector('h1, h2')) {
          collectLeaves(el);
          continue;
        }
      }
      currentNodes.push(child);
    }
  };

  collectLeaves(clone);
  if (currentNodes.length > 0) {
    sections.push({ title: currentTitle, nodes: currentNodes });
  }

  const results: Array<{ title: string; content: string; htmlContent: string }> = [];
  for (const sec of sections) {
    const wrapper = doc.createElement('div');
    sec.nodes.forEach((n) => wrapper.appendChild(n.cloneNode(true)));
    const text = extractReadableTextFromRoot(wrapper);
    const rich = sanitizeRichHtml(wrapper, sourcePath, bookId, assetPathSet);
    if (text || hasVisualMedia(rich)) {
      results.push({ title: sec.title, content: text, htmlContent: rich });
    }
  }

  if (results.length === 0) {
    const full = extractReadableTextFromRoot(clone);
    const rich = sanitizeRichHtml(clone, sourcePath, bookId, assetPathSet);
    if (full || hasVisualMedia(rich)) {
      return [{ title: fallbackTitle, content: full, htmlContent: rich }];
    }
  }
  return results;
}

function sliceHtmlByFragments(
  htmlText: string,
  orderedFragments: Array<string | undefined>,
  sourcePath: string,
  bookId: string,
  assetPathSet?: Set<string>
): Array<{ content: string; htmlContent: string }> {
  const doc = parseHtmlDoc(htmlText);
  const body = doc.body || doc.documentElement;
  if (!body) return orderedFragments.map(() => ({ content: '', htmlContent: '' }));

  const uniqueValidFrags = orderedFragments.filter((f): f is string => Boolean(f));
  if (uniqueValidFrags.length === 0) {
    const whole = extractReadableTextFromRoot(body);
    const rich = sanitizeRichHtml(body, sourcePath, bookId, assetPathSet);
    return orderedFragments.map((_, idx) =>
      idx === 0 ? { content: whole, htmlContent: rich } : { content: '', htmlContent: '' }
    );
  }

  const fragToBucket = new Map<string, number>();
  orderedFragments.forEach((f, idx) => {
    if (f && !fragToBucket.has(f)) fragToBucket.set(f, idx);
  });

  const buckets: Node[][] = orderedFragments.map(() => []);
  let activeBucket = orderedFragments[0] === undefined ? 0 : -1;

  const walkAssign = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const id = el.getAttribute('id') || el.getAttribute('name');
      if (id && fragToBucket.has(id)) {
        activeBucket = fragToBucket.get(id)!;
      }
      const hasTargetDescendant = Array.from(fragToBucket.keys()).some((targetId) => {
        try {
          return Boolean(el.querySelector(`[id="${CSS.escape(targetId)}"], [name="${CSS.escape(targetId)}"]`));
        } catch {
          return false;
        }
      });
      if (hasTargetDescendant) {
        for (const child of Array.from(el.childNodes)) {
          walkAssign(child);
        }
        return;
      }
    }

    if (activeBucket >= 0) {
      buckets[activeBucket].push(node.cloneNode(true));
    }
  };

  for (const child of Array.from(body.childNodes)) {
    walkAssign(child);
  }

  const results = buckets.map((nodes) => {
    const wrapper = doc.createElement('div');
    nodes.forEach((n) => wrapper.appendChild(n));
    return {
      content: extractReadableTextFromRoot(wrapper),
      htmlContent: sanitizeRichHtml(wrapper, sourcePath, bookId, assetPathSet),
    };
  });

  if (results.every((r) => !r.content && !hasVisualMedia(r.htmlContent))) {
    const whole = extractReadableTextFromRoot(body);
    const rich = sanitizeRichHtml(body, sourcePath, bookId, assetPathSet);
    return orderedFragments.map((_, idx) =>
      idx === 0 ? { content: whole, htmlContent: rich } : { content: '', htmlContent: '' }
    );
  }

  return results;
}

interface RawTocNode {
  title: string;
  href: string;
  children: RawTocNode[];
}

function parseNavXhtmlToc(navHtml: string, navFilePath: string): RawTocNode[] {
  const doc = parseHtmlDoc(navHtml);
  const navs = Array.from(doc.querySelectorAll('nav'));
  const tocNav =
    navs.find((n) => {
      const typeAttr = n.getAttribute('epub:type') || n.getAttribute('type') || '';
      return typeAttr.toLowerCase().includes('toc');
    }) || navs.find((n) => Boolean(n.querySelector('ol')));

  if (!tocNav) return [];
  const rootOl = tocNav.querySelector('ol');
  if (!rootOl) return [];

  const parseOl = (ol: Element): RawTocNode[] => {
    const items: RawTocNode[] = [];
    for (const li of Array.from(ol.children)) {
      if (li.tagName.toLowerCase() !== 'li') continue;
      const anchor = Array.from(li.children).find((c) => c.tagName.toLowerCase() === 'a')
        || li.querySelector('a');
      const span = Array.from(li.children).find((c) => c.tagName.toLowerCase() === 'span');
      const rawTitle = anchor?.textContent || span?.textContent || '';
      const rawHref = anchor?.getAttribute('href') || '';
      const childOl = Array.from(li.children).find((c) => c.tagName.toLowerCase() === 'ol');
      const children = childOl ? parseOl(childOl) : [];

      const resolvedHref = rawHref
        ? `${resolveRelativePath(navFilePath, rawHref)}${extractFragment(rawHref) ? '#' + extractFragment(rawHref) : ''}`
        : '';

      if (rawTitle.trim() || children.length > 0) {
        items.push({
          title: cleanTitle(rawTitle, 'سرفصل'),
          href: resolvedHref,
          children,
        });
      }
    }
    return items;
  };

  return parseOl(rootOl);
}

function parseNcxToc(ncxXml: string, ncxFilePath: string): RawTocNode[] {
  const doc = parseXmlDoc(ncxXml);
  const navMap = getElementsByTagLocalName(doc, 'navMap')[0];
  if (!navMap) return [];

  const parseNavPoints = (parent: Element): RawTocNode[] => {
    const result: RawTocNode[] = [];
    for (const child of Array.from(parent.children)) {
      const local = (child.localName || child.tagName.split(':').pop() || '').toLowerCase();
      if (local !== 'navpoint') continue;

      const labelEl = getElementsByTagLocalName(child, 'text')[0];
      const contentEl = Array.from(child.children).find(
        (c) => (c.localName || c.tagName.split(':').pop() || '').toLowerCase() === 'content'
      );
      const rawSrc = contentEl?.getAttribute('src') || '';
      const resolvedHref = rawSrc
        ? `${resolveRelativePath(ncxFilePath, rawSrc)}${extractFragment(rawSrc) ? '#' + extractFragment(rawSrc) : ''}`
        : '';

      const children = parseNavPoints(child);
      result.push({
        title: cleanTitle(labelEl?.textContent, 'سرفصل'),
        href: resolvedHref,
        children,
      });
    }
    return result;
  };

  return parseNavPoints(navMap);
}

function guessImageMime(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.bmp')) return 'image/bmp';
  return 'application/octet-stream';
}

async function parseEpub(
  file: File,
  onProgress: (p: ParseProgress) => void
): Promise<ParseEbookResult> {
  const bookId = createId('book');
  onProgress({ stage: 'در حال باز کردن فایل EPUB...', percent: 8 });
  const zip = await JSZip.loadAsync(file);

  // Extract embedded image assets so diagrams, photos, and algorithms render accurately
  const assets: StoredAsset[] = [];
  const assetPathSet = new Set<string>();
  const zipKeys = Object.keys(zip.files);

  onProgress({ stage: 'در حال استخراج تصاویر و نمودارهای کتاب...', percent: 16 });
  for (let kIdx = 0; kIdx < zipKeys.length; kIdx++) {
    const key = zipKeys[kIdx];
    const entry = zip.files[key];
    if (entry.dir) continue;
    if (/\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(key)) {
      const normalizedKey = key.replace(/^\/+/, '').toLowerCase();
      const rawBytes = await entry.async('uint8array');
      const blob = new Blob([rawBytes as unknown as BlobPart], { type: guessImageMime(key) });
      assets.push({
        key: `${bookId}::${normalizedKey}`,
        bookId,
        blob,
      });
      assetPathSet.add(normalizedKey);
      if (assets.length % 30 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }

  const readZipText = async (targetPath: string): Promise<string | null> => {
    let clean = targetPath.replace(/^\/+/, '');
    try {
      clean = decodeURIComponent(clean);
    } catch {
      // keep raw
    }
    const exact = zip.file(clean) || zip.file(targetPath);
    if (exact) return exact.async('string');

    const lower = clean.toLowerCase();
    const matchedKey = zipKeys.find((k) => k.toLowerCase() === lower);
    if (matchedKey) return zip.files[matchedKey].async('string');
    return null;
  };

  const containerXml = await readZipText('META-INF/container.xml');
  let opfPath = '';
  if (containerXml) {
    const containerDoc = parseXmlDoc(containerXml);
    const rootfile = getElementsByTagLocalName(containerDoc, 'rootfile')[0];
    opfPath = rootfile?.getAttribute('full-path') || '';
  }

  if (!opfPath) {
    opfPath = zipKeys.find((k) => k.toLowerCase().endsWith('.opf')) || '';
  }
  if (!opfPath) {
    throw new Error('ساختار OPF در فایل EPUB یافت نشد.');
  }

  const opfXml = await readZipText(opfPath);
  if (!opfXml) {
    throw new Error('خواندن فایل مشخصات کتاب (OPF) ناموفق بود.');
  }

  const opfDoc = parseXmlDoc(opfXml);
  const titleEl = getElementsByTagLocalName(opfDoc, 'title')[0];
  const creatorEl = getElementsByTagLocalName(opfDoc, 'creator')[0];
  const languageEl = getElementsByTagLocalName(opfDoc, 'language')[0];

  const bookTitle = cleanTitle(titleEl?.textContent, cleanFileNameToTitle(file.name));
  const bookAuthor = creatorEl?.textContent?.trim() || undefined;
  const bookLanguage = languageEl?.textContent?.trim() || undefined;

  const manifestById = new Map<string, { href: string; mediaType: string; properties: string }>();
  for (const item of getElementsByTagLocalName(opfDoc, 'item')) {
    const id = item.getAttribute('id') || '';
    const rawHref = item.getAttribute('href') || '';
    const mediaType = item.getAttribute('media-type') || '';
    const properties = item.getAttribute('properties') || '';
    if (id && rawHref) {
      manifestById.set(id, {
        href: resolveRelativePath(opfPath, rawHref),
        mediaType,
        properties,
      });
    }
  }

  const spineEl = getElementsByTagLocalName(opfDoc, 'spine')[0];
  const spineFiles: string[] = [];
  for (const itemref of getElementsByTagLocalName(opfDoc, 'itemref')) {
    const idref = itemref.getAttribute('idref') || '';
    const entry = manifestById.get(idref);
    if (entry && (entry.mediaType.includes('html') || entry.href.match(/\.(x?html?|xml)$/i))) {
      spineFiles.push(entry.href);
    }
  }

  onProgress({ stage: 'در حال استخراج فهرست و سرفصل‌های کتاب...', percent: 28 });

  let tocNodes: RawTocNode[] = [];
  let tocSource: TocSource = 'toc';

  const navItem = Array.from(manifestById.values()).find((m) =>
    m.properties.split(/\s+/).includes('nav')
  );
  if (navItem) {
    const navContent = await readZipText(navItem.href);
    if (navContent) {
      tocNodes = parseNavXhtmlToc(navContent, navItem.href);
    }
  }

  if (tocNodes.length === 0) {
    const ncxId = spineEl?.getAttribute('toc') || '';
    const ncxItem =
      (ncxId ? manifestById.get(ncxId) : undefined) ||
      Array.from(manifestById.values()).find((m) => m.mediaType.includes('dtbncx') || m.href.endsWith('.ncx'));
    if (ncxItem) {
      const ncxContent = await readZipText(ncxItem.href);
      if (ncxContent) {
        tocNodes = parseNcxToc(ncxContent, ncxItem.href);
      }
    }
  }

  const htmlCache = new Map<string, string>();
  const getHtml = async (path: string): Promise<string> => {
    const cleanPath = path.split('#')[0];
    if (!cleanPath) return '';
    if (htmlCache.has(cleanPath)) return htmlCache.get(cleanPath)!;
    const text = (await readZipText(cleanPath)) || '';
    if (htmlCache.size >= 4) {
      const oldestKey = htmlCache.keys().next().value;
      if (oldestKey !== undefined) htmlCache.delete(oldestKey);
    }
    htmlCache.set(cleanPath, text);
    return text;
  };

  // Main topics ONLY: extract direct level-1 children under each chapter (no deep sub-topic splitting)
  const chapters: EbookChapter[] = [];

  if (tocNodes.length > 0) {
    interface FlatRef {
      chapterIdx: number;
      topicTitle: string;
      filePath: string;
      fragment?: string;
    }

    const chapterDrafts: Array<{ title: string; items: FlatRef[] }> = [];
    const seenHrefKeys = new Set<string>();

    tocNodes.forEach((chapNode, cIdx) => {
      const items: FlatRef[] = [];
      const addUniqueRef = (topicTitle: string, href: string) => {
        const fp = href.split('#')[0];
        if (!fp) return;
        const frag = extractFragment(href);
        const key = `${fp}#${frag || ''}`;
        if (seenHrefKeys.has(key)) return;
        seenHrefKeys.add(key);
        items.push({ chapterIdx: cIdx, topicTitle, filePath: fp, fragment: frag });
      };

      const mainChildren = chapNode.children.filter((child) => Boolean(child.href));

      if (mainChildren.length > 0) {
        if (chapNode.href && chapNode.href !== mainChildren[0].href) {
          addUniqueRef(chapNode.title, chapNode.href);
        }
        for (const child of mainChildren) {
          addUniqueRef(child.title, child.href);
        }
      } else if (chapNode.href) {
        addUniqueRef(chapNode.title, chapNode.href);
      }

      chapterDrafts.push({ title: chapNode.title, items });
    });

    const refsByFile = new Map<string, FlatRef[]>();
    for (const draft of chapterDrafts) {
      for (const item of draft.items) {
        if (!item.filePath) continue;
        const arr = refsByFile.get(item.filePath) || [];
        arr.push(item);
        refsByFile.set(item.filePath, arr);
      }
    }

    const resolvedContentByRef = new Map<
      FlatRef,
      Array<{ title: string; content: string; htmlContent: string }>
    >();
    const totalFiles = Math.max(1, refsByFile.size);
    let processedFiles = 0;

    for (const [filePath, refs] of refsByFile.entries()) {
      processedFiles++;
      onProgress({
        stage: `در حال خواندن و نمایه‌سازی بخش ${processedFiles} از ${totalFiles}...`,
        percent: 32 + Math.round((processedFiles / totalFiles) * 58),
      });

      const html = await getHtml(filePath);
      if (!html) continue;

      if (refs.length > 1) {
        const sliced = sliceHtmlByFragments(
          html,
          refs.map((r) => r.fragment),
          filePath,
          bookId,
          assetPathSet
        );
        refs.forEach((r, idx) => {
          const piece = sliced[idx];
          if (piece && (piece.content || hasVisualMedia(piece.htmlContent))) {
            resolvedContentByRef.set(r, [
              { title: r.topicTitle, content: piece.content, htmlContent: piece.htmlContent },
            ]);
          }
        });
      } else {
        const onlyRef = refs[0];
        const parentDraft = chapterDrafts[onlyRef.chapterIdx];
        if (parentDraft.items.length === 1) {
          const splitSections = splitHtmlByHeadings(
            html,
            onlyRef.topicTitle,
            filePath,
            bookId,
            assetPathSet
          );
          if (splitSections.length > 0) {
            resolvedContentByRef.set(onlyRef, splitSections);
          }
        } else {
          const doc = parseHtmlDoc(html);
          const body = doc.body || doc.documentElement;
          const text = extractReadableTextFromRoot(body);
          const rich = sanitizeRichHtml(body, filePath, bookId, assetPathSet);
          if (text || hasVisualMedia(rich)) {
            resolvedContentByRef.set(onlyRef, [
              { title: onlyRef.topicTitle, content: text, htmlContent: rich },
            ]);
          }
        }
      }
    }

    for (let i = 0; i < chapterDrafts.length; i++) {
      const draft = chapterDrafts[i];
      const topics: EbookTopic[] = [];
      for (const item of draft.items) {
        const resolved = resolvedContentByRef.get(item);
        if (!resolved) continue;
        for (const sec of resolved) {
          if (sec.content.trim() || hasVisualMedia(sec.htmlContent)) {
            topics.push(
              finalizeTopic(sec.title, sec.content, topics.length, undefined, undefined, sec.htmlContent)
            );
          }
        }
      }
      if (topics.length > 0) {
        chapters.push(finalizeChapter(draft.title, topics, chapters.length));
      }
    }
  }

  if (chapters.length === 0 && spineFiles.length > 0) {
    tocSource = 'headings';
    for (let i = 0; i < spineFiles.length; i++) {
      onProgress({
        stage: `در حال خواندن فایل ${i + 1} از ${spineFiles.length}...`,
        percent: 32 + Math.round(((i + 1) / spineFiles.length) * 58),
      });
      const filePath = spineFiles[i];
      const html = await getHtml(filePath);
      if (!html) continue;

      const doc = parseHtmlDoc(html);
      const h1 = doc.querySelector('h1')?.textContent || doc.querySelector('title')?.textContent;
      const chapTitle = cleanTitle(h1, `بخش ${i + 1}`);
      const splitSections = splitHtmlByHeadings(html, chapTitle, filePath, bookId, assetPathSet);
      if (splitSections.length > 0) {
        const topics = splitSections.map((s, idx) =>
          finalizeTopic(s.title, s.content, idx, undefined, undefined, s.htmlContent)
        );
        chapters.push(finalizeChapter(chapTitle, topics, chapters.length));
      }
    }
  }

  if (chapters.length === 0) {
    throw new Error('محتوای متنی قابل استخراجی در این فایل EPUB یافت نشد.');
  }

  onProgress({ stage: 'ذخیره‌سازی در کتابخانه...', percent: 95 });

  return {
    book: {
      id: bookId,
      title: bookTitle,
      author: bookAuthor,
      language: bookLanguage,
      dir: detectBookDirection(chapters, bookLanguage, bookTitle),
      format: 'epub',
      fileName: file.name,
      fileSize: file.size,
      tocSource,
      addedAt: Date.now(),
      schemaVersion: 2,
      chapters,
    },
    assets,
  };
}

interface PdfPageData {
  pageNumber: number;
  text: string;
  headingCandidates: Array<{ title: string; fontSize: number; lineIndex: number }>;
}

function isLikelyHeadingLine(line: string, fontSize: number, medianFontSize: number): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 3 || trimmed.length > 130) return false;
  if (/^\d+$/.test(trimmed)) return false;

  const numberedHeading = /^(chapter|part|section|unit|فصل|بخش|گفتار|مبحث)\s+[\d۰-۹IVXLCDM]+/i.test(trimmed);
  if (numberedHeading) return true;

  if (fontSize >= medianFontSize * 1.24 && trimmed.length >= 4 && trimmed.length <= 100) {
    return true;
  }

  return false;
}

async function parsePdf(
  file: File,
  onProgress: (p: ParseProgress) => void
): Promise<ParseEbookResult> {
  const bookId = createId('book');
  onProgress({ stage: 'در حال باز کردن فایل PDF...', percent: 8 });
  const { task: loadingTask, pdf } = await openPdfFromRangeReader(createBlobRangeReader(file));

  try {

  let metaTitle = '';
  let metaAuthor: string | undefined;
  try {
    const meta = await pdf.getMetadata();
    const info = meta?.info as Record<string, unknown> | undefined;
    if (info && typeof info.Title === 'string' && info.Title.trim()) {
      metaTitle = info.Title.trim();
    }
    if (info && typeof info.Author === 'string' && info.Author.trim()) {
      metaAuthor = info.Author.trim();
    }
  } catch {
    // Ignore metadata errors
  }

  const bookTitle = cleanTitle(metaTitle, cleanFileNameToTitle(file.name));
  const numPages = pdf.numPages;

  onProgress({ stage: 'در حال استخراج بوکمارک‌ها و فهرست کتاب...', percent: 15 });

  interface OutlineEntry {
    title: string;
    pageNumber: number;
    destPdfY: number | null;
    children: OutlineEntry[];
  }

  const resolveDestLocation = async (
    dest: unknown
  ): Promise<{ pageNumber: number; destPdfY: number | null } | null> => {
    try {
      let resolvedDest = dest;
      if (typeof dest === 'string') {
        resolvedDest = await pdf.getDestination(dest);
      }
      if (Array.isArray(resolvedDest) && resolvedDest[0]) {
        const ref = resolvedDest[0] as Parameters<typeof pdf.getPageIndex>[0];
        const pageIndex = await pdf.getPageIndex(ref);
        let destPdfY: number | null = null;
        const typeName =
          resolvedDest[1] && typeof resolvedDest[1] === 'object' && 'name' in resolvedDest[1]
            ? String((resolvedDest[1] as { name?: string }).name || '')
            : '';
        if (typeName === 'XYZ' && typeof resolvedDest[3] === 'number') {
          destPdfY = resolvedDest[3];
        } else if ((typeName === 'FitH' || typeName === 'FitBH') && typeof resolvedDest[2] === 'number') {
          destPdfY = resolvedDest[2];
        }
        return { pageNumber: pageIndex + 1, destPdfY };
      }
    } catch {
      // Ignore unresolvable bookmark destination
    }
    return null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertOutlineNodes = async (nodes: any[]): Promise<OutlineEntry[]> => {
    const out: OutlineEntry[] = [];
    for (const node of nodes) {
      const loc = await resolveDestLocation(node.dest);
      const children = node.items && node.items.length > 0 ? await convertOutlineNodes(node.items) : [];
      if (loc !== null || children.length > 0) {
        out.push({
          title: cleanTitle(node.title, 'بخش'),
          pageNumber: loc?.pageNumber ?? children[0]?.pageNumber ?? 1,
          destPdfY: loc?.destPdfY ?? children[0]?.destPdfY ?? null,
          children,
        });
      }
    }
    return out;
  };

  let rawOutline: OutlineEntry[] = [];
  try {
    const outline = await pdf.getOutline();
    if (outline && outline.length > 0) {
      rawOutline = await convertOutlineNodes(outline);
    }
  } catch {
    // Ignore outline failure
  }

  // Unwrap Part/Section containers (e.g. "Part I: Concepts" -> [Chapter 1, Chapter 2...]) so chapters map accurately
  if (
    rawOutline.length > 0 &&
    rawOutline.length <= 12 &&
    rawOutline.some((n) => n.children.length >= 2 && /^(part|section|unit|volume|book|بخش|جلد|فصل)\b/i.test(n.title))
  ) {
    const unwrapped: OutlineEntry[] = [];
    for (const node of rawOutline) {
      if (node.children.length >= 2) {
        unwrapped.push(...node.children);
      } else {
        unwrapped.push(node);
      }
    }
    if (unwrapped.length >= rawOutline.length) {
      rawOutline = unwrapped;
    }
  }

  interface PdfRawLine {
    text: string;
    fontSize: number;
    isBold: boolean;
    y: number;
    viewportY: number;
  }

  interface PdfPageBlock {
    text: string;
    viewportY: number;
  }

  const rawPages: Array<{
    pageNumber: number;
    pageHeight: number;
    viewportTransform: number[];
    lines: PdfRawLine[];
  }> = [];
  const bodySizeWeights = new Map<number, number>();
  const allSizeWeights = new Map<number, number>();

  for (let p = 1; p <= numPages; p++) {
    if (p === 1 || p % 5 === 0 || p === numPages) {
      onProgress({
        stage: `در حال پردازش صفحه ${p} از ${numPages}...`,
        percent: 18 + Math.round((p / numPages) * 68),
      });
    }

    const page = await pdf.getPage(p);
    try {
      const viewport = page.getViewport({ scale: 1 });
      const vt = viewport.transform;
      const textContent = await page.getTextContent({ includeMarkedContent: false });
      const styles = (textContent as { styles?: Record<string, { fontFamily?: string }> }).styles || {};

      const lineBuckets: PdfRawLine[] = [];
      let currentLine = '';
      let currentLineMaxFont = 10;
      let currentLineBoldChars = 0;
      let currentLineTotalChars = 0;
      let currentLineY = 0;
      let lastY: number | null = null;
      let lastEndX: number | null = null;

      const toViewportY = (pdfY: number): number => {
        const pt = [0, pdfY];
        pdfjsLib.Util.applyTransform(pt, vt);
        return pt[1];
      };

      const pushCurrentLine = () => {
        const cleaned = cleanBrokenHyphens(currentLine).trim();
        if (cleaned) {
          lineBuckets.push({
            text: cleaned,
            fontSize: currentLineMaxFont,
            isBold: currentLineTotalChars > 0 && currentLineBoldChars >= currentLineTotalChars * 0.55,
            y: currentLineY,
            viewportY: toViewportY(currentLineY),
          });
          if (cleaned.length >= 22) {
            bodySizeWeights.set(
              currentLineMaxFont,
              (bodySizeWeights.get(currentLineMaxFont) || 0) + cleaned.length
            );
          }
        }
        currentLine = '';
        currentLineMaxFont = 10;
        currentLineBoldChars = 0;
        currentLineTotalChars = 0;
        lastEndX = null;
      };

      for (const rawItem of textContent.items) {
        if (!('str' in rawItem)) continue;
        const item = rawItem as {
          str: string;
          transform: number[];
          width?: number;
          fontName?: string;
          hasEOL?: boolean;
        };
        const str = item.str;
        const fontSize = Math.max(
          6,
          Math.round(Math.hypot(item.transform?.[0] || 0, item.transform?.[1] || 0) || 10)
        );
        const x = item.transform?.[4] ?? 0;
        const y = item.transform?.[5] ?? 0;
        const itemWidth = item.width ?? 0;
        const fontMeta = `${item.fontName || ''} ${styles[item.fontName || '']?.fontFamily || ''}`.toLowerCase();
        const isItemBold = /bold|black|heavy|demi|semibold|medi/.test(fontMeta);

        if (lastY !== null && Math.abs(y - lastY) > fontSize * 0.55) {
          pushCurrentLine();
          currentLine = str;
          currentLineMaxFont = fontSize;
          currentLineY = y;
        } else {
          if (!currentLine) currentLineY = y;
          const xGap = lastEndX !== null ? x - lastEndX : 999;
          const glueRightAfterHyphen = currentLine.endsWith('-') && /^[A-Za-z]/.test(str) && xGap < fontSize * 0.35;
          const gluePunctuation = /^[-–—,.;:)\]]/.test(str) && xGap < fontSize * 0.3;
          const needsSpace =
            currentLine.length > 0 &&
            str.length > 0 &&
            !currentLine.endsWith(' ') &&
            !str.startsWith(' ') &&
            !glueRightAfterHyphen &&
            !gluePunctuation &&
            xGap > fontSize * 0.14;
          if (needsSpace) {
            currentLine += ' ';
          }
          currentLine += str;
          if (fontSize > currentLineMaxFont) currentLineMaxFont = fontSize;
        }

        const trimmedLen = str.trim().length;
        if (trimmedLen > 0) {
          allSizeWeights.set(fontSize, (allSizeWeights.get(fontSize) || 0) + trimmedLen);
          currentLineTotalChars += trimmedLen;
          if (isItemBold) currentLineBoldChars += trimmedLen;
        }
        lastY = y;
        lastEndX = x + itemWidth;

        if (item.hasEOL) {
          pushCurrentLine();
          lastY = null;
        }
      }

      pushCurrentLine();

      rawPages.push({
        pageNumber: p,
        pageHeight: viewport.height,
        viewportTransform: [vt[0], vt[1], vt[2], vt[3], vt[4], vt[5]],
        lines: lineBuckets,
      });
    } finally {
      try {
        page.cleanup();
      } catch {
        // ignore page cleanup error
      }
    }

    if (p % 40 === 0) {
      await pdf.cleanup().catch(() => {});
      await new Promise((r) => setTimeout(r, 0));
    } else if (p % 15 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  onProgress({ stage: 'در حال دسته‌بندی سرفصل‌ها و تاپیک‌های اصلی...', percent: 90 });

  let medianFontSize = 11;
  const targetWeightMap = bodySizeWeights.size > 0 ? bodySizeWeights : allSizeWeights;
  if (targetWeightMap.size > 0) {
    let bestSize = 11;
    let bestWeight = -1;
    for (const [sz, w] of targetWeightMap.entries()) {
      if (w > bestWeight) {
        bestWeight = w;
        bestSize = sz;
      }
    }
    medianFontSize = bestSize;
  }

  const bulletLineRegex = /^(?:[•●▪▸‣\-–—*]|(?:\d+|[۰-۹]+)[.)])\s+/;
  const terminalPunctRegex = /[.!؟?:»"')\]…]$/;
  const knownClinicalHeadingRegex = /^(?:FOUNDATIONS|EPIDEMIOLOGY|PATHOPHYSIOLOGY|ANATOMY(?:\s+AND\s+PATHOPHYSIOLOGY)?|ETIOLOGY|CLINICAL FEATURES|CLINICAL PRESENTATION|DIAGNOSTIC STRATEGIES|DIAGNOSIS|DIFFERENTIAL DIAGNOSIS|MANAGEMENT|TREATMENT|DISPOSITION|SUMMARY|Epidemiology|Pathophysiology|Pathogenesis|Anatomy|Etiology|Clinical Features|Clinical Presentation|History|Physical Examination|Diagnostic Strategies|Diagnostic Testing|Laboratory Testing|Imaging|Differential Diagnosis|Management|Treatment|Disposition|Complications|Prognosis|پاتوفیزیولوژی|علائم بالینی|علایم بالینی|تظاهرات بالینی|ارزیابی تشخیصی|تشخیص|تشخیص افتراقی|درمان|منیجمنت|دیسپوزیشن|تعیین تکلیف)$/i;

  const isStandalonePdfHeading = (line: PdfRawLine): 'h2' | 'h3' | null => {
    const txt = line.text.trim();
    if (txt.length < 3 || txt.length > 95) return null;
    if (/^\d+$/.test(txt)) return null;
    if (/^(?:fig\.?|figure|table|box|algorithm|شکل|جدول|نمودار)\s+\d+/i.test(txt)) return null;
    if (terminalPunctRegex.test(txt) && txt.length > 42) return null;
    if (bulletLineRegex.test(txt)) return null;
    if (/[.!؟]\s+[A-Z\u0600-\u06FF]/.test(txt) && !/^(?:\d+|[۰-۹]+)\.\s+/.test(txt)) return null;

    if (line.fontSize >= medianFontSize * 1.28) return 'h2';
    if (knownClinicalHeadingRegex.test(txt)) return 'h2';
    if (
      txt.length >= 4 &&
      txt.length <= 60 &&
      /^[A-Z][A-Z\s\-/&()0-9]+$/.test(txt) &&
      /[A-Z]{3,}/.test(txt)
    ) {
      return 'h2';
    }
    if ((line.fontSize >= medianFontSize * 1.12 || line.isBold) && txt.length <= 75 && !/[.,;]$/.test(txt)) {
      return 'h3';
    }
    return null;
  };

  // Build normalized top/bottom edge signature counts across pages to catch textbook running headers/footers
  const normalizeEdgeSig = (txt: string): string =>
    txt
      .replace(/[\d۰-۹]+/g, '#')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  const edgeSigCounts = new Map<string, number>();
  if (rawPages.length >= 2) {
    for (const rp of rawPages) {
      const seenOnPage = new Set<string>();
      for (let li = 0; li < rp.lines.length; li++) {
        const line = rp.lines[li];
        const inTopBand = line.viewportY <= rp.pageHeight * 0.13 || li <= 1;
        const inBottomBand = line.viewportY >= rp.pageHeight * 0.87 || li >= rp.lines.length - 2;
        if (!inTopBand && !inBottomBand) continue;
        const txt = line.text.trim();
        if (txt.length < 4 || txt.length > 100) continue;
        if (knownClinicalHeadingRegex.test(txt)) continue;
        const sig = normalizeEdgeSig(txt);
        if (sig.length >= 4 && !seenOnPage.has(sig)) {
          seenOnPage.add(sig);
          edgeSigCounts.set(sig, (edgeSigCounts.get(sig) || 0) + 1);
        }
      }
    }
  }

  const reflowPdfLinesToBlocks = (
    pageHeight: number,
    lines: PdfRawLine[]
  ): PdfPageBlock[] => {
    const blocks: PdfPageBlock[] = [];
    let currentPara = '';
    let currentParaY = 0;
    let prevLine: PdfRawLine | null = null;

    const flushCurrentPara = () => {
      const cleaned = cleanBrokenHyphens(currentPara).trim();
      if (cleaned && !isRunningHeaderOrFooterLine(cleaned)) {
        blocks.push({ text: cleaned, viewportY: currentParaY });
      }
      currentPara = '';
    };

    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];
      const txt = line.text.trim();
      if (!txt) continue;

      const inTopEdge = line.viewportY <= pageHeight * 0.13 || li <= 1;
      const inBottomEdge = line.viewportY >= pageHeight * 0.87 || li >= lines.length - 2;

      // 1. Always skip explicit running headers/footers & standalone page numbers
      if (isRunningHeaderOrFooterLine(txt)) {
        continue;
      }

      // 2. Skip repeating running headers/footers detected at page top/bottom margin bands
      if (inTopEdge || inBottomEdge) {
        const sig = normalizeEdgeSig(txt);
        const freq = edgeSigCounts.get(sig) || 0;
        if (freq >= 2 && !knownClinicalHeadingRegex.test(txt)) {
          continue;
        }
        // Skip "509 Some Chapter Running Header" at top/bottom band
        if (
          (/^\d{1,4}\s+[A-Z\u0600-\u06FF].{2,65}$/.test(txt) ||
            /^[A-Z\u0600-\u06FF].{2,65}\s+\d{1,4}$/.test(txt)) &&
          !/^(?:fig\.?|figure|table|box|algorithm|شکل|جدول)\s+\d+/i.test(txt)
        ) {
          continue;
        }
      }

      // 3. Skip small-font footnotes anchored at bottom margin
      if (
        line.viewportY >= pageHeight * 0.85 &&
        line.fontSize < medianFontSize &&
        (/^[*†‡§∗]/.test(txt) || /^\d{1,2}\s+[A-Z]/.test(txt))
      ) {
        continue;
      }

      const headingLevel = isStandalonePdfHeading(line);
      if (headingLevel) {
        flushCurrentPara();
        blocks.push({
          text: headingLevel === 'h2' ? `[[H2:${txt}]]` : `[[H3:${txt}]]`,
          viewportY: line.viewportY,
        });
        prevLine = line;
        continue;
      }

      const isBullet = bulletLineRegex.test(txt);
      const yGap = prevLine ? Math.abs(prevLine.y - line.y) : 0;
      const lineSpacingThreshold = Math.max(medianFontSize, line.fontSize) * 1.75;
      const hasLargeVerticalGap = prevLine !== null && yGap > lineSpacingThreshold;
      const prevShortSentenceEnd =
        prevLine !== null &&
        prevLine.text.length < 56 &&
        terminalPunctRegex.test(prevLine.text.trim());

      const startNewParagraph =
        !currentPara ||
        isBullet ||
        hasLargeVerticalGap ||
        prevShortSentenceEnd;

      if (startNewParagraph) {
        flushCurrentPara();
        currentPara = txt;
        currentParaY = line.viewportY;
      } else if (/[A-Za-z]-$/.test(currentPara) && /^[A-Za-z]/.test(txt)) {
        // De-hyphenate wrapped English words unless true compound prefix
        const match = currentPara.match(/([A-Za-z]+)-$/);
        const prefixWord = match ? match[1].toLowerCase() : '';
        if (prefixWord && KEEP_HYPHEN_PREFIXES.has(prefixWord)) {
          currentPara = `${currentPara}${txt}`;
        } else {
          currentPara = `${currentPara.slice(0, -1)}${txt}`;
        }
      } else {
        currentPara = `${currentPara} ${txt}`;
      }

      prevLine = line;
    }

    flushCurrentPara();

    return blocks;
  };

  const pageBlocksByPage: PdfPageBlock[][] = [];
  const pageTransforms: number[][] = [];
  const pages: PdfPageData[] = [];
  const collectFallbackHeadingCandidates = rawOutline.length === 0;

  for (let i = 0; i < rawPages.length; i++) {
    const rp = rawPages[i];
    pageBlocksByPage.push(reflowPdfLinesToBlocks(rp.pageHeight, rp.lines));
    pageTransforms.push(rp.viewportTransform);
    if (collectFallbackHeadingCandidates) {
      pages.push({
        pageNumber: rp.pageNumber,
        text: '',
        headingCandidates: rp.lines.slice(0, 6).map((l, lIdx) => ({
          title: l.text,
          fontSize: l.fontSize,
          lineIndex: lIdx,
        })),
      });
    }
    // Drop heavy per-page raw line arrays as soon as reflowed to keep heap minimal
    rp.lines = [];
  }
  rawPages.length = 0;

  // Strict monotonic cursor over [pageIdx, blockIdx] so NO block or page can ever repeat
  interface DocCursor {
    pageIdx: number; // 0-based
    blockIdx: number; // 0-based
  }

  const compareCursors = (a: DocCursor, b: DocCursor): number =>
    a.pageIdx !== b.pageIdx ? a.pageIdx - b.pageIdx : a.blockIdx - b.blockIdx;

  const endOfDocCursor: DocCursor = {
    pageIdx: Math.max(0, numPages - 1),
    blockIdx: pageBlocksByPage[Math.max(0, numPages - 1)]?.length ?? 0,
  };

  const applyPdfYToViewport = (pIdx: number, pdfY: number): number => {
    const vt = pageTransforms[pIdx];
    if (!vt) return 0;
    const pt = [0, pdfY];
    pdfjsLib.Util.applyTransform(pt, vt);
    return pt[1];
  };

  const resolveCursorForOutline = (
    pageNumber: number,
    destPdfY: number | null,
    headingTitle: string,
    minCursor: DocCursor
  ): DocCursor => {
    const pIdx = Math.max(0, Math.min(numPages - 1, pageNumber - 1));
    const blocks = pageBlocksByPage[pIdx] || [];
    let bIdx = 0;

    // 1. Try matching heading text on the target page for exact intra-page split
    const cleanTarget = normalizeSearchText(headingTitle);
    const unnumberedTarget = cleanTarget.replace(/^(?:chapter|part|section)?\s*\d+(?:\.\d+)*\s*[:.\-]?\s*/i, '').trim();
    if (cleanTarget.length >= 3) {
      const foundIdx = blocks.findIndex((blk) => {
        const plainBlk = normalizeSearchText(stripFigureTokens(blk.text));
        if (
          plainBlk === cleanTarget ||
          (plainBlk.length <= cleanTarget.length + 12 && plainBlk.includes(cleanTarget))
        ) {
          return true;
        }
        if (
          unnumberedTarget.length >= 3 &&
          (plainBlk === unnumberedTarget ||
            (plainBlk.length <= unnumberedTarget.length + 12 && plainBlk.includes(unnumberedTarget)))
        ) {
          return true;
        }
        return false;
      });
      if (foundIdx !== -1) {
        bIdx = foundIdx;
      } else if (destPdfY !== null && pageTransforms[pIdx]) {
        // 2. Fallback to bookmark vertical Y coordinate converted to viewport coordinates
        const targetVy = applyPdfYToViewport(pIdx, destPdfY);
        const yIdx = blocks.findIndex((blk) => blk.viewportY >= targetVy - 14);
        if (yIdx !== -1) bIdx = yIdx;
      }
    } else if (destPdfY !== null && pageTransforms[pIdx]) {
      const targetVy = applyPdfYToViewport(pIdx, destPdfY);
      const yIdx = blocks.findIndex((blk) => blk.viewportY >= targetVy - 14);
      if (yIdx !== -1) bIdx = yIdx;
    }

    const candidate: DocCursor = { pageIdx: pIdx, blockIdx: bIdx };
    return compareCursors(candidate, minCursor) < 0 ? minCursor : candidate;
  };

  const isSpecialBlock = (t: string) =>
    /^\[\[PDF_FIG:/.test(t) || /^\[\[H[23]:/.test(t);

  const appendBlockSmartly = (parts: string[], txt: string) => {
    if (!txt) return;
    const prev = parts[parts.length - 1];
    if (
      prev &&
      !isSpecialBlock(prev) &&
      !isSpecialBlock(txt) &&
      !/[.!؟?:»"')\]…]$/.test(prev) &&
      /^[a-z,;(\[]/.test(txt)
    ) {
      if (/[A-Za-z]-$/.test(prev) && /^[a-z]/.test(txt)) {
        parts[parts.length - 1] = cleanBrokenHyphens(`${prev} ${txt}`);
      } else {
        parts[parts.length - 1] = `${prev} ${txt}`;
      }
      return;
    }
    parts.push(txt);
  };

  const extractBetweenCursors = (start: DocCursor, end: DocCursor): string => {
    if (compareCursors(start, end) >= 0) return '';
    const parts: string[] = [];
    for (let pIdx = start.pageIdx; pIdx <= end.pageIdx && pIdx < pageBlocksByPage.length; pIdx++) {
      const blocks = pageBlocksByPage[pIdx] || [];
      const fromB = pIdx === start.pageIdx ? start.blockIdx : 0;
      const toB = pIdx === end.pageIdx ? end.blockIdx : blocks.length;
      for (let bi = fromB; bi < toB && bi < blocks.length; bi++) {
        if (blocks[bi].text) appendBlockSmartly(parts, blocks[bi].text);
      }
    }
    return parts.join('\n\n');
  };

  const getPageRangeText = (startPage: number, endPage: number): string => {
    const s = Math.max(1, startPage);
    const e = Math.min(numPages, Math.max(s, endPage));
    const parts: string[] = [];
    for (let p = s; p <= e; p++) {
      const blocks = pageBlocksByPage[p - 1] || [];
      for (const b of blocks) {
        if (b.text) appendBlockSmartly(parts, b.text);
      }
    }
    return parts.join('\n\n');
  };

  const chapters: EbookChapter[] = [];
  let tocSource: TocSource = 'outline';

  if (rawOutline.length > 0) {
    // Strictly partition pages/blocks monotonically across Chapters and Main Topics (zero duplicates)
    let globalCursor: DocCursor = { pageIdx: 0, blockIdx: 0 };

    for (let cIdx = 0; cIdx < rawOutline.length; cIdx++) {
      const chapNode = rawOutline[cIdx];
      const nextChap = rawOutline[cIdx + 1];

      const chapStartCursor = resolveCursorForOutline(
        chapNode.pageNumber,
        chapNode.destPdfY,
        chapNode.title,
        globalCursor
      );
      const chapEndCursor = nextChap
        ? resolveCursorForOutline(nextChap.pageNumber, nextChap.destPdfY, nextChap.title, chapStartCursor)
        : endOfDocCursor;

      const chapStartPage = chapStartCursor.pageIdx + 1;
      const chapEndPage = Math.max(
        chapStartPage,
        chapEndCursor.blockIdx === 0 && chapEndCursor.pageIdx > chapStartCursor.pageIdx
          ? chapEndCursor.pageIdx
          : chapEndCursor.pageIdx + 1
      );

      // Direct level-1 children ONLY (Main Topics only)
      const mainTopics = chapNode.children.map((n) => ({
        title: n.title,
        pageNumber: n.pageNumber,
        destPdfY: n.destPdfY,
      }));

      const topics: EbookTopic[] = [];

      if (mainTopics.length > 0) {
        let localCursor = chapStartCursor;
        const topicCursors: Array<{ title: string; start: DocCursor }> = [];

        for (const mt of mainTopics) {
          const mtCursor = resolveCursorForOutline(mt.pageNumber, mt.destPdfY, mt.title, localCursor);
          const bounded =
            compareCursors(mtCursor, chapEndCursor) > 0 ? chapEndCursor : mtCursor;
          topicCursors.push({ title: mt.title, start: bounded });
          localCursor = bounded;
        }

        // Intro text before first topic (only if non-empty and before firstTopic start)
        if (compareCursors(chapStartCursor, topicCursors[0].start) < 0) {
          const introText = extractBetweenCursors(chapStartCursor, topicCursors[0].start);
          if (introText.trim()) {
            const iStartP = chapStartCursor.pageIdx + 1;
            const iEndP = Math.max(iStartP, topicCursors[0].start.pageIdx + 1);
            topics.push(finalizeTopic(chapNode.title, introText, topics.length, iStartP, iEndP));
          }
        }

        for (let tIdx = 0; tIdx < topicCursors.length; tIdx++) {
          const curT = topicCursors[tIdx];
          const nextT = topicCursors[tIdx + 1];
          const endT = nextT ? nextT.start : chapEndCursor;
          const tText = extractBetweenCursors(curT.start, endT);
          if (!tText.trim()) continue;

          const tStartP = curT.start.pageIdx + 1;
          const tEndP = Math.max(
            tStartP,
            endT.blockIdx === 0 && endT.pageIdx > curT.start.pageIdx ? endT.pageIdx : endT.pageIdx + 1
          );
          topics.push(finalizeTopic(curT.title, tText, topics.length, tStartP, tEndP));
        }
      } else {
        const chapText = extractBetweenCursors(chapStartCursor, chapEndCursor);
        if (chapText.trim()) {
          topics.push(finalizeTopic(chapNode.title, chapText, 0, chapStartPage, chapEndPage));
        }
      }

      if (topics.length > 0) {
        chapters.push(finalizeChapter(chapNode.title, topics, chapters.length, chapStartPage, chapEndPage));
      }

      globalCursor = chapEndCursor;
    }
  }

  if (chapters.length === 0) {
    const detectedChapters: Array<{ title: string; startPage: number }> = [];
    for (const page of pages) {
      const topHeading = page.headingCandidates.find((c, idx) =>
        idx < 6 && isLikelyHeadingLine(c.title, c.fontSize, medianFontSize)
      );
      if (topHeading) {
        const last = detectedChapters[detectedChapters.length - 1];
        if (!last || (page.pageNumber - last.startPage >= 1 && last.title !== topHeading.title)) {
          detectedChapters.push({ title: topHeading.title, startPage: page.pageNumber });
        }
      }
    }

    if (detectedChapters.length >= 2) {
      tocSource = 'headings';
      for (let i = 0; i < detectedChapters.length; i++) {
        const cur = detectedChapters[i];
        const next = detectedChapters[i + 1];
        const start = cur.startPage;
        const end = next ? Math.max(start, next.startPage - 1) : numPages;
        const txt = getPageRangeText(start, end);
        if (txt.trim()) {
          chapters.push(
            finalizeChapter(
              cur.title,
              [finalizeTopic(cur.title, txt, 0, start, end)],
              chapters.length,
              start,
              end
            )
          );
        }
      }
    } else {
      tocSource = 'pages';
      const chunkSize = Math.max(10, Math.min(20, Math.ceil(numPages / 8)));
      for (let start = 1; start <= numPages; start += chunkSize) {
        const end = Math.min(numPages, start + chunkSize - 1);
        const txt = getPageRangeText(start, end);
        if (txt.trim()) {
          const title = start === end ? `صفحه ${start}` : `بخش ${chapters.length + 1} (صفحات ${start} تا ${end})`;
          chapters.push(
            finalizeChapter(
              title,
              [finalizeTopic(title, txt, 0, start, end)],
              chapters.length,
              start,
              end
            )
          );
        }
      }
    }
  }

  onProgress({ stage: 'ذخیره‌سازی فایل کتاب در کتابخانه...', percent: 94 });

  return {
    book: {
      id: bookId,
      title: bookTitle,
      author: metaAuthor,
      dir: detectBookDirection(chapters, undefined, bookTitle),
      format: 'pdf',
      fileName: file.name,
      fileSize: file.size,
      totalPages: numPages,
      tocSource,
      addedAt: Date.now(),
      schemaVersion: 2,
      chapters,
    },
    assets: [],
    sourcePdfFile: file,
  };
  } finally {
    await pdf.cleanup().catch(() => {});
    await loadingTask.destroy().catch(() => {});
  }
}

async function readTextSmartEncoding(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const utf8 = new TextDecoder('utf-8').decode(buffer);
  const replacementCount = (utf8.match(/\uFFFD/g) || []).length;
  if (replacementCount > 4) {
    try {
      return new TextDecoder('windows-1256').decode(buffer);
    } catch {
      return utf8;
    }
  }
  return utf8;
}

async function parseHtmlFile(
  file: File,
  onProgress: (p: ParseProgress) => void
): Promise<ParseEbookResult> {
  const bookId = createId('book');
  onProgress({ stage: 'در حال خواندن فایل HTML...', percent: 25 });
  const rawHtml = await readTextSmartEncoding(file);
  const doc = parseHtmlDoc(rawHtml);
  const bookTitle = cleanTitle(
    doc.querySelector('title')?.textContent,
    cleanFileNameToTitle(file.name)
  );

  onProgress({ stage: 'در حال تفکیک سرفصل‌ها و موضوعات...', percent: 60 });
  const body = doc.body || doc.documentElement;
  const h1List = Array.from(body.querySelectorAll('h1'));

  const chapters: EbookChapter[] = [];
  if (h1List.length >= 2) {
    const sections = splitHtmlByHeadings(rawHtml, bookTitle, file.name, bookId);
    for (const sec of sections) {
      chapters.push(
        finalizeChapter(
          sec.title,
          [finalizeTopic(sec.title, sec.content, 0, undefined, undefined, sec.htmlContent)],
          chapters.length
        )
      );
    }
  } else {
    const sections = splitHtmlByHeadings(rawHtml, 'متن کتاب', file.name, bookId);
    const topics = sections.map((s, idx) =>
      finalizeTopic(s.title, s.content, idx, undefined, undefined, s.htmlContent)
    );
    if (topics.length > 0) {
      chapters.push(finalizeChapter(bookTitle, topics, 0));
    }
  }

  if (chapters.length === 0) {
    throw new Error('محتوای متنی قابل خواندنی در فایل HTML یافت نشد.');
  }

  return {
    book: {
      id: bookId,
      title: bookTitle,
      dir: detectBookDirection(chapters, undefined, bookTitle),
      format: 'html',
      fileName: file.name,
      fileSize: file.size,
      tocSource: 'headings',
      addedAt: Date.now(),
      schemaVersion: 2,
      chapters,
    },
    assets: [],
  };
}

async function parseTextOrMarkdown(
  file: File,
  format: 'txt' | 'md',
  onProgress: (p: ParseProgress) => void
): Promise<ParseEbookResult> {
  const bookId = createId('book');
  onProgress({ stage: 'در حال خواندن فایل متنی...', percent: 25 });
  const raw = await readTextSmartEncoding(file);
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const bookTitle = cleanFileNameToTitle(file.name);

  onProgress({ stage: 'در حال استخراج سرفصل‌ها و موضوعات...', percent: 65 });

  const chapters: EbookChapter[] = [];
  let currentChapterTitle = 'مقدمه و کلیات';
  let currentTopics: Array<{ title: string; lines: string[] }> = [];
  let currentTopicTitle = 'متن اصلی';
  let currentTopicLines: string[] = [];

  const reflowPlainLines = (rawLines: string[]): string => {
    const chunks: string[] = [];
    let current = '';
    const bulletStart = /^(?:[•●▪▸‣\-–—*]|(?:\d+|[۰-۹]+)[.)])\s+/;

    for (const rawLine of rawLines) {
      const trimmed = rawLine.trim();
      if (!trimmed) {
        if (current) {
          chunks.push(current);
          current = '';
        }
        continue;
      }
      if (!current) {
        current = trimmed;
      } else if (bulletStart.test(trimmed)) {
        chunks.push(current);
        current = trimmed;
      } else {
        current = `${current} ${trimmed}`;
      }
    }
    if (current) chunks.push(current);
    return chunks.join('\n\n');
  };

  const flushTopic = () => {
    const content = reflowPlainLines(currentTopicLines).trim();
    if (content) {
      currentTopics.push({ title: currentTopicTitle, lines: [content] });
    }
    currentTopicLines = [];
  };

  const flushChapter = () => {
    flushTopic();
    if (currentTopics.length > 0) {
      const finalizedTopics = currentTopics.map((t, idx) =>
        finalizeTopic(t.title, t.lines.join('\n\n'), idx)
      );
      chapters.push(finalizeChapter(currentChapterTitle, finalizedTopics, chapters.length));
    }
    currentTopics = [];
  };

  const chapterRegex = /^(?:#\s+(.+)|((?:فصل|بخش|باب|Chapter|Part)\s+[\d۰-۹IVXLCDM]+.*))$/i;
  const topicRegex = /^(?:#{2}\s+(.+)|((?:مبحث|موضوع)\s+[\d۰-۹.]+.*))$/i;

  for (const line of lines) {
    const trimmed = line.trim();
    const chapMatch = trimmed.match(chapterRegex);
    if (chapMatch && trimmed.length <= 140) {
      flushChapter();
      currentChapterTitle = cleanTitle(chapMatch[1] || chapMatch[2], 'سرفصل');
      currentTopicTitle = 'کلیات سرفصل';
      continue;
    }

    const topicMatch = trimmed.match(topicRegex);
    if (topicMatch && trimmed.length <= 140) {
      flushTopic();
      currentTopicTitle = cleanTitle(topicMatch[1] || topicMatch[2], 'موضوع');
      continue;
    }

    currentTopicLines.push(line);
  }

  flushChapter();

  if (chapters.length === 0) {
    const fullText = raw.trim();
    if (!fullText) {
      throw new Error('فایل متنی خالی است.');
    }
    const paragraphs = fullText.split(/\n\s*\n/).filter((p) => p.trim());
    const topics: EbookTopic[] = [];
    const chunkSize = 25;
    for (let i = 0; i < paragraphs.length; i += chunkSize) {
      const slice = paragraphs.slice(i, i + chunkSize).join('\n\n');
      topics.push(finalizeTopic(`بخش ${topics.length + 1}`, slice, topics.length));
    }
    chapters.push(finalizeChapter(bookTitle, topics, 0));
  }

  return {
    book: {
      id: bookId,
      title: bookTitle,
      dir: detectBookDirection(chapters, undefined, bookTitle),
      format,
      fileName: file.name,
      fileSize: file.size,
      tocSource: chapters.length > 1 ? 'headings' : 'pages',
      addedAt: Date.now(),
      schemaVersion: 2,
      chapters,
    },
    assets: [],
  };
}

export async function parseEbookFile(
  file: File,
  onProgress: (p: ParseProgress) => void
): Promise<ParseEbookResult> {
  const lower = file.name.toLowerCase();
  const format: EbookFormat | null = lower.endsWith('.epub')
    ? 'epub'
    : lower.endsWith('.pdf')
      ? 'pdf'
      : lower.endsWith('.html') || lower.endsWith('.htm')
        ? 'html'
        : lower.endsWith('.md') || lower.endsWith('.markdown')
          ? 'md'
          : lower.endsWith('.txt')
            ? 'txt'
            : null;

  if (!format) {
    throw new Error('فرمت فایل پشتیبانی نمی‌شود. لطفاً فایل EPUB، PDF، TXT، MD یا HTML انتخاب کنید.');
  }

  if (format === 'epub') return parseEpub(file, onProgress);
  if (format === 'pdf') return parsePdf(file, onProgress);
  if (format === 'html') return parseHtmlFile(file, onProgress);
  return parseTextOrMarkdown(file, format, onProgress);
}
