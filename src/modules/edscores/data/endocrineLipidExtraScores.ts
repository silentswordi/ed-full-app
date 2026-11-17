import { ClinicalScoreDefinition, getNum, hasNum, sumCriteria } from '../types';

const round1 = (n: number) => Math.round(n * 10) / 10;

const incompleteResult = (summary: string) => ({
  score: 0,
  isIncomplete: true,
  riskLevel: 'low' as const,
  riskTitle: 'مقادیر را وارد کنید',
  summary,
  diagnosisAndTreatment: [],
  clinicalNotes: [],
});

export const ENDOCRINE_LIPID_EXTRA_SCORES: ClinicalScoreDefinition[] = [
  // =========================================================================
  // 1. ADA Diagnostic Criteria for Diabetes & Prediabetes
  // =========================================================================
  {
    id: 'diabetes-ada-criteria',
    titleFa: 'معیارهای تشخیص دیابت و پره‌دیابت (ADA)',
    titleEn: 'ADA Criteria for Diabetes & Prediabetes',
    category: 'endocrine',
    categoryLabel: 'غدد و متابولیک',
    reference: 'ADA Standards of Care 2024 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'fbs', label: 'قند خون ناشتا (FBS — اختیاری)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 112', optional: true, defaultValue: 112 },
      { id: 'hba1c', label: 'هموگلوبین گلیکوزیله (HbA1c — اختیاری)', type: 'number', unit: '%', placeholder: 'مثلاً 6.0', optional: true, defaultValue: 6.0 },
      { id: 'ogtt', label: 'قند ۲ ساعته OGTT 75g (اختیاری)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 165', optional: true, defaultValue: 165 },
      { id: 'randomBg', label: 'قند خون تصادفی (Random BG — اختیاری)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 220', optional: true, defaultValue: 220 },
      { id: 'symptoms', label: 'علائم کلاسیک هیپرگلیسمی (پلی‌اوری، پلی‌دیپسی، کاهش وزن) یا بحران DKA/HHS', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const hasFbs = hasNum(values, 'fbs');
      const hasA1c = hasNum(values, 'hba1c');
      const hasOgtt = hasNum(values, 'ogtt');
      const hasRandom = hasNum(values, 'randomBg');

      if (!hasFbs && !hasA1c && !hasOgtt && !hasRandom) {
        return incompleteResult(
          'کافی است تنها یکی از مقادیر قند ناشتا، HbA1c، قند دو ساعته یا قند تصادفی را وارد کنید (نیازی به پر کردن همه باکس‌ها نیست).'
        );
      }

      const fbs = hasFbs ? getNum(values, 'fbs') : 0;
      const a1c = hasA1c ? getNum(values, 'hba1c') : 0;
      const ogtt = hasOgtt ? getNum(values, 'ogtt') : 0;
      const randomBg = hasRandom ? getNum(values, 'randomBg') : 0;
      const symptoms = Boolean(values.symptoms);

      const dmReasons: string[] = [];
      const preReasons: string[] = [];
      const normalReasons: string[] = [];
      let randomSuspect = false;
      let randomBorderline = false;

      if (hasFbs) {
        if (fbs >= 126) dmReasons.push(`FBS = ${fbs} mg/dL (≥ 126: محدوده دیابت)`);
        else if (fbs >= 100) preReasons.push(`FBS = ${fbs} mg/dL (100–125: IFG / پره‌دیابت)`);
        else normalReasons.push(`FBS = ${fbs} mg/dL (< 100: نرمال)`);
      }

      if (hasA1c) {
        if (a1c >= 6.5) dmReasons.push(`HbA1c = ${a1c}% (≥ 6.5%: محدوده دیابت)`);
        else if (a1c >= 5.7) preReasons.push(`HbA1c = ${a1c}% (5.7–6.4%: پره‌دیابت)`);
        else normalReasons.push(`HbA1c = ${a1c}% (< 5.7%: نرمال)`);
      }

      if (hasOgtt) {
        if (ogtt >= 200) dmReasons.push(`2h-OGTT = ${ogtt} mg/dL (≥ 200: محدوده دیابت)`);
        else if (ogtt >= 140) preReasons.push(`2h-OGTT = ${ogtt} mg/dL (140–199: IGT / پره‌دیابت)`);
        else normalReasons.push(`2h-OGTT = ${ogtt} mg/dL (< 140: نرمال)`);
      }

      if (hasRandom) {
        if (randomBg >= 200 && symptoms) {
          dmReasons.push(`Random BG = ${randomBg} mg/dL (≥ 200) + علائم کلاسیک`);
        } else if (randomBg >= 200) {
          randomSuspect = true;
          dmReasons.push(`Random BG = ${randomBg} mg/dL (≥ 200؛ بسیار مشکوک به دیابت)`);
        } else if (randomBg >= 140) {
          randomBorderline = true;
          preReasons.push(`Random BG = ${randomBg} mg/dL (140–199؛ قند تصادفی مرزی)`);
        } else {
          normalReasons.push(`Random BG = ${randomBg} mg/dL (< 140: نرمال)`);
        }
      }

      const enteredCount = [hasFbs, hasA1c, hasOgtt, hasRandom].filter(Boolean).length;

      // 1) Diabetes range
      if (dmReasons.length > 0) {
        const definiteMulti =
          dmReasons.filter((r) => !r.includes('بسیار مشکوک')).length >= 2 ||
          (hasRandom && randomBg >= 200 && symptoms);

        const urgentHyper =
          (hasRandom && randomBg >= 250) ||
          (hasFbs && fbs >= 250) ||
          (hasA1c && a1c >= 9.5);

        return {
          score: dmReasons.length,
          unit: 'معیار دیابت',
          riskLevel: urgentHyper ? 'high' : 'moderate',
          riskTitle: definiteMulti
            ? 'تشخیص قطعی دیابت شیرین (Diabetes Mellitus)'
            : randomSuspect && dmReasons.length === 1
            ? 'قند تصادفی ≥ ۲۰۰ mg/dL — بسیار مشکوک به دیابت'
            : 'در محدوده تشخیصی دیابت (نیازمند تأیید با تست دوم)',
          summary: [...dmReasons, ...preReasons, ...normalReasons].join(' | '),
          diagnosisAndTreatment: [
            definiteMulti
              ? 'تشخیص دیابت قطعی است (وجود علائم کلاسیک با قند ≥ ۲۰۰، یا مثبت شدن همزمان ≥ ۲ معیار تشخیصی).'
              : randomSuspect && dmReasons.length === 1
              ? 'از بیمار درباره علائم کلاسیک (پلی‌اوری، پلی‌دیپسی، کاهش وزن) بپرسید؛ در صورت وجود علائم تشخیص قطعی است و در نبود علائم، FBS یا HbA1c ناشتا چک کنید.'
              : 'برای قطعی شدن تشخیص در فرد بی‌علامت با تنها یک تست مختل، تکرار همان تست یا انجام تست دوم (FBS یا HbA1c) در نوبت بعد لازم است.',
            urgentHyper
              ? 'با توجه به قند بالا، در اورژانس کتون، الکترولیت‌ها و VBG برای رد DKA/HHS و نیاز به انسولین بررسی شود.'
              : 'شروع اصلاح سبک زندگی و درمان دارویی (متفورمین خط اول در دیابت نوع ۲ در صورت eGFR ≥ 30)؛ در قند ≥ ۳۰۰ یا A1c ≥ ۱۰٪ بررسی شروع انسولین.',
          ],
          clinicalNotes: [
            'آستانه‌های ADA برای دیابت: FBS ≥ 126 | HbA1c ≥ 6.5% | 2h-OGTT ≥ 200 | Random BG ≥ 200 + علائم کلاسیک.',
            'در آنمی، همولیز، خونریزی اخیر یا هموگلوبینوپاتی، HbA1c ممکن است کاذب باشد.',
          ],
        };
      }

      // 2) Prediabetes / Borderline random
      if (preReasons.length > 0) {
        return {
          score: preReasons.length,
          unit: 'معیار پره‌دیابت',
          riskLevel: 'moderate',
          riskTitle:
            randomBorderline && preReasons.length === 1
              ? 'قند تصادفی مرزی (۱۴۰–۱۹۹) — نیازمند بررسی با FBS یا HbA1c'
              : 'پره‌دیابت (Prediabetes: IFG / IGT / A1c 5.7–6.4%)',
          summary: [...preReasons, ...normalReasons].join(' | '),
          diagnosisAndTreatment:
            randomBorderline && preReasons.length === 1
              ? [
                  'قند تصادفی بین ۱۴۰ تا ۱۹۹ به تنهایی تشخیصی نیست؛ برای افتراق نرمال، پره‌دیابت یا دیابت، FBS ناشتا و HbA1c درخواست کنید.',
                ]
              : [
                  'اصلاح فشرده سبک زندگی (کاهش ۷٪ وزن بدن و حداقل ۱۵۰ دقیقه ورزش هفتگی).',
                  'بررسی تجویز متفورمین در پره‌دیابت پرخطر (BMI ≥ 35، سن < ۶۰ سال، سابقه دیابت بارداری یا افزایش پیشرونده HbA1c).',
                  'کنترل عوامل خطر قلبی‌عروقی (فشار خون و لیپیدها) و پیگیری سالانه.',
                ],
          clinicalNotes: [
            'آستانه‌های ADA برای پره‌دیابت: FBS 100–125 | HbA1c 5.7–6.4% | 2h-OGTT 140–199 mg/dL.',
          ],
        };
      }

      // 3) Normal
      return {
        score: enteredCount,
        unit: 'تست نرمال',
        riskLevel: 'low',
        riskTitle: 'در محدوده نرمال (غیر دیابتی)',
        summary: normalReasons.join(' | '),
        diagnosisAndTreatment: [
          'تمام تست‌های واردشده در محدوده طبیعی هستند.',
          'در صورت وجود عوامل خطر (اضافه‌وزن، سابقه فامیلی دیابت، فشار خون بالا)، غربالگری هر ۱ تا ۳ سال تکرار شود.',
        ],
        clinicalNotes: [
          'قند خون تصادفی < ۱۴۰ mg/dL طبیعی محسوب می‌شود، اما در شک قوی بالینی، FBS یا HbA1c دقیق‌تر است.',
        ],
      };
    },
  },

  // =========================================================================
  // 2. Indications for Initiating Insulin Therapy
  // =========================================================================
  {
    id: 'insulin-initiation',
    titleFa: 'معیارهای نیاز به شروع انسولین در دیابت',
    titleEn: 'Indications for Initiating Insulin Therapy (ADA/AACE)',
    category: 'endocrine',
    categoryLabel: 'غدد و متابولیک',
    reference: 'ADA Standards of Care 2024 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'dkaHhs', label: 'کتواسیدوز دیابتی (DKA) یا وضعیت هیپراسمولار هیپرگلیسمیک (HHS)', type: 'boolean', points: 10 },
      { id: 't1dm', label: 'دیابت نوع ۱ یا شک قوی به کمبود مطلق انسولین (LADA / پانکراتکتومی)', type: 'boolean', points: 10 },
      { id: 'catabolic', label: 'علائم کاتابولیک فعال (کاهش وزن واضح، پلی‌اوری/پلی‌دیپسی شدید، کتونوری/کتونمی)', type: 'boolean', points: 5 },
      { id: 'severeBg', label: 'HbA1c ≥ ۱۰٪ یا قند خون ≥ ۳۰۰ mg/dL در زمان مراجعه', type: 'boolean', points: 5 },
      { id: 'pregnancy', label: 'دیابت بارداری (GDM) یا بارداری در فرد دیابتی با عدم کنترل با رژیم غذایی', type: 'boolean', points: 4 },
      { id: 'acuteInpatient', label: 'بستری بیمارستانی، عفونت شدید، استرس حاد یا کورتون دوز بالا با قند پایدار ≥ ۱۸۰ mg/dL', type: 'boolean', points: 4 },
      { id: 'oralFail', label: 'عدم دستیابی به هدف HbA1c با وجود ۲ تا ۳ داروی خوراکی و GLP-1 RA', type: 'boolean', points: 3 },
      { id: 'organFail', label: 'نارسایی پیشرفته کلیه (eGFR < 30) یا نارسایی کبدی با محدودیت داروهای خوراکی', type: 'boolean', points: 3 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      const urgent = Boolean(values.dkaHhs) || Boolean(values.t1dm);

      if (score === 0) {
        return {
          score,
          riskLevel: 'low',
          riskTitle: 'اندیکاسیون فوری انسولین وجود ندارد',
          summary: 'در نبود علائم کاتابولیک، DKA یا قند بسیار بالا، داروهای غیرانسولینی خط اول هستند.',
          diagnosisAndTreatment: [
            'شروع یا بهینه‌سازی متفورمین و بر حسب بیماری قلبی/کلیوی افزودن SGLT2i یا GLP-1 RA.',
            'آموزش علائم هشدار (کتونوری، تهوع، استفراغ، پلی‌اوری شدید) و پیگیری HbA1c سه ماه بعد.',
          ],
          clinicalNotes: [
            'بر اساس گایدلاین ADA، در اغلب بیماران دیابت نوع ۲ پایدار، داروهای تزریقی GLP-1 RA حتی پیش از انسولین بازال ترجیح دارند مگر در حضور هیپرگلیسمی شدید یا کاتابولیسم.',
          ],
        };
      }

      if (urgent) {
        return {
          score,
          riskLevel: 'critical',
          riskTitle: 'نیاز مطلق و اورژانسی به انسولین درمانی',
          summary: 'در DKA/HHS یا دیابت نوع ۱، تاخیر در تجویز انسولین خطر اسیدوز شدید و مرگ‌ومیر دارد.',
          diagnosisAndTreatment: [
            'در DKA/HHS: احیای سالین ۰.۹٪، چک پتاسیم قبل از انسولین (اگر K ≥ 3.3 بود شروع انفوزیون رگولار وریدی ۰.۱ U/kg/hr) و پایش قند ساعتی و الکترولیت‌ها.',
            'در دیابت نوع ۱ بدون بحران: رژیم پایه-بولوس (Basal-Bolus) با دوز کل روزانه ۰.۴ تا ۰.۵ واحد/کیلوگرم (نصف بازال شبانه، نصف بولوس قبل وعده‌ها).',
          ],
          clinicalNotes: [
            'در بیماران DKA پس از بسته شدن آنیون گپ و رسیدن قند به زیر ۲۰۰، هم‌پوشانی ۱–۲ ساعته انسولین زیرجلدی قبل از قطع پمپ وریدی الزامی است.',
          ],
        };
      }

      if (score >= 5) {
        return {
          score,
          riskLevel: 'high',
          riskTitle: 'اندیکاسیون قوی شروع انسولین (Basal یا Basal-Bolus)',
          summary: 'قند ≥ ۳۰۰، HbA1c ≥ ۱۰٪ یا علائم کاتابولیک گلوکزتوکسیسیته شدید ایجاد کرده و نیازمند انسولین است.',
          diagnosisAndTreatment: [
            'شروع انسولین پایه (Basal): ۱۰ واحد شبانه یا ۰.۱ تا ۰.۲ واحد/کیلوگرم/روز (یا تا ۰.۳ U/kg در هیپرگلیسمی شدیدتر)، یا رژیم Basal-Bolus در حضور علائم کاتابولیک.',
            'تیتراسیون دوز پایه: افزایش ۲ واحد هر ۳ روز تا رسیدن قند ناشتا به ۸۰–۱۳۰ mg/dL (در صورت افت < ۷۰ کاهش ۱۰–۲۰٪ دوز).',
          ],
          clinicalNotes: [
            'پس از رفع گلوکزتوکسیسیته طی چند هفته و کاهش HbA1c، برخی بیماران نوع ۲ می‌توانند به رژیم ساده‌تر یا غیرانسولینی برگردند.',
          ],
        };
      }

      return {
        score,
        riskLevel: 'moderate',
        riskTitle: 'نیاز به شروع انسولین در شرایط بالینی خاص',
        summary: 'بستری بیمارستانی، بارداری یا شکست درمان خوراکی نیازمند انسولین‌درمانی هدفمند است.',
        diagnosisAndTreatment: [
          'در بیمار بستری غیرواردی به ICU: رژیم Basal-Bolus (۰.۳–۰.۵ U/kg/day) با هدف قند ۱۴۰ تا ۱۸۰ mg/dL.',
          'در شکست درمان سرپایی: افزودن انسولین پایه (۱۰ واحد یا ۰.۱–۰.۲ U/kg) همراه با ادامه متفورمین/SGLT2i.',
        ],
        clinicalNotes: [
          'در مصرف کورتیکواستروئید صبحگاهی (پردنیزولون)، پیک هیپرگلیسمی بعدازظهر رخ می‌دهد و انسولین NPH صبحگاهی بسیار مؤثر است.',
        ],
      };
    },
  },

  // =========================================================================
  // 3. ASCVD 10-Year Risk Estimator & Statin Eligibility
  // =========================================================================
  {
    id: 'ascvd-risk',
    titleFa: 'محاسبه ریسک ۱۰ ساله ASCVD و اندیکاسیون استاتین (چربی خون)',
    titleEn: 'ASCVD 10-Year Risk (Pooled Cohort Equations) & Statin Therapy',
    category: 'endocrine',
    categoryLabel: 'غدد و متابولیک',
    reference: 'ACC/AHA Pooled Cohort Equations 2013 & Cholesterol Guideline 2018',
    criteria: [
      { id: 'knownAscvd', label: 'سابقه بیماری بالینی ASCVD (سکته قلبی، آنژین، استنت/CABG، سکته مغزی/TIA، PAD)', type: 'boolean', points: 1 },
      { id: 'ldl190', label: 'کلسترول LDL ≥ ۱۹۰ mg/dL (هیپرکلسترولمی شدید اولیه)', type: 'boolean', points: 1 },
      { id: 'age', label: 'سن بیمار (۴۰ تا ۷۹ سال)', type: 'number', unit: 'سال', placeholder: 'مثلاً 55', defaultValue: 55 },
      {
        id: 'sex',
        label: 'جنسیت',
        type: 'select',
        options: [
          { label: 'مرد (Male)', points: 0 },
          { label: 'زن (Female)', points: 1 },
        ],
      },
      {
        id: 'race',
        label: 'نژاد (در فرمول ACC/AHA)',
        type: 'select',
        options: [
          { label: 'سفیدپوست / سایر نژادها (شامل جمعیت ایران)', points: 0 },
          { label: 'آفریقایی-آمریکایی (African American)', points: 1 },
        ],
      },
      { id: 'tc', label: 'کلسترول کل (Total Cholesterol)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 210', defaultValue: 210 },
      { id: 'hdl', label: 'کلسترول HDL', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 45', defaultValue: 45 },
      { id: 'sbp', label: 'فشار خون سیستولیک (SBP)', type: 'number', unit: 'mmHg', placeholder: 'مثلاً 135', defaultValue: 135 },
      { id: 'htnTx', label: 'دریافت داروی فشار خون (Treated HTN)', type: 'boolean', points: 1 },
      { id: 'diabetes', label: 'ابتلا به دیابت (Diabetes Mellitus)', type: 'boolean', points: 1 },
      { id: 'smoker', label: 'مصرف‌کننده فعلی سیگار (Current Smoker)', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const knownAscvd = Boolean(values.knownAscvd);
      const ldl190 = Boolean(values.ldl190);

      if (knownAscvd || ldl190) {
        return {
          score: 20,
          unit: '% (گروه پرخطر)',
          riskLevel: 'critical',
          riskTitle: knownAscvd
            ? 'بیماری بالینی ASCVD — اندیکاسیون قطعی استاتین با شدت بالا'
            : 'LDL ≥ ۱۹۰ mg/dL — اندیکاسیون قطعی استاتین با شدت بالا',
          summary: `وجود ${knownAscvd ? 'بیماری بالینی ASCVD' : 'LDL ≥ ۱۹۰ mg/dL'} بیمار را بدون نیاز به محاسبه فرمول در بالاترین گروه پرخطر قرار می‌دهد.`,
          diagnosisAndTreatment: [
            'شروع استاتین با شدت بالا (High-Intensity): آتورواستاتین ۴۰–۸۰ mg یا روزوواستاتین ۲۰–۴۰ mg شبانه با هدف کاهش ≥ ۵۰٪ LDL.',
            'در ASCVD بسیار پرخطر اگر با حداکثر دوز استاتین LDL ≥ ۷۰ mg/dL باقی ماند: افزودن ازتیمایب و در مرحله بعد مهارکننده PCSK9.',
          ],
          clinicalNotes: [
            'فرمول Pooled Cohort Equations مخصوص پیشگیری اولیه است و در بیماری عروقی شناخته‌شده یا LDL ≥ ۱۹۰ همیشه استاتین پرشدت تجویز می‌شود.',
          ],
        };
      }

      if (!hasNum(values, 'age') || !hasNum(values, 'tc') || !hasNum(values, 'hdl') || !hasNum(values, 'sbp')) {
        return incompleteResult('سن، کلسترول کل، HDL و فشار خون سیستولیک را وارد کنید.');
      }

      const age = Math.min(79, Math.max(40, getNum(values, 'age', 55)));
      const isFemale = Number(values.sex ?? 0) === 1;
      const isAA = Number(values.race ?? 0) === 1;
      const tc = Math.min(400, Math.max(100, getNum(values, 'tc', 210)));
      const hdl = Math.min(100, Math.max(20, getNum(values, 'hdl', 45)));
      const sbp = Math.min(200, Math.max(90, getNum(values, 'sbp', 135)));
      const treated = Boolean(values.htnTx);
      const dm = Boolean(values.diabetes) ? 1 : 0;
      const smoker = Boolean(values.smoker) ? 1 : 0;

      const lnAge = Math.log(age);
      const lnTC = Math.log(tc);
      const lnHDL = Math.log(hdl);
      const lnSBP = Math.log(sbp);

      let indX = 0;
      let s0 = 0.9144;
      let meanX = 61.18;

      if (!isFemale && !isAA) {
        s0 = 0.9144;
        meanX = 61.18;
        indX =
          12.344 * lnAge +
          11.853 * lnTC -
          2.664 * lnAge * lnTC -
          7.99 * lnHDL +
          1.769 * lnAge * lnHDL +
          (treated ? 1.797 : 1.764) * lnSBP +
          7.837 * smoker -
          1.795 * lnAge * smoker +
          0.658 * dm;
      } else if (!isFemale && isAA) {
        s0 = 0.8954;
        meanX = 19.54;
        indX =
          2.469 * lnAge +
          0.302 * lnTC -
          0.307 * lnHDL +
          (treated ? 1.916 : 1.809) * lnSBP +
          0.549 * smoker +
          0.645 * dm;
      } else if (isFemale && !isAA) {
        s0 = 0.9665;
        meanX = -29.18;
        indX =
          -29.799 * lnAge +
          4.884 * lnAge * lnAge +
          13.54 * lnTC -
          3.114 * lnAge * lnTC -
          13.578 * lnHDL +
          3.149 * lnAge * lnHDL +
          (treated ? 2.019 : 1.957) * lnSBP +
          7.574 * smoker -
          1.665 * lnAge * smoker +
          0.661 * dm;
      } else {
        s0 = 0.9533;
        meanX = 86.61;
        indX =
          17.114 * lnAge +
          0.94 * lnTC -
          18.92 * lnHDL +
          4.475 * lnAge * lnHDL +
          (treated
            ? 29.291 * lnSBP - 6.432 * lnAge * lnSBP
            : 27.82 * lnSBP - 6.087 * lnAge * lnSBP) +
          0.691 * smoker +
          0.874 * dm;
      }

      const riskPct = round1(Math.min(99.9, Math.max(0.1, (1 - Math.pow(s0, Math.exp(indX - meanX))) * 100)));

      if (riskPct < 5) {
        return {
          score: riskPct,
          unit: '% (ریسک ۱۰ ساله)',
          riskLevel: dm ? 'moderate' : 'low',
          riskTitle: dm ? 'ریسک پایه < ۵٪ اما دارای دیابت (اندیکاسیون استاتین متوسط)' : 'ریسک پایین ASCVD (< ۵٪)',
          summary: `احتمال بروز رویداد قلبی‌عروقی عمده طی ۱۰ سال آینده ${riskPct}٪ برآورد می‌شود.`,
          diagnosisAndTreatment: dm
            ? [
                'در بیماران دیابتی ۴۰ تا ۷۵ ساله (حتی با ریسک پایین‌تر)، استاتین با شدت متوسط (آتورواستاتین ۱۰–۲۰ mg یا روزوواستاتین ۵–۱۰ mg) توصیه می‌شود.',
                'اصلاح سبک زندگی، کنترل فشار خون و ترک سیگار.',
              ]
            : [
                'تاکید بر اصلاح سبک زندگی (رژیم مدیترانه‌ای، ورزش منظم، ترک سیگار)؛ استاتین معمولاً نیاز نیست.',
              ],
          clinicalNotes: [
            'در دیابت با عوامل خطر متعدد یا آسیب ارگان هدف، ارتقا به استاتین با شدت بالا مطرح می‌شود.',
          ],
        };
      }

      if (riskPct < 7.5) {
        return {
          score: riskPct,
          unit: '% (ریسک ۱۰ ساله)',
          riskLevel: 'moderate',
          riskTitle: 'ریسک مرزی ASCVD (۵٪ تا ۷.۴٪)',
          summary: `ریسک ۱۰ ساله ${riskPct}٪؛ تصمیم‌گیری برای استاتین بر اساس عوامل تقویت‌کننده ریسک (Risk Enhancers).`,
          diagnosisAndTreatment: [
            'اصلاح جدی سبک زندگی؛ در صورت وجود دیابت یا عوامل تقویت‌کننده (سابقه خانوادگی CAD زودرس، CKD، سندرم متابولیک، Lp(a) یا hs-CRP بالا، یا CAC > 0) شروع استاتین با شدت متوسط.',
          ],
          clinicalNotes: [
            'اسکور کلسیم کرونری (CAC) در ریسک مرزی و متوسط برای تصمیم نهایی بسیار کمک‌کننده است.',
          ],
        };
      }

      if (riskPct < 20) {
        return {
          score: riskPct,
          unit: '% (ریسک ۱۰ ساله)',
          riskLevel: 'high',
          riskTitle: 'ریسک متوسط ASCVD (۷.۵٪ تا ۱۹.۹٪)',
          summary: `ریسک ۱۰ ساله ${riskPct}٪؛ کاندید شروع درمان با استاتین با شدت متوسط.`,
          diagnosisAndTreatment: [
            'شروع استاتین با شدت متوسط (آتورواستاتین ۱۰–۲۰ mg یا روزوواستاتین ۵–۱۰ mg) با هدف کاهش ۳۰ تا ۴۹٪ LDL.',
            'در حضور عوامل تقویت‌کننده متعدد ریسک یا دیابت، ارتقا به استاتین با شدت بالا (کاهش ≥ ۵۰٪ LDL).',
          ],
          clinicalNotes: [
            'پایش پروفایل لیپید ۴ تا ۱۲ هفته پس از شروع استاتین برای بررسی میزان پاسخ.',
          ],
        };
      }

      return {
        score: riskPct,
        unit: '% (ریسک ۱۰ ساله)',
        riskLevel: 'critical',
        riskTitle: 'ریسک بالای ASCVD (≥ ۲۰٪ در ۱۰ سال)',
        summary: `احتمال بالای رویداد قلبی یا سکته مغزی طی ۱۰ سال آینده (${riskPct}٪).`,
        diagnosisAndTreatment: [
          'شروع استاتین با شدت بالا (آتورواستاتین ۴۰–۸۰ mg یا روزوواستاتین ۲۰–۴۰ mg) با هدف کاهش ≥ ۵۰٪ LDL.',
          'کنترل تهاجمی فشار خون (هدف < ۱۳۰/۸۰)، ترک قطعی سیگار و کنترل دقیق قند خون.',
        ],
        clinicalNotes: [
          'ریسک ≥ ۲۰٪ از نظر شدت درمان چربی خون معادل پیشگیری ثانویه با استاتین پرشدت است.',
        ],
      };
    },
  },

  // =========================================================================
  // 4. Friedewald LDL Cholesterol & Non-HDL
  // =========================================================================
  {
    id: 'ldl-friedewald',
    titleFa: 'محاسبه کلسترول LDL (فرمول فریدوالد) و Non-HDL',
    titleEn: 'LDL Cholesterol (Friedewald Formula) & Non-HDL',
    category: 'endocrine',
    categoryLabel: 'غدد و متابولیک',
    reference: 'Friedewald WT et al. Clin Chem 1972 / ACC/AHA Cholesterol Guideline',
    criteria: [
      { id: 'tc', label: 'کلسترول کل (Total Cholesterol)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 220', defaultValue: 220 },
      { id: 'hdl', label: 'کلسترول HDL', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 45', defaultValue: 45 },
      { id: 'tg', label: 'تری‌گلیسیرید (Triglycerides)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 180', defaultValue: 180 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'tc') || !hasNum(values, 'hdl') || !hasNum(values, 'tg')) {
        return incompleteResult('کلسترول کل، HDL و تری‌گلیسیرید را وارد کنید.');
      }
      const tc = getNum(values, 'tc', 220);
      const hdl = getNum(values, 'hdl', 45);
      const tg = getNum(values, 'tg', 180);
      const nonHdl = round1(Math.max(0, tc - hdl));
      const ldl = round1(Math.max(0, tc - hdl - tg / 5));

      if (tg >= 400) {
        const pancreatitisRisk = tg >= 500;
        return {
          score: nonHdl,
          unit: 'mg/dL (Non-HDL)',
          riskLevel: tg >= 1000 ? 'critical' : 'high',
          riskTitle: pancreatitisRisk
            ? `تری‌گلیسیرید بسیار بالا (${tg} mg/dL) — خطر پانکراتیت حاد!`
            : `فرمول فریدوالد در TG ≥ ۴۰۰ نامعتبر است (Non-HDL = ${nonHdl})`,
          summary: `به دلیل تری‌گلیسیرید ≥ ۴۰۰ mg/dL، معادله فریدوالد LDL را کمتر از حد واقعی نشان می‌دهد و باید از Non-HDL (${nonHdl} mg/dL) یا اندازه‌گیری مستقیم LDL استفاده کرد.`,
          diagnosisAndTreatment: pancreatitisRisk
            ? [
                'برای پیشگیری از پانکراتیت حاد: شروع فیبرات (فنوفیبرات) یا اسیدهای چرب امگا-۳، قطع الکل و استروژن، کنترل شدید قند خون.',
                'در پانکراتیت حاد ناشی از هیپرتری‌گلیسیریدمی (معمولاً TG > ۱۰۰۰): NPO، مایع‌درمانی، انفوزیون انسولین وریدی یا پلاسمافرز.',
              ]
            : [
                'درخواست Direct LDL و ارزیابی ریسک ASCVD بر پایه کلسترول Non-HDL (هدف معمول < ۱۳۰ و در بیماران پرخطر < ۱۰۰ mg/dL).',
              ],
          clinicalNotes: [
            'Non-HDL = Total Cholesterol - HDL (معیار جامع تمام لیپوپروتئین‌های آتروژنیک).',
          ],
        };
      }

      const level = ldl >= 190 ? 'critical' : ldl >= 130 ? 'high' : ldl >= 100 ? 'moderate' : 'low';
      return {
        score: ldl,
        unit: 'mg/dL (LDL)',
        riskLevel: level,
        riskTitle:
          ldl >= 190
            ? 'هیپرکلسترولمی شدید اولیه (LDL ≥ ۱۹۰ mg/dL)'
            : ldl >= 130
            ? `LDL بالا (${ldl} mg/dL) | Non-HDL = ${nonHdl}`
            : ldl >= 100
            ? `LDL مرزی/بالاتر از حد ایده‌آل (${ldl} mg/dL) | Non-HDL = ${nonHdl}`
            : `LDL مطلوب (${ldl} mg/dL) | Non-HDL = ${nonHdl}`,
        summary: `LDL محاسبه‌شده: ${ldl} mg/dL و کلسترول Non-HDL: ${nonHdl} mg/dL.`,
        diagnosisAndTreatment:
          ldl >= 190
            ? [
                'شروع استاتین با شدت بالا (آتورواستاتین ۴۰–۸۰ mg یا روزوواستاتین ۲۰–۴۰ mg) مستقل از محاسبه ASCVD.',
                'بررسی هیپرکلسترولمی فامیلی (FH) و غربالگری اعضای خانواده درجه یک.',
              ]
            : ldl >= 70
            ? [
                'تعیین نیاز به استاتین بر اساس اسکور ریسک ۱۰ ساله ASCVD، سابقه دیابت یا بیماری قلبی-عروقی.',
                'هدف LDL در بیماران ASCVD پرخطر < ۷۰ mg/dL (و در بسیار پرخطر < ۵۵ mg/dL).',
              ]
            : ['ادامه رژیم غذایی سالم و پیگیری دوره‌ای در غیاب بیماری قلبی فعال.'],
        clinicalNotes: [
          'فرمول فریدوالد: LDL = Total Cholesterol - HDL - (Triglycerides / 5).',
        ],
      };
    },
  },

  // =========================================================================
  // 5. Fractional Excretion of Sodium (FENa)
  // =========================================================================
  {
    id: 'fena-calculator',
    titleFa: 'محاسبه کسر دفعی (جهشی) سدیم (FENa)',
    titleEn: 'Fractional Excretion of Sodium (FENa)',
    category: 'formulas',
    categoryLabel: 'فرمول‌های محاسباتی',
    reference: 'Espinel CH. JAMA 1976 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'uNa', label: 'سدیم ادرار (Urine Na)', type: 'number', unit: 'mEq/L', placeholder: 'مثلاً 18', defaultValue: 18 },
      { id: 'pNa', label: 'سدیم سرم (Serum Na)', type: 'number', unit: 'mEq/L', placeholder: 'مثلاً 138', defaultValue: 138 },
      { id: 'uCr', label: 'کراتینین ادرار (Urine Cr)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 120', defaultValue: 120 },
      { id: 'pCr', label: 'کراتینین سرم (Serum Cr)', type: 'number', unit: 'mg/dL', placeholder: 'مثلاً 2.2', defaultValue: 2.2 },
    ],
    evaluate(values) {
      if (!hasNum(values, 'uNa') || !hasNum(values, 'pNa') || !hasNum(values, 'uCr') || !hasNum(values, 'pCr')) {
        return incompleteResult('سدیم ادرار، سدیم سرم، کراتینین ادرار و کراتینین سرم را وارد کنید.');
      }
      const uNa = Math.max(0.1, getNum(values, 'uNa', 18));
      const pNa = Math.max(1, getNum(values, 'pNa', 138));
      const uCr = Math.max(0.1, getNum(values, 'uCr', 120));
      const pCr = Math.max(0.1, getNum(values, 'pCr', 2.2));

      const fena = Math.round(((uNa * pCr) / (pNa * uCr)) * 100 * 100) / 100;

      if (fena < 1.0) {
        return {
          score: fena,
          unit: '%',
          riskLevel: 'moderate',
          riskTitle: 'کسر دفعی سدیم < ۱٪ — مطرح‌کننده آزوتمی پره‌رنال',
          summary: `FENa = ${fena}٪ نشان‌دهنده بازجذب شدید سدیم توسط توبول‌های سالم در پاسخ به کاهش پرفیوژن کلیوی است.`,
          diagnosisAndTreatment: [
            'بررسی وضعیت حجم داخل عروقی (تورگور، فشار خون، IVC در سونوگرافی)؛ در صورت هیپوولمی، بولوس کریستالوئید ایزوتونیک.',
            'قطع داروهای نفروتوکسیک و تشدیدکننده افت GFR (NSAID، ACEi/ARB در کاهش حجم حاد).',
            'در حضور نارسایی قلبی یا سیروز (کاهش حجم مؤثر شریانی)، از اضافه‌بار مایع پرهیز و درمان بیماری زمینه‌ای انجام شود.',
          ],
          clinicalNotes: [
            'فرمول: FENa (%) = 100 × (Urine Na × Serum Cr) / (Serum Na × Urine Cr).',
            'تله بالینی مهم: نفروپاتی ناشی از ماده حاجب، رابدومیولیز/همولیز، گلومرولونفریت حاد و سپسیس زودرس نیز می‌توانند FENa < 1% داشته باشند.',
          ],
        };
      }

      if (fena <= 2.0) {
        return {
          score: fena,
          unit: '%',
          riskLevel: 'moderate',
          riskTitle: 'محدوده بینابینی (FENa بین ۱٪ تا ۲٪)',
          summary: `FENa = ${fena}٪ هم در پره‌رنال خفیف/مصرف دیورتیک و هم در شروع ATN یا انسداد دیده می‌شود.`,
          diagnosisAndTreatment: [
            'در صورت مصرف اخیر دیورتیک (مثل فوروزماید)، محاسبه FEUrea (کسر دفعی اوره) دقیق‌تر است (FEUrea < 35% به نفع پره‌رنال).',
            'انجام سونوگرافی کلیه و مثانه برای رد انسداد (پست‌رنال) و بررسی آزمایش کامل ادرار.',
          ],
          clinicalNotes: [
            'بیماران با بیماری مزمن کلیه (CKD) زمینه‌ای حتی در کم‌آبی شدید ممکن است FENa بالای ۱٪ داشته باشند.',
          ],
        };
      }

      return {
        score: fena,
        unit: '%',
        riskLevel: 'high',
        riskTitle: 'کسر دفعی سدیم > ۲٪ — مطرح‌کننده آسیب ذاتی کلیه (ATN)',
        summary: `FENa = ${fena}٪ نشان‌دهنده ناتوانی توبول‌های کلیوی در بازجذب سدیم (نکروز حاد توبولی یا آسیب پارانشیمی/انسداد طول‌کشیده).`,
        diagnosisAndTreatment: [
          'پرهیز از تجویز بیش از حد مایعات وریدی (خطر ادم ریه در اولیگوری ATN) و حفظ تعادل دقیق مایعات.',
          'پایش دقیق پتاسیم، اسیدوز متابولیک و تنظیم دوز کلیوی داروها؛ درخواست سونوگرافی کلیه برای رد هیدرونفروز.',
          'مشاوره نفرولوژی و پایش اندیکاسیون‌های دیالیز اورژانسی (AEIOU).',
        ],
        clinicalNotes: [
          'کست‌های گرانولار قهوه‌ای تیره (Muddy brown casts) در میکروسکوپی ادرار تأییدکننده ATN است.',
        ],
      };
    },
  },

  // =========================================================================
  // 6. Apgar Score for Neonates
  // =========================================================================
  {
    id: 'apgar-neonates',
    titleFa: 'اسکور آپگار نوزادان (Apgar Score)',
    titleEn: 'Apgar Score for Neonates',
    category: 'peds_heme',
    categoryLabel: 'اطفال، هماتولوژی و روان',
    reference: 'Apgar V 1953 / AAP-AHA Neonatal Resuscitation Program (NRP)',
    criteria: [
      {
        id: 'appearance',
        label: 'رنگ پوست (Appearance)',
        type: 'select',
        options: [
          { label: 'سیانوز منتشر یا رنگ‌پریدگی کامل (Blue/Pale)', points: 0 },
          { label: 'بدن صورتی با انتهاهای کبود / آکروسیانوز (Acrocyanotic)', points: 1 },
          { label: 'سراسر بدن کاملاً صورتی (Completely Pink)', points: 2 },
        ],
      },
      {
        id: 'pulse',
        label: 'ضربان قلب (Pulse)',
        type: 'select',
        options: [
          { label: 'ندارد (Absent)', points: 0 },
          { label: 'کمتر از ۱۰۰ در دقیقه (< 100 bpm)', points: 1 },
          { label: '۱۰۰ در دقیقه و بالاتر (≥ 100 bpm)', points: 2 },
        ],
      },
      {
        id: 'grimace',
        label: 'رفلکس تحریک‌پذیری (Grimace)',
        type: 'select',
        options: [
          { label: 'بدون پاسخ به تحریک (No response)', points: 0 },
          { label: 'اخم یا حرکت ضعیف صورت (Grimace)', points: 1 },
          { label: 'گریه قوی، سرفه یا عطسه (Cry/Pull away)', points: 2 },
        ],
      },
      {
        id: 'activity',
        label: 'تون عضلانی (Activity)',
        type: 'select',
        options: [
          { label: 'شل و بی‌حرکت (Limp / Flaccid)', points: 0 },
          { label: 'خم شدن مختصر اندام‌ها (Some flexion)', points: 1 },
          { label: 'حرکات فعال و فلکسیون کامل (Active motion)', points: 2 },
        ],
      },
      {
        id: 'respiration',
        label: 'تنفس (Respiration)',
        type: 'select',
        options: [
          { label: 'آپنه / ندارد (Absent)', points: 0 },
          { label: 'ضعیف، نامنظم یا گسپینگ (Weak/Irregular)', points: 1 },
          { label: 'تنفس خوب و گریه قوی (Strong cry)', points: 2 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);

      if (score >= 7) {
        return {
          score,
          maxScore: 10,
          riskLevel: 'low',
          riskTitle: 'وضعیت نوزاد نرمال (Apgar ۷ تا ۱۰)',
          summary: 'نوزاد تطابق تنفسی و گردش خون خوبی پس از تولد دارد.',
          diagnosisAndTreatment: [
            'مراقبت روتین نوزاد: خشک کردن، حفظ دمای بدن (تماس پوست با پوست با مادر)، پاکسازی ملایم راه هوایی فقط در صورت نیاز.',
            'تکرار ارزیابی در دقیقه ۵ (و در صورت نیاز دقیقه ۱۰).',
          ],
          clinicalNotes: [
            'آکروسیانوز (کبودی دست و پاها) در دقایق اول تولد بسیار شایع است و امتیاز ۹ معمولاً طبیعی تلقی می‌شود.',
          ],
        };
      }

      if (score >= 4) {
        return {
          score,
          maxScore: 10,
          riskLevel: 'high',
          riskTitle: 'دپرسیون متوسط نوزاد (Apgar ۴ تا ۶)',
          summary: 'نوزاد نیازمند تحریک، باز کردن راه هوایی و حمایت تنفسی فعال است.',
          diagnosisAndTreatment: [
            'گام‌های اولیه NRP زیر وارمر: گرم کردن، پوزیشن Sniffing، ساکشن ملایم ترشحات در صورت انسداد، خشک کردن و تحریک لمسی.',
            'در صورت آپنه/گسپینگ یا HR < 100 bpm: شروع فوری تهویه با فشار مثبت (PPV) با ریت ۴۰–۶۰ بار در دقیقه با اکسیژن ۲۱٪ (نوزاد ترم).',
            'تکرار اسکور آپگار در دقیقه ۵ و هر ۵ دقیقه تا رسیدن به ≥ ۷.',
          ],
          clinicalNotes: [
            'احیای نوزاد طبق NRP هرگز نباید تا زمان ثبت آپگار دقیقه ۱ به تأخیر بیفتد.',
          ],
        };
      }

      return {
        score,
        maxScore: 10,
        riskLevel: 'critical',
        riskTitle: 'دپرسیون شدید نوزاد — احیای فوری NRP (Apgar ۰ تا ۳)',
        summary: 'وضعیت بحرانی؛ نیازمند احیای پیشرفته فوری نوزاد و آماده‌سازی NICU.',
        diagnosisAndTreatment: [
          'شروع فوری تهویه با فشار مثبت (PPV) مؤثر؛ در صورت عدم پاسخ (HR < 100) اصلاح MR SOPA و لوله‌گذاری تراشه.',
          'اگر پس از ۳۰ ثانیه تهویه مؤثر ضربان قلب همچنان < ۶۰ در دقیقه باقی ماند: شروع ماساژ قلبی هماهنگ (۳:۱) + افزایش FiO2 به ۱۰۰٪.',
          'در ادامه ماندن HR < 60 علی‌رغم ۶۰ ثانیه ماساژ و تهویه: اپی‌نفرین (۰.۰۱–۰.۰۳ mg/kg ورید نافی) + بررسی حجم خون (نرمال سالین ۱۰ mL/kg) و پنوموتوراکس.',
        ],
        clinicalNotes: [
          'تداوم آپگار ۰ تا ۳ در دقیقه ۵، ۱۰ و ۱۵ با افزایش خطر آسیب نورولوژیک هیپوکسیک-ایسکمیک (HIE) و اندیکاسیون هیپوترمی درمانی همراه است.',
        ],
      };
    },
  },

  // =========================================================================
  // 7. Brugada Criteria (VT vs SVT with Aberrancy in WCT)
  // =========================================================================
  {
    id: 'brugada-wct',
    titleFa: 'معیارهای بروگادا (افتراق VT از SVT در تاکی‌کاردی با QRS پهن)',
    titleEn: 'Brugada Criteria for Wide-Complex Tachycardia',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: 'Brugada P et al. Circulation 1991 / Rosen’s Emergency Medicine',
    criteria: [
      {
        id: 'step1_noRs',
        label: 'گام ۱: نبود کمپلکس RS در تمام لیدهای پره‌کوردیال (V1 تا V6) — یعنی تماماً R مثبت یا تماماً QS منفی',
        type: 'boolean',
        points: 1,
      },
      {
        id: 'step2_rToS',
        label: 'گام ۲: فاصله شروع موج R تا عمیق‌ترین نقطه موج S (فاصله R-to-S) > ۱۰۰ ms (> ۲.۵ خانه کوچک) در حداقل یک لید پره‌کوردیال',
        type: 'boolean',
        points: 1,
      },
      {
        id: 'step3_avDissoc',
        label: 'گام ۳: وجود تفکیک دهلیزی-بطنی (AV Dissociation) یا ضربان‌های Capture / Fusion در نوار قلب',
        type: 'boolean',
        points: 1,
      },
      {
        id: 'step4_morph',
        label: 'گام ۴: معیارهای مورفولوژی VT در هر دو لید V1-V2 و V6 (مانند R تکی یا موج Q در V6، یا شروع R > ۳۰ ms در LBBB)',
        type: 'boolean',
        points: 1,
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);

      if (score >= 1) {
        return {
          score,
          maxScore: 4,
          riskLevel: 'critical',
          riskTitle: 'تشخیص: تاکی‌کاردی بطنی (Ventricular Tachycardia)',
          summary: `با مثبت بودن حتی یک گام از الگوریتم بروگادا (${score} مورد مثبت)، تشخیص با ویژگی و حساسیت بالا VT است.`,
          diagnosisAndTreatment: [
            'در بیمار ناپایدار (افت فشار، تغییر هوشیاری، درد سینه، ادم ریه): کاردیوورژن الکتریکی همزمان (Synchronized Cardioversion) فوری با انرژی ۱۰۰–۲۰۰ ژول.',
            'در VT مونومورفیک پایدار: آمیودارون ۱۵۰ mg وریدی طی ۱۰ دقیقه (یا پروکائین‌آمید ۲۰–۵۰ mg/min تا توقف آریتمی) و چک الکترولیت‌ها (K، Mg).',
            'اکیداً از مسدودکننده‌های گره AV (وراپامیل، دیلتیازم، بتابلاکر، دیگوکسین) پرهیز کنید چون خطر فیبریلاسیون بطنی و کلاپس همودینامیک دارند.',
          ],
          clinicalNotes: [
            'در الگوریتم گام‌به‌گام بروگادا، معاینه از گام ۱ تا ۴ پیش می‌رود و به محض مثبت شدن اولین معیار، VT تشخیص داده می‌شود.',
            'بیش از ۸۰٪ تاکی‌کاردی‌های منظم با QRS پهن منشأ بطنی (VT) دارند.',
          ],
        };
      }

      return {
        score: 0,
        maxScore: 4,
        riskLevel: 'high',
        riskTitle: 'همه ۴ گام منفی — مطرح‌کننده SVT با هدایت آبرانت (اما احتیاط لازم)',
        summary: 'هیچ‌یک از ۴ معیار بروگادا مثبت نشد؛ با احتمال بالا SVT with Aberrancy است، ولی VT همچنان به طور کامل رد نمی‌شود.',
        diagnosisAndTreatment: [
          'در بیمار ناپایدار: همچنان کاردیوورژن الکتریکی همزمان درمان قطعی است.',
          'در بیمار کاملاً پایدار و منظم: اگر منومورفیک است می‌توان از آدنوزین ۶ mg سپس ۱۲ mg سریع وریدی استفاده کرد؛ در عدم پاسخ درمان مانند VT (آمیودارون/پروکائین‌آمید).',
          'در تاکی‌کاردی با QRS پهن نامنظم: به AF همراه با WPW فکر کنید و از داروهای بلوک‌کننده گره AV پرهیز کنید.',
        ],
        clinicalNotes: [
          'قانون طلایی طب اورژانس (روزن): هر تاکی‌کاردی با کمپلکس پهن VT محسوب می‌شود مگر خلاف آن به طور قطعی ثابت شود.',
        ],
      };
    },
  },
];
