import React from 'react';
import { PediatricDrug } from '../data/pediatricDrugs';
import { Clock, Pill, Pencil, Trash2 } from 'lucide-react';

interface PediatricDrugCardProps {
  drug: PediatricDrug;
  onEdit?: (drug: PediatricDrug) => void;
  onDelete?: (drug: PediatricDrug) => void;
}

export const PediatricDrugCard: React.FC<PediatricDrugCardProps> = ({ drug, onEdit, onDelete }) => {
  // Split forms into structured list for clean rendering
  const formList = drug.form.split('|').map(f => f.trim());

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {drug.nameFa}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-semibold text-teal-700 dark:text-teal-400 font-sans tracking-wide">
                {drug.nameEn}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                ({drug.indication})
              </span>
            </div>
          </div>

          {/* Action buttons (icon only) */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1.5 shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(drug)}
                  title="ویرایش اطلاعات دارو یا افزودن فرم دارویی جدید"
                  aria-label="ویرایش اطلاعات دارو"
                  className="p-2 rounded-xl text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 transition-all active:scale-95"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(drug)}
                  title="حذف کامل دارو"
                  aria-label="حذف کامل دارو"
                  className="p-2 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-all active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body Section 1: دوز اطفال به ازای هر کیلوگرم در هر نوبت (matching screenshot) */}
      <div className="p-4 sm:p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              دوز اطفال به ازای هر کیلوگرم در هر نوبت (mg/kg/dose):
            </h4>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              <Clock className="w-3.5 h-3.5" />
              فاصله تجویز: {drug.intervalFa || drug.interval}
            </span>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
            {drug.dosage}
          </div>
        </div>

        {/* Body Section 2: فرم‌های دارویی موجود و دوز هر فرم */}
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
            فرم‌های دارویی موجود و دوز هر فرم:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {formList.map((formItem, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
              >
                <Pill className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="font-mono font-semibold text-slate-900 dark:text-white" dir="ltr">
                  {formItem}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Max Dose */}
        {drug.maxDose && drug.maxDose !== "--" && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">حداکثر دوز مجاز:</span>
            <span>{drug.maxDose}</span>
          </div>
        )}
      </div>
    </article>
  );
};
