export interface PediatricDrug {
  no: number;
  hasRenalAdjustment: boolean; // marked with * in handbook
  nameEn: string;
  nameFa: string;
  form: string;
  formFa?: string;
  indication: string;
  dosage: string;
  interval: string;
  intervalFa?: string;
  maxDose: string;
  notice: string;
  category: string;
  practicalFormula?: string; // e.g. W/2 ml/dose, W*2 drop/dose
  formulaType?: 'w_div_2_ml' | 'w_div_3_ml' | 'w_div_4_ml' | 'w_div_5_ml' | 'w_mul_2_drop' | 'w_div_1_ml' | 'custom';
  ageRestriction?: string;
  g6pdWarning?: boolean;
}

export const PEDIATRIC_DRUGS: PediatricDrug[] = [
  {
    no: 1,
    hasRenalAdjustment: true,
    nameEn: "Acetaminophen",
    nameFa: "استامینوفن (پاراستامول)",
    form: "Drop 100mg/ml (قطره اطفال) | Syr 120mg/5ml (شربت) | Susp 160mg/5ml (سوسپانسیون) | Supp 125, 325mg (شیاف) | Tab 325, 500mg (قرص) | Inj 1000mg/100ml (آپوتل تزریقی)",
    formFa: "شربت ۱۲۰ میلی‌گرم/۵ سی‌سی | قطره ۱۰۰ میلی‌گرم/سی‌سی | شیاف ۱۲۵ و ۳۲۵ میلی‌گرم | قرص ۳۲۵ و ۵۰۰ میلی‌گرم | آمپول ۱۰۰۰ میلی‌گرم",
    indication: "کنترل تب و ضد درد",
    dosage: "10-15 mg/kg/dose (دوز ضد تب و درد خوراکی/وریدی/شیاف) | شیاف ضد درد: 20-30 mg/kg/dose",
    interval: "Q4-6hr",
    intervalFa: "هر ۴ تا ۶ ساعت (حداکثر ۵ بار در ۲۴ ساعت)",
    maxDose: "شیرخواران: 60mg/kg/day | کودکان: 90mg/kg/day",
    notice: "فرمول سریع شربت: وزن ÷ ۲ سی‌سی هر ۴-۶ ساعت. قطره: وزن × ۲ قطره. دوز ضد درد شیاف ۲۰-۳۰ میلی‌گرم بر کیلوگرم است.",
    category: "ضد درد و تب",
    practicalFormula: "شربت: W/2 ml/dose | قطره: W×2 drop/dose",
    formulaType: "w_div_2_ml"
  },
  {
    no: 2,
    hasRenalAdjustment: true,
    nameEn: "Acyclovir",
    nameFa: "آسیکلوویر",
    form: "Susp 200mg/5ml (سوسپانسیون) | Tab 200, 400, 800mg (قرص) | Vial 250, 500mg (ویال انفوزیون وریدی) | Oint 5% (پماد جلدی) | Eye Oint 3% (پماد چشمی)",
    indication: "تبخال، استوماتیت، آبله مرغان، زونا، آنسفالیت",
    dosage: "خوراکی: استوماتیت/تبخال: 15mg/kg/dose (QID برای 7-10 روز) | آبله مرغان/زونا: 20mg/kg/dose (QID برای 5 روز)\nوریدی: آنسفالیت: 10-15mg/kg/dose (TDS برای 14-21 روز) | آبله مرغان: 10mg/kg/dose (TDS برای 7-10 روز) | استوماتیت: 5mg/kg/dose (QID برای 5-7 روز)",
    interval: "QID (خوراکی) / TDS (وریدی)",
    maxDose: "خوراکی: 250mg/dose (استوماتیت) | 800mg/dose (آبله مرغان)",
    notice: "تنظیم دوز در نارسایی کلیه ضروری است (*). هیدراتاسیون کافی حین تجویز وریدی رعایت شود.",
    category: "ضدویروس"
  },
  {
    no: 3,
    hasRenalAdjustment: false,
    nameEn: "Adenosine",
    nameFa: "آدنوزین",
    form: "Amp 6mg/2ml (آمپول تزریقی فوق‌سریع وریدی)",
    indication: "تاکی‌کاردی فوق بطنی (PSVT / SVT)",
    dosage: "0.1 - 0.2 mg/kg",
    interval: "Q2min PRN (در صورت عدم پاسخ تا ۲ بار قابل تکرار)",
    maxDose: "6 mg در دوز اول (دوز دوم حداکثر 12mg)",
    notice: "تزریق فوق‌العاده سریع وریدی طی ۲ ثانیه از نزدیک‌ترین رگ به قلب همراه با بولوس فوری نرمال سالین (Flash).",
    category: "قلب و اورژانس"
  },
  {
    no: 4,
    hasRenalAdjustment: false,
    nameEn: "Albendazole",
    nameFa: "آلبندازول",
    form: "Tab 400mg (قرص جویدنی) | Susp 200mg/5ml (سوسپانسیون خوراکی)",
    indication: "کرمک (اکسیور)، آسکاریس",
    dosage: "400 mg تک‌دوز (Single Dose)",
    interval: "تکرار دو هفته بعد",
    maxDose: "400 mg",
    notice: "۱- درمان همزمان تمام اعضای خانواده الزامی است. ۲- قرص جویده یا در آب حل شود. ۳- منع مصرف در بارداری.",
    category: "ضدانگل"
  },
  {
    no: 5,
    hasRenalAdjustment: false,
    nameEn: "Albumin",
    nameFa: "آلبومین",
    form: "Vial 20% (50ml, 100ml) | Vial 5%",
    indication: "هیپوآلبومینمی، هیپوولومی",
    dosage: "0.5 - 1 gr/kg/dose انفوزیون آهسته طی ۱ تا ۲ ساعت",
    interval: "طبق وضعیت بالینی",
    maxDose: "در هیپوآلبومینمی: 2 gr/kg/day | در هیپوولومی: 6 gr/kg/day",
    notice: "هر ۱۰۰ میلی‌لیتر آلبومین ۲۰٪ برابر با ۲۰ گرم آلبومین است.",
    category: "فرآورده‌های خونی و سرم"
  },
  {
    no: 6,
    hasRenalAdjustment: true,
    nameEn: "Allopurinol",
    nameFa: "آلوپورینول",
    form: "Tab 100mg | Tab 300mg",
    indication: "سندرم لیز تومور (Tumor Lysis Syndrome)",
    dosage: "10 mg/kg/day",
    interval: "BID - QID (تقسیم در ۲ تا ۴ وعده)",
    maxDose: "600 mg / 24hr",
    notice: "تنظیم دوز در نارسایی کلیوی الزامی است (*). کنترل برون‌ده ادراری و اسید اوریک.",
    category: "انکولوژی و متابولیک"
  },
  {
    no: 7,
    hasRenalAdjustment: true,
    nameEn: "Amikacin",
    nameFa: "آمیکاسین",
    form: "Vial 100mg/2ml (ویال اطفال) | Vial 250mg/2ml | Vial 500mg/2ml (تزریقی)",
    indication: "عفونت‌های شدید باکتریایی گرم منفی",
    dosage: "15 - 22.5 mg/kg/day",
    interval: "TDS (هر ۸ ساعت) یا SDD/ODD طبق پروتکل نوزادی",
    maxDose: "1.5 gr/day",
    notice: "دارای اتوتوکسیسیتی و نفروتوکسیسیتی. تنظیم دقیق دوز کلیوی الزامی است (*). مانیتورینگ سطح سرمی توصیه می‌شود.",
    category: "آنتی بیوتیک"
  },
  {
    no: 8,
    hasRenalAdjustment: true,
    nameEn: "Amoxicillin",
    nameFa: "آموکسی‌سیلین",
    form: "Susp 125mg/5ml | Susp 200mg/5ml | Susp 250mg/5ml | Cap 250, 500mg | Tab 500mg",
    indication: "اوتیت میانی حاد، سینوزیت، پنومونی",
    dosage: "80 - 90 mg/kg/day (فرمول سریع سوسپانسیون ۲۵۰: وزن ÷ ۲ سی‌سی در هر دوز)",
    interval: "BID (هر ۱۲ ساعت)",
    maxDose: "2 - 3 gr/day",
    notice: "فرمول سریع: برای سوسپانسیون 250mg/5ml، مقدار (وزن کودک ÷ ۲) میلی‌لیتر هر ۱۲ ساعت تجویز می‌شود. تنظیم دوز کلیوی (*).",
    category: "آنتی بیوتیک",
    practicalFormula: "W/2 ml/dose (سوسپانسیون 250 هر 12 ساعت)",
    formulaType: "w_div_2_ml"
  },
  {
    no: 9,
    hasRenalAdjustment: true,
    nameEn: "Amoxicillin - Clavulanic Acid (Farmentin)",
    nameFa: "فارمنتین (کوآموکسی‌کلاو)",
    form: "Susp 156mg/5ml | Susp 228mg/5ml | Susp 312mg/5ml | Susp 457mg/5ml | Susp 643mg/5ml (ES) | Tab 375, 625mg | Vial 600mg, 1.2g",
    indication: "اوتیت، سینوزیت، پنومونی مقاوم",
    dosage: "80 - 90 mg/kg/day (بر اساس جزء آموکسی‌سیلین)\nسوسپانسیون ۶۴۳: فرمول سریع: وزن ÷ ۳ سی‌سی هر ۱۲ ساعت (BID)\nسوسپانسیون ۴۵۷: وزن ÷ ۲ سی‌سی هر ۱۲ ساعت (BID)\nکپسول ۶۲۵: وزن ÷ ۲ هر ۸ ساعت (TDS)",
    interval: "BID (سوسپانسیون‌های ۶۴۳ و ۴۵۷) / TDS (فرم ۶۲۵)",
    maxDose: "3 gr/day (بر اساس آموکسی‌سیلین)",
    notice: "مناسب‌ترین فرمولاسیون از نظر نسبت کلاولانات، فرم ۶۴۳ (Farmentin ES) است که اسهال کمتری می‌دهد. تنظیم دوز کلیوی (*).",
    category: "آنتی بیوتیک",
    practicalFormula: "فرم ۶۴۳: W/3 ml/dose BID | فرم ۴۵۷: W/2 ml/dose BID",
    formulaType: "w_div_3_ml"
  },
  {
    no: 10,
    hasRenalAdjustment: true,
    nameEn: "Ampicillin",
    nameFa: "آمپی‌سیلین",
    form: "Vial 250mg, 500mg, 1g (تزریقی) | Susp 125, 250mg/5ml | Cap 250, 500mg",
    indication: "عفونت‌های خفیف تا متوسط، مننژیت باکتریایی",
    dosage: "عفونت خفیف تا متوسط: 100-150 mg/kg/day\nعفونت شدید (مانند مننژیت): 200-400 mg/kg/day",
    interval: "QID (هر ۶ ساعت) به صورت IV یا IM",
    maxDose: "خفیف-متوسط: 2-4 gr/day | شدید: 6-12 gr/day",
    notice: "تنظیم دوز کلیوی لازم است (*). در مننژیت نوزادان و کودکان همراه سفوتوکسیم یا آمینوگلیکوزید تجویز می‌شود.",
    category: "آنتی بیوتیک"
  },
  {
    no: 11,
    hasRenalAdjustment: false,
    nameEn: "Atropine Sulfate",
    nameFa: "آتروپین سولفات",
    form: "Amp 0.5mg/ml (آمپول تزریقی) | Eye Drop 0.5%, 1% (قطره چشمی)",
    indication: "احیای قلبی ریوی (CPR)، برادیکاردی علامت‌دار",
    dosage: "0.02 mg/kg/dose",
    interval: "هر ۵ دقیقه تا ۳ نوبت در صورت لزوم (PRN)",
    maxDose: "0.5 mg/dose (حداقل دوز مجاز: 0.1 mg جهت پیشگیری از برادیکاردی پارادوکسیکال)",
    notice: "تزریق دوز کمتر از ۰.۱ میلی‌گرم می‌تواند موجب برادیکاردی معکوس شود.",
    category: "قلب و اورژانس"
  },
  {
    no: 12,
    hasRenalAdjustment: false,
    nameEn: "Azithromycin",
    nameFa: "آزیترومایسین",
    form: "Susp 100mg/5ml | Susp 200mg/5ml | Cap 250mg | Tab 250, 500mg | Vial 500mg (انفوزیون)",
    indication: "فارنژیت استرپتوکوکی چرکی، سیاه‌سرفه",
    dosage: "سیاه‌سرفه بالای ۶ ماه: 5 mg/kg/day (فرمول سوسپانسیون ۱۰۰: W/4 ml)\nفارنژیت چرکی: 6-12 mg/kg/day (روز اول دوز ۲ برابر)\nسیاه‌سرفه زیر ۶ ماه: 10 mg/kg/day به مدت ۵ روز (فرمول سوسپانسیون ۱۰۰: W/2 ml)",
    interval: "یک بار در روز به مدت ۵ روز (Daily × 5d)",
    maxDose: "500 mg/day",
    notice: "۱- روز اول دوز ۲ برابر تجویز می‌شود. ۲- فرمول‌های سریع W/4 و W/2 بر حسب سوسپانسیون ۱۰۰ میلی‌گرم محاسبه شده است.",
    category: "آنتی بیوتیک",
    practicalFormula: "Susp 100: W/4 ml/dose (دوز 5mg/kg) یا W/2 ml (دوز 10mg/kg)",
    formulaType: "w_div_4_ml"
  },
  {
    no: 13,
    hasRenalAdjustment: false,
    nameEn: "Beclomethasone",
    nameFa: "بکلومتاسون",
    form: "Spray (oral inhaler)",
    indication: "آسم پایدار، پروفیلاکسی حملات",
    dosage: "40 mcg (۱ الی ۲ پاف)",
    interval: "BID (هر ۱۲ ساعت)",
    maxDose: "80 mcg/dose",
    notice: "پس از استنشاق، شستشوی دهان جهت پیشگیری از کاندیدیازیس (برفک) دهانی الزامی است.",
    category: "تنفسی و آسم"
  },
  {
    no: 14,
    hasRenalAdjustment: false,
    nameEn: "Bisacodyl",
    nameFa: "بیزاکودیل",
    form: "Supp 5mg (شیاف کودکان) | Supp 10mg (شیاف بزرگسال) | Tab 5mg (قرص)",
    indication: "یبوست شدید و مقاوم",
    dosage: "۲ تا ۱۱ سال: 5 mg | بالای ۱۱ سال: 10 mg",
    interval: "Single Dose (S.D)",
    maxDose: "10 mg",
    notice: "در موارد شک به انسداد روده و در سن زیر ۲ سال ممنوع است.",
    category: "گوارش",
    ageRestriction: "ممنوع در کودکان زیر ۲ سال"
  },
  {
    no: 15,
    hasRenalAdjustment: false,
    nameEn: "Ca. Gluconate",
    nameFa: "کلسیم گلوکونات",
    form: "Amp 10% (1g/10ml - ویال/آمپول ۱۰٪ تزریقی)",
    indication: "هایپرکالمی، ایست قلبی، هایپوکلسمی علامت‌دار",
    dosage: "هایپرکالمی/ایست قلبی: 1-2 ml/kg/dose (Q10min تا حداکثر ۳ دوز)\nهایپوکلسمی: 0.5-1.25 ml/kg/dose هر ۶ ساعت",
    interval: "Q10min (اورژانس) / Q6hr (هایپوکلسمی)",
    maxDose: "10 ml/dose (حداکثر ۳ دوز در CPR)",
    notice: "۱- تزریق زیرجلدی (SC) و عضلانی (IM) به دلیل خطر نکروز بافتی اکیداً ممنوع است (فقط IV آهسته). ۲- هر ۱ میلی‌لیتر کلسیم گلوکونات ۱۰٪ حاوی ۱۰۰ میلی‌گرم دارو است.",
    category: "قلب و اورژانس"
  },
  {
    no: 16,
    hasRenalAdjustment: false,
    nameEn: "Calamin-D",
    nameFa: "کالامین-دی",
    form: "Cream / Lotion 8% (کرم و لوسیون موضعی)",
    indication: "ضایعات خارش‌دار پوستی، کهیر، آبله مرغان، گزیدگی حشرات",
    dosage: "یک لایه نازک روی موضع تمیز",
    interval: "TDS (۳ بار در روز)",
    maxDose: "موضعی",
    notice: "روی زخم‌های باز یا پوست دارای ترشح شدید استفاده نشود.",
    category: "موضعی و پوستی"
  },
  {
    no: 17,
    hasRenalAdjustment: true,
    nameEn: "Cefazolin",
    nameFa: "سفازولین",
    form: "Vial 250mg, 500mg, 1g (ویال تزریقی عضلانی/وریدی)",
    indication: "عفونت‌های پوست، بافت نرم، پیشگیری جراحی، استافیلوکوکی",
    dosage: "عفونت خفیف تا متوسط: 25-50 mg/kg/day\nعفونت شدید: 100-150 mg/kg/day",
    interval: "TDS - QID (هر ۶ الی ۸ ساعت)",
    maxDose: "خفیف-متوسط: 3 gr/day | شدید: 6 gr/day",
    notice: "تنظیم دوز در نارسایی کلیوی ضروری است (*).",
    category: "آنتی بیوتیک"
  },
  {
    no: 18,
    hasRenalAdjustment: true,
    nameEn: "Cefixime",
    nameFa: "سفکسیم (سفیکسیم)",
    form: "Susp 100mg/5ml | Susp 200mg/5ml | Cap 200, 400mg | Tab 400mg",
    indication: "عفونت ادراری (UTI)، شیگلوز، اوتیت میانی",
    dosage: "8 mg/kg/day منقسم در یک یا دو وعده",
    interval: "BID (هر ۱۲ ساعت) یا یک‌بار در روز",
    maxDose: "400 mg / day",
    notice: "",
    category: "آنتی بیوتیک"
  },
  {
    no: 19,
    hasRenalAdjustment: true,
    nameEn: "Cefotaxime",
    nameFa: "سفوتوکسیم",
    form: "Vial 500mg, 1g (ویال تزریقی وریدی/عضلانی)",
    indication: "عفونت‌های نوزادی، سپسیس، مننژیت، سپسیس باکتریایی",
    dosage: "خفیف تا متوسط: 50-180 mg/kg/day (دوز معمول: 150 mg/kg/day)\nعفونت شدید: 200 mg/kg/day",
    interval: "TDS - QID (هر ۶ الی ۸ ساعت)",
    maxDose: "خفیف-متوسط: 3-6 gr/day | شدید: 8-12 gr/day",
    notice: "در نوزادان داروی انتخابی سفالوسپورین نسل ۳ به جای سفتریاکسون است تا خطر کرن‌ایکتروس ایجاد نشود. تنظیم دوز کلیوی (*).",
    category: "آنتی بیوتیک"
  },
  {
    no: 20,
    hasRenalAdjustment: false,
    nameEn: "Ceftazidime",
    nameFa: "سفتازیدیم",
    form: "Vial 500mg, 1g, 2g (ویال تزریقی ضد سودوموناس)",
    indication: "عفونت‌های سودومونایی، تب نوتروپنی",
    dosage: "خفیف تا متوسط: 90-150 mg/kg/day\nعفونت شدید: 200-300 mg/kg/day",
    interval: "TDS (هر ۸ ساعت)",
    maxDose: "6 gr/day",
    notice: "پوشش فوق‌العاده روی سودوموناس آئروژینوزا. تنظیم دوز کلیوی در کراتینین بالا.",
    category: "آنتی بیوتیک"
  },
  {
    no: 21,
    hasRenalAdjustment: false,
    nameEn: "Cefuroxime",
    nameFa: "سفوروکسیم",
    form: "Susp 125mg/5ml | Tab 250, 500mg | Vial 750mg, 1.5g",
    indication: "سینوزیت، اوتیت مدیا مقاوم، جایگزین پنی‌سیلین در آلرژی",
    dosage: "30 mg/kg/day",
    interval: "BID (هر ۱۲ ساعت)",
    maxDose: "1 gr/day",
    notice: "بهترین داروی جایگزین در اوتیت و سینوزیت در بیماران آلرژیک به پنی‌سیلین (فاقد شوک آنافیلاکسی). همراه غذا جذب بهتری دارد.",
    category: "آنتی بیوتیک"
  },
  {
    no: 22,
    hasRenalAdjustment: false,
    nameEn: "Ceftriaxone",
    nameFa: "سفتریاکسون",
    form: "Vial 250mg, 500mg, 1g (ویال تزریقی عضلانی/وریدی)",
    indication: "شیگلا، اوتیت، پنومونی، UTI، مننژیت",
    dosage: "شیگلا و اوتیت: 50 mg/kg/day\nپنومونی و UTI: 75 mg/kg/day\nمننژیت: 100 mg/kg/day",
    interval: "BID (یا QD بسته به اندیکاسیون)",
    maxDose: "شیگلا/اوتیت/پنومونی: 2 gr/day | مننژیت: 4 gr/day",
    notice: "۱- دوره درمان شیگلا: ۵ تا ۷ روز. ۲- درمان اوتیت: ۱ تا ۳ روز. ۳- مصرف آن در دوره نوزادی به علت جابجایی بیلی‌روبین از آلبومین و خطر کرن‌ایکتروس ممنوع است.",
    category: "آنتی بیوتیک",
    ageRestriction: "اکیداً ممنوع در دوره نوزادی"
  },
  {
    no: 23,
    hasRenalAdjustment: true,
    nameEn: "Cephalexin",
    nameFa: "سفالکسین",
    form: "Susp 125mg/5ml | Susp 250mg/5ml | Cap 250, 500mg",
    indication: "زردزخم (ایمپتیگو)، فارنژیت، عفونت بافت نرم و ادراری",
    dosage: "25 - 50 mg/kg/day (فرمول سوسپانسیون ۲۵۰: وزن ÷ ۴ سی‌سی در هر دوز)",
    interval: "QID (هر ۶ ساعت)",
    maxDose: "4 gr/day",
    notice: "فرمول سریع: برای سوسپانسیون ۲۵۰ میلی‌گرم، مقدار (وزن کودک ÷ ۴) میلی‌لیتر هر ۶ ساعت تجویز می‌شود. تنظیم دوز کلیوی (*).",
    category: "آنتی بیوتیک",
    practicalFormula: "W/4 ml/dose QID (سوسپانسیون 250)",
    formulaType: "w_div_4_ml"
  },
  {
    no: 24,
    hasRenalAdjustment: true,
    nameEn: "Cetirizine",
    nameFa: "ستیریزین",
    form: "Drop 10mg/ml (قطره خوراکی) | Syr 5mg/5ml (شربت) | Tab 5, 10mg (قرص)",
    indication: "رینیت آلرژیک، حساسیت دارویی، علائم آلرژیک سرماخوردگی",
    dosage: "۶ ماه تا ۲ سال: 2.5 ml یک‌بار در روز\n۲ تا ۵ سال: 2.5 تا 5 ml یک‌بار در روز\nبالای ۵ سال: 5 تا 10 mg روزانه",
    interval: "Daily (یک بار در روز)",
    maxDose: "10 mg/day",
    notice: "مصرف در سن زیر ۶ ماه توصیه نمی‌شود. در بیماران دارای تشنج احتیاط شود. تنظیم دوز در اختلال شدید کلیوی (*).",
    category: "آلرژی و آنتی‌هیستامین",
    ageRestriction: "زیر ۶ ماه توصیه نمی‌شود"
  },
  {
    no: 25,
    hasRenalAdjustment: false,
    nameEn: "Charcoal (Activated)",
    nameFa: "شارکول فعال (کربن فعال)",
    form: "Powder (پودر حل‌شونده در آب)",
    indication: "مسمومیت‌های حاد دارویی و خوراکی",
    dosage: "1 - 2 gr/kg/dose",
    interval: "تک دوز در ساعات اولیه مسمومیت",
    maxDose: "50 - 100 gr",
    notice: "در مسمومیت با آهن، اتانول، متانول، اسیدها، قلیاها، سیانید و لیتیوم به هیچ وجه مؤثر نیست و نباید تجویز شود.",
    category: "قلب و اورژانس"
  },
  {
    no: 26,
    hasRenalAdjustment: true,
    nameEn: "Chloral Hydrate 5%",
    nameFa: "کلرال هیدرات ۵٪",
    form: "Syr 250mg/5ml (۵۰ میلی‌گرم در هر میلی‌لیتر)",
    indication: "آرام‌بخش برای انجام پروسیجرها: سونوگرافی، LP، نوار مغز (EEG)...",
    dosage: "50 - 75 mg/kg/dose (معادل 1 تا 1.5 ml/kg/dose)",
    interval: "Single Dose (S.D)",
    maxDose: "10 - 15 ml/dose (حداکثر ۱ گرم)",
    notice: "در اکثر پروسیجرها با دوز 75mg/kg استفاده می‌شود. مانیتورینگ تنفس ضروری است. تنظیم کلیوی (*).",
    category: "آرام‌بخش و اعصاب"
  },
  {
    no: 27,
    hasRenalAdjustment: false,
    nameEn: "Clindamycin",
    nameFa: "کلیندامایسین",
    form: "Amp 300mg/2ml, 600mg/4ml (آمپول تزریقی) | Cap 150, 300mg (کپسول) | Sol 1% (محلول موضعی)",
    indication: "سلولیت اوربیتال، پنومونی آسپیراسیون، عفونت‌های بی‌هوازی و استاف مقاوم",
    dosage: "25 - 40 mg/kg/day (در عفونت شدید: 40 mg/kg/day)",
    interval: "TDS - QID (هر ۶ الی ۸ ساعت)",
    maxDose: "2.7 gr/day",
    notice: "در صورت بروز اسهال شدید، به علت خطر کولیت سودوممبران ارزیابی شود. کپسول با آب فراوان مصرف شود.",
    category: "آنتی بیوتیک"
  },
  {
    no: 28,
    hasRenalAdjustment: false,
    nameEn: "Clotrimazole",
    nameFa: "کلوتریمازول",
    form: "Cream 1% (کرم موضعی) | Topical Sol 1% (محلول موضعی)",
    indication: "ضایعات کاندیدیایی ناحیه پوشک (Diaper Rash کاندیدیایی)، درماتوفیتوز",
    dosage: "یک لایه نازک روی موضع تمیز و خشک",
    interval: "BID - TDS (۲ تا ۳ بار در روز)",
    maxDose: "موضعی",
    notice: "طول مدت درمان استاندارد ۷ تا ۱۰ روز است. رعایت تهویه و خشک نگه داشتن ناحیه پوشک ضروری است.",
    category: "موضعی و پوستی"
  },
  {
    no: 29,
    hasRenalAdjustment: true,
    nameEn: "Cloxacillin",
    nameFa: "کلوگزاسیلین",
    form: "Vial 250, 500mg, 1g (ویال تزریقی) | Susp 125mg/5ml | Cap 250, 500mg",
    indication: "عفونت‌های استافیلوکوکی حساس به متی‌سیلین (MSSA)",
    dosage: "عفونت متوسط: 100-150 mg/kg/day\nعفونت شدید: 200 mg/kg/day",
    interval: "Q6hr (هر ۶ ساعت)",
    maxDose: "متوسط: 4 gr/day | شدید: 6-12 gr/day",
    notice: "تنظیم دوز کلیوی (*). در عفونت‌های شدید استاف طلایی وریدی تجویز شود.",
    category: "آنتی بیوتیک"
  },
  {
    no: 30,
    hasRenalAdjustment: true,
    nameEn: "Co-trimoxazole",
    nameFa: "کوتریموکسازول",
    form: "Susp 240mg/5ml (کودکان) | Tab 480mg (بزرگسال) | Tab 960mg (فورت) | Amp 480mg/5ml",
    indication: "اسهال خونی باکتریال، عفونت ادراری (UTI)، پروفیلاکسی UTI",
    dosage: "درمان اسهال و UTI: 8-12 mg/kg/day بر اساس TMP (فرمول سوسپانسیون: W/2 ml/dose هر ۱۲ ساعت)\nپروفیلاکسی UTI: 2-4 mg/kg/day بر اساس TMP روزانه",
    interval: "BID (درمان) / Daily (پروفیلاکسی)",
    maxDose: "320 mg TMP / day",
    notice: "۱- محاسبه دوز همیشه بر حسب TMP انجام می‌گردد. ۲- در فاویسم (نقص آنزیم G6PD) و نوزادان زیر ۲ ماه به دلیل خطر کرن‌ایکتروس اکیداً ممنوع است.",
    category: "آنتی بیوتیک",
    practicalFormula: "W/2 ml/dose BID (سوسپانسیون بر حسب TMP)",
    formulaType: "w_div_2_ml",
    g6pdWarning: true,
    ageRestriction: "ممنوع در نقص G6PD و نوزادان زیر ۲ ماه"
  },
  {
    no: 31,
    hasRenalAdjustment: false,
    nameEn: "Dexamethasone",
    nameFa: "دگزامتازون",
    form: "Amp 4mg/ml (8mg/2ml) | Elixir 0.5mg/5ml | Tab 0.5mg | Eye Drop 0.1%",
    indication: "کروپ (لارنگوتراکئوبرونشیت)، ادم حنجره، آسم حاد",
    dosage: "0.6 mg/kg/dose (تک‌دوز)",
    interval: "Single Dose (S.D)",
    maxDose: "8 - 16 mg",
    notice: "روش‌های تزریق وریدی، عضلانی یا خوراکی (PO) مقدور است. در کروپ اغلب تک‌دوز کفایت می‌کند.",
    category: "کورتیکواستروئید و تنفسی"
  },
  {
    no: 32,
    hasRenalAdjustment: false,
    nameEn: "Dextromethorphan",
    nameFa: "دکسترومتورفان",
    form: "Syr 15mg/5ml | Drops 4mg/ml",
    indication: "سرفه‌های خشک و آزاردهنده بدون خلط",
    dosage: "فرمول سریع: وزن ÷ ۳ سی‌سی در هر دوز",
    interval: "TDS (هر ۸ ساعت)",
    maxDose: "طبق رده سنی",
    notice: "مصرف در سنین زیر ۲ سال توصیه نمی‌شود. در سرفه‌های خلط‌دار و آسم منع مصرف دارد.",
    category: "تنفسی و آسم",
    practicalFormula: "W/3 ml/dose TDS",
    formulaType: "w_div_3_ml",
    ageRestriction: "زیر ۲ سال توصیه نمی‌شود"
  },
  {
    no: 33,
    hasRenalAdjustment: false,
    nameEn: "Diazepam",
    nameFa: "دیازپام",
    form: "Amp 10mg/2ml (5mg/ml) | Supp 5, 10mg (شیاف رکتال) | Syr 2mg/5ml | Tab 2, 5, 10mg",
    indication: "تشنج حاد (استاتوس)، پروفیلاکسی تشنج ناشی از تب (Febrile Convulsion)",
    dosage: "در حال تشنج: 0.1 - 0.3 mg/kg/dose وریدی آهسته (یا رکتال 0.5 mg/kg)\nپروفیلاکسی تشنج تب‌دار (FC): 0.3 mg/kg/dose خوراکی هر ۸ ساعت در ۲ روز اول تب",
    interval: "در تشنج حاد: Q10min تا ۲ نوبت | در تب: TDS برای ۲ روز اول تب",
    maxDose: "زیر ۵ سال: 5 mg | بالای ۵ سال: 10 mg",
    notice: "در تشنج فعال تزریق عضلانی اثر مناسبی ندارد (فقط IV یا رکتال). آمپول نجات‌بخش با پایش آپنه تنفسی.",
    category: "ضدتشنج"
  },
  {
    no: 34,
    hasRenalAdjustment: false,
    nameEn: "Dicyclomine",
    nameFa: "دی‌سیکلومین",
    form: "Syr 10mg/5ml | Tab 10mg | Amp 20mg/2ml",
    indication: "دل‌پیچه، اسپاسم حاد گوارشی",
    dosage: "2.5 - 5 ml/dose (فرمول سریع: وزن ÷ ۴ سی‌سی در هر دوز)",
    interval: "TDS (هر ۸ ساعت)",
    maxDose: "طبق سن",
    notice: "در انسداد روده و در کودکان زیر ۲ سال اکیداً ممنوع است (خطر آپنه تنفسی، کما و تشنج).",
    category: "گوارش",
    practicalFormula: "W/4 ml/dose TDS",
    formulaType: "w_div_4_ml",
    ageRestriction: "اکیداً ممنوع در زیر ۲ سال"
  },
  {
    no: 35,
    hasRenalAdjustment: false,
    nameEn: "Dimethicone",
    nameFa: "دایمتیکون",
    form: "Drop 40mg/ml (قطره خوراکی) | Chewable Tab 40mg",
    indication: "کولیک شیرخواری، نفخ شکم",
    dosage: "5 - 10 drops / dose",
    interval: "TDS - QID (بعد از شیردهی)",
    maxDose: "طبق تجویز",
    notice: "داروی بی‌خطر موضعی در لوله گوارش جهت کاهش گاز و اتساع شکم شیرخوار.",
    category: "گوارش"
  },
  {
    no: 36,
    hasRenalAdjustment: true,
    nameEn: "Diphenhydramine",
    nameFa: "دیفن‌هیدرامین",
    form: "Syr 12.5mg/5ml (الگزیر) | Syr Diphenhydramine Compound | Amp 50mg/ml",
    indication: "ضداستفراغ، ضدسرفه، آرام‌بخش، کهیر و واکنش آلرژیک",
    dosage: "1 mg/kg/dose (فرمول شربت: وزن ÷ ۳ سی‌سی در هر دوز)",
    interval: "TDS (هر ۸ ساعت)",
    maxDose: "50 mg / dose",
    notice: "در کودکان زیر ۲ سال برای سرماخوردگی توصیه نمی‌شود. در بیماران تشنجی به دلیل کاهش آستانه تشنج ممنوع است. تنظیم دوز کلیوی (*).",
    category: "آلرژی و آنتی‌هیستامین",
    practicalFormula: "W/3 ml/dose TDS",
    formulaType: "w_div_3_ml",
    ageRestriction: "زیر ۲ سال برای سرماخوردگی توصیه نمی‌شود | در تشنج ممنوع"
  },
  {
    no: 37,
    hasRenalAdjustment: false,
    nameEn: "Dobutamine",
    nameFa: "دوبوتامین",
    form: "Vial 250mg/20ml (ویال تزریقی انفوزیون)",
    indication: "کاهش عملکرد انقباضی قلب، افت Ejection Fraction (EF)",
    dosage: "10 - 20 mcg/kg/min",
    interval: "IV Infusion مداوم با پمپ انفوزیون",
    maxDose: "40 mcg/kg/min",
    notice: "داروی اینوتروپ مثبت؛ پایش مداوم ECG و فشار خون و ریتم قلبی در ICU.",
    category: "قلب و اورژانس"
  },
  {
    no: 38,
    hasRenalAdjustment: false,
    nameEn: "Dopamine",
    nameFa: "دوپامین",
    form: "Amp 200mg/5ml (آمپول تزریقی اینوتروپ)",
    indication: "شوک، افت فشار خون، نارسایی قلبی و نارسایی حاد کلیه",
    dosage: "دوز کلیوی: 2-5 mcg/kg/min (افزایش GFR و ادرار)\nدوز قلبی/فشار: 10-20 mcg/kg/min",
    interval: "IV Infusion پیوسته با سرنگ‌پمپ",
    maxDose: "20 - 50 mcg/kg/min",
    notice: "با دوز پایین باعث افزایش GFR و برون‌ده ادراری می‌شود. تزریق حتماً از رگ مطمئن صورت گیرد.",
    category: "قلب و اورژانس"
  },
  {
    no: 39,
    hasRenalAdjustment: false,
    nameEn: "Epinephrine (Adrenaline)",
    nameFa: "اپی‌نفرین (آدرنالین)",
    form: "Amp 1mg/ml (1:1000) | Amp 1:10,000 (0.1mg/ml)",
    indication: "ایست قلبی (آسیستول)، برادیکاردی، آنافیلاکسی، کروپ استریدوردار شدید",
    dosage: "آنافیلاکسی: 0.01 ml/kg از فرم 1:1000 عضلانی (IM) در ران (حداکثر 0.3ml)\nایست قلبی: 0.1 ml/kg از فرم 1:10,000 وریدی (IV) یا داخل تراشه (ET) 0.1 ml/kg از 1:1000\nکروپ شدید: 0.5 ml/kg نبولایز شده با 3ml سرم نرمال سالین",
    interval: "CPR و آنافیلاکسی: هر ۳ تا ۵ دقیقه | کروپ: هر ۲۰ دقیقه تا ۳ نوبت",
    maxDose: "آنافیلاکسی IM: 0.3-0.5 ml | وریدی IV: 1 mg (10 ml فرم 1:10000) | کروپ: زیر ۴ سال 2.5ml، بالای ۴ سال 5ml",
    notice: "دوز داخل لوله تراشه (ET) ده برابر دوز وریدی است (با غلظت 1:1000). در کروپ با ۳ میلی‌لیتر سرم NS رقیق و نبولایز شود.",
    category: "قلب و اورژانس"
  },
  {
    no: 40,
    hasRenalAdjustment: true,
    nameEn: "Erythromycin",
    nameFa: "اریترومایسین",
    form: "Susp 200mg/5ml | Tab 200, 400mg | Ophthalmic Oint 0.5% (پماد چشمی)",
    indication: "سیاه‌سرفه، عفونت کلامیدیایی نوزاد، کونژونکتیویت",
    dosage: "خوراکی: 50 mg/kg/day (فرمول سوسپانسیون ۲۰۰: وزن ÷ ۴ سی‌سی در هر دوز QID)\nپماد چشمی: ۱ بار یا ۲ بار در روز",
    interval: "خوراکی: QID (هر ۶ ساعت) | پماد: QD - BID",
    maxDose: "1 - 2 g/day",
    notice: "جایگزین مناسب در موارد حساسیت شدید به آموکسی‌سیلین/پنی‌سیلین. تنظیم دوز در نقص کلیوی (*). خطر هایپرتروفی پیلور در نوزادان زیر یک ماه.",
    category: "آنتی بیوتیک",
    practicalFormula: "W/4 ml/dose QID (سوسپانسیون 200)",
    formulaType: "w_div_4_ml"
  },
  {
    no: 41,
    hasRenalAdjustment: true,
    nameEn: "Fentanyl",
    nameFa: "فنتانیل",
    form: "Amp 100mcg/2ml (50mcg/ml) | Amp 500mcg/10ml",
    indication: "آرام‌بخش و تسکین درد در بیمار زیر ونتیلاتور و پروسیجرها",
    dosage: "بولوس: 1 - 2 mcg/kg/dose (هر ۳۰ تا ۶۰ دقیقه در صورت نیاز)\nانفوزیون مداوم: 1 - 5 mcg/kg/hr طی ۲۴ ساعت",
    interval: "Q30-60min PRN یا Continuous IV",
    maxDose: "طبق پاسخ و تحمل بیمار",
    notice: "خطر اسپاسم عضلات قفسه سینه (Chest Wall Rigidity) با تزریق سریع وجود دارد. تنظیم کلیوی (*). نالوکسان آماده باشد.",
    category: "ضد درد و آرام‌بخش"
  },
  {
    no: 42,
    hasRenalAdjustment: false,
    nameEn: "Ferrous Sulfate",
    nameFa: "قطره/شربت فروس سولفات (آهن)",
    form: "Drop (25mg آهن المنتال / 1ml) | Syr (41mg المنتال / 5ml) | Tab (50mg المنتال)",
    indication: "پروفیلاکسی کم‌خونی فقر آهن، درمان آنمی فقر آهن",
    dosage: "پروفیلاکسی (از پایان ۶ ماهگی یا ۴ ماهگی تا ۲ سالگی): 1-2 mg/kg/day آهن عنصری\nدوز درمانی فقر آهن: 4-6 mg/kg/day آهن عنصری",
    interval: "QD تا TDS بین وعده‌های غذایی با آبمیوه یا آب",
    maxDose: "پروفیلاکسی: 15 mg/day آهن المنتال",
    notice: "۱ قطره از فرم قطره حاوی تقریباً ۱ میلی‌گرم آهن المنتال است (مثلاً برای کودک ۱۰ کیلویی ۱۰ تا ۱۵ قطره روزانه). با شیر تجویز نشود تا جذب کاهش نیابد.",
    category: "مکمل و تغذیه"
  },
  {
    no: 43,
    hasRenalAdjustment: true,
    nameEn: "Furosemide (Lasix)",
    nameFa: "فوروزماید (لازیکس)",
    form: "Amp 20mg/2ml, 40mg/4ml | Oral Drop 10mg/ml | Tab 40mg",
    indication: "ادم ریوی، نارسایی احتقانی قلب، اولیگوری حاد",
    dosage: "1 - 2 mg/kg/dose",
    interval: "BID - QID (وریدی یا عضلانی)",
    maxDose: "2 mg/kg/dose (حداکثر دوز روزانه ۶ میلی‌گرم بر کیلوگرم)",
    notice: "تنظیم دوز کلیوی الزامی است (*). کنترل پتاسیم و آب و الکترولیت‌ها ضروری است.",
    category: "قلب و کلیه"
  },
  {
    no: 44,
    hasRenalAdjustment: false,
    nameEn: "Gentamicin",
    nameFa: "جنتامایسین",
    form: "Amp 20mg/2ml (کودکان), 40mg/ml, 80mg/2ml | Eye/Ear Drop 0.3% | Topical Oint 0.1%",
    indication: "سپسیس و عفونت‌های گرم منفی نوزادی و اطفال، کونژونکتیویت",
    dosage: "تزریقی عمومی: 3 - 7.5 mg/kg/day (در سیستیک فیبروزیس CF: تا 10 mg/kg/day)\nقطره چشمی: ۱ الی ۲ قطره هر ۲ تا ۴ ساعت",
    interval: "TDS (تزریقی) / Q2-4hr (چشمی)",
    maxDose: "طبق سطح سرمی Peak و Trough",
    notice: "اتوتوکسیک و نفروتوکسیک. نیاز به پایش سطح سرمی دارد.",
    category: "آنتی بیوتیک"
  },
  {
    no: 45,
    hasRenalAdjustment: false,
    nameEn: "G-CSF (Filgrastim)",
    nameFa: "فیلگراستیم (G-CSF)",
    form: "Prefilled Syringe 300mcg (آمپول آماده تزریق زیرجلدی)",
    indication: "نوتروپنی شدید، کموتراپی، اختلالات مغز استخوان",
    dosage: "5 - 10 mcg/kg/dose",
    interval: "Daily (روزانه زیرجلدی SC)",
    maxDose: "طبق شمارش نوتروفیل",
    notice: "تزریق به صورت زیرجلدی (SC) انجام می‌گیرد، معمولاً ۳ روز یا بیشتر تا رسیدن ANC به حد مطلوب.",
    category: "انکولوژی و خون"
  },
  {
    no: 46,
    hasRenalAdjustment: false,
    nameEn: "Glycerin Suppository",
    nameFa: "شیاف گلیسیرین اطفال",
    form: "Pediatric Supp 1 gr",
    indication: "یبوست حاد و احتباس مدفوع",
    dosage: "۱ عدد شیاف اطفال رکتال",
    interval: "Daily (PRN در صورت لزوم)",
    maxDose: "۱ تا ۲ شیاف در روز",
    notice: "در شیرخواران زیر ۶ ماهگی نیز در صورت صلاحدید پزشک و احتباس مدفوع قابل مصرف است.",
    category: "گوارش"
  },
  {
    no: 47,
    hasRenalAdjustment: false,
    nameEn: "Gripe Mixture",
    nameFa: "گریپ میکسچر",
    form: "Syr (شربت گیاهی)",
    indication: "کولیک و دل‌پیچه نوزاد و شیرخوار، نفخ",
    dosage: "2.5 - 5 ml / dose",
    interval: "TDS - QID",
    maxDose: "طبق سن",
    notice: "مصرف در زیر ۱ ماهگی توصیه نمی‌شود.",
    category: "گوارش",
    ageRestriction: "زیر ۱ ماهگی توصیه نمی‌شود"
  },
  {
    no: 48,
    hasRenalAdjustment: false,
    nameEn: "Hydrocortisone",
    nameFa: "هیدروکورتیزون",
    form: "Vial 100mg (ویال تزریقی سوکسینات) | Topical Oint 1% (پماد موضعی جلدی)",
    indication: "آنافیلاکسی، آسم حاد، شوک، نارسایی آدرنال، اگزما و درماتیت آتوپیک",
    dosage: "تزریقی: 1 - 2 mg/kg/day در آنافیلاکسی و بیماری‌های آلرژیک شدید\nکرم: مالیدن لایه نازک روی اگزما TDS",
    interval: "QD - BID (تزریقی) / TDS (کرم)",
    maxDose: "تزریقی: 100 mg در دوز شروع",
    notice: "کورتیکواستروئید خط اول در شوک نارسایی آدرنال و پروسه آنافیلاکسی پس از اپی‌نفرین.",
    category: "کورتیکواستروئید و تنفسی"
  },
  {
    no: 49,
    hasRenalAdjustment: false,
    nameEn: "Hydroxyzine",
    nameFa: "هیدروکسی‌زین",
    form: "Syr 10mg/5ml | Tab 10, 25mg | Amp 50mg/2ml (آمپول تزریقی)",
    indication: "خارش شدید پوست، کهیر حاد، اضطراب",
    dosage: "2 mg/kg/day (فرمول سریع شربت: وزن ÷ ۳ سی‌سی در هر دوز TDS)",
    interval: "TDS (هر ۸ ساعت)",
    maxDose: "زیر ۶ سال: 12.5 mg/dose | ۶ تا ۱۲ سال: 25 mg/dose",
    notice: "خواب‌آلودگی شدید ایجاد می‌کند. در تشنج احتیاط شود.",
    category: "آلرژی و آنتی‌هیستامین",
    practicalFormula: "W/3 ml/dose TDS (شربت ۱۰)",
    formulaType: "w_div_3_ml"
  },
  {
    no: 50,
    hasRenalAdjustment: false,
    nameEn: "Ibuprofen",
    nameFa: "ایبوپروفن (پروفن)",
    form: "Susp 100mg/5ml (شربت پروفن) | Tab 200, 400mg (قرص) | Softgel Cap 400mg (کپسول ژلوفن)",
    indication: "کنترل تب مقاوم و دردهای التهابی اطفال",
    dosage: "5 - 10 mg/kg/dose (فرمول سریع شربت ۱۰۰: وزن کودک ÷ ۳ سی‌سی هر ۶ تا ۸ ساعت)",
    interval: "TDS - QID (هر ۶ الی ۸ ساعت)",
    maxDose: "40 mg/kg/day (حداکثر روزانه ۲۴۰۰ میلی‌گرم)",
    notice: "فرمول سریع شربت: وزن کودک ÷ ۳ میلی‌لیتر در هر نوبت. با معده پر مصرف شود. در بیماران کم‌آب (Dehydration)، خونریزی گوارشی و زیر ۶ ماه توصیه نمی‌شود.",
    category: "ضد درد و تب",
    practicalFormula: "W/3 ml/dose (شربت 100 هر 6-8 ساعت)",
    formulaType: "w_div_3_ml",
    ageRestriction: "زیر ۶ ماه توصیه نمی‌شود"
  },
  {
    no: 51,
    hasRenalAdjustment: true,
    nameEn: "Imipenem",
    nameFa: "ایمی‌پنم (تینام)",
    form: "Vial 500mg (ویال پودر تزریقی ایمی‌پنم + سیلاستاتین)",
    indication: "عفونت‌های شدید باکتریایی مقاوم بیمارستانی",
    dosage: "60 - 100 mg/kg/day (در فیبروز کیستیک CF تا 90 mg/kg/day)",
    interval: "QID (هر ۶ ساعت)",
    maxDose: "1 - 4 gr/day",
    notice: "خطر کاهش آستانه تشنج به ویژه در دوزهای بالا و نارسایی کلیه. تنظیم دوز در نارسایی کلیوی ضروری است (*).",
    category: "آنتی بیوتیک"
  },
  {
    no: 52,
    hasRenalAdjustment: false,
    nameEn: "Influenza Vaccine",
    nameFa: "واکسن آنفولانزا",
    form: "Prefilled Syringe 0.5ml (سرنگ آماده تزریق عضلانی)",
    indication: "پیشگیری از آنفولانزا فصلی در کودکان",
    dosage: "۶ ماه تا ۳ سال: نصف آمپول (0.25 ml)\nبالای ۳ سال: یک آمپول کامل (0.5 ml)",
    interval: "سالانه یک بار (در کودکان زیر ۹ سال که برای بار اول واکسن می‌زنند: تکرار ۴ هفته بعد)",
    maxDose: "0.5 ml",
    notice: "۱- زیر ۶ ماه ممنوع است. ۲- زمان مناسب تزریق فصل پاییز است. ۳- در بار اول تزریق در سن زیر ۹ سال، دوز دوم ۴ هفته بعد تکرار می‌شود.",
    category: "واکسن و ایمنی",
    ageRestriction: "زیر ۶ ماه ممنوع است"
  },
  {
    no: 53,
    hasRenalAdjustment: true,
    nameEn: "Insulin Regular",
    nameFa: "انسولین رگولار (کریستال)",
    form: "Vial 100 IU/ml (10ml) | Pen 100 IU/ml",
    indication: "کتواسیدوز دیابتی (DKA)، هایپرکالمی شدید",
    dosage: "درمان اولیه DKA: 0.05 - 0.1 U/kg/hr به صورت انفوزیون مداوم وریدی",
    interval: "IV Infusion پیوسته با پمپ",
    maxDose: "طبق قند خون و گازهای خونی",
    notice: "کنترل مکرر قند خون ساعتی و پتاسیم خون. افت قند خون نباید بیش از ۵۰ تا ۷۵ میلی‌گرم در دسی‌لیتر در ساعت باشد. تنظیم کلیوی (*).",
    category: "غدد و متابولیک"
  },
  {
    no: 54,
    hasRenalAdjustment: false,
    nameEn: "Ipratropium Bromide (Atrovent)",
    nameFa: "ایپراتروپیوم بروماید (آتروونت)",
    form: "Spray MDI 20mcg/puff | Resp Sol 250mcg/ml (محلول نبولایزر)",
    indication: "حملات حاد آسم متوسط تا شدید، برونکواسپاسم مقاوم",
    dosage: "1 - 2 puff / dose",
    interval: "Q8hr (در حملات حاد آسم می‌توان هر ۲۰ دقیقه تا ۳ نوبت همراه سالبوتامول تکرار کرد)",
    maxDose: "طبق پروتکل حاد",
    notice: "در فاز حاد حمله آسم، مصرف همزمان با سالبوتامول اثر هم‌افزایی عالی دارد.",
    category: "تنفسی و آسم"
  },
  {
    no: 55,
    hasRenalAdjustment: false,
    nameEn: "IVIG (Intravenous Immunoglobulin)",
    nameFa: "ایمونوگلوبولین وریدی (IVIG)",
    form: "Vial",
    indication: "پورپورای ترومبوسیتوپنیک ایمنی (ITP)، سندرم گیلن‌باره، بیماری کاوازاکی",
    dosage: "1 - 2 gr/kg/day\nدر ITP و گیلن‌باره: انفوزیون طی ۶ ساعت\nدر کاوازاکی: دوز 2 gr/kg انفوزیون آهسته طی ۱۲ ساعت",
    interval: "طبق اندیکاسیون بیماری",
    maxDose: "2 gr/kg در کل دوره درمان کاوازاکی",
    notice: "کنترل دقیق علائم حیاتی هر ۳۰ دقیقه در طول زمان انفوزیون به علت خطر شوک آنافیلاکتوئید.",
    category: "ایمونولوژی و خون"
  },
  {
    no: 56,
    hasRenalAdjustment: false,
    nameEn: "Ketotifen",
    nameFa: "کتوتیفن",
    form: "Syr 1mg/5ml | Tab 1 mg",
    indication: "رینیت آلرژیک، کهیر مزمن، پیشگیری از حملات آسم آلرژیک",
    dosage: "۶ ماه تا ۳ سال: 2.5 ml شربت BID\nبالای ۳ سال: 5 ml شربت یا ۱ قرص (1 mg) دو بار در روز (BID)",
    interval: "BID (هر ۱۲ ساعت)",
    maxDose: "2 mg/day",
    notice: "در سن زیر ۶ ماه توصیه نمی‌شود.",
    category: "آلرژی و آنتی‌هیستامین",
    ageRestriction: "زیر ۶ ماه توصیه نمی‌شود"
  },
  {
    no: 57,
    hasRenalAdjustment: false,
    nameEn: "Lactulose",
    nameFa: "لاکتولوز",
    form: "Syr (شربت ۶۶٪)",
    indication: "یبوست مزمن کودکان، انسفالوپاتی کبدی",
    dosage: "1 - 3 ml/kg/day منقسم در ۲ تا ۳ نوبت",
    interval: "BID - TDS",
    maxDose: "60 ml / day",
    notice: "در نوزادان زیر ۱ ماه ممنوع است. اثر ملینی آن ممکن است ۲۴ تا ۴۸ ساعت بعد ظاهر شود.",
    category: "گوارش",
    ageRestriction: "زیر ۱ ماه ممنوع است"
  },
  {
    no: 58,
    hasRenalAdjustment: false,
    nameEn: "Lidocaine",
    nameFa: "لیدوکائین",
    form: "Amp 1%, 2% (5ml) | Spray 10% | Topical Gel 2%",
    indication: "آریتمی بطنی (VT و VF)، بی‌حسی قبل از دادن شوک و لوله‌گذاری",
    dosage: "1 mg/kg/dose وریدی آهسته",
    interval: "هر ۱۰ تا ۱۵ دقیقه تا ۲ نوبت (Q10-15min × 2)",
    maxDose: "3 - 5 mg/kg مجموع دوز بولوس",
    notice: "کنترل مانیتورینگ نوار قلب حین تزریق. در بلوک قلبی شدید منع مصرف دارد.",
    category: "قلب و اورژانس"
  },
  {
    no: 59,
    hasRenalAdjustment: false,
    nameEn: "Mebendazole",
    nameFa: "مبندازول",
    form: "Tab 100mg (قرص جویدنی)",
    indication: "کرمک (اکسیور)، آسکاریس",
    dosage: "کرمک: 100 mg تک دوز (تکرار ۲ هفته بعد)\nآسکاریس: 100 mg دو بار در روز برای ۳ روز متوالی (BID × 3 Days)",
    interval: "طبق نوع انگل",
    maxDose: "200 mg/day",
    notice: "۱- در بارداری ممنوع است. ۲- قرص جویده یا کاملاً پودر شده با غذا مصرف شود. ۳- در اطفال زیر ۲ سال توصیه نمی‌شود.",
    category: "ضدانگل",
    ageRestriction: "زیر ۲ سال توصیه نمی‌شود | در بارداری ممنوع"
  },
  {
    no: 60,
    hasRenalAdjustment: true,
    nameEn: "Meropenem",
    nameFa: "مروپنم",
    form: "Vial 500mg, 1g (ویال تزریقی وریدی کارباپنم)",
    indication: "مننژیت باکتریال، تب و نوتروپنی، عفونت‌های بسیار شدید شکمی و بیمارستانی",
    dosage: "مننژیت: 120 mg/kg/day منقسم در ۳ دوز\nتب و نوتروپنی و سایر عفونت‌ها: 30-60 mg/kg/day",
    interval: "TDS (هر ۸ ساعت)",
    maxDose: "مننژیت: 6 gr/day | سایر عفونت‌ها: 3 gr/day",
    notice: "در مقایسه با ایمی‌پنم سمیت عصبی و خطر تشنج کمتری دارد و داروی انتخابی در مننژیت است. تنظیم دوز کلیوی (*).",
    category: "آنتی بیوتیک"
  },
  {
    no: 61,
    hasRenalAdjustment: false,
    nameEn: "Methylprednisolone",
    nameFa: "متیل پردنیزولون (سولومدرول)",
    form: "Vial 40, 125, 250, 500, 1000mg (ویال تزریقی پودر سدیم سوکسینات)",
    indication: "حملات حاد شدید آسم، آنژیوادم، بیماری‌های روماتولوژیک و پالس‌تراپی",
    dosage: "1 - 2 mg/kg/day",
    interval: "BID - TDS",
    maxDose: "60 mg / day (در پالس دوز تا 30mg/kg)",
    notice: "کورتیکواستروئید قوی با کمترین اثر احتباس نمک و آب نسبت به هیدروکورتیزون.",
    category: "کورتیکواستروئید و تنفسی"
  },
  {
    no: 62,
    hasRenalAdjustment: true,
    nameEn: "Metronidazole",
    nameFa: "مترونیدازول",
    form: "Infusion 500mg/100ml (سرم تزریقی وریدی) | Susp 125mg/5ml | Tab 250, 500mg | Gel 0.75%",
    indication: "ژیاردیازیس، آمیبیازیس (دیسانتری)، عفونت‌های بی‌هوازی شکم و لگن",
    dosage: "ژیاردیا: 15 mg/kg/day منقسم در ۳ نوبت (فرمول شربت: وزن ÷ ۵ سی‌سی TDS برای ۵ روز)\nآمیب: 40 mg/kg/day منقسم در ۳ نوبت (فرمول شربت: وزن ÷ ۲ سی‌سی TDS برای ۱۰ روز)\nعفونت بی‌هوازی: 25-40 mg/kg/day در ۴ نوبت (QID)",
    interval: "TDS (ژیاردیا و آمیب) / QID (عفونت بی‌هوازی)",
    maxDose: "ژیاردیا و آمیب: 1-2 gr/day | بی‌هوازی: 1.5 gr/day",
    notice: "طول دوره درمان ژیاردیا ۵ روز و درمان آمیب ۱۰ روز است. طعم فلزی در دهان ایجاد می‌کند. تنظیم دوز کلیوی (*).",
    category: "آنتی بیوتیک و ضدانگل",
    practicalFormula: "ژیاردیا: W/5 ml/dose TDS (۵ روز) | آمیب: W/2 ml/dose TDS (۱۰ روز)",
    formulaType: "custom"
  },
  {
    no: 63,
    hasRenalAdjustment: true,
    nameEn: "Midazolam",
    nameFa: "میدازولام",
    form: "Amp 5mg/ml (1ml), 5mg/5ml (5ml), 15mg/3ml (آمپول تزریقی)",
    indication: "آرام‌بخش، ضد اضطراب در پروسیجرها، کنترل تشنج مقاوم",
    dosage: "0.05 - 0.1 mg/kg/dose وریدی آهسته (یا باکال/بینی 0.2mg/kg)",
    interval: "PRN × 3 (در صورت نیاز تکرار)",
    maxDose: "6 mg / day",
    notice: "خطر بروز آپنه تنفسی در شیرخواران زیر ۶ ماه بسیار بالاست. پایش مداوم پالس‌اکسیمتری و تنفس. فلومازنیل در دسترس باشد. تنظیم کلیوی (*).",
    category: "آرام‌بخش و اعصاب",
    ageRestriction: "خطر بالای آپنه در سن کمتر از ۶ ماه"
  },
  {
    no: 64,
    hasRenalAdjustment: false,
    nameEn: "Mineral Oil (Paraffin)",
    nameFa: "روغن پارافین خوراکی (مینرال اویل)",
    form: "Oral Sol (شربت و مایع خوراکی)",
    indication: "یبوست مزمن مقاوم، نرم‌کننده مدفوع",
    dosage: "1 - 3 ml/kg/day منقسم در ۱ تا ۳ نوبت",
    interval: "BID - TDS",
    maxDose: "طبق تحمل بیمار",
    notice: "در شیرخواران زیر یک‌سال به علت خطر جدی آسپیراسیون و ایجاد پنومونی لیپوئیدی کشنده اکیداً توصیه نمی‌شود.",
    category: "گوارش",
    ageRestriction: "اکیداً در زیر ۱ سال توصیه نمی‌شود (خطر پنومونی لیپوئیدی)"
  },
  {
    no: 65,
    hasRenalAdjustment: false,
    nameEn: "Multi Vitamin Drop",
    nameFa: "قطره مولتی‌ویتامین اطفال",
    form: "Drop 15ml (قطره خوراکی اطفال با ویتامین‌های A, D, B, C)",
    indication: "مکمل تغذیه‌ای رشد، پیشگیری از کمبود ویتامین‌ها",
    dosage: "20 - 25 drops (1 ml) در روز",
    interval: "Daily (یک‌بار در روز)",
    maxDose: "1 ml / day",
    notice: "شروع مصرف طبق پروتکل کشوری از روز ۱۵ تولد تا پایان ۲ سالگی الزامی است.",
    category: "مکمل و تغذیه"
  },
  {
    no: 66,
    hasRenalAdjustment: false,
    nameEn: "Mupirocin",
    nameFa: "موپیروسین",
    form: "Oint 2% (پماد موضعی)",
    indication: "زردزخم (ایمپتیگو)، عفونت‌های پوستی استافیلوکوکی",
    dosage: "یک لایه نازک روی ضایعه پوستی",
    interval: "TDS (۳ بار در روز)",
    maxDose: "موضعی",
    notice: "در شیرخواران زیر ۳ ماه توصیه نمی‌شود. از ورود پماد به چشم‌ها خودداری شود.",
    category: "موضعی و پوستی",
    ageRestriction: "زیر ۳ ماه توصیه نمی‌شود"
  },
  {
    no: 67,
    hasRenalAdjustment: false,
    nameEn: "Na-Bicarbonate",
    nameFa: "بی‌کربنات سدیم (جوش شیرین تزریقی)",
    form: "Vial 8.4% (1 ml = 1 mEq)",
    indication: "مراحل آخر CPR طولانی، مسمومیت با ضدافسردگی‌های سه‌حلقه‌ای (TCA)، هایپرکالمی شدید، اسیدوز متابولیک، آلکالینیزاسیون در G6PD",
    dosage: "1 - 2 ml/kg/dose (معادل 1-2 mEq/kg) وریدی آهسته",
    interval: "SD (PRN)",
    maxDose: "10 ml / dose در دوز اولیه",
    notice: "در بیمار با مسمومیت TCA یا بحران فاویسم (G6PD deficiency) به میزان 30-50 mEq به هر لیتر سرم افزوده می‌شود. هر ۱ میلی‌لیتر حاوی ۱ میلی‌اکی‌والان بی‌کربنات است.",
    category: "قلب و اورژانس"
  },
  {
    no: 68,
    hasRenalAdjustment: false,
    nameEn: "NaCl 3% (Hypertonic Saline)",
    nameFa: "سرم نمکی ۳٪ (هایپرتونیک)",
    form: "Vial تزریقی",
    indication: "تشنج ناشی از هایپوناترمی حاد، سدیم سرم کمتر از ۱۲۰ و علامت‌دار",
    dosage: "4 - 6 ml/kg/dose وریدی طی ۲۰ تا ۳۰ دقیقه",
    interval: "Single Dose (S.D)",
    maxDose: "افزایش سدیم نباید بیش از 10-12 mEq/L در ۲۴ ساعت اول باشد",
    notice: "اندیکاسیون: ۱- تشنج حین درمان هایپرناترمی. ۲- سدیم کمتر از 120 mEq همراه علائم عصبی.",
    category: "قلب و اورژانس"
  },
  {
    no: 69,
    hasRenalAdjustment: false,
    nameEn: "NaCl 0.65% Drop",
    nameFa: "قطره کلرید سدیم ۰.۶۵٪ (سدیم کلراید بینی)",
    form: "Nasal Drop (قطره بینی)",
    indication: "گرفتگی بینی در سرماخوردگی و ترشحات مجاری تنفسی نوزادان",
    dosage: "2 - 4 drops در هر سوراخ بینی",
    interval: "Q2-4hr (به ویژه ۱۵ دقیقه قبل از شیردهی و خواب)",
    maxDose: "بدون محدودیت سمی",
    notice: "تنها درمان مجاز و کاملاً بی‌خطر برای سرماخوردگی و احتقان بینی در نوزادان و شیرخواران زیر ۶ ماه.",
    category: "تنفسی و آسم"
  },
  {
    no: 70,
    hasRenalAdjustment: false,
    nameEn: "Naloxone",
    nameFa: "نالوکسان",
    form: "Amp 0.4mg/ml (آمپول تزریقی آنتی‌دوت)",
    indication: "مسمومیت با اوپیوئیدها (تریاک، متادون، مورفین...)، دپرسیون تنفسی",
    dosage: "0.1 mg/kg/dose",
    interval: "PRN هر ۲ تا ۳ دقیقه",
    maxDose: "2 mg × 5 (تا حداکثر ۱۰ میلی‌گرم)",
    notice: "روش‌های تزریق: عضلانی (IM)، وریدی (IV)، زیرجلدی (SC) یا داخل لوله تراشه (ET). توجه به نیمه‌عمر کوتاه نسبت به متادون.",
    category: "قلب و اورژانس"
  },
  {
    no: 71,
    hasRenalAdjustment: false,
    nameEn: "Nystatin",
    nameFa: "نیستاتین",
    form: "Drop 100,000 U/ml (قطره نیستاتین دهانی) | Tab 100,000 U",
    indication: "برفک دهان (Oral Candidiasis)",
    dosage: "زیر ۲ سال: 1 ml در هر نوبت\n۲ تا ۵ سال: 2 - 4 ml در هر نوبت",
    interval: "QID (هر ۶ ساعت) به مدت ۷ تا ۱۰ روز",
    maxDose: "5 ml / dose",
    notice: "۱- قطره مستقیماً روی لثه‌ها و زبان و مخاط دهان چکانده و پخش شود. ۲- تعداد ۲ تا ۳ شیشه در نسخه نوشته شود به علت حجم کم قطره.",
    category: "ضدقارچ"
  },
  {
    no: 72,
    hasRenalAdjustment: false,
    nameEn: "Octreotide",
    nameFa: "اوکترئوتاید",
    form: "Amp 0.05mg/ml, 0.1mg/ml (آمپول تزریقی)",
    indication: "خونریزی حاد دستگاه گوارش (GI Bleeding)، اسهال ترشحی مقاوم",
    dosage: "خونریزی گوارشی: بولوس 1-2 mcg/kg سپس انفوزیون مداوم 1 mcg/kg/hr\nاسهال ترشحی پایدار: 1-10 mcg/kg/day منقسم در ۲ دوز (BID)",
    interval: "IV Infusion پیوسته / یا زیرجلدی BID",
    maxDose: "1500 mcg / day",
    notice: "در کنترل واریس مری و خونریزی‌های حجیم گوارشی در بخش مراقبت‌های ویژه تجویز می‌شود.",
    category: "گوارش"
  },
  {
    no: 73,
    hasRenalAdjustment: false,
    nameEn: "Omeprazole",
    nameFa: "امپرازول",
    form: "Cap 20, 40mg (کپسول انتریک کوت) | Vial 40mg (ویال تزریقی) | Sachet 20mg",
    indication: "ریفلاکس معده به مری (GERD)، ازوفاژیت پپتیک، گاستریت",
    dosage: "1 mg/kg/day",
    interval: "Daily (صبح‌ها ناشتا نیم ساعت قبل صبحانه)",
    maxDose: "20 mg / day (در شرایط خاص تا 40mg)",
    notice: "گرانول‌های کپسول را می‌توان باز کرده و بدون خرد کردن دانه‌ها، با مقداری پوره سیب، ماست یا آب سیب خنک به کودک خوراند.",
    category: "گوارش"
  },
  {
    no: 74,
    hasRenalAdjustment: false,
    nameEn: "Ondansetron",
    nameFa: "اندانسترون (دمیترون)",
    form: "Syr 4mg/5ml (شربت دمیترون) | Amp 4mg/2ml, 8mg/4ml (تزریقی) | Tab 4mg",
    indication: "تهوع و استفراغ ناشی از شیمی‌درمانی یا گاستروآنتریت حاد",
    dosage: "0.15 mg/kg/dose",
    interval: "شیمی‌درمانی: هر ۸ ساعت PRN | در گاستروآنتریت: تک‌دوز (SD)",
    maxDose: "8 mg / dose",
    notice: "۱- زیر ۳ ماهگی ممنوع است. ۲- همواره به دنبال علت اصلی استفراغ (مانند انسداد گوارشی یا مننژیت) باشید. ۳- در گاستروآنتریت تنها یک دوز توصیه می‌شود تا اسهال تشدید نشود.",
    category: "گوارش",
    ageRestriction: "زیر ۳ ماهگی ممنوع است"
  },
  {
    no: 75,
    hasRenalAdjustment: false,
    nameEn: "Pantoprazole",
    nameFa: "پنتوپرازول (پانتوپرازول)",
    form: "Vial 40mg (ویال پودر تزریقی وریدی) | Tab 20, 40mg (قرص انتریک کوت پنتومید/نولپازا) | Granule 40mg (ساشه گرانول)",
    indication: "ازوفاژیت اروزیو، ریفلاکس شدید (GERD)، خونریزی گوارشی پپتیک و گاستریت",
    dosage: "1 - 2 mg/kg/day منقسم در ۱ تا ۲ نوبت",
    interval: "Q12 - 24hr (یک تا دو بار در روز)",
    maxDose: "40 mg / day (در شرایط شدید تا 80mg)",
    notice: "",
    category: "گوارش"
  },
  {
    no: 76,
    hasRenalAdjustment: false,
    nameEn: "Penicillin G (6:3:3 / 1.2M)",
    nameFa: "پنی‌سیلین جی (ویال ۶:۳:۳ و ۱،۲۰۰،۰۰۰)",
    form: "Vial 6:3:3 | Vial 1,200,000 U | Vial 800,000 U | Vial 5,000,000 U (سدیم/پتاسیم تزریقی)",
    indication: "فارنژیت استرپتوکوکی حاد",
    dosage: "وزن زیر ۲۷ کیلوگرم: ۱ ویال پنی‌سیلین 6:3:3 عضلانی عمیق\nوزن بالای ۲۷ کیلوگرم: ۱ ویال پنی‌سیلین 1,200,000 U عضلانی عمیق",
    interval: "Single Dose (S.D) تک‌دوز عضلانی",
    maxDose: "1,200,000 Units",
    notice: "در سنین زیر ۳ سال توصیه نمی‌شود چون علت گلودرد و اگزودای حلق در زیر ۳ سال عمدتاً ویروسی است نه استرپتوکوک بتاهمولیتیک A.",
    category: "آنتی بیوتیک",
    ageRestriction: "زیر ۳ سال توصیه نمی‌شود (عفونت باکتریال نادر است)"
  },
  {
    no: 77,
    hasRenalAdjustment: true,
    nameEn: "Penicillin V (Phenoxymethylpenicillin)",
    nameFa: "پنی‌سیلین وی (خوراکی)",
    form: "Susp 125, 250mg/5ml | Tab 250, 500mg",
    indication: "فارنژیت استرپتوکوکی، تب روماتیسمی",
    dosage: "وزن زیر ۲۷ کیلوگرم: 250 mg (5 ml شربت) هر ۸ یا ۱۲ ساعت\nوزن بالای ۲۷ کیلوگرم: 500 mg (10 ml شربت یا ۱ قرص) هر ۸ یا ۱۲ ساعت",
    interval: "BID - TDS",
    maxDose: "1 - 2 g / day",
    notice: "طول درمان برای ریشه‌کنی استرپتوکوک و جلوگیری از تب روماتیسمی حتماً ۱۰ روز کامل است. تنظیم کلیوی (*).",
    category: "آنتی بیوتیک"
  },
  {
    no: 78,
    hasRenalAdjustment: false,
    nameEn: "Pediatric Gripe (سرماخوردگی کودکان)",
    nameFa: "شربت سرماخوردگی کودکان (پدیاتریک گریپ)",
    form: "Syr (شربت ترکیبی کودکان)",
    indication: "علائم سرماخوردگی در کودکان ۲ تا ۵ سال",
    dosage: "۲ تا ۵ سال: 3 - 5 ml در هر دوز (فرمول: وزن ÷ ۳ سی‌سی در هر دوز)",
    interval: "TDS (هر ۸ ساعت)",
    maxDose: "20 ml / day",
    notice: "در کودکان زیر ۲ سال ممنوع است. اثر درمانی واضحی در روند بهبودی ندارد و صرفاً تسکین علامتی موقت است.",
    category: "سرماخوردگی و تنفسی",
    practicalFormula: "W/3 ml/dose (سن ۲ تا ۵ سال)",
    formulaType: "w_div_3_ml",
    ageRestriction: "ممنوع در کودکان زیر ۲ سال"
  },
  {
    no: 79,
    hasRenalAdjustment: false,
    nameEn: "Permethrin",
    nameFa: "پرمترین",
    form: "Cream 5% (کرم گال) | Lotion 1% (لوسیون شپش) | Shampoo 1%",
    indication: "درمان گال (Scabies)، درمان شپش سر و عانه (Pediculosis)",
    dosage: "گال (کرم ۵٪): مالیدن از گردن به پایین، ماندن روی پوست به مدت ۸ تا ۱۲ ساعت و سپس شستشو؛ تکرار ۱ هفته بعد\nشپش (فرم ۱٪): ماندن ۱۰ دقیقه روی موها و سپس آبکشی",
    interval: "یک نوبت و تکرار یک هفته بعد",
    maxDose: "موضعی (حداقل ۵ تا ۷ عدد تیوپ برای خانواده نسخه شود)",
    notice: "۱- در درمان گال کرم حتماً از گردن به تمام نقاط پایین بدن تا انگشتان پا مالیده شود. ۲- درمان همزمان تمامی افراد خانواده الزامی است.",
    category: "موضعی و پوستی"
  },
  {
    no: 80,
    hasRenalAdjustment: true,
    nameEn: "Phenobarbital",
    nameFa: "فنوباربیتال",
    form: "Amp 100mg/ml, 200mg/ml | Elixir 15mg/5ml, 20mg/5ml | Tab 15, 30, 60, 100mg",
    indication: "تشنج نوزادی، صرع پایدار، درمان نگهدارنده صرع",
    dosage: "لودینگ اولیه: 10 - 20 mg/kg/dose وریدی آهسته (تا ۲ بار قابل تکرار)\nدوز نگهدارنده: 5 mg/kg/day منقسم در ۲ دوز",
    interval: "لودینگ: IV × 2 | نگهدارنده: BID (هر ۱۲ ساعت)",
    maxDose: "لودینگ: 300 mg | دوز نگهدارنده: 60 mg/dose",
    notice: "داروی خط اول تشنج نوزادان. تزریق وریدی بسیار آهسته باشد تا ایست تنفسی رخ ندهد. تنظیم دوز در نقص کلیه (*).",
    category: "ضدتشنج"
  },
  {
    no: 81,
    hasRenalAdjustment: false,
    nameEn: "Phenytoin",
    nameFa: "فنی‌توئین",
    form: "Amp 250mg/5ml (50mg/ml) | Susp 30mg/5ml | Cap 100mg",
    indication: "تشنج پایدار، تشنج صرعی، درمان نگهدارنده",
    dosage: "لودینگ تشنج: 10 - 20 mg/kg/dose وریدی آهسته طی حداقل ۲۰ دقیقه\nنگهدارنده: 5 mg/kg/day منقسم در دو دوز (فرمول سریع شربت: وزن ÷ ۳ سی‌سی BID)",
    interval: "لودینگ: IV × 2 | نگهدارنده: BID",
    maxDose: "1500 mg / day",
    notice: "۱- تزریق عضلانی (IM) به علت رسوب و نکروز بافتی اکیداً ممنوع است. ۲- در بلوک قلبی و برادیکاردی ممنوع است. همراه سرم قندی کریستالیزه می‌شود (فقط با نرمال سالین).",
    category: "ضدتشنج",
    practicalFormula: "شربت نگهدارنده: W/3 ml/dose BID",
    formulaType: "w_div_3_ml"
  },
  {
    no: 82,
    hasRenalAdjustment: false,
    nameEn: "Polyethylene Glycol (PEG 70g)",
    nameFa: "پلی‌اتیلن گلیکول (پیدرولاکس / پیدروپگ)",
    form: "Sachet 70g (پودر پیدرولاکس حل شونده در مایعات)",
    indication: "یبوست مزمن کودکان، نرم‌کننده دفع",
    dosage: "1 gr/kg/day حل شده در آبمیوه یا آب",
    interval: "BID (در ۲ وعده روزانه)",
    maxDose: "17 gr / day",
    notice: "در شیرخواران زیر ۶ ماه نیز با نظر فوق‌تخصص گوارش اطفال قابل مصرف است. بی‌خطر و فاقد اثر تحریکی روده.",
    category: "گوارش"
  },
  {
    no: 83,
    hasRenalAdjustment: false,
    nameEn: "Prednisolone",
    nameFa: "پردنیزولون",
    form: "Syr 5mg/5ml, 15mg/5ml (شربت و سوسپانسیون) | Tab 5, 50mg",
    indication: "حملات آسم، کروپ، سندرم نفروتیک",
    dosage: "آسم: 1 - 2 mg/kg/day برای ۳ تا ۵ روز\nدرمان کروپ: تک‌دوز 1 mg/kg",
    interval: "BID - TDS (آسم) / تک‌دوز (کروپ)",
    maxDose: "60 mg / day",
    notice: "همراه غذا یا شیر مصرف شود تا از تحریک گوارشی جلوگیری شود. در مصرف کوتاه‌مدت ۳ تا ۵ روزه نیازی به تیپر تدریجی نیست.",
    category: "کورتیکواستروئید و تنفسی"
  },
  {
    no: 84,
    hasRenalAdjustment: false,
    nameEn: "Pyrvinium Pamoate",
    nameFa: "پیروینیم پاموات",
    form: "Susp 50mg/5ml (سوسپانسیون خوراکی قرمز)",
    indication: "عفونت اکسیور (کرمک) در شیرخواران و کودکان",
    dosage: "5 mg/kg/day تک‌دوز",
    interval: "Single Dose (تکرار ۲ هفته بعد)",
    maxDose: "طبق وزن",
    notice: "مدفوع و احیاناً استفراغ کودک به رنگ قرمز درمی‌آید که بی‌خطر است ولی باید به والدین تذکر داده شود. تکرار دوز ۲ هفته بعد الزامی است.",
    category: "ضدانگل"
  },
  {
    no: 85,
    hasRenalAdjustment: true,
    nameEn: "Ranitidine",
    nameFa: "رانیتیدین",
    form: "Amp 50mg/2ml (25mg/ml) | Syr 75mg/5ml | Tab 150, 300mg",
    indication: "اولسر پپتیک، ریفلاکس اسید (GERD)",
    dosage: "تزریقی: 4-6 mg/kg/day منقسم در ۲ تا ۳ نوبت\nشربت در اولسر: 4-8 mg/kg/day دو بار در روز\nشربت در ریفلاکس شدید (GERD): 10 mg/kg/day",
    interval: "BID - TDS (تزریقی) / BID (خوراکی)",
    maxDose: "تزریقی: 200 mg/day | شربت: 300 mg/day",
    notice: "درمان ریفلاکس با دوز بالاتر انجام می‌شود. تنظیم دوز در نقص کلیه الزامی است (*).",
    category: "گوارش"
  },
  {
    no: 86,
    hasRenalAdjustment: false,
    nameEn: "Salbutamol (Albuterol)",
    nameFa: "سالبوتامول (اسپری ونتولین)",
    form: "Spray MDI 100mcg/puff | Resp Sol 5mg/ml (0.5% نبولایزر) | Syr 2mg/5ml | Tab 2, 4mg",
    indication: "آسم حاد، برونشیولیت، برونکواسپاسم",
    dosage: "3 - 4 puff با دم‌یار (Spacer)",
    interval: "Q4-6hr (در حمله حاد آسم هر ۲۰ دقیقه تا ۳ نوبت و سپس هر ۱ تا ۳ ساعت)",
    maxDose: "طبق پاسخ بالینی",
    notice: "استفاده همیشگی از آسان‌نفس (دم‌یار یا دمیار با ماسک در اطفال کوچک‌تر) بازده استنشاق دارو را تا چند برابر بالا می‌برد.",
    category: "تنفسی و آسم"
  },
  {
    no: 87,
    hasRenalAdjustment: false,
    nameEn: "Silver Sulfadiazine",
    nameFa: "سیلور سولفادیازین (فلامازین)",
    form: "Cream 1%",
    indication: "سوختگی‌های حرارتی درجه ۲ و ۳، پیشگیری از عفونت سوختگی",
    dosage: "مالیدن لایه به ضخامت ۱ تا ۲ میلی‌متر روی سطح سوخته با دستکش استریل",
    interval: "BID (هر ۱۲ ساعت پس از شستشوی ملایم)",
    maxDose: "موضعی",
    notice: "در مبتلایان به فاویسم (نقص G6PD) و نوزادان زیر ۲ ماه به دلیل خطر کرن‌ایکتروس و همولیز اکیداً ممنوع است.",
    category: "موضعی و پوستی",
    g6pdWarning: true,
    ageRestriction: "اکیداً ممنوع در G6PD و نوزادان زیر ۲ ماه"
  },
  {
    no: 88,
    hasRenalAdjustment: false,
    nameEn: "Sulfacetamide",
    nameFa: "سولفاستامید چشمی",
    form: "Eye Drop 10%, 20% (قطره چشمی سولفاستامید)",
    indication: "کونژونکتیویت باکتریال",
    dosage: "1 - 2 drops در چشم مبتلا",
    interval: "Q3-4hr به مدت ۷ تا ۱۰ روز",
    maxDose: "موضعی",
    notice: "در سنین زیر ۲ ماه توصیه نمی‌شود. در آلرژی به سولفونامیدها احتیاط شود.",
    category: "موضعی و پوستی",
    ageRestriction: "زیر ۲ ماه توصیه نمی‌شود"
  },
  {
    no: 89,
    hasRenalAdjustment: false,
    nameEn: "Tetracycline Ointment",
    nameFa: "پماد تتراسایکلین",
    form: "Topical Oint 3% (پماد جلدی تتراسایکلین) | Eye Oint 1% (پماد چشمی)",
    indication: "عفونت‌های پوستی سطحی، زردزخم",
    dosage: "یک لایه نازک روی موضع زخم",
    interval: "TDS - QID (۳ تا ۴ بار در روز)",
    maxDose: "موضعی",
    notice: "فرم‌های خوراکی و سیستمیک تتراسایکلین زیر ۸ سال ممنوع است؛ فرم پماد موضعی با رعایت احتیاط قابل استفاده است.",
    category: "موضعی و پوستی"
  },
  {
    no: 90,
    hasRenalAdjustment: true,
    nameEn: "Vancomycin",
    nameFa: "ونکومایسین",
    form: "Vial 500mg, 1g (ویال پودر تزریقی انفوزیون آهسته وریدی)",
    indication: "عفونت‌های شدید با استاف طلایی مقاوم به متی‌سیلین (MRSA)، مننژیت",
    dosage: "عفونت غیرمننژیتی: 10 mg/kg/dose هر ۶ ساعت\nمننژیت باکتریال: 15 mg/kg/dose هر ۶ ساعت",
    interval: "QID (هر ۶ ساعت)",
    maxDose: "2 - 4 gr / day",
    notice: "انفوزیون وریدی حتماً باید بسیار آهسته (طول حداقل ۶۰ دقیقه) باشد تا از سندرم مرد سرخ (Red Man Syndrome) جلوگیری شود. تنظیم دقیق در اختلال کلیوی ضروری است (*).",
    category: "آنتی بیوتیک"
  },
  {
    no: 91,
    hasRenalAdjustment: false,
    nameEn: "Ventolin (Albuterol Solution)",
    nameFa: "ونتولین نبولایز (محلول سالبوتامول)",
    form: "Resp Sol 5mg/ml (0.5% - محلول ونتولین جهت نبولایز)",
    indication: "حمله حاد شدید آسم، برونشیولیت دیسترس‌دار",
    dosage: "0.15 - 0.3 mg/kg/dose (حداقل دوز در هر بار: 2.5 mg = 0.5 ml)",
    interval: "در حمله حاد هر ۲۰ دقیقه تا ۳ بار، سپس هر ۱ تا ۳ ساعت",
    maxDose: "5 mg / dose (معادل 1 ml محلول)",
    notice: "با ۳ میلی‌لیتر نرمال سالین ترکیب و با اکسیژن نبولایز شود. حداقل دوز در هر نوبت ۲.۵ میلی‌گرم است.",
    category: "تنفسی و آسم"
  },
  {
    no: 92,
    hasRenalAdjustment: false,
    nameEn: "Zinc Oxide",
    nameFa: "زینک اکساید",
    form: "Topical Oint 20% (پماد زینک اکساید جلدی)",
    indication: "ادرارسوختگی نوزادان و کودکان، سوختگی ناشی از اسهال، التهاب پوستی",
    dosage: "یک لایه محافظتی روی پوست تمیز",
    interval: "TDS یا با هر بار تعویض پوشک",
    maxDose: "موضعی",
    notice: "در نوزادان زیر ۲ ماه توصیه نمی‌شود.",
    category: "موضعی و پوستی",
    ageRestriction: "زیر ۲ ماه استفاده نشود"
  },
  {
    no: 93,
    hasRenalAdjustment: false,
    nameEn: "Zinc Sulfate",
    nameFa: "زینک سولفات (روی)",
    form: "Syr 10mg/5ml (شربت روی) | Oral Drop 10mg/ml | Sachet 5mg",
    indication: "درمان کمکی گاستروآنتریت حاد (GE) و اسهال جهت ترمیم مخاط روده",
    dosage: "زیر ۶ ماهگی: 10 mg/day (معادل 5 ml شربت روزانه منقسم)\nبالای ۶ ماهگی: 20 mg/day (معادل 10 ml شربت روزانه منقسم)",
    interval: "BID (به مدت ۱۰ الی ۱۴ روز همراه با ORS)",
    maxDose: "20 mg / day",
    notice: "",
    category: "مکمل و گوارش"
  },
  {
    no: 94,
    hasRenalAdjustment: true,
    nameEn: "Levetiracetam",
    nameFa: "لوتیراستام (کپرا)",
    form: "Oral Sol 100mg/ml (محلول خوراکی) | Vial 500mg/5ml (انفوزیون) | Tab 250, 500, 750, 1000mg",
    indication: "کنترل تشنج‌های فوکال و ژنرالیزه در اطفال",
    dosage: "شروع با 20 mg/kg/day در ۲ دوز منقسم؛ افزایش تدریجی بر اساس پاسخ تا 40-60 mg/kg/day",
    interval: "BID (هر ۱۲ ساعت)",
    maxDose: "3000 mg / day",
    notice: "",
    category: "ضدتشنج"
  }
];

export interface DoseCalculationResult {
  hasCalculation: boolean;
  weight: number;
  ageYears?: number;
  calculatedTextFa?: string;
  quickFormulaFa?: string;
  warningNoticeFa?: string;
}

export function calculateDrugDose(drug: PediatricDrug, weightKg: number, ageYears?: number): DoseCalculationResult {
  if (!weightKg || weightKg <= 0) {
    return { hasCalculation: false, weight: 0 };
  }

  let warning: string | undefined = undefined;
  if (ageYears !== undefined) {
    if (drug.no === 34 && ageYears < 2) {
      warning = "هشدار جدی: دی‌سیکلومین در زیر ۲ سال اکیداً ممنوع است!";
    } else if (drug.no === 36 && ageYears < 2) {
      warning = "هشدار: مصرف دیفن‌هیدرامین برای سرماخوردگی در زیر ۲ سال توصیه نمی‌شود.";
    } else if (drug.no === 78 && ageYears < 2) {
      warning = "هشدار: شربت سرماخوردگی در کودکان زیر ۲ سال ممنوع است.";
    } else if (drug.no === 14 && ageYears < 2) {
      warning = "هشدار: بیزاکودیل در زیر ۲ سال توصیه نمی‌شود.";
    } else if (drug.no === 64 && ageYears < 1) {
      warning = "هشدار: روغن پارافین در زیر ۱ سال به علت خطر پنومونی آسپیراسیون ممنوع است.";
    } else if (drug.no === 76 && ageYears < 3) {
      warning = "هشدار: فارنژیت استرپتوکوکی زیر ۳ سال ناشایع است و پنی‌سیلین توصیه نمی‌شود.";
    } else if (drug.no === 50 && ageYears < 0.5) {
      warning = "هشدار: مصرف ایبوپروفن در زیر ۶ ماهگی توصیه نمی‌شود.";
    } else if (drug.no === 24 && ageYears < 0.5) {
      warning = "هشدار: مصرف ستیریزین در زیر ۶ ماهگی توصیه نمی‌شود.";
    }
  }

  // Calculate based on specific drug formula
  if (drug.no === 1) {
    // Acetaminophen
    const syrupMl = (weightKg / 2).toFixed(1).replace(/\.0$/, '');
    const dropCount = Math.round(weightKg * 2);
    const doseMgMin = Math.round(weightKg * 10);
    const doseMgMax = Math.round(weightKg * 15);
    const suppMin = Math.round(weightKg * 20);
    const suppMax = Math.round(weightKg * 30);
    return {
      hasCalculation: true,
      weight: weightKg,
      ageYears,
      calculatedTextFa: `• شربت ۱۲۰: ${syrupMl} سی‌سی هر ۴ تا ۶ ساعت (فرمول وزن ÷ ۲)\n• قطره ۱۰۰: ${dropCount} قطره هر ۴ تا ۶ ساعت (فرمول وزن × ۲)\n• دوز میلی‌گرمی تب: ${doseMgMin} تا ${doseMgMgFormat(doseMgMax)} میلی‌گرم در هر نوبت\n• دوز شیاف ضد درد: ${suppMin} تا ${suppMax} میلی‌گرم در هر نوبت`,
      quickFormulaFa: `شربت: ${syrupMl} ml | قطره: ${dropCount} قطره`,
      warningNoticeFa: warning
    };
  }

  if (drug.no === 8) {
    // Amoxicillin 250
    const syrupMl = (weightKg / 2).toFixed(1).replace(/\.0$/, '');
    const dailyMg = Math.round(weightKg * 85);
    return {
      hasCalculation: true,
      weight: weightKg,
      ageYears,
      calculatedTextFa: `• سوسپانسیون ۲۵۰: ${syrupMl} سی‌سی هر ۱۲ ساعت (فرمول وزن ÷ ۲)\n• دوز کل روزانه: حدود ${dailyMg} میلی‌گرم در روز (منقسم در ۲ دوز)`,
      quickFormulaFa: `سوسپانسیون ۲۵۰: ${syrupMl} ml هر ۱۲ ساعت`,
      warningNoticeFa: warning
    };
  }

  if (drug.no === 9) {
    // Farmentin 643 / 457
    const ml643 = (weightKg / 3).toFixed(1).replace(/\.0$/, '');
    const ml457 = (weightKg / 2).toFixed(1).replace(/\.0$/, '');
    return {
      hasCalculation: true,
      weight: weightKg,
      ageYears,
      calculatedTextFa: `• سوسپانسیون ۶۴۳ (مناسب‌ترین): ${ml643} سی‌سی هر ۱۲ ساعت (فرمول وزن ÷ ۳)\n• سوسپانسیون ۴۵۷: ${ml457} سی‌سی هر ۱۲ ساعت (فرمول وزن ÷ ۲)`,
      quickFormulaFa: `فارمنتین ۶۴۳: ${ml643} ml هر ۱۲ ساعت`,
      warningNoticeFa: warning
    };
  }

  if (drug.no === 50) {
    // Ibuprofen
    const syrupMl = (weightKg / 3).toFixed(1).replace(/\.0$/, '');
    const doseMgMin = Math.round(weightKg * 5);
    const doseMgMax = Math.round(weightKg * 10);
    return {
      hasCalculation: true,
      weight: weightKg,
      ageYears,
      calculatedTextFa: `• شربت ۱۰۰: ${syrupMl} سی‌سی هر ۶ تا ۸ ساعت (فرمول وزن ÷ ۳)\n• دوز در هر نوبت: ${doseMgMin} تا ${doseMgMax} میلی‌گرم\n• حداکثر روزانه: ${Math.min(Math.round(weightKg * 40), 2400)} میلی‌گرم`,
      quickFormulaFa: `شربت پروفن: ${syrupMl} ml هر ۶ تا ۸ ساعت`,
      warningNoticeFa: warning
    };
  }

  if (drug.no === 18) {
    // Cefixime 100
    const syrupMl = (weightKg / 5).toFixed(1).replace(/\.0$/, '');
    const doseMg = Math.round(weightKg * 8);
    return {
      hasCalculation: true,
      weight: weightKg,
      ageYears,
      calculatedTextFa: `• سوسپانسیون ۱۰۰: ${syrupMl} سی‌سی هر ۱۲ ساعت (فرمول وزن ÷ ۵)\n• دوز کل روزانه: ${doseMg} میلی‌گرم در روز`,
      quickFormulaFa: `سوسپانسیون ۱۰۰: ${syrupMl} ml هر ۱۲ ساعت`,
      warningNoticeFa: warning
    };
  }

  if (drug.no === 23) {
    // Cephalexin 250
    const syrupMl = (weightKg / 4).toFixed(1).replace(/\.0$/, '');
    const totalDailyMg = Math.round(weightKg * 40);
    return {
      hasCalculation: true,
      weight: weightKg,
      ageYears,
      calculatedTextFa: `• سوسپانسیون ۲۵۰: ${syrupMl} سی‌سی هر ۶ ساعت (فرمول وزن ÷ ۴)\n• کل دوز روزانه: حدود ${totalDailyMg} میلی‌گرم منقسم در ۴ بار`,
      quickFormulaFa: `سوسپانسیون ۲۵۰: ${syrupMl} ml هر ۶ ساعت`,
      warningNoticeFa: warning
    };
  }

  if (drug.no === 30) {
    // Cotrimoxazole
    const syrupMl = (weightKg / 2).toFixed(1).replace(/\.0$/, '');
    const tmpMg = Math.round(weightKg * 10);
    return {
      hasCalculation: true,
      weight: weightKg,
      ageYears,
      calculatedTextFa: `• سوسپانسیون کودکان: ${syrupMl} سی‌سی هر ۱۲ ساعت (فرمول وزن ÷ ۲)\n• دوز کل روزانه TMP: حدود ${tmpMg} میلی‌گرم در روز`,
      quickFormulaFa: `سوسپانسیون: ${syrupMl} ml هر ۱۲ ساعت`,
      warningNoticeFa: warning
    };
  }

  if (drug.no === 36) {
    // Diphenhydramine
    const syrupMl = (weightKg / 3).toFixed(1).replace(/\.0$/, '');
    const doseMg = Math.round(weightKg * 1);
    return {
      hasCalculation: true,
      weight: weightKg,
      ageYears,
      calculatedTextFa: `• شربت ۱۲.۵: ${syrupMl} سی‌سی هر ۸ ساعت (فرمول وزن ÷ ۳)\n• دوز در هر نوبت: ${doseMg} میلی‌گرم (حداکثر 50mg)`,
      quickFormulaFa: `شربت: ${syrupMl} ml هر ۸ ساعت`,
      warningNoticeFa: warning
    };
  }

  if (drug.no === 49) {
    // Hydroxyzine
    const syrupMl = (weightKg / 3).toFixed(1).replace(/\.0$/, '');
    const dailyMg = Math.round(weightKg * 2);
    return {
      hasCalculation: true,
      weight: weightKg,
      ageYears,
      calculatedTextFa: `• شربت ۱۰ میلی‌گرم/۵ سی‌سی: ${syrupMl} سی‌سی هر ۸ ساعت (فرمول وزن ÷ ۳)\n• کل دوز روزانه: حدود ${dailyMg} میلی‌گرم در ۲۴ ساعت`,
      quickFormulaFa: `شربت: ${syrupMl} ml هر ۸ ساعت`,
      warningNoticeFa: warning
    };
  }

  if (drug.no === 34) {
    // Dicyclomine
    const syrupMl = (weightKg / 4).toFixed(1).replace(/\.0$/, '');
    return {
      hasCalculation: true,
      weight: weightKg,
      ageYears,
      calculatedTextFa: `• شربت ۱۰: ${syrupMl} سی‌سی هر ۸ ساعت (فرمول وزن ÷ ۴)\n• دوز معمول: ۲.۵ تا ۵ سی‌سی در هر نوبت (اکیداً بالای ۲ سال)`,
      quickFormulaFa: `شربت: ${syrupMl} ml هر ۸ ساعت`,
      warningNoticeFa: warning
    };
  }

  if (drug.no === 78) {
    // Pediatric gripe
    const syrupMl = (weightKg / 3).toFixed(1).replace(/\.0$/, '');
    return {
      hasCalculation: true,
      weight: weightKg,
      ageYears,
      calculatedTextFa: `• شربت سرماخوردگی کودکان: ${syrupMl} سی‌سی هر ۸ ساعت (فرمول وزن ÷ ۳)\n• دوز معمول ۲ تا ۵ سال: ۳ تا ۵ میلی‌لیتر (حداکثر ۲۰ سی‌سی روزانه)`,
      quickFormulaFa: `شربت: ${syrupMl} ml هر ۸ ساعت`,
      warningNoticeFa: warning
    };
  }

  if (drug.no === 12) {
    // Azithromycin
    const ml100 = (weightKg / 4).toFixed(1).replace(/\.0$/, '');
    const doseMg = Math.round(weightKg * 5);
    return {
      hasCalculation: true,
      weight: weightKg,
      ageYears,
      calculatedTextFa: `• سوسپانسیون ۱۰۰: ${ml100} سی‌سی یک‌بار در روز به مدت ۵ روز (فرمول وزن ÷ ۴)\n• نکته: روز اول دوز ۲ برابر داده می‌شود (${(parseFloat(ml100) * 2).toFixed(1).replace(/\.0$/, '')} سی‌سی در روز اول)`,
      quickFormulaFa: `روز اول: ${(parseFloat(ml100) * 2).toFixed(1).replace(/\.0$/, '')} ml | روزهای بعد: ${ml100} ml`,
      warningNoticeFa: warning
    };
  }

  // Generic fallback calculation based on dosage string
  return {
    hasCalculation: true,
    weight: weightKg,
    ageYears,
    calculatedTextFa: `محاسبه بر اساس وزن ${weightKg} کیلوگرم: به مشخصات دوز درج شده در کارت دارو مراجعه شود.`,
    warningNoticeFa: warning
  };
}

function doseMgMgFormat(val: number) {
  return `${val}`;
}
