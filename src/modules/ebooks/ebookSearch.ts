import { normalizeSearchText } from '../../utils/smartSearch';
import { EbookChapter, EbookRecord, EbookTopic } from './types';

export type SearchScope = 'all' | 'headings' | 'content';

export interface HighlightSegment {
  text: string;
  highlight: boolean;
}

export interface TopicSearchHit {
  bookId: string;
  bookTitle: string;
  chapterId: string;
  chapterTitle: string;
  topic: EbookTopic;
  clinicalTier: number;
  score: number;
  matchCount: number;
  titleMatched: boolean;
  chapterMatched: boolean;
  snippets: HighlightSegment[][];
}

export interface ChapterSearchGroup {
  chapter: EbookChapter;
  chapterMatched: boolean;
  totalHits: number;
  topicHits: TopicSearchHit[];
}

export interface BookSearchGroup {
  book: EbookRecord;
  totalHits: number;
  chapters: ChapterSearchGroup[];
}

export interface EbookSearchFilters {
  query: string;
  bookId: string; // 'all' or specific book id
  chapterId: string; // 'all' or specific chapter id
  topicId: string; // 'all' or specific topic id
  scope: SearchScope;
  autoCorrect?: boolean;
  includeSnippets?: boolean;
}

export interface TokenCorrection {
  from: string;
  to: string;
  suggestions: string[];
}

export interface QueryCorrectionResult {
  originalQuery: string;
  correctedQuery: string;
  wasCorrected: boolean;
  corrections: TokenCorrection[];
}

/**
 * Clinical topic priority ranking:
 * 5: Management / Treatment (منیجمنت / درمان)
 * 4: Disposition / Follow-up (دیسپوزیشن / تعیین تکلیف)
 * 3: Diagnostic Evaluation / Diagnosis (ارزیابی تشخیصی / تشخیص)
 * 2: Clinical Manifestations / Features (علائم و تظاهرات بالینی)
 * 1: Pathophysiology / Etiology (پاتوفیزیولوژی)
 * 0: Other topics
 */
export function getClinicalTopicTier(title: string): number {
  const norm = normalizeSearchText(title);
  if (!norm) return 0;

  // 5. Management / Treatment
  if (
    /\b(management|treatment|treatments|therapy|therapies|therapeutic|resuscitation|stabilization|pharmacotherapy|intervention|interventions|initial care|acute management|emergent management)\b/.test(norm) ||
    /(درمان|منیجمنت|تدابیر درمانی|اقدامات درمانی|مدیریت بیمار|احیا)/.test(norm)
  ) {
    return 5;
  }

  // 4. Disposition
  if (
    /\b(disposition|discharge|admission|follow up|followup|consultation|referral|hospitalization|transfer)\b/.test(norm) ||
    /(دیسپوزیشن|تعیین تکلیف|ترخیص|بستری|ارجاع|پیگیری)/.test(norm)
  ) {
    return 4;
  }

  // 3. Diagnostic Evaluation
  if (
    /\b(diagnosis|diagnostic|diagnostics|evaluation|workup|laboratory|imaging|radiology|differential|testing|assessment|ekg|ecg)\b/.test(norm) ||
    /(ارزیابی تشخیصی|تشخیص افتراقی|تشخیص|بررسی های تشخیصی|آزمایش|تصویربرداری|پاراکلینیک)/.test(norm)
  ) {
    return 3;
  }

  // 2. Clinical Manifestations
  if (
    /\b(clinical manifestation|clinical manifestations|clinical features|clinical feature|clinical presentation|signs and symptoms|symptoms|physical exam|physical examination|history and physical|presentation|manifestations)\b/.test(norm) ||
    /(علایم بالینی|علائم بالینی|تظاهرات بالینی|یافته های بالینی|شرح حال|معاینه بالینی|نشانه ها)/.test(norm)
  ) {
    return 2;
  }

  // 1. Pathophysiology
  if (
    /\b(pathophysiology|pathogenesis|etiology|epidemiology|mechanism|mechanisms)\b/.test(norm) ||
    /(پاتوفیزیولوژی|فیزیوپاتولوژی|پاتوژنز|اتیولوژی|اپیدمیولوژی|مکانیسم)/.test(norm)
  ) {
    return 1;
  }

  return 0;
}

function normalizeCharForMap(ch: string): string {
  const code = ch.charCodeAt(0);
  if (
    (code >= 0x064b && code <= 0x065f) ||
    code === 0x0670 ||
    code === 0x0640 ||
    code === 0x0621 ||
    code === 0x200c ||
    code === 0x200d
  ) {
    return '';
  }
  if (ch >= '۰' && ch <= '۹') return String(code - 0x06f0);
  if (ch >= '٠' && ch <= '٩') return String(code - 0x0660);

  switch (ch) {
    case 'آ':
    case 'أ':
    case 'إ':
    case 'ٱ':
    case 'ٲ':
    case 'ٳ':
      return 'ا';
    case 'ي':
    case 'ی':
    case 'ى':
    case 'ئ':
      return 'ی';
    case 'ك':
    case 'ک':
      return 'ک';
    case 'ۀ':
    case 'ة':
    case 'ه':
      return 'ه';
    case 'ؤ':
      return 'و';
    default:
      return ch.toLowerCase();
  }
}

function buildNormIndexMap(text: string): { norm: string; map: number[] } {
  let norm = '';
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const mapped = normalizeCharForMap(text[i]);
    for (let j = 0; j < mapped.length; j++) {
      norm += mapped[j];
      map.push(i);
    }
  }
  return { norm, map };
}

function getQueryTokens(query: string): string[] {
  const norm = normalizeSearchText(query);
  if (!norm) return [];
  const rawTokens = norm.split(' ').filter(Boolean);
  return Array.from(new Set(rawTokens)).sort((a, b) => b.length - a.length);
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle || !haystack) return 0;
  let count = 0;
  let idx = 0;
  while ((idx = haystack.indexOf(needle, idx)) !== -1) {
    count++;
    idx += needle.length;
    if (count > 80) break;
  }
  return count;
}

function isBoundaryChar(ch: string | undefined): boolean {
  if (!ch) return true;
  return !/[a-z0-9\u0600-\u06FF]/i.test(ch);
}

function countWholeWordOccurrences(haystack: string, needle: string): number {
  if (!needle || !haystack) return 0;
  let count = 0;
  let idx = 0;
  while ((idx = haystack.indexOf(needle, idx)) !== -1) {
    const before = idx === 0 ? undefined : haystack[idx - 1];
    const after = idx + needle.length >= haystack.length ? undefined : haystack[idx + needle.length];
    if (isBoundaryChar(before) && isBoundaryChar(after)) {
      count++;
      if (count > 60) break;
    }
    idx += needle.length;
  }
  return count;
}

function countWordStartOccurrences(haystack: string, needle: string): number {
  if (!needle || !haystack) return 0;
  let count = 0;
  let idx = 0;
  while ((idx = haystack.indexOf(needle, idx)) !== -1) {
    const before = idx === 0 ? undefined : haystack[idx - 1];
    if (isBoundaryChar(before)) {
      count++;
      if (count > 60) break;
    }
    idx += needle.length;
  }
  return count;
}

function hasTokenProximity(haystack: string, tokens: string[], maxWindow = 140): boolean {
  if (tokens.length < 2 || !haystack) return false;
  const firstToken = tokens[0];
  let idx = 0;
  let checked = 0;
  while ((idx = haystack.indexOf(firstToken, idx)) !== -1 && checked < 12) {
    checked++;
    const slice = haystack.slice(Math.max(0, idx - maxWindow), Math.min(haystack.length, idx + maxWindow));
    if (tokens.every((t) => slice.includes(t))) {
      return true;
    }
    idx += firstToken.length;
  }
  return false;
}

// ---------- Fast Cached Vocabulary & Typo Correction Engine ----------

interface BookVocabCache {
  freq: Map<string, number>;
  byLength: Map<number, string[]>;
  byPhonetic: Map<string, string[]>;
  allTitleCorpus: string;
}

const vocabCache = new WeakMap<EbookRecord, BookVocabCache>();

function phoneticFold(word: string): string {
  return word
    .replace(/[طت]/g, 'ت')
    .replace(/[صثس]/g, 'س')
    .replace(/[ضذظز]/g, 'ز')
    .replace(/[غق]/g, 'ق')
    .replace(/[حه]/g, 'ه')
    .replace(/[عآا]/g, 'ا')
    .replace(/ph/g, 'f')
    .replace(/ae|oe/g, 'e')
    .replace(/y/g, 'i')
    .replace(/ck/g, 'k')
    .replace(/(.)\1+/g, '$1');
}

function getBookVocab(book: EbookRecord): BookVocabCache {
  const cached = vocabCache.get(book);
  if (cached) return cached;

  const freq = new Map<string, number>();
  const titleParts: string[] = [normalizeSearchText(book.title)];

  const addWords = (normalizedText: string, weight: number) => {
    if (!normalizedText) return;
    let start = 0;
    const len = normalizedText.length;
    while (start < len) {
      let end = normalizedText.indexOf(' ', start);
      if (end === -1) end = len;
      const wLen = end - start;
      if (wLen >= 3) {
        const w = normalizedText.slice(start, end);
        const firstCode = w.charCodeAt(0);
        if (firstCode < 48 || firstCode > 57 || !/^\d+$/.test(w)) {
          freq.set(w, (freq.get(w) || 0) + weight);
        }
      }
      start = end + 1;
    }
  };

  addWords(titleParts[0], 20);
  for (let c = 0; c < book.chapters.length; c++) {
    const ch = book.chapters[c];
    titleParts.push(ch.normalizedTitle);
    addWords(ch.normalizedTitle, 15);
    for (let t = 0; t < ch.topics.length; t++) {
      const tp = ch.topics[t];
      titleParts.push(tp.normalizedTitle);
      addWords(tp.normalizedTitle, 12);
      addWords(tp.normalizedContent, 1);
    }
  }

  const byLength = new Map<number, string[]>();
  const byPhonetic = new Map<string, string[]>();

  for (const w of freq.keys()) {
    const lenArr = byLength.get(w.length);
    if (lenArr) lenArr.push(w);
    else byLength.set(w.length, [w]);

    const ph = phoneticFold(w);
    if (ph.length >= 2) {
      const phArr = byPhonetic.get(ph);
      if (phArr) phArr.push(w);
      else byPhonetic.set(ph, [w]);
    }
  }

  const built: BookVocabCache = {
    freq,
    byLength,
    byPhonetic,
    allTitleCorpus: titleParts.join(' '),
  };
  vocabCache.set(book, built);
  return built;
}

function damerauLevenshtein(a: string, b: string, maxDist: number): number {
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > maxDist) return maxDist + 1;
  if (a === b) return 0;

  const dp: number[][] = Array.from({ length: la + 1 }, () => new Array(lb + 1).fill(0));
  for (let i = 0; i <= la; i++) dp[i][0] = i;
  for (let j = 0; j <= lb; j++) dp[0][j] = j;

  for (let i = 1; i <= la; i++) {
    let rowMin = maxDist + 1;
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let val = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        val = Math.min(val, dp[i - 2][j - 2] + 1);
      }
      dp[i][j] = val;
      if (val < rowMin) rowMin = val;
    }
    if (rowMin > maxDist + 1) return maxDist + 1;
  }

  return dp[la][lb];
}

function findWordSuggestions(
  token: string,
  vocabs: BookVocabCache[]
): { best: string | null; alternatives: string[] } {
  if (token.length < 4 || /^\d+$/.test(token)) {
    return { best: null, alternatives: [] };
  }

  for (const v of vocabs) {
    if (v.freq.has(token)) {
      return { best: null, alternatives: [] };
    }
  }

  const maxDist = token.length <= 6 ? 1 : 2;
  const tokenPhonetic = phoneticFold(token);
  const candidateFreq = new Map<string, number>();

  for (const v of vocabs) {
    const phList = v.byPhonetic.get(tokenPhonetic);
    if (phList) {
      for (const w of phList) {
        if (damerauLevenshtein(token, w, maxDist) <= maxDist) {
          candidateFreq.set(w, (candidateFreq.get(w) || 0) + (v.freq.get(w) || 1));
        }
      }
    }
  }

  for (const v of vocabs) {
    for (let len = Math.max(3, token.length - maxDist); len <= token.length + maxDist; len++) {
      const words = v.byLength.get(len);
      if (!words) continue;
      const limitFastFilter = words.length > 1200;
      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        if (
          limitFastFilter &&
          w[0] !== token[0] &&
          w[w.length - 1] !== token[token.length - 1] &&
          w[1] !== token[1]
        ) {
          continue;
        }
        if (candidateFreq.has(w)) {
          candidateFreq.set(w, (candidateFreq.get(w) || 0) + (v.freq.get(w) || 1));
          continue;
        }
        const d = damerauLevenshtein(token, w, maxDist);
        if (d <= maxDist) {
          candidateFreq.set(w, v.freq.get(w) || 1);
        }
      }
    }
  }

  if (candidateFreq.size === 0) {
    if (token.length >= 6) {
      for (let splitAt = 3; splitAt <= token.length - 3; splitAt++) {
        const left = token.slice(0, splitAt);
        const right = token.slice(splitAt);
        if (vocabs.some((v) => v.freq.has(left)) && vocabs.some((v) => v.freq.has(right))) {
          return { best: `${left} ${right}`, alternatives: [`${left} ${right}`] };
        }
      }
    }
    return { best: null, alternatives: [] };
  }

  const scored: Array<{ word: string; score: number }> = [];
  for (const [w, f] of candidateFreq.entries()) {
    const d = damerauLevenshtein(token, w, maxDist + 1);
    const isPhoneticMatch = phoneticFold(w) === tokenPhonetic ? 1 : 0;
    const sameStart = w[0] === token[0] ? 1 : 0;
    const sameEnd = w[w.length - 1] === token[token.length - 1] ? 1 : 0;
    const score =
      isPhoneticMatch * 120 +
      (maxDist + 1 - Math.min(d, maxDist + 1)) * 90 +
      sameStart * 25 +
      sameEnd * 15 +
      Math.min(35, Math.log1p(f) * 6);
    if (score >= 130) {
      scored.push({ word: w, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const topWords = scored.slice(0, 4).map((s) => s.word);

  return {
    best: topWords[0] || null,
    alternatives: topWords,
  };
}

export function correctQueryForBooks(
  rawQuery: string,
  books: EbookRecord[],
  bookId = 'all'
): QueryCorrectionResult {
  const norm = normalizeSearchText(rawQuery);
  if (!norm || books.length === 0) {
    return {
      originalQuery: rawQuery,
      correctedQuery: rawQuery,
      wasCorrected: false,
      corrections: [],
    };
  }

  const scopedBooks = bookId === 'all' ? books : books.filter((b) => b.id === bookId);
  if (scopedBooks.length === 0) {
    return {
      originalQuery: rawQuery,
      correctedQuery: rawQuery,
      wasCorrected: false,
      corrections: [],
    };
  }

  const vocabs = scopedBooks.map(getBookVocab);
  const tokens = norm.split(' ').filter(Boolean);

  const tokenAppearsInBooks = (tok: string): boolean => {
    for (const v of vocabs) {
      if (v.freq.has(tok)) return true;
      if (v.allTitleCorpus.includes(tok)) return true;
    }
    if (tok.length >= 3) {
      for (const v of vocabs) {
        for (const [len, words] of v.byLength.entries()) {
          if (len <= tok.length) continue;
          for (let i = 0; i < words.length; i++) {
            if (words[i].startsWith(tok)) return true;
          }
        }
      }
    }
    return false;
  };

  const mergedTokens: string[] = [];
  const corrections: TokenCorrection[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const cur = tokens[i];
    const next = tokens[i + 1];

    if (next && cur.length >= 2 && next.length >= 2) {
      const joined = `${cur}${next}`;
      const joinedExists = vocabs.some((v) => v.freq.has(joined));
      if (joinedExists && (!tokenAppearsInBooks(cur) || !tokenAppearsInBooks(next))) {
        mergedTokens.push(joined);
        corrections.push({
          from: `${cur} ${next}`,
          to: joined,
          suggestions: [joined],
        });
        i++;
        continue;
      }
    }

    if (tokenAppearsInBooks(cur)) {
      mergedTokens.push(cur);
      continue;
    }

    const { best, alternatives } = findWordSuggestions(cur, vocabs);
    if (best) {
      mergedTokens.push(best);
      corrections.push({
        from: cur,
        to: best,
        suggestions: alternatives,
      });
    } else {
      mergedTokens.push(cur);
    }
  }

  const correctedQuery = mergedTokens.join(' ');
  return {
    originalQuery: rawQuery,
    correctedQuery,
    wasCorrected: corrections.length > 0 && correctedQuery !== norm,
    corrections,
  };
}

// ---------- Highlight & Snippets ----------

export function highlightTextSegments(text: string, query: string): HighlightSegment[] {
  if (!text) return [];
  const tokens = getQueryTokens(query);
  if (tokens.length === 0) return [{ text, highlight: false }];

  const { norm, map } = buildNormIndexMap(text);
  const ranges: Array<[number, number]> = [];

  for (const token of tokens) {
    if (!token) continue;
    let searchFrom = 0;
    while (searchFrom < norm.length) {
      const idx = norm.indexOf(token, searchFrom);
      if (idx === -1) break;
      const before = idx === 0 ? undefined : norm[idx - 1];
      const after = idx + token.length >= norm.length ? undefined : norm[idx + token.length];
      // For <= 2 char tokens (e.g., "PE", "ED"), require full word boundaries; for 3 chars require word-start
      const validBoundary =
        token.length > 3
          ? true
          : token.length <= 2
            ? isBoundaryChar(before) && isBoundaryChar(after)
            : isBoundaryChar(before);
      if (validBoundary) {
        const startOrig = map[idx];
        const endNormIdx = Math.min(norm.length - 1, idx + token.length - 1);
        const endOrig = map[endNormIdx] + 1;
        if (startOrig !== undefined && endOrig > startOrig) {
          ranges.push([startOrig, endOrig]);
        }
      }
      searchFrom = idx + token.length;
      if (ranges.length > 300) break;
    }
  }

  if (ranges.length === 0) return [{ text, highlight: false }];

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) {
      last[1] = Math.max(last[1], r[1]);
    } else {
      merged.push([r[0], r[1]]);
    }
  }

  const segments: HighlightSegment[] = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), highlight: false });
    }
    segments.push({ text: text.slice(start, end), highlight: true });
    cursor = end;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), highlight: false });
  }
  return segments;
}

function extractSnippets(content: string, query: string, maxSnippets = 2): HighlightSegment[][] {
  if (!content) return [];
  const tokens = getQueryTokens(query);
  if (tokens.length === 0) return [];

  const { norm, map } = buildNormIndexMap(content);
  const hitPositions: number[] = [];

  for (const token of tokens) {
    let idx = 0;
    let foundForToken = 0;
    while ((idx = norm.indexOf(token, idx)) !== -1) {
      const origPos = map[idx];
      if (origPos !== undefined) {
        hitPositions.push(origPos);
      }
      idx += token.length;
      foundForToken++;
      if (foundForToken >= 3) break;
    }
  }

  if (hitPositions.length === 0) return [];
  hitPositions.sort((a, b) => a - b);

  const windows: Array<[number, number]> = [];
  const radiusBefore = 70;
  const radiusAfter = 140;

  for (const pos of hitPositions) {
    const start = Math.max(0, pos - radiusBefore);
    const end = Math.min(content.length, pos + radiusAfter);
    const overlapsExisting = windows.some(([ws, we]) => start <= we + 20 && end >= ws - 20);
    if (!overlapsExisting) {
      windows.push([start, end]);
      if (windows.length >= maxSnippets) break;
    }
  }

  return windows.map(([s, e]) => {
    let cleanStart = s;
    let cleanEnd = e;
    if (cleanStart > 0) {
      const nextSpace = content.indexOf(' ', cleanStart);
      if (nextSpace !== -1 && nextSpace - cleanStart < 18) cleanStart = nextSpace + 1;
    }
    if (cleanEnd < content.length) {
      const prevSpace = content.lastIndexOf(' ', cleanEnd);
      if (prevSpace > cleanStart + 40 && cleanEnd - prevSpace < 20) cleanEnd = prevSpace;
    }

    const prefix = cleanStart > 0 ? '… ' : '';
    const suffix = cleanEnd < content.length ? ' …' : '';
    const slice = `${prefix}${content.slice(cleanStart, cleanEnd).replace(/\s+/g, ' ').trim()}${suffix}`;
    return highlightTextSegments(slice, query);
  });
}

// ---------- Main Search Execution ----------

export function searchEbooks(
  books: EbookRecord[],
  filters: EbookSearchFilters
): {
  groups: BookSearchGroup[];
  totalMatchingTopics: number;
  totalMatchOccurrences: number;
  effectiveQuery: string;
  correction: QueryCorrectionResult;
} {
  const useAutoCorrect = filters.autoCorrect !== false;
  const includeSnippets = filters.includeSnippets === true;

  const correction: QueryCorrectionResult = useAutoCorrect
    ? correctQueryForBooks(filters.query, books, filters.bookId)
    : {
        originalQuery: filters.query,
        correctedQuery: filters.query,
        wasCorrected: false,
        corrections: [],
      };

  const effectiveQuery = correction.wasCorrected ? correction.correctedQuery : filters.query;
  const normQuery = normalizeSearchText(effectiveQuery);
  const tokens = normQuery ? normQuery.split(' ').filter(Boolean) : [];
  const hasQuery = tokens.length > 0;

  interface CandidateHit extends TopicSearchHit {
    isWordBoundaryMatch: boolean;
  }

  const bookEntries: Array<{
    book: EbookRecord;
    maxBookScore: number;
    chapters: Array<{
      chapter: EbookChapter;
      chapterMatched: boolean;
      hits: CandidateHit[];
    }>;
  }> = [];

  let anyWholeWordAcrossLibrary = false;

  for (const book of books) {
    if (filters.bookId !== 'all' && book.id !== filters.bookId) continue;

    const normBookTitle = normalizeSearchText(`${book.title} ${book.author || ''}`);
    const bookTitleMatches = hasQuery && tokens.every((t) => normBookTitle.includes(t));

    const chapterEntries: Array<{
      chapter: EbookChapter;
      chapterMatched: boolean;
      hits: CandidateHit[];
    }> = [];
    let maxBookScore = 0;

    for (const chapter of book.chapters) {
      if (filters.chapterId !== 'all' && chapter.id !== filters.chapterId) continue;

      const chapterMatchesAll =
        hasQuery && tokens.every((t) => chapter.normalizedTitle.includes(t));
      const chapterPhraseMatch =
        hasQuery && normQuery.length >= 2 && chapter.normalizedTitle.includes(normQuery);

      const hits: CandidateHit[] = [];

      for (const topic of chapter.topics) {
        if (filters.topicId !== 'all' && topic.id !== filters.topicId) continue;

        const clinicalTier = getClinicalTopicTier(topic.title);

        if (!hasQuery) {
          hits.push({
            bookId: book.id,
            bookTitle: book.title,
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            topic,
            clinicalTier,
            score: 1,
            matchCount: 1,
            titleMatched: false,
            chapterMatched: false,
            snippets: [],
            isWordBoundaryMatch: true,
          });
          continue;
        }

        const topicTitleMatchesAll = tokens.every((t) => topic.normalizedTitle.includes(t));
        const contentMatchesAll =
          filters.scope !== 'headings' &&
          tokens.every((t) => topic.normalizedContent.includes(t));

        let isHit = false;
        if (filters.scope === 'headings') {
          isHit =
            topicTitleMatchesAll ||
            chapterMatchesAll ||
            bookTitleMatches ||
            tokens.every((t) => `${chapter.normalizedTitle} ${topic.normalizedTitle}`.includes(t));
        } else if (filters.scope === 'content') {
          isHit = contentMatchesAll;
        } else {
          isHit =
            topicTitleMatchesAll ||
            chapterMatchesAll ||
            contentMatchesAll ||
            tokens.every(
              (t) =>
                topic.normalizedTitle.includes(t) ||
                chapter.normalizedTitle.includes(t) ||
                topic.normalizedContent.includes(t)
            );
        }

        if (!isHit) continue;

        // Require word-boundary / word-start match for short tokens (<= 3 chars) so "pe" doesn't match "paper"
        const combinedHaystack = `${chapter.normalizedTitle} ${topic.normalizedTitle} ${topic.normalizedContent}`;
        const everyTokenWordStart = tokens.every(
          (t) => countWordStartOccurrences(combinedHaystack, t) > 0
        );
        if (tokens.some((t) => t.length <= 3) && !everyTokenWordStart) {
          continue;
        }

        const everyTokenWholeWord = tokens.every(
          (t) => countWholeWordOccurrences(combinedHaystack, t) > 0
        );
        if (everyTokenWholeWord) {
          anyWholeWordAcrossLibrary = true;
        }

        let score = 0;
        let occurrences = 0;

        // Strong phrase & title relevance signals
        if (normQuery.length >= 2 && topic.normalizedTitle.includes(normQuery)) score += 600;
        if (chapterPhraseMatch) score += 420;
        if (topicTitleMatchesAll) score += 320;
        if (chapterMatchesAll) score += 220;
        if (normQuery.length >= 3 && topic.normalizedContent.includes(normQuery)) score += 160;
        if (tokens.length > 1 && hasTokenProximity(topic.normalizedContent, tokens, 140)) {
          score += 90;
        }

        for (const t of tokens) {
          const titleWhole = countWholeWordOccurrences(topic.normalizedTitle, t);
          const titleSub = countOccurrences(topic.normalizedTitle, t);
          const chapWhole = countWholeWordOccurrences(chapter.normalizedTitle, t);
          const chapSub = countOccurrences(chapter.normalizedTitle, t);
          const bodyWhole =
            filters.scope === 'headings' ? 0 : countWholeWordOccurrences(topic.normalizedContent, t);
          const bodyStart =
            filters.scope === 'headings' ? 0 : countWordStartOccurrences(topic.normalizedContent, t);
          const bodySub =
            filters.scope === 'headings' ? 0 : countOccurrences(topic.normalizedContent, t);

          const tokenOcc = Math.max(titleWhole, titleSub) + Math.max(chapWhole, chapSub) + bodySub;
          occurrences += tokenOcc;

          score +=
            titleWhole * 50 +
            titleSub * 14 +
            chapWhole * 30 +
            chapSub * 8 +
            Math.min(bodyWhole, 18) * 14 +
            Math.min(bodyStart, 18) * 5 +
            Math.min(bodySub, 12) * 1;
        }

        // Modest clinical tie-breaker bonus (Management > Disposition > Diagnostic > Clinical > Pathophysiology)
        score += clinicalTier * 18;

        const snippets = includeSnippets
          ? extractSnippets(topic.content, effectiveQuery, 2)
          : [];

        const matchCount = Math.max(1, occurrences);
        if (score > maxBookScore) maxBookScore = score;

        hits.push({
          bookId: book.id,
          bookTitle: book.title,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          topic,
          clinicalTier,
          score,
          matchCount,
          titleMatched: topicTitleMatchesAll,
          chapterMatched: chapterMatchesAll,
          snippets,
          isWordBoundaryMatch: everyTokenWholeWord || everyTokenWordStart,
        });
      }

      if (hits.length > 0) {
        chapterEntries.push({
          chapter,
          chapterMatched: chapterMatchesAll,
          hits,
        });
      }
    }

    if (chapterEntries.length > 0) {
      bookEntries.push({
        book,
        maxBookScore,
        chapters: chapterEntries,
      });
    }
  }

  // Finalize: drop weak mid-word substring-only noise if whole-word matches exist, then sort by relevance & clinical priority
  const groups: BookSearchGroup[] = [];
  let totalMatchingTopics = 0;
  let totalMatchOccurrences = 0;

  for (const bEntry of bookEntries) {
    const matchingChapters: ChapterSearchGroup[] = [];
    let bookTotalHits = 0;

    for (const cEntry of bEntry.chapters) {
      const filteredHits = anyWholeWordAcrossLibrary
        ? cEntry.hits.filter((h) => h.isWordBoundaryMatch || h.score >= 120)
        : cEntry.hits;

      if (filteredHits.length === 0) continue;

      filteredHits.sort(
        (a, b) =>
          b.score - a.score ||
          b.clinicalTier - a.clinicalTier ||
          a.topic.order - b.topic.order
      );

      let chapterTotalHits = 0;
      const cleanHits: TopicSearchHit[] = filteredHits.map(({ isWordBoundaryMatch: _drop, ...rest }) => {
        chapterTotalHits += rest.matchCount;
        totalMatchingTopics++;
        totalMatchOccurrences += rest.matchCount;
        return rest;
      });

      matchingChapters.push({
        chapter: cEntry.chapter,
        chapterMatched: cEntry.chapterMatched,
        totalHits: chapterTotalHits,
        topicHits: cleanHits,
      });
      bookTotalHits += chapterTotalHits;
    }

    if (matchingChapters.length > 0) {
      matchingChapters.sort((a, b) => {
        const aMax = a.topicHits[0]?.score || 0;
        const bMax = b.topicHits[0]?.score || 0;
        return (
          (b.chapterMatched ? 1 : 0) - (a.chapterMatched ? 1 : 0) ||
          bMax - aMax ||
          a.chapter.order - b.chapter.order
        );
      });

      groups.push({
        book: bEntry.book,
        totalHits: bookTotalHits,
        chapters: matchingChapters,
      });
    }
  }

  groups.sort((a, b) => {
    const aBest = a.chapters[0]?.topicHits[0]?.score || 0;
    const bBest = b.chapters[0]?.topicHits[0]?.score || 0;
    return bBest - aBest || b.totalHits - a.totalHits;
  });

  return {
    groups,
    totalMatchingTopics,
    totalMatchOccurrences,
    effectiveQuery,
    correction,
  };
}
