import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpLeft,
  Baby,
  Biohazard,
  Bone,
  Bookmark,
  BookmarkCheck,
  Brain,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  Droplets,
  HeartPulse,
  Info,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  Stethoscope,
  Wind,
  X,
} from 'lucide-react';
import { ED_CLINICAL_SCORES } from './data/scoresData';
import {
  ClinicalScoreDefinition,
  CriterionValue,
  RiskLevel,
  ScoreCategory,
  sumCriteria,
} from './types';
import { matchesSmartSearch } from '../../utils/smartSearch';
import ScoreEditorModal, {
  BuiltInScoreOverride,
  CustomScoreRecord,
} from './ScoreEditorModal';

const BOOKMARKS_STORAGE_KEY = 'ed_scores_bookmarks_v1';
const CUSTOM_SCORES_STORAGE_KEY = 'ed_scores_custom_v1';
const SCORE_OVERRIDES_STORAGE_KEY = 'ed_scores_overrides_v1';

function compileCustomScore(record: CustomScoreRecord): ClinicalScoreDefinition {
  const maxPossible = record.criteria.reduce((sum, c) => {
    if (c.type === 'boolean') return sum + Math.max(0, c.points ?? 0);
    if (c.type === 'select' && c.options && c.options.length > 0) {
      return sum + Math.max(0, ...c.options.map((o) => o.points));
    }
    return sum;
  }, 0);

  return {
    id: record.id,
    titleFa: record.titleFa,
    titleEn: record.titleEn,
    category: record.category,
    categoryLabel: record.categoryLabel,
    reference: record.reference,
    criteria: record.criteria,
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (record.thresholds.length === 0) {
        return {
          score,
          maxScore: maxPossible > 0 ? maxPossible : undefined,
          riskLevel: 'low',
          riskTitle: 'امتیاز نهایی محاسبه شد',
          summary: '',
          diagnosisAndTreatment: [],
          clinicalNotes: [],
        };
      }
      const sorted = [...record.thresholds].sort((a, b) => a.minScore - b.minScore);
      const matched =
        sorted.find((t) => score >= t.minScore && score <= t.maxScore) ??
        (score < (sorted[0]?.minScore ?? 0) ? sorted[0] : sorted[sorted.length - 1]);

      return {
        score,
        maxScore: maxPossible > 0 ? maxPossible : undefined,
        riskLevel: matched?.riskLevel ?? 'moderate',
        riskTitle: matched?.riskTitle || 'نتیجه ارزیابی',
        summary: matched?.summary || '',
        diagnosisAndTreatment:
          matched?.diagnosisAndTreatment.filter((s) => s.trim().length > 0) ?? [],
        clinicalNotes:
          matched?.clinicalNotes.filter((s) => s.trim().length > 0) ?? [],
      };
    },
  };
}

function applyBuiltInOverride(
  base: ClinicalScoreDefinition,
  override?: BuiltInScoreOverride
): ClinicalScoreDefinition {
  if (!override) return base;
  const mergedCriteria = override.criteria.map((ovC) => {
    const orig = base.criteria.find((b) => b.id === ovC.id);
    return orig ? { ...orig, ...ovC } : ovC;
  });

  return {
    ...base,
    titleFa: override.titleFa || base.titleFa,
    titleEn: override.titleEn || base.titleEn,
    category: override.category || base.category,
    categoryLabel: override.categoryLabel || base.categoryLabel,
    reference: override.reference || base.reference,
    criteria: mergedCriteria,
    evaluate(values) {
      const res = base.evaluate.call({ ...base, criteria: mergedCriteria }, values);
      if (!override.overrideTexts || res.isIncomplete) return res;
      return {
        ...res,
        summary: override.customSummary || res.summary,
        diagnosisAndTreatment:
          override.customDiagnosisAndTreatment.length > 0
            ? override.customDiagnosisAndTreatment
            : res.diagnosisAndTreatment,
        clinicalNotes:
          override.customClinicalNotes.length > 0
            ? override.customClinicalNotes
            : res.clinicalNotes,
      };
    },
  };
}

const CATEGORIES: { id: 'all' | ScoreCategory; label: string }[] = [
  { id: 'all', label: 'همه' },
  { id: 'formulas', label: 'فرمول‌های محاسباتی' },
  { id: 'cardiology', label: 'قلب و عروق' },
  { id: 'pulmonary', label: 'ریه و آمبولی' },
  { id: 'neurology', label: 'مغز و اعصاب' },
  { id: 'infectious', label: 'عفونت و سپسیس' },
  { id: 'trauma', label: 'تروما و ارتوپدی' },
  { id: 'gi_surgery', label: 'گوارش و جراحی' },
  { id: 'peds_heme', label: 'اطفال، هماتولوژی و روان' },
  { id: 'endocrine', label: 'غدد، دیابت و چربی' },
];

const CATEGORY_THEMES: Record<
  ScoreCategory,
  {
    icon: React.ComponentType<{ className?: string }>;
    iconBoxClass: string;
    labelClass: string;
    hoverBorderClass: string;
    glowClass: string;
  }
> = {
  formulas: {
    icon: Calculator,
    iconBoxClass:
      'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-800/70 text-indigo-600 dark:text-indigo-300',
    labelClass: 'text-indigo-600 dark:text-indigo-400',
    hoverBorderClass: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(99,102,241,0.09),transparent_55%)]',
  },
  cardiology: {
    icon: HeartPulse,
    iconBoxClass:
      'bg-rose-50 dark:bg-rose-950/60 border-rose-200/80 dark:border-rose-800/70 text-rose-600 dark:text-rose-300',
    labelClass: 'text-rose-600 dark:text-rose-400',
    hoverBorderClass: 'hover:border-rose-300 dark:hover:border-rose-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(244,63,94,0.09),transparent_55%)]',
  },
  pulmonary: {
    icon: Wind,
    iconBoxClass:
      'bg-sky-50 dark:bg-sky-950/60 border-sky-200/80 dark:border-sky-800/70 text-sky-600 dark:text-sky-300',
    labelClass: 'text-sky-600 dark:text-sky-400',
    hoverBorderClass: 'hover:border-sky-300 dark:hover:border-sky-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(14,165,233,0.09),transparent_55%)]',
  },
  neurology: {
    icon: Brain,
    iconBoxClass:
      'bg-violet-50 dark:bg-violet-950/60 border-violet-200/80 dark:border-violet-800/70 text-violet-600 dark:text-violet-300',
    labelClass: 'text-violet-600 dark:text-violet-400',
    hoverBorderClass: 'hover:border-violet-300 dark:hover:border-violet-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(139,92,246,0.09),transparent_55%)]',
  },
  infectious: {
    icon: Biohazard,
    iconBoxClass:
      'bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/70 text-amber-600 dark:text-amber-300',
    labelClass: 'text-amber-600 dark:text-amber-400',
    hoverBorderClass: 'hover:border-amber-300 dark:hover:border-amber-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(245,158,11,0.09),transparent_55%)]',
  },
  trauma: {
    icon: Bone,
    iconBoxClass:
      'bg-orange-50 dark:bg-orange-950/60 border-orange-200/80 dark:border-orange-800/70 text-orange-600 dark:text-orange-300',
    labelClass: 'text-orange-600 dark:text-orange-400',
    hoverBorderClass: 'hover:border-orange-300 dark:hover:border-orange-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(249,115,22,0.09),transparent_55%)]',
  },
  gi_surgery: {
    icon: Activity,
    iconBoxClass:
      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/70 text-emerald-600 dark:text-emerald-300',
    labelClass: 'text-emerald-600 dark:text-emerald-400',
    hoverBorderClass: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(16,185,129,0.09),transparent_55%)]',
  },
  peds_heme: {
    icon: Baby,
    iconBoxClass:
      'bg-teal-50 dark:bg-teal-950/60 border-teal-200/80 dark:border-teal-800/70 text-teal-600 dark:text-teal-300',
    labelClass: 'text-teal-600 dark:text-teal-400',
    hoverBorderClass: 'hover:border-teal-300 dark:hover:border-teal-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(20,184,166,0.09),transparent_55%)]',
  },
  endocrine: {
    icon: Droplets,
    iconBoxClass:
      'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200/80 dark:border-cyan-800/70 text-cyan-600 dark:text-cyan-300',
    labelClass: 'text-cyan-600 dark:text-cyan-400',
    hoverBorderClass: 'hover:border-cyan-300 dark:hover:border-cyan-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.09),transparent_55%)]',
  },
};

function getInitialValuesForScore(
  score: ClinicalScoreDefinition
): Record<string, CriterionValue> {
  const init: Record<string, CriterionValue> = {};
  for (const c of score.criteria) {
    if (c.type === 'boolean') {
      init[c.id] = typeof c.defaultValue === 'boolean' ? c.defaultValue : false;
    } else if (c.type === 'number') {
      // Start numeric boxes empty so the user never has to delete a stuck 0
      init[c.id] = '';
    } else {
      init[c.id] = typeof c.defaultValue === 'number' ? c.defaultValue : 0;
    }
  }
  return init;
}

function sanitizeDecimalInput(raw: string): string {
  // Normalize Persian & Arabic digits and decimal separators
  const normalized = raw
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[٫،,]/g, '.');
  // Allow empty, optional leading minus, digits, and single decimal point
  let cleaned = normalized.replace(/[^0-9.-]/g, '');
  // Keep at most one dot
  const firstDot = cleaned.indexOf('.');
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, '');
  }
  return cleaned;
}

const RISK_STYLES: Record<
  RiskLevel,
  {
    badgeLabel: string;
    containerClass: string;
    scoreColorClass: string;
    titleClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  low: {
    badgeLabel: 'نرمال / ریسک پایین',
    containerClass:
      'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900',
    scoreColorClass: 'text-emerald-700 dark:text-emerald-400',
    titleClass: 'text-emerald-900 dark:text-emerald-200',
    icon: CheckCircle2,
  },
  moderate: {
    badgeLabel: 'متوسط / مرزی',
    containerClass:
      'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900',
    scoreColorClass: 'text-amber-700 dark:text-amber-400',
    titleClass: 'text-amber-900 dark:text-amber-200',
    icon: Info,
  },
  high: {
    badgeLabel: 'ریسک بالا / غیرطبیعی',
    containerClass:
      'bg-orange-50/80 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900',
    scoreColorClass: 'text-orange-700 dark:text-orange-400',
    titleClass: 'text-orange-900 dark:text-orange-200',
    icon: AlertTriangle,
  },
  critical: {
    badgeLabel: 'بحرانی / فوری',
    containerClass:
      'bg-rose-50/80 dark:bg-rose-950/35 border-rose-200 dark:border-rose-900',
    scoreColorClass: 'text-rose-700 dark:text-rose-400',
    titleClass: 'text-rose-900 dark:text-rose-200',
    icon: ShieldAlert,
  },
};

export default function EDScoresModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ScoreCategory>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showAllOnHome, setShowAllOnHome] = useState(false);
  const [activeScoreId, setActiveScoreId] = useState<string | null>(null);

  const [customScores, setCustomScores] = useState<CustomScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_SCORES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return [];
  });

  const [scoreOverrides, setScoreOverrides] = useState<
    Record<string, BuiltInScoreOverride>
  >(() => {
    try {
      const saved = localStorage.getItem(SCORE_OVERRIDES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return {};
  });

  const [editorModal, setEditorModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit_custom' | 'edit_builtin';
    targetId: string | null;
  }>({ open: false, mode: 'create', targetId: null });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return ['heart-score', 'wells-pe', 'corrected-calcium', 'gfr-cockcroft-gault'];
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarkedIds));
    } catch {
      // Ignore storage error
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_SCORES_STORAGE_KEY, JSON.stringify(customScores));
    } catch {
      // Ignore storage error
    }
  }, [customScores]);

  useEffect(() => {
    try {
      localStorage.setItem(SCORE_OVERRIDES_STORAGE_KEY, JSON.stringify(scoreOverrides));
    } catch {
      // Ignore storage error
    }
  }, [scoreOverrides]);

  const allScores = useMemo<ClinicalScoreDefinition[]>(() => {
    const customCompiled = customScores.map(compileCustomScore);
    const builtInMerged = ED_CLINICAL_SCORES.map((s) =>
      applyBuiltInOverride(s, scoreOverrides[s.id])
    );
    return [...customCompiled, ...builtInMerged];
  }, [customScores, scoreOverrides]);

  const [valuesByScore, setValuesByScore] = useState<
    Record<string, Record<string, CriterionValue>>
  >(() => {
    const initial: Record<string, Record<string, CriterionValue>> = {};
    for (const s of ED_CLINICAL_SCORES) {
      initial[s.id] = getInitialValuesForScore(s);
    }
    return initial;
  });

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredScores = useMemo(() => {
    return allScores.filter((score) => {
      if (showBookmarksOnly && !bookmarkedIds.includes(score.id)) {
        return false;
      }
      if (selectedCategory !== 'all' && score.category !== selectedCategory) {
        return false;
      }
      return matchesSmartSearch(searchQuery, [
        score.titleFa,
        score.titleEn,
        score.categoryLabel,
      ]);
    });
  }, [allScores, searchQuery, selectedCategory, showBookmarksOnly, bookmarkedIds]);

  // Show at most 4 built-in items + any custom scores on the initial landing view unless filtered
  const isDefaultUnfilteredView =
    searchQuery.trim() === '' &&
    selectedCategory === 'all' &&
    !showBookmarksOnly &&
    !showAllOnHome;

  const displayedScores = useMemo(() => {
    if (!isDefaultUnfilteredView) return filteredScores;
    const customIds = new Set(customScores.map((c) => c.id));
    const customItems = filteredScores.filter((s) => customIds.has(s.id));
    const builtInFiltered = filteredScores.filter((s) => !customIds.has(s.id));
    const bookmarkedFirst = [
      ...builtInFiltered.filter((s) => bookmarkedIds.includes(s.id)),
      ...builtInFiltered.filter((s) => !bookmarkedIds.includes(s.id)),
    ];
    return [...customItems, ...bookmarkedFirst.slice(0, 4)];
  }, [isDefaultUnfilteredView, filteredScores, bookmarkedIds, customScores]);

  const activeScore = useMemo(() => {
    if (!activeScoreId) return null;
    return allScores.find((s) => s.id === activeScoreId) ?? null;
  }, [allScores, activeScoreId]);

  const activeValues = useMemo(() => {
    if (!activeScore) return {};
    return valuesByScore[activeScore.id] ?? getInitialValuesForScore(activeScore);
  }, [valuesByScore, activeScore]);

  const evaluation = useMemo(() => {
    if (!activeScore) return null;
    return activeScore.evaluate(activeValues);
  }, [activeScore, activeValues]);

  const handleCriterionChange = (
    criterionId: string,
    nextVal: CriterionValue
  ) => {
    if (!activeScore) return;
    setValuesByScore((prev) => ({
      ...prev,
      [activeScore.id]: {
        ...(prev[activeScore.id] ?? getInitialValuesForScore(activeScore)),
        [criterionId]: nextVal,
      },
    }));
  };

  const handleResetScore = () => {
    if (!activeScore) return;
    setValuesByScore((prev) => ({
      ...prev,
      [activeScore.id]: getInitialValuesForScore(activeScore),
    }));
  };

  const handleSelectScore = (id: string) => {
    setActiveScoreId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEditActive = () => {
    if (!activeScore) return;
    const isCustom = customScores.some((c) => c.id === activeScore.id);
    setEditorModal({
      open: true,
      mode: isCustom ? 'edit_custom' : 'edit_builtin',
      targetId: activeScore.id,
    });
  };

  const handleSaveCustomScore = (record: CustomScoreRecord) => {
    setCustomScores((prev) => {
      const exists = prev.some((c) => c.id === record.id);
      return exists ? prev.map((c) => (c.id === record.id ? record : c)) : [record, ...prev];
    });
    const compiled = compileCustomScore(record);
    setValuesByScore((prev) => ({
      ...prev,
      [record.id]: getInitialValuesForScore(compiled),
    }));
    setEditorModal({ open: false, mode: 'create', targetId: null });
    setActiveScoreId(record.id);
  };

  const handleSaveBuiltInOverride = (id: string, override: BuiltInScoreOverride) => {
    setScoreOverrides((prev) => ({ ...prev, [id]: override }));
    setEditorModal({ open: false, mode: 'create', targetId: null });
  };

  const handleDeleteCustomScore = (id: string) => {
    setCustomScores((prev) => prev.filter((c) => c.id !== id));
    setBookmarkedIds((prev) => prev.filter((b) => b !== id));
    if (activeScoreId === id) setActiveScoreId(null);
    setEditorModal({ open: false, mode: 'create', targetId: null });
  };

  const handleResetBuiltInScore = (id: string) => {
    setScoreOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setEditorModal({ open: false, mode: 'create', targetId: null });
  };

  // =========================================================================
  // VIEW 2: Focused Calculator & Result View (Icon-only top controls)
  // =========================================================================
  if (activeScore && evaluation) {
    const riskStyle = RISK_STYLES[evaluation.riskLevel];
    const RiskIcon = riskStyle.icon;
    const isActiveBookmarked = bookmarkedIds.includes(activeScore.id);

    return (
      <div
        dir="rtl"
        className="min-h-[calc(100vh-2.75rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors"
      >
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
          {/* Compact Top Icon Row above Score Card */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setActiveScoreId(null)}
              aria-label="فهرست اسکورها"
              title="فهرست اسکورها"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenEditActive}
                aria-label="ویرایش اسکور"
                title="ویرایش اسکور"
                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>ویرایش</span>
              </button>

              <button
                type="button"
                onClick={() => toggleBookmark(activeScore.id)}
                aria-label={isActiveBookmarked ? 'حذف نشان' : 'نشان‌دار کردن'}
                title={isActiveBookmarked ? 'حذف نشان' : 'نشان‌دار کردن'}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                  isActiveBookmarked
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isActiveBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={handleResetScore}
                aria-label="ریست"
                title="ریست"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Score / Formula Input Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {activeScore.categoryLabel}
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {activeScore.titleFa}
              </h1>
              <div
                dir="ltr"
                className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 text-right"
              >
                {activeScore.titleEn}
              </div>
            </div>

            {/* Criteria / Formula Inputs */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {activeScore.criteria.map((criterion) => {
                if (criterion.type === 'number') {
                  const rawVal = activeValues[criterion.id];
                  const strVal =
                    rawVal === undefined || rawVal === null ? '' : String(rawVal);
                  const placeholderText =
                    criterion.placeholder ??
                    (criterion.defaultValue !== undefined
                      ? String(criterion.defaultValue)
                      : '');

                  return (
                    <div
                      key={criterion.id}
                      className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <label
                        htmlFor={`num-${activeScore.id}-${criterion.id}`}
                        className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100"
                      >
                        {criterion.label}
                      </label>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          id={`num-${activeScore.id}-${criterion.id}`}
                          type="text"
                          inputMode="decimal"
                          dir="ltr"
                          value={strVal}
                          placeholder={placeholderText}
                          onFocus={(e) => {
                            if (strVal === '0') {
                              handleCriterionChange(criterion.id, '');
                            } else {
                              e.target.select();
                            }
                          }}
                          onChange={(e) => {
                            const cleaned = sanitizeDecimalInput(e.target.value);
                            handleCriterionChange(criterion.id, cleaned);
                          }}
                          className="w-32 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold tabular-nums text-center text-slate-900 dark:text-white placeholder:text-slate-400/70 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {criterion.unit && (
                          <span
                            dir="ltr"
                            className="text-xs font-mono text-slate-500 dark:text-slate-400 min-w-[44px]"
                          >
                            {criterion.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }

                if (criterion.type === 'boolean') {
                  const checked = Boolean(activeValues[criterion.id]);
                  const pts = criterion.points ?? 0;
                  return (
                    <button
                      key={criterion.id}
                      type="button"
                      onClick={() => handleCriterionChange(criterion.id, !checked)}
                      className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        checked
                          ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                          : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            checked
                              ? 'bg-amber-500 border-amber-500 text-slate-950'
                              : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                          {criterion.label}
                        </span>
                      </div>

                      {activeScore.category !== 'endocrine' && (
                        <span
                          dir="ltr"
                          className={`text-xs font-mono font-bold tabular-nums shrink-0 ${
                            checked
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {pts >= 0 ? `+${pts}` : pts}
                        </span>
                      )}
                    </button>
                  );
                }

                const selectedIdx =
                  typeof activeValues[criterion.id] === 'number'
                    ? (activeValues[criterion.id] as number)
                    : 0;
                return (
                  <div
                    key={criterion.id}
                    className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                      {criterion.label}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {criterion.options?.map((opt, idx) => {
                        const isSelected = selectedIdx === idx;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => handleCriterionChange(criterion.id, idx)}
                            className={`text-right px-3 py-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 dark:bg-amber-500 dark:text-slate-950 dark:border-amber-400 font-bold'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 font-medium'
                            }`}
                          >
                            <span className="leading-snug">{opt.label}</span>
                            {activeScore.category !== 'formulas' &&
                              activeScore.category !== 'endocrine' && (
                                <span
                                  dir="ltr"
                                  className={`font-mono text-[11px] tabular-nums shrink-0 ${
                                    isSelected
                                      ? 'opacity-90'
                                      : 'text-slate-400 dark:text-slate-500'
                                  }`}
                                >
                                  {opt.points >= 0 ? `+${opt.points}` : opt.points}
                                </span>
                              )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result & Diagnostic / Therapeutic Recommendation Panel */}
          {evaluation.isIncomplete ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center space-y-1.5">
              <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {evaluation.riskTitle}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {evaluation.summary}
              </p>
            </div>
          ) : (
            <div
              className={`rounded-xl border p-4 sm:p-6 space-y-4 transition-colors ${riskStyle.containerClass}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-800/70 pb-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`mt-0.5 shrink-0 ${riskStyle.scoreColorClass}`}>
                    <RiskIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      وضعیت:{' '}
                      <strong className={riskStyle.titleClass}>{riskStyle.badgeLabel}</strong>
                    </div>
                    <h2
                      className={`text-base sm:text-lg font-extrabold leading-snug ${riskStyle.titleClass}`}
                    >
                      {evaluation.riskTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {evaluation.summary}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-center shrink-0 min-w-[104px]">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {activeScore.category === 'formulas' ? 'نتیجه محاسبه' : 'امتیاز نهایی'}
                  </div>
                  <div
                    dir="ltr"
                    className={`text-2xl sm:text-3xl font-black font-mono tabular-nums leading-tight ${riskStyle.scoreColorClass}`}
                  >
                    {evaluation.score}
                    {evaluation.maxScore !== undefined && (
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                        /{evaluation.maxScore}
                      </span>
                    )}
                  </div>
                  {evaluation.unit && (
                    <div
                      dir="ltr"
                      className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5"
                    >
                      {evaluation.unit}
                    </div>
                  )}
                </div>
              </div>

              {evaluation.diagnosisAndTreatment.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                    <Stethoscope className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>اقدام تشخیصی و درمانی پیشنهادی</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {evaluation.diagnosisAndTreatment.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-white/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-2">
                {evaluation.clinicalNotes.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                      <span>توضیحات و نکات بالینی تکمیلی</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {evaluation.clinicalNotes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <div
                  className={`${
                    evaluation.clinicalNotes.length > 0
                      ? 'pt-2 border-t border-slate-200/70 dark:border-slate-800'
                      : ''
                  } text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between gap-2`}
                >
                  <span>منبع:</span>
                  <span dir="ltr" className="font-mono truncate">
                    {activeScore.reference}
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>

        {editorModal.open && (
          <ScoreEditorModal
            mode={editorModal.mode}
            initialCustom={
              editorModal.mode === 'edit_custom'
                ? customScores.find((c) => c.id === editorModal.targetId) ?? null
                : null
            }
            initialBuiltIn={
              editorModal.mode === 'edit_builtin'
                ? ED_CLINICAL_SCORES.find((s) => s.id === editorModal.targetId) ?? null
                : null
            }
            initialOverride={
              editorModal.mode === 'edit_builtin' && editorModal.targetId
                ? scoreOverrides[editorModal.targetId] ?? null
                : null
            }
            currentEvaluation={evaluation}
            onSaveCustom={handleSaveCustomScore}
            onSaveBuiltInOverride={handleSaveBuiltInOverride}
            onDeleteCustom={handleDeleteCustomScore}
            onResetBuiltIn={handleResetBuiltInScore}
            onClose={() =>
              setEditorModal({ open: false, mode: 'create', targetId: null })
            }
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: Minimalist Directory (Max 4 cards by default)
  // =========================================================================
  return (
    <div
      dir="rtl"
      className="min-h-[calc(100vh-2.75rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors"
    >
      {/* Search & Category Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0 max-w-[260px] sm:max-w-[300px]">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی اسکور یا فرمول..."
                className="w-full pr-9 pl-8 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="پاک کردن جستجو"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowBookmarksOnly((prev) => !prev)}
              aria-label="فقط نشان‌شده‌ها"
              title="نشان‌شده‌ها"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showBookmarksOnly
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {showBookmarksOnly ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4 text-amber-500" />
              )}
              <span className="tabular-nums font-mono text-[11px]">
                {bookmarkedIds.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setEditorModal({ open: true, mode: 'create', targetId: null })
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id === 'all') setShowAllOnHome(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-amber-500 dark:text-slate-950 dark:border-amber-400'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cards Grid (Max 4 cards on initial screen) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 space-y-4">
        {displayedScores.length > 0 ? (
          <>
            <div
              className={`grid gap-3.5 ${
                isDefaultUnfilteredView
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {displayedScores.map((score) => {
                const isBookmarked = bookmarkedIds.includes(score.id);
                const theme = CATEGORY_THEMES[score.category];
                const CatIcon = theme.icon;

                return (
                  <div
                    key={score.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectScore(score.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectScore(score.id);
                      }
                    }}
                    className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_20px_-10px_rgba(15,23,42,0.08)] hover:shadow-[0_6px_22px_-8px_rgba(15,23,42,0.12)] dark:shadow-none cursor-pointer flex flex-col justify-between gap-3.5 ${theme.hoverBorderClass}`}
                  >
                    {/* Soft Category Radial Tint */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity ${theme.glowClass}`}
                    />

                    {/* Top Row: Category Icon + Label + Bookmark Button */}
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${theme.iconBoxClass}`}
                        >
                          <CatIcon className="w-5 h-5 stroke-[2]" />
                        </div>
                        <span className={`text-[11px] font-bold truncate ${theme.labelClass}`}>
                          {score.categoryLabel}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(score.id, e)}
                        aria-label={isBookmarked ? 'حذف نشان' : 'نشان‌دار کردن'}
                        title={isBookmarked ? 'حذف نشان' : 'نشان‌دار کردن'}
                        className={`p-1.5 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                          isBookmarked
                            ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-50/90 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-400 hover:text-amber-500'
                        }`}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Titles Row: Persian + English + Subtle Directional Arrow */}
                    <div className="relative z-10 flex items-end justify-between gap-3 pt-1">
                      <div className="min-w-0 flex-1 space-y-1">
                        <h2 className="text-sm sm:text-[15px] font-extrabold text-slate-900 dark:text-white leading-snug">
                          {score.titleFa}
                        </h2>
                        <div
                          dir="ltr"
                          className="text-[11px] font-mono text-slate-500 dark:text-slate-400 text-right truncate"
                        >
                          {score.titleEn}
                        </div>
                      </div>

                      <ArrowUpLeft
                        aria-hidden="true"
                        className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mb-0.5"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {isDefaultUnfilteredView && filteredScores.length > 4 && (
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowAllOnHome(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span>مشاهده همه ({filteredScores.length})</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-2 max-w-md mx-auto mt-6">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              موردی یافت نشد
            </p>
            {showBookmarksOnly && (
              <button
                type="button"
                onClick={() => setShowBookmarksOnly(false)}
                className="mt-2 px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                نمایش همه
              </button>
            )}
          </div>
        )}
      </main>

      {editorModal.open && (
        <ScoreEditorModal
          mode={editorModal.mode}
          initialCustom={
            editorModal.mode === 'edit_custom'
              ? customScores.find((c) => c.id === editorModal.targetId) ?? null
              : null
          }
          initialBuiltIn={
            editorModal.mode === 'edit_builtin'
              ? ED_CLINICAL_SCORES.find((s) => s.id === editorModal.targetId) ?? null
              : null
          }
          initialOverride={
            editorModal.mode === 'edit_builtin' && editorModal.targetId
              ? scoreOverrides[editorModal.targetId] ?? null
              : null
          }
          currentEvaluation={evaluation}
          onSaveCustom={handleSaveCustomScore}
          onSaveBuiltInOverride={handleSaveBuiltInOverride}
          onDeleteCustom={handleDeleteCustomScore}
          onResetBuiltIn={handleResetBuiltInScore}
          onClose={() =>
            setEditorModal({ open: false, mode: 'create', targetId: null })
          }
        />
      )}
    </div>
  );
}
