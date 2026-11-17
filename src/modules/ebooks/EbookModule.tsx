import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  ArrowUp,
  BookMarked,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  FolderTree,
  Library,
  List,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  deleteEbook,
  getAllEbooks,
  saveEbook,
  updateEbookMeta,
} from './ebookDb';
import {
  cleanBrokenHyphens,
  consolidateBookMainTopics,
  detectBookDirection,
  isRunningHeaderOrFooterLine,
  parseEbookFile,
} from './ebookParser';
import {
  BookSearchGroup,
  HighlightSegment,
  getClinicalTopicTier,
  highlightTextSegments,
  searchEbooks,
} from './ebookSearch';
import { loadPdfChapterFigures, PdfExtractedFigure } from './pdfFigureExtractor';
import { InlineAssetFigure, RichTopicHtmlView } from './RichChapterContent';
import { BookDirection, EbookChapter, EbookRecord, EbookTopic, ParseProgress } from './types';

type ActiveEbookTab = 'search' | 'library' | 'upload';

const FONT_PX_STORAGE_KEY = 'ebook_reader_font_px';
const MIN_FONT_PX = 12;
const MAX_FONT_PX = 28;
const DEFAULT_FONT_PX = 16;

const FONT_SIZE_CLASSES: Record<number, string> = {
  12: 'text-[12px] leading-[1.8]',
  13: 'text-[13px] leading-[1.8]',
  14: 'text-[14px] leading-[1.8]',
  15: 'text-[15px] leading-[1.8]',
  16: 'text-[16px] leading-[1.8]',
  17: 'text-[17px] leading-[1.8]',
  18: 'text-[18px] leading-[1.78]',
  19: 'text-[19px] leading-[1.76]',
  20: 'text-[20px] leading-[1.74]',
  21: 'text-[21px] leading-[1.72]',
  22: 'text-[22px] leading-[1.7]',
  23: 'text-[23px] leading-[1.68]',
  24: 'text-[24px] leading-[1.65]',
  25: 'text-[25px] leading-[1.64]',
  26: 'text-[26px] leading-[1.62]',
  27: 'text-[27px] leading-[1.6]',
  28: 'text-[28px] leading-[1.6]',
};

const PDF_FIG_TOKEN_REGEX = /^\[\[PDF_FIG:(\d+):(\d+)\]\]$/;
const H2_TOKEN_REGEX = /^\[\[H2:([\s\S]+?)\]\]$/;
const H3_TOKEN_REGEX = /^\[\[H3:([\s\S]+?)\]\]$/;

const KNOWN_LEGACY_H2_REGEX =
  /^(?:FOUNDATIONS|EPIDEMIOLOGY|PATHOPHYSIOLOGY|ANATOMY(?:\s+AND\s+PATHOPHYSIOLOGY)?|ETIOLOGY|CLINICAL FEATURES|CLINICAL PRESENTATION|DIAGNOSTIC STRATEGIES|DIAGNOSIS|DIFFERENTIAL DIAGNOSIS|MANAGEMENT|TREATMENT|DISPOSITION|SUMMARY|Epidemiology|Pathophysiology|Pathogenesis|Anatomy(?:\s+and\s+Pathophysiology)?|Etiology|Clinical Features|Clinical Presentation|History|Physical Examination|Diagnostic Strategies|Diagnostic Testing|Laboratory Testing|Imaging|Differential Diagnosis|Management|Treatment|Disposition|Complications|Prognosis|پاتوفیزیولوژی|علائم بالینی|علایم بالینی|تظاهرات بالینی|ارزیابی تشخیصی|تشخیص|تشخیص افتراقی|درمان|منیجمنت|دیسپوزیشن|تعیین تکلیف)$/i;

type ParsedContentBlock =
  | { kind: 'figure'; raw: string }
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'p'; text: string };

function detectHeadingLevelFromPlainBlock(block: string): 'h2' | 'h3' | null {
  const txt = block.trim();
  if (txt.length < 3 || txt.length > 82) return null;
  if (/^\d{1,4}$/.test(txt)) return null;
  if (/^(?:fig\.?|figure|table|box|algorithm|شکل|جدول|نمودار)\s+\d+/i.test(txt)) return null;
  if (/^(?:[•●▪▸‣\-–—*]|(?:\d+|[۰-۹]+)[.)])\s+/.test(txt)) return null;
  if (/[.!؟?,;]$/.test(txt)) return null;

  if (KNOWN_LEGACY_H2_REGEX.test(txt)) return 'h2';
  if (/^[A-Z][A-Z\s\-/&()0-9]{2,58}$/.test(txt) && /[A-Z]{3,}/.test(txt)) {
    return 'h2';
  }
  const wordCount = txt.split(/\s+/).length;
  if (
    wordCount >= 1 &&
    wordCount <= 7 &&
    txt.length <= 58 &&
    !/\d{3,}/.test(txt) &&
    /^[A-Z\u0600-\u06FF]/.test(txt) &&
    !/^(?:approximately|in|the|this|these|patients|although|however|when|while)\s+/i.test(txt)
  ) {
    // Title-style short standalone phrase with no sentence punctuation (e.g. "Scalp and cranium")
    const words = txt.split(/\s+/);
    const capitalizedWords = words.filter((w) => /^[A-Z]/.test(w)).length;
    if (capitalizedWords === 1 && wordCount >= 3 && /^[A-Z][a-z]+/.test(txt)) {
      return 'h3';
    }
    if (capitalizedWords >= Math.ceil(wordCount / 2) && wordCount <= 6) {
      return 'h3';
    }
  }
  return null;
}

interface OpenedChapterState {
  bookId: string;
  chapterId: string;
  focusTopicId?: string;
  highlightQuery?: string;
  fromTab: 'library' | 'search';
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes < 1024) return `${bytes || 0} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function getBookDir(book: EbookRecord): BookDirection {
  if (book.dir === 'ltr' || book.dir === 'rtl') return book.dir;
  return detectBookDirection(book.chapters, book.language, book.title);
}

function clampFontPx(val: number): number {
  return Math.min(MAX_FONT_PX, Math.max(MIN_FONT_PX, Math.round(val)));
}

/**
 * Ensures sentences flow naturally across the full available line width
 * instead of breaking mid-line on embedded single newlines, cleans broken PDF
 * hyphenation, strips stray page numbers, and emits structured heading & figure blocks.
 */
function reflowContentToBlocks(rawContent: string): ParsedContentBlock[] {
  if (!rawContent) return [];
  const rawBlocks = rawContent
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const bulletStart = /^(?:[•●▪▸‣\-–—*]|(?:\d+|[۰-۹]+)[.)])\s+/;
  const terminalPunct = /[.!؟?:»"')\]…]$/;
  const result: ParsedContentBlock[] = [];
  let strippedHeaderSinceLastBlock = false;

  const pushTextOrHeading = (rawTxt: string) => {
    const cleaned = cleanBrokenHyphens(rawTxt).trim();
    if (!cleaned) return;
    const unwrapped = cleaned.replace(/^\[\[H[23]:([\s\S]+?)\]\]$/, '$1').trim();
    if (isRunningHeaderOrFooterLine(unwrapped)) {
      strippedHeaderSinceLastBlock = true;
      return;
    }

    const h2m = cleaned.match(H2_TOKEN_REGEX);
    if (h2m) {
      strippedHeaderSinceLastBlock = false;
      result.push({ kind: 'h2', text: cleanBrokenHyphens(h2m[1]).trim() });
      return;
    }
    const h3m = cleaned.match(H3_TOKEN_REGEX);
    if (h3m) {
      strippedHeaderSinceLastBlock = false;
      result.push({ kind: 'h3', text: cleanBrokenHyphens(h3m[1]).trim() });
      return;
    }

    const legacyLevel = detectHeadingLevelFromPlainBlock(cleaned);
    if (legacyLevel) {
      strippedHeaderSinceLastBlock = false;
      result.push({ kind: legacyLevel, text: cleaned });
      return;
    }

    // Re-join mid-sentence split caused by an intervening running header/page break
    const prevBlock = result[result.length - 1];
    if (
      strippedHeaderSinceLastBlock &&
      prevBlock &&
      prevBlock.kind === 'p' &&
      !terminalPunct.test(prevBlock.text) &&
      /^[a-z,;(\[]/.test(cleaned)
    ) {
      prevBlock.text = cleanBrokenHyphens(`${prevBlock.text} ${cleaned}`);
      strippedHeaderSinceLastBlock = false;
      return;
    }

    strippedHeaderSinceLastBlock = false;
    result.push({ kind: 'p', text: cleaned });
  };

  for (const block of rawBlocks) {
    if (PDF_FIG_TOKEN_REGEX.test(block)) {
      result.push({ kind: 'figure', raw: block });
      continue;
    }
    if (H2_TOKEN_REGEX.test(block) || H3_TOKEN_REGEX.test(block)) {
      pushTextOrHeading(block);
      continue;
    }

    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    let current = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (isRunningHeaderOrFooterLine(line)) {
        if (current) {
          pushTextOrHeading(current);
          current = '';
        }
        strippedHeaderSinceLastBlock = true;
        continue;
      }
      if (PDF_FIG_TOKEN_REGEX.test(line)) {
        if (current) {
          pushTextOrHeading(current);
          current = '';
        }
        result.push({ kind: 'figure', raw: line });
        continue;
      }
      if (H2_TOKEN_REGEX.test(line) || H3_TOKEN_REGEX.test(line)) {
        if (current) {
          pushTextOrHeading(current);
          current = '';
        }
        pushTextOrHeading(line);
        continue;
      }

      if (!current) {
        current = line;
        continue;
      }

      const prevWasShortSentence = current.length < 56 && terminalPunct.test(current);
      if (bulletStart.test(line) || prevWasShortSentence) {
        pushTextOrHeading(current);
        current = line;
      } else if (/[A-Za-z]-$/.test(current) && /^[A-Za-z]/.test(line)) {
        current = cleanBrokenHyphens(`${current} ${line}`);
      } else {
        current = `${current} ${line}`;
      }
    }
    if (current) pushTextOrHeading(current);
  }

  return result;
}

function renderSegments(segments: HighlightSegment[]): React.ReactNode {
  return segments.map((seg, idx) =>
    seg.highlight ? (
      <mark
        key={idx}
        className="bg-amber-200/90 dark:bg-amber-500/35 text-slate-950 dark:text-amber-100 rounded px-0.5 font-semibold"
      >
        {seg.text}
      </mark>
    ) : (
      <React.Fragment key={idx}>{seg.text}</React.Fragment>
    )
  );
}

const ACTIVE_MARK_CLASSES = ['bg-orange-400', 'dark:bg-orange-500', 'ring-2', 'ring-orange-500/70'];
const INACTIVE_MARK_CLASSES = ['bg-amber-200/90', 'dark:bg-amber-500/35'];

const EbookModule: React.FC = () => {
  const [books, setBooks] = useState<EbookRecord[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // 3 Primary Tabs: 'search' | 'library' | 'upload'
  const [activeTab, setActiveTab] = useState<ActiveEbookTab>('search');

  // Upload & Parsing state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState<ParseProgress | null>(null);
  const [parseQueueLabel, setParseQueueLabel] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [recentlyAddedBook, setRecentlyAddedBook] = useState<EbookRecord | null>(null);
  const [recentlyAddedQuotaNote, setRecentlyAddedQuotaNote] = useState<string | null>(null);

  // Search Tab state (silent auto word correction, fast debounced search)
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Library & Chapter Reader state
  const [selectedLibraryBookId, setSelectedLibraryBookId] = useState<string | null>(null);
  const [openedChapter, setOpenedChapter] = useState<OpenedChapterState | null>(null);

  // Pinch-to-Zoom font size (12px..28px)
  const [fontPx, setFontPx] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem(FONT_PX_STORAGE_KEY));
      if (Number.isFinite(saved) && saved >= MIN_FONT_PX && saved <= MAX_FONT_PX) {
        return clampFontPx(saved);
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_FONT_PX;
  });
  const [pinchHudVisible, setPinchHudVisible] = useState(false);
  const pinchHudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fontPxRef = useRef(fontPx);
  fontPxRef.current = fontPx;

  // PDF Inline Figures state for opened chapter
  const [chapterPdfFigures, setChapterPdfFigures] = useState<Record<number, PdfExtractedFigure[]>>({});
  const [chapterFiguresLoadedTick, setChapterFiguresLoadedTick] = useState(0);

  // Match navigation state inside opened chapter
  const [domMatchCount, setDomMatchCount] = useState(0);
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);
  const [matchJumpTick, setMatchJumpTick] = useState(0);
  const [htmlRenderVersion, setHtmlRenderVersion] = useState(0);

  // In-chapter topic menu & in-chapter keyword search
  const [isTopicMenuOpen, setIsTopicMenuOpen] = useState(false);
  const [inChapterQuery, setInChapterQuery] = useState('');

  // Edit / Delete inline state
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState('');
  const [editAuthorInput, setEditAuthorInput] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const chapterReaderRef = useRef<HTMLDivElement | null>(null);
  const readerArticleRef = useRef<HTMLElement | null>(null);
  const topicSectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    try {
      localStorage.setItem(FONT_PX_STORAGE_KEY, String(fontPx));
    } catch {
      // ignore
    }
  }, [fontPx]);

  useEffect(() => {
    let mounted = true;
    getAllEbooks()
      .then((loaded) => {
        if (!mounted) return;
        const mainTopicBooks = loaded.map((b) =>
          b.schemaVersion === 2 ? b : consolidateBookMainTopics(b)
        );
        setBooks(mainTopicBooks);
        if (mainTopicBooks.length === 0) {
          setActiveTab('upload');
        }
        setIsLoadingDb(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setDbError(err instanceof Error ? err.message : 'خطا در بارگذاری کتابخانه');
        setIsLoadingDb(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Fast 110ms debounce on global library search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setDebouncedQuery('');
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 110);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchQueryChange = (val: string) => {
    setSearchQuery(val);
    if (openedChapter && openedChapter.fromTab === 'search') {
      setOpenedChapter(null);
    }
  };

  const isSearchActive = debouncedQuery.trim().length > 0;

  // Smart Search across ALL books (main topics only, silent auto-correct, relevance + clinical priority)
  const searchResults = useMemo(() => {
    if (!isSearchActive) {
      return {
        groups: [] as BookSearchGroup[],
        totalMatchingTopics: 0,
        totalMatchOccurrences: 0,
        effectiveQuery: '',
        correction: {
          originalQuery: '',
          correctedQuery: '',
          wasCorrected: false,
          corrections: [],
        },
      };
    }
    return searchEbooks(books, {
      query: debouncedQuery,
      bookId: 'all',
      chapterId: 'all',
      topicId: 'all',
      scope: 'all',
      autoCorrect: true,
      includeSnippets: false,
    });
  }, [books, isSearchActive, debouncedQuery]);

  const openedChapterData = useMemo<{
    book: EbookRecord;
    bookDir: BookDirection;
    chapter: EbookChapter;
    chapterIndex: number;
    prevChapter: EbookChapter | null;
    nextChapter: EbookChapter | null;
  } | null>(() => {
    if (!openedChapter) return null;
    const book = books.find((b) => b.id === openedChapter.bookId);
    if (!book) return null;
    const idx = book.chapters.findIndex((c) => c.id === openedChapter.chapterId);
    if (idx === -1) return null;

    return {
      book,
      bookDir: getBookDir(book),
      chapter: book.chapters[idx],
      chapterIndex: idx,
      prevChapter: idx > 0 ? book.chapters[idx - 1] : null,
      nextChapter: idx < book.chapters.length - 1 ? book.chapters[idx + 1] : null,
    };
  }, [books, openedChapter]);

  const selectedLibraryBook = useMemo(
    () => books.find((b) => b.id === selectedLibraryBookId) || null,
    [books, selectedLibraryBookId]
  );

  // Extract / load inline figures & algorithms automatically whenever a PDF chapter opens (prioritizing focused topic pages)
  useEffect(() => {
    setChapterPdfFigures({});
    setChapterFiguresLoadedTick(0);
    if (!openedChapterData) return;
    const { book, chapter } = openedChapterData;
    if (book.format !== 'pdf' || typeof chapter.pageStart !== 'number') return;

    let cancelled = false;
    const pStart = chapter.pageStart;
    const pEnd = chapter.pageEnd ?? pStart;

    const priorityPages: number[] = [];
    if (openedChapter?.focusTopicId) {
      const focusedTopic = chapter.topics.find((t) => t.id === openedChapter.focusTopicId);
      if (focusedTopic && typeof focusedTopic.pageStart === 'number') {
        const fEnd = focusedTopic.pageEnd ?? focusedTopic.pageStart;
        for (let p = focusedTopic.pageStart; p <= fEnd; p++) {
          priorityPages.push(p);
        }
      }
    }

    loadPdfChapterFigures(
      book.id,
      pStart,
      pEnd,
      () => cancelled,
      (pageNumber, figs) => {
        if (cancelled) return;
        setChapterPdfFigures((prev) => ({ ...prev, [pageNumber]: figs }));
        setChapterFiguresLoadedTick((v) => v + 1);
      },
      priorityPages
    ).then((figsByPage) => {
      if (!cancelled) {
        setChapterPdfFigures(figsByPage);
        setChapterFiguresLoadedTick((v) => v + 1);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [openedChapterData, openedChapter?.focusTopicId]);

  // Two-finger pinch-to-zoom on reader area (plus Ctrl+wheel for desktop trackpad pinch)
  useEffect(() => {
    const el = readerArticleRef.current;
    if (!el || !openedChapterData) return;

    let activePinch = false;
    let initialDist = 0;
    let initialFont = fontPxRef.current;

    const showHudBriefly = () => {
      setPinchHudVisible(true);
      if (pinchHudTimerRef.current) clearTimeout(pinchHudTimerRef.current);
      pinchHudTimerRef.current = setTimeout(() => {
        setPinchHudVisible(false);
      }, 1100);
    };

    const getTouchDist = (t1: Touch, t2: Touch) =>
      Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        activePinch = true;
        initialDist = Math.max(10, getTouchDist(e.touches[0], e.touches[1]));
        initialFont = fontPxRef.current;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && activePinch) {
        e.preventDefault();
        const dist = getTouchDist(e.touches[0], e.touches[1]);
        const ratio = dist / initialDist;
        const nextPx = clampFontPx(initialFont * ratio);
        setFontPx(nextPx);
        showHudBriefly();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        activePinch = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const step = e.deltaY < 0 ? 1 : -1;
        setFontPx((prev) => clampFontPx(prev + step));
        showHudBriefly();
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      el.removeEventListener('wheel', onWheel);
    };
  }, [openedChapterData]);

  // Active highlight query inside the opened chapter
  const activeChapterHighlightQuery = useMemo(() => {
    const local = inChapterQuery.trim();
    if (local) return local;
    return openedChapter?.highlightQuery?.trim() || '';
  }, [inChapterQuery, openedChapter?.highlightQuery]);

  const handleRichTopicRendered = useCallback(() => {
    setHtmlRenderVersion((v) => v + 1);
  }, []);

  const chapterTopicsWithHighlights = useMemo(() => {
    if (!openedChapterData) return [];
    const q = activeChapterHighlightQuery;
    const seenLongParas = new Set<string>();
    const chapterShowTopicHeadings =
      openedChapterData.chapter.topics.length > 1 ||
      (openedChapterData.chapter.topics[0] &&
        openedChapterData.chapter.topics[0].title !== openedChapterData.chapter.title);

    return openedChapterData.chapter.topics.map((topic) => {
      const rawBlocks = reflowContentToBlocks(topic.content);
      // Skip duplicate leading heading if it matches topic.title already rendered above
      const blocks = rawBlocks.filter((blk, idx) => {
        if (
          idx === 0 &&
          chapterShowTopicHeadings &&
          (blk.kind === 'h2' || blk.kind === 'h3') &&
          blk.text.toLowerCase() === topic.title.trim().toLowerCase()
        ) {
          return false;
        }
        if (blk.kind === 'p' && blk.text.length >= 65) {
          const sig = blk.text.toLowerCase().replace(/\s+/g, ' ');
          if (seenLongParas.has(sig)) return false;
          seenLongParas.add(sig);
        }
        return true;
      });

      const hasExplicitFigTokens = blocks.some((b) => b.kind === 'figure');
      const textBlocksOnly = blocks.filter((b) => b.kind !== 'figure');

      // Collect PDF figures for this topic (for fallback caption/proportional placement on older cached PDFs)
      const fallbackFiguresByParagraphIdx = new Map<number, PdfExtractedFigure[]>();
      if (
        openedChapterData.book.format === 'pdf' &&
        !hasExplicitFigTokens &&
        typeof topic.pageStart === 'number'
      ) {
        const tStart = topic.pageStart;
        const tEnd = topic.pageEnd ?? tStart;
        const span = Math.max(1, tEnd - tStart + 1);
        const topicFigs: PdfExtractedFigure[] = [];
        for (let p = tStart; p <= tEnd; p++) {
          const list = chapterPdfFigures[p];
          if (list && list.length > 0) {
            topicFigs.push(...list);
          }
        }
        const normalizeCaptionTag = (s: string): string | null => {
          const m = s
            .trim()
            .match(/^(fig\.?|figure|table|box|algorithm|شکل|جدول|نمودار|الگوریتم)\s+([\d۰-۹]+(?:[.\-–][\d۰-۹]+)?)/i);
          if (!m) return null;
          const kind = m[1].toLowerCase().replace(/^fig\.?$/, 'figure');
          return `${kind} ${m[2].toLowerCase()}`;
        };

        const captionParagraphIndices: number[] = [];
        const captionTagToBlockIdx = new Map<string, number>();
        const normalizedTextBlocks: string[] = [];

        textBlocksOnly.forEach((tb, idx) => {
          const plain = tb.text.trim();
          normalizedTextBlocks.push(plain.toLowerCase().replace(/\s+/g, ' '));
          if (
            (tb.kind === 'p' || tb.kind === 'h3') &&
            /^(?:fig\.?|figure|table|box|algorithm|شکل|جدول|نمودار|الگوریتم)\s+[\d۰-۹]+/i.test(plain)
          ) {
            captionParagraphIndices.push(idx);
            const tag = normalizeCaptionTag(plain);
            if (tag && !captionTagToBlockIdx.has(tag)) {
              captionTagToBlockIdx.set(tag, idx);
            }
          }
        });

        const usedCaptionIndices = new Set<number>();
        const totalTextParas = Math.max(1, textBlocksOnly.length);
        let sequentialCaptionCursor = 0;

        topicFigs.forEach((fig) => {
          let insertAt: number | undefined;

          // 1. Exact caption match (e.g. "Fig. 43.14" -> directly above its caption paragraph)
          if (fig.nearbyCaption) {
            const figTag = normalizeCaptionTag(fig.nearbyCaption);
            if (figTag && captionTagToBlockIdx.has(figTag)) {
              const matchedIdx = captionTagToBlockIdx.get(figTag)!;
              insertAt = matchedIdx;
              usedCaptionIndices.add(matchedIdx);
            }
          }

          // 2. Adjacent paragraph text anchor match
          if (insertAt === undefined && fig.anchorSnippet) {
            const needle = fig.anchorSnippet.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 36);
            if (needle.length >= 16) {
              const foundIdx = normalizedTextBlocks.findIndex((txt) => txt.includes(needle));
              if (foundIdx !== -1) {
                insertAt = foundIdx;
              }
            }
          }

          // 3. Next unused caption fallback
          if (insertAt === undefined) {
            while (
              sequentialCaptionCursor < captionParagraphIndices.length &&
              usedCaptionIndices.has(captionParagraphIndices[sequentialCaptionCursor])
            ) {
              sequentialCaptionCursor++;
            }
            if (sequentialCaptionCursor < captionParagraphIndices.length) {
              insertAt = captionParagraphIndices[sequentialCaptionCursor];
              usedCaptionIndices.add(insertAt);
              sequentialCaptionCursor++;
            }
          }

          // 4. Proportional page-offset placement fallback
          if (insertAt === undefined) {
            const globalRatio = (fig.pageNumber - tStart + fig.yRatioTop) / span;
            insertAt = Math.min(
              totalTextParas,
              Math.max(0, Math.round(globalRatio * totalTextParas))
            );
          }

          const arr = fallbackFiguresByParagraphIdx.get(insertAt) || [];
          arr.push(fig);
          fallbackFiguresByParagraphIdx.set(insertAt, arr);
        });
      }

      const renderedBlocks = blocks.map((b) => {
        if (b.kind === 'figure') {
          const figMatch = b.raw.match(PDF_FIG_TOKEN_REGEX);
          return {
            type: 'figure' as const,
            assetKey: figMatch
              ? `${openedChapterData.book.id}::pdf_fig_${figMatch[1]}_${figMatch[2]}`
              : '',
            alt: figMatch ? `تصویر صفحه ${figMatch[1]}` : 'تصویر کتاب',
          };
        }
        return {
          type: b.kind,
          segments: q ? highlightTextSegments(b.text, q) : [{ text: b.text, highlight: false }],
        };
      });

      return {
        topic,
        titleSegments: q
          ? highlightTextSegments(topic.title, q)
          : [{ text: topic.title, highlight: false }],
        renderedBlocks,
        fallbackFiguresByParagraphIdx,
      };
    });
  }, [openedChapterData, activeChapterHighlightQuery, chapterPdfFigures]);

  // Synchronize total DOM match count across both plain-text paragraphs and RichTopicHtmlView
  useEffect(() => {
    if (!chapterReaderRef.current || !activeChapterHighlightQuery) {
      setDomMatchCount(0);
      return;
    }
    const marks = chapterReaderRef.current.querySelectorAll('mark[data-reader-match="true"]');
    setDomMatchCount(marks.length);
  }, [chapterTopicsWithHighlights, activeChapterHighlightQuery, htmlRenderVersion]);

  // Highlight active match mark uniformly in DOM
  useEffect(() => {
    const container = chapterReaderRef.current;
    if (!container) return;
    const marks = Array.from(container.querySelectorAll('mark[data-reader-match="true"]'));
    marks.forEach((mark, idx) => {
      if (idx === activeMatchIdx) {
        mark.classList.remove(...INACTIVE_MARK_CLASSES);
        mark.classList.add(...ACTIVE_MARK_CLASSES);
      } else {
        mark.classList.remove(...ACTIVE_MARK_CLASSES);
        mark.classList.add(...INACTIVE_MARK_CLASSES);
      }
    });
  }, [activeMatchIdx, domMatchCount, htmlRenderVersion]);

  // Trigger match jump when user types inside in-chapter keyword search bar
  useEffect(() => {
    if (inChapterQuery.trim()) {
      setActiveMatchIdx(0);
      setMatchJumpTick((t) => t + 1);
    }
  }, [inChapterQuery]);

  // When opening a topic from Search results, jump straight to the FIRST matched keyword INSIDE that topic
  useEffect(() => {
    if (!openedChapter || openedChapter.fromTab !== 'search' || !openedChapter.focusTopicId) {
      return;
    }

    const focusId = openedChapter.focusTopicId;
    const jumpToFocusedSearchSpot = () => {
      const container = chapterReaderRef.current;
      const sectionEl = topicSectionRefs.current[focusId];
      if (!container || !sectionEl) return;

      const allMarks = Array.from(container.querySelectorAll('mark[data-reader-match="true"]'));
      const markInsideTopic = sectionEl.querySelector('mark[data-reader-match="true"]');

      if (markInsideTopic) {
        const globalIndex = allMarks.indexOf(markInsideTopic);
        if (globalIndex !== -1) {
          setActiveMatchIdx(globalIndex);
        }
        markInsideTopic.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const t1 = setTimeout(jumpToFocusedSearchSpot, 90);
    const t2 = setTimeout(jumpToFocusedSearchSpot, 340);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [openedChapter?.chapterId, openedChapter?.focusTopicId, openedChapter?.fromTab, htmlRenderVersion]);

  // Scroll to active match when user types in-chapter search or clicks Up/Down floating match arrows
  useEffect(() => {
    if (matchJumpTick === 0 || domMatchCount === 0 || !chapterReaderRef.current) {
      return;
    }
    const marks = chapterReaderRef.current.querySelectorAll('mark[data-reader-match="true"]');
    const target = marks[activeMatchIdx];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [matchJumpTick, activeMatchIdx, domMatchCount]);

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setUploadError(null);
    setRecentlyAddedBook(null);
    setRecentlyAddedQuotaNote(null);
    setIsParsing(true);

    let lastAdded: EbookRecord | null = null;
    let lastQuotaNote: string | null = null;
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setParseQueueLabel(
        files.length > 1 ? `فایل ${i + 1} از ${files.length}: ${file.name}` : file.name
      );
      setParseProgress({ stage: 'آماده‌سازی فایل...', percent: 2 });

      try {
        const { book: rawBook, assets, sourcePdfFile } = await parseEbookFile(file, (p) =>
          setParseProgress(p)
        );
        const book = consolidateBookMainTopics(rawBook);
        const saveResult = await saveEbook(book, assets, sourcePdfFile, (pct) =>
          setParseProgress({ stage: 'در حال ذخیره‌سازی کتاب در حافظه دستگاه...', percent: pct })
        );
        setBooks((prev) => [book, ...prev]);
        lastAdded = book;
        lastQuotaNote = saveResult.pdfBinarySaved
          ? null
          : 'متن و سرفصل‌های کتاب ذخیره شد، اما فضای ذخیره مرورگر برای نگهداری فایل اصلی تصاویر PDF کافی نبود.';
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'خطا در پردازش فایل';
        errors.push(`${file.name}: ${msg}`);
      }
    }

    setIsParsing(false);
    setParseProgress(null);
    setParseQueueLabel('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (errors.length > 0) {
      setUploadError(errors.join(' | '));
    }
    if (lastAdded) {
      setRecentlyAddedBook(lastAdded);
      setRecentlyAddedQuotaNote(lastQuotaNote);
    }
  };

  const handleOpenLibraryBook = (book: EbookRecord) => {
    setActiveTab('library');
    setSelectedLibraryBookId(book.id);
    setOpenedChapter(null);
  };

  const resetChapterToolbarState = () => {
    setIsTopicMenuOpen(false);
    setInChapterQuery('');
    setActiveMatchIdx(0);
    setMatchJumpTick(0);
  };

  const handleOpenChapterFromLibrary = (book: EbookRecord, chapter: EbookChapter) => {
    resetChapterToolbarState();
    setOpenedChapter({
      bookId: book.id,
      chapterId: chapter.id,
      fromTab: 'library',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChapterFromSearch = (
    book: EbookRecord,
    chapterId: string,
    focusTopicId: string,
    highlightQuery: string
  ) => {
    resetChapterToolbarState();
    setOpenedChapter({
      bookId: book.id,
      chapterId,
      focusTopicId,
      highlightQuery,
      fromTab: 'search',
    });
  };

  const handleJumpToTopic = (topic: EbookTopic) => {
    setIsTopicMenuOpen(false);
    const targetEl = topicSectionRefs.current[topic.id];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevMatch = () => {
    if (domMatchCount > 0) {
      setActiveMatchIdx((prev) => (prev - 1 + domMatchCount) % domMatchCount);
      setMatchJumpTick((t) => t + 1);
    }
  };

  const handleNextMatch = () => {
    if (domMatchCount > 0) {
      setActiveMatchIdx((prev) => (prev + 1) % domMatchCount);
      setMatchJumpTick((t) => t + 1);
    }
  };

  const handleStartEditBook = (book: EbookRecord) => {
    setEditingBookId(book.id);
    setEditTitleInput(book.title);
    setEditAuthorInput(book.author || '');
    setConfirmDeleteId(null);
  };

  const handleSaveBookMeta = async (bookId: string) => {
    const updated = await updateEbookMeta(bookId, {
      title: editTitleInput,
      author: editAuthorInput,
    });
    if (updated) {
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
    }
    setEditingBookId(null);
  };

  const handleDeleteBook = async (bookId: string) => {
    await deleteEbook(bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    setConfirmDeleteId(null);
    if (selectedLibraryBookId === bookId) setSelectedLibraryBookId(null);
    if (openedChapter?.bookId === bookId) setOpenedChapter(null);
    if (recentlyAddedBook?.id === bookId) setRecentlyAddedBook(null);
  };

  const handleSwitchTab = (tab: ActiveEbookTab) => {
    setActiveTab(tab);
    setOpenedChapter(null);
    resetChapterToolbarState();
  };

  const fontSizeClass = FONT_SIZE_CLASSES[fontPx] || FONT_SIZE_CLASSES[DEFAULT_FONT_PX];

  // Opened Chapter Content View
  const renderChapterContentView = () => {
    if (!openedChapterData || !openedChapter) return null;
    const { book, bookDir, chapter, prevChapter, nextChapter } = openedChapterData;

    const showTopicHeadings =
      chapterTopicsWithHighlights.length > 1 ||
      (chapterTopicsWithHighlights[0] &&
        chapterTopicsWithHighlights[0].topic.title !== chapter.title);

    const hasFloatingMatchNav =
      Boolean(inChapterQuery.trim() || openedChapter.highlightQuery?.trim()) && domMatchCount > 0;

    return (
      <>
        <div
          ref={chapterReaderRef}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col"
        >
          {/* Compact Top Toolbar */}
          <div className="p-3.5 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
            {/* Row 1: Back Arrow Icon + In-Chapter Search Bar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpenedChapter(null);
                  resetChapterToolbarState();
                }}
                aria-label="بازگشت"
                title="بازگشت"
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={inChapterQuery}
                  onChange={(e) => setInChapterQuery(e.target.value)}
                  placeholder="جستجوی کلمه کلیدی در این سرفصل..."
                  className="w-full h-10 pr-9 pl-9 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {inChapterQuery && (
                  <button
                    type="button"
                    onClick={() => setInChapterQuery('')}
                    aria-label="پاک کردن جستجوی داخل سرفصل"
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {chapter.topics.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsTopicMenuOpen((prev) => !prev)}
                  className={`h-10 px-3 rounded-xl border text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0 ${
                    isTopicMenuOpen
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>تاپیک‌ها</span>
                  {isTopicMenuOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Expandable Main Topics Dropdown Panel (Bolded Topics) */}
            {isTopicMenuOpen && (
              <div className="rounded-xl border border-indigo-200/80 dark:border-indigo-800/70 bg-slate-50 dark:bg-slate-950/70 overflow-hidden">
                <div className="px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>انتخاب تاپیک برای رفتن به بخش مربوطه</span>
                  <button
                    type="button"
                    onClick={() => setIsTopicMenuOpen(false)}
                    aria-label="بستن فهرست تاپیک‌ها"
                    className="p-1 rounded-md hover:bg-slate-200/70 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-200/70 dark:divide-slate-800/80">
                  {chapter.topics.map((topic) => {
                    const isCoreClinical = getClinicalTopicTier(topic.title) > 0;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        dir={bookDir}
                        onClick={() => handleJumpToTopic(topic)}
                        className={`w-full min-h-[44px] px-4 py-2.5 flex items-center justify-between gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer ${
                          bookDir === 'ltr' ? 'text-left' : 'text-right'
                        }`}
                      >
                        <span
                          className={`text-xs sm:text-sm break-words ${
                            isCoreClinical
                              ? 'font-black text-slate-950 dark:text-white'
                              : 'font-bold text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {topic.title}
                        </span>
                        {topic.pageStart ? (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums shrink-0">
                            {bookDir === 'ltr' ? `p.${topic.pageStart}` : `ص ${topic.pageStart}`}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Book & Chapter Title Header */}
            <div dir={bookDir} className={`space-y-1 pt-0.5 ${bookDir === 'ltr' ? 'text-left' : 'text-right'}`}>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {book.title}
                </span>
                {chapter.pageStart ? (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span className="tabular-nums">
                      {bookDir === 'ltr'
                        ? `Page ${chapter.pageStart}${
                            chapter.pageEnd && chapter.pageEnd !== chapter.pageStart
                              ? `–${chapter.pageEnd}`
                              : ''
                          }`
                        : `صفحه ${chapter.pageStart}${
                            chapter.pageEnd && chapter.pageEnd !== chapter.pageStart
                              ? ` تا ${chapter.pageEnd}`
                              : ''
                          }`}
                    </span>
                  </>
                ) : null}
              </p>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug break-words">
                {chapter.title}
              </h2>
            </div>
          </div>

          {/* Unified Rich Text + Inline Images & Algorithms Content Area (Pinch-to-Zoom enabled) */}
          <article
            ref={readerArticleRef}
            dir={bookDir}
            className={`relative p-4 sm:p-7 space-y-8 max-w-4xl touch-pan-y select-text ${
              bookDir === 'ltr' ? 'text-left mr-auto' : 'text-right ml-auto'
            } w-full`}
          >
            {pinchHudVisible && (
              <div
                dir="rtl"
                className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-800/95 text-white text-xs font-bold shadow-lg tabular-nums pointer-events-none"
              >
                اندازه فونت: {fontPx}px
              </div>
            )}

            {chapterTopicsWithHighlights.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {bookDir === 'ltr'
                  ? 'No text content found for this chapter.'
                  : 'محتوای متنی برای این سرفصل یافت نشد.'}
              </p>
            ) : (
              chapterTopicsWithHighlights.map(
                ({ topic, titleSegments, renderedBlocks, fallbackFiguresByParagraphIdx }) => {
                  const isFocusedTopic = openedChapter.focusTopicId === topic.id;
                  let textParaIndex = 0;

                  return (
                    <section
                      key={topic.id}
                      data-topic-id={topic.id}
                      ref={(el) => {
                        topicSectionRefs.current[topic.id] = el;
                      }}
                      className={`space-y-4 scroll-mt-16 ${
                        isFocusedTopic
                          ? 'rounded-xl bg-indigo-50/35 dark:bg-indigo-950/15 p-3 -mx-3'
                          : ''
                      }`}
                    >
                      {showTopicHeadings && (
                        <h3
                          dir={bookDir}
                          className={`text-base sm:text-lg font-extrabold text-[#0b4f8a] dark:text-sky-300 pb-1.5 border-b-[3px] border-[#4b7bb5]/85 dark:border-sky-500/65 break-words ${
                            bookDir === 'ltr' ? 'text-left' : 'text-right'
                          }`}
                        >
                          {titleSegments.map((seg, sIdx) =>
                            !seg.highlight ? (
                              <React.Fragment key={sIdx}>{seg.text}</React.Fragment>
                            ) : (
                              <mark
                                key={sIdx}
                                data-reader-match="true"
                                className="bg-amber-200/90 dark:bg-amber-500/35 text-slate-950 dark:text-amber-100 rounded px-0.5 font-extrabold transition-colors"
                              >
                                {seg.text}
                              </mark>
                            )
                          )}
                        </h3>
                      )}

                      {topic.htmlContent ? (
                        <RichTopicHtmlView
                          htmlContent={topic.htmlContent}
                          dir={bookDir}
                          fontSizeClass={fontSizeClass}
                          highlightQuery={activeChapterHighlightQuery}
                          onRendered={handleRichTopicRendered}
                        />
                      ) : renderedBlocks.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {bookDir === 'ltr' ? 'No content available.' : 'محتوای متنی ثبت نشده است.'}
                        </p>
                      ) : (
                        <>
                          {fallbackFiguresByParagraphIdx.get(0)?.map((fig) => (
                            <InlineAssetFigure
                              key={fig.assetKey}
                              assetKey={fig.assetKey}
                              alt={`تصویر صفحه ${fig.pageNumber}`}
                              refreshKey={chapterFiguresLoadedTick}
                            />
                          ))}

                          {renderedBlocks.map((block, bIdx) => {
                            if (block.type === 'figure') {
                              return block.assetKey ? (
                                <InlineAssetFigure
                                  key={`${block.assetKey}_${bIdx}`}
                                  assetKey={block.assetKey}
                                  alt={block.alt}
                                  refreshKey={chapterFiguresLoadedTick}
                                />
                              ) : null;
                            }

                            textParaIndex++;
                            const figsAfter = fallbackFiguresByParagraphIdx.get(textParaIndex);

                            const renderMarkedSegments = (segs: HighlightSegment[]) =>
                              segs.map((seg, sIdx) =>
                                !seg.highlight ? (
                                  <React.Fragment key={sIdx}>{seg.text}</React.Fragment>
                                ) : (
                                  <mark
                                    key={sIdx}
                                    data-reader-match="true"
                                    className="bg-amber-200/90 dark:bg-amber-500/35 text-slate-950 dark:text-amber-100 rounded px-0.5 font-semibold transition-colors"
                                  >
                                    {seg.text}
                                  </mark>
                                )
                              );

                            return (
                              <React.Fragment key={bIdx}>
                                {block.type === 'h2' ? (
                                  <h3
                                    dir={bookDir}
                                    className={`text-base sm:text-lg font-extrabold text-[#0b4f8a] dark:text-sky-300 border-b-[3px] border-[#4b7bb5]/85 dark:border-sky-500/65 pb-1.5 pt-3 mb-1 break-words ${
                                      bookDir === 'ltr' ? 'text-left' : 'text-right'
                                    }`}
                                  >
                                    {renderMarkedSegments(block.segments)}
                                  </h3>
                                ) : block.type === 'h3' ? (
                                  <h4
                                    dir={bookDir}
                                    className={`text-[15px] sm:text-base font-bold text-[#0f5b99] dark:text-sky-400 border-b-2 border-[#5b87bd]/65 dark:border-sky-500/45 pb-1 pt-2.5 mb-1 break-words ${
                                      bookDir === 'ltr' ? 'text-left' : 'text-right'
                                    }`}
                                  >
                                    {renderMarkedSegments(block.segments)}
                                  </h4>
                                ) : (
                                  <p
                                    dir={bookDir}
                                    className={`${fontSizeClass} ${
                                      bookDir === 'ltr' ? 'text-left' : 'text-right'
                                    } text-slate-800 dark:text-slate-200 break-words`}
                                  >
                                    {renderMarkedSegments(block.segments)}
                                  </p>
                                )}

                                {figsAfter?.map((fig) => (
                                  <InlineAssetFigure
                                    key={fig.assetKey}
                                    assetKey={fig.assetKey}
                                    alt={`تصویر صفحه ${fig.pageNumber}`}
                                    refreshKey={chapterFiguresLoadedTick}
                                  />
                                ))}
                              </React.Fragment>
                            );
                          })}
                        </>
                      )}
                    </section>
                  );
                }
              )
            )}
          </article>

          {/* Prev / Next Chapter Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={!prevChapter}
              onClick={() => {
                if (!prevChapter) return;
                resetChapterToolbarState();
                setOpenedChapter({
                  bookId: book.id,
                  chapterId: prevChapter.id,
                  fromTab: openedChapter.fromTab,
                  highlightQuery: openedChapter.highlightQuery,
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ChevronRight className="w-4 h-4" />
              <span>سرفصل قبلی</span>
            </button>

            <button
              type="button"
              disabled={!nextChapter}
              onClick={() => {
                if (!nextChapter) return;
                resetChapterToolbarState();
                setOpenedChapter({
                  bookId: book.id,
                  chapterId: nextChapter.id,
                  fromTab: openedChapter.fromTab,
                  highlightQuery: openedChapter.highlightQuery,
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>سرفصل بعدی</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom-Right Floating Controls: Match Prev/Next stacked above Back-to-Top */}
        <div className="fixed bottom-5 right-4 z-40 flex flex-col items-center gap-2">
          {hasFloatingMatchNav && (
            <>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold tabular-nums shadow">
                {`${Math.min(activeMatchIdx + 1, domMatchCount)}/${domMatchCount}`}
              </span>
              <button
                type="button"
                onClick={handlePrevMatch}
                aria-label="نتیجه قبلی"
                title="نتیجه قبلی"
                className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md border border-amber-500/50 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextMatch}
                aria-label="نتیجه بعدی"
                title="نتیجه بعدی"
                className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md border border-amber-500/50 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="بازگشت به بالای صفحه"
            title="بالای صفحه"
            className="w-11 h-11 rounded-full bg-slate-900/90 dark:bg-indigo-600/95 text-white shadow-lg border border-slate-700/40 dark:border-indigo-400/30 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </>
    );
  };

  return (
    <div
      dir="rtl"
      className="min-h-[calc(100vh-2.75rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16"
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".epub,.pdf,.txt,.md,.markdown,.html,.htm,application/epub+zip,application/pdf,text/plain,text/markdown,text/html"
        onChange={(e) => handleFilesSelected(e.target.files)}
        className="hidden"
      />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-5 sm:pt-7 space-y-5">
        {/* Top Header & 3 Primary Tabs (Clean title only, no description) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            کتابخانه
          </h1>

          <div
            role="tablist"
            aria-label="تب‌های کتابخانه"
            className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.12fr)_minmax(0,1.08fr)] sm:flex sm:items-center gap-1 p-1 bg-slate-200/75 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full sm:w-auto shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'search'}
              onClick={() => handleSwitchTab('search')}
              className={`min-w-0 w-full sm:w-auto min-h-[44px] px-1.5 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 overflow-hidden ${
                activeTab === 'search'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Search className="hidden min-[380px]:block w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate leading-tight">سرچ</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'library'}
              onClick={() => handleSwitchTab('library')}
              className={`min-w-0 w-full sm:w-auto min-h-[44px] px-1.5 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 overflow-hidden ${
                activeTab === 'library'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Library className="hidden min-[380px]:block w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate leading-tight">کتاب‌های موجود</span>
              {books.length > 0 && (
                <span className="text-[10px] sm:text-[11px] opacity-75 tabular-nums shrink-0">
                  ({books.length})
                </span>
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'upload'}
              onClick={() => handleSwitchTab('upload')}
              className={`min-w-0 w-full sm:w-auto min-h-[44px] px-1.5 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 overflow-hidden ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Plus className="hidden min-[380px]:block w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate leading-tight">اضافه کردن کتاب</span>
            </button>
          </div>
        </div>

        {(uploadError || dbError) && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/70 rounded-2xl p-4 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-200 break-words">
                {uploadError || dbError}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setUploadError(null);
                setDbError(null);
              }}
              aria-label="بستن پیام خطا"
              className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {isLoadingDb ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-sm text-slate-500 dark:text-slate-400">
            در حال بارگذاری کتابخانه...
          </div>
        ) : openedChapter && openedChapterData ? (
          renderChapterContentView()
        ) : activeTab === 'search' ? (
          /* ================= TAB 1: FAST SEARCH ACROSS ALL BOOKS (MAIN TOPICS ONLY) ================= */
          <div className="space-y-4">
            {books.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-4">
                <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <div className="space-y-1.5">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    هنوز کتابی برای جستجو اضافه نشده است
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    ابتدا از تب «اضافه کردن کتاب» یک یا چند کتاب الکترونیکی وارد کنید تا موتور سرچ
                    در همه منابع فعال شود.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>رفتن به تب اضافه کردن کتاب</span>
                </button>
              </div>
            ) : (
              <>
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchQueryChange(e.target.value)}
                      placeholder={`جستجو در تمام ${books.length} کتاب موجود...`}
                      className="w-full min-h-[48px] pr-10 pl-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => handleSearchQueryChange('')}
                        aria-label="پاک کردن جستجو"
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isSearchActive && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                      <span>
                        <strong className="text-slate-900 dark:text-white tabular-nums">
                          {searchResults.totalMatchingTopics}
                        </strong>{' '}
                        تاپیک مرتبط در{' '}
                        <strong className="text-slate-900 dark:text-white tabular-nums">
                          {searchResults.groups.length}
                        </strong>{' '}
                        کتاب یافت شد
                      </span>

                      <button
                        type="button"
                        onClick={() => handleSearchQueryChange('')}
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                      >
                        پاک کردن جستجو
                      </button>
                    </div>
                  )}
                </section>

                {/* Results: Bold Main Topic Titles Grouped per Book -> Chapter */}
                {!isSearchActive ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-10 text-center space-y-2">
                    <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      جستجوی سراسری در {books.length} کتاب موجود
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                      کلمه مورد نظر را بنویسید تا تاپیک‌های اصلی مرتبط به تفکیک هر کتاب و سرفصل
                      نمایش داده شوند.
                    </p>
                  </div>
                ) : searchResults.groups.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-2">
                    <Search className="w-9 h-9 text-slate-300 dark:text-slate-600 mx-auto" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      نتیجه‌ای یافت نشد
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      عبارت دیگری را امتحان کنید.
                    </p>
                  </div>
                ) : (
                  <section className="space-y-4">
                    {searchResults.groups.map((bookGroup) => {
                      const bookDir = getBookDir(bookGroup.book);
                      return (
                        <div
                          key={bookGroup.book.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
                        >
                          {/* Book Header */}
                          <div className="px-4 sm:px-5 py-3.5 bg-slate-50/90 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <BookMarked className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                              <div
                                dir={bookDir}
                                className={`min-w-0 flex-1 ${
                                  bookDir === 'ltr' ? 'text-left' : 'text-right'
                                }`}
                              >
                                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white break-words">
                                  {bookGroup.book.title}
                                </h2>
                                <p dir="rtl" className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
                                  <span>{bookGroup.book.format.toUpperCase()}</span>
                                  <span aria-hidden="true"> · </span>
                                  <span className="tabular-nums">{bookGroup.chapters.length} سرفصل</span>
                                  <span aria-hidden="true"> · </span>
                                  <span className="tabular-nums">
                                    {bookGroup.chapters.reduce((a, c) => a + c.topicHits.length, 0)} تاپیک
                                  </span>
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenLibraryBook(bookGroup.book)}
                              className="min-h-[38px] px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                            >
                              سرفصل‌های کتاب
                            </button>
                          </div>

                          {/* Chapters & Main Topic Hit List */}
                          <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            {bookGroup.chapters.map((chapGroup) => (
                              <div key={chapGroup.chapter.id} className="p-4 sm:p-5 space-y-2.5">
                                <div
                                  dir={bookDir}
                                  className={`flex items-center justify-between gap-2 ${
                                    bookDir === 'ltr' ? 'text-left' : 'text-right'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FolderTree className="w-4 h-4 text-slate-400 shrink-0" />
                                    <h3 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 break-words">
                                      {searchResults.effectiveQuery.trim()
                                        ? renderSegments(
                                            highlightTextSegments(
                                              chapGroup.chapter.title,
                                              searchResults.effectiveQuery
                                            )
                                          )
                                        : chapGroup.chapter.title}
                                    </h3>
                                  </div>
                                </div>

                                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
                                  {chapGroup.topicHits.map((hit) => (
                                    <button
                                      key={hit.topic.id}
                                      type="button"
                                      onClick={() =>
                                        handleOpenChapterFromSearch(
                                          bookGroup.book,
                                          hit.chapterId,
                                          hit.topic.id,
                                          searchResults.effectiveQuery
                                        )
                                      }
                                      dir={bookDir}
                                      className={`w-full min-h-[46px] px-3.5 py-2.5 bg-white dark:bg-slate-900 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                                        bookDir === 'ltr' ? 'text-left' : 'text-right'
                                      }`}
                                    >
                                      <span className="text-xs sm:text-sm font-extrabold text-indigo-800 dark:text-indigo-200 break-words min-w-0 flex-1">
                                        {searchResults.effectiveQuery.trim()
                                          ? renderSegments(
                                              highlightTextSegments(
                                                hit.topic.title,
                                                searchResults.effectiveQuery
                                              )
                                            )
                                          : hit.topic.title}
                                      </span>

                                      <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
                                        {hit.topic.pageStart ? (
                                          <span className="tabular-nums">
                                            {bookDir === 'ltr'
                                              ? `p.${hit.topic.pageStart}`
                                              : `ص ${hit.topic.pageStart}`}
                                          </span>
                                        ) : null}
                                        {bookDir === 'ltr' ? (
                                          <ChevronRight className="w-4 h-4 text-slate-400" />
                                        ) : (
                                          <ChevronLeft className="w-4 h-4 text-slate-400" />
                                        )}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </section>
                )}
              </>
            )}
          </div>
        ) : activeTab === 'library' ? (
          /* ================= TAB 2: EXISTING BOOKS TAB ================= */
          books.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-4">
              <Library className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="space-y-1.5">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  هنوز کتابی در کتابخانه موجود نیست
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  از تب «اضافه کردن کتاب» فایل EPUB، PDF یا متنی خود را انتخاب کنید تا در این بخش
                  ذخیره شود.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>اضافه کردن کتاب</span>
              </button>
            </div>
          ) : selectedLibraryBook ? (
            /* Level 2: Clean Chapter List WITHOUT Details */
            (() => {
              const bookDir = getBookDir(selectedLibraryBook);
              return (
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div
                      dir={bookDir}
                      className={`min-w-0 flex-1 ${bookDir === 'ltr' ? 'text-left' : 'text-right'}`}
                    >
                      <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white break-words">
                        {selectedLibraryBook.title}
                      </h2>
                      <p dir="rtl" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 text-right">
                        <span>{selectedLibraryBook.format.toUpperCase()}</span>
                        <span aria-hidden="true"> · </span>
                        <span className="tabular-nums">{selectedLibraryBook.chapters.length} سرفصل</span>
                        {selectedLibraryBook.author ? (
                          <>
                            <span aria-hidden="true"> · </span>
                            <span dir={bookDir}>{selectedLibraryBook.author}</span>
                          </>
                        ) : null}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedLibraryBookId(null)}
                      aria-label="بازگشت به همه کتاب‌ها"
                      title="بازگشت"
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedLibraryBook.chapters.map((chapter, idx) => (
                      <button
                        key={chapter.id}
                        type="button"
                        dir={bookDir}
                        onClick={() => handleOpenChapterFromLibrary(selectedLibraryBook, chapter)}
                        className={`w-full min-h-[54px] px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer ${
                          bookDir === 'ltr' ? 'text-left' : 'text-right'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-xs font-mono-ltr font-bold text-indigo-600 dark:text-indigo-400 tabular-nums shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm sm:text-[15px] font-bold text-slate-800 dark:text-slate-100 break-words">
                            {chapter.title}
                          </span>
                        </div>

                        {bookDir === 'ltr' ? (
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronLeft className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              );
            })()
          ) : (
            /* Level 1: Clickable Book Cards directly */
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => {
                const bookDir = getBookDir(book);
                const isEditing = editingBookId === book.id;
                const isConfirmingDelete = confirmDeleteId === book.id;

                return (
                  <article
                    key={book.id}
                    onClick={() => {
                      if (!isEditing && !isConfirmingDelete) {
                        setSelectedLibraryBookId(book.id);
                      }
                    }}
                    className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-colors ${
                      !isEditing && !isConfirmingDelete
                        ? 'hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer group'
                        : ''
                    }`}
                  >
                    {isEditing ? (
                      <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                            عنوان کتاب
                          </label>
                          <input
                            type="text"
                            dir={bookDir}
                            value={editTitleInput}
                            onChange={(e) => setEditTitleInput(e.target.value)}
                            className="w-full min-h-[40px] px-3 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                            نویسنده (اختیاری)
                          </label>
                          <input
                            type="text"
                            dir={bookDir}
                            value={editAuthorInput}
                            onChange={(e) => setEditAuthorInput(e.target.value)}
                            className="w-full min-h-[40px] px-3 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingBookId(null)}
                            className="min-h-[38px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            انصراف
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveBookMeta(book.id)}
                            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>ذخیره</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2.5 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/70 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div
                              className="flex items-center gap-1 shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => handleStartEditBook(book)}
                                aria-label="ویرایش مشخصات کتاب"
                                title="ویرایش مشخصات کتاب"
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmDeleteId((prev) => (prev === book.id ? null : book.id))
                                }
                                aria-label="حذف کتاب"
                                title="حذف کتاب"
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h2
                              dir={bookDir}
                              className={`text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug break-words ${
                                bookDir === 'ltr' ? 'text-left' : 'text-right'
                              }`}
                            >
                              {book.title}
                            </h2>

                            {book.author && (
                              <p
                                dir={bookDir}
                                className={`text-xs text-slate-500 dark:text-slate-400 truncate ${
                                  bookDir === 'ltr' ? 'text-left' : 'text-right'
                                }`}
                              >
                                {book.author}
                              </p>
                            )}

                            <p dir="rtl" className="text-xs text-slate-500 dark:text-slate-400 pt-1 text-right">
                              <span>{book.format.toUpperCase()}</span>
                              <span aria-hidden="true"> · </span>
                              <span>{bookDir === 'ltr' ? 'انگلیسی (LTR)' : 'فارسی (RTL)'}</span>
                              <span aria-hidden="true"> · </span>
                              <span className="tabular-nums">{book.chapters.length} سرفصل</span>
                              <span aria-hidden="true"> · </span>
                              <span className="tabular-nums">{formatBytes(book.fileSize)}</span>
                            </p>
                          </div>
                        </div>

                        {isConfirmingDelete && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/70 flex items-center justify-between gap-2"
                          >
                            <span className="text-xs font-semibold text-rose-800 dark:text-rose-200">
                              کتاب حذف شود؟
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
                              >
                                خیر
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBook(book.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </article>
                );
              })}
            </section>
          )
        ) : (
          /* ================= TAB 3: ADD BOOK TAB ================= */
          <section className="space-y-4">
            {isParsing && parseProgress && (
              <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {parseQueueLabel}
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {parseProgress.stage}
                    </p>
                  </div>
                  <span className="text-sm font-mono-ltr font-bold text-indigo-600 dark:text-indigo-400 tabular-nums shrink-0">
                    {parseProgress.percent}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-200 rounded-full"
                    style={{ width: `${Math.max(4, Math.min(100, parseProgress.percent))}%` }}
                  />
                </div>
              </div>
            )}

            {recentlyAddedBook && !isParsing && (
              <div className="bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 break-words">
                      کتاب «{recentlyAddedBook.title}» با موفقیت اضافه شد
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5 tabular-nums">
                      {recentlyAddedBook.chapters.length} سرفصل استخراج و در کتابخانه ذخیره شد.
                    </p>
                    {recentlyAddedQuotaNote && (
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                        {recentlyAddedQuotaNote}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenLibraryBook(recentlyAddedBook)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    مشاهده سرفصل‌ها
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('search')}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                  >
                    رفتن به سرچ
                  </button>
                </div>
              </div>
            )}

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFilesSelected(e.dataTransfer.files);
              }}
              className={`bg-white dark:bg-slate-900 border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center transition-colors ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/70 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-7 h-7" />
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                افزودن کتاب الکترونیکی از موبایل یا کامپیوتر
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto leading-relaxed">
                فایل کتاب (فارسی یا انگلیسی) را انتخاب کنید یا اینجا رها کنید. متن، سرفصل‌ها،
                تصاویر، جداول و الگوریتم‌های کتاب استخراج و برای استفاده آفلاین ذخیره می‌شوند.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={isParsing}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>انتخاب فایل کتاب از گوشی</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 mt-5">
                فرمت‌های پشتیبانی‌شده: EPUB · PDF · TXT · Markdown · HTML (امکان انتخاب چند کتاب هم‌زمان)
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default EbookModule;
