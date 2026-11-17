import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Droplets,
  Flame,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import {
  BODY_REGIONS,
  BURN_DEPTH_GUIDELINES,
  BodyRegionDefinition,
  BurnAgeGroup,
  BurnDepthId,
  RegionAssessment,
  RegionCoverage,
  evaluateBurnManagement,
} from './burnData';

type RegionId = BodyRegionDefinition['id'];

const INITIAL_REGIONS: Record<RegionId, RegionAssessment> = {
  head: { coverage: 0, depth: 'second_superficial' },
  anterior_trunk: { coverage: 0, depth: 'second_superficial' },
  posterior_trunk: { coverage: 0, depth: 'second_superficial' },
  right_arm: { coverage: 0, depth: 'second_superficial' },
  left_arm: { coverage: 0, depth: 'second_superficial' },
  right_leg: { coverage: 0, depth: 'second_superficial' },
  left_leg: { coverage: 0, depth: 'second_superficial' },
  perineum: { coverage: 0, depth: 'second_superficial' },
};

const COVERAGE_OPTIONS: { val: RegionCoverage; label: string }[] = [
  { val: 0, label: '۰' },
  { val: 0.25, label: '۱/۴' },
  { val: 0.5, label: '۱/۲' },
  { val: 1, label: 'کامل' },
];

function normalizeNumericInput(raw: string): string {
  const persian = '۰۱۲۳۴۵۶۷۸۹';
  const arabic = '٠١٢٣٤٥٦٧٨٩';
  let out = '';
  for (const ch of raw) {
    const pIdx = persian.indexOf(ch);
    if (pIdx !== -1) {
      out += String(pIdx);
      continue;
    }
    const aIdx = arabic.indexOf(ch);
    if (aIdx !== -1) {
      out += String(aIdx);
      continue;
    }
    if ((ch >= '0' && ch <= '9') || ch === '.' || ch === '٫') {
      out += ch === '٫' ? '.' : ch;
    }
  }
  const parts = out.split('.');
  if (parts.length > 2) {
    out = `${parts[0]}.${parts.slice(1).join('')}`;
  }
  return out;
}

function renderFormattedText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export default function BurnModule() {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [showDepthGuide, setShowDepthGuide] = useState<boolean>(false);
  const [showAllCriteria, setShowAllCriteria] = useState<boolean>(false);

  const [ageGroup, setAgeGroup] = useState<BurnAgeGroup>('adult');
  const [regions, setRegions] = useState<Record<RegionId, RegionAssessment>>({ ...INITIAL_REGIONS });
  const [weightInput, setWeightInput] = useState<string>('');
  const [hasInhalationInjury, setHasInhalationInjury] = useState<boolean>(false);
  const [isCircumferential, setIsCircumferential] = useState<boolean>(false);
  const [hasSpecialAreasInvolved, setHasSpecialAreasInvolved] = useState<boolean>(false);
  const [hasMajorComorbidityOrTrauma, setHasMajorComorbidityOrTrauma] = useState<boolean>(false);

  const parsedWeight = useMemo(() => {
    const num = parseFloat(weightInput);
    return Number.isFinite(num) && num > 0 ? num : null;
  }, [weightInput]);

  const evaluation = useMemo(
    () =>
      evaluateBurnManagement({
        ageGroup,
        regions,
        weightKg: parsedWeight,
        hasInhalationInjury,
        isCircumferential,
        hasSpecialAreasInvolved,
        hasMajorComorbidityOrTrauma,
      }),
    [
      ageGroup,
      regions,
      parsedWeight,
      hasInhalationInjury,
      isCircumferential,
      hasSpecialAreasInvolved,
      hasMajorComorbidityOrTrauma,
    ]
  );

  const handleSetRegionCoverage = (id: RegionId, coverage: RegionCoverage) => {
    setRegions((prev) => ({
      ...prev,
      [id]: { ...prev[id], coverage },
    }));
  };

  const handleSetRegionDepth = (id: RegionId, depth: BurnDepthId) => {
    setRegions((prev) => ({
      ...prev,
      [id]: { ...prev[id], depth },
    }));
  };

  const handleReset = () => {
    setStep('input');
    setShowDepthGuide(false);
    setShowAllCriteria(false);
    setAgeGroup('adult');
    setRegions({ ...INITIAL_REGIONS });
    setWeightInput('');
    setHasInhalationInjury(false);
    setIsCircumferential(false);
    setHasSpecialAreasInvolved(false);
    setHasMajorComorbidityOrTrauma(false);
  };

  const handleConfirm = () => {
    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggeredCriteria = evaluation.referralCriteria.filter((c) => c.triggered);

  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-3 sm:px-5 py-5 sm:py-7 space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              مدیریت سوختگی
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {step === 'input'
                ? 'سطح و درجه هر ناحیه را مشخص کرده و تایید کنید'
                : 'نتیجه ارزیابی، اندیکاسیون اعزام و طرح درمان'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          aria-label="بازنشانی"
          title="بازنشانی"
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {step === 'input' ? (
        <div className="space-y-4">
          {/* 1. Regions: Area + Depth per region */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  ۱. سطح و درجه سوختگی نواحی (قانون ۹)
                </h2>
                <button
                  type="button"
                  onClick={() => setShowDepthGuide((v) => !v)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>راهنمای درجات</span>
                  {showDepthGuide ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setAgeGroup('adult')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      ageGroup === 'adult'
                        ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    بزرگسال
                  </button>
                  <button
                    type="button"
                    onClick={() => setAgeGroup('pediatric')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      ageGroup === 'pediatric'
                        ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    کودک
                  </button>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-xs font-black text-orange-600 dark:text-orange-400 tabular-nums">
                  {evaluation.tbsa}٪ TBSA
                </div>
              </div>
            </div>

            {showDepthGuide && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3 space-y-2">
                {BURN_DEPTH_GUIDELINES.map((g) => (
                  <div
                    key={g.id}
                    className="text-[11px] leading-relaxed border-b last:border-b-0 border-slate-200/70 dark:border-slate-800 pb-1.5 last:pb-0"
                  >
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {g.titleFa}:{' '}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {g.appearance} | {g.sensation} | {g.blanching}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {BODY_REGIONS.map((region) => {
                const maxPct = ageGroup === 'adult' ? region.adultPct : region.pediatricPct;
                const state = regions[region.id];
                const isActive = state.coverage > 0;
                const activePct = Math.round(maxPct * state.coverage * 10) / 10;

                return (
                  <div
                    key={region.id}
                    className={`rounded-xl border p-2.5 sm:p-3 transition-colors space-y-2 ${
                      isActive
                        ? 'border-orange-300 dark:border-orange-800 bg-orange-50/45 dark:bg-orange-950/20'
                        : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30'
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-[13px] font-extrabold text-slate-800 dark:text-slate-100">
                          {region.labelFa}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 tabular-nums shrink-0">
                          {isActive ? `${activePct}٪ از ${maxPct}٪` : `${maxPct}٪`}
                        </span>
                      </div>

                      {/* Coverage Buttons: 0 | 1/4 | 1/2 | کامل */}
                      <div className="grid grid-cols-4 gap-1.5">
                        {COVERAGE_OPTIONS.map((opt) => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => handleSetRegionCoverage(region.id, opt.val)}
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                              state.coverage === opt.val
                                ? opt.val === 0
                                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                                  : opt.val === 0.25
                                  ? 'bg-amber-400 text-slate-950'
                                  : opt.val === 0.5
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-rose-600 text-white'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Per-region Depth Selector (appears when area > 0) */}
                    {isActive && (
                      <div className="pt-2 border-t border-orange-200/60 dark:border-orange-900/40 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-1">
                          درجه سوختگی:
                        </span>
                        {BURN_DEPTH_GUIDELINES.map((d) => {
                          const selected = state.depth === d.id;
                          return (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => handleSetRegionDepth(region.id, d.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                selected
                                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-orange-500 dark:border-orange-500 dark:text-white'
                                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                              }`}
                            >
                              {d.shortTitleFa}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2. Weight & Clinical Risk Flags */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              ۲. وزن و علائم همراه
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="sm:w-44 shrink-0">
                <label
                  htmlFor="burn-weight-input"
                  className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1"
                >
                  وزن بیمار (کیلوگرم)
                </label>
                <input
                  id="burn-weight-input"
                  type="text"
                  inputMode="decimal"
                  dir="ltr"
                  value={weightInput}
                  onChange={(e) => setWeightInput(normalizeNumericInput(e.target.value))}
                  placeholder="مثلاً 70"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex flex-wrap gap-2 flex-1 pt-1 sm:pt-4">
                {[
                  {
                    checked: hasInhalationInjury,
                    toggle: () => setHasInhalationInjury((v) => !v),
                    label: 'آسیب استنشاقی / دود',
                  },
                  {
                    checked: isCircumferential,
                    toggle: () => setIsCircumferential((v) => !v),
                    label: 'سوختگی حلقوی',
                  },
                  {
                    checked: hasSpecialAreasInvolved,
                    toggle: () => setHasSpecialAreasInvolved((v) => !v),
                    label: 'درگیری صورت / دست / پا / مفاصل',
                  },
                  {
                    checked: hasMajorComorbidityOrTrauma,
                    toggle: () => setHasMajorComorbidityOrTrauma((v) => !v),
                    label: 'تروما یا بیماری زمینه‌ای مهم',
                  },
                ].map((flag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={flag.toggle}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      flag.checked
                        ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-200'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {flag.checked ? '✓ ' : ''}
                    {flag.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Confirm Action Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-l from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/20 transition-all active:scale-[0.99] cursor-pointer"
          >
            تایید و مشاهده طرح اعزام و درمان
          </button>
        </div>
      ) : (
        /* ================= RESULT VIEW ================= */
        <div className="space-y-4">
          {/* Summary & Edit Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-extrabold">
              <span className="px-2.5 py-1 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 tabular-nums">
                کل سوختگی: {evaluation.tbsa}٪ TBSA
              </span>
              {evaluation.countedTbsa !== evaluation.tbsa && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs tabular-nums">
                  سطح مؤثر (درجه ۲ و بالاتر): {evaluation.countedTbsa}٪
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep('input')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>ویرایش نواحی</span>
            </button>
          </div>

          {/* 1. Burn Center Referral Decision */}
          <section
            className={`rounded-2xl border p-4 sm:p-5 space-y-3 shadow-sm ${
              evaluation.referralTriggered
                ? 'border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/35'
                : 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {evaluation.referralTriggered ? (
                <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              <div>
                <h2
                  className={`text-sm sm:text-base font-extrabold ${
                    evaluation.referralTriggered
                      ? 'text-rose-900 dark:text-rose-100'
                      : 'text-emerald-900 dark:text-emerald-100'
                  }`}
                >
                  {evaluation.referralTriggered
                    ? 'اندیکاسیون اعزام به مرکز سوختگی دارد (ABA)'
                    : 'بر اساس نواحی انتخاب‌شده، معیار ارجاع فوری فعال نیست'}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {evaluation.referralTriggered
                    ? 'پس از پایدارسازی اولیه ABCDE و شروع مایع‌درمانی، هماهنگی اعزام انجام شود.'
                    : 'توجه: سوختگی‌های الکتریکی و شیمیایی نیز همیشه اندیکاسیون ارجاع به مرکز سوختگی دارند.'}
                </p>
              </div>
            </div>

            {triggeredCriteria.length > 0 && (
              <ul className="space-y-1.5 pt-1">
                {triggeredCriteria.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-start gap-2 text-xs font-bold text-rose-800 dark:text-rose-200"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{c.labelFa}</span>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={() => setShowAllCriteria((v) => !v)}
              className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{showAllCriteria ? 'بستن چک‌لیست ABA' : 'مشاهده کل معیارهای ارجاع ABA'}</span>
              {showAllCriteria ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAllCriteria && (
              <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 grid grid-cols-1 gap-1.5">
                {evaluation.referralCriteria.map((c) => (
                  <div
                    key={c.id}
                    className={`text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-2 ${
                      c.triggered
                        ? 'bg-rose-100/80 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 font-bold'
                        : 'bg-white/70 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{c.triggered ? '●' : '○'}</span>
                    <span>{c.labelFa}</span>
                  </div>
                ))}
                <div className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/70 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400">
                  ○ سوختگی الکتریکی (از جمله صاعقه) و سوختگی شیمیایی
                </div>
              </div>
            )}
          </section>

          {/* 2. Fluid Resuscitation */}
          <section className="rounded-2xl border border-sky-200 dark:border-sky-900/70 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
              <Droplets className="w-4 h-4 text-sky-500" />
              <h2>مایع‌درمانی (رینگر لاکتات)</h2>
            </div>

            {!evaluation.needsFluidResuscitation ? (
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {evaluation.isFirstDegreeOnly
                  ? 'تمام نواحی انتخاب‌شده درجه ۱ هستند؛ سوختگی درجه ۱ در فرمول پارکلند محاسبه نمی‌شود و مایع خوراکی کافی است.'
                  : 'هیچ ناحیه‌ای با درجه ۲ یا بالاتر انتخاب نشده است تا وارد فرمول پارکلند شود.'}
              </p>
            ) : parsedWeight === null ? (
              <div className="space-y-2.5">
                <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50/70 dark:bg-orange-950/30 p-3.5 space-y-2">
                  <div className="text-xs font-extrabold text-orange-900 dark:text-orange-200">
                    فرمول پارکلند (4 mL × kg × %TBSA)
                  </div>
                  <div
                    dir="ltr"
                    className="text-xs sm:text-sm font-black text-orange-700 dark:text-orange-300 bg-white dark:bg-slate-900 rounded-lg px-3 py-2 border border-orange-200/80 dark:border-orange-900 text-center"
                  >
                    4 × وزن (kg) × {evaluation.countedTbsa}٪ ={' '}
                    {Math.round(4 * evaluation.countedTbsa * 10) / 10} mL/kg
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    نصف حجم کل در <strong>۸ ساعت اول</strong> (از زمان سوختگی) و نصف دیگر در{' '}
                    <strong>۱۶ ساعت بعدی</strong> با سرم رینگر لاکتات تزریق شود.
                  </div>
                </div>

                {ageGroup === 'pediatric' && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    در کودکان کمتر از ۳۰ کیلوگرم، همزمان سرم نگهداری حاوی دکستروز (مانند D5-LR یا D5 0.45NS) تجویز شود.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50/60 dark:bg-orange-950/30 p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  <span>فرمول پارکلند (4 mL × {parsedWeight} kg × {evaluation.countedTbsa}٪)</span>
                  <span className="text-sm font-black text-orange-600 dark:text-orange-400 tabular-nums">
                    کل ۲۴ ساعت: {evaluation.parklandTotalMl?.toLocaleString('fa-IR')} mL
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-orange-100 dark:border-orange-900/60">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      ۸ ساعت اول (از زمان سوختگی)
                    </div>
                    <div className="text-sm font-black text-orange-600 dark:text-orange-400 tabular-nums mt-0.5">
                      {evaluation.parklandFirst8hRate?.toLocaleString('fa-IR')} mL/hr
                    </div>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200/80 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      ۱۶ ساعت دوم
                    </div>
                    <div className="text-sm font-black text-slate-800 dark:text-slate-100 tabular-nums mt-0.5">
                      {evaluation.parklandNext16hRate?.toLocaleString('fa-IR')} mL/hr
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900 px-3 py-2 text-xs text-emerald-900 dark:text-emerald-100">
              <strong className="font-extrabold">هدف برون‌ده ادراری: </strong>
              {evaluation.targetUrineOutput}
            </div>
          </section>

          {/* Special Alerts */}
          {evaluation.specialAlerts.length > 0 && (
            <section className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/35 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>نکات کلیدی</span>
              </div>
              <ul className="space-y-1.5 text-xs leading-relaxed text-amber-950 dark:text-amber-100 list-disc pr-4">
                {evaluation.specialAlerts.map((a, idx) => (
                  <li key={idx}>{renderFormattedText(a)}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 3. Emergency Treatment & Wound Care */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="space-y-2.5">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                اقدامات درمانی اورژانسی
              </h2>
              <ol className="space-y-2">
                {evaluation.treatmentSteps.map((stepText, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{renderFormattedText(stepText)}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                مراقبت از زخم و پانسمان
              </h3>
              <ul className="space-y-1.5 list-disc pr-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {evaluation.woundCareSteps.map((w, idx) => (
                  <li key={idx}>{renderFormattedText(w)}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
