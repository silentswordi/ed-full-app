export interface NeonatalAntibiotic {
  name: string;
  route: string;
  hasRenalAdjustment?: boolean;
  wtUnder1200_0to4w: string;
  wt1200to2000_0to7d: string;
  wt1200to2000_gt7d: string;
  wtOver2000_0to7d: string;
  wtOver2000_gt7d: string;
  notice?: string;
}

export const NEONATAL_ANTIBIOTICS: NeonatalAntibiotic[] = [
  {
    name: "Amikacin SDD (دوز منقسم)",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "7.5 mg/kg q12h",
    wt1200to2000_0to7d: "7.5 mg/kg q12h",
    wt1200to2000_gt7d: "7.5 mg/kg q8h",
    wtOver2000_0to7d: "10 mg/kg q12h",
    wtOver2000_gt7d: "10 mg/kg q8h"
  },
  {
    name: "Amikacin ODD (تک‌دوز روزانه)",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "18 mg/kg q48h",
    wt1200to2000_0to7d: "16 mg/kg q36h",
    wt1200to2000_gt7d: "15 mg/kg q24h",
    wtOver2000_0to7d: "15 mg/kg q24h",
    wtOver2000_gt7d: "15 mg/kg q24h"
  },
  {
    name: "Ampicillin (مننژیت نوزادی)",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "50 mg/kg q12h",
    wt1200to2000_0to7d: "50 mg/kg q12h",
    wt1200to2000_gt7d: "50 mg/kg q8h",
    wtOver2000_0to7d: "50 mg/kg q8h",
    wtOver2000_gt7d: "50 mg/kg q6h"
  },
  {
    name: "Ampicillin (سایر عفونت‌ها)",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "25 mg/kg q12h",
    wt1200to2000_0to7d: "25 mg/kg q12h",
    wt1200to2000_gt7d: "25 mg/kg q8h",
    wtOver2000_0to7d: "25 mg/kg q8h",
    wtOver2000_gt7d: "25 mg/kg q6h"
  },
  {
    name: "Aztreonam",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "30 mg/kg q12h",
    wt1200to2000_0to7d: "30 mg/kg q12h",
    wt1200to2000_gt7d: "30 mg/kg q8h",
    wtOver2000_0to7d: "30 mg/kg q8h",
    wtOver2000_gt7d: "30 mg/kg q6h"
  },
  {
    name: "Cefazolin",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "20 mg/kg q12h",
    wt1200to2000_0to7d: "20 mg/kg q12h",
    wt1200to2000_gt7d: "20 mg/kg q12h",
    wtOver2000_0to7d: "20 mg/kg q12h",
    wtOver2000_gt7d: "20 mg/kg q8h"
  },
  {
    name: "Cefepime",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "50 mg/kg q12h",
    wt1200to2000_0to7d: "50 mg/kg q12h",
    wt1200to2000_gt7d: "50 mg/kg q8h",
    wtOver2000_0to7d: "50 mg/kg q12h",
    wtOver2000_gt7d: "50 mg/kg q8h"
  },
  {
    name: "Cefotaxime",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "50 mg/kg q12h",
    wt1200to2000_0to7d: "50 mg/kg q12h",
    wt1200to2000_gt7d: "50 mg/kg q8h",
    wtOver2000_0to7d: "50 mg/kg q12h",
    wtOver2000_gt7d: "50 mg/kg q8h"
  },
  {
    name: "Ceftazidime",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "50 mg/kg q12h",
    wt1200to2000_0to7d: "50 mg/kg q12h",
    wt1200to2000_gt7d: "50 mg/kg q8h",
    wtOver2000_0to7d: "50 mg/kg q8h",
    wtOver2000_gt7d: "50 mg/kg q8h"
  },
  {
    name: "Ceftriaxone",
    route: "IV, IM",
    hasRenalAdjustment: false,
    wtUnder1200_0to4w: "50 mg/kg q24h",
    wt1200to2000_0to7d: "50 mg/kg q24h",
    wt1200to2000_gt7d: "50 mg/kg q24h",
    wtOver2000_0to7d: "50 mg/kg q24h",
    wtOver2000_gt7d: "75 mg/kg q24h",
    notice: "توجه: در دوره نوزادی عموماً منع مصرف دارد مگر در شرایط خاص با نظر فوق تخصص"
  },
  {
    name: "Cephalothin",
    route: "IV",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "20 mg/kg q12h",
    wt1200to2000_0to7d: "20 mg/kg q12h",
    wt1200to2000_gt7d: "20 mg/kg q8h",
    wtOver2000_0to7d: "20 mg/kg q8h",
    wtOver2000_gt7d: "20 mg/kg q6h"
  },
  {
    name: "Chloramphenicol",
    route: "IV, PO",
    hasRenalAdjustment: false,
    wtUnder1200_0to4w: "25 mg/kg q24h",
    wt1200to2000_0to7d: "25 mg/kg q24h",
    wt1200to2000_gt7d: "25 mg/kg q24h",
    wtOver2000_0to7d: "25 mg/kg q24h",
    wtOver2000_gt7d: "25 mg/kg q12h"
  },
  {
    name: "Ciprofloxacin",
    route: "IV",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "—",
    wt1200to2000_0to7d: "—",
    wt1200to2000_gt7d: "10-20 mg/kg q24h",
    wtOver2000_0to7d: "—",
    wtOver2000_gt7d: "20-30 mg/kg q12h"
  },
  {
    name: "Clindamycin",
    route: "IV, IM, PO",
    hasRenalAdjustment: false,
    wtUnder1200_0to4w: "5 mg/kg q12h",
    wt1200to2000_0to7d: "5 mg/kg q12h",
    wt1200to2000_gt7d: "5 mg/kg q8h",
    wtOver2000_0to7d: "5 mg/kg q8h",
    wtOver2000_gt7d: "5 mg/kg q6h"
  },
  {
    name: "Erythromycin",
    route: "PO",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "10 mg/kg q12h",
    wt1200to2000_0to7d: "10 mg/kg q12h",
    wt1200to2000_gt7d: "10 mg/kg q8h",
    wtOver2000_0to7d: "10 mg/kg q12h",
    wtOver2000_gt7d: "10 mg/kg q8h"
  },
  {
    name: "Gentamicin SDD (دوز منقسم)",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "2.5 mg/kg q18h",
    wt1200to2000_0to7d: "2.5 mg/kg q12h",
    wt1200to2000_gt7d: "2.5 mg/kg q8h",
    wtOver2000_0to7d: "2.5 mg/kg q12h",
    wtOver2000_gt7d: "2.5 mg/kg q8h"
  },
  {
    name: "Gentamicin ODD (تک دوز روزانه)",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "5 mg/kg q48h",
    wt1200to2000_0to7d: "4 mg/kg q36h",
    wt1200to2000_gt7d: "4 mg/kg q24h",
    wtOver2000_0to7d: "4 mg/kg q24h",
    wtOver2000_gt7d: "4 mg/kg q24h"
  },
  {
    name: "Imipenem",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "—",
    wt1200to2000_0to7d: "20 mg/kg q12h",
    wt1200to2000_gt7d: "20 mg/kg q12h",
    wtOver2000_0to7d: "20 mg/kg q12h",
    wtOver2000_gt7d: "20 mg/kg q8h"
  },
  {
    name: "Linezolid",
    route: "IV",
    hasRenalAdjustment: false,
    wtUnder1200_0to4w: "—",
    wt1200to2000_0to7d: "10 mg/kg q12h",
    wt1200to2000_gt7d: "10 mg/kg q8h",
    wtOver2000_0to7d: "10 mg/kg q12h",
    wtOver2000_gt7d: "10 mg/kg q8h"
  },
  {
    name: "Meropenem",
    route: "IV, IM",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "—",
    wt1200to2000_0to7d: "20 mg/kg q12h",
    wt1200to2000_gt7d: "20 mg/kg q12h",
    wtOver2000_0to7d: "20 mg/kg q12h",
    wtOver2000_gt7d: "20 mg/kg q8h"
  },
  {
    name: "Metronidazole",
    route: "IV, PO",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "7.5 mg/kg q48h",
    wt1200to2000_0to7d: "7.5 mg/kg q24h",
    wt1200to2000_gt7d: "7.5 mg/kg q12h",
    wtOver2000_0to7d: "7.5 mg/kg q12h",
    wtOver2000_gt7d: "15 mg/kg q12h"
  },
  {
    name: "Vancomycin",
    route: "IV",
    hasRenalAdjustment: true,
    wtUnder1200_0to4w: "15 mg/kg q24h",
    wt1200to2000_0to7d: "10 mg/kg q12h",
    wt1200to2000_gt7d: "10 mg/kg q12h",
    wtOver2000_0to7d: "10 mg/kg q8h",
    wtOver2000_gt7d: "10 mg/kg q8h"
  }
];

export interface NeonatalCommonDrug {
  no: number;
  name: string;
  nameFa: string;
  indication: string;
  dosage: string;
  interval: string;
  max: string;
  notice: string;
  hasRenalAdjustment: boolean;
}

export const NEONATAL_COMMON_DRUGS: NeonatalCommonDrug[] = [
  {
    no: 1,
    name: "Acyclovir",
    nameFa: "آسیکلوویر",
    indication: "عفونت هرپس نوزادی (HSV Infection)",
    dosage: "20 mg/kg/dose",
    interval: "Q8hr",
    max: "دوره ۱۴ تا ۲۱ روزه",
    notice: "هیدراتاسیون مناسب حفظ شود. تنظیم دوز کلیوی (*).",
    hasRenalAdjustment: true
  },
  {
    no: 2,
    name: "Adenosine",
    nameFa: "آدنوزین",
    indication: "تاکی‌کاردی فوق بطنی (PSVT)",
    dosage: "0.05 mg/kg/dose",
    interval: "Q 1-2 min (تا پاسخ مناسب)",
    max: "0.25 mg/kg/dose",
    notice: "تزریق فوق‌العاده سریع وریدی (Rapid IV Push) همراه فلاش ۲-۳ سی‌سی سالین.",
    hasRenalAdjustment: false
  },
  {
    no: 3,
    name: "Aminophylline",
    nameFa: "آمینوفیلین",
    indication: "آپنه نارسی (Apnea of Prematurity)",
    dosage: "لودینگ: 4-6 mg/kg/dose | نگهدارنده: 1-2 mg/kg/dose",
    interval: "BID - TDS (وریدی آهسته)",
    max: "طبق سطح سرمی تئوفیلین",
    notice: "انفوزیون وریدی به صورت آهسته انجام گیرد.",
    hasRenalAdjustment: false
  },
  {
    no: 4,
    name: "Caffeine Citrate",
    nameFa: "کافئین سیترات",
    indication: "آپنه نارسی (داروی انتخابی آپنه در نوزادان نارس)",
    dosage: "لودینگ: 20-25 mg/kg/dose | نگهدارنده: 5-10 mg/kg/dose",
    interval: "Daily (یک‌بار در روز)",
    max: "طبق پروتکل NICU",
    notice: "انفوزیون آهسته (Slow Infusion). نیمه‌عمر طولانی‌تری نسبت به آمینوفیلین دارد و به مانیتورینگ کمتری نیاز دارد.",
    hasRenalAdjustment: false
  },
  {
    no: 5,
    name: "Dobutamine",
    nameFa: "دوبوتامین",
    indication: "افت فشار خون، اختلال عملکرد انقباضی میوکارد (Hypoperfusion)",
    dosage: "2 - 20 mcg/kg/min",
    interval: "Continuous IV Infusion پیوسته با پمپ",
    max: "20 mcg/kg/min",
    notice: "مانیتورینگ مداوم ضربان قلب و فشار خون شریانی.",
    hasRenalAdjustment: false
  },
  {
    no: 6,
    name: "Dopamine",
    nameFa: "دوپامین",
    indication: "هایپوتانسیون نوزادی، شوک سپتیک یا کاردیوژنیک",
    dosage: "2 - 20 mcg/kg/min",
    interval: "Continuous IV Infusion پیوسته",
    max: "20 mcg/kg/min",
    notice: "دوزهای پایین ۲-۵ میکروگرم اثرات اینوتروپ و عروق کلیوی دارند.",
    hasRenalAdjustment: false
  },
  {
    no: 7,
    name: "Epinephrine 1/10000",
    nameFa: "اپی‌نفرین ۱:۱۰۰۰۰",
    indication: "ایست قلبی نوزاد (Cardiac Arrest)، هایپوتانسیون مقاوم",
    dosage: "وریدی (IV): 0.1 - 0.3 ml/kg | داخل لوله تراشه (ET): 0.3 - 1 ml/kg | افت فشار مقاوم: 0.05-0.1 mcg/kg/min",
    interval: "Q3-5 min در احیا / یا Continuous IV",
    max: "طبق پروتکل NRP",
    notice: "در احیای نوزادان منحصراً از رقت ۱:۱۰۰۰۰ (0.1mg/ml) استفاده می‌شود.",
    hasRenalAdjustment: false
  },
  {
    no: 8,
    name: "Fentanyl",
    nameFa: "فنتانیل",
    indication: "تسکین درد و آرام‌بخشی نوزاد در لوله‌گذاری و تهویه مکانیکی",
    dosage: "1 - 4 mcg/kg/dose",
    interval: "Q 2-4 hr (یا انفوزیون پیوسته)",
    max: "طبق بالین",
    notice: "تزریق سریع باعث ریژیدیتی و سفتی جدار قفسه سینه می‌شود. تنظیم کلیوی (*).",
    hasRenalAdjustment: true
  },
  {
    no: 9,
    name: "Furosemide",
    nameFa: "فوروزماید (لازیکس)",
    indication: "ادم ریوی، نارسایی قلبی نوزادی",
    dosage: "وریدی (IV): 1-2 mg/kg/dose | خوراکی (PO): 2-6 mg/kg/dose",
    interval: "در نوزاد ترم: Q 12-24 hr | در نوزاد نارس (Preterm): Q 24 hr",
    max: "2 mg/kg/dose IV",
    notice: "خطر اوتوتوکسیسیتی همراه آمینوگلیکوزیدها. تنظیم کلیوی (*).",
    hasRenalAdjustment: true
  },
  {
    no: 10,
    name: "Insulin Regular",
    nameFa: "انسولین رگولار نوزادی",
    indication: "هایپرگلیسمی شدید نوزادی، هایپرکالمی",
    dosage: "هایپرگلیسمی: بولوس 0.05 - 0.2 U/kg (هر ۶ ساعت PRN) | هایپرکالمی: 0.01 - 0.1 U/kg/hr پیوسته",
    interval: "Q6hr PRN یا Continuous IV Infusion",
    max: "طبق مانیتورینگ قند",
    notice: "در هایپرکالمی همراه سرم قندی ۵٪ (0.5 gr/kg/dose گلوکز) تجویز گردد. تنظیم کلیوی (*).",
    hasRenalAdjustment: true
  },
  {
    no: 11,
    name: "Midazolam",
    nameFa: "میدازولام",
    indication: "آرام‌بخش در نوزادان زیر ونتیلاتور و تشنج",
    dosage: "0.05 - 0.15 mg/kg/dose",
    interval: "Q 2-4 hr",
    max: "طبق نیاز",
    notice: "انفوزیون حتماً بسیار آهسته انجام شود (Slowly Infusion). تنظیم کلیوی (*).",
    hasRenalAdjustment: true
  },
  {
    no: 12,
    name: "Phenobarbital",
    nameFa: "فنوباربیتال نوزادی",
    indication: "تشنج نوزادی (داروی خط اول)",
    dosage: "لودینگ اولیه: 20 mg/kg/dose وریدی آهسته | دوز اضافی در صورت تداوم تشنج: 5 mg/kg/dose | نگهدارنده: 3-4 mg/kg/day منقسم BID",
    interval: "لودینگ: طی ۵ تا ۱۰ دقیقه | نگهدارنده: BID",
    max: "حداکثر مجموع لودینگ: 40 mg/kg",
    notice: "تزریق بسیار آهسته جهت پرهیز از تضعیف تنفسی. تنظیم کلیوی (*).",
    hasRenalAdjustment: true
  },
  {
    no: 13,
    name: "Phenytoin",
    nameFa: "فنی‌توئین",
    indication: "تشنج مقاوم نوزاد",
    dosage: "لودینگ: 20 mg/kg/dose وریدی آهسته طی حداقل ۳۰ دقیقه | نگهدارنده: 4-8 mg/kg/day منقسم BID",
    interval: "لودینگ: طی ۳۰ دقیقه | نگهدارنده: BID",
    max: "طبق سطح سرمی",
    notice: "تزریق عضلانی اکیداً ممنوع است. فقط با نرمال سالین انفوزیون شود.",
    hasRenalAdjustment: false
  },
  {
    no: 14,
    name: "Ranitidine",
    nameFa: "رانیتیدین",
    indication: "GERD، اولسر معده، خونریزی گوارشی سطحی",
    dosage: "خوراکی: 2 mg/kg/day منقسم BID-TDS\nوریدی در نوزاد نارس (Preterm): 0.5 mg/kg/dose BID\nوریدی در نوزاد ترم (Term): 1.5 mg/kg/dose BID",
    interval: "BID (هر ۱۲ ساعت) یا TDS",
    max: "طبق وزن",
    notice: "تنظیم دوز کلیوی الزامی است (*).",
    hasRenalAdjustment: true
  },
  {
    no: 15,
    name: "Surfactant (سرفکتانت)",
    nameFa: "سرفکتانت (سروانتا / کوروسورف / آلوئوفکت)",
    indication: "سندرم زجر تنفسی نوزادان نارس (RDS)",
    dosage: "• Survanta: دوز 4 ml/kg\n• Curosurf: دوز اولیه 2.5 ml/kg سپس دوزهای بعدی 1.25 ml/kg\n• Alveofact: دوز 1.2 ml/kg",
    interval: "طبق شدت RDS و پروتکل INSURE/LISA",
    max: "طبق پروتکل نوزادی",
    notice: "تزریق داخل لوله تراشه (Endotracheal) با تکنیک کاملاً استریل توسط پزشک نوزادان.",
    hasRenalAdjustment: false
  },
  {
    no: 16,
    name: "Vitamin K1 (Phytomenadione)",
    nameFa: "ویتامین کا۱",
    indication: "پیشگیری و درمان بیماری خونریزی‌دهنده نوزادی (VKDB)",
    dosage: "پروفیلاکسی بدو تولد: وزن کمتر از ۱۰۰۰ گرم: 0.5 mg عضلانی | وزن بالای ۱۰۰۰ گرم: 1 mg عضلانی\nدرمان خونریزی: 1-2 mg روزانه",
    interval: "پروفیلاکسی: Single Dose (تک دوز بدو تولد) | درمان: روزانه",
    max: "2 mg",
    notice: "تزریق عضلانی (IM) بلافاصله در ساعات اولیه پس از تولد برای همه نوزادان الزامی است.",
    hasRenalAdjustment: false
  }
];
