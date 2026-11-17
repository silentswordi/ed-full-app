import React, { useState } from 'react';
import { PEDIATRIC_DRUGS, calculateDrugDose, PediatricDrug } from '../data/pediatricDrugs';
import { Calculator, AlertTriangle, CheckCircle, Copy, Check, Clock, Pill } from 'lucide-react';

export const DedicatedCalculator: React.FC = () => {
  const [selectedDrugNo, setSelectedDrugNo] = useState<number>(1); // Default to Acetaminophen
  const [weightKg, setWeightKg] = useState<number>(12);
  const [ageYears, setAgeYears] = useState<number>(2.5);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedDrug = PEDIATRIC_DRUGS.find(d => d.no === selectedDrugNo) || PEDIATRIC_DRUGS[0];
  const result = calculateDrugDose(selectedDrug, weightKg, ageYears);

  // Common quick-weight buttons
  const quickWeights = [4, 6, 8, 10, 12, 14, 16, 20, 25, 30];

  const handleCopy = () => {
    if (!result.calculatedTextFa) return;
    const textToCopy = `دارو: ${selectedDrug.nameFa} (${selectedDrug.nameEn})\nوزن کودک: ${weightKg} کیلوگرم\n${result.calculatedTextFa}\nفاصله تجویز: ${selectedDrug.intervalFa || selectedDrug.interval}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header card */}
      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 p-5 rounded-2xl border border-teal-200 dark:border-teal-800 shadow-xs text-center space-y-1.5">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
          <Calculator className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-teal-950 dark:text-teal-200">
          محاسبه‌گر هوشمند دوز وزنی کودکان
        </h2>
        <p className="text-xs text-teal-800 dark:text-teal-300 max-w-md mx-auto leading-relaxed">
          محاسبه دقیق سی‌سی، قطره و میلی‌گرم بر پایه وزن کودک و فرمول‌های سریع کتابچه دانشگاه علوم پزشکی
        </p>
      </div>

      {/* Inputs Form */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {/* Drug Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            انتخاب داروی مورد نظر:
          </label>
          <select
            value={selectedDrugNo}
            onChange={(e) => setSelectedDrugNo(Number(e.target.value))}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {PEDIATRIC_DRUGS.map((d) => (
              <option key={d.no} value={d.no}>
                #{d.no} - {d.nameFa} ({d.nameEn}) - {d.category}
              </option>
            ))}
          </select>
        </div>

        {/* Weight & Age Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                وزن کودک (کیلوگرم):
              </label>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">
                {weightKg} kg
              </span>
            </div>
            <input
              type="number"
              min="1"
              max="70"
              step="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                سن کودک (سال):
              </label>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">
                {ageYears} سال
              </span>
            </div>
            <input
              type="number"
              min="0.1"
              max="16"
              step="0.5"
              value={ageYears}
              onChange={(e) => setAgeYears(Math.max(0.1, parseFloat(e.target.value) || 0))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Quick Weight Presets */}
        <div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
            وزن‌های متداول:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickWeights.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeightKg(w)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  weightKg === w
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {w} kg
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Display Box */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-teal-500/50 dark:border-teal-600/50 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 block">
              نتیجه محاسبه دوز برای کودک {weightKg} کیلوگرمی:
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {selectedDrug.nameFa}
            </h3>
            <span className="text-xs text-slate-500 font-sans" dir="ltr">
              {selectedDrug.nameEn}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'کپی شد' : 'کپی دستور'}</span>
          </button>
        </div>

        {/* Calculated Text */}
        <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80">
          <div className="whitespace-pre-line text-sm sm:text-base font-bold text-teal-950 dark:text-teal-100 leading-relaxed">
            {result.calculatedTextFa}
          </div>
        </div>

        {/* Interval & Formula details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">فاصله مصرف:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDrug.intervalFa || selectedDrug.interval}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">حداکثر دوز روزانه:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDrug.maxDose || "طبق تجویز"}</span>
            </div>
          </div>
        </div>

        {/* Age warning if applicable */}
        {result.warningNoticeFa && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 text-xs flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{result.warningNoticeFa}</span>
          </div>
        )}

        {/* Clinical notes for the selected drug */}
        {selectedDrug.notice && (
          <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900 text-amber-950 dark:text-amber-200 text-xs leading-relaxed">
            <span className="font-bold">نکات تکمیلی کتابچه: </span>
            {selectedDrug.notice}
          </div>
        )}
      </div>
    </div>
  );
};
