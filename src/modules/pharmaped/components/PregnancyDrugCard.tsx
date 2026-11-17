import React from 'react';
import { PregnancyDrugItem } from '../data/pregnancyDrugs';
import { CheckCircle2, AlertTriangle, XCircle, Pencil, Trash2 } from 'lucide-react';

interface PregnancyDrugCardProps {
  drug: PregnancyDrugItem;
  onEdit?: (drug: PregnancyDrugItem) => void;
  onDelete?: (drug: PregnancyDrugItem) => void;
}

export const PregnancyDrugCard: React.FC<PregnancyDrugCardProps> = ({ drug, onEdit, onDelete }) => {
  const isSafe = drug.status === 'safe';
  const isContraindicated = drug.status === 'contraindicated';
  const isCaution = drug.status === 'caution';

  const getTrimesterBadge = (status: 'safe' | 'caution' | 'contraindicated') => {
    switch (status) {
      case 'safe':
        return <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">مجاز</span>;
      case 'caution':
        return <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-md">با احتیاط</span>;
      case 'contraindicated':
        return <span className="text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded-md">ممنوع</span>;
    }
  };

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden relative">
      {/* Top Header Section matching Screenshot 1 */}
      <div className="p-4 sm:p-5 text-center border-b border-slate-100 dark:border-slate-800/80 relative">
        {(onEdit || onDelete) && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5">
            {onEdit && (
              <button
                onClick={() => onEdit(drug)}
                title="ویرایش اطلاعات دارو"
                aria-label="ویرایش اطلاعات دارو"
                className="p-2 rounded-xl text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-all active:scale-95"
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

        <div className="text-center px-16 sm:px-20">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
            {drug.nameFa}
          </h3>
          <div className="text-sm sm:text-base font-bold text-teal-700 dark:text-teal-400 font-sans tracking-wide">
            {drug.nameEn}
          </div>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            ({drug.indication})
          </div>
        </div>

        {/* Safety Badge Button/Pill matching Screenshot 1 */}
        <div className="mt-4 flex justify-center">
          <div
            className={`w-full max-w-md py-2 px-4 rounded-xl text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
              isSafe
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : isCaution
                ? 'bg-amber-50/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
            }`}
          >
            {isSafe && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
            {isCaution && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />}
            {isContraindicated && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
            <span>{drug.statusBadge}</span>
          </div>
        </div>
      </div>

      {/* Middle Section: زمان مجاز بودن در دوران بارداری (matching Screenshot 1) */}
      <div
        className={`p-4 sm:p-5 transition-colors ${
          isSafe
            ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
            : isCaution
            ? 'bg-amber-50/40 dark:bg-amber-950/20'
            : 'bg-rose-50/40 dark:bg-rose-950/20'
        }`}
      >
        <div className="text-center space-y-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            زمان مجاز بودن در دوران بارداری:
          </span>
          <p
            className={`text-sm sm:text-base font-extrabold leading-relaxed ${
              isSafe
                ? 'text-emerald-900 dark:text-emerald-200'
                : isCaution
                ? 'text-amber-900 dark:text-amber-200'
                : 'text-rose-900 dark:text-rose-200'
            }`}
          >
            {drug.allowedTiming}
          </p>
        </div>

        {/* Trimesters breakdown badges */}
        <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400">سه‌ماهه اول:</span>
            {getTrimesterBadge(drug.trimesterSafety.t1)}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400">سه‌ماهه دوم:</span>
            {getTrimesterBadge(drug.trimesterSafety.t2)}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400">سه‌ماهه سوم:</span>
            {getTrimesterBadge(drug.trimesterSafety.t3)}
          </div>
        </div>
      </div>
    </article>
  );
};
