import { ClinicalScoreDefinition, getNum, hasNum } from '../types';

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;

const incompleteResult = (summary: string) => ({
  score: 0,
  isIncomplete: true,
  riskLevel: 'low' as const,
  riskTitle: 'مقادیر را وارد کنید',
  summary,
  diagnosisAndTreatment: [],
  clinicalNotes: [],
});

export const ROSEN_FORMULAS: ClinicalScoreDefinition[] = [
  // =========================================================================
  // F1. Corrected Calcium for Albumin
  // =========================================================================
  {
    id: 'corrected-calcium',
    titleFa: 'اصلاح کلسیم سرم بر اساس آلبومین',
    titleEn: 'Corrected Calcium for Hypoalbuminemia',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Payne RB et al. BMJ. 1973 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'ca', label: 'کلسیم کل سرم اندازه‌گیری‌شده (Serum Ca)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 8.0', defaultValue: 8.0 },
      { id: 'alb', label: 'آلبومین سرم (Serum Albumin)', type: 'number', unit: 'g/dL', placeholder: 'مثلاً 2.5', defaultValue: 2.5 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'ca') || !hasNum(values, 'alb')) {
        return incompleteResult('کلسیم کل سرم و آلبومین سرم را وارد کنید.');
      }
      const ca = getNum(values, 'ca', 8.0);
      const alb = getNum(values, 'alb', 2.5);
      const corrected = round2(ca + 0.8 * (4.0 - alb));

      if (corrected < 8.5) {
        const severe = corrected < 7.0;
        return {
          score: corrected,
          unit: 'mg/dL',
          riskLevel: severe ? 'critical' : 'high',
          riskTitle: severe ? 'هیپوکلسمی شدید واقعی' : 'هیپوکلسمی واقعی',
          summary: `کلسیم اصلاح‌شده ${corrected} mg/dL (پایین‌تر از محدوده نرمال ۸.۵–۱۰.۵).`,
          diagnosisAndTreatment: severe
            ? [
                'در صورت تتانی، تشنج، لارنگواسپاسم یا طولانی شدن QT: گلوکونات کلسیم ۱۰٪ به میزان ۱ تا ۲ گرم وریدی طی ۱۰ تا ۲۰ دقیقه با مانیتورینگ قلبی.',
                'اندازه‌گیری همزمان منیزیم، فسفر، PTH و کلسیم یونیزه (Ionized Ca).',
              ]
            : [
                'در صورت بی‌علامت بودن: جایگزینی خوراکی کلسیم + ویتامین D و بررسی کلسیم یونیزه و منیزیم سرم.',
                'گرفتن نوار قلب برای بررسی فاصله QTc.',
              ],
          clinicalNotes: [
            'فرمول روزن: Corrected Ca = Measured Ca + 0.8 × (4.0 - Albumin).',
            'در تغییرات شدید pH یا بیمار بدحال ICU، اندازه‌گیری مستقیم کلسیم یونیزه (نرمال ۴.۵–۵.۳ mg/dL) دقیق‌تر است.',
          ],
        };
      }

      if (corrected <= 10.5) {
        return {
          score: corrected,
          unit: 'mg/dL',
          riskLevel: 'low',
          riskTitle: 'کلسیم اصلاح‌شده در محدوده نرمال (۸.۵–۱۰.۵)',
          summary: `کاهش ظاهری کلسیم ناشی از هیپوآلبومینمی بوده و کلسیم فعال طبیعی است (${corrected} mg/dL).`,
          diagnosisAndTreatment: [
            'نیازی به تزریق کلسیم وریدی نیست.',
            'در صورت وجود علائم مشکوک بالینی، کلسیم یونیزه چک شود.',
          ],
          clinicalNotes: [
            'به ازای هر ۱ g/dL کاهش آلبومین زیر ۴.۰، کلسیم توتال حدود ۰.۸ mg/dL پایین‌تر نشان داده می‌شود.',
          ],
        };
      }

      const crisis = corrected >= 14.0;
      return {
        score: corrected,
        unit: 'mg/dL',
        riskLevel: crisis ? 'critical' : 'high',
        riskTitle: crisis ? 'هیپرکلسمی شدید / بحران هیپرکلسمیک' : 'هیپرکلسمی واقعی',
        summary: `کلسیم اصلاح‌شده ${corrected} mg/dL (بالاتر از ۱۰.۵ mg/dL).`,
        diagnosisAndTreatment: [
          'هیدراتاسیون تهاجمی با نرمال سالین ایزوتونیک (۲۰۰–۳۰۰ mL/hr با هدف برون‌ده ادراری ۱۰۰–۱۵۰ mL/hr).',
          crisis
            ? 'کلسی‌تونین (۴ IU/kg زیرجلدی/عضلانی هر ۱۲ ساعت) + بیس‌فسفونات وریدی (زولدرونیک اسید یا پامیدرونات)؛ در نارسایی کلیه یا کما بررسی دیالیز.'
            : 'در صورت علائم (تغییر هوشیاری، یبوست شدید، کوتاه شدن QT): کلسی‌تونین/بیس‌فسفونات و بررسی بدخیمی یا هیپرپاراتیروئیدیسم.',
        ],
        clinicalNotes: [
          'از تجویز روتین فوروزماید قبل از احیای کامل حجم داخل عروقی پرهیز کنید.',
        ],
      };
    },
  },

  // =========================================================================
  // F2. Corrected Sodium for Hyperglycemia
  // =========================================================================
  {
    id: 'corrected-sodium',
    titleFa: 'اصلاح سدیم سرم در هیپرگلیسمی',
    titleEn: 'Corrected Sodium for Hyperglycemia (Katz & Hillier)',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Katz MA. NEJM 1973 / Hillier TA. Am J Med 1999 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'na', label: 'سدیم سرم اندازه‌گیری‌شده (Measured Na)', type: 'number', unit: 'mEq/L', placeholder: 'مثلاً 128', defaultValue: 128 },
      { id: 'glu', label: 'قند خون سرم (Serum Glucose)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 500', defaultValue: 500 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'na') || !hasNum(values, 'glu')) {
        return incompleteResult('سدیم اندازه‌گیری‌شده و قند خون سرم را وارد کنید.');
      }
      const na = getNum(values, 'na', 128);
      const glu = getNum(values, 'glu', 500);
      const excess = Math.max(0, glu - 100) / 100;
      const katz = round1(na + 1.6 * excess);
      const hillier = round1(na + 2.4 * excess);
      const primary = glu > 400 ? hillier : katz;

      if (primary < 135) {
        return {
          score: primary,
          unit: 'mEq/L',
          riskLevel: primary < 125 ? 'critical' : 'high',
          riskTitle: 'هیپوناترمی واقعی همراه با هیپرگلیسمی',
          summary: `سدیم اصلاح‌شده: ${katz} (کاتز، ضریب ۱.۶) | ${hillier} mEq/L (هیلیر، ضریب ۲.۴).`,
          diagnosisAndTreatment: [
            'کمبود واقعی سدیم و آب وجود دارد؛ پس از اصلاح قند خون در DKA/HHS سدیم سرم همچنان پایین خواهد ماند یا به آهستگی بالا می‌رود.',
            'در انتخاب مایع نگهدارنده پس از احیای اولیه، از نرمال سالین ۰.۹٪ استفاده شود (نه نیم‌نرمال سالین در صورت تداوم هیپوناترمی).',
          ],
          clinicalNotes: [
            'فرمول کاتز: Na + 1.6 × [(Glucose - 100) / 100]. در قند بالای ۴۰۰ mg/dL ضریب ۲.۴ (هیلیر) دقیق‌تر است.',
          ],
        };
      }

      if (primary <= 145) {
        return {
          score: primary,
          unit: 'mEq/L',
          riskLevel: 'low',
          riskTitle: 'سدیم واقعی نرمال (هیپوناترمی رقتی ناشی از قند بالا)',
          summary: `سدیم اصلاح‌شده: ${katz} (کاتز) | ${hillier} mEq/L (هیلیر).`,
          diagnosisAndTreatment: [
            'افت ظاهری سدیم به دلیل شیفت اسموتیک آب به خارج سلول در اثر هیپرگلیسمی است.',
            'با انسولین‌درمانی و کاهش قند خون، سدیم سرم خودبه‌خود به محدوده نرمال برمی‌گردد.',
          ],
          clinicalNotes: [
            'پس از احیای اولیه با نرمال سالین ۰.۹٪، در صورت نرمال بودن سدیم اصلاح‌شده می‌توان به سالین ۰.۴۵٪ سوییچ کرد.',
          ],
        };
      }

      return {
        score: primary,
        unit: 'mEq/L',
        riskLevel: primary >= 160 ? 'critical' : 'high',
        riskTitle: 'هیپرناترمی واقعی (کمبود شدید آب آزاد)',
        summary: `سدیم اصلاح‌شده: ${katz} (کاتز) | ${hillier} mEq/L (هیلیر) — نشانه کم‌آبی شدید هیپرتونیک.`,
        diagnosisAndTreatment: [
          'کمبود شدید آب آزاد (معمولاً در HHS)؛ پس از تثبیت فشار خون با نرمال سالین، مایع هیپوتونیک (۰.۴۵٪ NaCl یا D5W پس از افت قند) جایگزین شود.',
          'کاهش اسمولالیته و سدیم باید تدریجی باشد تا از ادم مغزی جلوگیری شود.',
        ],
        clinicalNotes: [
          'در هیپرگلیسمی شدید، سدیم اندازه‌گیری‌شده نرمال یا کمی بالا در واقع نشان‌دهنده هیپرناترمی شدید مخفی است.',
        ],
      };
    },
  },

  // =========================================================================
  // F3. Cockcroft-Gault CrCl / GFR
  // =========================================================================
  {
    id: 'gfr-cockcroft-gault',
    titleFa: 'محاسبه GFR و کلیرانس کراتینین (Cockcroft-Gault)',
    titleEn: 'Creatinine Clearance (Cockcroft-Gault Equation)',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Cockcroft DW, Gault MH. Nephron. 1976 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'age', label: 'سن بیمار (Age)', type: 'number', unit: 'سال', placeholder: 'مثلاً 55', defaultValue: 55 },
      { id: 'weight', label: 'وزن بیمار (Weight)', type: 'number', unit: 'kg', placeholder: 'مثلاً 70', defaultValue: 70 },
      { id: 'cr', label: 'کراتینین سرم (Serum Cr)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 1.2', defaultValue: 1.2 },
      {
        id: 'sex',
        label: 'جنسیت',
        type: 'select',
        options: [
          { label: 'مذکر (ضریب ۱.۰۰)', points: 0 },
          { label: 'مؤنث (ضریب ۰.۸۵)', points: 1 },
        ],
      },
    ],
    evaluate(values) {
      if (!hasNum(values, 'age') || !hasNum(values, 'weight') || !hasNum(values, 'cr')) {
        return incompleteResult('سن، وزن و کراتینین سرم را وارد کنید.');
      }
      const age = Math.max(1, getNum(values, 'age', 55));
      const wt = Math.max(1, getNum(values, 'weight', 70));
      const cr = Math.max(0.1, getNum(values, 'cr', 1.2));
      const isFemale = Number(values.sex ?? 0) === 1;
      const crcl = round1(Math.max(0, (((140 - age) * wt) / (72 * cr)) * (isFemale ? 0.85 : 1)));

      if (crcl >= 60) {
        return {
          score: crcl,
          unit: 'mL/min',
          riskLevel: 'low',
          riskTitle: crcl >= 90 ? 'عملکرد کلیوی نرمال (G1)' : 'کاهش خفیف کلیرانس (G2: 60–89)',
          summary: `کلیرانس کراتینین تخمینی: ${crcl} mL/min.`,
          diagnosisAndTreatment: [
            'اکثر داروهای اورژانسی (آنتی‌بیوتیک‌ها، آنوگزاپارین، DOACها) با دوز استاندارد قابل تجویز هستند.',
            'در بیمار با احتمال AKI حاد، روند تغییرات کراتینین طی ۲۴ ساعت پیگیری شود.',
          ],
          clinicalNotes: [
            'فرمول استاندارد روزن برای تنظیم دوز داروها در اورژانس؛ در چاقی مفرط از وزن ایده‌آل یا تعدیل‌شده استفاده شود.',
          ],
        };
      }

      if (crcl >= 30) {
        return {
          score: crcl,
          unit: 'mL/min',
          riskLevel: 'moderate',
          riskTitle: 'اختلال کلیوی متوسط (30–59 mL/min)',
          summary: `کلیرانس کراتینین ${crcl} mL/min؛ نیازمند تنظیم دوز برخی داروها.`,
          diagnosisAndTreatment: [
            'تنظیم دوز داروهای کلیوی (وانکومایسین، پیپراسیلین-تازوبکتام، مروپنم، فاموتیدین و آنوکساپارین).',
            'اجتناب از داروهای نفروتوکسیک (NSAIDها، آمینوگلیکوزیدها) و اصلاح حجم قبل از ماده حاجب.',
          ],
          clinicalNotes: [
            'در نارسایی حاد کلیه (AKI)، کراتینین سرم هنوز به تعادل نرسیده و فرمول ممکن است GFR واقعی را بیشتر از حد واقعی تخمین بزند.',
          ],
        };
      }

      return {
        score: crcl,
        unit: 'mL/min',
        riskLevel: crcl < 15 ? 'critical' : 'high',
        riskTitle: crcl < 15 ? 'نارسایی شدید / ESRD (< 15 mL/min)' : 'اختلال کلیوی شدید (15–29 mL/min)',
        summary: `کلیرانس کراتینین ${crcl} mL/min؛ خطر بالای سمیت دارویی و اختلالات الکترولیتی.`,
        diagnosisAndTreatment: [
          'کاهش الزامی دوز داروهای کلیوی و پرهیز از آنوکساپارین در CrCl < 30 (ترجیح هپارین غیرقطعه UFH).',
          'چک فوری پتاسیم، ABG/VBG، اوره و بررسی اندیکاسیون همودیالیز اورژانسی (AEIOU).',
        ],
        clinicalNotes: [
          'داروهایی مثل مرفین و مپریدین متابولیت‌های فعال کلیوی دارند و در CrCl پایین تجمع می‌یابند (فنتانیل ایمن‌تر است).',
        ],
      };
    },
  },

  // =========================================================================
  // F4. CKD-EPI eGFR (2021 Race-Free Equation)
  // =========================================================================
  {
    id: 'gfr-ckd-epi',
    titleFa: 'محاسبه eGFR به روش CKD-EPI (بدون نژاد)',
    titleEn: 'CKD-EPI Creatinine Equation (2021)',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Inker LA et al. NEJM. 2021 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'age', label: 'سن بیمار (Age)', type: 'number', unit: 'سال', placeholder: 'مثلاً 55', defaultValue: 55 },
      { id: 'cr', label: 'کراتینین سرم (Serum Cr)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 1.2', defaultValue: 1.2 },
      {
        id: 'sex',
        label: 'جنسیت',
        type: 'select',
        options: [
          { label: 'مذکر', points: 0 },
          { label: 'مؤنث', points: 1 },
        ],
      },
    ],
    evaluate(values) {
      if (!hasNum(values, 'age') || !hasNum(values, 'cr')) {
        return incompleteResult('سن و کراتینین سرم را وارد کنید.');
      }
      const age = Math.max(18, getNum(values, 'age', 55));
      const cr = Math.max(0.1, getNum(values, 'cr', 1.2));
      const isFemale = Number(values.sex ?? 0) === 1;
      const kappa = isFemale ? 0.7 : 0.9;
      const alpha = isFemale ? -0.241 : -0.302;
      const sexFactor = isFemale ? 1.012 : 1.0;
      const ratio = cr / kappa;
      const egfr = round1(
        142 *
          Math.pow(Math.min(ratio, 1), alpha) *
          Math.pow(Math.max(ratio, 1), -1.2) *
          Math.pow(0.9938, age) *
          sexFactor
      );

      const level = egfr >= 60 ? 'low' : egfr >= 30 ? 'moderate' : egfr < 15 ? 'critical' : 'high';
      const stage =
        egfr >= 90 ? 'G1 (نرمال)' : egfr >= 60 ? 'G2 (کاهش خفیف)' : egfr >= 45 ? 'G3a' : egfr >= 30 ? 'G3b' : egfr >= 15 ? 'G4 (شدید)' : 'G5 (نارسایی کلیه)';

      return {
        score: egfr,
        unit: 'mL/min/1.73m²',
        riskLevel: level,
        riskTitle: `مرحله کلیوی ${stage}`,
        summary: `نرخ فیلتراسیون گلومرولی استانداردشده بر سطح بدن: ${egfr} mL/min/1.73m².`,
        diagnosisAndTreatment:
          egfr < 30
            ? [
                'پرهیز از NSAID، کنتراست وریدی غیرایمن و تنظیم دقیق دوز داروها.',
                'درخواست سونوگرافی کلیه برای افتراق AKI از CKD و بررسی هیدرونفروز.',
              ]
            : [
                'مقایسه با کراتینین پایه بیمار در مراجعات قبلی برای تشخیص آسیب حاد کلیه (KDIGO).',
              ],
        clinicalNotes: [
          'معادله CKD-EPI 2021 برای ارزیابی خطر نفروپاتی کنتراست و مرحله‌بندی CKD دقیق‌تر است.',
        ],
      };
    },
  },

  // =========================================================================
  // F5. Total Body Water (TBW) & Free Water Deficit
  // =========================================================================
  {
    id: 'tbw-free-water-deficit',
    titleFa: 'محاسبه آب کل بدن (TBW) و کمبود آب آزاد در هیپرناترمی',
    titleEn: 'Total Body Water (TBW) & Free Water Deficit',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Adrogue HJ, Madias NE. NEJM 2000 / Rosen’s Emergency Medicine',
    criteria: [
      {
        id: 'group',
        label: 'گروه سنی و جنسیت (ضریب TBW)',
        type: 'select',
        options: [
          { label: 'مرد بالغ (ضریب ۰.۶)', points: 0.6 },
          { label: 'زن بالغ یا مرد سالمند (ضریب ۰.۵)', points: 0.5 },
          { label: 'زن سالمند (ضریب ۰.۴۵)', points: 0.45 },
          { label: 'کودک (ضریب ۰.۶)', points: 0.6 },
        ],
      },
      { id: 'weight', label: 'وزن بیمار (Weight)', type: 'number', unit: 'kg', placeholder: 'مثلاً 70', defaultValue: 70 },
      { id: 'na', label: 'سدیم فعلی سرم (اختیاری — برای کسری آب آزاد)', type: 'number', unit: 'mEq/L', placeholder: 'مثلاً 155', optional: true, defaultValue: 155 },
      { id: 'targetNa', label: 'سدیم هدف (اختیاری — پیش‌فرض ۱۴۰)', type: 'number', unit: 'mEq/L', placeholder: '140', optional: true, defaultValue: 140 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'weight')) {
        return incompleteResult('وزن بیمار (و در صورت هیپرناترمی، سدیم سرم) را وارد کنید.');
      }
      const idx = Number(values.group ?? 0);
      const factors = [0.6, 0.5, 0.45, 0.6];
      const factor = factors[idx] ?? 0.6;
      const wt = Math.max(1, getNum(values, 'weight', 70));
      const tbw = round1(factor * wt);

      const hasNa = hasNum(values, 'na');
      const na = hasNa ? getNum(values, 'na', 140) : 140;
      const targetNa = Math.max(120, getNum(values, 'targetNa', 140));
      const deficit = hasNa && na > targetNa ? round2(tbw * (na / targetNa - 1)) : 0;

      if (!hasNa || na <= targetNa) {
        return {
          score: tbw,
          unit: 'لیتر (TBW)',
          riskLevel: 'low',
          riskTitle: `آب کل بدن (TBW) = ${tbw} لیتر`,
          summary: hasNa
            ? `سدیم سرم ≤ ${targetNa} mEq/L است؛ بنابراین کمبود آب آزاد ناشی از هیپرناترمی وجود ندارد.`
            : `آب کل بدن برآوردی بیمار ${tbw} لیتر است. (برای محاسبه کسری آب آزاد، سدیم سرم بالای ۱۴۰ را وارد کنید).`,
          diagnosisAndTreatment: [
            `آب کل بدن بیمار برابر با ${tbw} لیتر است.`,
          ],
          clinicalNotes: [
            'فرمول روزن: TBW = Weight (kg) × Correction Factor (0.6 مردان/اطفال، 0.5 زنان/مردان مسن، 0.45 زنان مسن).',
          ],
        };
      }

      const critical = na >= 160;
      return {
        score: deficit,
        unit: 'لیتر (کسری آب)',
        riskLevel: critical ? 'critical' : 'high',
        riskTitle: `آب کل بدن = ${tbw} لیتر | کمبود آب آزاد = ${deficit} لیتر`,
        summary: `برای رساندن سدیم از ${na} به ${targetNa} mEq/L، بیمار حدود ${deficit} لیتر کمبود آب آزاد دارد.`,
        diagnosisAndTreatment: [
          'در صورت ناپایداری همودینامیک، ابتدا احیای حجم با نرمال سالین ۰.۹٪ انجام شود.',
          'جایگزینی کسری آب آزاد با D5W یا سالین ۰.۴۵٪ (یا آب از راه NGT) طی ۴۸ تا ۷۲ ساعت به همراه جبران اتلاف مداوم.',
          'سرعت کاهش سدیم در هیپرناترمی مزمن نباید از ۱۰–۱۲ mEq/L در ۲۴ ساعت بیشتر شود.',
        ],
        clinicalNotes: [
          'فرمول کسری آب آزاد: Free Water Deficit = TBW × [(Current Na / Target Na) - 1].',
        ],
      };
    },
  },

  // =========================================================================
  // F6. Serum Anion Gap & Albumin-Corrected AG
  // =========================================================================
  {
    id: 'anion-gap',
    titleFa: 'محاسبه آنیون گپ (Anion Gap) و اصلاح با آلبومین',
    titleEn: 'Serum Anion Gap & Albumin-Corrected AG',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Emmett M, Narins RG. Medicine 1977 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'na', label: 'سدیم سرم (Na)', type: 'number', unit: 'mEq/L', placeholder: 'مثلاً 138', defaultValue: 138 },
      { id: 'cl', label: 'کلر سرم (Cl)', type: 'number', unit: 'mEq/L', placeholder: 'مثلاً 98', defaultValue: 98 },
      { id: 'hco3', label: 'بی‌کربنات سرم (HCO3)', type: 'number', unit: 'mEq/L', placeholder: 'مثلاً 14', defaultValue: 14 },
      { id: 'alb', label: 'آلبومین سرم (اختیاری — پیش‌فرض ۴.۰)', type: 'number', unit: 'g/dL', placeholder: '4.0', optional: true, defaultValue: 4.0 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'na') || !hasNum(values, 'cl') || !hasNum(values, 'hco3')) {
        return incompleteResult('سدیم، کلر و بی‌کربنات سرم را وارد کنید.');
      }
      const na = getNum(values, 'na', 138);
      const cl = getNum(values, 'cl', 98);
      const hco3 = getNum(values, 'hco3', 14);
      const hasAlb = hasNum(values, 'alb');
      const alb = hasAlb ? getNum(values, 'alb', 4.0) : 4.0;

      const ag = round1(na - (cl + hco3));
      const correctedAg = round1(ag + 2.5 * (4.0 - alb));
      const deltaAg = correctedAg - 12;
      const deltaHco3 = 24 - hco3;
      const deltaRatio = deltaHco3 > 0 ? round2(deltaAg / deltaHco3) : 0;

      if (correctedAg <= 12) {
        return {
          score: correctedAg,
          unit: 'mEq/L',
          riskLevel: hco3 < 20 ? 'moderate' : 'low',
          riskTitle: hasAlb
            ? `آنیون گپ نرمال (خام: ${ag} | اصلاح‌شده: ${correctedAg})`
            : `آنیون گپ نرمال (${ag} mEq/L)`,
          summary: hco3 < 20 ? 'اسیدوز متابولیک با آنیون گپ نرمال (هیپرکلرمیک).' : 'آنیون گپ در محدوده طبیعی (۸–۱۲ mEq/L).',
          diagnosisAndTreatment:
            hco3 < 20
              ? [
                  'بررسی علل غیرآنیون گپی (USED CRAP): اسهال، RTA، فیستول پانکراس/صفراوی، استازولامید، تزریق زیاد نرمال سالین.',
                ]
              : ['در صورت شک به اختلال مخلوط اسید-باز، pH و PaCO2 در ABG بررسی شود.'],
          clinicalNotes: [
            'هر ۱ g/dL کاهش آلبومین، آنیون گپ را ۲.۵ واحد کمتر نشان می‌دهد.',
          ],
        };
      }

      let mixedMsg = 'اسیدوز متابولیک آنیون گپ بالا (HAGMA) خالص.';
      if (deltaHco3 > 0) {
        if (deltaRatio < 1) mixedMsg = `نسبت دلتا/دلتا = ${deltaRatio} (< ۱): همراهی اسیدوز آنیون گپ نرمال (NAGMA) همزمان.`;
        else if (deltaRatio > 2) mixedMsg = `نسبت دلتا/دلتا = ${deltaRatio} (> ۲): همراهی آلکالوز متابولیک همزمان یا جبران هیپرکاپنی مزمن.`;
        else mixedMsg = `نسبت دلتا/دلتا = ${deltaRatio} (۱ تا ۲): اسیدوز متابولیک آنیون گپ بالا خالص.`;
      }

      return {
        score: correctedAg,
        unit: 'mEq/L',
        riskLevel: correctedAg >= 20 ? 'critical' : 'high',
        riskTitle: hasAlb
          ? `آنیون گپ بالا (خام: ${ag} | اصلاح‌شده: ${correctedAg})`
          : `آنیون گپ بالا (${ag} mEq/L)`,
        summary: mixedMsg,
        diagnosisAndTreatment: [
          'بررسی سریع علل خطرناک (GOLDMARK / MUDPILES): کتون‌ها (DKA/الکلی)، لاکتات (سپسیس/ایسکمی)، اورمی، متانول، اتیلن گلیکول و سالیسیلات.',
          'درخواست لاکتات سرم، کتون، کراتینین و در صورت شک به مسمومیت اسمولار گپ.',
        ],
        clinicalNotes: [
          'فرمول اصلاح آنیون گپ: Corrected AG = AG + 2.5 × (4.0 - Albumin).',
        ],
      };
    },
  },

  // =========================================================================
  // F7. Winter's Formula (Metabolic Acidosis Compensation)
  // =========================================================================
  {
    id: 'winters-formula',
    titleFa: 'فرمول وینترز (PaCO2 مورد انتظار در اسیدوز متابولیک)',
    titleEn: "Winter's Formula (Expected Respiratory Compensation)",
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Albert MS et al. Ann Intern Med 1967 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'hco3', label: 'بی‌کربنات خون (HCO3)', type: 'number', unit: 'mEq/L', placeholder: 'مثلاً 14', defaultValue: 14 },
      { id: 'paco2', label: 'PaCO2 واقعی در ABG (اختیاری)', type: 'number', unit: 'mmHg', placeholder: 'مثلاً 29', optional: true, defaultValue: 29 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'hco3')) {
        return incompleteResult('مقدار بی‌کربنات (HCO3) را وارد کنید.');
      }
      const hco3 = getNum(values, 'hco3', 14);
      const expected = round1(1.5 * hco3 + 8);
      const low = round1(expected - 2);
      const high = round1(expected + 2);

      if (!hasNum(values, 'paco2')) {
        return {
          score: expected,
          unit: 'mmHg (±2)',
          riskLevel: 'moderate',
          riskTitle: `PaCO2 مورد انتظار = ${low} تا ${high} mmHg`,
          summary: `بر اساس HCO3 = ${hco3}، PaCO2 جبرانی مورد انتظار بین ${low} تا ${high} mmHg است. (برای بررسی اختلال تنفسی همزمان، PaCO2 واقعی را وارد کنید).`,
          diagnosisAndTreatment: [
            `اگر PaCO2 واقعی بیمار > ${high} باشد: اسیدوز تنفسی همزمان؛ اگر < ${low} باشد: آلکالوز تنفسی همزمان.`,
          ],
          clinicalNotes: [
            'فرمول وینترز: Expected PaCO2 = (1.5 × HCO3) + 8 ± 2.',
          ],
        };
      }

      const actualPaco2 = getNum(values, 'paco2', 29);

      if (actualPaco2 > high) {
        return {
          score: expected,
          unit: 'mmHg (±2)',
          riskLevel: 'critical',
          riskTitle: `اسیدوز تنفسی همزمان! (PaCO2 واقعی ${actualPaco2} > مورد انتظار ${low}–${high})`,
          summary: `بیمار تهویه جبرانی کافی ندارد و دچار هیپوونتیلاسیون / اسیدوز تنفسی همراه است.`,
          diagnosisAndTreatment: [
            'ارزیابی فوری راه هوایی، خستگی عضلات تنفسی، سرکوب CNS (اپیوئید/بنزودیازپین) یا COPD.',
            'در صورت تداوم اسیدمی شدید یا خستگی تنفسی، آماده لوله‌گذاری تراشه باشید.',
          ],
          clinicalNotes: [
            'فرمول وینترز: Expected PaCO2 = (1.5 × HCO3) + 8 ± 2.',
          ],
        };
      }

      if (actualPaco2 < low) {
        return {
          score: expected,
          unit: 'mmHg (±2)',
          riskLevel: 'high',
          riskTitle: `آلکالوز تنفسی همزمان (PaCO2 واقعی ${actualPaco2} < مورد انتظار ${low}–${high})`,
          summary: `بیمار بیش از حد جبرانی هایپرونتیله می‌کند (اختلال مخلوط اسیدوز متابولیک + آلکالوز تنفسی).`,
          diagnosisAndTreatment: [
            'به مسمومیت با سالیسیلات (آسپرین)، سپسیس زودرس، آمبولی ریه یا نارسایی کبدی فکر کنید.',
          ],
          clinicalNotes: [
            'ترکیب اسیدوز متابولیک آنیون گپ بالا + آلکالوز تنفسی اولیه مشخصه کلاسیک مسمومیت با سالیسیلات است.',
          ],
        };
      }

      return {
        score: expected,
        unit: 'mmHg (±2)',
        riskLevel: 'low',
        riskTitle: `جبران تنفسی مناسب (${low} تا ${high} mmHg)`,
        summary: `PaCO2 اندازه‌گیری‌شده (${actualPaco2} mmHg) در محدوده مورد انتظار فرمول وینترز قرار دارد.`,
        diagnosisAndTreatment: [
          'اسیدوز متابولیک خالص با جبران تنفسی فیزیولوژیک؛ تمرکز بر درمان علت زمینه‌ای اسیدوز متابولیک.',
        ],
        clinicalNotes: [
          'جبران کامل تنفسی معمولاً ۱۲ تا ۲۴ ساعت زمان می‌برد.',
        ],
      };
    },
  },

  // =========================================================================
  // F8. Serum Osmolality & Osmolar Gap
  // =========================================================================
  {
    id: 'osmolar-gap',
    titleFa: 'محاسبه اسمولالیته سرم و اسمولار گپ (Osmolar Gap)',
    titleEn: 'Calculated Serum Osmolality & Osmolar Gap',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Hoffman RS et al. Goldfrank / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'na', label: 'سدیم سرم (Na)', type: 'number', unit: 'mEq/L', placeholder: 'مثلاً 140', defaultValue: 140 },
      { id: 'glu', label: 'قند خون (Glucose)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 100', defaultValue: 100 },
      { id: 'bun', label: 'نیتروژن اوره خون (BUN)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 14', defaultValue: 14 },
      { id: 'eth', label: 'اتانول سرم (اختیاری)', type: 'number', unit: 'mg/dL', placeholder: '0', optional: true, defaultValue: 0 },
      { id: 'meas', label: 'اسمولالیته اندازه‌گیری‌شده (اختیاری — برای گپ)', type: 'number', unit: 'mOsm/kg', placeholder: 'مثلاً 305', optional: true, defaultValue: 305 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'na') || !hasNum(values, 'glu') || !hasNum(values, 'bun')) {
        return incompleteResult('سدیم، قند خون و BUN را وارد کنید.');
      }
      const na = getNum(values, 'na', 140);
      const glu = getNum(values, 'glu', 100);
      const bun = getNum(values, 'bun', 14);
      const eth = getNum(values, 'eth', 0);

      const calcOsm = round1(2 * na + glu / 18 + bun / 2.8 + eth / 3.7);

      if (!hasNum(values, 'meas')) {
        return {
          score: calcOsm,
          unit: 'mOsm/kg',
          riskLevel: calcOsm > 300 || calcOsm < 275 ? 'moderate' : 'low',
          riskTitle: `اسمولالیته محاسبه‌شده = ${calcOsm} mOsm/kg`,
          summary: `محدوده نرمال اسمولالیته سرم ۲۷۵ تا ۲۹۵ mOsm/kg است. (برای محاسبه اسمولار گپ، اسمولالیته آزمایشگاهی را وارد کنید).`,
          diagnosisAndTreatment: ['پایش وضعیت هیدراتاسیون و قند/سدیم بر اساس اسمولالیته محاسبه‌شده.'],
          clinicalNotes: ['فرمول روزن: Calc Osm = 2×Na + Glucose/18 + BUN/2.8 (+ Ethanol/3.7).'],
        };
      }

      const meas = getNum(values, 'meas', calcOsm);
      const gap = round1(meas - calcOsm);

      if (gap <= 10) {
        return {
          score: gap,
          unit: 'mOsm/kg (گپ)',
          riskLevel: 'low',
          riskTitle: `اسمولار گپ نرمال (محاسبه‌شده: ${calcOsm} mOsm/kg)`,
          summary: `اسمولار گپ ${gap} mOsm/kg در محدوده طبیعی (≤ ۱۰) است.`,
          diagnosisAndTreatment: [
            'تجمع حاد مقادیر بالای الکل‌های سمی حل‌نشده بعید است، اما در مراحل تأخیری متابولیسم متانول/اتیلن گلیکول گپ ممکن است نرمال شده و جای خود را به آنیون گپ بالا بدهد.',
          ],
          clinicalNotes: [
            'فرمول روزن: Calc Osm = 2×Na + Glucose/18 + BUN/2.8 (+ Ethanol/3.7).',
          ],
        };
      }

      return {
        score: gap,
        unit: 'mOsm/kg (گپ)',
        riskLevel: gap >= 20 ? 'critical' : 'high',
        riskTitle: `اسمولار گپ بالا! (محاسبه‌شده: ${calcOsm} mOsm/kg)`,
        summary: `افزایش اسمولار گپ به میزان ${gap} mOsm/kg — مطرح‌کننده الکل‌های سمی یا مواد اسموتیک.`,
        diagnosisAndTreatment: [
          'در شک بالینی به متانول یا اتیلن گلیکول: شروع فوری فومپیزول (۱۵ mg/kg بارگیری، سپس ۱۰ mg/kg هر ۱۲ ساعت) یا اتانول در نبود فومپیزول.',
          'مشاوره سم‌شناسی و نفرولوژی برای اندیکاسیون همودیالیز.',
          'فولینیک اسید/فولات در متانول؛ پیریدوکسین و تیامین در اتیلن گلیکول.',
        ],
        clinicalNotes: [
          'سایر علل گپ بالا: اتانول، ایزوپروپانول، مانیتول، پروپیلن گلیکول.',
        ],
      };
    },
  },

  // =========================================================================
  // F9. Corrected Phenytoin (Sheiner-Tozer)
  // =========================================================================
  {
    id: 'corrected-phenytoin',
    titleFa: 'اصلاح سطح سرمی فنی‌توئین (Sheiner-Tozer)',
    titleEn: 'Corrected Phenytoin for Albumin / Renal Failure',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Winter ME, Tozer TN / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'phen', label: 'سطح فنی‌توئین اندازه‌گیری‌شده (Measured Phenytoin)', type: 'number', unit: 'mcg/mL', placeholder: 'مثلاً 9', defaultValue: 9 },
      { id: 'alb', label: 'آلبومین سرم (Serum Albumin)', type: 'number', unit: 'g/dL', placeholder: 'مثلاً 2.2', defaultValue: 2.2 },
      {
        id: 'renal',
        label: 'وضعیت عملکرد کلیه',
        type: 'select',
        options: [
          { label: 'عملکرد کلیوی نرمال یا کاهش خفیف (CrCl > 20 mL/min)', points: 0 },
          { label: 'نارسایی شدید کلیه / دیالیزی (CrCl < 10–20 mL/min)', points: 1 },
        ],
      },
    ],
    evaluate(values) {
      if (!hasNum(values, 'phen') || !hasNum(values, 'alb')) {
        return incompleteResult('سطح سرمی فنی‌توئین و آلبومین سرم را وارد کنید.');
      }
      const phen = getNum(values, 'phen', 9);
      const alb = getNum(values, 'alb', 2.2);
      const isEsrd = Number(values.renal ?? 0) === 1;
      const coeff = isEsrd ? 0.1 : 0.2;
      const corrected = round1(phen / Math.max(0.1, coeff * alb + 0.1));

      if (corrected < 10) {
        return {
          score: corrected,
          unit: 'mcg/mL',
          riskLevel: 'moderate',
          riskTitle: 'زیر محدوده درمانی (< ۱۰ mcg/mL)',
          summary: `فنی‌توئین اصلاح‌شده ${corrected} mcg/mL (محدوده درمانی ۱۰ تا ۲۰).`,
          diagnosisAndTreatment: [
            'در صورت تشنج یا ریسک بالای تشنج: تجویز دوز لودینگ تکمیلی فنی‌توئین یا فسفنی‌توئین زیر مانیتور قلبی.',
          ],
          clinicalNotes: [
            'هر ۱ mg/kg فنی‌توئین سرم را حدود ۱ mcg/mL بالا می‌برد.',
          ],
        };
      }

      if (corrected <= 20) {
        return {
          score: corrected,
          unit: 'mcg/mL',
          riskLevel: 'low',
          riskTitle: 'در محدوده درمانی مناسب (۱۰ تا ۲۰ mcg/mL)',
          summary: `با وجود هیپوآلبومینمی، سطح آزاد موثر دارو در محدوده درمانی است (${corrected} mcg/mL).`,
          diagnosisAndTreatment: [
            'نیازی به بارگیری اضافی نیست؛ از مسمومیت غیرضروری جلوگیری شد.',
          ],
          clinicalNotes: [
            'سطح آزاد فنی‌توئین (Free Phenytoin، نرمال ۱–۲ mcg/mL) در بیماران بحرانی دقیق‌ترین معیار است.',
          ],
        };
      }

      return {
        score: corrected,
        unit: 'mcg/mL',
        riskLevel: corrected >= 30 ? 'critical' : 'high',
        riskTitle: 'محدوده سمی فنی‌توئین (> ۲۰ mcg/mL)',
        summary: `سطح اصلاح‌شده ${corrected} mcg/mL — خطر نیستاگموس، آتاکسی، دیزآرتری و لتارژی.`,
        diagnosisAndTreatment: [
          'قطع یا تعویق دوز بعدی دارو، مراقبت حمایتی و پیشگیری از سقوط (آتاکسی).',
          'چک نوار قلب و پایش سطح هوشیاری.',
        ],
        clinicalNotes: [
          'تجویز اشتباهی دوز اضافه در بیماران هیپوآلبومینمیک یکی از علل شایع مسمومیت یاتروژنیک فنی‌توئین است.',
        ],
      };
    },
  },

  // =========================================================================
  // F10. MAP & Cerebral Perfusion Pressure (CPP)
  // =========================================================================
  {
    id: 'map-cpp',
    titleFa: 'محاسبه فشار متوسط شریانی (MAP) و پرفیوژن مغزی (CPP)',
    titleEn: 'Mean Arterial Pressure (MAP) & CPP',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Rosen’s Emergency Medicine / Brain Trauma Foundation',
    criteria: [
      { id: 'sbp', label: 'فشار خون سیستولیک (SBP)', type: 'number', unit: 'mmHg', placeholder: 'مثلاً 90', defaultValue: 90 },
      { id: 'dbp', label: 'فشار خون دیاستولیک (DBP)', type: 'number', unit: 'mmHg', placeholder: 'مثلاً 55', defaultValue: 55 },
      { id: 'icp', label: 'فشار داخل جمجمه‌ای (ICP — اختیاری)', type: 'number', unit: 'mmHg', placeholder: '0', optional: true, defaultValue: 0 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'sbp') || !hasNum(values, 'dbp')) {
        return incompleteResult('فشار خون سیستولیک و دیاستولیک را وارد کنید.');
      }
      const sbp = getNum(values, 'sbp', 90);
      const dbp = getNum(values, 'dbp', 55);
      const hasIcp = hasNum(values, 'icp') && getNum(values, 'icp', 0) > 0;
      const icp = hasIcp ? getNum(values, 'icp', 0) : 0;
      const map = round1((sbp + 2 * dbp) / 3);
      const cpp = round1(map - icp);

      const primary = hasIcp ? cpp : map;
      const isLow = hasIcp ? cpp < 60 : map < 65;

      return {
        score: primary,
        unit: hasIcp ? 'mmHg (CPP)' : 'mmHg (MAP)',
        riskLevel: isLow ? 'critical' : map > 130 ? 'high' : 'low',
        riskTitle: hasIcp
          ? `MAP = ${map} mmHg | CPP = ${cpp} mmHg`
          : isLow
          ? `افت پرفیوژن ارگان‌ها (MAP = ${map} < 65 mmHg)`
          : map > 130
          ? `بحران فشار خون شدید (MAP = ${map} mmHg)`
          : `MAP در محدوده قابل قبول (${map} mmHg)`,
        summary: hasIcp
          ? `فشار پرفیوژن مغزی (CPP = MAP - ICP) برابر با ${cpp} mmHg است (هدف در TBI: ۶۰ تا ۷۰).`
          : `فشار متوسط شریانی (MAP) برابر با ${map} mmHg است (هدف در شوک/سپسیس: ≥ ۶۵ mmHg).`,
        diagnosisAndTreatment: isLow
          ? [
              'احیای سریع مایع (در نبود ادم ریه) و شروع وازوپرسور (نوراپی‌نفرین خط اول) برای حفظ MAP ≥ 65 mmHg.',
              hasIcp ? 'کاهش ICP (بالا آوردن سر ۳۰ درجه، مانیتول یا سالین هیپرتونیک) + حفظ MAP برای دستیابی به CPP ۶۰–۷۰.' : 'پایش برون‌ده ادراری، لاکتات و سطح هوشیاری.',
            ]
          : map > 130
          ? [
              'بررسی علائم آسیب ارگان هدف (انسفالوپاتی، ادم ریه، آنژین، دیسکسیون آئورت، خونریزی مغزی).',
              'در فوریت فشار خون، کاهش کنترل‌شده MAP حدود ۱۵–۲۵٪ طی ساعت اول با داروی وریدی قابل تیتر.',
            ]
          : ['حفظ پایش همودینامیک متناسب با شرایط بالینی بیمار.'],
        clinicalNotes: [
          'فرمول: MAP = (SBP + 2 × DBP) / 3 و CPP = MAP - ICP.',
        ],
      };
    },
  },

  // =========================================================================
  // F11. Parkland Formula (Burns)
  // =========================================================================
  {
    id: 'parkland-burn',
    titleFa: 'فرمول پارکلند (احیای مایعات در سوختگی)',
    titleEn: 'Parkland Formula for Burn Resuscitation',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Baxter CR, Shires T / ATLS & Rosen’s Emergency Medicine',
    criteria: [
      { id: 'weight', label: 'وزن بیمار (Weight)', type: 'number', unit: 'kg', placeholder: 'مثلاً 70', defaultValue: 70 },
      { id: 'tbsa', label: 'درصد سطح سوختگی درجه ۲ و ۳ (%TBSA)', type: 'number', unit: '%', placeholder: 'مثلاً 30', defaultValue: 30 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'weight') || !hasNum(values, 'tbsa')) {
        return incompleteResult('وزن بیمار و درصد سطح سوختگی (%TBSA) را وارد کنید.');
      }
      const wt = Math.max(1, getNum(values, 'weight', 70));
      const tbsa = Math.min(100, Math.max(1, getNum(values, 'tbsa', 30)));
      const total24h = Math.round(4 * wt * tbsa);
      const first8h = Math.round(total24h / 2);
      const hourlyFirst8 = Math.round(first8h / 8);
      const hourlyNext16 = Math.round(first8h / 16);

      return {
        score: total24h,
        unit: 'mL (در ۲۴ ساعت)',
        riskLevel: tbsa >= 20 ? 'critical' : 'moderate',
        riskTitle: `کل مایع ۲۴ ساعت: ${total24h.toLocaleString('en-US')} mL رینگر لاکتات`,
        summary: `نیمه اول (${first8h.toLocaleString('en-US')} mL) طی ۸ ساعت اول از زمان وقوع سوختگی (حدود ${hourlyFirst8} mL/hr) و نیمه دوم طی ۱۶ ساعت بعدی (${hourlyNext16} mL/hr).`,
        diagnosisAndTreatment: [
          'ساعت اول از زمان آسیب سوختگی محاسبه می‌شود (حجم مایع دریافت‌شده قبل از ورود را از سهم ۸ ساعت اول کسر کنید).',
          'مایع انتخابی: رینگر لاکتات (LR). برای کودکان زیر ۳۰ کیلوگرم، محلول نگهدارنده قندی مجزا اضافه شود.',
          'تیتر کردن سرعت سرم بر اساس برون‌ده ادراری هدف: بزرگسالان ۰.۵ mL/kg/hr (کودکان ۱ mL/kg/hr).',
        ],
        clinicalNotes: [
          'سوختگی درجه ۱ (قرمزی بدون تاول) در محاسبه %TBSA لحاظ نمی‌شود.',
        ],
      };
    },
  },

  // =========================================================================
  // F12. Potassium Shift with Arterial pH
  // =========================================================================
  {
    id: 'potassium-ph-shift',
    titleFa: 'اصلاح پتاسیم سرم بر اساس pH خون (اسیدوز / آلکالوز)',
    titleEn: 'Estimated Potassium Shift for Arterial pH',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Adrogue HJ, Madias NE / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'k', label: 'پتاسیم سرم اندازه‌گیری‌شده (Measured K)', type: 'number', unit: 'mEq/L', placeholder: 'مثلاً 4.0', defaultValue: 4.0 },
      { id: 'ph', label: 'pH شریانی یا وریدی (Blood pH)', type: 'number', unit: 'pH', placeholder: 'مثلاً 7.10', defaultValue: 7.1 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'k') || !hasNum(values, 'ph')) {
        return incompleteResult('پتاسیم سرم و مقدار pH خون را وارد کنید.');
      }
      const k = getNum(values, 'k', 4.0);
      const ph = getNum(values, 'ph', 7.1);
      const shift = ((7.4 - ph) / 0.1) * 0.6;
      const trueK = round2(k - shift);

      if (trueK < 3.5) {
        return {
          score: trueK,
          unit: 'mEq/L (پتاسیم واقعی)',
          riskLevel: trueK < 3.0 ? 'critical' : 'high',
          riskTitle: 'کمبود شدید مخفی پتاسیم کل بدن!',
          summary: `با اصلاح pH به ۷.۴۰، پتاسیم واقعی حدود ${trueK} mEq/L برآورد می‌شود (کاهش چشمگیر هنگام اصلاح اسیدوز).`,
          diagnosisAndTreatment: [
            'در DKA: اگر K اندازه‌گیری‌شده < ۳.۳ mEq/L باشد، انسولین را به تأخیر بیندازید و ابتدا KCl وریدی جایگزین کنید.',
            'حتی با K ظاهراً نرمال در اسیدوز شدید، به محض شروع انسولین و اصلاح pH پتاسیم به شدت سقوط خواهد کرد؛ KCl را به سرم اضافه و سریال چک کنید.',
          ],
          clinicalNotes: [
            'تخمین کلاسیک روزن: به ازای هر ۰.۱ کاهش pH، پتاسیم سرم حدود ۰.۶ mEq/L افزایش کاذب می‌یابد.',
          ],
        };
      }

      if (trueK > 5.0) {
        return {
          score: trueK,
          unit: 'mEq/L (پتاسیم واقعی)',
          riskLevel: trueK >= 6.0 ? 'critical' : 'high',
          riskTitle: 'هیپرکالمی واقعی حتی پس از اصلاح pH',
          summary: `پتاسیم تخمینی در pH نرمال برابر با ${trueK} mEq/L است.`,
          diagnosisAndTreatment: [
            'گرفتن فوری نوار قلب (پیک T، پهن شدن QRS، حذف موج P).',
            'در تغییرات ECG یا K ≥ ۶.۵: گلوکونات کلسیم ۱۰٪ وریدی، انسولین رگولار + دکستروز، سالبوتامول نبولایزر، دفع کلیوی/دیالیز.',
          ],
          clinicalNotes: [
            'اگرچه بخشی از هیپرکالمی در اسیدوز ناشی از شیفت است، مقدار تخمینی بالا نشان‌دهنده اضافه‌بار واقعی پتاسیم است.',
          ],
        };
      }

      return {
        score: trueK,
        unit: 'mEq/L (پتاسیم واقعی)',
        riskLevel: 'low',
        riskTitle: 'ذخیره پتاسیم تخمینی در محدوده نرمال (۳.۵–۵.۰)',
        summary: `پتاسیم واقعی تخمینی در pH=۷.۴۰ حدود ${trueK} mEq/L است.`,
        diagnosisAndTreatment: [
          'پایش سریال پتاسیم هر ۲ تا ۴ ساعت حین درمان اختلالات اسید-باز یا DKA.',
        ],
        clinicalNotes: [
          'این فرمول تقریبی است و همواره نیازمند پایش مستقیم آزمایشگاهی حین درمان است.',
        ],
      };
    },
  },

  // =========================================================================
  // F13. PaO2 / FiO2 Ratio (ARDS Severity)
  // =========================================================================
  {
    id: 'pf-ratio',
    titleFa: 'محاسبه نسبت PaO2 / FiO2 (شاخص اکسیژناسیون و ARDS)',
    titleEn: 'PaO2 / FiO2 Ratio (Berlin ARDS Criteria)',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'ARDS Definition Task Force. JAMA 2012 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'pao2', label: 'فشار اکسیژن شریانی (PaO2)', type: 'number', unit: 'mmHg', placeholder: 'مثلاً 80', defaultValue: 80 },
      { id: 'fio2', label: 'درصد اکسیژن دمی (FiO2 — بین ۲۱ تا ۱۰۰)', type: 'number', unit: '%', placeholder: 'مثلاً 50', defaultValue: 50 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'pao2') || !hasNum(values, 'fio2')) {
        return incompleteResult('مقادیر PaO2 و درصد FiO2 (۲۱ تا ۱۰۰) را وارد کنید.');
      }
      const pao2 = getNum(values, 'pao2', 80);
      const fio2Pct = Math.min(100, Math.max(21, getNum(values, 'fio2', 50)));
      const pf = Math.round(pao2 / (fio2Pct / 100));

      if (pf > 300) {
        return {
          score: pf,
          unit: 'mmHg',
          riskLevel: 'low',
          riskTitle: 'نسبت P/F نرمال یا بدون معیار ARDS (> ۳۰۰)',
          summary: `نسبت PaO2/FiO2 برابر با ${pf} است.`,
          diagnosisAndTreatment: [
            'کاهش تدریجی FiO2 برای حفظ SpO2 هدف (معمولاً ۹۲–۹۶٪؛ در COPD 88–92٪).',
          ],
          clinicalNotes: [
            'نرمال در هوای اتاق با PaO2=90–100 حدود ۴۳۰–۴۸۰ است.',
          ],
        };
      }

      if (pf > 200) {
        return {
          score: pf,
          unit: 'mmHg',
          riskLevel: 'moderate',
          riskTitle: 'هیپوکسمی خفیف / ARDS خفیف (۲۰۱ تا ۳۰۰)',
          summary: `نسبت P/F = ${pf} (در حضور PEEP ≥ 5 و انفیلتراسیون دوطرفه معادل ARDS خفیف).`,
          diagnosisAndTreatment: [
            'بررسی HFNC/NIV یا تنظیم PEEP، استراتژی تهویه محافظتی ریه (VT 6 mL/kg IBW).',
          ],
          clinicalNotes: [
            'تشخیص برلین نیازمند شروع حاد (<۷ روز)، کدورت دوطرفه غیرقابل توجیه با نارسایی قلبی و PEEP ≥ 5 است.',
          ],
        };
      }

      return {
        score: pf,
        unit: 'mmHg',
        riskLevel: pf <= 100 ? 'critical' : 'high',
        riskTitle: pf <= 100 ? 'ARDS شدید (P/F ≤ 100)' : 'ARDS متوسط (P/F 101–200)',
        summary: `نسبت PaO2/FiO2 = ${pf} — شانت شدید داخل ریوی و هیپوکسمی بحرانی.`,
        diagnosisAndTreatment: [
          'تهویه مکانیکی محافظتی ریه: Tidal Volume = 6 mL/kg IBW، حفظ فشار پلاتو ≤ 30 cmH2O و تیتر PEEP.',
          pf <= 150
            ? 'در نظر گرفتن وضعیت دمر (Prone Positioning)، بلاکر عصبی-عضلانی کوتاه‌مدت در ناسازگاری شدید و مشاوره ECMO.'
            : 'درمان علت زمینه‌ای (سپسیس، پنومونی، آسپیراسیون) و تعادل منفی مایعات پس از خروج از شوک.',
        ],
        clinicalNotes: [
          'در ARDS شدید (P/F ≤ 100)، مرگ‌ومیر گزارش‌شده بالای ۴۰–۴۵٪ بوده و نیازمند بستری فوری ICU است.',
        ],
      };
    },
  },

  // =========================================================================
  // F14. Bicarbonate Deficit
  // =========================================================================
  {
    id: 'bicarb-deficit',
    titleFa: 'محاسبه کسری بی‌کربنات سدیم (Bicarbonate Deficit)',
    titleEn: 'Bicarbonate Deficit Calculation',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Rosen’s Emergency Medicine (Acid-Base Disorders)',
    criteria: [
      { id: 'weight', label: 'وزن بیمار (Weight)', type: 'number', unit: 'kg', placeholder: 'مثلاً 70', defaultValue: 70 },
      { id: 'hco3', label: 'بی‌کربنات فعلی سرم (Measured HCO3)', type: 'number', unit: 'mEq/L', placeholder: 'مثلاً 10', defaultValue: 10 },
      { id: 'target', label: 'بی‌کربنات هدف (اختیاری — پیش‌فرض ۱۵)', type: 'number', unit: 'mEq/L', placeholder: '15', optional: true, defaultValue: 15 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'weight') || !hasNum(values, 'hco3')) {
        return incompleteResult('وزن بیمار و بی‌کربنات فعلی (HCO3) را وارد کنید.');
      }
      const wt = Math.max(1, getNum(values, 'weight', 70));
      const hco3 = getNum(values, 'hco3', 10);
      const target = hasNum(values, 'target') ? getNum(values, 'target', 15) : 15;
      const deficit = target > hco3 ? Math.round(0.5 * wt * (target - hco3)) : 0;
      const halfDose = Math.round(deficit / 2);

      return {
        score: deficit,
        unit: 'mEq (کسری کل)',
        riskLevel: deficit > 200 ? 'high' : deficit > 0 ? 'moderate' : 'low',
        riskTitle: deficit > 0 ? `کسری کل = ${deficit} mEq (دوز اولیه نصف: ${halfDose} mEq)` : 'کسری بی‌کربنات وجود ندارد',
        summary: `فضای توزیع بی‌کربنات حدود ۰.۵ × وزن در نظر گرفته می‌شود؛ برای رسیدن به HCO3=${target} نیاز محاسبه‌شده ${deficit} mEq است.`,
        diagnosisAndTreatment: [
          'بی‌کربنات سدیم وریدی در DKA یا اسیدوز لاکتیک روتین توصیه نمی‌شود (مگر pH < ۶.۹–۷.۰ یا هیپرکالمی تهدیدکننده حیات / مسمومیت با TCA و سالیسیلات).',
          `در صورت اندیکاسیون واقعی: تنها نصف دوز محاسبه‌شده (${halfDose} mEq) طی چند ساعت انفوزیون و ABG مجدد چک شود.`,
        ],
        clinicalNotes: [
          'فرمول: HCO3 Deficit = 0.5 × Weight (kg) × (Desired HCO3 - Measured HCO3).',
        ],
      };
    },
  },

  // =========================================================================
  // F15. Shock Index
  // =========================================================================
  {
    id: 'shock-index',
    titleFa: 'محاسبه شاخص شوک (Shock Index)',
    titleEn: 'Shock Index (SI = HR / SBP)',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Allgöwer M, Burri C 1967 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'hr', label: 'ضربان قلب (Heart Rate)', type: 'number', unit: 'bpm', placeholder: 'مثلاً 110', defaultValue: 110 },
      { id: 'sbp', label: 'فشار خون سیستولیک (SBP)', type: 'number', unit: 'mmHg', placeholder: 'مثلاً 100', defaultValue: 100 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'hr') || !hasNum(values, 'sbp')) {
        return incompleteResult('ضربان قلب و فشار خون سیستولیک را وارد کنید.');
      }
      const hr = getNum(values, 'hr', 110);
      const sbp = Math.max(20, getNum(values, 'sbp', 100));
      const si = round2(hr / sbp);

      if (si < 0.7) {
        return {
          score: si,
          riskLevel: 'low',
          riskTitle: 'شاخص شوک نرمال (۰.۵ تا ۰.۷)',
          summary: `SI = ${si}؛ شواهد شوک پنهان بر اساس نسبت نبض به فشار دیده نمی‌شود.`,
          diagnosisAndTreatment: ['ادامه ارزیابی معمول بالینی و علائم حیاتی سریال.'],
          clinicalNotes: [
            'در بیماران مصرف‌کننده بتابلاکر یا پیس‌میکر، ضربان قلب ممکن است بالا نرود و شاخص شوک به طور کاذب نرمال بماند.',
          ],
        };
      }

      if (si < 1.0) {
        return {
          score: si,
          riskLevel: 'moderate',
          riskTitle: 'شاخص شوک مرزی / هشدار شوک پنهان (۰.۷ تا ۰.۹۹)',
          summary: `SI = ${si} — با وجود SBP ظاهراً قابل قبول، احتمال خونریزی مخفی یا شوک جبران‌شده وجود دارد.`,
          diagnosisAndTreatment: [
            'برقراری دو رگ وریدی، eFAST در تروما، چک لاکتات سرم و تایپ و کراس‌مچ.',
            'جستجوی منبع خونریزی، سپسیس یا آمبولی ریه و پایش مداوم علائم حیاتی.',
          ],
          clinicalNotes: [
            'SI ≥ 0.8–0.9 در تروما حساسیت بالایی برای نیاز به ترانسفیوژن خون دارد.',
          ],
        };
      }

      return {
        score: si,
        riskLevel: 'critical',
        riskTitle: 'شاخص شوک بالا (SI ≥ 1.0) — ناپایداری همودینامیک شدید',
        summary: `SI = ${si} (ضربان قلب بیشتر یا مساوی فشار سیستولیک) — خطر بالای مرگ‌ومیر و نیاز به ترانسفیوژن حجیم.`,
        diagnosisAndTreatment: [
          'فعال‌سازی فوری پروتکل احیا و در تروما پروتکل ترانسفیوژن انبوه (MTP 1:1:1 + ترانگزامیک اسید ۱ گرم).',
          'یافتن و کنترل فوری منبع شوک (خونریزی، سپسیس، PE حجیم).',
        ],
        clinicalNotes: [
          'SI > 1.3 پیش‌بینی‌کننده مستقیم شوک جبران‌نشده و مرگ‌ومیر بالای بیمارستانی است.',
        ],
      };
    },
  },

  // =========================================================================
  // F16. Corrected QT Interval (QTc - Bazett & Fridericia)
  // =========================================================================
  {
    id: 'qtc-interval',
    titleFa: 'محاسبه QTc اصلاح‌شده (فرمول بازت و فریدریشیا)',
    titleEn: 'Corrected QT Interval (Bazett & Fridericia)',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Bazett HC 1920 / Fridericia LS 1920 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'qt', label: 'فاصله QT اندازه‌گیری‌شده در نوار قلب', type: 'number', unit: 'ms', placeholder: 'مثلاً 440', defaultValue: 440 },
      { id: 'hr', label: 'ضربان قلب (Heart Rate)', type: 'number', unit: 'bpm', placeholder: 'مثلاً 80', defaultValue: 80 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'qt') || !hasNum(values, 'hr')) {
        return incompleteResult('فاصله QT (به میلی‌ثانیه) و ضربان قلب را وارد کنید.');
      }
      const qt = getNum(values, 'qt', 440);
      const hr = Math.max(20, getNum(values, 'hr', 80));
      const rr = 60 / hr;
      const bazett = Math.round(qt / Math.sqrt(rr));
      const fridericia = Math.round(qt / Math.cbrt(rr));
      const preferred = hr > 100 || hr < 55 ? fridericia : bazett;

      if (preferred < 450) {
        return {
          score: preferred,
          unit: 'ms',
          riskLevel: 'low',
          riskTitle: `QTc نرمال (بازت: ${bazett} | فریدریشیا: ${fridericia} ms)`,
          summary: `فاصله QTc در محدوده ایمن (< ۴۵۰ ms) است.`,
          diagnosisAndTreatment: ['خطر آریتمی تورساد دو پوینت در لحظه فعلی پایین است.'],
          clinicalNotes: [
            'در ضربان قلب خیلی بالا (>۱۰۰) یا خیلی پایین (<۵۵)، فرمول Fridericia از Bazett دقیق‌تر است.',
          ],
        };
      }

      if (preferred < 500) {
        return {
          score: preferred,
          unit: 'ms',
          riskLevel: 'moderate',
          riskTitle: `طولانی شدن مرزی QTc (بازت: ${bazett} | فریدریشیا: ${fridericia} ms)`,
          summary: `فاصله QTc بین ۴۵۰ تا ۴۹۹ ms است.`,
          diagnosisAndTreatment: [
            'پرهیز از تجویز داروهای طولانی‌کننده QT (اندانسترون، هالوپریدول، آزیترومایسین، فلوئوروکینولون‌ها، آمیودارون).',
            'چک و اصلاح پتاسیم (> ۴.۰) و منیزیم (> ۲.۰) و بررسی مسمومیت دارویی یا ایسکمی.',
          ],
          clinicalNotes: [
            'حد نرمال در مردان < ۴۵۰ ms و در زنان < ۴۶۰ ms در نظر گرفته می‌شود.',
          ],
        };
      }

      return {
        score: preferred,
        unit: 'ms',
        riskLevel: 'critical',
        riskTitle: `QTc به شدت طولانی ≥ ۵۰۰ ms (بازت: ${bazett} | فریدریشیا: ${fridericia} ms)`,
        summary: `خطر بالای آریتمی کشنده Torsades de Pointes (TdP).`,
        diagnosisAndTreatment: [
          'مانیتورینگ مداوم تله‌متری و آماده‌باش دفیبریلاتور.',
          'تجویز سولفات منیزیم ۲ گرم وریدی طی ۱۰–۱۵ دقیقه در حضور اکتوپی بطنی یا اپیزودهای TdP.',
          'اصلاح فوری K+ و Ca2+، قطع تمام داروهای مسبب؛ در برادی‌کاردی مسبب TdP بررسی ایزوپروترنول یا اووردرایو پیسینگ.',
        ],
        clinicalNotes: [
          'در حضور QRS پهن (مانند LBBB یا پیس‌میکر)، روش برآورد JTc به کار می‌رود.',
        ],
      };
    },
  },

  // =========================================================================
  // F17. Pediatric ETT Size & Insertion Depth
  // =========================================================================
  {
    id: 'peds-ett-depth',
    titleFa: 'محاسبه سایز و عمق لوله تراشه در اطفال',
    titleEn: 'Pediatric Endotracheal Tube Size & Depth',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'PALS / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'age', label: 'سن کودک (۱ تا ۱۲ سال)', type: 'number', unit: 'سال', placeholder: 'مثلاً 4', defaultValue: 4 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'age')) {
        return incompleteResult('سن کودک را به سال وارد کنید.');
      }
      const age = Math.max(0.5, getNum(values, 'age', 4));
      const cuffed = round1(age / 4 + 3.5);
      const uncuffed = round1(age / 4 + 4.0);
      const depth = round1(3 * cuffed);

      return {
        score: cuffed,
        unit: 'mm (لوله کاف‌دار)',
        riskLevel: 'low',
        riskTitle: `کاف‌دار: ${cuffed} mm | بدون کاف: ${uncuffed} mm | عمق: ${depth} cm`,
        summary: `لوله کاف‌دار توصیه‌شده سایز ${cuffed} با عمق فیکس در لب حدود ${depth} سانتی‌متر (یا ${round1(age / 2 + 12)} cm).`,
        diagnosisAndTreatment: [
          'آماده داشتن یک سایز کوچک‌تر و یک سایز بزرگ‌تر در بالین کودک.',
          'لوله کاف‌دار (با فشار کاف ≤ ۲۰–۲۵ cmH2O) استاندارد ترجیحی در اورژانس کودکان است.',
          'تأیید جایگاه لوله با کاپنوگرافی موجی (ETCO2)، سمع دوطرفه و رادیوگرافی سینه.',
        ],
        clinicalNotes: [
          'فرمول: Cuffed ETT = (Age/4) + 3.5 | Uncuffed = (Age/4) + 4 | Depth = 3 × ETT Size.',
          'برای نوزاد ترم: سایز ۳.۰–۳.۵ کاف‌دار و عمق ۹ تا ۱۰ سانتی‌متر.',
        ],
      };
    },
  },
];
