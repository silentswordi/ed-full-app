import { ClinicalScoreDefinition, sumCriteria } from '../types';

export const NEURO_INFECTIOUS_SCORES: ClinicalScoreDefinition[] = [
  {
    id: 'gcs',
    titleFa: 'مقیاس کمای گلاسکو (GCS)',
    titleEn: 'Glasgow Coma Scale (GCS)',
    category: 'neurology',
    categoryLabel: 'مغز و اعصاب',
    reference: "Rosen's Emergency Medicine · Teasdale G & Jennett B",
    criteria: [
      {
        id: 'eye',
        label: 'پاسخ چشمی (E)',
        type: 'select',
        defaultValue: 3,
        options: [
          { label: '۱: عدم باز کردن چشم', points: 1 },
          { label: '۲: باز کردن با درد', points: 2 },
          { label: '۳: باز کردن با صدا', points: 3 },
          { label: '۴: خودبه‌خودی', points: 4 },
        ],
      },
      {
        id: 'verbal',
        label: 'پاسخ کلامی (V)',
        type: 'select',
        defaultValue: 4,
        options: [
          { label: '۱: بدون پاسخ', points: 1 },
          { label: '۲: صداهای نامفهوم', points: 2 },
          { label: '۳: کلمات نامناسب', points: 3 },
          { label: '۴: جملات گیج', points: 4 },
          { label: '۵: هوشیار و آگاه', points: 5 },
        ],
      },
      {
        id: 'motor',
        label: 'پاسخ حرکتی (M)',
        type: 'select',
        defaultValue: 5,
        options: [
          { label: '۱: بدون حرکت', points: 1 },
          { label: '۲: دسربره (اکستنشن)', points: 2 },
          { label: '۳: دکورتیکه (فلکشن)', points: 3 },
          { label: '۴: عقب کشیدن از درد', points: 4 },
          { label: '۵: لوکالیزه کردن درد', points: 5 },
          { label: '۶: اطاعت از دستور', points: 6 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score >= 13) {
        return {
          score,
          maxScore: 15,
          riskLevel: 'low',
          riskTitle: 'اختلال خفیف (Mild · 13–15)',
          summary: 'راه هوایی معمولاً محفوظ است.',
          diagnosisAndTreatment: ['بررسی مکرر مردمک‌ها، قند خون و معیارهای CT سر در تروما.'],
          clinicalNotes: ['ثبت اجزای E، V و M به‌طور جداگانه ارزش بالینی بیشتری از عدد کل دارد.'],
        };
      }
      if (score >= 9) {
        return {
          score,
          maxScore: 15,
          riskLevel: 'moderate',
          riskTitle: 'اختلال متوسط (Moderate · 9–12)',
          summary: 'نیازمند CT مغز فوری و پایش مکرر راه هوایی.',
          diagnosisAndTreatment: ['CT مغز بدون کنتراست، بررسی متابولیک/سمی و آمادگی برای محافظت راه هوایی.'],
          clinicalNotes: ['افت ≥ ۲ امتیاز در GCS نشانه پیشرفت ضایعه و نیازمند اقدام فوری است.'],
        };
      }
      return {
        score,
        maxScore: 15,
        riskLevel: 'critical',
        riskTitle: 'کمای شدید (Severe · ≤ 8)',
        summary: 'عدم توانایی حفاظت راه هوایی؛ اندیکاسیون انتوباسیون.',
        diagnosisAndTreatment: [
          'برقراری فوری راه هوایی قطعی (RSI) مگر علت سریعاً برگشت‌پذیر (هیپوگلیسمی یا اپیوئید).',
          'CT مغز اورژانسی و مشاوره جراحی اعصاب/ICU.',
        ],
        clinicalNotes: ['در تروما همراهی با تثبیت ستون فقرات گردنی الزامی است.'],
      };
    },
  },
  {
    id: 'four-score',
    titleFa: 'اسکور FOUR (کما در بیمار انتوبه)',
    titleEn: 'FOUR Score (Full Outline of UnResponsiveness)',
    category: 'neurology',
    categoryLabel: 'مغز و اعصاب',
    reference: "Rosen's Emergency Medicine · Wijdicks EF et al.",
    criteria: [
      {
        id: 'eye',
        label: 'پاسخ چشمی (Eye Response)',
        type: 'select',
        defaultValue: 4,
        options: [
          { label: '۰: پلک بسته حتی با درد شدید', points: 0 },
          { label: '۱: پلک بسته ولی با درد باز می‌شود', points: 1 },
          { label: '۲: پلک بسته ولی با صدای بلند باز می‌شود', points: 2 },
          { label: '۳: پلک باز ولی بدون دنبال کردن (Tracking)', points: 3 },
          { label: '۴: پلک باز و دنبال کردن یا پلک زدن با دستور', points: 4 },
        ],
      },
      {
        id: 'motor',
        label: 'پاسخ حرکتی (Motor Response)',
        type: 'select',
        defaultValue: 4,
        options: [
          { label: '۰: بدون پاسخ به درد یا استاتوس میوکلونوس جنرالیزه', points: 0 },
          { label: '۱: پاسخ اکستنشن به درد', points: 1 },
          { label: '۲: پاسخ فلکشن به درد', points: 2 },
          { label: '۳: لوکالیزه کردن محرک دردناک', points: 3 },
          { label: '۴: انجام علامت شست بالا، مشت یا نشانه صلح با دستور', points: 4 },
        ],
      },
      {
        id: 'brainstem',
        label: 'رفلکس‌های ساقه مغز (Brainstem Reflexes)',
        type: 'select',
        defaultValue: 4,
        options: [
          { label: '۰: نبود رفلکس مردمک، قرنیه و سرفه', points: 0 },
          { label: '۱: نبود هم‌زمان رفلکس مردمک و قرنیه', points: 1 },
          { label: '۲: نبود رفلکس مردمک یا قرنیه (یکی از دو)', points: 2 },
          { label: '۳: یک مردمک گشاد و ثابت', points: 3 },
          { label: '۴: هر دو رفلکس مردمک و قرنیه موجود', points: 4 },
        ],
      },
      {
        id: 'resp',
        label: 'الگوی تنفسی (Respiration)',
        type: 'select',
        defaultValue: 4,
        options: [
          { label: '۰: هم‌نفس با ونتیلاتور یا آپنه', points: 0 },
          { label: '۱: تنفس بالای ریت ونتیلاتور', points: 1 },
          { label: '۲: غیرانتوبه، تنفس نامنظم', points: 2 },
          { label: '۳: غیرانتوبه، تنفس شین-استوکس', points: 3 },
          { label: '۴: غیرانتوبه، الگوی تنفس منظم', points: 4 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score >= 13) {
        return {
          score,
          maxScore: 16,
          riskLevel: 'low',
          riskTitle: 'عملکرد عصبی مطلوب (13–16)',
          summary: 'رفلکس‌های ساقه مغز و پاسخ قشری محفوظ است.',
          diagnosisAndTreatment: ['پایش سریال نورولوژیک و ادامه بررسی علل زمینه‌ای.'],
          clinicalNotes: ['اسکور FOUR برخلاف GCS در بیماران انتوبه و سندرم قفل‌شدگی (Locked-in) بسیار دقیق است.'],
        };
      }
      if (score >= 8) {
        return {
          score,
          maxScore: 16,
          riskLevel: 'moderate',
          riskTitle: 'اختلال عصبی متوسط (8–12)',
          summary: 'نیازمند پایش ICU و ارزیابی تصویربرداری مغز.',
          diagnosisAndTreatment: ['CT مغز، بررسی رفلکس‌های ساقه مغز و بستری در بخش مراقبت ویژه.'],
          clinicalNotes: ['کاهش امتیاز رفلکس‌های ساقه مغز نشانه هشداردهنده هرنیاسیون است.'],
        };
      }
      return {
        score,
        maxScore: 16,
        riskLevel: 'critical',
        riskTitle: 'آسیب شدید ساقه مغز / کمای عمیق (0–7)',
        summary: 'مرگ‌ومیر بیمارستانی بالا؛ نیازمند مراقبت نوروکریتیکال فوری.',
        diagnosisAndTreatment: [
          'حفظ راه هوایی قطعی و تهویه مکانیکی، کنترل ICP و مشاوره فوری جراحی مغز و اعصاب/ICU.',
          'در امتیاز ۰: ارزیابی پروتکل مرگ مغزی در صورت تایید علل غیرقابل برگشت.',
        ],
        clinicalNotes: ['ارزیابی ساقه مغز در FOUR قابلیت پیش‌بینی مرگ‌ومیر را از GCS بهتر کرده است.'],
      };
    },
  },
  {
    id: 'nihss',
    titleFa: 'اسکور NIHSS (شدت سکته مغزی)',
    titleEn: 'NIH Stroke Scale (NIHSS)',
    category: 'neurology',
    categoryLabel: 'مغز و اعصاب',
    reference: "Rosen's Emergency Medicine · Brott T et al.",
    criteria: [
      {
        id: '1a',
        label: '1a. سطح هوشیاری',
        type: 'select',
        options: [
          { label: '۰: هوشیار', points: 0 },
          { label: '۱: خواب‌آلود (بیدار با تحریک جزئی)', points: 1 },
          { label: '۲: نیازمند تحریک دردناک', points: 2 },
          { label: '۳: کما / فقط رفلکس', points: 3 },
        ],
      },
      {
        id: '1b',
        label: '1b. سوالات (ماه جاری و سن)',
        type: 'select',
        options: [
          { label: '۰: هر دو صحیح', points: 0 },
          { label: '۱: یکی صحیح', points: 1 },
          { label: '۲: هر دو غلط', points: 2 },
        ],
      },
      {
        id: '1c',
        label: '1c. دستورات (چشم و مشت کردن دست)',
        type: 'select',
        options: [
          { label: '۰: هر دو صحیح', points: 0 },
          { label: '۱: یکی صحیح', points: 1 },
          { label: '۲: هیچ‌کدام', points: 2 },
        ],
      },
      {
        id: '2',
        label: '2. حرکات افقی چشم',
        type: 'select',
        options: [
          { label: '۰: نرمال', points: 0 },
          { label: '۱: فلج نسبی نگاه', points: 1 },
          { label: '۲: انحراف اجباری / فلج کامل', points: 2 },
        ],
      },
      {
        id: '3',
        label: '3. میدان بینایی',
        type: 'select',
        options: [
          { label: '۰: نرمال', points: 0 },
          { label: '۱: همی‌آناپسی جزئی', points: 1 },
          { label: '۲: همی‌آناپسی کامل', points: 2 },
          { label: '۳: همی‌آناپسی دوطرفه / کوری', points: 3 },
        ],
      },
      {
        id: '4',
        label: '4. فلج صورت',
        type: 'select',
        options: [
          { label: '۰: نرمال', points: 0 },
          { label: '۱: خفیف', points: 1 },
          { label: '۲: نسبی (نیمه تحتانی)', points: 2 },
          { label: '۳: کامل', points: 3 },
        ],
      },
      {
        id: '5a',
        label: '5a. بازوی چپ (۱۰ ثانیه)',
        type: 'select',
        options: [
          { label: '۰: بدون افتادگی', points: 0 },
          { label: '۱: افتادگی بدون برخورد به تخت', points: 1 },
          { label: '۲: سقوط روی تخت', points: 2 },
          { label: '۳: بدون غلبه بر جاذبه', points: 3 },
          { label: '۴: بدون حرکت', points: 4 },
        ],
      },
      {
        id: '5b',
        label: '5b. بازوی راست (۱۰ ثانیه)',
        type: 'select',
        options: [
          { label: '۰: بدون افتادگی', points: 0 },
          { label: '۱: افتادگی بدون برخورد به تخت', points: 1 },
          { label: '۲: سقوط روی تخت', points: 2 },
          { label: '۳: بدون غلبه بر جاذبه', points: 3 },
          { label: '۴: بدون حرکت', points: 4 },
        ],
      },
      {
        id: '6a',
        label: '6a. پای چپ (۵ ثانیه)',
        type: 'select',
        options: [
          { label: '۰: بدون افتادگی', points: 0 },
          { label: '۱: افتادگی بدون برخورد', points: 1 },
          { label: '۲: سقوط روی تخت', points: 2 },
          { label: '۳: بدون غلبه بر جاذبه', points: 3 },
          { label: '۴: بدون حرکت', points: 4 },
        ],
      },
      {
        id: '6b',
        label: '6b. پای راست (۵ ثانیه)',
        type: 'select',
        options: [
          { label: '۰: بدون افتادگی', points: 0 },
          { label: '۱: افتادگی بدون برخورد', points: 1 },
          { label: '۲: سقوط روی تخت', points: 2 },
          { label: '۳: بدون غلبه بر جاذبه', points: 3 },
          { label: '۴: بدون حرکت', points: 4 },
        ],
      },
      {
        id: '7',
        label: '7. آتاکسی اندام‌ها',
        type: 'select',
        options: [
          { label: '۰: ندارد', points: 0 },
          { label: '۱: یک اندام', points: 1 },
          { label: '۲: دو اندام', points: 2 },
        ],
      },
      {
        id: '8',
        label: '8. حس (Sensory)',
        type: 'select',
        options: [
          { label: '۰: نرمال', points: 0 },
          { label: '۱: کاهش خفیف تا متوسط', points: 1 },
          { label: '۲: کاهش شدید یا کامل', points: 2 },
        ],
      },
      {
        id: '9',
        label: '9. تکلم و آفازی',
        type: 'select',
        options: [
          { label: '۰: نرمال', points: 0 },
          { label: '۱: آفازی خفیف تا متوسط', points: 1 },
          { label: '۲: آفازی شدید', points: 2 },
          { label: '۳: میوت / گلوبال', points: 3 },
        ],
      },
      {
        id: '10',
        label: '10. دیزآرتری',
        type: 'select',
        options: [
          { label: '۰: نرمال', points: 0 },
          { label: '۱: خفیف تا متوسط', points: 1 },
          { label: '۲: شدید', points: 2 },
        ],
      },
      {
        id: '11',
        label: '11. بی‌توجهی (Neglect)',
        type: 'select',
        options: [
          { label: '۰: ندارد', points: 0 },
          { label: '۱: یک مودالیتی', points: 1 },
          { label: '۲: شدید / چند مودالیتی', points: 2 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 42,
          riskLevel: 'low',
          riskTitle: 'بدون نقص در NIHSS (امتیاز ۰)',
          summary: 'نقص واضح در اسکور دیده نمی‌شود.',
          diagnosisAndTreatment: ['بررسی دقیق حفره خلفی (مخچه/ساقه مغز) و سرگیجه/دیپلوپیا در صورت علائم.'],
          clinicalNotes: ['سکته‌های حفره خلفی ممکن است NIHSS صفر داشته باشند.'],
        };
      }
      if (score <= 4) {
        return {
          score,
          maxScore: 42,
          riskLevel: 'moderate',
          riskTitle: 'سکته خفیف (Minor Stroke · 1–4)',
          summary: 'بررسی ناتوان‌کننده بودن نقص برای تصمیم ترومبولیز.',
          diagnosisAndTreatment: [
            'CT فوری بدون کنتراست؛ در نقص ناتوان‌کننده در پنجره < ۴.۵ ساعت ترومبولیز IV.',
            'در نقص غیرناتوان‌کننده پس از رد خونریزی: شروع DAPT (آسپرین + کلوپیدوگرل).',
          ],
          clinicalNotes: ['فشار خون قبل از ترومبولیز باید < ۱۸۵/۱۱۰ حفظ شود.'],
        };
      }
      if (score <= 15) {
        return {
          score,
          maxScore: 42,
          riskLevel: 'high',
          riskTitle: 'سکته متوسط (Moderate Stroke · 5–15)',
          summary: 'کاندید قوی ترومبولیز IV و در NIHSS ≥ ۶ بررسی CTA برای LVO.',
          diagnosisAndTreatment: [
            'فعال‌سازی کد ۷۲۴، CT فوری و تزریق آلتپلاز/تنکتپلاز در پنجره < ۴.۵ ساعت پس از رد خونریزی.',
            'انجام CTA مغز در NIHSS ≥ ۶ برای ارزیابی ترومبکتومی مکانیکی.',
          ],
          clinicalNotes: ['بدون ترومبولیز فشار خون تا ۲۲۰/۱۲۰ کاهش داده نمی‌شود.'],
        };
      }
      return {
        score,
        maxScore: 42,
        riskLevel: 'critical',
        riskTitle: score <= 20 ? 'سکته متوسط تا شدید (16–20)' : 'سکته شدید (21–42)',
        summary: 'احتمال بالای انسداد عروق بزرگ (LVO) و ادم مغزی.',
        diagnosisAndTreatment: [
          'CT + CTA فوری، ترومبولیز IV در پنجره زمانی و اعزام فوری برای ترومبکتومی مکانیکی.',
          'بستری در استروک یونیت/ICU و پایش راه هوایی و فشار خون.',
        ],
        clinicalNotes: ['در امتیاز > ۲۵ ریسک تبدیل هموراژیک پس از ترومبولیز بالاتر است.'],
      };
    },
  },
  {
    id: 'abcd2',
    titleFa: 'اسکور ABCD² (حمله ایسکمیک گذرا - TIA)',
    titleEn: 'ABCD² Score for TIA Stroke Risk',
    category: 'neurology',
    categoryLabel: 'مغز و اعصاب',
    reference: "Rosen's Emergency Medicine · Johnston SC et al.",
    criteria: [
      { id: 'age60', label: 'سن ۶۰ سال یا بالاتر', type: 'boolean', points: 1 },
      { id: 'bp', label: 'فشار خون ≥ ۱۴۰/۹۰ mmHg', type: 'boolean', points: 1 },
      {
        id: 'clinical',
        label: 'تظاهر بالینی',
        type: 'select',
        options: [
          { label: 'سایر علائم', points: 0 },
          { label: 'اختلال تکلم بدون ضعف', points: 1 },
          { label: 'ضعف یک‌طرفه', points: 2 },
        ],
      },
      {
        id: 'duration',
        label: 'مدت علائم',
        type: 'select',
        options: [
          { label: '< ۱۰ دقیقه', points: 0 },
          { label: '۱۰ تا ۵۹ دقیقه', points: 1 },
          { label: '≥ ۶۰ دقیقه', points: 2 },
        ],
      },
      { id: 'dm', label: 'دیابت ملیتوس', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 3) {
        return {
          score,
          maxScore: 7,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین (خطر استروک ۲ روزه ~1%)',
          summary: 'بررسی سرپایی سریع یا تحت‌نظر کوتاه.',
          diagnosisAndTreatment: ['CT/MRI، ECG، شروع آسپرین و داپلر کاروتید ظرف ۲۴–۴۸ ساعت.'],
          clinicalNotes: ['در تنگی شدید کاروتید یا AF حتی با امتیاز پایین درمان فوری لازم است.'],
        };
      }
      if (score <= 5) {
        return {
          score,
          maxScore: 7,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط (خطر استروک ۲ روزه ~4.1%)',
          summary: 'بستری یا کلینیک فوری TIA ظرف ۲۴ ساعت.',
          diagnosisAndTreatment: ['MRI/CTA عروق گردن و مغز، اکو و شروع DAPT کوتاه‌مدت در امتیاز ≥ ۴.'],
          clinicalNotes: ['هدف کشف سریع تنگی علامت‌دار کاروتید و AF است.'],
        };
      }
      return {
        score,
        maxScore: 7,
        riskLevel: 'high',
        riskTitle: 'ریسک بالا (خطر استروک ۲ روزه ~8.1%)',
        summary: 'بستری فوری نورولوژی.',
        diagnosisAndTreatment: ['بستری، تصویربرداری فوری عروق و پارانشیم مغز و شروع DAPT پس از رد خونریزی.'],
        clinicalNotes: ['از کاهش شدید و ناگهانی فشار خون پرهیز شود.'],
      };
    },
  },
  {
    id: 'ich-score',
    titleFa: 'اسکور ICH (خونریزی داخل مغزی)',
    titleEn: 'Intracerebral Hemorrhage (ICH) Score',
    category: 'neurology',
    categoryLabel: 'مغز و اعصاب',
    reference: "Rosen's Emergency Medicine · Hemphill JC et al.",
    criteria: [
      {
        id: 'gcs',
        label: 'مقیاس کمای گلاسکو (GCS)',
        type: 'select',
        options: [
          { label: '۱۳ تا ۱۵', points: 0 },
          { label: '۵ تا ۱۲', points: 1 },
          { label: '۳ تا ۴', points: 2 },
        ],
      },
      { id: 'vol30', label: 'حجم خونریزی ≥ ۳۰ میلی‌لیتر (فرمول ABC/2)', type: 'boolean', points: 1 },
      { id: 'ivh', label: 'خونریزی داخل بطنی (IVH)', type: 'boolean', points: 1 },
      { id: 'infra', label: 'منشاء اینفراتنتوریال (مخچه یا ساقه مغز)', type: 'boolean', points: 1 },
      { id: 'age80', label: 'سن ۸۰ سال یا بالاتر', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 1) {
        return {
          score,
          maxScore: 6,
          riskLevel: 'moderate',
          riskTitle: score === 0 ? 'مرگ‌ومیر ۳۰ روزه ~0%' : 'مرگ‌ومیر ۳۰ روزه ~13%',
          summary: 'پیش‌آگهی ۳۰ روزه مطلوب به شرط کنترل فوری فشار خون و اصلاح انعقاد.',
          diagnosisAndTreatment: [
            'کاهش تدریجی SBP به حدود ۱۴۰ mmHg (با نیکاردیپین یا لابتالول IV) بدون افت به زیر ۱۳۰.',
            'برگشت فوری آنتی‌کوآگولانت‌ها (ویتامین K/PCC برای وارفارین، پروتامین، آندگزانت/ایدارسوزوماب).',
            'بستری در ICU نورولوژی و مشاوره جراحی اعصاب.',
          ],
          clinicalNotes: ['در خونریزی مخچه > ۳ سانتی‌متر یا هیدروسفالی، دکمپرسیون جراحی فوری نجات‌بخش است.'],
        };
      }
      if (score <= 3) {
        return {
          score,
          maxScore: 6,
          riskLevel: 'high',
          riskTitle: score === 2 ? 'مرگ‌ومیر ۳۰ روزه ~26%' : 'مرگ‌ومیر ۳۰ روزه ~72%',
          summary: 'خطر بالای افزایش ICP، هرنیاسیون و مرگ‌ومیر.',
          diagnosisAndTreatment: [
            'بستری فوری ICU، محافظت راه هوایی، کنترل شدید BP و اصلاح کوآگولوپاتی.',
            'مشاوره اورژانسی جراحی مغز و اعصاب جهت تخلیه هماتوم یا تعبیه EVD در IVH/هیدروسفالی.',
          ],
          clinicalNotes: ['اسکور ICH نباید به تنهایی موجب تصمیم به توقف درمان در ساعات اولیه شود.'],
        };
      }
      return {
        score,
        maxScore: 6,
        riskLevel: 'critical',
        riskTitle: score === 4 ? 'مرگ‌ومیر ۳۰ روزه ~97%' : 'مرگ‌ومیر ۳۰ روزه ~99–100%',
        summary: 'خونریزی بسیار وسیع مغزی با پیش‌آگهی وخیم.',
        diagnosisAndTreatment: [
          'انتوباسیون و کنترل تنفسی، درمان ادم مغزی (مانیتول/سالین هیپرتونیک) و مشاوره جراحی اعصاب/ICU.',
          'گفتگو با خانواده درباره شدت وضعیت بالینی و اهداف مراقبتی.',
        ],
        clinicalNotes: ['همیشه حجم ABC/2 و اثر توده‌ای را به دقت محاسبه کنید.'],
      };
    },
  },
  {
    id: 'hunt-hess',
    titleFa: 'مقیاس هانت و هس (خونریزی زیرعنکبوتیه - SAH)',
    titleEn: 'Hunt and Hess Scale for Subarachnoid Hemorrhage',
    category: 'neurology',
    categoryLabel: 'مغز و اعصاب',
    reference: "Rosen's Emergency Medicine · Hunt WE & Hess RM",
    criteria: [
      {
        id: 'grade',
        label: 'شدت علائم بالینی بیمار',
        type: 'select',
        options: [
          { label: 'گرید ۱: بدون علامت یا سردرد خفیف و سفتی خفیف گردن', points: 1 },
          { label: 'گرید ۲: سردرد متوسط تا شدید، سفتی گردن، بدون نقص عصبی جز فلج عصب کرانیال', points: 2 },
          { label: 'گرید ۳: خواب‌آلودگی، گیجی یا نقص کانونی خفیف', points: 3 },
          { label: 'گرید ۴: استوپور، همی‌پارزی متوسط تا شدید، اختلالات اتونوم', points: 4 },
          { label: 'گرید ۵: کمای عمیق، وضعیت دسربره، ظاهر محتضر', points: 5 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 2) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'moderate',
          riskTitle: `Grade ${score} (بقای بالا ~70–85%)`,
          summary: 'پیش‌آگهی مناسب به شرط تشخیص و درمان زودهنگام آنوریسم.',
          diagnosisAndTreatment: [
            'مشاوره اورژانسی جراحی اعصاب، CTA مغز، کنترل فشار خون (SBP < 160 با لابتالول/نیکاردیپین).',
            'شروع نیمودیپین خوراکی (۶۰ mg هر ۴ ساعت) برای پیشگیری از وازواسپاسم و کنترل درد/تهوع.',
          ],
          clinicalNotes: ['اجتناب از تحریک شدید بیمار و تجویز مسکن مناسب از خونریزی مجدد می‌کاهد.'],
        };
      }
      if (score === 3) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'high',
          riskTitle: 'Grade 3 (ریسک بالا · بقا ~50%)',
          summary: 'نیازمند بستری ICU، پایش سطح هوشیاری و اقدام عروقی/جراحی.',
          diagnosisAndTreatment: [
            'بستری ICU نورولوژی، نیمودیپین، کنترل دقیق BP و بررسی هیدروسفالی برای تعبیه EVD.',
            'آماده‌سازی برای کلیپینگ یا کویلینگ آنوریسم.',
          ],
          clinicalNotes: ['افت سطح هوشیاری ناگهانی نشانه خونریزی مجدد یا هیدروسفالی حاد است.'],
        };
      }
      return {
        score,
        maxScore: 5,
        riskLevel: 'critical',
        riskTitle: `Grade ${score} (بحرانی · مرگ‌ومیر ~70–90%)`,
        summary: 'کمای شدید یا استوپور در SAH؛ احیای راه هوایی و جراحی اعصاب فوری.',
        diagnosisAndTreatment: [
          'انتوباسیون فوری، کنترل ICP، تعبیه EVD اورژانسی و کنترل دقیق همودینامیک.',
          'مشاوره فوری جراحی اعصاب و ICU.',
        ],
        clinicalNotes: ['پروفیلاکسی تشنج کوتاه‌مدت (لوتیراستام) در بیماران پرخطر در نظر گرفته شود.'],
      };
    },
  },
  {
    id: 'ottawa-sah',
    titleFa: 'قانون اتاوا (رد خونریزی زیرعنکبوتیه - SAH)',
    titleEn: 'Ottawa Subarachnoid Hemorrhage (SAH) Rule',
    category: 'neurology',
    categoryLabel: 'مغز و اعصاب',
    reference: "Rosen's Emergency Medicine · Perry JJ et al. JAMA",
    criteria: [
      { id: 'age40', label: 'سن ۴۰ سال یا بالاتر', type: 'boolean', points: 1 },
      { id: 'neckPain', label: 'درد یا سفتی گردن', type: 'boolean', points: 1 },
      { id: 'loc', label: 'کاهش هوشیاری شاهددار (Witnessed LOC)', type: 'boolean', points: 1 },
      { id: 'exertion', label: 'شروع سردرد حین فعالیت بدنی (Exertion)', type: 'boolean', points: 1 },
      { id: 'thunder', label: 'سردرد صاعقه‌ای (اوج شدت در لحظه شروع)', type: 'boolean', points: 1 },
      { id: 'flexLim', label: 'محدودیت فلکشن گردن در معاینه', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 6,
          riskLevel: 'low',
          riskTitle: 'قانون اتاوا SAH منفی (۰ معیار مثبت)',
          summary: 'در سردرد حاد غیرتروماتیک با اوج < ۱ ساعت و معاینه نورولوژیک نرمال، SAH با حساسیت ۱۰۰٪ رد می‌شود.',
          diagnosisAndTreatment: [
            'نیازی به CT مغز یا پونکسیون کمری (LP) برای رد SAH نیست.',
            'درمان علامتی سردرد و پیگیری سرپایی.',
          ],
          clinicalNotes: ['این قانون فقط برای بیماران هوشیار > ۱۵ سال بدون نقص عصبی و بدون سابقه آنوریسم/سردرد مزمن مشابه است.'],
        };
      }
      return {
        score,
        maxScore: 6,
        riskLevel: 'high',
        riskTitle: 'قانون اتاوا SAH مثبت (≥ ۱ معیار)',
        summary: 'نیازمند بررسی تصویربرداری برای رد خونریزی زیرعنکبوتیه است.',
        diagnosisAndTreatment: [
          'انجام CT اسکن مغز بدون کنتراست؛ اگر ظرف ۶ ساعت از شروع سردرد انجام و توسط رادیولوژیست منفی گزارش شود، حساسیت ~99–100% دارد.',
          'اگر بیش از ۶ ساعت گذشته و CT منفی است: انجام LP (یا CTA طبق پروتکل) برای بررسی زانتوکرومی و RBC.',
        ],
        clinicalNotes: ['ویژگی این قانون پایین است، یعنی مثبت شدن آن برای جا نینداختن هیچ مورد SAH طراحی شده است.'],
      };
    },
  },
  {
    id: 'hints-exam',
    titleFa: 'معاینه HINTS (سرگیجه حاد و AVS)',
    titleEn: 'HINTS Exam (Central vs Peripheral Vertigo)',
    category: 'neurology',
    categoryLabel: 'مغز و اعصاب',
    reference: "Rosen's Emergency Medicine · Kattah JC et al. Stroke",
    criteria: [
      { id: 'hiNormal', label: 'Head Impulse Test نرمال (بدون ساکاد جبرانی — نشانه مرکزی)', type: 'boolean', points: 1 },
      { id: 'nystagmus', label: 'نیستاگموس تغییرجهت‌دهنده (Direction-changing) یا عمودی/چرخشی خالص', type: 'boolean', points: 1 },
      { id: 'skew', label: 'انحراف عمودی چشم در تست پوشاندن متناوب (Skew Deviation مثبت)', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 3,
          riskLevel: 'low',
          riskTitle: 'الگوی محیطی (Peripheral · نوریت وستیبولار)',
          summary: 'هر ۳ معیار به نفع ضایعه محیطی است (HIT غیرنرمال با ساکاد، نیستاگموس یک‌طرفه افقی، بدون Skew).',
          diagnosisAndTreatment: [
            'در نبود کاهش شنوایی حاد یا آتاکسی شدید تنه (ناتوانی در نشستن/ایستادن): درمان حمایتی نوریت وستیبولار (کورتون کوتاه‌مدت و آنتی‌هیستامین/بنزودیازپین کوتاه‌مدت).',
          ],
          clinicalNotes: ['تست HINTS فقط در سندرم وستیبولار حاد مداوم (AVS همراه با نیستاگموس خودبه‌خودی) معتبر است، نه در BPPV اپیزودیک!'],
        };
      }
      return {
        score,
        maxScore: 3,
        riskLevel: 'critical',
        riskTitle: 'هشدار ضایعه مرکزی / سکته حفره خلفی (HINTS نگران‌کننده)',
        summary: 'وجود حتی ۱ مورد از ۳ علامت به نفع سکته ساقه مغز یا مخچه است (حساسیت بیشتر از MRI زودهنگام!).',
        diagnosisAndTreatment: [
          'مشاوره فوری نورولوژی، بررسی کد سکته و انجام MRI DWI مغز + MRA/CTA عروق حفره خلفی.',
          'توجه: CT اسکن مغز بدون کنتراست حساسیت پایینی برای سکته ساقه مغز/مخچه دارد و آن را رد نمی‌کند.',
        ],
        clinicalNotes: ['در HINTS PLUS، همراهی با کاهش شنوایی ناگهانی یک‌طرفه نیز نشانه ایسکمی شریان AICA محسوب می‌شود.'],
      };
    },
  },
  {
    id: 'qsofa',
    titleFa: 'اسکور qSOFA (سپسیس در اورژانس)',
    titleEn: 'Quick SOFA (qSOFA) for Sepsis',
    category: 'infectious',
    categoryLabel: 'عفونت و سپسیس',
    reference: "Rosen's Emergency Medicine · Singer M et al.",
    criteria: [
      { id: 'rr22', label: 'تعداد تنفس ≥ ۲۲ در دقیقه', type: 'boolean', points: 1 },
      { id: 'gcs', label: 'کاهش سطح هوشیاری (GCS < 15)', type: 'boolean', points: 1 },
      { id: 'sbp100', label: 'فشار خون سیستولیک ≤ ۱۰۰ mmHg', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score < 2) {
        return {
          score,
          maxScore: 3,
          riskLevel: score === 0 ? 'low' : 'moderate',
          riskTitle: 'qSOFA منفی (< 2)',
          summary: 'سپسیس را رد نمی‌کند؛ همراه با معیارهای SIRS و قضاوت بالینی تفسیر شود.',
          diagnosisAndTreatment: ['بررسی کانون عفونت و ارسال لاکتات در صورت شک بالینی به عفونت شدید.'],
          clinicalNotes: ['Surviving Sepsis توصیه می‌کند qSOFA به تنهایی برای رد سپسیس استفاده نشود.'],
        };
      }
      return {
        score,
        maxScore: 3,
        riskLevel: 'critical',
        riskTitle: 'qSOFA مثبت (≥ 2 · پرخطر)',
        summary: 'فعال‌سازی فوری باندل ۱ ساعته سپسیس.',
        diagnosisAndTreatment: [
          'ارسال لاکتات و ۲ ست کشت خون و شروع فوری آنتی‌بیوتیک IV وسیع‌الطیف طی ۱ ساعت اول.',
          'در هیپوتانسیون یا لاکتات ≥ ۴: بولوس ۳۰ mL/kg کریستالوئید و نوراپی‌نفرین برای MAP ≥ 65.',
        ],
        clinicalNotes: ['در نارسایی قلب/کلیه احیای مایع با پایش مکرر پاسخ به مایع انجام شود.'],
      };
    },
  },
  {
    id: 'sirs',
    titleFa: 'معیارهای SIRS (پاسخ التهابی سیستمیک)',
    titleEn: 'Systemic Inflammatory Response Syndrome (SIRS)',
    category: 'infectious',
    categoryLabel: 'عفونت و سپسیس',
    reference: "Rosen's Emergency Medicine · Bone RC et al.",
    criteria: [
      { id: 'temp', label: 'تب > ۳۸°C یا هیپوترمی < ۳۶°C', type: 'boolean', points: 1 },
      { id: 'hr90', label: 'ضربان قلب > ۹۰ در دقیقه', type: 'boolean', points: 1 },
      { id: 'rr20', label: 'تعداد تنفس > ۲۰ یا PaCO2 < 32 mmHg', type: 'boolean', points: 1 },
      { id: 'wbc', label: 'WBC > 12,000 یا < 4,000 یا > 10% باند فرم', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score < 2) {
        return {
          score,
          maxScore: 4,
          riskLevel: 'low',
          riskTitle: 'SIRS منفی (< 2 معیار)',
          summary: 'پاسخ التهابی سیستمیک کامل وجود ندارد.',
          diagnosisAndTreatment: ['درمان کانون موضعی در صورت وجود عفونت و پیگیری علائم حیاتی.'],
          clinicalNotes: ['در سالمندان و بیماران سرکوب ایمنی، عفونت شدید ممکن است بدون تب یا لکوسیتوز رخ دهد.'],
        };
      }
      return {
        score,
        maxScore: 4,
        riskLevel: score >= 3 ? 'high' : 'moderate',
        riskTitle: 'SIRS مثبت (≥ 2 معیار)',
        summary: 'در حضور کانون عفونی به معنی سپسیس است (یا در نبود عفونت: پانکراتیت، تروما، سوختگی، PE).',
        diagnosisAndTreatment: [
          'بررسی دقیق کانون عفونت، ارسال کشت‌ها، لاکتات سرم و ارزیابی عملکرد ارگان‌ها.',
          'در صورت شک قوی به عفونت باکتریال سیستمیک، شروع سریع آنتی‌بیوتیک مناسب.',
        ],
        clinicalNotes: ['حساسیت SIRS برای غربالگری اولیه سپسیس در اورژانس از qSOFA بیشتر است.'],
      };
    },
  },
  {
    id: 'news2',
    titleFa: 'اسکور هشدار زودهنگام (NEWS2)',
    titleEn: 'National Early Warning Score 2 (NEWS2)',
    category: 'infectious',
    categoryLabel: 'عفونت و سپسیس',
    reference: "Rosen's Emergency Medicine · Royal College of Physicians",
    criteria: [
      {
        id: 'rr',
        label: 'تعداد تنفس (RR)',
        type: 'select',
        defaultValue: 2,
        options: [
          { label: '≤ ۸ در دقیقه (+۳)', points: 3 },
          { label: '۹ تا ۱۱ (+۱)', points: 1 },
          { label: '۱۲ تا ۲۰ (۰)', points: 0 },
          { label: '۲۱ تا ۲۴ (+۲)', points: 2 },
          { label: '≥ ۲۵ در دقیقه (+۳)', points: 3 },
        ],
      },
      {
        id: 'spo2',
        label: 'اشباع اکسیژن (SpO2)',
        type: 'select',
        defaultValue: 3,
        options: [
          { label: '≤ ۹۱٪ (+۳)', points: 3 },
          { label: '۹۲ تا ۹۳٪ (+۲)', points: 2 },
          { label: '۹۴ تا ۹۵٪ (+۱)', points: 1 },
          { label: '≥ ۹۶٪ (۰)', points: 0 },
        ],
      },
      { id: 'o2sup', label: 'نیاز به اکسیژن کمکی (Supplemental O2)', type: 'boolean', points: 2 },
      {
        id: 'sbp',
        label: 'فشار خون سیستولیک (SBP)',
        type: 'select',
        defaultValue: 3,
        options: [
          { label: '≤ ۹۰ mmHg (+۳)', points: 3 },
          { label: '۹۱ تا ۱۰۰ (+۲)', points: 2 },
          { label: '۱۰۱ تا ۱۱۰ (+۱)', points: 1 },
          { label: '۱۱۱ تا ۲۱۹ (۰)', points: 0 },
          { label: '≥ ۲۲۰ mmHg (+۳)', points: 3 },
        ],
      },
      {
        id: 'hr',
        label: 'ضربان قلب (HR)',
        type: 'select',
        defaultValue: 2,
        options: [
          { label: '≤ ۴۰ در دقیقه (+۳)', points: 3 },
          { label: '۴۱ تا ۵۰ (+۱)', points: 1 },
          { label: '۵۱ تا ۹۰ (۰)', points: 0 },
          { label: '۹۱ تا ۱۱۰ (+۱)', points: 1 },
          { label: '۱۱۱ تا ۱۳۰ (+۲)', points: 2 },
          { label: '≥ ۱۳۱ در دقیقه (+۳)', points: 3 },
        ],
      },
      { id: 'avpu', label: 'اختلال هوشیاری جدید (V، P، U یا گیجی حاد)', type: 'boolean', points: 3 },
      {
        id: 'temp',
        label: 'دمای بدن',
        type: 'select',
        defaultValue: 2,
        options: [
          { label: '≤ ۳۵.۰°C (+۳)', points: 3 },
          { label: '۳۵.۱ تا ۳۶.۰°C (+۱)', points: 1 },
          { label: '۳۶.۱ تا ۳۸.۰°C (۰)', points: 0 },
          { label: '۳۸.۱ تا ۳۹.۰°C (+۱)', points: 1 },
          { label: '≥ ۳۹.۱°C (+۲)', points: 2 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 4) {
        return {
          score,
          maxScore: 20,
          riskLevel: 'low',
          riskTitle: 'ریسک بالینی پایین (0–4)',
          summary: 'ثبات فیزیولوژیک نسبی (مگر وجود نمره ۳ در یک پارامتر منفرد).',
          diagnosisAndTreatment: ['پایش روتین علائم حیاتی و ادامه ارزیابی استاندارد در اورژانس.'],
          clinicalNotes: ['نمره ۳ در یک پارامتر به‌تنهایی آستانه هشدار فوری را فعال می‌کند.'],
        };
      }
      if (score <= 6) {
        return {
          score,
          maxScore: 20,
          riskLevel: 'moderate',
          riskTitle: 'ریسک بالینی متوسط (5–6)',
          summary: 'نیازمند ارزیابی فوری پزشک اورژانس و پایش مکرر.',
          diagnosisAndTreatment: ['ارزیابی سپسیس/شوک، لاکتات سرم، کنترل علائم حیاتی هر ۳۰–۶۰ دقیقه و بستری.'],
          clinicalNotes: ['آستانه NEWS2 ≥ ۵ بهترین توازن حساسیت و ویژگی برای کشف سپسیس حاد در اورژانس است.'],
        };
      }
      return {
        score,
        maxScore: 20,
        riskLevel: 'critical',
        riskTitle: 'ریسک بالینی بالا (≥ 7)',
        summary: 'بیمار بدحال در معرض ایست قلبی-تنفسی یا نیاز فوری به ICU.',
        diagnosisAndTreatment: ['انتقال به اتاق احیا، پایش مداوم، احیای ABC، آنتی‌بیوتیک/مایع در سپسیس و مشاوره فوری ICU.'],
        clinicalNotes: ['NEWS2 در ارزیابی تریاژ و پاسخ به درمان اورژانس کاربرد گسترده دارد.'],
      };
    },
  },
  {
    id: 'centor-mcisaac',
    titleFa: 'اسکور Centor / McIsaac (فارنژیت)',
    titleEn: 'Modified Centor (McIsaac) Score',
    category: 'infectious',
    categoryLabel: 'عفونت و سپسیس',
    reference: "Rosen's Emergency Medicine · McIsaac WJ et al.",
    criteria: [
      { id: 'exudate', label: 'اگزودا یا تورم لوزه‌ها', type: 'boolean', points: 1 },
      { id: 'nodes', label: 'آدنوپاتی قدامی گردنی دردناک', type: 'boolean', points: 1 },
      { id: 'fever', label: 'تب بالای ۳۸°C', type: 'boolean', points: 1 },
      { id: 'noCough', label: 'نبود سرفه', type: 'boolean', points: 1 },
      {
        id: 'ageGroup',
        label: 'رده سنی',
        type: 'select',
        options: [
          { label: '۳ تا ۱۴ سال (+۱)', points: 1 },
          { label: '۱۵ تا ۴۴ سال (۰)', points: 0 },
          { label: '≥ ۴۵ سال (۱-)', points: -1 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 1) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'low',
          riskTitle: 'احتمال پایین GAS (~1–10%)',
          summary: 'بدون نیاز به تست یا آنتی‌بیوتیک.',
          diagnosisAndTreatment: ['درمان علامتی با مسکن و مایعات گرم.'],
          clinicalNotes: ['رد علائم خطر مثل تریسموس یا استریدور.'],
        };
      }
      if (score <= 3) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'moderate',
          riskTitle: 'احتمال متوسط GAS (~15–35%)',
          summary: 'انجام تست سریع استرپ (RADT) و درمان در صورت مثبت.',
          diagnosisAndTreatment: ['تجویز پنی‌سیلین V یا آموکسی‌سیلین به مدت ۱۰ روز فقط با تست مثبت.'],
          clinicalNotes: ['آزیترومایسین یا کلیندامایسین در آلرژی پنی‌سیلین.'],
        };
      }
      return {
        score,
        maxScore: 5,
        riskLevel: 'high',
        riskTitle: 'احتمال بالای GAS (~51–53%)',
        summary: 'شروع درمان آنتی‌بیوتیکی تجربی یا همراه با تست سریع.',
        diagnosisAndTreatment: ['آموکسی‌سیلین خوراکی ۱۰ روزه یا تک‌دوز پنی‌سیلین بنزاتین IM.'],
        clinicalNotes: ['تکمیل دوره درمان برای پیشگیری از تب روماتیسمی.'],
      };
    },
  },
  {
    id: 'lrinec',
    titleFa: 'اسکور LRINEC (فاشئیت نکروزان)',
    titleEn: 'LRINEC Score for Necrotizing Fasciitis',
    category: 'infectious',
    categoryLabel: 'عفونت و سپسیس',
    reference: "Rosen's Emergency Medicine · Wong CH et al.",
    criteria: [
      { id: 'crp', label: 'CRP ≥ ۱۵۰ mg/L (۱۵ mg/dL)', type: 'boolean', points: 4 },
      {
        id: 'wbc',
        label: 'گلبول سفید (WBC)',
        type: 'select',
        options: [
          { label: '< ۱۵,۰۰۰', points: 0 },
          { label: '۱۵,۰۰۰ تا ۲۵,۰۰۰', points: 1 },
          { label: '> ۲۵,۰۰۰', points: 2 },
        ],
      },
      {
        id: 'hb',
        label: 'هموگلوبین (Hb)',
        type: 'select',
        options: [
          { label: '> ۱۳.۵ g/dL', points: 0 },
          { label: '۱۱ تا ۱۳.۵ g/dL', points: 1 },
          { label: '< ۱۱ g/dL', points: 2 },
        ],
      },
      { id: 'na', label: 'سدیم سرم < ۱۳۵ mEq/L', type: 'boolean', points: 2 },
      { id: 'cr', label: 'کراتینین > ۱.۶ mg/dL', type: 'boolean', points: 2 },
      { id: 'glu', label: 'قند خون > ۱۸۰ mg/dL', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 5) {
        return {
          score,
          maxScore: 13,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین بر اساس آزمایش (< 50%)',
          summary: 'اسکور پایین فاشئیت نکروزان را به‌طور قطعی رد نمی‌کند.',
          diagnosisAndTreatment: ['پایش مکرر درد؛ در درد نامتناسب با ظاهر زخم یا کرپیتاسیون مشاوره فوری جراحی بگیرید.'],
          clinicalNotes: ['قضاوت بالینی همیشه بر عدد LRINEC اولویت دارد.'],
        };
      }
      if (score <= 7) {
        return {
          score,
          maxScore: 13,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط (50–75%)',
          summary: 'ظن قوی به عفونت نکروزان بافت نرم.',
          diagnosisAndTreatment: ['مشاوره فوری جراحی و شروع آنتی‌بیوتیک وسیع‌الطیف + کلیندامایسین.'],
          clinicalNotes: ['تصویربرداری نباید باعث تاخیر ورود به اتاق عمل شود.'],
        };
      }
      return {
        score,
        maxScore: 13,
        riskLevel: 'critical',
        riskTitle: 'ریسک بالا (> 75%)',
        summary: 'اورژانس جراحی با مرگ‌ومیر بالا.',
        diagnosisAndTreatment: [
          'اکسپلوراسیون و دبریدمان اورژانسی جراحی.',
          'ونکومایسین + پیپراسیلین/تازوباکتام یا مروپنم + کلیندامایسین IV و بستری ICU.',
        ],
        clinicalNotes: ['دبریدمان زودهنگام مهم‌ترین عامل تعیین‌کننده بقا است.'],
      };
    },
  },
  {
    id: 'mascc-fn',
    titleFa: 'شاخص ریسک MASCC (نوتروپنی تب‌دار)',
    titleEn: 'MASCC Risk Index for Febrile Neutropenia',
    category: 'infectious',
    categoryLabel: 'عفونت و سپسیس',
    reference: "Rosen's Emergency Medicine · Klastersky J et al.",
    criteria: [
      {
        id: 'burden',
        label: 'شدت علائم بیماری نوتروپنی تب‌دار',
        type: 'select',
        options: [
          { label: 'شدید (۰ امتیاز)', points: 0 },
          { label: 'متوسط (+۳ امتیاز)', points: 3 },
          { label: 'بدون علامت یا علائم خفیف (+۵ امتیاز)', points: 5 },
        ],
      },
      { id: 'noHypo', label: 'بدون افت فشار خون (SBP > 90 mmHg)', type: 'boolean', points: 5 },
      { id: 'noCopd', label: 'نبود COPD فعال', type: 'boolean', points: 4 },
      { id: 'solidTumor', label: 'تومور توپر (Solid tumor) یا بدخیمی خونی بدون سابقه عفونت قارچی قبلی', type: 'boolean', points: 4 },
      { id: 'noDehyd', label: 'نبود دهیدراتاسیون نیازمند مایع وریدی', type: 'boolean', points: 3 },
      { id: 'outpatient', label: 'وضعیت سرپایی در زمان شروع تب', type: 'boolean', points: 3 },
      { id: 'age60', label: 'سن کمتر از ۶۰ سال', type: 'boolean', points: 2 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score >= 21) {
        return {
          score,
          maxScore: 26,
          riskLevel: 'low',
          riskTitle: 'کم‌خطر در نوتروپنی تب‌دار (MASCC ≥ 21)',
          summary: 'ریسک پایین عوارض جدی (< ۵٪)؛ در شرایط بالینی و اجتماعی پایدار امکان درمان خوراکی با هماهنگی انکولوژی.',
          diagnosisAndTreatment: [
            'کشت خون (محیطی و از کاتتر)، CBC/Diff و دوز اول آنتی‌بیوتیک در اورژانس طی ۱ ساعت.',
            'در صورت پایداری و تایید انکولوژیست: سیپروفلوکساسین + کوآموکسی‌کلاو خوراکی با پیگیری روزانه.',
          ],
          clinicalNotes: ['در MASCC برخلاف اکثر اسکورها، نمره بالاتر به معنای ریسک کمتر است.'],
        };
      }
      return {
        score,
        maxScore: 26,
        riskLevel: 'critical',
        riskTitle: 'پرخطر در نوتروپنی تب‌دار (MASCC < 21)',
        summary: 'نیازمند بستری فوری و آنتی‌بیوتیک وریدی با پوشش سودوموناس.',
        diagnosisAndTreatment: [
          'شروع فوری آنتی‌بیوتیک IV طی ≤ ۶۰ دقیقه (سفپیم، پیپراسیلین-تازوباکتام یا مروپنم؛ اضافه کردن ونکومایسین در عفونت کاتتر/همودینامیک ناپایدار/موکوزیت شدید).',
          'بستری در اتاق ایزوله و مشاوره انکولوژی/عفونی.',
        ],
        clinicalNotes: ['تاخیر در شروع آنتی‌بیوتیک در نوتروپنی تب‌دار مرگ‌ومیر را به‌شدت افزایش می‌دهد.'],
      };
    },
  },
];
