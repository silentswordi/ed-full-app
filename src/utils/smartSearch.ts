/**
 * Smart Persian + English clinical search normalization & matching utility.
 * Handles:
 * - Alef variants (آ، أ، إ، ٱ -> ا)
 * - Arabic/Persian Yeh & Kaf & Heh variants (ي، ى، ئ -> ی | ك -> ک | ة، ۀ -> ه | ؤ -> و)
 * - ZWNJ (نیم‌فاصله / \u200c), punctuation, and hyphen spacing differences
 * - Arabic diacritics/tashdid/tatweel removal
 * - Persian & Arabic-Indic digits -> ASCII 0-9
 * - Common medical spelling variations (پانتو/پنتو، سفیکسیم/سفکسیم، لواتیراستام/لوتیراستام، آموکسی سیلین...)
 * - Order-independent multi-token AND matching + space-collapsed matching (انتیسایکوتیک <-> آنتی‌سایکوتیک)
 */

export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[آأإٱٲٳ]/g, 'ا')
    .replace(/[يیىئ]/g, 'ی')
    .replace(/[كک]/g, 'ک')
    .replace(/[ۀةه]/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/[\u064B-\u065F\u0670\u0640\u0621]/g, '')
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u200c\u200d\u00a0\-_/\\.,،؛:()[\]{}«»"'?!]+/g, ' ')
    .replace(/پانتو/g, 'پنتو')
    .replace(/سفیکسیم/g, 'سفکسیم')
    .replace(/لواتیراستام|لویتیراستام/g, 'لوتیراستام')
    .replace(/بروفن/g, 'پروفن')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesSmartSearch(
  query: string,
  fields: Array<string | undefined | null>
): boolean {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return true;

  const normHaystack = normalizeSearchText(fields.filter(Boolean).join(' '));
  if (!normHaystack) return false;

  // 1. Order-independent multi-word token match (each word appears anywhere)
  const tokens = normQuery.split(' ').filter(Boolean);
  if (tokens.length > 0 && tokens.every((token) => normHaystack.includes(token))) {
    return true;
  }

  // 2. Space/ZWNJ-collapsed match (handles "انتی سایکوتیک" <-> "انتیسایکوتیک" <-> "آنتی‌سایکوتیک")
  const compactQuery = normQuery.replace(/\s+/g, '');
  const compactHaystack = normHaystack.replace(/\s+/g, '');
  if (compactQuery.length > 0 && compactHaystack.includes(compactQuery)) {
    return true;
  }

  return false;
}
