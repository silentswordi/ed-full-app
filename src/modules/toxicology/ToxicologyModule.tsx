import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Biohazard,
  Bookmark,
  BookmarkCheck,
  Brain,
  CheckCircle2,
  ChevronDown,
  Droplets,
  FlaskConical,
  HeartPulse,
  Pencil,
  Pill,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Syringe,
  Wind,
  X,
} from 'lucide-react';
import {
  TINTINALLI_TOXINS,
  TOXIN_CATEGORIES,
} from './data/toxinsData';
import { ToxinCategory, ToxinDefinition } from './types';
import { matchesSmartSearch } from '../../utils/smartSearch';
import ToxinEditorModal from './ToxinEditorModal';

const BOOKMARKS_STORAGE_KEY = 'tintinalli_tox_bookmarks_v1';
const CUSTOM_TOXINS_STORAGE_KEY = 'tintinalli_tox_custom_v1';
const EDITED_TOXINS_STORAGE_KEY = 'tintinalli_tox_overrides_v1';
const FEATURED_TOXIN_IDS = [
  'acetaminophen',
  'benzodiazepines',
  'methanol',
  'ethylene-glycol',
];

function renderFormattedText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-slate-950 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

const CATEGORY_THEMES: Record<
  ToxinCategory,
  {
    icon: React.ComponentType<{ className?: string }>;
    iconBoxClass: string;
    labelClass: string;
    hoverBorderClass: string;
    glowClass: string;
  }
> = {
  analgesics: {
    icon: Pill,
    iconBoxClass:
      'bg-teal-50 dark:bg-teal-950/60 border-teal-200/80 dark:border-teal-800/70 text-teal-600 dark:text-teal-300',
    labelClass: 'text-teal-600 dark:text-teal-400',
    hoverBorderClass: 'hover:border-teal-300 dark:hover:border-teal-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(20,184,166,0.09),transparent_55%)]',
  },
  cardiovascular: {
    icon: HeartPulse,
    iconBoxClass:
      'bg-rose-50 dark:bg-rose-950/60 border-rose-200/80 dark:border-rose-800/70 text-rose-600 dark:text-rose-300',
    labelClass: 'text-rose-600 dark:text-rose-400',
    hoverBorderClass: 'hover:border-rose-300 dark:hover:border-rose-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(244,63,94,0.09),transparent_55%)]',
  },
  neuro_psych: {
    icon: Brain,
    iconBoxClass:
      'bg-violet-50 dark:bg-violet-950/60 border-violet-200/80 dark:border-violet-800/70 text-violet-600 dark:text-violet-300',
    labelClass: 'text-violet-600 dark:text-violet-400',
    hoverBorderClass: 'hover:border-violet-300 dark:hover:border-violet-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(139,92,246,0.09),transparent_55%)]',
  },
  drugs_of_abuse: {
    icon: Syringe,
    iconBoxClass:
      'bg-fuchsia-50 dark:bg-fuchsia-950/60 border-fuchsia-200/80 dark:border-fuchsia-800/70 text-fuchsia-600 dark:text-fuchsia-300',
    labelClass: 'text-fuchsia-600 dark:text-fuchsia-400',
    hoverBorderClass: 'hover:border-fuchsia-300 dark:hover:border-fuchsia-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(217,70,239,0.09),transparent_55%)]',
  },
  alcohols_gases: {
    icon: Wind,
    iconBoxClass:
      'bg-sky-50 dark:bg-sky-950/60 border-sky-200/80 dark:border-sky-800/70 text-sky-600 dark:text-sky-300',
    labelClass: 'text-sky-600 dark:text-sky-400',
    hoverBorderClass: 'hover:border-sky-300 dark:hover:border-sky-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(14,165,233,0.09),transparent_55%)]',
  },
  pesticides_metals: {
    icon: Biohazard,
    iconBoxClass:
      'bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/70 text-amber-600 dark:text-amber-300',
    labelClass: 'text-amber-600 dark:text-amber-400',
    hoverBorderClass: 'hover:border-amber-300 dark:hover:border-amber-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(245,158,11,0.09),transparent_55%)]',
  },
  caustics_plants_metabolic: {
    icon: Droplets,
    iconBoxClass:
      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/70 text-emerald-600 dark:text-emerald-300',
    labelClass: 'text-emerald-600 dark:text-emerald-400',
    hoverBorderClass: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    glowClass: 'bg-[radial-gradient(circle_at_90%_10%,rgba(16,185,129,0.09),transparent_55%)]',
  },
};

const ToxicologyModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ToxinCategory>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showAllOnHome, setShowAllOnHome] = useState(false);

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return FEATURED_TOXIN_IDS;
  });

  const [customToxins, setCustomToxins] = useState<ToxinDefinition[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_TOXINS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  const [editedToxins, setEditedToxins] = useState<Record<string, ToxinDefinition>>(() => {
    try {
      const saved = localStorage.getItem(EDITED_TOXINS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return {};
  });

  const [selectedToxinId, setSelectedToxinId] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<{
    open: boolean;
    targetId: string | null;
  }>({ open: false, targetId: null });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch {
      // Ignore storage errors
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_TOXINS_STORAGE_KEY, JSON.stringify(customToxins));
    } catch {
      // Ignore storage errors
    }
  }, [customToxins]);

  useEffect(() => {
    try {
      localStorage.setItem(EDITED_TOXINS_STORAGE_KEY, JSON.stringify(editedToxins));
    } catch {
      // Ignore storage errors
    }
  }, [editedToxins]);

  const allToxins = useMemo<ToxinDefinition[]>(() => {
    const builtInMerged = TINTINALLI_TOXINS.map((t) => editedToxins[t.id] ?? t);
    return [...customToxins, ...builtInMerged];
  }, [customToxins, editedToxins]);

  const toggleBookmark = (toxinId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks((prev) =>
      prev.includes(toxinId) ? prev.filter((id) => id !== toxinId) : [...prev, toxinId]
    );
  };

  const selectedToxin = useMemo<ToxinDefinition | null>(
    () => allToxins.find((t) => t.id === selectedToxinId) ?? null,
    [allToxins, selectedToxinId]
  );

  const editingTarget = useMemo<ToxinDefinition | null>(() => {
    if (!editorState.open || !editorState.targetId) return null;
    return allToxins.find((t) => t.id === editorState.targetId) ?? null;
  }, [editorState, allToxins]);

  const isEditingBuiltIn = useMemo(() => {
    if (!editingTarget) return false;
    return TINTINALLI_TOXINS.some((t) => t.id === editingTarget.id);
  }, [editingTarget]);

  const handleSaveToxin = (saved: ToxinDefinition) => {
    const isBuiltIn = TINTINALLI_TOXINS.some((t) => t.id === saved.id);
    if (isBuiltIn) {
      setEditedToxins((prev) => ({ ...prev, [saved.id]: saved }));
    } else {
      setCustomToxins((prev) => {
        const exists = prev.some((t) => t.id === saved.id);
        return exists ? prev.map((t) => (t.id === saved.id ? saved : t)) : [saved, ...prev];
      });
    }
    setEditorState({ open: false, targetId: null });
    setSelectedToxinId(saved.id);
  };

  const handleDeleteCustomToxin = () => {
    if (!editingTarget) return;
    setCustomToxins((prev) => prev.filter((t) => t.id !== editingTarget.id));
    setBookmarks((prev) => prev.filter((id) => id !== editingTarget.id));
    if (selectedToxinId === editingTarget.id) setSelectedToxinId(null);
    setEditorState({ open: false, targetId: null });
  };

  const handleResetBuiltInToxin = () => {
    if (!editingTarget) return;
    setEditedToxins((prev) => {
      const next = { ...prev };
      delete next[editingTarget.id];
      return next;
    });
    setEditorState({ open: false, targetId: null });
  };

  const filteredToxins = useMemo(() => {
    return allToxins.filter((toxin) => {
      if (showBookmarksOnly && !bookmarks.includes(toxin.id)) return false;
      if (selectedCategory !== 'all' && toxin.category !== selectedCategory) return false;
      return matchesSmartSearch(searchQuery, [
        toxin.nameFa,
        toxin.nameEn,
        toxin.categoryLabel,
        toxin.toxidrome,
        toxin.antidote?.nameFa,
        toxin.antidote?.nameEn,
        ...(toxin.keywords ?? []),
      ]);
    });
  }, [allToxins, searchQuery, selectedCategory, showBookmarksOnly, bookmarks]);

  const isDefaultUnfilteredView =
    searchQuery.trim() === '' &&
    selectedCategory === 'all' &&
    !showBookmarksOnly &&
    !showAllOnHome;

  const displayedToxins = useMemo(() => {
    if (!isDefaultUnfilteredView) return filteredToxins;
    const customIds = new Set(customToxins.map((c) => c.id));
    const customItems = filteredToxins.filter((t) => customIds.has(t.id));
    const featured = FEATURED_TOXIN_IDS.map((id) =>
      filteredToxins.find((t) => t.id === id)
    ).filter((t): t is ToxinDefinition => Boolean(t));
    const baseFeatured =
      featured.length >= 4
        ? featured.slice(0, 4)
        : [...featured, ...filteredToxins.filter((t) => !FEATURED_TOXIN_IDS.includes(t.id) && !customIds.has(t.id))].slice(0, 4);
    return [...customItems, ...baseFeatured];
  }, [isDefaultUnfilteredView, filteredToxins, customToxins]);

  const handleOpenToxin = (id: string) => {
    setSelectedToxinId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==================== DETAIL PROTOCOL VIEW ====================
  if (selectedToxin) {
    const isBookmarked = bookmarks.includes(selectedToxin.id);
    const theme = CATEGORY_THEMES[selectedToxin.category];
    const CategoryIcon = theme.icon;

    return (
      <div
        dir="rtl"
        className="min-h-[calc(100vh-2.75rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-12 transition-colors"
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
          {/* Compact Icon-Only Bar */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <button
              type="button"
              onClick={() => setSelectedToxinId(null)}
              aria-label="بازگشت به فهرست مسمومیت‌ها"
              title="بازگشت"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditorState({ open: true, targetId: selectedToxin.id })}
                aria-label="ویرایش مسمومیت"
                title="ویرایش مطالب"
                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>ویرایش</span>
              </button>

              <button
                type="button"
                onClick={() => toggleBookmark(selectedToxin.id)}
                aria-label={isBookmarked ? 'حذف نشان' : 'نشان‌دار کردن'}
                title={isBookmarked ? 'نشان‌شده' : 'نشان‌دار کردن'}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-500'
                }`}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Protocol Header Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 mb-4 shadow-sm">
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 opacity-80 ${theme.glowClass}`}
            />
            <div className="relative flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${theme.iconBoxClass}`}
              >
                <CategoryIcon className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-xs font-semibold mb-1 ${theme.labelClass}`}>
                  {selectedToxin.categoryLabel} · {selectedToxin.toxidrome}
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  {selectedToxin.nameFa}
                </h1>
                <div dir="ltr" className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 text-right mt-0.5">
                  {selectedToxin.nameEn}
                </div>
              </div>
            </div>

            {/* Toxic Dose & Threshold */}
            <div className="relative mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              <FlaskConical className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">آستانه سمیت: </span>
                {renderFormattedText(selectedToxin.toxicDose)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* 1. Clinical Features */}
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 text-xs font-extrabold flex items-center justify-center shrink-0">
                  ۱
                </span>
                <Activity className="w-4 h-4 text-rose-500" />
                <h2 className="text-sm sm:text-[15px] font-extrabold text-slate-900 dark:text-white">
                  علائم بالینی
                </h2>
              </div>
              <ul className="space-y-2">
                {selectedToxin.clinicalFeatures.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-2" />
                    <span>{renderFormattedText(item)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 2. Diagnostics & Labs */}
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 text-xs font-extrabold flex items-center justify-center shrink-0">
                  ۲
                </span>
                <Stethoscope className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm sm:text-[15px] font-extrabold text-slate-900 dark:text-white">
                  ارزیابی و آزمایشات
                </h2>
              </div>
              <ul className="space-y-2">
                {selectedToxin.diagnostics.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                    <span>{renderFormattedText(item)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. ECG Findings */}
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-300 text-xs font-extrabold flex items-center justify-center shrink-0">
                  ۳
                </span>
                <HeartPulse className="w-4 h-4 text-fuchsia-500" />
                <h2 className="text-sm sm:text-[15px] font-extrabold text-slate-900 dark:text-white">
                  نوار قلب (ECG)
                </h2>
              </div>
              <ul className="space-y-2">
                {selectedToxin.ecgFindings.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shrink-0 mt-2" />
                    <span>{renderFormattedText(item)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. Decontamination */}
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-xs font-extrabold flex items-center justify-center shrink-0">
                  ۴
                </span>
                <Droplets className="w-4 h-4 text-indigo-500" />
                <h2 className="text-sm sm:text-[15px] font-extrabold text-slate-900 dark:text-white">
                  آلودگی‌زدایی
                </h2>
              </div>
              <ul className="space-y-2">
                {selectedToxin.decontamination.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2" />
                    <span>{renderFormattedText(item)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 5. Antidote */}
            {selectedToxin.antidote ? (
              <section className="rounded-2xl border-2 border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/90 dark:bg-emerald-950/35 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold flex items-center justify-center shrink-0">
                    ۵
                  </span>
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                  <h2 className="text-sm sm:text-[15px] font-extrabold text-emerald-950 dark:text-emerald-100">
                    پادزهر اختصاصی
                  </h2>
                </div>
                <div className="pr-1">
                  <div className="text-sm sm:text-base font-extrabold text-emerald-950 dark:text-emerald-100">
                    {selectedToxin.antidote.nameFa}
                  </div>
                  <div dir="ltr" className="text-xs font-medium text-emerald-800/80 dark:text-emerald-300/80 text-right mb-2.5">
                    {selectedToxin.antidote.nameEn}
                  </div>
                  <ul className="space-y-1.5">
                    {selectedToxin.antidote.dosing.map((line, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs sm:text-[13px] font-medium text-emerald-950 dark:text-emerald-100 leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                        <span>{renderFormattedText(line)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : (
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-extrabold flex items-center justify-center shrink-0">
                    ۵
                  </span>
                  <ShieldAlert className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <h2 className="text-sm sm:text-[15px] font-extrabold text-slate-900 dark:text-white">
                    پادزهر
                  </h2>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                  پادزهر اختصاصی ندارد؛ محور اصلی درمان، پایدارسازی راه هوایی، همودینامیک، مراقبت حمایتی و تسریع دفع سم است.
                </p>
              </section>
            )}

            {/* 6. Emergency Management */}
            <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 text-xs font-extrabold flex items-center justify-center shrink-0">
                  ۶
                </span>
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <h2 className="text-sm sm:text-[15px] font-extrabold text-slate-900 dark:text-white">
                  درمان‌های اورژانسی
                </h2>
              </div>
              <ul className="space-y-2">
                {selectedToxin.management.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-800 dark:text-slate-100 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-2" />
                    <span>{renderFormattedText(item)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Clinical Pitfalls */}
            <section className="rounded-2xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-800/70 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-extrabold text-amber-950 dark:text-amber-200">
                  تله‌ها و خطاهای رایج
                </h3>
              </div>
              <ul className="space-y-1.5">
                {selectedToxin.pitfalls.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-[13px] text-amber-900 dark:text-amber-200/90 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                    <span>{renderFormattedText(item)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {editorState.open && (
          <ToxinEditorModal
            initialToxin={editingTarget}
            isBuiltIn={isEditingBuiltIn}
            hasOverride={Boolean(editingTarget && editedToxins[editingTarget.id])}
            onSave={handleSaveToxin}
            onDelete={!isEditingBuiltIn ? handleDeleteCustomToxin : undefined}
            onResetOverride={isEditingBuiltIn ? handleResetBuiltInToxin : undefined}
            onClose={() => setEditorState({ open: false, targetId: null })}
          />
        )}
      </div>
    );
  }

  // ==================== DIRECTORY VIEW ====================
  return (
    <div
      dir="rtl"
      className="min-h-[calc(100vh-2.75rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-12 transition-colors"
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-5 sm:pt-7">
        {/* Compact Title */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 flex items-center justify-center shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            مدیریت مسمومیت‌ها (Tintinalli)
          </h1>
        </div>

        {/* Compact Search Bar + Bookmark Toggle Beside It */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1 min-w-0 max-w-[260px] sm:max-w-[300px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی سم، دارو یا پادزهر..."
              className="w-full pr-9 pl-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="پاک کردن جستجو"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowBookmarksOnly((prev) => !prev)}
            aria-label={showBookmarksOnly ? 'نمایش همه مسمومیت‌ها' : 'نمایش نشان‌شده‌ها'}
            title={showBookmarksOnly ? 'نشان‌شده‌ها (فعال)' : 'فقط نشان‌شده‌ها'}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-colors shrink-0 cursor-pointer ${
              showBookmarksOnly
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {showBookmarksOnly ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setEditorState({ open: true, targetId: null })}
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold shadow-sm transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {TOXIN_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (cat.id === 'all') setShowAllOnHome(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Toxins Grid */}
        {displayedToxins.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              مسمومیتی با این مشخصات یافت نشد.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`grid gap-3.5 sm:gap-4 ${
                isDefaultUnfilteredView
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {displayedToxins.map((toxin) => {
                const isBookmarked = bookmarks.includes(toxin.id);
                const theme = CATEGORY_THEMES[toxin.category];
                const CategoryIcon = theme.icon;

                return (
                  <div
                    key={toxin.id}
                    onClick={() => handleOpenToxin(toxin.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenToxin(toxin.id);
                      }
                    }}
                    className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 p-4 flex flex-col justify-between gap-3.5 text-right shadow-[0_2px_8px_-3px_rgba(15,23,42,0.05)] dark:shadow-[0_6px_18px_-10px_rgba(0,0,0,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${theme.hoverBorderClass}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 opacity-75 group-hover:opacity-100 transition-opacity ${theme.glowClass}`}
                    />

                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${theme.iconBoxClass}`}
                      >
                        <CategoryIcon className="w-5 h-5 stroke-[2]" />
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(toxin.id, e)}
                        aria-label={isBookmarked ? 'حذف از نشان‌شده‌ها' : 'نشان‌دار کردن'}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                          isBookmarked
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                            : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="relative z-10 min-w-0">
                      <div className={`text-[11px] font-semibold mb-1 truncate ${theme.labelClass}`}>
                        {toxin.categoryLabel}
                      </div>

                      <h2 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {toxin.nameFa}
                      </h2>

                      <div
                        dir="ltr"
                        className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-1 text-right"
                      >
                        {toxin.nameEn}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] truncate">
                        {toxin.antidote ? (
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            پادزهر: {toxin.antidote.nameFa}
                          </span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">
                            توکسیدروم: {toxin.toxidrome}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {isDefaultUnfilteredView && filteredToxins.length > 4 && (
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowAllOnHome(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span>مشاهده همه ({filteredToxins.length})</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {editorState.open && (
        <ToxinEditorModal
          initialToxin={editingTarget}
          isBuiltIn={isEditingBuiltIn}
          hasOverride={Boolean(editingTarget && editedToxins[editingTarget.id])}
          onSave={handleSaveToxin}
          onDelete={!isEditingBuiltIn ? handleDeleteCustomToxin : undefined}
          onResetOverride={isEditingBuiltIn ? handleResetBuiltInToxin : undefined}
          onClose={() => setEditorState({ open: false, targetId: null })}
        />
      )}
    </div>
  );
};

export default ToxicologyModule;
