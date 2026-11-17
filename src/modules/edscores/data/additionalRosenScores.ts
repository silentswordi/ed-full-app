import { ClinicalScoreDefinition, sumCriteria } from '../types';

export const ADDITIONAL_ROSEN_SCORES: ClinicalScoreDefinition[] = [
  // =========================================================================
  // 55. EDACS (Emergency Department Assessment of Chest Pain Score)
  // =========================================================================
  {
    id: 'edacs',
    titleFa: 'اسکور EDACS (ارزیابی درد قفسه سینه در اورژانس)',
    titleEn: 'Emergency Department Assessment of Chest Pain Score (EDACS)',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: 'Than M et al. Int J Cardiol. 2014 / Rosen’s Emergency Medicine',
    criteria: [
      {
        id: 'age',
        label: 'رده سنی بیمار',
        type: 'select',
        options: [
          { label: '۱۸ تا ۴۵ سال', points: 2 },
          { label: '۴۶ تا ۵۰ سال', points: 4 },
          { label: '۵۱ تا ۵۵ سال', points: 6 },
          { label: '۵۶ تا ۶۰ سال', points: 8 },
          { label: '۶۱ تا ۶۵ سال', points: 10 },
          { label: '۶۶ تا ۷۰ سال', points: 12 },
          { label: '۷۱ تا ۷۵ سال', points: 14 },
          { label: '۷۶ تا ۸۰ سال', points: 16 },
          { label: '۸۱ تا ۸۵ سال', points: 18 },
          { label: '۸۶ سال و بالاتر', points: 20 },
        ],
      },
      { id: 'male', label: 'جنسیت مذکر', type: 'boolean', points: 6 },
      {
        id: 'age18_50_cad',
        label: 'سن ۱۸ تا ۵۰ سال با سابقه CAD شناخته‌شده یا ≥ ۳ عامل خطر قلبی',
        type: 'boolean',
        points: 4,
      },
      { id: 'diaphoresis', label: 'تعریق سرد (Diaphoresis)', type: 'boolean', points: 3 },
      { id: 'radiation', label: 'انتشار درد به بازو، شانه، گردن یا فک', type: 'boolean', points: 5 },
      { id: 'pleuritic', label: 'درد پلورتیک (تشدید با دم عمیق)', type: 'boolean', points: -4 },
      { id: 'palpation', label: 'درد قابل بازتولید با لمس دیواره قفسه سینه', type: 'boolean', points: -6 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score < 16) {
        return {
          score,
          riskLevel: 'low',
          riskTitle: 'کم‌خطر بر اساس EDACS (Score < 16)',
          summary: 'در صورت نوار قلب بدون ایسکمی جدید و منفی بودن تروپونین ۰ و ۲ ساعت، ریسک MACE ۳۰ روزه کمتر از ۱٪ است.',
          diagnosisAndTreatment: [
            'مسیر ترخیص سریع (ADP): چک تروپونین در بدو ورود (۰ ساعت) و ۲ ساعت بعد به همراه نوار قلب.',
            'در صورت منفی ماندن هر دو تروپونین و نبود تغییرات ایسکمیک در ECG، ترخیص ایمن با پیگیری سرپایی.',
          ],
          clinicalNotes: [
            'مسیر EDACS-ADP فقط زمانی معتبر است که هر سه شرط برقرار باشد: EDACS < 16، نوار قلب غیرایسکمیک و تروپونین‌های سریال منفی.',
          ],
        };
      }
      return {
        score,
        riskLevel: 'high',
        riskTitle: 'غیرکم‌خطر بر اساس EDACS (Score ≥ 16)',
        summary: 'بیمار معیار ترخیص فوق‌سریع EDACS-ADP را ندارد و نیازمند بررسی استاندارد ACS است.',
        diagnosisAndTreatment: [
          'پایش مداوم قلبی، نوار قلب سریال و اندازه‌گیری تروپونین بر اساس پروتکل استاندارد ACS.',
          'بستری یا تحت‌نظر در واحد درد قفسه سینه و مشاوره قلب.',
        ],
        clinicalNotes: [
          'در سنین پایین‌تر با درد پلورتیک یا تندرنس موضعی امتیاز منفی اعمال می‌شود، اما همچنان تشخیص‌های افتراقی خطرناک (PE، پنوموتوراکس) را مد نظر داشته باشید.',
        ],
      };
    },
  },

  // =========================================================================
  // 56. Modified Sgarbossa Criteria (STEMI in LBBB / Ventricular Pacing)
  // =========================================================================
  {
    id: 'modified-sgarbossa',
    titleFa: 'معیارهای اسگاربوسای تعدیل‌شده (تشخیص STEMI در LBBB/پیس)',
    titleEn: 'Modified Sgarbossa Criteria (Smith Rule)',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: 'Smith SW et al. Ann Emerg Med. 2012 / Rosen’s Emergency Medicine',
    criteria: [
      {
        id: 'concordantSte',
        label: 'صعود قطعه ST هم‌جهت با QRS به میزان ≥ ۱ میلی‌متر در حداقل یک لید (Concordant STE ≥ 1 mm)',
        type: 'boolean',
        points: 1,
      },
      {
        id: 'concordantStd',
        label: 'افت قطعه ST هم‌جهت با QRS به میزان ≥ ۱ میلی‌متر در لیدهای V1، V2 یا V3 (Concordant STD ≥ 1 mm)',
        type: 'boolean',
        points: 1,
      },
      {
        id: 'excessiveDiscordance',
        label: 'صعود قطعه ST ناهم‌جهت با نسبت |ST / S| ≥ ۰.۲۵ (یعنی ≥ ۲۵٪ عمق موج S) در حداقل یک لید با موج S ≥ ۱ mm',
        type: 'boolean',
        points: 1,
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 3,
          riskLevel: 'moderate',
          riskTitle: 'معیارهای اسگاربوسا منفی (۰ معیار مثبت)',
          summary: 'شواهد الکتروکاردیوگرافیک معادل STEMI در زمینه LBBB/ریتم پیس دیده نشد، اما انسداد کرونری به طور کامل رد نمی‌شود.',
          diagnosisAndTreatment: [
            'تکرار نوار قلب سریال هر ۱۵–۳۰ دقیقه و بررسی تروپونین.',
            'در صورت ادامه درد ایسکمیک مقاوم به درمان یا ناپایداری همودینامیک، مشاوره فوری کاردیولوژی برای آنژیوگرافی.',
          ],
          clinicalNotes: [
            'در معیار اسگاربوسای تعدیل‌شده، وجود حتی یک مورد مثبت برای تشخیص معادل STEMI کافی است.',
          ],
        };
      }
      return {
        score,
        maxScore: 3,
        riskLevel: 'critical',
        riskTitle: 'معادل STEMI مثبت — فعال‌سازی کد آنژیوگرافی فوری',
        summary: 'حساسیت و ویژگی بالا برای انسداد حاد شریان کرونری (OMI) در حضور LBBB یا ریتم پیس بطنی.',
        diagnosisAndTreatment: [
          'فعال‌سازی فوری کد STEMI / PCI اولیه (Primary PCI) یا ترومبولیتیک در نبود دسترسی.',
          'آسپرین ۳۰۰–۳۲۵ mg، مهارکننده P2Y12، هپارین و کنترل همودینامیک.',
        ],
        clinicalNotes: [
          'نسبت ST/S ≤ -۰.۲۵ (در صورت صعود ST و موج S منفی، یعنی ارتفاع صعود ST حداقل ۲۵٪ عمق موج S باشد) جایگزین قانون قدیمی ۵ میلی‌متر شده است.',
        ],
      };
    },
  },

  // =========================================================================
  // 57. Ottawa Heart Failure Risk Scale (OHFRS)
  // =========================================================================
  {
    id: 'ottawa-hf',
    titleFa: 'مقیاس ریسک نارسایی قلبی اتاوا (OHFRS)',
    titleEn: 'Ottawa Heart Failure Risk Scale (OHFRS)',
    category: 'cardiology',
    categoryLabel: 'قلب و عروق',
    reference: 'Stiell IG et al. Acad Emerg Med. 2013 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'cva', label: 'سابقه سکته مغزی یا TIA', type: 'boolean', points: 1 },
      { id: 'intubation', label: 'سابقه لوله‌گذاری قبلی برای دیسترس تنفسی', type: 'boolean', points: 2 },
      { id: 'hr110', label: 'ضربان قلب ≥ ۱۱۰ در دقیقه هنگام ورود', type: 'boolean', points: 2 },
      { id: 'spo2_90', label: 'اشباع اکسیژن SpO2 < ۹۰٪ در بدو ورود', type: 'boolean', points: 1 },
      { id: 'walkTest', label: 'عدم توانایی راه رفتن در تست ۳ دقیقه‌ای (یا SaO2 < ۹۰٪ / HR > ۱۱۰ حین تست)', type: 'boolean', points: 1 },
      { id: 'ecgIschemia', label: 'تغییرات ایسکمیک حاد در نوار قلب', type: 'boolean', points: 2 },
      { id: 'urea12', label: 'اوره سرم (Urea) ≥ ۱۲ mmol/L (معادل BUN ≥ ۳۴ mg/dL)', type: 'boolean', points: 1 },
      { id: 'bicarb35', label: 'بی‌کربنات سرم (CO2) ≥ ۳۵ mmol/L', type: 'boolean', points: 2 },
      { id: 'trop', label: 'تروپونین بالاتر از حد ۹۹٪ صدک (مثبت)', type: 'boolean', points: 2 },
      { id: 'bnp', label: 'NT-proBNP ≥ ۵,۰۰۰ ng/L', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score === 0) {
        return {
          score,
          maxScore: 15,
          riskLevel: 'low',
          riskTitle: 'ریسک بسیار پایین عوارض جدی (۰ امتیاز)',
          summary: 'احتمال رویداد جدی ۱۴ روزه حدود ۲.۸٪ است؛ کاندید مناسب برای ترخیص با پیگیری نزدیک.',
          diagnosisAndTreatment: [
            'بهینه‌سازی دیورتیک خوراکی و داروهای نارسایی قلبی (GDMT).',
            'آموزش محدودیت مایعات/نمک و پیگیری قلب ظرف ۲ تا ۴ روز.',
          ],
          clinicalNotes: [
            'در صورت نبود شرایط اجتماعی مناسب یا عدم بهبود دیس‌پنه پس از درمان اولیه، بستری ارجح است.',
          ],
        };
      }
      if (score <= 2) {
        return {
          score,
          maxScore: 15,
          riskLevel: 'moderate',
          riskTitle: 'ریسک متوسط عوارض ۱۴ روزه (۱ تا ۲ امتیاز)',
          summary: 'ریسک رویداد جدی حدود ۵ تا ۹٪؛ تصمیم ترخیص یا تحت‌نظر کوتاه‌مدت بر اساس پاسخ به درمان در اورژانس.',
          diagnosisAndTreatment: [
            'درمان با دیورتیک وریدی و پایش پاسخ بالینی و تست راه رفتن پس از درمان.',
            'بستری در واحد تحت‌نظر یا پیگیری سرپایی ۴۸ ساعته در صورت بهبود کامل.',
          ],
          clinicalNotes: [
            'تست راه رفتن ۳ دقیقه‌ای تنها پس از تثبیت اولیه تنفسی بیمار انجام می‌شود.',
          ],
        };
      }
      return {
        score,
        maxScore: 15,
        riskLevel: score >= 5 ? 'critical' : 'high',
        riskTitle: score >= 5 ? 'ریسک بسیار بالا (≥ ۵ امتیاز)' : 'ریسک بالا (۳ تا ۴ امتیاز)',
        summary: 'احتمال بالای مرگ‌ومیر، نیاز به NIV/اینتوباسیون، MI یا بستری مجدد ظرف ۱۴ روز.',
        diagnosisAndTreatment: [
          'بستری قطعی در بخش قلب یا ICU/CCU بر حسب وضعیت تنفسی و همودینامیک.',
          'اکسیژن/NIV در صورت هیپوکسمی یا ادم ریه، دیورتیک وریدی و وازودیلاتور در صورت فشار بالا.',
        ],
        clinicalNotes: [
          'اسکور ≥ ۳ به طور معمول آستانه توصیه‌شده برای بستری بیمار در نظر گرفته می‌شود.',
        ],
      };
    },
  },

  // =========================================================================
  // 58. Modified Fisher Scale (SAH Vasospasm Risk)
  // =========================================================================
  {
    id: 'modified-fisher',
    titleFa: 'مقیاس فیشر تعدیل‌شده (پیش‌بینی وازواسپاسم در SAH)',
    titleEn: 'Modified Fisher Scale for SAH',
    category: 'neurology',
    categoryLabel: 'مغز و اعصاب',
    reference: 'Frontera JA et al. Neurosurgery. 2006 / Rosen’s Emergency Medicine',
    criteria: [
      {
        id: 'grade',
        label: 'یافته‌های خونریزی در سی‌تی‌اسکن مغز بدون تزریق',
        type: 'select',
        options: [
          { label: 'گرید ۰: بدون خونریزی ساب‌آراکنوئید یا داخل بطنی (IVH)', points: 0 },
          { label: 'گرید ۱: SAH خفیف یا نازک، بدون خونریزی داخل بطنی (IVH)', points: 1 },
          { label: 'گرید ۲: SAH خفیف یا نازک همراه با خونریزی داخل بطنی (IVH)', points: 2 },
          { label: 'گرید ۳: SAH ضخیم، بدون خونریزی داخل بطنی (IVH)', points: 3 },
          { label: 'گرید ۴: SAH ضخیم همراه با خونریزی داخل بطنی (IVH)', points: 4 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      const rates = ['۰٪', '۲۴٪', '۳۳٪', '۳۳٪', '۴۰٪'];
      if (score <= 1) {
        return {
          score,
          maxScore: 4,
          riskLevel: score === 0 ? 'low' : 'moderate',
          riskTitle: `گرید ${score} فیشر تعدیل‌شده — ریسک پایین تا متوسط وازواسپاسم (${rates[score]})`,
          summary: `احتمال بروز ایسکمی مغزی تأخیری ناشی از وازواسپاسم حدود ${rates[score]} است.`,
          diagnosisAndTreatment: [
            'مشاوره فوری جراحی مغز و اعصاب، CTA یا آنژیوگرافی مغزی و شروع نیمودیپین خوراکی.',
            'بستری در ICU جراحی اعصاب و کنترل دقیق فشار خون تا زمان ایمن‌سازی آنوریسم.',
          ],
          clinicalNotes: [
            'گرید ۰ معمولاً در SAHهایی دیده می‌شود که سی‌تی منفی بوده و با LP تشخیص داده شده‌اند.',
          ],
        };
      }
      return {
        score,
        maxScore: 4,
        riskLevel: score >= 3 ? 'critical' : 'high',
        riskTitle: `گرید ${score} فیشر تعدیل‌شده — ریسک بالای وازواسپاسم (${rates[score]})`,
        summary: `احتمال بالای ایسکمی مغزی تأخیری و نیاز به پایش شدید نورولوژیک (${rates[score]}).`,
        diagnosisAndTreatment: [
          'بستری فوری در ICU نوروسرجری، شروع نیمودیپین ۶۰ mg هر ۴ ساعت و بررسی اندیکاسیون EVD در حضور IVH/هیدروسفالی.',
          'اجتناب از هیپوولمی، هیپوناترمیا و تب؛ برنامه‌ریزی ترمیم فوری آنوریسم (کویل یا کلیپ).',
        ],
        clinicalNotes: [
          'ترکیب خونریزی ضخیم سیسترنال همراه با IVH (گرید ۴) بیشترین خطر وازواسپاسم و هیدروسفالی حاد را دارد.',
        ],
      };
    },
  },

  // =========================================================================
  // 59. FeverPAIN Score (Acute Sore Throat)
  // =========================================================================
  {
    id: 'feverpain',
    titleFa: 'اسکور FeverPAIN (گلودرد و فارنژیت حاد)',
    titleEn: 'FeverPAIN Score for Strep Pharyngitis',
    category: 'infectious',
    categoryLabel: 'عفونت و سپسیس',
    reference: 'Little P et al. BMJ. 2013 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'fever', label: 'تب در ۲۴ ساعت گذشته (Fever)', type: 'boolean', points: 1 },
      { id: 'purulence', label: 'اگزودای چرکی روی لوزه‌ها (Purulence)', type: 'boolean', points: 1 },
      { id: 'attend3d', label: 'مراجعه سریع ظرف ≤ ۳ روز از شروع علائم (Attend rapidly)', type: 'boolean', points: 1 },
      { id: 'inflamed', label: 'التهاب شدید لوزه‌ها در معاینه (Severely inflamed tonsils)', type: 'boolean', points: 1 },
      { id: 'noCough', label: 'نبود سرفه یا آبریزش بینی (No cough or coryza)', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 1) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'low',
          riskTitle: 'احتمال پایین عفونت استرپتوکوکی (۱۳–۱۸٪)',
          summary: 'احتمال فارنژیت باکتریایی بسیار کم است و به احتمال زیاد عامل ویروسی است.',
          diagnosisAndTreatment: [
            'آنتی‌بیوتیک و تست استرپ توصیه نمی‌شود.',
            'درمان علامتی با مسکن (استامینوفن/ایبوپروفن) و مایعات گرم.',
          ],
          clinicalNotes: [
            'علائم خطر مانند تریسموس، آبریزش دهان یا انحراف زبان‌کوچک (آبسه پری‌تونسیلار) همیشه معاینه شوند.',
          ],
        };
      }
      if (score <= 3) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'moderate',
          riskTitle: 'احتمال متوسط فارنژیت استرپتوکوکی (۳۴–۴۰٪)',
          summary: 'گزینه انجام تست سریع استرپ (RADT) یا نسخه تأخیری آنتی‌بیوتیک.',
          diagnosisAndTreatment: [
            'انجام تست سریع استرپ (RADT) یا در نظر گرفتن نسخه تأخیری در صورت تداوم علائم پس از ۴۸–۷۲ ساعت.',
            'تجویز درمان علامتی و آموزش علائم هشدار به بیمار.',
          ],
          clinicalNotes: [
            'FeverPAIN نسبت به Centor در پیش‌بینی فواید آنتی‌بیوتیک در ویزیت‌های اولیه دقیق‌تر عمل می‌کند.',
          ],
        };
      }
      return {
        score,
        maxScore: 5,
        riskLevel: 'high',
        riskTitle: 'احتمال بالای عفونت استرپتوکوکی (۶۲–۶۵٪)',
        summary: 'اندیکاسیون قوی برای تست تأییدی یا شروع مستقیم آنتی‌بیوتیک.',
        diagnosisAndTreatment: [
          'تجویز پنی‌سیلین V یا آموکسی‌سیلین خوراکی (یا پنی‌سیلین بنزاتین عضلانی تک‌دوز؛ در آلرژی از ماکرولید/سفالوسپورین مناسب).',
          'کنترل درد و تب و تکمیل دوره درمان جهت پیشگیری از تب روماتیسمی.',
        ],
        clinicalNotes: [
          'کورتیکواستروئید تک‌دوز خوراکی (مانند دگزامتازون) می‌تواند در گلودرد شدید به کاهش سریع‌تر درد کمک کند.',
        ],
      };
    },
  },

  // =========================================================================
  // 60. Pittsburgh Knee Rule
  // =========================================================================
  {
    id: 'pittsburgh-knee',
    titleFa: 'قانون زانوی پیتزبورگ (رادیوگرافی ترومای زانو)',
    titleEn: 'Pittsburgh Knee Rule',
    category: 'trauma',
    categoryLabel: 'تروما و ارتوپدی',
    reference: 'Seaberg DC et al. Ann Emerg Med. 1998 / Rosen’s Emergency Medicine',
    criteria: [
      {
        id: 'blunt',
        label: 'مکانیسم آسیب ناشی از ترومای بلانت یا زمین‌خوردن (Blunt trauma / Fall)',
        type: 'boolean',
        points: 1,
        defaultValue: true,
      },
      { id: 'age', label: 'سن کمتر از ۱۲ سال یا بالاتر از ۵۰ سال', type: 'boolean', points: 1 },
      {
        id: 'noWalk',
        label: 'ناتوانی در برداشتن ۴ گام متوالی با تحمل وزن کامل روی هر دو پا در اورژانس',
        type: 'boolean',
        points: 1,
      },
    ],
    evaluate(values) {
      const blunt = Boolean(values.blunt);
      const age = Boolean(values.age);
      const noWalk = Boolean(values.noWalk);
      const needXray = blunt && (age || noWalk);
      const score = needXray ? 1 : 0;

      if (!blunt) {
        return {
          score: 0,
          maxScore: 1,
          riskLevel: 'moderate',
          riskTitle: 'خارج از حیطه قانون پیتزبورگ (مکانیسم غیربلانت)',
          summary: 'قانون پیتزبورگ برای ترومای بلانت یا سقوط تعریف شده است؛ بر اساس قضاوت بالینی تصمیم بگیرید.',
          diagnosisAndTreatment: [
            'ارزیابی بالینی، معاینه رباط‌ها و بررسی نیاز به تصویربرداری بر حسب مکانیسم.',
          ],
          clinicalNotes: [
            'این قانون روی بیماران با ترومای بلانت یا سقوط اعتبارسنجی شده است.',
          ],
        };
      }

      if (!needXray) {
        return {
          score,
          maxScore: 1,
          riskLevel: 'low',
          riskTitle: 'قانون منفی — نیازی به رادیوگرافی زانو نیست',
          summary: 'حساسیت نزدیک به ۱۰۰٪ برای رد شکستگی بالینی مهم زانو؛ تصویربرداری لازم نیست.',
          diagnosisAndTreatment: [
            'عدم انجام رادیوگرافی زانو در صورت اطمینان از معاینه قابل اعتماد.',
            'درمان علامتی (استراحت، یخ، مسکن، زانوبند در صورت نیاز) و پیگیری ارتوپدی در صورت تداوم علائم.',
          ],
          clinicalNotes: [
            'قانون پیتزبورگ در مقایسه با Ottawa Knee Rule در برخی مطالعات ویژگی بالاتری بدون افت حساسیت داشته است.',
          ],
        };
      }

      return {
        score,
        maxScore: 1,
        riskLevel: 'high',
        riskTitle: 'قانون مثبت — انجام رادیوگرافی زانو توصیه می‌شود',
        summary: 'به دلیل سن (<۱۲ یا >۵۰ سال) یا ناتوانی در برداشتن ۴ گام، رادیوگرافی زانو لازم است.',
        diagnosisAndTreatment: [
          'درخواست رادیوگرافی استاندارد زانو (AP و Lateral و در صورت شک به پاتلا نمای Sunrise/Merchant).',
          'بی‌حرکت‌سازی و بررسی همارتروز و آسیب لیگامانی.',
        ],
        clinicalNotes: [
          'در وجود لنگش قابل توجه نیز اگر بیمار نتواند ۴ گام متوالی با وزن‌گذاری واقعی بردارد، رادیوگرافی انجام شود.',
        ],
      };
    },
  },

  // =========================================================================
  // 61. AIMS65 Score (Upper GI Bleeding Mortality)
  // =========================================================================
  {
    id: 'aims65',
    titleFa: 'اسکور AIMS65 (مرگ‌ومیر خونریزی فوقانی گوارش)',
    titleEn: 'AIMS65 Score for Upper GI Bleeding',
    category: 'gi_surgery',
    categoryLabel: 'گوارش و جراحی',
    reference: 'Saltzman JR et al. Gastrointest Endosc. 2011 / Rosen’s Emergency Medicine',
    criteria: [
      { id: 'alb', label: 'آلبومین سرم < ۳.۰ g/dL (Albumin)', type: 'boolean', points: 1 },
      { id: 'inr', label: 'INR > ۱.۵', type: 'boolean', points: 1 },
      { id: 'mental', label: 'اختلال هوشیاری (GCS < 14، بی‌قراری یا لتارژی)', type: 'boolean', points: 1 },
      { id: 'sbp', label: 'فشار خون سیستولیک ≤ ۹۰ mmHg', type: 'boolean', points: 1 },
      { id: 'age65', label: 'سن بالای ۶۵ سال', type: 'boolean', points: 1 },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      const mortalities = ['۰.۳٪', '۱.۲٪', '۵.۳٪', '۱۰.۳٪', '۱۶.۵٪', '۲۴.۵٪'];
      const mort = mortalities[Math.min(5, Math.max(0, Math.round(score)))];

      if (score <= 1) {
        return {
          score,
          maxScore: 5,
          riskLevel: 'low',
          riskTitle: `ریسک پایین مرگ‌ومیر بیمارستانی (${mort})`,
          summary: 'بیمار در گروه کم‌خطر AIMS65 قرار دارد، اما برای تصمیم ترخیص باید همزمان Glasgow-Blatchford نیز بررسی شود.',
          diagnosisAndTreatment: [
            'برقراری دسترسی وریدی، شروع PPI و مشاوره گوارش جهت برنامه‌ریزی آندوسکوپی.',
            'کنترل هموگلوبین و ثبات همودینامیک.',
          ],
          clinicalNotes: [
            'اسکور AIMS65 پیش‌بینی‌کننده مرگ‌ومیر است (نه لزوماً نیاز به مداخله یا ترانسفیوژن که GBS بهتر پیش‌بینی می‌کند).',
          ],
        };
      }
      return {
        score,
        maxScore: 5,
        riskLevel: score >= 3 ? 'critical' : 'high',
        riskTitle: score >= 3 ? `ریسک بسیار بالای مرگ‌ومیر (${mort})` : `ریسک بالای مرگ‌ومیر (${mort})`,
        summary: `خطر قابل توجه مرگ‌ومیر بیمارستانی، نیاز به ICU و طول بستری طولانی‌تر (${mort}).`,
        diagnosisAndTreatment: [
          'احیای فوری با دو رگ وریدی بزرگ، رزرو فرآورده خونی، اصلاح اختلال انعقادی و شروع PPI وریدی (و اوکتروتاید/آنتی‌بیوتیک در شک به واریس).',
          'مشاوره فوری گوارش برای آندوسکوپی اورژانسی پس از احیای همودینامیک و بستری در ICU.',
        ],
        clinicalNotes: [
          'امتیاز ≥ ۲ نشان‌دهنده افزایش واضح خطر مرگ‌ومیر بیمارستانی است.',
        ],
      };
    },
  },

  // =========================================================================
  // 62. PRAM Score (Pediatric Respiratory Assessment Measure - Asthma)
  // =========================================================================
  {
    id: 'pram-asthma',
    titleFa: 'اسکور PRAM (شدت حمله آسم در اطفال)',
    titleEn: 'PRAM Score (Pediatric Respiratory Assessment Measure)',
    category: 'peds_heme',
    categoryLabel: 'اطفال، هماتولوژی و روان',
    reference: 'Chalut DS et al. J Pediatr. 2000 / Rosen’s Emergency Medicine',
    criteria: [
      {
        id: 'scalene',
        label: 'استفاده از عضلات اسکالن (Scalene muscle contraction)',
        type: 'select',
        options: [
          { label: 'ندارد', points: 0 },
          { label: 'دارد', points: 2 },
        ],
      },
      {
        id: 'suprasternal',
        label: 'رتراکسیون سوپرااسترنال (Suprasternal indrawing)',
        type: 'select',
        options: [
          { label: 'ندارد', points: 0 },
          { label: 'دارد', points: 2 },
        ],
      },
      {
        id: 'wheezing',
        label: 'ویزینگ (Wheezing)',
        type: 'select',
        options: [
          { label: 'ندارد', points: 0 },
          { label: 'فقط در بازدم', points: 1 },
          { label: 'در دم و بازدم', points: 2 },
          { label: 'قابل شنیدن بدون گوشی یا قفسه سینه خاموش با ورود هوای کم', points: 3 },
        ],
      },
      {
        id: 'airEntry',
        label: 'ورود هوا در سمع ریه (Air Entry)',
        type: 'select',
        options: [
          { label: 'نرمال', points: 0 },
          { label: 'کاهش‌یافته در قاعده‌ها', points: 1 },
          { label: 'کاهش‌یافته منتشر', points: 2 },
          { label: 'ناشنوا / بسیار کم', points: 3 },
        ],
      },
      {
        id: 'spo2',
        label: 'اشباع اکسیژن (SpO2 در هوای اتاق)',
        type: 'select',
        options: [
          { label: '≥ ۹۵٪', points: 0 },
          { label: '۹۲٪ تا ۹۴٪', points: 1 },
          { label: '< ۹۲٪', points: 2 },
        ],
      },
    ],
    evaluate(values) {
      const score = sumCriteria(this.criteria, values);
      if (score <= 3) {
        return {
          score,
          maxScore: 12,
          riskLevel: 'low',
          riskTitle: 'حمله آسم خفیف اطفال (PRAM ۰–۳)',
          summary: 'دیسترس تنفسی خفیف؛ معمولاً با درمان استاندارد سرپایی کنترل می‌شود.',
          diagnosisAndTreatment: [
            'سالبوتامول استنشاقی (MDI با اسپیسر یا نبولایزر) بر حسب نیاز.',
            'در نظر گرفتن دگزامتازون یا پردنیزولون خوراکی در صورت نیاز به چند پاف یا پاسخ ناکافی اولیه.',
          ],
          clinicalNotes: [
            'ارزیابی مجدد PRAM پس از ۱ ساعت از درمان کمک‌کننده در تصمیم ترخیص است.',
          ],
        };
      }
      if (score <= 7) {
        return {
          score,
          maxScore: 12,
          riskLevel: 'moderate',
          riskTitle: 'حمله آسم متوسط اطفال (PRAM ۴–۷)',
          summary: 'نیازمند درمان مکرر برونکودیلاتور و استروئید سیستمیک در اورژانس.',
          diagnosisAndTreatment: [
            'اکسیژن در صورت SpO2 < ۹۲–۹۴٪.',
            'سالبوتامول + ایپراتروپیوم بروماید هر ۲۰ دقیقه تا ۳ دوز در ساعت اول.',
            'تجویز سریع کورتیکواستروئید خوراکی (دگزامتازون ۰.۶ mg/kg یا پردنیزولون ۱–۲ mg/kg).',
          ],
          clinicalNotes: [
            'در صورت عدم افت اسکور به ≤ ۳ پس از درمان اولیه، بستری یا سولفات منیزیم وریدی بررسی شود.',
          ],
        };
      }
      return {
        score,
        maxScore: 12,
        riskLevel: 'critical',
        riskTitle: 'حمله آسم شدید / تهدیدکننده حیات اطفال (PRAM ۸–۱۲)',
        summary: 'دیسترس تنفسی شدید و خطر خستگی تنفسی و هیپوکسمی.',
        diagnosisAndTreatment: [
          'اکسیژن پرجریان، نبولایزر مداوم سالبوتامول + ایپراتروپیوم و کورتیکواستروئید وریدی (متیل‌پردنیزولون ۱–۲ mg/kg).',
          'سولفات منیزیم وریدی (۵۰ mg/kg طی ۲۰ دقیقه) و در نظر گرفتن اپی‌نفرین عضلانی یا HFNC / BiPAP / PICU.',
        ],
        clinicalNotes: [
          'کاهش یا خاموش شدن صداهای تنفسی (Silent Chest) همراه با کاهش سطح هوشیاری نشانه نارسایی تنفسی قریب‌الوقوع است.',
        ],
      };
    },
  },
];
