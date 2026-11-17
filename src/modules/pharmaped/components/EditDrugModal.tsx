import React, { useState, useEffect } from 'react';
import { X, Check, Edit3, Plus, Trash2, RotateCcw, Pill } from 'lucide-react';
import { PediatricDrug } from '../data/pediatricDrugs';
import { PregnancyDrugItem } from '../data/pregnancyDrugs';
import { BreastfeedingDrugItem } from '../data/breastfeedingGuideData';

export type EditingTarget = 
  | { type: 'pediatric'; drug: PediatricDrug }
  | { type: 'pregnancy'; drug: PregnancyDrugItem }
  | { type: 'breastfeeding'; drug: BreastfeedingDrugItem }
  | null;

interface EditDrugModalProps {
  target: EditingTarget;
  isOpen: boolean;
  onClose: () => void;
  onSavePediatric: (updated: PediatricDrug) => void;
  onSavePregnancy: (updated: PregnancyDrugItem) => void;
  onSaveBreastfeeding: (updated: BreastfeedingDrugItem) => void;
  onResetPediatric?: (no: number) => void;
  onResetPregnancy?: (id: string) => void;
  onResetBreastfeeding?: (id: string) => void;
  isCustomized?: boolean;
}

export const EditDrugModal: React.FC<EditDrugModalProps> = ({
  target,
  isOpen,
  onClose,
  onSavePediatric,
  onSavePregnancy,
  onSaveBreastfeeding,
  onResetPediatric,
  onResetPregnancy,
  onResetBreastfeeding,
  isCustomized = false
}) => {
  // Common states
  const [nameFa, setNameFa] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [indication, setIndication] = useState('');

  // Pediatric states
  const [dosage, setDosage] = useState('');
  const [interval, setInterval] = useState('');
  const [maxDose, setMaxDose] = useState('');
  const [formList, setFormList] = useState<string[]>([]);
  const [newFormInput, setNewFormInput] = useState('');

  // Pregnancy states
  const [pregStatus, setPregStatus] = useState<'safe' | 'caution' | 'contraindicated'>('safe');
  const [pregStatusBadge, setPregStatusBadge] = useState('');
  const [allowedTiming, setAllowedTiming] = useState('');
  const [t1, setT1] = useState<'safe' | 'caution' | 'contraindicated'>('safe');
  const [t2, setT2] = useState<'safe' | 'caution' | 'contraindicated'>('safe');
  const [t3, setT3] = useState<'safe' | 'caution' | 'contraindicated'>('safe');

  // Breastfeeding states
  const [bfStatus, setBfStatus] = useState<'compatible' | 'caution' | 'contraindicated'>('compatible');
  const [bfStatusBadge, setBfStatusBadge] = useState('');
  const [lactMedNote, setLactMedNote] = useState('');

  // Pre-fill when target changes or modal opens
  useEffect(() => {
    if (!target) return;

    if (target.type === 'pediatric') {
      const d = target.drug;
      setNameFa(d.nameFa || '');
      setNameEn(d.nameEn || '');
      setIndication(d.indication || '');
      setDosage(d.dosage || '');
      setInterval(d.intervalFa || d.interval || '');
      setMaxDose(d.maxDose || '');
      const parsedForms = d.form ? d.form.split('|').map(f => f.trim()).filter(Boolean) : [];
      setFormList(parsedForms);
      setNewFormInput('');
    } else if (target.type === 'pregnancy') {
      const d = target.drug;
      setNameFa(d.nameFa || '');
      setNameEn(d.nameEn || '');
      setIndication(d.indication || '');
      setPregStatus(d.status || 'safe');
      setPregStatusBadge(d.statusBadge || '');
      setAllowedTiming(d.allowedTiming || '');
      setT1(d.trimesterSafety?.t1 || 'safe');
      setT2(d.trimesterSafety?.t2 || 'safe');
      setT3(d.trimesterSafety?.t3 || 'safe');
    } else if (target.type === 'breastfeeding') {
      const d = target.drug;
      setNameFa(d.nameFa || '');
      setNameEn(d.nameEn || '');
      setIndication(d.indication || '');
      setBfStatus(d.status || 'compatible');
      setBfStatusBadge(d.statusBadge || '');
      setLactMedNote(d.lactMedNote || '');
    }
  }, [target, isOpen]);

  const [formError, setFormError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen || !target) return null;

  // Add a new form to the list
  const handleAddNewForm = () => {
    const trimmed = newFormInput.trim();
    if (!trimmed) return;
    setFormList(prev => [...prev, trimmed]);
    setNewFormInput('');
  };

  // Remove a form by index
  const handleRemoveForm = (index: number) => {
    setFormList(prev => prev.filter((_, i) => i !== index));
  };

  // Update a form inline
  const handleUpdateFormItem = (index: number, val: string) => {
    setFormList(prev => prev.map((item, i) => (i === index ? val : item)));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameFa.trim() || !nameEn.trim()) {
      setFormError('لطفاً نام فارسی و انگلیسی دارو را وارد نمایید.');
      return;
    }
    setFormError(null);

    if (target.type === 'pediatric') {
      // Build form string
      let finalForm = formList.map(f => f.trim()).filter(Boolean).join(' | ');
      if (newFormInput.trim()) {
        finalForm = finalForm ? `${finalForm} | ${newFormInput.trim()}` : newFormInput.trim();
      }

      const updated: PediatricDrug = {
        ...target.drug,
        nameFa: nameFa.trim(),
        nameEn: nameEn.trim(),
        indication: indication.trim(),
        dosage: dosage.trim(),
        interval: interval.trim(),
        intervalFa: interval.trim(),
        maxDose: maxDose.trim(),
        form: finalForm || 'Tab | Syr'
      };
      onSavePediatric(updated);
    } else if (target.type === 'pregnancy') {
      const updated: PregnancyDrugItem = {
        ...target.drug,
        nameFa: nameFa.trim(),
        nameEn: nameEn.trim(),
        indication: indication.trim(),
        status: pregStatus,
        statusBadge: pregStatusBadge.trim() || (pregStatus === 'safe' ? 'مجاز و انتخابی' : pregStatus === 'caution' ? 'با احتیاط' : 'ممنوع (اجتناب گردد)'),
        allowedTiming: allowedTiming.trim() || (pregStatus === 'safe' ? 'مجاز در تمام دوران بارداری' : 'طبق نظر پزشک'),
        trimesterSafety: {
          t1,
          t2,
          t3
        }
      };
      onSavePregnancy(updated);
    } else if (target.type === 'breastfeeding') {
      const updated: BreastfeedingDrugItem = {
        ...target.drug,
        nameFa: nameFa.trim(),
        nameEn: nameEn.trim(),
        indication: indication.trim(),
        status: bfStatus,
        statusBadge: bfStatusBadge.trim() || (bfStatus === 'compatible' ? 'سازگار در مصرف معمول (ایمن)' : bfStatus === 'caution' ? 'با احتیاط' : 'معمولاً اجتناب شود'),
        lactMedNote: lactMedNote.trim()
      };
      onSaveBreastfeeding(updated);
    }

    onClose();
  };

  // Reset Handler
  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setConfirmReset(false);
    if (target.type === 'pediatric' && onResetPediatric) {
      onResetPediatric(target.drug.no);
    } else if (target.type === 'pregnancy' && onResetPregnancy) {
      onResetPregnancy(target.drug.id);
    } else if (target.type === 'breastfeeding' && onResetBreastfeeding) {
      onResetBreastfeeding(target.drug.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                ویرایش و اصلاح اطلاعات دارو
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {target.type === 'pediatric'
                  ? 'بخش داروهای اطفال (ویرایش دوز، فواصل و اشکال دارویی)'
                  : target.type === 'pregnancy'
                  ? 'بخش داروهای در بارداری (ویرایش وضعیت ایمنی و سه‌ماهه‌ها)'
                  : 'بخش داروها در شیردهی (ویرایش سازگاری و نکات شیردهی)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Drug Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                نام فارسی دارو: *
              </label>
              <input
                type="text"
                required
                value={nameFa}
                onChange={e => setNameFa(e.target.value)}
                placeholder="مثلاً: پنتوپرازول"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                نام انگلیسی (ژنریک): *
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={e => setNameEn(e.target.value)}
                placeholder="e.g. Pantoprazole"
                dir="ltr"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Indication */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              کاربرد / اندیکاسیون بالینی:
            </label>
            <input
              type="text"
              value={indication}
              onChange={e => setIndication(e.target.value)}
              placeholder="مثلاً: ریفلاکس اسید، ازوفاژیت اروزیو و زخم گوارشی"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* --- TAB 1: PEDIATRIC SPECIFIC FIELDS --- */}
          {target.type === 'pediatric' && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* Dosage & Interval */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  دوز اطفال به ازای هر کیلوگرم در هر نوبت (mg/kg/dose):
                </label>
                <textarea
                  rows={2}
                  value={dosage}
                  onChange={e => setDosage(e.target.value)}
                  placeholder="مثلاً: 1 - 2 mg/kg/day منقسم در ۱ تا ۲ نوبت"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white resize-none"
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
                    onChange={e => setInterval(e.target.value)}
                    placeholder="مثلاً: هر ۱۲ تا ۲۴ ساعت (Q12 - 24hr)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    حداکثر دوز مجاز:
                  </label>
                  <input
                    type="text"
                    value={maxDose}
                    onChange={e => setMaxDose(e.target.value)}
                    placeholder="مثلاً: 40 mg / day"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Form List Management (Requirement: قابلیت افزودن فرم دارویی جدید و اصلاح فرم‌ها) */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    فرم‌های دارویی موجود و دوز هر فرم:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({formList.length} فرم ثبت شده)
                  </span>
                </div>

                {/* List of current forms with edit & delete */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {formList.map((fItem, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={fItem}
                        onChange={e => handleUpdateFormItem(idx, e.target.value)}
                        dir="ltr"
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveForm(idx)}
                        title="حذف این فرم دارویی"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formList.length === 0 && (
                    <p className="text-xs text-slate-400 py-1 text-center">
                      هنوز هیچ فرم دارویی ثبت نشده است. از کادر زیر فرم جدید اضافه کنید.
                    </p>
                  )}
                </div>

                {/* Add New Form Input */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                  <input
                    type="text"
                    value={newFormInput}
                    onChange={e => setNewFormInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNewForm();
                      }
                    }}
                    placeholder="فرم دارویی جدید (مثلاً: Vial 40mg یا Susp 100mg/5ml)"
                    dir="ltr"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewForm}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن فرم</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 2: PREGNANCY SPECIFIC FIELDS --- */}
          {target.type === 'pregnancy' && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* Overall Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  وضعیت ایمنی کلی در دوران بارداری:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPregStatus('safe');
                      if (!pregStatusBadge) setPregStatusBadge('مجاز و انتخابی');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      pregStatus === 'safe'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    مجاز (Safe)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPregStatus('caution');
                      if (!pregStatusBadge) setPregStatusBadge('با احتیاط');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      pregStatus === 'caution'
                        ? 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    با احتیاط (Caution)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPregStatus('contraindicated');
                      if (!pregStatusBadge) setPregStatusBadge('ممنوع (اجتناب گردد)');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      pregStatus === 'contraindicated'
                        ? 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    ممنوع (Contraindicated)
                  </button>
                </div>
              </div>

              {/* Status Badge Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  متن برچسب ایمنی:
                </label>
                <input
                  type="text"
                  value={pregStatusBadge}
                  onChange={e => setPregStatusBadge(e.target.value)}
                  placeholder="مثلاً: مجاز در صورت نیاز بالینی (رده B بارداری)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Allowed Timing */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  زمان مجاز بودن در دوران بارداری:
                </label>
                <input
                  type="text"
                  value={allowedTiming}
                  onChange={e => setAllowedTiming(e.target.value)}
                  placeholder="مثلاً: مجاز در تمام دوران بارداری (سه‌ماهه اول، دوم و سوم)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Trimesters breakdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  تفکیک وضعیت در سه‌ماهه‌های بارداری:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">سه‌ماهه اول</span>
                    <select
                      value={t1}
                      onChange={e => setT1(e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="safe">مجاز</option>
                      <option value="caution">با احتیاط</option>
                      <option value="contraindicated">ممنوع</option>
                    </select>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">سه‌ماهه دوم</span>
                    <select
                      value={t2}
                      onChange={e => setT2(e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="safe">مجاز</option>
                      <option value="caution">با احتیاط</option>
                      <option value="contraindicated">ممنوع</option>
                    </select>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">سه‌ماهه سوم</span>
                    <select
                      value={t3}
                      onChange={e => setT3(e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="safe">مجاز</option>
                      <option value="caution">با احتیاط</option>
                      <option value="contraindicated">ممنوع</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 3: BREASTFEEDING SPECIFIC FIELDS --- */}
          {target.type === 'breastfeeding' && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* Overall Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  وضعیت ایمنی در دوران شیردهی:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBfStatus('compatible');
                      if (!bfStatusBadge) setBfStatusBadge('سازگار در مصرف معمول (ایمن)');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      bfStatus === 'compatible'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    سازگار (ایمن)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBfStatus('caution');
                      if (!bfStatusBadge) setBfStatusBadge('با احتیاط؛ پایش شرایط نوزاد');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      bfStatus === 'caution'
                        ? 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    با احتیاط (Caution)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBfStatus('contraindicated');
                      if (!bfStatusBadge) setBfStatusBadge('ممنوع / اجتناب گردد');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      bfStatus === 'contraindicated'
                        ? 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    ممنوع (Contraindicated)
                  </button>
                </div>
              </div>

              {/* Status Badge Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  متن برچسب وضعیت شیردهی:
                </label>
                <input
                  type="text"
                  value={bfStatusBadge}
                  onChange={e => setBfStatusBadge(e.target.value)}
                  placeholder="مثلاً: سازگار در مصرف معمول (کم‌خطر)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* LactMed note / Breastfeeding details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  توضیحات و وضعیت ایمنی در شیردهی:
                </label>
                <textarea
                  rows={3}
                  value={lactMedNote}
                  onChange={e => setLactMedNote(e.target.value)}
                  placeholder="مثلاً: ترشح ناچیز در شیر مادر؛ بدون عارضه جانبی گزارش‌شده بر شیرخوار."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white resize-none"
                />
              </div>
            </div>
          )}

          {formError && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {formError}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {isCustomized && (
                <button
                  type="button"
                  onClick={handleReset}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    confirmReset
                      ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700'
                      : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{confirmReset ? 'تأیید بازنشانی؟' : 'بازنشانی به پیش‌فرض'}</span>
                </button>
              )}
              {confirmReset && (
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
                >
                  لغو
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-md active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>ذخیره تغییرات</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
