import { ClinicalScoreDefinition, sumCriteria } from '../types';

export const CARDIO_PULM_SCORES: ClinicalScoreDefinition[] = [
  {
    id: 'heart-score',
    titleFa: 'اسکور HEART (درد قفسه سینه)',
    titleEn: 'HEART Score for Major Cardiac Events',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: "Rosen's Emergency Medicine · Six AJ et al.",
    criteria: [
      {
        id: 'history',
        label: 'شرح حال (History)',
        type: 'select',
        options: [
          { label: 'کمی مشکوک', points: 0 },
          { label: 'نسبتاً مشکوک', points: 1 },
          { label: 'بسیار مشکوک به ایسکمی تیپیک', points: 2 },
        ],
      },
      {
        id: 'ecg',
        label: 'نوار قلب (ECG)',
        type: 'select',
        options: [
          { label: 'نرمال', points: 0 },
          { label: 'تغییرات غیراختصاصی رپولاریزاسیون / LBBB یا پیس‌میکر قدیمی', points: 1 },
          { label: 'افت ST معنادار بدون LBBB/LVH یا دیگوکسین', points: 2 },
        ],
      },
      {
        id: 'age',
        label: 'سن بیمار',
        type: 'select',
        options: [
          { label: 'کمتر از ۴۵ سال', points: 0 },
          { label: '۴۵ تا ۶۴ سال', points: 1 },
          { label: '۶۵ سال و بالاتر', points: 2 },
        ],
      },
      {
        id: 'risk',
        label: 'عوامل خطر آترواسکلروز (HTN، دیابت، سیگار، چربی خون، سابقه فامیلی، چاقی)',
        type: 'select',
        options: [
          { label: 'بدون عامل خطر', points: 0 },
          { label: '۱ تا ۲ عامل خطر', points: 1 },
          { label: '۳ عامل خطر یا بیشتر / سابقه CAD، CVA یا PAD', points: 2 },
        ],
      },
      {
        id: 'troponin',
        label: 'تروپونین اولیه',
        type: 'select',
        options: [
          { label: '≤ حد نرمال (1x ULN)', points: 0 },
          { label: '۱ تا ۳ برابر حد نرمال', points: 1 },
          { label: 'بیش از ۳ برابر حد نرمال', points: 2 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 3) {
        return {
          score,
          maxScore: 10,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین (Low Risk · MACE ~0.9–1.7%)',
          summary: 'احتمال حوادث قلبی عمده در ۶ هفته آینده بسیار پایین است.',
          diagnosisAndTreatment: [
            'در صورت منفی بودن تروپونین سریال (۰ و ۳ ساعت)، بیمار کاندید ترخیص ایمن از اورژانس است.',
            'بررسی علل غیرقلبی درد قفسه سینه و ارجاع سرپایی قلب.',
          ],
          clinicalNotes: [
            'همراهی با تروپونین سریال حساسیت تشخیصی را به بالای ۹۹٪ می‌رساند؛ در STEMI یا ناپایداری همودینامیک کاربرد ندارد.',
          ],
        };
      }
      if (score <= 6) {
        return {
          score,
          maxScore: 10,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط (Moderate Risk · MACE ~12–16.6%)',
          summary: 'نیازمند بستری یا تحت‌نظر در اورژانس و بررسی‌های تکمیلی است.',
          diagnosisAndTreatment: [
            'تروپونین سریال، مانیتورینگ ECG و تجویز آسپرین در نبود کنترااندیکاسیون.',
            'مشاوره قلب جهت تست غیرتهاجمی (استرس تست، استرس اکو یا CT آنژیو کرونر).',
          ],
          clinicalNotes: ['ترخیص بدون تست غیرتهاجمی یا آنژیوگرافی در این گروه توصیه نمی‌شود.'],
        };
      }
      return {
        score,
        maxScore: 10,
        riskLevel: 'high',
        riskTitle: 'ریسک بالا (High Risk · MACE ~50–65%)',
        summary: 'احتمال بالای NSTEMI/UA نیازمند درمان فوری سندرم حاد کرونری.',
        diagnosisAndTreatment: [
          'بستری فوری در CCU، شروع DAPT (آسپرین + کلوپیدوگرل/تیکاگرلور) و آنتی‌کوآگولانت (هپارین/انوکساپارین).',
          'مشاوره اورژانسی قلب برای آنژیوگرافی کرونری زودهنگام و کنترل ایسکمی با نیترات/بتابلاکر.',
        ],
        clinicalNotes: ['تروپونین مثبت یا تغییرات دینامیک ST به تنهایی درمان کامل ACS را ایجاب می‌کند.'],
      };
    },
  },
  {
    id: 'timi-nstemi',
    titleFa: 'اسکور TIMI (آنژین ناپایدار / NSTEMI)',
    titleEn: 'TIMI Risk Score for UA/NSTEMI',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: "Rosen's Emergency Medicine · Antman EM et al.",
    criteria: [
      { id: 'age65', label: 'سن ۶۵ سال یا بالاتر', type: 'boolean', points: 1 },
      { id: 'cad3', label: 'حداقل ۳ عامل خطر CAD', type: 'boolean', points: 1 },
      { id: 'knownCad', label: 'تنگی شناخته‌شده کرونر ≥ ۵۰٪', type: 'boolean', points: 1 },
      { id: 'asa7', label: 'مصرف آسپرین در ۷ روز گذشته', type: 'boolean', points: 1 },
      { id: 'angina2', label: 'حداقل ۲ اپیزود آنژین در ۲۴ ساعت اخیر', type: 'boolean', points: 1 },
      { id: 'stDev', label: 'تغییرات ST ≥ ۰.۵ میلی‌متر در ECG', type: 'boolean', points: 1 },
      { id: 'marker', label: 'افزایش مارکرهای قلبی (تروپونین مثبت)', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 2) {
        return {
          score,
          maxScore: 7,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین (رویداد ۱۴ روزه ~4.7–8.3%)',
          summary: 'خطر حوادث ایسکمیک زودهنگام پایین است.',
          diagnosisAndTreatment: ['آسپرین، پایش قلبی و تست غیرتهاجمی در صورت منفی بودن تروپونین.'],
          clinicalNotes: ['برای رد اولیه درد قفسه سینه در اورژانس، HEART حساسیت بالاتری دارد.'],
        };
      }
      if (score <= 4) {
        return {
          score,
          maxScore: 7,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط (رویداد ۱۴ روزه ~13.2–19.9%)',
          summary: 'نیازمند بستری، درمان ضدانعقادی و برنامه‌ریزی آنژیوگرافی.',
          diagnosisAndTreatment: [
            'شروع DAPT + آنتی‌کوآگولانت (انوکساپارین یا هپارین) و بستری در CCU.',
            'مشاوره قلب جهت آنژیوگرافی طی ۲۴ تا ۷۲ ساعت.',
          ],
          clinicalNotes: ['در امتیاز ≥ ۳ منفعت بالینی LMWH و استراتژی تهاجمی زودهنگام اثبات شده است.'],
        };
      }
      return {
        score,
        maxScore: 7,
        riskLevel: 'high',
        riskTitle: 'ریسک بالا (رویداد ۱۴ روزه ~26.2–40.9%)',
        summary: 'خطر بسیار بالای مرگ یا MI مجدد.',
        diagnosisAndTreatment: [
          'بستری فوری در CCU، درمان کامل ضدانعقادی و ضدپلاکتی دوگانه.',
          'مشاوره فوری کاردیولوژی برای آنژیوگرافی زودهنگام (< ۲۴ ساعت).',
        ],
        clinicalNotes: ['در ناپایداری همودینامیک یا درد مقاوم، آنژیوگرافی اورژانسی (< ۲ ساعت) لازم است.'],
      };
    },
  },
  {
    id: 'timi-stemi',
    titleFa: 'اسکور TIMI (انفارکتوس با صعود ST)',
    titleEn: 'TIMI Risk Score for STEMI',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: "Rosen's Emergency Medicine · Morrow DA et al.",
    criteria: [
      {
        id: 'age',
        label: 'سن بیمار',
        type: 'select',
        options: [
          { label: 'کمتر از ۶۵ سال', points: 0 },
          { label: '۶۵ تا ۷۴ سال', points: 2 },
          { label: '۷۵ سال و بالاتر', points: 3 },
        ],
      },
      { id: 'dmHtnAng', label: 'سابقه دیابت، فشار خون بالا یا آنژین', type: 'boolean', points: 1 },
      { id: 'sbp100', label: 'فشار خون سیستولیک < ۱۰۰ mmHg', type: 'boolean', points: 3 },
      { id: 'hr100', label: 'ضربان قلب > ۱۰۰ در دقیقه', type: 'boolean', points: 2 },
      { id: 'killip', label: 'کلاس Killip II تا IV (رال ریه، S3 یا شوک کاردیوژنیک)', type: 'boolean', points: 2 },
      { id: 'wt67', label: 'وزن کمتر از ۶۷ کیلوگرم', type: 'boolean', points: 1 },
      { id: 'antSt', label: 'صعود ST قدامی (Anterior) یا LBBB جدید', type: 'boolean', points: 1 },
      { id: 'time4h', label: 'زمان تا شروع درمان بیش از ۴ ساعت', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 2) {
        return {
          score,
          maxScore: 14,
          riskLevel: 'moderate',
          riskTitle: 'ریسک پایین تا متوسط STEMI (مرگ‌ومیر ۳۰ روزه ~0.8–2.2%)',
          summary: 'پیش‌آگهی ۳۰ روزه مطلوب‌تر به شرط ریپرفیوژن فوری.',
          diagnosisAndTreatment: [
            'فعال‌سازی فوری کد STEMI برای PCI اولیه (Door-to-Balloon < 90 دقیقه) یا ترومبولیتیک (< 30 دقیقه).',
            'آسپرین جویدنی ۳۰۰ mg + مهارکننده P2Y12 + هپارین وریدی و بستری CCU.',
          ],
          clinicalNotes: ['در تمامی بیماران STEMI صرف‌نظر از امتیاز TIMI، بازگشایی فوری عروق اولویت مطلق است.'],
        };
      }
      if (score <= 5) {
        return {
          score,
          maxScore: 14,
          riskLevel: 'high',
          riskTitle: 'ریسک بالا در STEMI (مرگ‌ومیر ۳۰ روزه ~4.4–12.4%)',
          summary: 'احتمال بالای نارسایی قلبی یا شوک؛ PCI اولیه ارجحیت مطلق دارد.',
          diagnosisAndTreatment: [
            'انتقال فوری به کت‌لب برای PCI اولیه و آماده بودن برای حمایت همودینامیک.',
            'مانیتورینگ دقیق آریتمی‌ها، حفظ اکسیژناسیون و پرهیز از بتابلاکر/نیترات در افت فشار یا MI بطن راست.',
          ],
          clinicalNotes: ['MI قدامی و کلاس Killip بالا خطر شوک کاردیوژنیک را به‌شدت افزایش می‌دهند.'],
        };
      }
      return {
        score,
        maxScore: 14,
        riskLevel: 'critical',
        riskTitle: 'ریسک بحرانی STEMI (مرگ‌ومیر ۳۰ روزه ~16–36%)',
        summary: 'بیمار در معرض خطر بالای شوک کاردیوژنیک و مرگ است.',
        diagnosisAndTreatment: [
          'احیای فوری، PCI اورژانسی و مشاوره ICU قلب جهت حمایت مکانیکی گردش خون (IABP/Impella) در صورت شوک.',
          'پایش دقیق وازوپرسورها (نوراپی‌نفرین) در شوک کاردیوژنیک و کنترل ریتم‌های کشنده.',
        ],
        clinicalNotes: ['ترومبولیز در شوک کاردیوژنیک کارایی کمی دارد و باید بیمار سریعاً به مرکز دارای PCI منتقل شود.'],
      };
    },
  },
  {
    id: 'killip-class',
    titleFa: 'طبقه‌بندی Killip (نارسایی قلبی در MI)',
    titleEn: 'Killip Classification for Acute MI',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: "Rosen's Emergency Medicine · Killip T & Kimball JT",
    criteria: [
      {
        id: 'killip',
        label: 'وضعیت بالینی بیمار در معاینه',
        type: 'select',
        options: [
          { label: 'کلاس I: بدون شواهد نارسایی قلبی (ریه پاک، بدون S3)', points: 1 },
          { label: 'کلاس II: رال در کمتر از ۵۰٪ ریه، گالوپ S3 یا اتساع ورید ژوگولار', points: 2 },
          { label: 'کلاس III: ادم حاد ریه (رال در بیش از ۵۰٪ فیلدهای ریوی)', points: 3 },
          { label: 'کلاس IV: شوک کاردیوژنیک (SBP < 90 و علائم هیپوپرفیوژن)', points: 4 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 1) {
        return {
          score,
          maxScore: 4,
          riskLevel: 'low',
          riskTitle: 'Killip Class I (مرگ‌ومیر ~6%)',
          summary: 'بدون شواهد احتقان ریوی در بدو ورود.',
          diagnosisAndTreatment: ['پروتکل استاندارد ریپرفیوژن (PCI/ترومبولیتیک)، آسپرین، P2Y12 و بتابلاکر در صورت نبود کنترااندیکاسیون.'],
          clinicalNotes: ['پایش مداوم جهت تشخیص زودهنگام افت فشار یا ادم ریه.'],
        };
      }
      if (score === 2) {
        return {
          score,
          maxScore: 4,
          riskLevel: 'moderate',
          riskTitle: 'Killip Class II (مرگ‌ومیر ~17%)',
          summary: 'نارسایی خفیف تا متوسط بطن چپ.',
          diagnosisAndTreatment: [
            'تجویز دیورتیک لوپ (فوروزماید IV) و نیتروگلیسیرین در صورت فشار خون مناسب.',
            'شروع بتابلاکر با احتیاط پس از تثبیت وضعیت تنفسی و همودینامیک.',
          ],
          clinicalNotes: ['از تجویز بتابلاکر وریدی سریع در نارسایی حاد خودداری کنید.'],
        };
      }
      if (score === 3) {
        return {
          score,
          maxScore: 4,
          riskLevel: 'high',
          riskTitle: 'Killip Class III (مرگ‌ومیر ~38%)',
          summary: 'ادم حاد ریوی کاردیوژنیک نیازمند حمایت تنفسی فوری.',
          diagnosisAndTreatment: [
            'شروع سریع NIV (CPAP/BiPAP) یا انتوباسیون در دیسترس شدید، نیتروگلیسیرین IV (در SBP > 100) و فوروزماید IV.',
            'ریپرفیوژن فوری عروق کرونر و بستری در CCU/ICU.',
          ],
          clinicalNotes: ['مورفین به علت افزایش احتمال نیاز به تهویه مکانیکی در ادم حاد ریه توصیه نمی‌شود.'],
        };
      }
      return {
        score,
        maxScore: 4,
        riskLevel: 'critical',
        riskTitle: 'Killip Class IV — شوک کاردیوژنیک (مرگ‌ومیر ~67–81%)',
        summary: 'اورژانس بسیار بحرانی نیازمند ریواسکولاریزاسیون فوری.',
        diagnosisAndTreatment: [
          'انتقال مستقیم و اورژانسی به کت‌لب برای PCI اولیه (تنها اقدام کاهنده مرگ‌ومیر در شوک کاردیوژنیک).',
          'نوراپی‌نفرین برای حفظ MAP ≥ 65، اکوکاردیوگرافی بستر برای رد عوارض مکانیکی (پارگی سپتوم/عضله پاپیلاری) و در نظر گرفتن IABP.',
        ],
        clinicalNotes: ['در شوک ناشی از MI بطن راست، از نیترات و دیورتیک پرهیز و بولوس مایع محتاطانه بدهید.'],
      };
    },
  },
  {
    id: 'cha2ds2-vasc',
    titleFa: 'اسکور CHA₂DS₂-VASc (فیبریلاسیون دهلیزی)',
    titleEn: 'CHA₂DS₂-VASc Score for AF Stroke Risk',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: "Rosen's Emergency Medicine · Lip GYH et al.",
    criteria: [
      { id: 'chf', label: 'نارسایی احتقانی قلب (CHF) یا اختلال LV', type: 'boolean', points: 1 },
      { id: 'htn', label: 'فشار خون بالا (HTN)', type: 'boolean', points: 1 },
      {
        id: 'age',
        label: 'رده سنی بیمار',
        type: 'select',
        options: [
          { label: 'زیر ۶۵ سال', points: 0 },
          { label: '۶۵ تا ۷۴ سال', points: 1 },
          { label: '۷۵ سال و بالاتر', points: 2 },
        ],
      },
      { id: 'dm', label: 'دیابت ملیتوس', type: 'boolean', points: 1 },
      { id: 'stroke', label: 'سابقه Stroke، TIA یا ترومبوآمبولی', type: 'boolean', points: 2 },
      { id: 'vascular', label: 'بیماری عروقی (MI قبلی، PAD یا پلاک آئورت)', type: 'boolean', points: 1 },
      { id: 'female', label: 'جنسیت مؤنث', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      const nonSexScore = score - (values['female'] ? 1 : 0);
      if (nonSexScore === 0) {
        return {
          score,
          maxScore: 9,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین (امتیاز غیرجنسی ۰)',
          summary: 'خطر سالانه سکته مغزی بسیار پایین است.',
          diagnosisAndTreatment: ['نیازی به شروع آنتی‌کوآگولانت طولانی‌مدت (OAC) نیست.'],
          clinicalNotes: ['جنسیت مؤنث به‌تنهایی بدون سایر عوامل خطر نیاز به ضدانعقاد ایجاد نمی‌کند.'],
        };
      }
      if (nonSexScore === 1) {
        return {
          score,
          maxScore: 9,
          riskLevel: 'moderate',
          riskTitle: 'ریسک مرزی / متوسط (۱ عامل خطر غیرجنسی)',
          summary: 'شروع آنتی‌کوآگولانت خوراکی بر اساس ارزیابی HAS-BLED توصیه می‌شود.',
          diagnosisAndTreatment: [
            'در نظر گرفتن شروع DOAC (آپیکسابان، ریواروکسابان، دابیگاتران) یا وارفارین.',
            'رعایت پروتکل ضدانعقادی در صورت برنامه‌ریزی کاردیوورژن.',
          ],
          clinicalNotes: ['آسپرین جایگزین مناسبی برای پیشگیری از استروک در AF نیست.'],
        };
      }
      return {
        score,
        maxScore: 9,
        riskLevel: 'high',
        riskTitle: 'ریسک بالا (≥ ۲ عامل خطر غیرجنسی)',
        summary: 'اندیکاسیون قطعی برای شروع آنتی‌کوآگولانت خوراکی.',
        diagnosisAndTreatment: [
          'شروع DOAC (ارجح در AF غیر دریچه‌ای) یا وارفارین (الزامی در دریچه مکانیکی یا تنگی میترال متوسط/شدید).',
          'چک عملکرد کلیه (CrCl) و شمارش خون قبل از تجویز و محاسبه HAS-BLED.',
        ],
        clinicalNotes: ['در AF با مدت بیش از ۴۸ ساعت یا نامعلوم، کاردیوورژن بدون ۳ هفته ضدانعقاد یا TEE مجاز نیست.'],
      };
    },
  },
  {
    id: 'has-bled',
    titleFa: 'اسکور HAS-BLED (خطر خونریزی)',
    titleEn: 'HAS-BLED Score for Major Bleeding Risk',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: "Rosen's Emergency Medicine · Pisters R et al.",
    criteria: [
      { id: 'htn', label: 'فشار خون سیستولیک کنترل‌نشده (> 160 mmHg)', type: 'boolean', points: 1 },
      { id: 'renal', label: 'اختلال عملکرد کلیوی (دیالیز، پیوند یا Cr > 2.26)', type: 'boolean', points: 1 },
      { id: 'liver', label: 'اختلال کبدی (سیروز یا بیلی‌روبین > 2x و آنزیم > 3x)', type: 'boolean', points: 1 },
      { id: 'stroke', label: 'سابقه سکته مغزی قبلی', type: 'boolean', points: 1 },
      { id: 'bleed', label: 'سابقه خونریزی عمده یا استعداد خونریزی', type: 'boolean', points: 1 },
      { id: 'inr', label: 'INR ناپایدار (TTR < 60%)', type: 'boolean', points: 1 },
      { id: 'elderly', label: 'سن بالای ۶۵ سال', type: 'boolean', points: 1 },
      { id: 'drugs', label: 'مصرف هم‌زمان ضدپلاکت یا NSAIDs', type: 'boolean', points: 1 },
      { id: 'alcohol', label: 'مصرف الکل (≥ ۸ واحد در هفته)', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 2) {
        return {
          score,
          maxScore: 9,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین تا متوسط خونریزی',
          summary: 'منعی برای شروع یا ادامه آنتی‌کوآگولانت در صورت اندیکاسیون وجود ندارد.',
          diagnosisAndTreatment: ['شروع یا ادامه آنتی‌کوآگولانت همراه با پایش دوره‌ای CBC و عملکرد کلیه.'],
          clinicalNotes: ['HAS-BLED برای اصلاح ریسک‌فاکتورهای خونریزی است نه قطع خودسرانه درمان.'],
        };
      }
      return {
        score,
        maxScore: 9,
        riskLevel: 'high',
        riskTitle: 'ریسک بالای خونریزی (≥ 3)',
        summary: 'نیازمند اصلاح سریع عوامل خطر قابل برگشت و پیگیری دقیق‌تر است.',
        diagnosisAndTreatment: [
          'کنترل فشار خون، قطع NSAIDها/ضدپلاکت‌های غیرضروری و تجویز PPI در خطر گوارشی.',
          'ترجیح DOAC بر وارفارین در INR ناپایدار.',
        ],
        clinicalNotes: ['امتیاز ≥ ۳ به‌تنهایی سبب قطع OAC در بیماران با خطر بالای استروک نمی‌شود.'],
      };
    },
  },
  {
    id: 'san-francisco-syncope',
    titleFa: 'قانون سنکوپ سانفرانسیسکو (SFSR)',
    titleEn: 'San Francisco Syncope Rule',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: "Rosen's Emergency Medicine · Quinn JV et al.",
    criteria: [
      { id: 'chf', label: 'سابقه نارسایی احتقانی قلب (CHF)', type: 'boolean', points: 1 },
      { id: 'hct', label: 'هماتوکریت کمتر از ۳۰٪ (یا Hb حدود < ۱۰)', type: 'boolean', points: 1 },
      { id: 'ecg', label: 'نوار قلب غیرنرمال (ریتم غیرسینوسی یا تغییر جدید ECG)', type: 'boolean', points: 1 },
      { id: 'sob', label: 'شکایت از تنگی نفس (Shortness of breath)', type: 'boolean', points: 1 },
      { id: 'sbp', label: 'فشار خون سیستولیک در تریاژ < ۹۰ mmHg', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'low',
          riskTitle: 'SFSR منفی (ریسک پایین رویداد جدی ۷ روزه)',
          summary: 'احتمال پیامد جدی کوتاه‌مدت در نبود علل آشکار دیگر پایین است.',
          diagnosisAndTreatment: [
            'در صورت نرمال بودن معاینه و مانیتورینگ کوتاه اورژانس، کاندید ترخیص با پیگیری سرپایی.',
            'آموزش علائم هشدار (تپش قلب، درد قفسه سینه، عود سنکوپ).',
          ],
          clinicalNotes: ['قانون SFSR برای بیمارانی است که علت واضحی در معاینه اولیه اورژانس نیافته‌اند.'],
        };
      }
      return {
        score,
        maxScore: 5,
        riskLevel: 'high',
        riskTitle: 'SFSR مثبت (≥ ۱ عامل خطر)',
        summary: 'ریسک بالای رویداد جدی قلبی/خونریزی یا مرگ طی ۷ تا ۳۰ روز.',
        diagnosisAndTreatment: [
          'بستری یا نگهداری تحت‌نظر همراه با تله‌متری مداوم قلبی.',
          'اکوکاردیوگرافی، بررسی منبع خونریزی (در Hct < 30%)، تروپونین و بررسی آمبولی ریه در تنگی نفس.',
        ],
        clinicalNotes: ['وجود هر یک از ۵ حرف مخفف CHESS بیمار را در گروه نیازمند بررسی بستری قرار می‌دهد.'],
      };
    },
  },
  {
    id: 'canadian-syncope',
    titleFa: 'اسکور ریسک سنکوپ کانادایی (CSRS)',
    titleEn: 'Canadian Syncope Risk Score',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: "Rosen's Emergency Medicine · Thiruganasambandamoorthy V et al.",
    criteria: [
      { id: 'vasovagal', label: 'استعداد به سنکوپ وازوواگال (محرک گرم/ایستادن/ترس/درد با پرودروم اتونوم)', type: 'boolean', points: -1 },
      { id: 'heartDis', label: 'سابقه بیماری قلبی (CAD، AF، نارسایی یا دریچه‌ای)', type: 'boolean', points: 1 },
      { id: 'bpAbn', label: 'SBP < 90 یا > 180 mmHg در هر زمان در اورژانس', type: 'boolean', points: 2 },
      { id: 'trop', label: 'افزایش تروپونین بالای صدک ۹۹', type: 'boolean', points: 2 },
      { id: 'qrsAxis', label: 'محور QRS غیرطبیعی (< -30° یا > +100°)', type: 'boolean', points: 1 },
      { id: 'qrs130', label: 'طولانی شدن QRS بیش از ۱۳۰ میلی‌ثانیه', type: 'boolean', points: 1 },
      { id: 'qtc480', label: 'طولانی شدن QTc بیش از ۴۸۰ میلی‌ثانیه', type: 'boolean', points: 2 },
      {
        id: 'edDiag',
        label: 'تشخیص احتمالی پزشک اورژانس در ترخیص',
        type: 'select',
        options: [
          { label: 'سنکوپ نامشخص یا سایر علل (۰ امتیاز)', points: 0 },
          { label: 'سنکوپ وازوواگال محتمل (-۲ امتیاز)', points: -2 },
          { label: 'سنکوپ قلبی محتمل (+۲ امتیاز)', points: 2 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 0) {
        return {
          score,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین یا بسیار پایین (رویداد جدی ۳۰ روزه < 2%)',
          summary: 'بیمار با اطمینان بالا کاندید ترخیص و پیگیری سرپایی است.',
          diagnosisAndTreatment: ['اطمینان‌بخشی در سنکوپ وازوواگال، توصیه به هیدراتاسیون و پرهیز از محرک‌ها.'],
          clinicalNotes: ['در امتیاز ≤ ۰ نیاز به مانیتورینگ طولانی‌مدت در بخش نیست.'],
        };
      }
      if (score <= 3) {
        return {
          score,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط (رویداد جدی ۳۰ روزه ~8%)',
          summary: 'نیازمند ارزیابی دقیق‌تر قلبی و مانیتورینگ قبل از تصمیم ترخیص.',
          diagnosisAndTreatment: [
            'تله‌متری ریتم حداقل ۶ ساعت در اورژانس، اکوکاردیوگرافی و بررسی هولتر مانیتورینگ سرپایی.',
            'تصمیم بستری بر اساس دسترسی به پیگیری سریع قلب.',
          ],
          clinicalNotes: ['به QTc و تروپونین توجه ویژه شود.'],
        };
      }
      return {
        score,
        riskLevel: 'high',
        riskTitle: 'ریسک بالا تا بسیار بالا (رویداد جدی ۳۰ روزه > 20–50%)',
        summary: 'خطر قابل توجه آریتمی بطنی، بلوک کامل یا مرگ ناگهانی.',
        diagnosisAndTreatment: [
          'بستری فوری تحت مانیتورینگ قلبی مداوم (CCU/تله‌متری) و مشاوره قلب/الکتروفیزیولوژی.',
          'تکرار ECG، اکوکاردیوگرافی و اصلاح اختلالات الکترولیتی (K، Mg).',
        ],
        clinicalNotes: ['اسکور CSRS معتبرترین ابزار طبقه‌بندی سنکوپ ۳۰ روزه در طب اورژانس روزن است.'],
      };
    },
  },
  {
    id: 'add-rs',
    titleFa: 'اسکور تشخیصی دیسکسیون آئورت (ADD-RS)',
    titleEn: 'Aortic Dissection Detection Risk Score (ADD-RS)',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: "Rosen's Emergency Medicine · Rogers AM / ADvISED Trial",
    criteria: [
      { id: 'highCond', label: 'شرط پرخطر: سندرم مارفان، بیماری دریچه آئورت، آنوریسم توراسیک، دستکاری اخیر آئورت یا سابقه فامیلی', type: 'boolean', points: 1 },
      { id: 'painFeat', label: 'ویژگی درد پرخطر: درد سینه/پشت/شکم ناگهانی با حداکثر شدت از ابتدا و ماهیت پاره/دریده‌شونده', type: 'boolean', points: 1 },
      { id: 'examFeat', label: 'یافته معاینه پرخطر: اختلاف نبض یا SBP > 20mmHg بین دو دست، نقص عصبی کانونی یا سوفل جدید رگورژیتاسیون آئورت / شوک', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 3,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین دیسکسیون (ADD-RS = 0)',
          summary: 'در همراهی با D-dimer < 500 ng/mL، دیسکسیون حاد آئورت با دقت بسیار بالا رد می‌شود.',
          diagnosisAndTreatment: [
            'اگر شک بالینی همچنان وجود دارد درخواست D-dimer؛ در صورت منفی بودن نیاز به CTA آئورت نیست.',
            'بررسی علل دیگر درد قفسه سینه.',
          ],
          clinicalNotes: ['مداخله با D-dimer فقط زمانی امن است که هیچ‌یک از ۳ دسته ریسک وجود نداشته باشد.'],
        };
      }
      if (score === 1) {
        return {
          score,
          maxScore: 3,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط دیسکسیون (ADD-RS = 1)',
          summary: 'نیازمند ارزیابی دقیق؛ در پروتکل ADvISED با D-dimer منفی می‌توان ریسک را کاهش داد ولی در شک قوی CTA ارجح است.',
          diagnosisAndTreatment: [
            'درخواست CTA آئورت کل توراسیک و شکمی (یا D-dimer طبق پروتکل در صورت شک پایین؛ اگر D-dimer مثبت شد حتماً CTA).',
            'کنترل ضربان قلب (< 60 bpm) و فشار خون سیستولیک (100–120 mmHg) در صورت بالا بودن شک بالینی.',
          ],
          clinicalNotes: ['گرافی سینه نرمال به‌هیچ‌وجه دیسکسیون آئورت را رد نمی‌کند.'],
        };
      }
      return {
        score,
        maxScore: 3,
        riskLevel: 'critical',
        riskTitle: 'ریسک بالای دیسکسیون آئورت (ADD-RS ≥ 2)',
        summary: 'اورژانس حیاتی عروقی؛ CTA فوری آئورت بدون اتلاف وقت برای D-dimer.',
        diagnosisAndTreatment: [
          'انجام فوری CTA آئورت (یا اکو مری TEE در بیمار ناپایدار) بدون انتظار برای D-dimer.',
          'شروع فوری بتابلاکر وریدی (اسمولول یا لابتالول) برای رساندن HR < 60 و سپس نیکاردیپین/نیتروپروساید برای SBP 100–120 mmHg.',
          'مشاوره اورژانسی جراحی قلب و عروق (در دیسکسیون نوع A جراحی فوری و در نوع B درمان دارویی شدید/TEVAR).',
        ],
        clinicalNotes: ['همیشه ابتدا ضربان قلب را با بتابلاکر کاهش دهید و بعد وازودیلاتور اضافه کنید تا تاکیکاردی رفلکسی تشدید نشود.'],
      };
    },
  },
  {
    id: 'wells-pe',
    titleFa: 'اسکور Wells (آمبولی ریه - PE)',
    titleEn: "Wells' Criteria for Pulmonary Embolism",
    category: 'pulmonary',
    categoryLabel: 'ریه و آمبولی',
    reference: "Rosen's Emergency Medicine · Wells PS et al.",
    criteria: [
      { id: 'dvtSigns', label: 'علائم بالینی DVT (تورم و تندرنس وریدهای عمقی)', type: 'boolean', points: 3 },
      { id: 'peLikely', label: 'PE محتمل‌ترین تشخیص (تشخیص دیگر محتمل‌تر نیست)', type: 'boolean', points: 3 },
      { id: 'hr100', label: 'ضربان قلب > ۱۰۰ در دقیقه', type: 'boolean', points: 1.5 },
      { id: 'immob', label: 'بی‌حرکتی ≥ ۳ روز یا جراحی در ۴ هفته اخیر', type: 'boolean', points: 1.5 },
      { id: 'prevVte', label: 'سابقه قبلی DVT یا PE', type: 'boolean', points: 1.5 },
      { id: 'hemoptysis', label: 'هموپتیزی', type: 'boolean', points: 1 },
      { id: 'cancer', label: 'بدخیمی فعال', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 4) {
        return {
          score,
          maxScore: 12.5,
          riskLevel: score < 2 ? 'low' : 'moderate',
          riskTitle: 'PE بعید است / Unlikely (≤ 4)',
          summary: 'ابتدا با معیار PERC (اگر زیر ۲ باشد) یا D-dimer ارزیابی می‌شود.',
          diagnosisAndTreatment: [
            score < 2
              ? 'در صورت منفی بودن هر ۸ معیار PERC، نیاز به D-dimer نیست؛ در غیر این صورت D-dimer (تعدیل‌شده با سن).'
              : 'درخواست D-dimer (آستانه تعدیل‌شده با سن: سن × ۱۰ در بالای ۵۰ سال).',
            'اگر D-dimer منفی باشد PE رد می‌شود؛ اگر مثبت باشد انجام CTPA.',
          ],
          clinicalNotes: ['در بارداری یا نارسایی کلیه پیش از CTPA می‌توان سونوگرافی داپلر اندام تحتانی انجام داد.'],
        };
      }
      return {
        score,
        maxScore: 12.5,
        riskLevel: 'high',
        riskTitle: 'PE محتمل است / Likely (> 4)',
        summary: 'D-dimer کافی نیست؛ تصویربرداری فوری ریوی ضروری است.',
        diagnosisAndTreatment: [
          'انجام مستقیم CTPA (یا اسکن V/Q در منع مصرف کنتراست).',
          'شروع تجربی آنتی‌کوآگولانت در صورت تاخیر تصویربرداری و نبود منع خونریزی.',
        ],
        clinicalNotes: ['در ناپایداری همودینامیک، اکوی کنار تخت برای ارزیابی بطن راست بسیار کمک‌کننده است.'],
      };
    },
  },
  {
    id: 'revised-geneva',
    titleFa: 'اسکور ژنو بازبینی‌شده (آمبولی ریه)',
    titleEn: 'Revised Geneva Score for Pulmonary Embolism',
    category: 'pulmonary',
    categoryLabel: 'ریه و آمبولی',
    reference: "Rosen's Emergency Medicine · Le Gal G et al.",
    criteria: [
      { id: 'age65', label: 'سن بالای ۶۵ سال', type: 'boolean', points: 1 },
      { id: 'prevVte', label: 'سابقه قبلی DVT یا PE', type: 'boolean', points: 3 },
      { id: 'surgFrac', label: 'جراحی تحت بیهوشی یا شکستگی اندام تحتانی در ۱ ماه اخیر', type: 'boolean', points: 2 },
      { id: 'cancer', label: 'بدخیمی فعال (یا بهبودیافته < ۱ سال)', type: 'boolean', points: 2 },
      { id: 'legPain', label: 'درد یک‌طرفه اندام تحتانی', type: 'boolean', points: 3 },
      { id: 'hemoptysis', label: 'هموپتیزی', type: 'boolean', points: 2 },
      {
        id: 'hr',
        label: 'ضربان قلب (HR)',
        type: 'select',
        options: [
          { label: 'کمتر از ۷۵ در دقیقه', points: 0 },
          { label: '۷۵ تا ۹۴ در دقیقه', points: 3 },
          { label: '۹۵ در دقیقه یا بالاتر', points: 5 },
        ],
      },
      { id: 'dvtExam', label: 'درد در لمس عمقی وریدهای ساق پا و ادم یک‌طرفه', type: 'boolean', points: 4 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 3) {
        return {
          score,
          maxScore: 22,
          riskLevel: 'low',
          riskTitle: 'احتمال بالینی پایین (0–3 · شیوع PE ~8%)',
          summary: 'ارزیابی با D-dimer یا PERC در نبود عوامل خطر.',
          diagnosisAndTreatment: ['انجام D-dimer؛ در صورت منفی بودن PE رد می‌شود و در صورت مثبت بودن CTPA.'],
          clinicalNotes: ['مزیت اسکور ژنو تماماً عینی بودن آن و عدم وابستگی به قضاوت ذهنی است.'],
        };
      }
      if (score <= 10) {
        return {
          score,
          maxScore: 22,
          riskLevel: 'moderate',
          riskTitle: 'احتمال بالینی متوسط (4–10 · شیوع PE ~28%)',
          summary: 'نیازمند آزمایش D-dimer با حساسیت بالا.',
          diagnosisAndTreatment: [
            'درخواست D-dimer؛ اگر منفی شد PE رد می‌شود و اگر مثبت شد انجام CTPA.',
          ],
          clinicalNotes: ['آستانه تعدیل‌شده با سن (سن × ۱۰) از CTPAهای غیرضروری در سالمندان می‌کاهد.'],
        };
      }
      return {
        score,
        maxScore: 22,
        riskLevel: 'high',
        riskTitle: 'احتمال بالینی بالا (≥ 11 · شیوع PE ~74%)',
        summary: 'انجام مستقیم CTPA بدون اتلاف وقت با D-dimer.',
        diagnosisAndTreatment: [
          'درخواست فوری CTPA و شروع آنتی‌کوآگولانت در صورت تاخیر و نبود کنترااندیکاسیون.',
        ],
        clinicalNotes: ['D-dimer منفی در احتمال بالای ژنو به‌تنهایی PE را رد نمی‌کند.'],
      };
    },
  },
  {
    id: 'perc-rule',
    titleFa: 'قانون PERC (رد آمبولی ریه)',
    titleEn: 'PERC Rule for Pulmonary Embolism',
    category: 'pulmonary',
    categoryLabel: 'ریه و آمبولی',
    reference: "Rosen's Emergency Medicine · Kline JA et al.",
    criteria: [
      { id: 'age50', label: 'سن ۵۰ سال یا بالاتر', type: 'boolean', points: 1 },
      { id: 'hr100', label: 'ضربان قلب ≥ ۱۰۰ در دقیقه', type: 'boolean', points: 1 },
      { id: 'spo2', label: 'SpO2 کمتر از ۹۵٪ در هوای اتاق', type: 'boolean', points: 1 },
      { id: 'leg', label: 'تورم یک‌طرفه پا', type: 'boolean', points: 1 },
      { id: 'hemoptysis', label: 'هموپتیزی', type: 'boolean', points: 1 },
      { id: 'surgery', label: 'جراحی یا ترومای اخیر (< ۴ هفته)', type: 'boolean', points: 1 },
      { id: 'priorVte', label: 'سابقه قبلی DVT یا PE', type: 'boolean', points: 1 },
      { id: 'hormone', label: 'مصرف استروژن / OCP / HRT', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 8,
          riskLevel: 'low',
          riskTitle: 'PERC منفی (۰ معیار مثبت)',
          summary: 'در پیش‌آزمون پایین (<۱۵٪)، احتمال PE کمتر از ۲٪ بوده و رد می‌شود.',
          diagnosisAndTreatment: ['نیازی به D-dimer یا CTPA برای آمبولی ریه نیست.'],
          clinicalNotes: ['فقط در بیمارانی کاربرد دارد که پزشک پیش‌آزمون بالینی را پایین ارزیابی کرده باشد.'],
        };
      }
      return {
        score,
        maxScore: 8,
        riskLevel: 'moderate',
        riskTitle: 'PERC مثبت (≥ ۱ معیار)',
        summary: 'رد بالینی بدون آزمایش ممکن نیست.',
        diagnosisAndTreatment: ['انجام D-dimer (یا CTPA در امتیاز بالای Wells).'],
        clinicalNotes: ['مثبت بودن PERC فقط به معنای نیاز به آزمایش بیشتر است، نه تشخیص قطعی PE.'],
      };
    },
  },
  {
    id: 'years-pe',
    titleFa: 'الگوریتم YEARS (آمبولی ریه)',
    titleEn: 'YEARS Algorithm for Pulmonary Embolism',
    category: 'pulmonary',
    categoryLabel: 'ریه و آمبولی',
    reference: "Rosen's Emergency Medicine · van der Hulle T et al. Lancet",
    criteria: [
      { id: 'dvt', label: 'علائم بالینی DVT', type: 'boolean', points: 1 },
      { id: 'hemoptysis', label: 'هموپتیزی', type: 'boolean', points: 1 },
      { id: 'peLikely', label: 'PE محتمل‌ترین تشخیص بالینی است', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 3,
          riskLevel: 'low',
          riskTitle: '۰ معیار YEARS (آستانه D-dimer برابر 1000 ng/mL)',
          summary: 'می‌توان با حد برش بالاتر D-dimer (< 1000 ng/mL) آمبولی ریه را رد کرد.',
          diagnosisAndTreatment: [
            'اگر D-dimer < 1000 ng/mL باشد: PE با اطمینان رد می‌شود و نیاز به CTPA نیست.',
            'اگر D-dimer ≥ 1000 ng/mL باشد: انجام CTPA.',
          ],
          clinicalNotes: ['در مطالعه YEARS و بارداری (ARTEMIS)، این الگوریتم نیاز به CTPA را تا ۱۴–۳۹٪ کاهش داده است.'],
        };
      }
      return {
        score,
        maxScore: 3,
        riskLevel: 'high',
        riskTitle: '≥ ۱ معیار YEARS (آستانه D-dimer برابر 500 ng/mL)',
        summary: 'حد برش استاندارد D-dimer (< 500 ng/mL) اعمال می‌شود.',
        diagnosisAndTreatment: [
          'اگر D-dimer < 500 ng/mL باشد: PE رد می‌شود.',
          'اگر D-dimer ≥ 500 ng/mL باشد: انجام CTPA (و در بارداری با علائم DVT ابتدا سونو داپلر اندام).',
        ],
        clinicalNotes: ['در بیمار ناپایدار همودینامیک، مستقیم تصویربرداری یا اکوی بستر انجام شود.'],
      };
    },
  },
  {
    id: 'wells-dvt',
    titleFa: 'اسکور Wells (ترومبوز ورید عمقی - DVT)',
    titleEn: "Wells' Criteria for Deep Vein Thrombosis",
    category: 'pulmonary',
    categoryLabel: 'ریه و آمبولی',
    reference: "Rosen's Emergency Medicine · Wells PS et al.",
    criteria: [
      { id: 'cancer', label: 'بدخیمی فعال', type: 'boolean', points: 1 },
      { id: 'paralysis', label: 'فلج، پارزی یا گچ‌گیری اخیر اندام تحتانی', type: 'boolean', points: 1 },
      { id: 'bedridden', label: 'بستری > ۳ روز یا جراحی ماژور در ۱۲ هفته اخیر', type: 'boolean', points: 1 },
      { id: 'tenderness', label: 'تندرنس در مسیر وریدهای عمقی', type: 'boolean', points: 1 },
      { id: 'entireLeg', label: 'تورم کل اندام تحتانی', type: 'boolean', points: 1 },
      { id: 'calf3cm', label: 'تورم ساق > ۳ سانتی‌متر نسبت به سمت مقابل', type: 'boolean', points: 1 },
      { id: 'pitting', label: 'ادم گوده‌گذار محدود به پای درگیر', type: 'boolean', points: 1 },
      { id: 'collateral', label: 'وریدهای سطحی کولترال', type: 'boolean', points: 1 },
      { id: 'prevDvt', label: 'سابقه قبلی DVT', type: 'boolean', points: 1 },
      { id: 'altDiag', label: 'تشخیص جایگزین به همان اندازه یا بیشتر محتمل است (۲-)', type: 'boolean', points: -2 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score < 2) {
        return {
          score,
          maxScore: 9,
          riskLevel: score <= 0 ? 'low' : 'moderate',
          riskTitle: 'DVT بعید است / Unlikely (< 2)',
          summary: 'ابتدا با آزمایش D-dimer بررسی می‌شود.',
          diagnosisAndTreatment: [
            'اگر D-dimer منفی باشد DVT رد می‌شود؛ اگر مثبت باشد انجام سونوگرافی داپلر فشاری.',
          ],
          clinicalNotes: ['کسر ۲ امتیاز در تشخیص جایگزین واضح از سونوگرافی‌های غیرضروری می‌کاهد.'],
        };
      }
      return {
        score,
        maxScore: 9,
        riskLevel: 'high',
        riskTitle: 'DVT محتمل است / Likely (≥ 2)',
        summary: 'انجام مستقیم سونوگرافی داپلر وریدی ضروری است.',
        diagnosisAndTreatment: [
          'سونوگرافی داپلر فشاری اندام تحتانی و در صورت تایید شروع آنتی‌کوآگولانت.',
          'در سونوگرافی منفی ولی D-dimer مثبت، تکرار سونوگرافی ۵ تا ۷ روز بعد.',
        ],
        clinicalNotes: ['در تاخیر سونوگرافی و نبود منع خونریزی، دوز اول آنتی‌کوآگولانت تجویز شود.'],
      };
    },
  },
  {
    id: 'spesi',
    titleFa: 'اسکور sPESI (شدت آمبولی ریه)',
    titleEn: 'Simplified Pulmonary Embolism Severity Index',
    category: 'pulmonary',
    categoryLabel: 'ریه و آمبولی',
    reference: "Rosen's Emergency Medicine · Jiménez D et al.",
    criteria: [
      { id: 'age80', label: 'سن بالای ۸۰ سال', type: 'boolean', points: 1 },
      { id: 'cancer', label: 'سابقه سرطان', type: 'boolean', points: 1 },
      { id: 'cardiopulm', label: 'نارسایی قلبی یا بیماری مزمن ریوی', type: 'boolean', points: 1 },
      { id: 'hr110', label: 'ضربان قلب ≥ ۱۱۰ در دقیقه', type: 'boolean', points: 1 },
      { id: 'sbp100', label: 'فشار خون سیستولیک < ۱۰۰ mmHg', type: 'boolean', points: 1 },
      { id: 'spo2', label: 'SpO2 کمتر از ۹۰٪', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 6,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین (مرگ‌ومیر ۳۰ روزه ~1%)',
          summary: 'در نبود اختلال بطن راست، کاندید درمان سرپایی یا ترخیص زودهنگام.',
          diagnosisAndTreatment: ['شروع DOAC خوراکی در صورت نرمال بودن RV و تروپونین و امکان پیگیری مطمئن.'],
          clinicalNotes: ['وجود استرین بطن راست در اکو یا CT با وجود sPESI=0 بستری کوتاه‌مدت را توجیه می‌کند.'],
        };
      }
      return {
        score,
        maxScore: 6,
        riskLevel: 'high',
        riskTitle: 'ریسک بالا (مرگ‌ومیر ۳۰ روزه ~10.9%)',
        summary: 'نیازمند بستری و ارزیابی بطن راست.',
        diagnosisAndTreatment: [
          'بستری، شروع فوری هپارین/انوکساپارین، تروپونین/BNP و اکوکاردیوگرافی.',
          'در حضور شوک: بررسی ترومبولیز سیستمیک یا ترومبکتومی.',
        ],
        clinicalNotes: ['امتیاز ≥ ۱ ترخیص مستقیم از اورژانس را منتفی می‌کند.'],
      };
    },
  },
  {
    id: 'curb-65',
    titleFa: 'اسکور CURB-65 (شدت پنومونی)',
    titleEn: 'CURB-65 Score for Pneumonia Severity',
    category: 'pulmonary',
    categoryLabel: 'ریه و آمبولی',
    reference: "Rosen's Emergency Medicine · Lim WS et al.",
    criteria: [
      { id: 'confusion', label: 'گیجی یا کاهش سطح هوشیاری جدید', type: 'boolean', points: 1 },
      { id: 'bun', label: 'BUN > 19 mg/dL (یا Urea > 7 mmol/L)', type: 'boolean', points: 1 },
      { id: 'rr30', label: 'تعداد تنفس ≥ ۳۰ در دقیقه', type: 'boolean', points: 1 },
      { id: 'bp', label: 'SBP < 90 یا DBP ≤ 60 mmHg', type: 'boolean', points: 1 },
      { id: 'age65', label: 'سن ۶۵ سال یا بالاتر', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 1) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین (مرگ‌ومیر ~0.7–2.1%)',
          summary: 'معمولاً کاندید درمان سرپایی.',
          diagnosisAndTreatment: ['آنتی‌بیوتیک خوراکی مناسب CAP و پیگیری ۴۸ ساعته.'],
          clinicalNotes: ['در صورت هیپوکسمی یا عدم تحمل خوراکی، بستری لازم است.'],
        };
      }
      if (score === 2) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط (مرگ‌ومیر ~9.2%)',
          summary: 'بستری در بخش عمومی توصیه می‌شود.',
          diagnosisAndTreatment: ['بستری در بخش، آنتی‌بیوتیک وریدی (بتالاکتام + ماکرولید یا فلوروکینولون تنفسی) و اکسیژن درمانی.'],
          clinicalNotes: ['پایش دقیق علائم حیاتی در ۴۸ ساعت اول.'],
        };
      }
      return {
        score,
        maxScore: 5,
        riskLevel: score >= 4 ? 'critical' : 'high',
        riskTitle: score >= 4 ? 'ریسک بحرانی (مرگ‌ومیر ~40%)' : 'ریسک بالا (مرگ‌ومیر ~14.5%)',
        summary: 'پنومونی شدید؛ بستری فوری و بررسی نیاز به ICU.',
        diagnosisAndTreatment: [
          'بستری فوری و مشاوره ICU (به‌ویژه در امتیاز ۴–۵)، آنتی‌بیوتیک IV وسیع‌الطیف و کشت خون/لاکتات.',
        ],
        clinicalNotes: ['برای تصمیم پذیرش ICU، معیارهای جزئی/عمده IDSA/ATS یا SMART-COP نیز کمک‌کننده است.'],
      };
    },
  },
  {
    id: 'smart-cop',
    titleFa: 'اسکور SMART-COP (نیاز به ICU در پنومونی)',
    titleEn: 'SMART-COP Score for Pneumonia ICU Need',
    category: 'pulmonary',
    categoryLabel: 'ریه و آمبولی',
    reference: "Rosen's Emergency Medicine · Charles PG et al.",
    criteria: [
      { id: 'sbp', label: 'فشار خون سیستولیک < ۹۰ mmHg', type: 'boolean', points: 2 },
      { id: 'multiLobe', label: 'درگیری چندلوبه در CXR', type: 'boolean', points: 1 },
      { id: 'albumin', label: 'آلبومین سرم < ۳.۵ g/dL', type: 'boolean', points: 1 },
      { id: 'rr', label: 'تعداد تنفس بالا (≤ ۵۰ سال: ≥۲۵ | > ۵۰ سال: ≥۳۰)', type: 'boolean', points: 1 },
      { id: 'hr', label: 'تاکیکاردی (ضربان قلب ≥ ۱۲۵ در دقیقه)', type: 'boolean', points: 1 },
      { id: 'confusion', label: 'گیجی جدید (Confusion)', type: 'boolean', points: 1 },
      { id: 'oxygen', label: 'اکسیژناسیون پایین (≤۵۰ سال: PaO2<70 یا SpO2≤93% | >۵۰ سال: PaO2<60 یا SpO2≤90%)', type: 'boolean', points: 2 },
      { id: 'ph', label: 'pH شریانی کمتر از ۷.۳۵', type: 'boolean', points: 2 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 2) {
        return {
          score,
          maxScore: 11,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین نیاز به حمایت تنفسی/وازوپرسور',
          summary: 'احتمال نیاز به تهویه مکانیکی یا وازوپرسور پایین است.',
          diagnosisAndTreatment: ['درمان استاندارد در بخش یا سرپایی بر اساس سایر معیارهای بالینی.'],
          clinicalNotes: ['SMART-COP حساسیت بسیار بالایی برای پیش‌بینی نیاز به ICU در بزرگسالان دارد.'],
        };
      }
      if (score <= 4) {
        return {
          score,
          maxScore: 11,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط (احتمال ~12.5% نیاز به ICU)',
          summary: 'نیازمند بستری و پایش نزدیک در بیمارستان.',
          diagnosisAndTreatment: ['بستری با پایش مداوم اکسیژناسیون، ABG و آنتی‌بیوتیک IV.'],
          clinicalNotes: ['در صورت افت SpO2 یا افزایش لاکتات سریعاً به ICU منتقل شود.'],
        };
      }
      return {
        score,
        maxScore: 11,
        riskLevel: score >= 7 ? 'critical' : 'high',
        riskTitle: score >= 7 ? 'ریسک بسیار بالا (> 50% نیاز به ICU)' : 'ریسک بالا (~33% نیاز به ICU)',
        summary: 'نیاز قوی به بستری در ICU و آمادگی برای حمایت تنفسی/همودینامیک.',
        diagnosisAndTreatment: [
          'مشاوره فوری ICU، شروع آنتی‌بیوتیک IV وسیع‌الطیف، حمایت اکسیژن/NIV یا انتوباسیون زودهنگام و احیای سپسیس.',
        ],
        clinicalNotes: ['این اسکور بر نیاز به IRVS (حمایت تهاجمی تنفسی یا وازوپرسور) تمرکز دارد.'],
      };
    },
  },
  {
    id: 'bap-65',
    titleFa: 'اسکور BAP-65 (تشدید حاد COPD)',
    titleEn: 'BAP-65 Score for Acute Exacerbation of COPD',
    category: 'pulmonary',
    categoryLabel: 'ریه و آمبولی',
    reference: "Rosen's Emergency Medicine · Shorr AF et al.",
    criteria: [
      { id: 'bun25', label: 'BUN ≥ ۲۵ mg/dL', type: 'boolean', points: 1 },
      { id: 'mental', label: 'اختلال هوشیاری (GCS < 14 یا دیس‌اورینتیشن)', type: 'boolean', points: 1 },
      { id: 'hr109', label: 'نبض > ۱۰۹ در دقیقه', type: 'boolean', points: 1 },
      { id: 'age65', label: 'سن > ۶۵ سال', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 1) {
        return {
          score,
          maxScore: 4,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین (مرگ‌ومیر ~1–2% · نیاز به انتوباسیون ~2%)',
          summary: 'پاسخ مطلوب به درمان استاندارد برونکودیلاتور و استروئید.',
          diagnosisAndTreatment: [
            'نبولایزر سالبوتامول + ایپراتروپیوم، کورتون سیستمیک (پردنیزولون ۴۰ mg) و اکسیژن هدفمند (SpO2 88–92%).',
            'ارزیابی پاسخ بالینی در اورژانس برای تصمیم ترخیص یا بستری بخش.',
          ],
          clinicalNotes: ['در COPD از اکسیژن با جریان بالا و غیرهدفمند به علت خطر هایپرکاپنه پرهیز کنید.'],
        };
      }
      if (score === 2) {
        return {
          score,
          maxScore: 4,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط (مرگ‌ومیر ~4–6% · انتوباسیون ~5–12%)',
          summary: 'توصیه به بستری، ABG و بررسی نیاز به BiPAP.',
          diagnosisAndTreatment: [
            'بستری در بخش، ارسال ABG/VBG، برونکودیلاتور منظم، استروئید سیستمیک و آنتی‌بیوتیک در افزایش خلط چرکی.',
            'شروع BiPAP در صورت اسیدوز تنفسی (pH < 7.35 و pCO2 > 45).',
          ],
          clinicalNotes: ['تاکیکاردی > ۱۰۹ یا BUN بالا نشانگر استرس فیزیولوژیک قابل توجه است.'],
        };
      }
      return {
        score,
        maxScore: 4,
        riskLevel: 'critical',
        riskTitle: 'ریسک بالا (مرگ‌ومیر ~14–26% · انتوباسیون ~20–50%)',
        summary: 'احتمال بالای نیاز به تهویه مکانیکی یا NIV فوری و بستری ICU.',
        diagnosisAndTreatment: [
          'پایش فوری در اتاق احیا/ICU، شروع BiPAP (در نبود کنترااندیکاسیون) یا انتوباسیون در کاهش هوشیاری/ناپایداری.',
          'درمان کامل تشدید COPD و جستجوی عوامل تشدیدکننده (پنومونی، PE، نارسایی قلبی).',
        ],
        clinicalNotes: ['تغییر وضعیت ذهنی اغلب نشانه هایپرکاپنی شدید (CO2 narcosis) است.'],
      };
    },
  },
];
