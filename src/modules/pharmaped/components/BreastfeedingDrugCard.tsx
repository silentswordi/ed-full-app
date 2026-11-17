import React from 'react';
import { BreastfeedingDrugItem } from '../data/breastfeedingGuideData';
import { CheckCircle2, AlertTriangle, XCircle, Pencil, Trash2 } from 'lucide-react';

interface BreastfeedingDrugCardProps {
  drug: BreastfeedingDrugItem;
  onEdit?: (drug: BreastfeedingDrugItem) => void;
  onDelete?: (drug: BreastfeedingDrugItem) => void;
}

export const BreastfeedingDrugCard: React.FC<BreastfeedingDrugCardProps> = ({ drug, onEdit, onDelete }) => {
  const isCompatible = drug.status === 'compatible';
  const isCaution = drug.status === 'caution';
  const isContraindicated = drug.status === 'contraindicated';

  return (
    <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden relative">
      {/* Top Header Section matching the style */}
      <div className="p-4 sm:p-5 text-center border-b border-slate-100 dark:border-slate-800/80 relative">
        {(onEdit || onDelete) && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5">
            {onEdit && (
              <button
                onClick={() => onEdit(drug)}
                title="ویرایش اطلاعات دارو"
                aria-label="ویرایش اطلاعات دارو"
                className="p-2 rounded-xl text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-all active:scale-95"
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

        {/* Safety Badge Button/Pill */}
        <div className="mt-4 flex justify-center">
          <div
            className={`w-full max-w-md py-2 px-4 rounded-xl text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
              isCompatible
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : isCaution
                ? 'bg-amber-50/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
            }`}
          >
            {isCompatible && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
            {isCaution && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />}
            {isContraindicated && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
            <span>{drug.statusBadge}</span>
          </div>
        </div>
      </div>

      {/* Middle Section: وضعیت ایمنی در دوران شیردهی */}
      <div
        className={`p-4 sm:p-5 transition-colors ${
          isCompatible
            ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
            : isCaution
            ? 'bg-amber-50/40 dark:bg-amber-950/20'
            : 'bg-rose-50/40 dark:bg-rose-950/20'
        }`}
      >
        <div className="text-center space-y-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            وضعیت ایمنی در دوران شیردهی:
          </span>
          <p
            className={`text-sm sm:text-base font-extrabold leading-relaxed ${
              isCompatible
                ? 'text-emerald-900 dark:text-emerald-200'
                : isCaution
                ? 'text-amber-900 dark:text-amber-200'
                : 'text-rose-900 dark:text-rose-200'
            }`}
          >
            {drug.lactMedNote || (isCompatible ? 'سازگار در مصرف کوتاه‌مدت معمول و بی‌خطر برای شیرخوار.' : isCaution ? 'نیازمند پایش علائم نوزاد و احتیاط در تجویز.' : 'معمولاً اجتناب شود؛ خطر برای شیرخوار یا کاهش شدید شیر مادر.')}
          </p>
        </div>
      </div>
    </article>
  );
};
