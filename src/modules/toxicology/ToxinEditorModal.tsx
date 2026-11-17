import React, { useState } from 'react';
import { RotateCcw, Save, Trash2, X } from 'lucide-react';
import { TOXIN_CATEGORIES } from './data/toxinsData';
import { ToxinCategory, ToxinDefinition } from './types';

interface ToxinEditorModalProps {
  initialToxin: ToxinDefinition | null;
  isBuiltIn: boolean;
  hasOverride: boolean;
  onSave: (toxin: ToxinDefinition) => void;
  onDelete?: () => void;
  onResetOverride?: () => void;
  onClose: () => void;
}

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(arr?: string[]): string {
  return arr && arr.length > 0 ? arr.join('\n') : '';
}

export default function ToxinEditorModal({
  initialToxin,
  isBuiltIn,
  hasOverride,
  onSave,
  onDelete,
  onResetOverride,
  onClose,
}: ToxinEditorModalProps) {
  const isNew = initialToxin === null;

  const [nameFa, setNameFa] = useState(initialToxin?.nameFa ?? '');
  const [nameEn, setNameEn] = useState(initialToxin?.nameEn ?? '');
  const [category, setCategory] = useState<ToxinCategory>(
    initialToxin?.category ?? 'analgesics'
  );
  const [toxidrome, setToxidrome] = useState(initialToxin?.toxidrome ?? '');
  const [toxicDose, setToxicDose] = useState(initialToxin?.toxicDose ?? '');

  const [clinicalFeatures, setClinicalFeatures] = useState(
    arrayToLines(initialToxin?.clinicalFeatures)
  );
  const [diagnostics, setDiagnostics] = useState(
    arrayToLines(initialToxin?.diagnostics)
  );
  const [ecgFindings, setEcgFindings] = useState(
    arrayToLines(initialToxin?.ecgFindings)
  );
  const [decontamination, setDecontamination] = useState(
    arrayToLines(initialToxin?.decontamination)
  );

  const [hasAntidote, setHasAntidote] = useState(Boolean(initialToxin?.antidote));
  const [antidoteNameFa, setAntidoteNameFa] = useState(
    initialToxin?.antidote?.nameFa ?? ''
  );
  const [antidoteNameEn, setAntidoteNameEn] = useState(
    initialToxin?.antidote?.nameEn ?? ''
  );
  const [antidoteDosing, setAntidoteDosing] = useState(
    arrayToLines(initialToxin?.antidote?.dosing)
  );

  const [management, setManagement] = useState(
    arrayToLines(initialToxin?.management)
  );
  const [pitfalls, setPitfalls] = useState(arrayToLines(initialToxin?.pitfalls));
  const [keywordsText, setKeywordsText] = useState(
    (initialToxin?.keywords ?? []).join('، ')
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameFa.trim()) {
      setErrorMsg('لطفاً نام فارسی مسمومیت را وارد کنید.');
      return;
    }

    const catObj = TOXIN_CATEGORIES.find((c) => c.id === category);
    const id =
      initialToxin?.id ??
      `custom-tox-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const parsedKeywords = keywordsText
      .split(/[،,]+/)
      .map((k) => k.trim())
      .filter(Boolean);

    const nextToxin: ToxinDefinition = {
      id,
      nameFa: nameFa.trim(),
      nameEn: nameEn.trim() || nameFa.trim(),
      category,
      categoryLabel: catObj?.label ?? 'سایر مسمومیت‌ها',
      toxidrome: toxidrome.trim() || 'نامشخص / اختصاصی',
      toxicDose: toxicDose.trim() || 'بر اساس شرایط بالینی و میزان مواجهه',
      clinicalFeatures: linesToArray(clinicalFeatures),
      diagnostics: linesToArray(diagnostics),
      ecgFindings:
        linesToArray(ecgFindings).length > 0
          ? linesToArray(ecgFindings)
          : ['تغییر اختصاصی تیپیک گزارش نشده؛ در موارد شدید نوار قلب پایه گرفته شود.'],
      decontamination: linesToArray(decontamination),
      antidote:
        hasAntidote && antidoteNameFa.trim()
          ? {
              nameFa: antidoteNameFa.trim(),
              nameEn: antidoteNameEn.trim() || antidoteNameFa.trim(),
              dosing: linesToArray(antidoteDosing),
            }
          : null,
      management: linesToArray(management),
      pitfalls: linesToArray(pitfalls),
      keywords: parsedKeywords,
    };

    onSave(nextToxin);
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
            {isNew ? 'افزودن مسمومیت جدید' : `ویرایش: ${initialToxin?.nameFa}`}
          </h2>

          <div className="flex items-center gap-1.5 shrink-0">
            {isBuiltIn && hasOverride && onResetOverride && (
              <button
                type="button"
                onClick={onResetOverride}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>متن اصلی</span>
              </button>
            )}

            {!isNew && !isBuiltIn && onDelete && (
              <button
                type="button"
                onClick={onDelete}
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-3 py-2 text-xs font-bold text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                نام فارسی مسمومیت *
              </label>
              <input
                type="text"
                value={nameFa}
                onChange={(e) => {
                  setNameFa(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="مثلاً مسمومیت با متادون"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                نام انگلیسی
              </label>
              <input
                type="text"
                dir="ltr"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Methadone Toxicity"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                دسته‌بندی
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ToxinCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {TOXIN_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                توکسیدروم
              </label>
              <input
                type="text"
                value={toxidrome}
                onChange={(e) => setToxidrome(e.target.value)}
                placeholder="مثلاً اپیوئیدی / آنتی‌کولینرژیک"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              آستانه سمیت (Toxic Dose)
            </label>
            <input
              type="text"
              value={toxicDose}
              onChange={(e) => setToxicDose(e.target.value)}
              placeholder="مثلاً > 150 mg/kg یا > 7.5 g در بزرگسال"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            در کادرهای زیر، هر خط به عنوان یک مورد جداگانه نمایش داده می‌شود.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-rose-700 dark:text-rose-300 mb-1">
                ۱. علائم بالینی
              </label>
              <textarea
                rows={3}
                value={clinicalFeatures}
                onChange={(e) => setClinicalFeatures(e.target.value)}
                placeholder="هر علامت را در یک خط بنویسید..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sky-700 dark:text-sky-300 mb-1">
                ۲. ارزیابی و آزمایشات
              </label>
              <textarea
                rows={3}
                value={diagnostics}
                onChange={(e) => setDiagnostics(e.target.value)}
                placeholder="هر آزمایش یا بررسی را در یک خط بنویسید..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-fuchsia-700 dark:text-fuchsia-300 mb-1">
                ۳. نوار قلب (ECG)
              </label>
              <textarea
                rows={3}
                value={ecgFindings}
                onChange={(e) => setEcgFindings(e.target.value)}
                placeholder="یافته‌های ECG در یک خط..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                ۴. آلودگی‌زدایی
              </label>
              <textarea
                rows={3}
                value={decontamination}
                onChange={(e) => setDecontamination(e.target.value)}
                placeholder="شارکول فعال، شستشو و..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* 5. Antidote */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 dark:text-emerald-200 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAntidote}
                onChange={(e) => setHasAntidote(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-600"
              />
              <span>۵. پادزهر اختصاصی دارد</span>
            </label>

            {hasAntidote && (
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={antidoteNameFa}
                    onChange={(e) => setAntidoteNameFa(e.target.value)}
                    placeholder="نام فارسی پادزهر (مثلاً نالوکسان)"
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    dir="ltr"
                    value={antidoteNameEn}
                    onChange={(e) => setAntidoteNameEn(e.target.value)}
                    placeholder="Antidote English Name"
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <textarea
                  rows={2}
                  value={antidoteDosing}
                  onChange={(e) => setAntidoteDosing(e.target.value)}
                  placeholder="دوز و نحوه تجویز پادزهر (هر خط یک مورد)..."
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-teal-700 dark:text-teal-300 mb-1">
                ۶. درمان‌های اورژانسی
              </label>
              <textarea
                rows={3}
                value={management}
                onChange={(e) => setManagement(e.target.value)}
                placeholder="اقدامات درمانی اورژانسی..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                تله‌ها و خطاهای رایج
              </label>
              <textarea
                rows={3}
                value={pitfalls}
                onChange={(e) => setPitfalls(e.target.value)}
                placeholder="خطاهای بالینی قابل توجه..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              کلیدواژه‌های جستجو (اختیاری، با ویرگول جدا کنید)
            </label>
            <input
              type="text"
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="مثلاً نام تجاری دارو، نام اختصاری..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold shadow-sm cursor-pointer"
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
