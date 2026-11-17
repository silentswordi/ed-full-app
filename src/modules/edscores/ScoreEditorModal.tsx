import React, { useState } from 'react';
import { Plus, RotateCcw, Save, Trash2, X } from 'lucide-react';
import {
  ClinicalScoreDefinition,
  RiskLevel,
  ScoreCategory,
  ScoreCriterion,
  ScoreEvaluationResult,
} from './types';

export interface CustomScoreThreshold {
  minScore: number;
  maxScore: number;
  riskLevel: RiskLevel;
  riskTitle: string;
  summary: string;
  diagnosisAndTreatment: string[];
  clinicalNotes: string[];
}

export interface CustomScoreRecord {
  id: string;
  titleFa: string;
  titleEn: string;
  category: ScoreCategory;
  categoryLabel: string;
  reference: string;
  criteria: ScoreCriterion[];
  thresholds: CustomScoreThreshold[];
}

export interface BuiltInScoreOverride {
  titleFa: string;
  titleEn: string;
  category: ScoreCategory;
  categoryLabel: string;
  reference: string;
  criteria: ScoreCriterion[];
  overrideTexts: boolean;
  customSummary: string;
  customDiagnosisAndTreatment: string[];
  customClinicalNotes: string[];
}

const SCORE_CATEGORY_OPTIONS: { id: ScoreCategory; label: string }[] = [
  { id: 'cardiology', label: 'قلب و عروق' },
  { id: 'pulmonary', label: 'ریه و آمبولی' },
  { id: 'neurology', label: 'مغز و اعصاب' },
  { id: 'infectious', label: 'عفونت و سپسیس' },
  { id: 'trauma', label: 'تروما و ارتوپدی' },
  { id: 'gi_surgery', label: 'گوارش و جراحی' },
  { id: 'peds_heme', label: 'اطفال، هماتولوژی و روان' },
  { id: 'endocrine', label: 'غدد، دیابت و چربی' },
  { id: 'formulas', label: 'فرمول‌های محاسباتی' },
];

const RISK_LEVEL_OPTIONS: { id: RiskLevel; label: string }[] = [
  { id: 'low', label: 'نرمال / ریسک پایین' },
  { id: 'moderate', label: 'متوسط / مرزی' },
  { id: 'high', label: 'ریسک بالا / غیرطبیعی' },
  { id: 'critical', label: 'بحرانی / فوری' },
];

interface ScoreEditorModalProps {
  mode: 'create' | 'edit_custom' | 'edit_builtin';
  initialCustom?: CustomScoreRecord | null;
  initialBuiltIn?: ClinicalScoreDefinition | null;
  initialOverride?: BuiltInScoreOverride | null;
  currentEvaluation?: ScoreEvaluationResult | null;
  onSaveCustom: (record: CustomScoreRecord) => void;
  onSaveBuiltInOverride?: (id: string, override: BuiltInScoreOverride) => void;
  onDeleteCustom?: (id: string) => void;
  onResetBuiltIn?: (id: string) => void;
  onClose: () => void;
}

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function ScoreEditorModal({
  mode,
  initialCustom,
  initialBuiltIn,
  initialOverride,
  currentEvaluation,
  onSaveCustom,
  onSaveBuiltInOverride,
  onDeleteCustom,
  onResetBuiltIn,
  onClose,
}: ScoreEditorModalProps) {
  const isBuiltInMode = mode === 'edit_builtin';

  const baseTitleFa = isBuiltInMode
    ? initialOverride?.titleFa ?? initialBuiltIn?.titleFa ?? ''
    : initialCustom?.titleFa ?? '';
  const baseTitleEn = isBuiltInMode
    ? initialOverride?.titleEn ?? initialBuiltIn?.titleEn ?? ''
    : initialCustom?.titleEn ?? '';
  const baseCategory: ScoreCategory = isBuiltInMode
    ? initialOverride?.category ?? initialBuiltIn?.category ?? 'cardiology'
    : initialCustom?.category ?? 'cardiology';
  const baseReference = isBuiltInMode
    ? initialOverride?.reference ?? initialBuiltIn?.reference ?? ''
    : initialCustom?.reference ?? '';

  const [titleFa, setTitleFa] = useState(baseTitleFa);
  const [titleEn, setTitleEn] = useState(baseTitleEn);
  const [category, setCategory] = useState<ScoreCategory>(baseCategory);
  const [reference, setReference] = useState(baseReference);

  const [criteria, setCriteria] = useState<ScoreCriterion[]>(() => {
    if (isBuiltInMode) {
      const src = initialOverride?.criteria ?? initialBuiltIn?.criteria ?? [];
      return JSON.parse(JSON.stringify(src));
    }
    if (initialCustom?.criteria) {
      return JSON.parse(JSON.stringify(initialCustom.criteria));
    }
    return [];
  });

  const [thresholds, setThresholds] = useState<CustomScoreThreshold[]>(() => {
    if (initialCustom?.thresholds && initialCustom.thresholds.length > 0) {
      return JSON.parse(JSON.stringify(initialCustom.thresholds));
    }
    return [];
  });

  // Built-in override text fields
  const [overrideTexts, setOverrideTexts] = useState<boolean>(
    initialOverride?.overrideTexts ?? false
  );
  const [customSummary, setCustomSummary] = useState<string>(
    initialOverride?.customSummary ?? currentEvaluation?.summary ?? ''
  );
  const [customDxTxText, setCustomDxTxText] = useState<string>(
    (
      initialOverride?.customDiagnosisAndTreatment ??
      currentEvaluation?.diagnosisAndTreatment ??
      []
    ).join('\n')
  );
  const [customNotesText, setCustomNotesText] = useState<string>(
    (
      initialOverride?.customClinicalNotes ??
      currentEvaluation?.clinicalNotes ??
      []
    ).join('\n')
  );

  const [errorMsg, setErrorMsg] = useState('');

  const handleAddCriterion = (type: 'boolean' | 'select') => {
    const newId = `crit-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    if (type === 'boolean') {
      setCriteria((prev) => [
        ...prev,
        { id: newId, label: '', type: 'boolean', points: 1 },
      ]);
    } else {
      setCriteria((prev) => [
        ...prev,
        {
          id: newId,
          label: '',
          type: 'select',
          options: [
            { label: '', points: 0 },
            { label: '', points: 1 },
          ],
        },
      ]);
    }
    setErrorMsg('');
  };

  const handleUpdateCriterion = (idx: number, patch: Partial<ScoreCriterion>) => {
    setCriteria((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const handleRemoveCriterion = (idx: number) => {
    setCriteria((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddOption = (critIdx: number) => {
    setCriteria((prev) =>
      prev.map((c, i) => {
        if (i !== critIdx) return c;
        const opts = [...(c.options ?? []), { label: '', points: 1 }];
        return { ...c, options: opts };
      })
    );
  };

  const handleUpdateOption = (
    critIdx: number,
    optIdx: number,
    patch: { label?: string; points?: number }
  ) => {
    setCriteria((prev) =>
      prev.map((c, i) => {
        if (i !== critIdx || !c.options) return c;
        return {
          ...c,
          options: c.options.map((o, j) => (j === optIdx ? { ...o, ...patch } : o)),
        };
      })
    );
  };

  const handleRemoveOption = (critIdx: number, optIdx: number) => {
    setCriteria((prev) =>
      prev.map((c, i) => {
        if (i !== critIdx || !c.options || c.options.length <= 1) return c;
        return { ...c, options: c.options.filter((_, j) => j !== optIdx) };
      })
    );
  };

  const handleAddThreshold = () => {
    const last = thresholds[thresholds.length - 1];
    const nextMin = last ? last.maxScore + 1 : 0;
    setThresholds((prev) => [
      ...prev,
      {
        minScore: nextMin,
        maxScore: nextMin + 2,
        riskLevel: 'low',
        riskTitle: '',
        summary: '',
        diagnosisAndTreatment: [],
        clinicalNotes: [],
      },
    ]);
  };

  const handleUpdateThreshold = (idx: number, patch: Partial<CustomScoreThreshold>) => {
    setThresholds((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  };

  const handleRemoveThreshold = (idx: number) => {
    setThresholds((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleFa.trim()) {
      setErrorMsg('لطفاً عنوان فارسی اسکور را وارد کنید.');
      return;
    }

    const catLabel =
      SCORE_CATEGORY_OPTIONS.find((c) => c.id === category)?.label ?? 'سایر';

    if (isBuiltInMode && initialBuiltIn && onSaveBuiltInOverride) {
      onSaveBuiltInOverride(initialBuiltIn.id, {
        titleFa: titleFa.trim(),
        titleEn: titleEn.trim() || initialBuiltIn.titleEn,
        category,
        categoryLabel: catLabel,
        reference: reference.trim() || initialBuiltIn.reference,
        criteria,
        overrideTexts,
        customSummary: customSummary.trim(),
        customDiagnosisAndTreatment: linesToArray(customDxTxText),
        customClinicalNotes: linesToArray(customNotesText),
      });
      return;
    }

    if (criteria.length === 0) {
      setErrorMsg('حداقل یک معیار برای اسکور اضافه کنید.');
      return;
    }

    const sanitizedCriteria = criteria.map((c, i) => ({
      ...c,
      label: c.label.trim() || `معیار ${i + 1}`,
      options: c.options?.map((o, j) => ({
        ...o,
        label: o.label.trim() || `گزینه ${j + 1}`,
      })),
    }));

    const id =
      initialCustom?.id ??
      `custom-score-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    onSaveCustom({
      id,
      titleFa: titleFa.trim(),
      titleEn: titleEn.trim() || titleFa.trim(),
      category,
      categoryLabel: catLabel,
      reference: reference.trim() || 'اسکور سفارشی کاربر',
      criteria: sanitizedCriteria,
      thresholds,
    });
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5 overflow-hidden"
    >
      <div className="w-full max-w-2xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 shrink-0">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white min-w-0 truncate">
            {mode === 'create'
              ? 'افزودن اسکور بالینی جدید'
              : `ویرایش: ${baseTitleFa}`}
          </h2>

          <div className="flex items-center gap-1.5 shrink-0">
            {isBuiltInMode && initialOverride && initialBuiltIn && onResetBuiltIn && (
              <button
                type="button"
                onClick={() => onResetBuiltIn(initialBuiltIn.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>نسخه اصلی</span>
              </button>
            )}

            {mode === 'edit_custom' && initialCustom && onDeleteCustom && (
              <button
                type="button"
                onClick={() => onDeleteCustom(initialCustom.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 text-[11px] font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>حذف</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {errorMsg && (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="min-w-0">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                عنوان فارسی اسکور *
              </label>
              <input
                type="text"
                value={titleFa}
                onChange={(e) => {
                  setTitleFa(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="مثلاً اسکور ارزیابی پانکراتیت"
                className="w-full min-w-0 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                عنوان انگلیسی
              </label>
              <input
                type="text"
                dir="ltr"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. BISAP Score"
                className="w-full min-w-0 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                دسته‌بندی
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ScoreCategory)}
                className="w-full min-w-0 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {SCORE_CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                منبع
              </label>
              <input
                type="text"
                dir="ltr"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. Rosen's Emergency Medicine"
                className="w-full min-w-0 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Criteria Editor */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                معیارها و امتیازها
              </h3>
              {!isBuiltInMode && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddCriterion('boolean')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>چک‌باکس بله/خیر</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddCriterion('select')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>چندگزینه‌ای</span>
                  </button>
                </div>
              )}
            </div>

            {criteria.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30 p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                هنوز معیاری اضافه نشده است؛ نوع اولین معیار را از دکمه‌های بالا انتخاب کنید.
              </div>
            ) : (
              <div className="space-y-2.5">
                {criteria.map((c, idx) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3 space-y-2.5 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <input
                        type="text"
                        value={c.label}
                        onChange={(e) => handleUpdateCriterion(idx, { label: e.target.value })}
                        placeholder="متن معیار را بنویسید..."
                        className="w-full min-w-0 sm:flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />

                      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                        {c.type === 'boolean' && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              امتیاز:
                            </span>
                            <input
                              type="number"
                              step="0.5"
                              dir="ltr"
                              value={c.points ?? 0}
                              onChange={(e) =>
                                handleUpdateCriterion(idx, {
                                  points: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-center text-slate-900 dark:text-white"
                            />
                          </div>
                        )}

                        {c.type === 'number' && c.unit !== undefined && (
                          <input
                            type="text"
                            dir="ltr"
                            value={c.unit}
                            onChange={(e) => handleUpdateCriterion(idx, { unit: e.target.value })}
                            placeholder="واحد"
                            className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-center text-slate-900 dark:text-white"
                          />
                        )}

                        {!isBuiltInMode && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCriterion(idx)}
                            aria-label="حذف معیار"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {c.type === 'select' && c.options && (
                      <div className="space-y-2 pr-3 border-r-2 border-slate-200 dark:border-slate-700">
                        {c.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className="flex flex-wrap sm:flex-nowrap items-center gap-2"
                          >
                            <input
                              type="text"
                              value={opt.label}
                              onChange={(e) =>
                                handleUpdateOption(idx, optIdx, { label: e.target.value })
                              }
                              placeholder={`گزینه ${optIdx + 1}`}
                              className="w-full min-w-0 sm:flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] text-slate-800 dark:text-slate-100"
                            />
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[11px] text-slate-500 sm:hidden">امتیاز:</span>
                              <input
                                type="number"
                                step="0.5"
                                dir="ltr"
                                value={opt.points}
                                onChange={(e) =>
                                  handleUpdateOption(idx, optIdx, {
                                    points: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] font-mono text-center text-slate-900 dark:text-white"
                              />
                              {!isBuiltInMode && c.options && c.options.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(idx, optIdx)}
                                  aria-label="حذف گزینه"
                                  className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer shrink-0"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {!isBuiltInMode && (
                          <button
                            type="button"
                            onClick={() => handleAddOption(idx)}
                            className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                          >
                            + افزودن گزینه
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thresholds for Custom Scores OR Result Text Override for Built-in Scores */}
          {!isBuiltInMode ? (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  تفسیر بازه‌های امتیاز و اقدامات درمانی
                </h3>
                <button
                  type="button"
                  onClick={handleAddThreshold}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>بازه جدید</span>
                </button>
              </div>

              {thresholds.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30 p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  تفسیر اولیه‌ای قرار داده نشده است؛ در صورت نیاز با دکمه «بازه جدید» بازه امتیاز اضافه کنید.
                </div>
              ) : (
                <div className="space-y-3">
                  {thresholds.map((t, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3 space-y-2.5 overflow-hidden"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-600 dark:text-slate-300">از</span>
                            <input
                              type="number"
                              step="0.5"
                              dir="ltr"
                              value={t.minScore}
                              onChange={(e) =>
                                handleUpdateThreshold(idx, {
                                  minScore: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-14 px-1.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-center"
                            />
                            <span className="font-bold text-slate-600 dark:text-slate-300">تا</span>
                            <input
                              type="number"
                              step="0.5"
                              dir="ltr"
                              value={t.maxScore}
                              onChange={(e) =>
                                handleUpdateThreshold(idx, {
                                  maxScore: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-14 px-1.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-center"
                            />
                          </div>

                          <select
                            value={t.riskLevel}
                            onChange={(e) =>
                              handleUpdateThreshold(idx, {
                                riskLevel: e.target.value as RiskLevel,
                              })
                            }
                            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold max-w-full"
                          >
                            {RISK_LEVEL_OPTIONS.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveThreshold(idx)}
                          aria-label="حذف بازه"
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={t.riskTitle}
                          onChange={(e) =>
                            handleUpdateThreshold(idx, { riskTitle: e.target.value })
                          }
                          placeholder="عنوان نتیجه (مثلاً ریسک بالا)"
                          className="w-full min-w-0 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={t.summary}
                          onChange={(e) =>
                            handleUpdateThreshold(idx, { summary: e.target.value })
                          }
                          placeholder="خلاصه کوتاه وضعیت"
                          className="w-full min-w-0 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <textarea
                          rows={2}
                          value={t.diagnosisAndTreatment.join('\n')}
                          onChange={(e) =>
                            handleUpdateThreshold(idx, {
                              diagnosisAndTreatment: e.target.value.split('\n'),
                            })
                          }
                          placeholder="اقدامات تشخیصی و درمانی (هر خط یک مورد)"
                          className="w-full min-w-0 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs leading-relaxed"
                        />
                        <textarea
                          rows={2}
                          value={t.clinicalNotes.join('\n')}
                          onChange={(e) =>
                            handleUpdateThreshold(idx, {
                              clinicalNotes: e.target.value.split('\n'),
                            })
                          }
                          placeholder="نکات بالینی تکمیلی (هر خط یک مورد)"
                          className="w-full min-w-0 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={overrideTexts}
                  onChange={(e) => setOverrideTexts(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-500 shrink-0"
                />
                <span>ویرایش دستی متن نتیجه، اقدامات درمانی و نکات بالینی</span>
              </label>

              {overrideTexts && (
                <div className="space-y-2.5 rounded-xl border border-amber-200 dark:border-amber-800/70 bg-amber-50/40 dark:bg-amber-950/20 p-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      خلاصه وضعیت
                    </label>
                    <input
                      type="text"
                      value={customSummary}
                      onChange={(e) => setCustomSummary(e.target.value)}
                      placeholder="خلاصه دلخواه..."
                      className="w-full min-w-0 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      اقدام تشخیصی و درمانی پیشنهادی (هر خط یک مورد)
                    </label>
                    <textarea
                      rows={3}
                      value={customDxTxText}
                      onChange={(e) => setCustomDxTxText(e.target.value)}
                      className="w-full min-w-0 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      توضیحات و نکات بالینی تکمیلی (هر خط یک مورد)
                    </label>
                    <textarea
                      rows={2}
                      value={customNotesText}
                      onChange={(e) => setCustomNotesText(e.target.value)}
                      className="w-full min-w-0 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره تغییرات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
