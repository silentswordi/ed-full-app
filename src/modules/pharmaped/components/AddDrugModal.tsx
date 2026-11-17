import React, { useState } from 'react';
import { X, PlusCircle, Check } from 'lucide-react';
import { PediatricDrug } from '../data/pediatricDrugs';
import { PregnancyDrugItem } from '../data/pregnancyDrugs';
import { BreastfeedingDrugItem } from '../data/breastfeedingGuideData';

interface AddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPediatric: (drug: PediatricDrug) => void;
  onAddPregnancy: (drug: PregnancyDrugItem) => void;
  onAddBreastfeeding: (drug: BreastfeedingDrugItem) => void;
  defaultTab?: 'pediatric' | 'pregnancy' | 'breastfeeding';
}

export const AddDrugModal: React.FC<AddDrugModalProps> = ({
  isOpen,
  onClose,
  onAddPediatric,
  onAddPregnancy,
  onAddBreastfeeding,
  defaultTab = 'pediatric'
}) => {
  const [targetType, setTargetType] = useState<'pediatric' | 'pregnancy' | 'breastfeeding'>(defaultTab);

  // Common fields
  const [nameFa, setNameFa] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [indication, setIndication] = useState('');

  // Pediatric fields
  const [dosage, setDosage] = useState('');
  const [interval, setInterval] = useState('');
  const [form, setForm] = useState('');
  const [maxDose, setMaxDose] = useState('');

  // Pregnancy / Breastfeeding fields
  const [safetyStatus, setSafetyStatus] = useState<'safe' | 'caution' | 'contraindicated'>('safe');
  const [allowedTiming, setAllowedTiming] = useState('مجاز در تمام دوران بارداری');
  const [lactMedNote, setLactMedNote] = useState('سازگار در مصرف معمول و کوتاه‌مدت.');

  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameFa.trim() || !nameEn.trim()) {
      setFormError('لطفاً نام فارسی و انگلیسی دارو را وارد نمایید.');
      return;
    }
    setFormError(null);

    if (targetType === 'pediatric') {
      const newDrug: PediatricDrug = {
        no: Date.now(),
        hasRenalAdjustment: false,
        nameEn: nameEn.trim(),
        nameFa: nameFa.trim(),
        form: form.trim() || 'Tab | Syr',
        indication: indication.trim() || 'درمان دارویی',
        dosage: dosage.trim() || 'طبق دستور پزشک',
        interval: interval.trim() || 'طبق دستور',
        intervalFa: interval.trim() || 'طبق دستور',
        maxDose: maxDose.trim() || 'طبق تجویز',
        notice: '',
        category: 'سایر'
      };
      onAddPediatric(newDrug);
    } else if (targetType === 'pregnancy') {
      const newDrug: PregnancyDrugItem = {
        id: `custom-preg-${Date.now()}`,
        category: "سایر",
        categoryEn: "Other",
        nameFa: nameFa.trim(),
        nameEn: nameEn.trim(),
        indication: indication.trim() || 'درمان دارویی',
        status: safetyStatus,
        statusBadge: safetyStatus === 'safe' ? 'مجاز و انتخابی' : safetyStatus === 'caution' ? 'با احتیاط' : 'ممنوع (اجتناب گردد)',
        allowedTiming: allowedTiming.trim() || (safetyStatus === 'safe' ? 'مجاز در تمام دوران بارداری' : 'نیازمند نظر متخصص'),
        clinicalNotes: '',
        adverseEffects: '',
        trimesterSafety: {
          t1: safetyStatus,
          t2: safetyStatus,
          t3: safetyStatus
        }
      };
      onAddPregnancy(newDrug);
    } else {
      const newDrug: BreastfeedingDrugItem = {
        id: `custom-bf-${Date.now()}`,
        nameFa: nameFa.trim(),
        nameEn: nameEn.trim(),
        indication: indication.trim() || 'درمان دارویی',
        status: safetyStatus === 'safe' ? 'compatible' : safetyStatus === 'caution' ? 'caution' : 'contraindicated',
        statusBadge: safetyStatus === 'safe' ? 'سازگار در مصرف معمول (ایمن)' : safetyStatus === 'caution' ? 'با احتیاط؛ پایش شرایط لازم است' : 'معمولاً اجتناب شود یا جایگزین لازم است',
        lactMedNote: lactMedNote.trim() || (safetyStatus === 'safe' ? 'ترشح ناچیز در شیر و ایمن برای نوزاد.' : 'با احتیاط یا پرهیز مصرف شود.')
      };
      onAddBreastfeeding(newDrug);
    }

    // Reset & close
    setNameFa('');
    setNameEn('');
    setIndication('');
    setDosage('');
    setInterval('');
    setForm('');
    setMaxDose('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              افزودن داروی جدید به نرم‌افزار
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Section Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              افزودن به کدام بخش:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetType('pediatric')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  targetType === 'pediatric'
                    ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-400'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                داروهای اطفال
              </button>
              <button
                type="button"
                onClick={() => setTargetType('pregnancy')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  targetType === 'pregnancy'
                    ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-400'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                داروها در بارداری
              </button>
              <button
                type="button"
                onClick={() => setTargetType('breastfeeding')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  targetType === 'breastfeeding'
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-400'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                داروها در شیردهی
              </button>
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                نام فارسی دارو:
              </label>
              <input
                type="text"
                required
                value={nameFa}
                onChange={(e) => setNameFa(e.target.value)}
                placeholder="مثال: سفکسیم"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                نام انگلیسی (Generic):
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Cefixime"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                dir="ltr"
              />
            </div>
          </div>

          {/* Indication */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              اندیکاسیون / کاربرد:
            </label>
            <input
              type="text"
              value={indication}
              onChange={(e) => setIndication(e.target.value)}
              placeholder="مثال: عفونت ادراری، اوتیت، ضد درد..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Type Specific Fields */}
          {targetType === 'pediatric' ? (
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  دوز اطفال به ازای هر کیلوگرم در هر نوبت:
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="مثال: 8 mg/kg/day"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    فاصله تجویز:
                  </label>
                  <input
                    type="text"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                    placeholder="مثال: هر ۱۲ ساعت (BID)"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    حداکثر دوز روزانه:
                  </label>
                  <input
                    type="text"
                    value={maxDose}
                    onChange={(e) => setMaxDose(e.target.value)}
                    placeholder="مثال: 400 mg / day"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  فرم‌های دارویی (با | جدا کنید):
                </label>
                <input
                  type="text"
                  value={form}
                  onChange={(e) => setForm(e.target.value)}
                  placeholder="مثال: Susp 100mg/5ml | Tab 200, 400mg"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          ) : (
            /* Pregnancy / Breastfeeding */
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  وضعیت ایمنی:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSafetyStatus('safe')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      safetyStatus === 'safe'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    مجاز و ایمن
                  </button>
                  <button
                    type="button"
                    onClick={() => setSafetyStatus('caution')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      safetyStatus === 'caution'
                        ? 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    با احتیاط
                  </button>
                  <button
                    type="button"
                    onClick={() => setSafetyStatus('contraindicated')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      safetyStatus === 'contraindicated'
                        ? 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    ممنوع
                  </button>
                </div>
              </div>

              {targetType === 'pregnancy' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    زمان مجاز بودن در بارداری:
                  </label>
                  <input
                    type="text"
                    value={allowedTiming}
                    onChange={(e) => setAllowedTiming(e.target.value)}
                    placeholder="مثال: مجاز در تمام دوران بارداری"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    توضیحات ایمنی در شیردهی:
                  </label>
                  <input
                    type="text"
                    value={lactMedNote}
                    onChange={(e) => setLactMedNote(e.target.value)}
                    placeholder="مثال: ترشح ناچیز در شیر مادر؛ کاملاً سازگار با شیردهی."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}
            </div>
          )}

          {formError && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {formError}
            </div>
          )}

          {/* Submit button */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>ثبت و ذخیره دارو</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
