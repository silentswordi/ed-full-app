import { ClinicalScoreDefinition, sumCriteria } from '../types';

export const TRAUMA_GI_OTHER_SCORES: ClinicalScoreDefinition[] = [
  // ================= TRAUMA & ORTHOPEDICS =================
  {
    id: 'nexus-cspine',
    titleFa: 'معیارهای NEXUS (پاک‌سازی گردن)',
    titleEn: 'NEXUS Criteria for Cervical Spine Imaging',
    category: 'trauma',
    categoryLabel: 'تروما و ارتوپدی',
    reference: "Rosen's Emergency Medicine · Hoffman JR et al.",
    criteria: [
      { id: 'tenderness', label: 'تندرنس خط وسط پشت گردن', type: 'boolean', points: 1 },
      { id: 'neuro', label: 'نقص عصبی کانونی', type: 'boolean', points: 1 },
      { id: 'alertness', label: 'کاهش یا اختلال سطح هوشیاری (GCS < 15)', type: 'boolean', points: 1 },
      { id: 'intox', label: 'مسمومیت یا مستی', type: 'boolean', points: 1 },
      { id: 'distract', label: 'درد منحرف‌کننده شدید', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'low',
          riskTitle: 'NEXUS منفی (۰ معیار مثبت)',
          summary: 'آسیب ستون فقرات گردنی با حساسیت ۹۹٪ رد می‌شود.',
          diagnosisAndTreatment: ['عدم نیاز به تصویربرداری و امکان باز کردن کولار پس از تست چرخش بدون درد گردن.'],
          clinicalNotes: ['در سنین بالای ۶۵ سال آستانه تصویربرداری CT را پایین‌تر در نظر بگیرید.'],
        };
      }
      return {
        score,
        maxScore: 5,
        riskLevel: 'high',
        riskTitle: 'NEXUS مثبت (≥ ۱ معیار)',
        summary: 'حفظ کولار و درخواست تصویربرداری گردن.',
        diagnosisAndTreatment: ['حفظ بی‌حرکتی و انجام CT اسکن ستون فقرات گردنی (و MRI در نقص عصبی).'],
        clinicalNotes: ['هر ۵ معیار باید منفی باشند تا پاک‌سازی بالینی مجاز باشد.'],
      };
    },
  },
  {
    id: 'canadian-cspine',
    titleFa: 'قانون کانادایی ستون فقرات گردنی (CCR)',
    titleEn: 'Canadian C-Spine Rule (CCR)',
    category: 'trauma',
    categoryLabel: 'تروما و ارتوپدی',
    reference: "Rosen's Emergency Medicine · Stiell IG et al.",
    criteria: [
      { id: 'highRisk', label: 'عامل پرخطر: سن ≥ ۶۵، مکانیسم خطرناک (سقوط >1m، برخورد >100km/h، چپ‌کردن، موتور/دوچرخه) یا پارستزی اندام‌ها', type: 'boolean', points: 10 },
      { id: 'noLowRisk', label: 'نبود هیچ عامل کم‌خطر (مثل تصادف ساده از پشت، نشسته در اورژانس، راه‌رفته پس از حادثه، درد تاخیری، نبود تندرنس خط وسط)', type: 'boolean', points: 5 },
      { id: 'noRotate', label: 'ناتوانی در چرخش فعال گردن ۴۵ درجه به چپ و راست', type: 'boolean', points: 3 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score: 0,
          riskLevel: 'low',
          riskTitle: 'پاک‌سازی امن گردن بدون تصویربرداری',
          summary: 'هیچ عامل پرخطری وجود ندارد، حداقل یک عامل کم‌خطر برقرار است و چرخش ۴۵ درجه مقدور است.',
          diagnosisAndTreatment: ['عدم نیاز به رادیوگرافی یا CT ستون فقرات گردنی و باز کردن کولار گردنی.'],
          clinicalNotes: ['قانون CCR در بیماران هوشیار (GCS 15) و پایدار ترومایی حساسیت ~99.4% دارد.'],
        };
      }
      return {
        score,
        riskLevel: 'high',
        riskTitle: 'اندیکاسیون تصویربرداری ستون فقرات گردنی',
        summary: 'نمی‌توان گردن را به‌صورت بالینی پاک کرد.',
        diagnosisAndTreatment: ['حفظ کولار گردنی و درخواست CT اسکن (یا گرافی استاندارد ۳ نما) ستون فقرات گردنی.'],
        clinicalNotes: ['تا پیش از بررسی عوامل پرخطر و کم‌خطر، تست چرخش فعال گردن را انجام ندهید.'],
      };
    },
  },
  {
    id: 'canadian-ct-head',
    titleFa: 'قانون کانادایی CT مغز در ترومای خفیف',
    titleEn: 'Canadian CT Head Rule (CCHR)',
    category: 'trauma',
    categoryLabel: 'تروما و ارتوپدی',
    reference: "Rosen's Emergency Medicine · Stiell IG et al.",
    criteria: [
      { id: 'gcs15', label: 'GCS کمتر از ۱۵ در ۲ ساعت پس از تروما', type: 'boolean', points: 2 },
      { id: 'openSkull', label: 'شک به شکستگی باز یا فرورفته جمجمه', type: 'boolean', points: 2 },
      { id: 'basilar', label: 'علائم شکستگی قاعده جمجمه (هموتیمپانوم، چشم راکونی، اتوره/رینوره، بتل ساین)', type: 'boolean', points: 2 },
      { id: 'vomit2', label: 'استفراغ ۲ بار یا بیشتر', type: 'boolean', points: 2 },
      { id: 'age65', label: 'سن ۶۵ سال یا بالاتر', type: 'boolean', points: 2 },
      { id: 'amnesia', label: 'فراموشی رتروگراد ≥ ۳۰ دقیقه قبل از ضربه', type: 'boolean', points: 1 },
      { id: 'mech', label: 'مکانیسم خطرناک (برخورد خودرو با عابر، پرتاب از خودرو، سقوط > ۹۰ سانتی‌متر یا ۵ پله)', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 12,
          riskLevel: 'low',
          riskTitle: 'عدم نیاز به CT مغز',
          summary: 'در ترومای خفیف سر (GCS 13–15) بدون مصرف ضدانعقاد، احتمال ضایعه جراحی‌شونده نزدیک به صفر است.',
          diagnosisAndTreatment: ['پایش کوتاه یا ترخیص با برگه علائم هشدار آسیب سر و مراقب همراه.'],
          clinicalNotes: ['در بیماران مصرف‌کننده ضدانعقاد، اختلال انعقادی یا سن زیر ۱۶ سال این قانون به تنهایی کافی نیست و CT لازم است.'],
        };
      }
      return {
        score,
        maxScore: 12,
        riskLevel: score >= 2 ? 'high' : 'moderate',
        riskTitle: 'اندیکاسیون CT اسکن مغز بدون کنتراست',
        summary: 'معیارهای پرخطر (امتیاز ۲) یا متوسط (امتیاز ۱) وجود دارد.',
        diagnosisAndTreatment: ['انجام CT مغز بدون کنتراست و در صورت ضایعه، مشاوره جراحی مغز و اعصاب.'],
        clinicalNotes: ['۵ معیار اول ریسک بالای نیاز به مداخله جراحی مغز و اعصاب را پیش‌بینی می‌کنند.'],
      };
    },
  },
  {
    id: 'pecarn-head',
    titleFa: 'قانون PECARN (ترومای سر کودکان)',
    titleEn: 'PECARN Pediatric Head Injury Rule',
    category: 'trauma',
    categoryLabel: 'تروما و ارتوپدی',
    reference: "Rosen's Emergency Medicine · Kuppermann N et al. Lancet",
    criteria: [
      { id: 'gcs14', label: 'GCS ≤ ۱۴ یا علائم تغییر سطح هوشیاری (آژیتاسیون، خواب‌آلودگی، سوال تکراری)', type: 'boolean', points: 10 },
      { id: 'skullFx', label: 'شکستگی قابل لمس جمجمه (در <۲ سال) یا علائم شکستگی قاعده جمجمه (در ≥۲ سال)', type: 'boolean', points: 10 },
      { id: 'hematoma', label: 'هماتوم غیرپیشانی اسکالپ در <۲ سال، یا سابقه استفراغ/LOC > 5s/سردرد شدید', type: 'boolean', points: 1 },
      { id: 'severeMech', label: 'مکانیسم شدید (سقوط > 0.9m در <2y یا > 1.5m در ≥2y، تصادف شدید)', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score: 0,
          riskLevel: 'low',
          riskTitle: 'ریسک بسیار پایین (< 0.05% آسیب بالینی مهم)',
          summary: 'کودک بدون نیاز به CT مغز قابل ترخیص یا تحت‌نظر کوتاه است.',
          diagnosisAndTreatment: ['پرهیز از تابش غیرضروری اشعه CT و آموزش والدین درباره علائم هشدار.'],
          clinicalNotes: ['PECARN معتبرترین قانون ترومای سر کودکان در طب اورژانس روزن است.'],
        };
      }
      if (score >= 10) {
        return {
          score,
          riskLevel: 'critical',
          riskTitle: 'ریسک بالای آسیب مغزی بالینی مهم (~4.3%)',
          summary: 'اندیکاسیون قطعی CT اسکن مغز بدون کنتراست.',
          diagnosisAndTreatment: ['انجام فوری CT مغز و مشاوره جراحی اعصاب در صورت یافته‌های مثبت.'],
          clinicalNotes: ['کاهش هوشیاری و شکستگی قابل لمس/قاعده جمجمه بالاترین ارزش پیش‌بینی را دارند.'],
        };
      }
      return {
        score,
        riskLevel: 'moderate',
        riskTitle: 'ریسک متوسط (~0.9%)',
        summary: 'تحت‌نظر ۴ تا ۶ ساعته در اورژانس یا انجام CT بر اساس تعدد علائم و تجربه پزشک.',
        diagnosisAndTreatment: ['نگهداری تحت‌نظر دقیق در اورژانس؛ در صورت بدتر شدن یا تعدد معیارها انجام CT مغز.'],
        clinicalNotes: ['داشتن تنها یک علامت منفرد اغلب با تحت‌نظر دقیق بدون CT قابل مدیریت است.'],
      };
    },
  },
  {
    id: 'nexus-chest',
    titleFa: 'معیارهای NEXUS قفسه سینه (ترومای کند)',
    titleEn: 'NEXUS Chest Decision Instrument',
    category: 'trauma',
    categoryLabel: 'تروما و ارتوپدی',
    reference: "Rosen's Emergency Medicine · Rodriguez RM et al.",
    criteria: [
      { id: 'age60', label: 'سن بالای ۶۰ سال', type: 'boolean', points: 1 },
      { id: 'rapidDecel', label: 'مکانیسم کاهش سرعت سریع (سقوط >۶ متر یا تصادف >۶۵ km/h)', type: 'boolean', points: 1 },
      { id: 'chestPain', label: 'درد قفسه سینه', type: 'boolean', points: 1 },
      { id: 'intox', label: 'مسمومیت / مستی', type: 'boolean', points: 1 },
      { id: 'altered', label: 'کاهش یا اختلال سطح هوشیاری', type: 'boolean', points: 1 },
      { id: 'distract', label: 'آسیب منحرف‌کننده دردناک', type: 'boolean', points: 1 },
      { id: 'tenderness', label: 'تندرنس در لمس دیواره قفسه سینه', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 7,
          riskLevel: 'low',
          riskTitle: 'NEXUS Chest منفی (۰ معیار)',
          summary: 'آسیب مهم داخل قفسه سینه با حساسیت ~99% رد می‌شود.',
          diagnosisAndTreatment: ['در بیمار بالای ۱۴ سال هوشیار، نیازی به رادیوگرافی یا CT قفسه سینه نیست.'],
          clinicalNotes: ['در بیمار ناپایدار یا ترومای نافذ کاربرد ندارد.'],
        };
      }
      return {
        score,
        maxScore: 7,
        riskLevel: 'high',
        riskTitle: 'NEXUS Chest مثبت (≥ ۱ معیار)',
        summary: 'اندیکاسیون تصویربرداری قفسه سینه (CXR و در مکانیسم شدید CT).',
        diagnosisAndTreatment: ['انجام CXR اولیه (و CT آنژیو قفسه سینه در مکانیسم کاهش سرعت شدید یا مدیاستن پهن).'],
        clinicalNotes: ['سونوگرافی eFAST کنار تخت برای پنوموتوراکس و هموتوراکس بسیار سریع و دقیق است.'],
      };
    },
  },
  {
    id: 'ottawa-ankle',
    titleFa: 'قوانین اتاوا (مچ و میدفوت پا)',
    titleEn: 'Ottawa Ankle & Midfoot Rules',
    category: 'trauma',
    categoryLabel: 'تروما و ارتوپدی',
    reference: "Rosen's Emergency Medicine · Stiell IG et al.",
    criteria: [
      { id: 'latMal', label: 'تندرنس لبه خلفی یا نوک قوزک خارجی', type: 'boolean', points: 1 },
      { id: 'medMal', label: 'تندرنس لبه خلفی یا نوک قوزک داخلی', type: 'boolean', points: 1 },
      { id: 'navicular', label: 'تندرنس استخوان ناویکولار', type: 'boolean', points: 1 },
      { id: 'fifthMt', label: 'تندرنس قاعده متاتارس پنجم', type: 'boolean', points: 1 },
      { id: 'weightBear', label: 'ناتوانی در تحمل وزن (۴ قدم متوالی)', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'low',
          riskTitle: 'قانون اتاوا منفی',
          summary: 'احتمال شکستگی بسیار ناچیز (~1%).',
          diagnosisAndTreatment: ['عدم نیاز به رادیوگرافی؛ درمان حمایتی اسپری‌ن مچ پا و مسکن.'],
          clinicalNotes: ['در نوروپاتی محیطی یا کاهش هوشیاری معتبر نیست.'],
        };
      }
      return {
        score,
        maxScore: 5,
        riskLevel: 'high',
        riskTitle: 'قانون اتاوا مثبت (≥ ۱ معیار)',
        summary: 'اندیکاسیون رادیوگرافی مچ پا و/یا فوت.',
        diagnosisAndTreatment: ['گرافی مچ (AP، Lat، Mortise) یا فوت، بی‌حرکتی موقت و کنترل درد.'],
        clinicalNotes: ['در درد قوزک داخلی کل طول فیبولا برای شکستگی Maisonneuve لمس شود.'],
      };
    },
  },
  {
    id: 'ottawa-knee',
    titleFa: 'قانون اتاوا (آسیب زانو)',
    titleEn: 'Ottawa Knee Rule',
    category: 'trauma',
    categoryLabel: 'تروما و ارتوپدی',
    reference: "Rosen's Emergency Medicine · Stiell IG et al.",
    criteria: [
      { id: 'age55', label: 'سن ۵۵ سال یا بالاتر', type: 'boolean', points: 1 },
      { id: 'patella', label: 'تندرنس ایزوله کشکک', type: 'boolean', points: 1 },
      { id: 'fibHead', label: 'تندرنس سر فیبولا', type: 'boolean', points: 1 },
      { id: 'flex90', label: 'ناتوانی در خم کردن زانو تا ۹۰ درجه', type: 'boolean', points: 1 },
      { id: 'weight4', label: 'ناتوانی در تحمل وزن (۴ قدم)', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'low',
          riskTitle: 'قانون زانوی اتاوا منفی',
          summary: 'نیازی به رادیوگرافی زانو نیست.',
          diagnosisAndTreatment: ['ارزیابی لیگامان‌ها، منیسک و وضعیت عروقی-عصبی و درمان حمایتی.'],
          clinicalNotes: ['در همارتروز شدید و ناپایداری، ارجاع ارتوپدی لازم است.'],
        };
      }
      return {
        score,
        maxScore: 5,
        riskLevel: 'high',
        riskTitle: 'قانون زانوی اتاوا مثبت (≥ ۱ معیار)',
        summary: 'نیازمند گرافی زانو برای رد شکستگی.',
        diagnosisAndTreatment: ['رادیوگرافی AP و Lateral زانو (و Sunrise در شک به کشکک) و آتل‌گذاری.'],
        clinicalNotes: ['در ترومای پرانرژی زانو، معاینه نبض و شریان پوپلیتئال حیاتی است.'],
      };
    },
  },
  {
    id: 'rts-trauma',
    titleFa: 'اسکور بازبینی‌شده تروما (RTS)',
    titleEn: 'Revised Trauma Score (RTS)',
    category: 'trauma',
    categoryLabel: 'تروما و ارتوپدی',
    reference: "Rosen's Emergency Medicine · Champion HR et al.",
    criteria: [
      {
        id: 'gcsCode',
        label: 'مقیاس کمای گلاسکو (GCS)',
        type: 'select',
        defaultValue: 4,
        options: [
          { label: 'GCS 3 (کد ۰)', points: 0 },
          { label: 'GCS 4–5 (کد ۱)', points: 1 },
          { label: 'GCS 6–8 (کد ۲)', points: 2 },
          { label: 'GCS 9–12 (کد ۳)', points: 3 },
          { label: 'GCS 13–15 (کد ۴)', points: 4 },
        ],
      },
      {
        id: 'sbpCode',
        label: 'فشار خون سیستولیک (SBP)',
        type: 'select',
        defaultValue: 4,
        options: [
          { label: '۰ mmHg (کد ۰)', points: 0 },
          { label: '۱ تا ۴۹ mmHg (کد ۱)', points: 1 },
          { label: '۵۰ تا ۷۵ mmHg (کد ۲)', points: 2 },
          { label: '۷۶ تا ۸۹ mmHg (کد ۳)', points: 3 },
          { label: '> ۸۹ mmHg (کد ۴)', points: 4 },
        ],
      },
      {
        id: 'rrCode',
        label: 'تعداد تنفس (RR)',
        type: 'select',
        defaultValue: 4,
        options: [
          { label: '۰ در دقیقه (کد ۰)', points: 0 },
          { label: '۱ تا ۵ در دقیقه (کد ۱)', points: 1 },
          { label: '۶ تا ۹ در دقیقه (کد ۲)', points: 2 },
          { label: '> ۲۹ در دقیقه (کد ۳)', points: 3 },
          { label: '۱۰ تا ۲۹ در دقیقه (کد ۴)', points: 4 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score >= 11) {
        return {
          score,
          maxScore: 12,
          riskLevel: score === 12 ? 'low' : 'moderate',
          riskTitle: score === 12 ? 'پایدار فیزیولوژیک (RTS = 12 · بقا ~99%)' : 'آسیب متوسط (RTS = 11)',
          summary: 'ثبات فیزیولوژیک اولیه در بدو ورود؛ بررسی مکانیسم و آسیب‌های پنهان ادامه یابد.',
          diagnosisAndTreatment: ['ارزیابی کامل ATLS، معاینه ثانویه و تصویربرداری هدفمند.'],
          clinicalNotes: ['در RTS (Triage-RTS) نمره کمتر نشان‌دهنده وخامت بیشتر است؛ نمره ≤ ۱۱ اندیکاسیون اعزام به مرکز تروما سطح ۱ است.'],
        };
      }
      return {
        score,
        maxScore: 12,
        riskLevel: 'critical',
        riskTitle: 'ترومای شدید / ناپایدار (RTS ≤ 10)',
        summary: 'مرگ‌ومیر بالا؛ نیازمند فعال‌سازی فوری تیم تروما و انتقال به مرکز سطح ۱.',
        diagnosisAndTreatment: [
          'احیای فوری ATLS (راه هوایی، تنفس، کنترل خونریزی و تزریق خون متوازن ۱:۱:۱ در شوک هموراژیک).',
          'سونوگرافی eFAST و مشاوره فوری جراحی تروما.',
        ],
        clinicalNotes: ['به‌ازای هر افت واحد در RTS احتمال بقا به‌طور چشمگیری کاهش می‌یابد.'],
      };
    },
  },
  {
    id: 'mess-score',
    titleFa: 'اسکور شدت آسیب اندام (MESS)',
    titleEn: 'Mangled Extremity Severity Score (MESS)',
    category: 'trauma',
    categoryLabel: 'تروما و ارتوپدی',
    reference: "Rosen's Emergency Medicine · Johansen K et al.",
    criteria: [
      {
        id: 'energy',
        label: 'انرژی آسیب استخوانی / بافت نرم',
        type: 'select',
        options: [
          { label: 'کم‌انرژی (ضربه چاقو، شکستگی ساده، گلوله کم‌سرعت)', points: 1 },
          { label: 'انرژی متوسط (شکستگی باز یا متعدد، دررفتگی)', points: 2 },
          { label: 'پرانرژی (تصادف پرسرعت، گلوله جنگی، لهشدگی)', points: 3 },
          { label: 'فوق‌العاده پرانرژی (آلودگی شدید همراه با له‌شدگی وسیع)', points: 4 },
        ],
      },
      {
        id: 'ischemia',
        label: 'ایسکمی اندام (در بیش از ۶ ساعت امتیاز ۲ برابر می‌شود)',
        type: 'select',
        options: [
          { label: 'بدون ایسکمی (نبض طبیعی، پرشدگی مویرگی نرمال)', points: 0 },
          { label: 'کاهش یا نبود نبض ولی پرفیوژن دیستال محفوظ (+۱)', points: 1 },
          { label: 'بی‌نبض، پارستزی، پرشدگی مویرگی کند (+۲)', points: 2 },
          { label: 'اندام سرد، فلج و بی‌حس (+۳)', points: 3 },
        ],
      },
      { id: 'isch6h', label: 'مدت زمان ایسکمی بیش از ۶ ساعت (دو برابر شدن نمره ایسکمی)', type: 'boolean', points: 2 },
      {
        id: 'shock',
        label: 'وضعیت شوک سیستمیک',
        type: 'select',
        options: [
          { label: 'SBP همیشه > ۹۰ mmHg', points: 0 },
          { label: 'افت گذرای فشار خون در اورژانس/صحنه', points: 1 },
          { label: 'هیپوتانسیون مداوم (SBP < 90 mmHg)', points: 2 },
        ],
      },
      {
        id: 'age',
        label: 'رده سنی بیمار',
        type: 'select',
        options: [
          { label: 'کمتر از ۳۰ سال', points: 0 },
          { label: '۳۰ تا ۵۰ سال', points: 1 },
          { label: 'بالای ۵۰ سال', points: 2 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score < 7) {
        return {
          score,
          maxScore: 14,
          riskLevel: score >= 5 ? 'moderate' : 'low',
          riskTitle: 'شانس بالای حفظ اندام (MESS < 7)',
          summary: 'اندام معمولاً کاندید ترمیم و نجات عروقی-ارتوپدی است.',
          diagnosisAndTreatment: [
            'مشاوره فوری ارتوپدی و جراحی عروق، دبریدمان، آنتی‌بیوتیک IV و پروفیلاکسی کزاز.',
            'ثابت‌سازی موقت (اکسترنال فیکساتور) و ریواسکولاریزاسیون عروقی در نبود نبض.',
          ],
          clinicalNotes: ['پنجره طلایی ۶ ساعته برای خون‌رسانی مجدد اهمیت حیاتی دارد.'],
        };
      }
      return {
        score,
        maxScore: 14,
        riskLevel: 'critical',
        riskTitle: 'آسیب شدید اندام (MESS ≥ 7)',
        summary: 'احتمال بالای نیاز به آمپوتاسیون اولیه یا تاخیری؛ تصمیم‌گیری تیمی جراحی.',
        diagnosisAndTreatment: [
          'احیای همودینامیک، کنترل خونریزی (تورنیکه در خونریزی غیرقابل کنترل)، آنتی‌بیوتیک وسیع‌الطیف و کزاز.',
          'مشاوره اورژانسی تیم ارتوپدی و عروق جهت تصمیم نجات اندام یا آمپوتاسیون.',
        ],
        clinicalNotes: ['در معیارهای امروزی MESS ≥ 7 کمک‌کننده تصمیم است اما وضعیت عصبی تیبیال و تصمیم جراح نهایی است.'],
      };
    },
  },

  // ================= GI, HEPATIC & SURGERY =================
  {
    id: 'glasgow-blatchford',
    titleFa: 'اسکور گلاسکو-بلاچفورد (خونریزی گوارشی فوقانی)',
    titleEn: 'Glasgow-Blatchford Bleeding Score (GBS)',
    category: 'gi_surgery',
    categoryLabel: 'گوارش و جراحی',
    reference: "Rosen's Emergency Medicine · Blatchford O et al.",
    criteria: [
      {
        id: 'bun',
        label: 'سطح BUN سرم (mg/dL)',
        type: 'select',
        options: [
          { label: '< ۱۸.۲ mg/dL', points: 0 },
          { label: '۱۸.۲ تا ۲۲.۳ (+۲)', points: 2 },
          { label: '۲۲.۴ تا ۲۷.۹ (+۳)', points: 3 },
          { label: '۲۸ تا ۶۹.۹ (+۴)', points: 4 },
          { label: '≥ ۷۰ mg/dL (+۶)', points: 6 },
        ],
      },
      {
        id: 'hb',
        label: 'هموگلوبین (Hb)',
        type: 'select',
        options: [
          { label: 'مرد ≥ ۱۳ / زن ≥ ۱۲', points: 0 },
          { label: 'مرد ۱۲–۱۲.۹ / زن ۱۰–۱۱.۹ (+۱)', points: 1 },
          { label: 'مرد ۱۰–۱۱.۹ (+۳)', points: 3 },
          { label: '< ۱۰ g/dL در مرد یا زن (+۶)', points: 6 },
        ],
      },
      {
        id: 'sbp',
        label: 'فشار خون سیستولیک',
        type: 'select',
        options: [
          { label: '≥ ۱۱۰ mmHg', points: 0 },
          { label: '۱۰۰ تا ۱۰۹ (+۱)', points: 1 },
          { label: '۹۰ تا ۹۹ (+۲)', points: 2 },
          { label: '< ۹۰ mmHg (+۳)', points: 3 },
        ],
      },
      { id: 'hr100', label: 'ضربان قلب ≥ ۱۰۰ در دقیقه', type: 'boolean', points: 1 },
      { id: 'melena', label: 'ملنا', type: 'boolean', points: 1 },
      { id: 'syncope', label: 'سنکوپ', type: 'boolean', points: 2 },
      { id: 'hepatic', label: 'بیماری کبدی', type: 'boolean', points: 2 },
      { id: 'cardiac', label: 'نارسایی قلبی', type: 'boolean', points: 2 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 23,
          riskLevel: 'low',
          riskTitle: 'ریسک بسیار پایین (امتیاز ۰)',
          summary: 'امکان ترخیص ایمن با آندوسکوپی سرپایی.',
          diagnosisAndTreatment: ['PPI خوراکی و ارجاع آندوسکوپی سرپایی همراه آموزش علائم هشدار.'],
          clinicalNotes: ['فقط امتیاز دقیقاً ۰ مناسب ترخیص مستقیم است.'],
        };
      }
      if (score <= 5) {
        return {
          score,
          maxScore: 23,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط (1–5)',
          summary: 'بستری و آندوسکوپی ظرف ۲۴ ساعت.',
          diagnosisAndTreatment: ['NPO، دو رگ وریدی، PPI وریدی و مشاوره گوارش برای آندوسکوپی.'],
          clinicalNotes: ['در سابقه سیروز اکترئوتاید و سفتریاکسون اضافه شود.'],
        };
      }
      return {
        score,
        maxScore: 23,
        riskLevel: 'critical',
        riskTitle: 'ریسک بالا (≥ 6)',
        summary: 'نیاز احتمالی به تزریق خون و آندوسکوپی اورژانسی.',
        diagnosisAndTreatment: [
          'احیای مایع/خون (هدف Hb ≥ 7)، پنتوپرازول IV و آندوسکوپی اورژانسی (≤ ۱۲ ساعت).',
          'بستری در ICU و محافظت راه هوایی در هماتمز شدید.',
        ],
        clinicalNotes: ['در خونریزی شدید اریترومایسین IV قبل از آندوسکوپی دید آندوسکوپ را بهبود می‌بخشد.'],
      };
    },
  },
  {
    id: 'rockall-pre',
    titleFa: 'اسکور راکل بالینی (پیش از آندوسکوپی)',
    titleEn: 'Pre-Endoscopy (Clinical) Rockall Score',
    category: 'gi_surgery',
    categoryLabel: 'گوارش و جراحی',
    reference: "Rosen's Emergency Medicine · Rockall TA et al.",
    criteria: [
      {
        id: 'age',
        label: 'رده سنی',
        type: 'select',
        options: [
          { label: '< ۶۰ سال (۰)', points: 0 },
          { label: '۶۰ تا ۷۹ سال (+۱)', points: 1 },
          { label: '≥ ۸۰ سال (+۲)', points: 2 },
        ],
      },
      {
        id: 'shock',
        label: 'وضعیت شوک و همودینامیک',
        type: 'select',
        options: [
          { label: 'بدون شوک (SBP ≥ 100 و HR < 100)', points: 0 },
          { label: 'تاکیکاردی (SBP ≥ 100 و HR ≥ 100)', points: 1 },
          { label: 'هیپوتانسیون (SBP < 100 mmHg)', points: 2 },
        ],
      },
      {
        id: 'comorb',
        label: 'بیماری‌های همراه (Comorbidity)',
        type: 'select',
        options: [
          { label: 'بدون بیماری عمده (۰)', points: 0 },
          { label: 'نارسایی قلبی، IHD یا هر بیماری ماژور (+۲)', points: 2 },
          { label: 'نارسایی کلیه، نارسایی کبد یا بدخیمی منتشر (+۳)', points: 3 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 7,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین خونریزی مجدد و مرگ (~0.2%)',
          summary: 'پیش‌آگهی عالی؛ ارزیابی با GBS برای تصمیم ترخیص.',
          diagnosisAndTreatment: ['در صورت GBS=0 امکان ترخیص سرپایی، در غیر این صورت بستری کوتاه و آندوسکوپی.'],
          clinicalNotes: ['برای تصمیم ترخیص مستقیم در اورژانس، GBS از Rockall پیش‌آندوسکوپی حساس‌تر است.'],
        };
      }
      if (score <= 2) {
        return {
          score,
          maxScore: 7,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط (1–2)',
          summary: 'نیازمند بستری و آندوسکوپی طی ۲۴ ساعت.',
          diagnosisAndTreatment: ['پایش علائم حیاتی، PPI وریدی، رزرو خون و آندوسکوپی ظرف ۲۴ ساعت.'],
          clinicalNotes: ['پس از آندوسکوپی با افزودن امتیاز تشخیص و استیگماتای خونریزی، Full Rockall محاسبه می‌شود.'],
        };
      }
      return {
        score,
        maxScore: 7,
        riskLevel: 'critical',
        riskTitle: 'ریسک بالا (≥ 3 · مرگ‌ومیر ~11–41%)',
        summary: 'خطر قابل توجه مرگ‌ومیر و خونریزی مجدد.',
        diagnosisAndTreatment: ['بستری ICU، احیای تهاجمی، تزریق خون و آندوسکوپی اورژانسی.'],
        clinicalNotes: ['بیماری‌های زمینه‌ای کبدی و کلیوی مرگ‌ومیر UGIB را به شدت بالا می‌برند.'],
      };
    },
  },
  {
    id: 'alvarado',
    titleFa: 'اسکور آلوارادو (آپاندیسیت حاد)',
    titleEn: 'Alvarado Score (MANTRELS)',
    category: 'gi_surgery',
    categoryLabel: 'گوارش و جراحی',
    reference: "Rosen's Emergency Medicine · Alvarado A",
    criteria: [
      { id: 'migration', label: 'مهاجرت درد به RLQ', type: 'boolean', points: 1 },
      { id: 'anorexia', label: 'بی‌اشتهایی', type: 'boolean', points: 1 },
      { id: 'nausea', label: 'تهوع یا استفراغ', type: 'boolean', points: 1 },
      { id: 'rlqTender', label: 'تندرنس RLQ', type: 'boolean', points: 2 },
      { id: 'rebound', label: 'ریباند تندرنس', type: 'boolean', points: 1 },
      { id: 'temp', label: 'تب ≥ ۳۷.۳°C', type: 'boolean', points: 1 },
      { id: 'wbc', label: 'لکوسیتوز > ۱۰,۰۰۰', type: 'boolean', points: 2 },
      { id: 'shift', label: 'شیفت به چپ نوتروفیل (> ۷۵٪)', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 4) {
        return {
          score,
          maxScore: 10,
          riskLevel: 'low',
          riskTitle: 'احتمال پایین آپاندیسیت (1–4)',
          summary: 'آپاندیسیت بعید است.',
          diagnosisAndTreatment: ['بررسی تشخیص‌های افتراقی (ادراری، ژنیکولوژیک، گوارشی) و آموزش علائم هشدار.'],
          clinicalNotes: ['در خانم‌های سن باروری حتماً BHCG چک شود.'],
        };
      }
      if (score <= 6) {
        return {
          score,
          maxScore: 10,
          riskLevel: 'moderate',
          riskTitle: 'احتمال متوسط (5–6)',
          summary: 'نیازمند تصویربرداری سونوگرافی یا CT شکم.',
          diagnosisAndTreatment: ['سونوگرافی (اطفال/بارداری) یا CT شکم با کنتراست و تحت‌نظر جراحی.'],
          clinicalNotes: ['تصویربرداری نرخ آپاندکتومی منفی را کاهش می‌دهد.'],
        };
      }
      return {
        score,
        maxScore: 10,
        riskLevel: 'high',
        riskTitle: 'احتمال بالای آپاندیسیت (7–10)',
        summary: 'مشاوره فوری جراحی برای آپاندکتومی.',
        diagnosisAndTreatment: ['NPO، مایع‌درمانی، آنتی‌بیوتیک پره‌اپ و مشاوره اورژانسی جراحی عمومی.'],
        clinicalNotes: ['در علائم پریتونیت منتشر پوشش آنتی‌بیوتیکی سپسیس شکمی لازم است.'],
      };
    },
  },
  {
    id: 'pas-peds',
    titleFa: 'اسکور آپاندیسیت کودکان (PAS)',
    titleEn: 'Pediatric Appendicitis Score (Samuel)',
    category: 'gi_surgery',
    categoryLabel: 'گوارش و جراحی',
    reference: "Rosen's Emergency Medicine · Samuel M",
    criteria: [
      { id: 'coughHop', label: 'درد RLQ با سرفه، پریدن (Hopping) یا پرکاشن', type: 'boolean', points: 2 },
      { id: 'anorexia', label: 'بی‌اشتهایی', type: 'boolean', points: 1 },
      { id: 'pyrexia', label: 'تب (Pyrexia)', type: 'boolean', points: 1 },
      { id: 'emesis', label: 'تهوع یا استفراغ', type: 'boolean', points: 1 },
      { id: 'rlqTender', label: 'تندرنس در لمس RLQ', type: 'boolean', points: 2 },
      { id: 'leukocytosis', label: 'لکوسیتوز > ۱۰,۰۰۰', type: 'boolean', points: 1 },
      { id: 'pmn', label: 'نوتروفیلی (PMN > ۷۵٪)', type: 'boolean', points: 1 },
      { id: 'migration', label: 'مهاجرت درد به RLQ', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 3) {
        return {
          score,
          maxScore: 10,
          riskLevel: 'low',
          riskTitle: 'احتمال پایین آپاندیسیت در کودک (≤ 3)',
          summary: 'نیازی به تصویربرداری فوری در نبود علائم هشدار نیست.',
          diagnosisAndTreatment: ['بررسی علل شایع کودک (گاستروانتریت، آدنیت مزانتریک، عفونت ادراری) و پیگیری ۱۲–۲۴ ساعته.'],
          clinicalNotes: ['اسکور PAS مخصوص کودکان ۴ تا ۱۵ سال طراحی شده است.'],
        };
      }
      if (score <= 6) {
        return {
          score,
          maxScore: 10,
          riskLevel: 'moderate',
          riskTitle: 'احتمال متوسط (4–6)',
          summary: 'سونوگرافی شکم به عنوان گام اول تصویربرداری در کودکان.',
          diagnosisAndTreatment: ['انجام سونوگرافی آپاندیس (در صورت غیرقطعی بودن: معاینه سریال یا MRI/CT کم‌دوز) و مشاوره جراحی اطفال.'],
          clinicalNotes: ['در کودکان پرهیز از اشعه CT تا حد امکان اولویت دارد.'],
        };
      }
      return {
        score,
        maxScore: 10,
        riskLevel: 'high',
        riskTitle: 'احتمال بالای آپاندیسیت در کودک (≥ 7)',
        summary: 'مشاوره فوری جراحی اطفال.',
        diagnosisAndTreatment: ['NPO، سرم‌تراپی، کنترل درد، آنتی‌بیوتیک IV و مشاوره فوری جراحی اطفال.'],
        clinicalNotes: ['تست سرفه یا پریدن در کودک حساسیت بالایی برای تحریک صفاقی دارد.'],
      };
    },
  },
  {
    id: 'bisap',
    titleFa: 'اسکور BISAP (شدت پانکراتیت حاد)',
    titleEn: 'BISAP Score for Acute Pancreatitis Mortality',
    category: 'gi_surgery',
    categoryLabel: 'گوارش و جراحی',
    reference: "Rosen's Emergency Medicine · Wu BU et al.",
    criteria: [
      { id: 'bun', label: 'BUN > ۲۵ mg/dL', type: 'boolean', points: 1 },
      { id: 'impair', label: 'اختلال هوشیاری (GCS < 15)', type: 'boolean', points: 1 },
      { id: 'sirs', label: 'وجود ≥ ۲ معیار SIRS', type: 'boolean', points: 1 },
      { id: 'age60', label: 'سن بالای ۶۰ سال', type: 'boolean', points: 1 },
      { id: 'pleural', label: 'پلورال افیوژن در تصویربرداری', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 2) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'low',
          riskTitle: 'پانکراتیت خفیف تا متوسط (مرگ‌ومیر < 2%)',
          summary: 'خطر نارسایی پایدار ارگان در ۲۴ ساعت اول پایین است.',
          diagnosisAndTreatment: [
            'بستری در بخش، احیای متعادل مایع (رینگ لاکتات ۵–۱۰ mL/kg/hr)، کنترل درد و تغذیه زودهنگام پس از بهبود تهوع.',
            'سونوگرافی شکم برای بررسی سنگ صفراوی.',
          ],
          clinicalNotes: ['رینگ لاکتات نسبت به نرمال سالین التهاب سیستمیک را در پانکراتیت کمتر می‌کند.'],
        };
      }
      return {
        score,
        maxScore: 5,
        riskLevel: 'critical',
        riskTitle: 'پانکراتیت شدید / پرخطر (≥ 3 · مرگ‌ومیر ~5–22%)',
        summary: 'خطر بالای نکروز پانکراس و نارسایی چند ارگان؛ بررسی بستری ICU.',
        diagnosisAndTreatment: [
          'بستری در ICU/بخش مراقبت ویژه، پایش دقیق برون‌ده ادراری، الکترولیت‌ها (Ca) و عملکرد تنفسی/کلیوی.',
          'در حضور کلانژیت هم‌زمان: آنتی‌بیوتیک IV و ERCP اورژانسی.',
        ],
        clinicalNotes: ['مزیت BISAP نسبت به Ranson امکان محاسبه کامل آن در همان ۲۴ ساعت اول در اورژانس است.'],
      };
    },
  },
  {
    id: 'ranson-adm',
    titleFa: 'معیارهای رانسون (بدو ورود - پانکراتیت)',
    titleEn: "Ranson's Criteria (On Admission)",
    category: 'gi_surgery',
    categoryLabel: 'گوارش و جراحی',
    reference: "Rosen's Emergency Medicine · Ranson JH et al.",
    criteria: [
      { id: 'age55', label: 'سن بالای ۵۵ سال', type: 'boolean', points: 1 },
      { id: 'wbc16', label: 'گلبول سفید > ۱۶,۰۰۰ /µL', type: 'boolean', points: 1 },
      { id: 'glu200', label: 'قند خون > ۲۰۰ mg/dL', type: 'boolean', points: 1 },
      { id: 'ldh350', label: 'LDH سرم > ۳۵۰ IU/L', type: 'boolean', points: 1 },
      { id: 'ast250', label: 'AST سرم > ۲۵۰ IU/L', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 2) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'low',
          riskTitle: 'شاخص اولیه پایین در بدو ورود (0–2)',
          summary: 'تا زمان تکمیل معیارهای ۴۸ ساعته، درمان استاندارد حمایتی و مایع‌درمانی انجام شود.',
          diagnosisAndTreatment: ['بستری در بخش، رینگ لاکتات هدفمند، کنترل درد و پایش علائم ۴۸ ساعته.'],
          clinicalNotes: ['پانکراتیت خفیف در ۴۸ ساعت با معیارهای دیگر نیز پایش می‌شود.'],
        };
      }
      return {
        score,
        maxScore: 5,
        riskLevel: 'high',
        riskTitle: 'شاخص بالای بدو ورود (≥ 3)',
        summary: 'پانکراتیت شدید محتمل؛ خطر بالای عوارض سیستمیک و نکروز.',
        diagnosisAndTreatment: ['بستری در ICU، پایش دقیق مایعات، کلسیم، اکسیژن و مشاوره جراحی/گوارش.'],
        clinicalNotes: ['در پانکراتیت صفراوی آستانه‌ها کمی متفاوت است (مثلاً سن >۷۰، WBC >18k).'],
      };
    },
  },
  {
    id: 'child-pugh',
    titleFa: 'اسکور چایلد-پیو (شدت سیروز کبدی)',
    titleEn: 'Child-Pugh Score for Cirrhosis Mortality',
    category: 'gi_surgery',
    categoryLabel: 'گوارش و جراحی',
    reference: "Rosen's Emergency Medicine · Pugh RN et al.",
    criteria: [
      {
        id: 'bili',
        label: 'بیلی‌روبین توتال (mg/dL)',
        type: 'select',
        options: [
          { label: '< ۲ mg/dL (+۱)', points: 1 },
          { label: '۲ تا ۳ mg/dL (+۲)', points: 2 },
          { label: '> ۳ mg/dL (+۳)', points: 3 },
        ],
      },
      {
        id: 'alb',
        label: 'آلبومین سرم (g/dL)',
        type: 'select',
        options: [
          { label: '> ۳.۵ g/dL (+۱)', points: 1 },
          { label: '۲.۸ تا ۳.۵ (+۲)', points: 2 },
          { label: '< ۲.۸ g/dL (+۳)', points: 3 },
        ],
      },
      {
        id: 'inr',
        label: 'INR',
        type: 'select',
        options: [
          { label: '< ۱.۷ (+۱)', points: 1 },
          { label: '۱.۷ تا ۲.۳ (+۲)', points: 2 },
          { label: '> ۲.۳ (+۳)', points: 3 },
        ],
      },
      {
        id: 'ascites',
        label: 'آسیت (Ascites)',
        type: 'select',
        options: [
          { label: 'ندارد (+۱)', points: 1 },
          { label: 'خفیف / کنترل‌شده با دارو (+۲)', points: 2 },
          { label: 'متوسط تا شدید / مقاوم (+۳)', points: 3 },
        ],
      },
      {
        id: 'enceph',
        label: 'آنسفالوپاتی کبدی',
        type: 'select',
        options: [
          { label: 'ندارد (+۱)', points: 1 },
          { label: 'گرید ۱–۲ (خفیف/آستریکسیس) (+۲)', points: 2 },
          { label: 'گرید ۳–۴ (استوپور/کما) (+۳)', points: 3 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 6) {
        return {
          score,
          maxScore: 15,
          riskLevel: 'low',
          riskTitle: 'Child-Pugh Class A (5–6 · بیماری جبران‌شده)',
          summary: 'بقای ۱ ساله ~100%؛ ریسک عمل جراحی پایین (~10%).',
          diagnosisAndTreatment: ['پرهیز از داروهای هپاتوتوکسیک/NSAIDs، تعدیل دوز داروها و پیگیری گوارش.'],
          clinicalNotes: ['در هر آسیت جدید یا بدتر شدن حال بیمار پاراسنتز تشخیصی برای رد SBP انجام دهید.'],
        };
      }
      if (score <= 9) {
        return {
          score,
          maxScore: 15,
          riskLevel: 'moderate',
          riskTitle: 'Child-Pugh Class B (7–9 · اختلال عملکرد متوسط)',
          summary: 'بقای ۱ ساله ~80%؛ ریسک جراحی متوسط (~30%).',
          diagnosisAndTreatment: [
            'پاراسنتز تشخیصی در وجود آسیت، درمان آنسفالوپاتی با لاکتولوز/ریفاکسیمین و جستجوی عوامل محرک (عفونت، UGIB، هیپوکالمی).',
          ],
          clinicalNotes: ['در پاراسنتز حجیم (>۵ لیتر) جایگزینی آلبومین (۶–۸ گرم به ازای هر لیتر) لازم است.'],
        };
      }
      return {
        score,
        maxScore: 15,
        riskLevel: 'critical',
        riskTitle: 'Child-Pugh Class C (10–15 · سیروز جبران‌نشده شدید)',
        summary: 'بقای ۱ ساله ~45%؛ ریسک جراحی بسیار بالا (~82%).',
        diagnosisAndTreatment: [
          'بستری، بررسی SBP، پروفیلاکسی آنتی‌بیوتیکی در خونریزی گوارشی (سفتریاکسون) و درمان تهاجمی آنسفالوپاتی/سندرم هپاتورنال.',
          'مشاوره گوارش/پیوند کبد و پرهیز از جراحی غیراورژانسی.',
        ],
        clinicalNotes: ['MELD-Na نیز برای اولویت پیوند و پیش‌آگهی ۹۰ روزه محاسبه شود.'],
      };
    },
  },
  {
    id: 'stone-score',
    titleFa: 'اسکور STONE (سنگ حالب / کولیک کلیوی)',
    titleEn: 'STONE Score for Ureterolithiasis',
    category: 'gi_surgery',
    categoryLabel: 'گوارش و جراحی',
    reference: "Rosen's Emergency Medicine · Moore CL et al. BMJ",
    criteria: [
      { id: 'male', label: 'جنسیت مذکر', type: 'boolean', points: 2 },
      {
        id: 'duration',
        label: 'مدت زمان تا مراجعه (Duration)',
        type: 'select',
        options: [
          { label: '> ۲۴ ساعت (۰)', points: 0 },
          { label: '۶ تا ۲۴ ساعت (+۱)', points: 1 },
          { label: '< ۶ ساعت (+۳)', points: 3 },
        ],
      },
      { id: 'nonBlack', label: 'نژاد غیرسیاه‌پوست (برای جمعیت ایران معمولاً برقرار: +۳)', type: 'boolean', points: 3 },
      {
        id: 'nausea',
        label: 'تهوع و استفراغ',
        type: 'select',
        options: [
          { label: 'ندارد (۰)', points: 0 },
          { label: 'فقط تهوع (+۱)', points: 1 },
          { label: 'همراه با استفراغ (+۲)', points: 2 },
        ],
      },
      { id: 'hematuria', label: 'هماچوری در آزمایش ادرار (RBC در ادرار)', type: 'boolean', points: 3 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 5) {
        return {
          score,
          maxScore: 13,
          riskLevel: 'low',
          riskTitle: 'احتمال پایین سنگ حالب (~9%)',
          summary: 'ضرورت بررسی سایر علل خطرناک درد پهلو/شکم (AAA، آپاندیسیت، EP، تورشن).',
          diagnosisAndTreatment: ['سونوگرافی یا CT برای یافتن تشخیص جایگزین، آزمایش بارداری در زنان و U/A.'],
          clinicalNotes: ['در افراد مسن با سابقه عروقی، آنوریسم آئورت شکمی (AAA) را با سونوگرافی کنار تخت رد کنید.'],
        };
      }
      if (score <= 9) {
        return {
          score,
          maxScore: 13,
          riskLevel: 'moderate',
          riskTitle: 'احتمال متوسط سنگ حالب (~51%)',
          summary: 'سونوگرافی کلیه/حالب یا CT بدون کنتراست با دوز پایین.',
          diagnosisAndTreatment: ['کنترل درد (کتوُرولاک/ایبوپروفن + مخدر در صورت نیاز)، هیدراتاسیون و سونوگرافی سیستم ادراری.'],
          clinicalNotes: ['وجود تب همراه با انسداد سنگ اورژانس اورولوژی (پیلونفریت انسدادی) است.'],
        };
      }
      return {
        score,
        maxScore: 13,
        riskLevel: 'high',
        riskTitle: 'احتمال بالای سنگ حالب (~89%)',
        summary: 'تشخیص سنگ بسیار محتمل است؛ تصویربرداری فقط در موارد خاص (تب، تک‌کلیه، شک تشخیصی).',
        diagnosisAndTreatment: [
          'کنترل درد با NSAIDs، بررسی عدم وجود عفونت ادراری/تب یا نارسایی حاد کلیه و سونوگرافی تاییدی.',
          'تجویز تامسولوسین در سنگ‌های دیستال ۵ تا ۱۰ میلی‌متری و ارجاع اورولوژی.',
        ],
        clinicalNotes: ['در بیماران بدون عارضه با سابقه سنگ و STONE بالا می‌توان از CT مکرر پرهیز کرد.'],
      };
    },
  },
  {
    id: 'twist-score',
    titleFa: 'اسکور TWIST (پیچ‌خوردگی بیضه)',
    titleEn: 'TWIST Score for Testicular Torsion',
    category: 'gi_surgery',
    categoryLabel: 'گوارش و جراحی',
    reference: "Rosen's Emergency Medicine · Barbosa JA et al.",
    criteria: [
      { id: 'swelling', label: 'تورم بیضه', type: 'boolean', points: 2 },
      { id: 'hard', label: 'سفتی بیضه در لمس (Hard testis)', type: 'boolean', points: 2 },
      { id: 'cremaster', label: 'نبود رفلکس کرماستریک', type: 'boolean', points: 1 },
      { id: 'nausea', label: 'تهوع یا استفراغ', type: 'boolean', points: 1 },
      { id: 'highRiding', label: 'بالا قرار گرفتن بیضه (High-riding testis)', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 2) {
        return {
          score,
          maxScore: 7,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین تورشن (TWIST ≤ 2)',
          summary: 'در معاینه دقیق و نبود شک قوی، احتمال تورشن پایین است.',
          diagnosisAndTreatment: ['بررسی اپیدیدیمیت/ارکیت یا تورشن آپندیکس و در هرگونه ابهام سونوگرافی داپلر بیضه.'],
          clinicalNotes: ['رفلکس کرماستر نرمال در نوزادان و برخی بزرگسالان ممکن است به سختی قابل ارزیابی باشد.'],
        };
      }
      if (score <= 5) {
        return {
          score,
          maxScore: 7,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط (TWIST 3–5)',
          summary: 'نیازمند سونوگرافی داپلر فوری بیضه و مشاوره اورولوژی.',
          diagnosisAndTreatment: ['درخواست اورژانسی سونوگرافی کالر داپلر بیضه و اطلاع به سرویس اورولوژی.'],
          clinicalNotes: ['زمان طلایی حفظ بیضه ۶ ساعت اول از شروع درد است.'],
        };
      }
      return {
        score,
        maxScore: 7,
        riskLevel: 'critical',
        riskTitle: 'ریسک بسیار بالا (TWIST ≥ 6 · PPV ~100%)',
        summary: 'اورژانس جراحی اورولوژی؛ بدون تاخیر برای سونوگرافی بیمار به اتاق عمل می‌رود.',
        diagnosisAndTreatment: [
          'مشاوره فوری اورولوژی جهت اکسپلوراسیون جراحی اورژانسی (بدون اتلاف وقت با سونوگرافی).',
          'کنترل درد و در صورت تاخیر اجتناب‌ناپذیر اتاق عمل، تلاش برای دتورشن دستی (چرخاندن به خارج مثل باز کردن کتاب).',
        ],
        clinicalNotes: ['در امتیاز ≥ ۶ تاخیر برای تصویربرداری می‌تواند منجر به از دست رفتن بیضه شود.'],
      };
    },
  },

  // ================= PEDS, HEME & PSYCHIATRY =================
  {
    id: 'westley-croup',
    titleFa: 'اسکور وستلی (شدت خروسک / کروپ)',
    titleEn: 'Westley Croup Score',
    category: 'peds_heme',
    categoryLabel: 'اطفال، هماتولوژی و روان',
    reference: "Rosen's Emergency Medicine · Westley CR et al.",
    criteria: [
      {
        id: 'stridor',
        label: 'استریدور دمی (Inspiratory Stridor)',
        type: 'select',
        options: [
          { label: 'ندارد (۰)', points: 0 },
          { label: 'فقط با آژیتاسیون / گریه (+۱)', points: 1 },
          { label: 'در حالت استراحت (+۲)', points: 2 },
        ],
      },
      {
        id: 'retraction',
        label: 'رتراکسیون دیواره قفسه سینه',
        type: 'select',
        options: [
          { label: 'ندارد (۰)', points: 0 },
          { label: 'خفیف (+۱)', points: 1 },
          { label: 'متوسط (+۲)', points: 2 },
          { label: 'شدید (+۳)', points: 3 },
        ],
      },
      {
        id: 'airEntry',
        label: 'ورود هوا در سمع ریه (Air Entry)',
        type: 'select',
        options: [
          { label: 'طبیعی (۰)', points: 0 },
          { label: 'کاهش‌یافته (+۱)', points: 1 },
          { label: 'به‌شدت کاهش‌یافته (+۲)', points: 2 },
        ],
      },
      {
        id: 'cyanosis',
        label: 'سیانوز',
        type: 'select',
        options: [
          { label: 'ندارد (۰)', points: 0 },
          { label: 'با آژیتاسیون (+۴)', points: 4 },
          { label: 'در حالت استراحت (+۵)', points: 5 },
        ],
      },
      {
        id: 'loc',
        label: 'سطح هوشیاری',
        type: 'select',
        options: [
          { label: 'طبیعی (۰)', points: 0 },
          { label: 'تغییر سطح هوشیاری / بی‌حالی (+۵)', points: 5 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 2) {
        return {
          score,
          maxScore: 17,
          riskLevel: 'low',
          riskTitle: 'کروپ خفیف (Mild · ≤ 2)',
          summary: 'بدون استریدور در استراحت؛ درمان تک‌دوز دگزامتازون و ترخیص.',
          diagnosisAndTreatment: ['تک‌دوز دگزامتازون ۰.۶ mg/kg (حداکثر ۱۰–۱۶ mg) خوراکی/عضلانی و آرامش کودک.'],
          clinicalNotes: ['همه شدت‌های کروپ از یک دوز دگزامتازون سود می‌برند.'],
        };
      }
      if (score <= 7) {
        return {
          score,
          maxScore: 17,
          riskLevel: 'moderate',
          riskTitle: 'کروپ متوسط (Moderate · 3–7)',
          summary: 'استریدور استراحت یا رتراکسیون واضح؛ نیاز به نبولایزر اپی‌نفرین + دگزامتازون.',
          diagnosisAndTreatment: [
            'نبولایزر اپی‌نفرین L-Epinephrine (۰.۵ mL/kg از ۱:۱۰۰۰، حداکثر ۵ mL) + دگزامتازون ۰.۶ mg/kg.',
            'تحت‌نظر در اورژانس به مدت حداقل ۳ تا ۴ ساعت پس از نبولایزر برای اطمینان از عدم عود (Rebound).',
          ],
          clinicalNotes: ['از تحریک کودک (گرفتن رگ غیرضروری یا معاینه خشن گلو) خودداری کنید.'],
        };
      }
      return {
        score,
        maxScore: 17,
        riskLevel: 'critical',
        riskTitle: score >= 12 ? 'نارسایی تنفسی قریب‌الوقوع (≥ 12)' : 'کروپ شدید (8–11)',
        summary: 'انسداد شدید راه هوایی فوقانی؛ نبولایزر مکرر و آمادگی انتوباسیون.',
        diagnosisAndTreatment: [
          'نبولایزر فوری اپی‌نفرین (قابل تکرار)، دگزامتازون IV/IM، اکسیژن مرطوب و بستری در PICU.',
          'آماده‌سازی تجهیزات انتوباسیون (سایز لوله تراشه ۰.۵ تا ۱ شماره کوچک‌تر از سایز سنی).',
        ],
        clinicalNotes: ['در نبود پاسخ یا افت هوشیاری/سیانوز انتوباسیون با حضور تیم مجرب انجام شود.'],
      };
    },
  },
  {
    id: '4ts-hit',
    titleFa: 'اسکور 4Ts (ترومبوسیتوپنی ناشی از هپارین - HIT)',
    titleEn: '4Ts Score for Heparin-Induced Thrombocytopenia',
    category: 'peds_heme',
    categoryLabel: 'اطفال، هماتولوژی و روان',
    reference: "Rosen's Emergency Medicine · Lo GK et al.",
    criteria: [
      {
        id: 'thromb',
        label: 'افت پلاکت (Thrombocytopenia)',
        type: 'select',
        options: [
          { label: 'افت < ۳۰٪ یا کف پلاکت < ۱۰,۰۰۰ (۰)', points: 0 },
          { label: 'افت ۳۰–۵۰٪ یا کف ۱۰,۰۰۰–۱۹,۰۰۰ (+۱)', points: 1 },
          { label: 'افت > ۵۰٪ و کف پلاکت ≥ ۲۰,۰۰۰ (+۲)', points: 2 },
        ],
      },
      {
        id: 'timing',
        label: 'زمان‌بندی افت پلاکت پس از هپارین',
        type: 'select',
        options: [
          { label: '≤ ۴ روز بدون تماس اخیر با هپارین (۰)', points: 0 },
          { label: '> ۱۰ روز یا نامشخص ولی منطبق با ۵–۱۰ روز، یا ≤ ۱ روز با تماس ۳۰–۱۰۰ روز اخیر (+۱)', points: 1 },
          { label: 'شروع واضح بین روز ۵ تا ۱۰، یا ≤ ۱ روز با تماس در ۳۰ روز اخیر (+۲)', points: 2 },
        ],
      },
      {
        id: 'thrombosis',
        label: 'ترومبوز یا عوارض دیگر',
        type: 'select',
        options: [
          { label: 'ندارد (۰)', points: 0 },
          { label: 'ترومبوز پیشرونده/عودکننده، ضایعات غیرنکروتیک پوستی یا شک به ترومبوز (+۱)', points: 1 },
          { label: 'ترومبوز جدید تاییدشده، نکروز پوست محل تزریق یا واکنش حاد سیستمیک پس از بولوس IV (+۲)', points: 2 },
        ],
      },
      {
        id: 'other',
        label: 'سایر علل افت پلاکت',
        type: 'select',
        options: [
          { label: 'علت واضح دیگر وجود دارد (۰)', points: 0 },
          { label: 'علت احتمالی دیگر وجود دارد (+۱)', points: 1 },
          { label: 'هیچ علت دیگر یافت نمی‌شود (+۲)', points: 2 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 3) {
        return {
          score,
          maxScore: 8,
          riskLevel: 'low',
          riskTitle: 'احتمال پایین HIT (0–3 · < 5%)',
          summary: 'HIT بعید است؛ بررسی سایر علل ترومبوسیتوپنی.',
          diagnosisAndTreatment: ['معمولاً نیازی به قطع فوری هپارین یا تست آنتی‌بادی PF4 نیست.'],
          clinicalNotes: ['ارزش اخباری منفی (NPV) امتیاز ≤ ۳ بالای ۹۸٪ است.'],
        };
      }
      return {
        score,
        maxScore: 8,
        riskLevel: score >= 6 ? 'critical' : 'high',
        riskTitle: score >= 6 ? 'احتمال بالای HIT (6–8)' : 'احتمال متوسط HIT (4–5)',
        summary: 'قطع فوری تمام اشکال هپارین و جایگزینی با آنتی‌کوآگولانت غیرهپارینی.',
        diagnosisAndTreatment: [
          'قطع فوری هپارین (شامل لاین شستشو با هپارین و LMWH) و ارسال تست ایمونواسی PF4.',
          'شروع آنتی‌کوآگولانت غیرهپارینی (آرگاتروبان، بیوالیرودین، فونداپارینوکس یا DOAC) و مشاوره هماتولوژی.',
        ],
        clinicalNotes: ['در HIT واقعی ترومبوز خطرناک‌تر از خونریزی است و تزریق پلاکت مگر در خونریزی فعال ممنوع است.'],
      };
    },
  },
  {
    id: 'isth-dic',
    titleFa: 'اسکور ISTH (انعقاد منتشر داخل عروقی - DIC)',
    titleEn: 'ISTH Criteria for Overt DIC',
    category: 'peds_heme',
    categoryLabel: 'اطفال، هماتولوژی و روان',
    reference: "Rosen's Emergency Medicine · Taylor FB et al.",
    criteria: [
      {
        id: 'plt',
        label: 'شمارش پلاکت',
        type: 'select',
        options: [
          { label: '> ۱۰۰,۰۰۰ /µL (۰)', points: 0 },
          { label: '۵۰,۰۰۰ تا ۱۰۰,۰۰۰ (+۱)', points: 1 },
          { label: '< ۵۰,۰۰۰ /µL (+۲)', points: 2 },
        ],
      },
      {
        id: 'ddimer',
        label: 'افزایش مارکر فیبرین (D-dimer / FDP)',
        type: 'select',
        options: [
          { label: 'بدون افزایش (۰)', points: 0 },
          { label: 'افزایش متوسط (+۲)', points: 2 },
          { label: 'افزایش شدید (+۳)', points: 3 },
        ],
      },
      {
        id: 'pt',
        label: 'طولانی شدن PT (ثانیه بالای نرمال)',
        type: 'select',
        options: [
          { label: '< ۳ ثانیه (۰)', points: 0 },
          { label: '۳ تا ۶ ثانیه (+۱)', points: 1 },
          { label: '> ۶ ثانیه (+۲)', points: 2 },
        ],
      },
      {
        id: 'fib',
        label: 'فیبرینوژن سرم',
        type: 'select',
        options: [
          { label: '≥ ۱۰۰ mg/dL (۰)', points: 0 },
          { label: '< ۱۰۰ mg/dL (+۱)', points: 1 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score < 5) {
        return {
          score,
          maxScore: 8,
          riskLevel: 'moderate',
          riskTitle: 'غیرقطعی برای DIC آشکار (< 5)',
          summary: 'ممکن است DIC غیرآشکار/اولیه باشد؛ تکرار آزمایش‌ها روزانه.',
          diagnosisAndTreatment: ['درمان علت زمینه‌ای (سپسیس، تروما، عارضه مامایی) و تکرار پانل انعقادی طی ۶ تا ۱۲ ساعت.'],
          clinicalNotes: ['اسکور ISTH در حضور بیماری زمینه‌ای شناخته‌شده ایجادکننده DIC کاربرد دارد.'],
        };
      }
      return {
        score,
        maxScore: 8,
        riskLevel: 'critical',
        riskTitle: 'منطبق با DIC آشکار (Overt DIC ≥ 5)',
        summary: 'اختلال شدید مصرفی انعقاد؛ درمان فوری عامل زمینه‌ای و حمایت فرآورده‌های خونی.',
        diagnosisAndTreatment: [
          'درمان تهاجمی علت زمینه‌ای (تخلیه کانون/آنتی‌بیوتیک در سپسیس، زایمان در دکولمان).',
          'در خونریزی فعال یا نیاز به پروسیجر: تزریق پلاکت (هدف >50k)، FFP (در PT/PTT بالا) و کرایوپرسیپیتات (در فیبرینوژن <100–150).',
        ],
        clinicalNotes: ['در بیمار بدون خونریزی فعال، پروفیلاکسی ترومبوز (VTE) مدنظر قرار گیرد.'],
      };
    },
  },
  {
    id: 'sad-persons',
    titleFa: 'اسکور SAD PERSONS (خطر خودکشی در اورژانس)',
    titleEn: 'SAD PERSONS Scale for Suicide Risk',
    category: 'peds_heme',
    categoryLabel: 'اطفال، هماتولوژی و روان',
    reference: "Rosen's Emergency Medicine · Patterson WM et al.",
    criteria: [
      { id: 'sex', label: 'جنسیت مذکر (Sex: Male)', type: 'boolean', points: 1 },
      { id: 'age', label: 'سن کمتر از ۱۹ یا بالای ۴۵ سال', type: 'boolean', points: 1 },
      { id: 'dep', label: 'افسردگی یا ناامیدی (Depression)', type: 'boolean', points: 1 },
      { id: 'prev', label: 'سابقه اقدام قبلی یا مراقبت روان‌پزشکی', type: 'boolean', points: 1 },
      { id: 'eth', label: 'مصرف الکل یا مواد (Ethanol/Drugs)', type: 'boolean', points: 1 },
      { id: 'rat', label: 'اختلال تفکر منطقی / سایکوز', type: 'boolean', points: 1 },
      { id: 'social', label: 'نبود حمایت اجتماعی (تنهایی)', type: 'boolean', points: 1 },
      { id: 'plan', label: 'داشتن نقشه سازمان‌یافته (Organized Plan)', type: 'boolean', points: 1 },
      { id: 'spouse', label: 'مجرد، مطلقه یا بیوه (No Spouse)', type: 'boolean', points: 1 },
      { id: 'sick', label: 'بیماری طبی مزمن یا شدید (Sickness)', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 4) {
        return {
          score,
          maxScore: 10,
          riskLevel: 'low',
          riskTitle: 'ریسک پایین بر اساس اسکور (0–4)',
          summary: 'ارزیابی بالینی مستقیم روان‌پزشکی همیشه بر عدد اسکور اولویت دارد.',
          diagnosisAndTreatment: ['مصاحبه بالینی دقیق؛ در نبود افکار فعال/نقشه، پیگیری سرپایی و در اختیار گذاشتن همراه امن.'],
          clinicalNotes: ['هیچ ابزار عددی نباید جایگزین مصاحبه مستقیم و ایمنی بیمار شود (اگر بیمار نقشه فعال دارد همیشه پرخطر است).'],
        };
      }
      if (score <= 6) {
        return {
          score,
          maxScore: 10,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط (5–6)',
          summary: 'نیازمند مشاوره روان‌پزشکی در اورژانس و بررسی نیاز به بستری.',
          diagnosisAndTreatment: ['مشاوره روان‌پزشکی، ایمن‌سازی محیط بیمار در اورژانس (پایش ۱ به ۱ و حذف اشیای برنده).'],
          clinicalNotes: ['مدیریت طبی/سم‌شناسی هم‌زمان در صورت اقدام دارویی تکمیل شود.'],
        };
      }
      return {
        score,
        maxScore: 10,
        riskLevel: 'critical',
        riskTitle: 'ریسک بالا (7–10)',
        summary: 'نیاز حتمی به بستری روان‌پزشکی و نظارت مداوم ایمنی.',
        diagnosisAndTreatment: ['نظارت مداوم ۱ به ۱، مشاوره اورژانسی روان‌پزشکی و بستری روان‌پزشکی (یا انتقال پس از پایداری طبی).'],
        clinicalNotes: ['پاک‌سازی طبی (Medical Clearance) پیش از انتقال به بخش روان‌پزشکی انجام شود.'],
      };
    },
  },
];
