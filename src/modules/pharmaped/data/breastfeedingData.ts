export interface BreastfeedingDrug {
  nameEn: string;
  nameFa: string;
  category: 'contraindicated' | 'caution';
  reasonFa: string;
  notesFa?: string;
}

export const CONTRAINDICATED_BREASTFEEDING_DRUGS: BreastfeedingDrug[] = [
  { nameEn: "Amphetamines", nameFa: "آمفتامین‌ها", category: "contraindicated", reasonFa: "تحریک‌پذیری شدید، بی‌خوابی، تشنج و وابستگی در شیرخوار" },
  { nameEn: "Antineoplastic agents", nameFa: "داروهای ضدسرطان و سایتوتوکسیک", category: "contraindicated", reasonFa: "سرکوب مغز استخوان و اثرات موتاژنیک در شیرخوار" },
  { nameEn: "Bromocriptine", nameFa: "بروموکریپتین", category: "contraindicated", reasonFa: "مهارکننده ترشح پرولاکتین و قطع شیر مادری" },
  { nameEn: "Chloramphenicol", nameFa: "کلرامفنیکل", category: "contraindicated", reasonFa: "خطر سرکوب خونسازی و سمیت مغز استخوان" },
  { nameEn: "Clozapine", nameFa: "کلوزاپین", category: "contraindicated", reasonFa: "خطر آگرانولوسیتوز و تشنج در شیرخوار" },
  { nameEn: "Cocaine", nameFa: "کوکائین", category: "contraindicated", reasonFa: "تاکی‌کاردی، تشنج، تحریک‌پذیری شدید و آسیب قلبی عروقی نوزاد" },
  { nameEn: "Cyclophosphamide", nameFa: "سیکلوفسفامید", category: "contraindicated", reasonFa: "سرکوب شدید سیستم ایمنی نوزاد و سمیت ژنتیکی" },
  { nameEn: "Diethylstilbestrol", nameFa: "دی‌اتیل‌استیل‌بسترول", category: "contraindicated", reasonFa: "پتانسیل سرطان‌زایی در درازمدت" },
  { nameEn: "Doxorubicin", nameFa: "دوکسوروبیسین", category: "contraindicated", reasonFa: "سمیت قلبی و سلولی شدید در شیرخوار" },
  { nameEn: "Ergots (Ergotamine, etc.)", nameFa: "ترکیبات ارگوت (ارگوتامین)", category: "contraindicated", reasonFa: "ارگوتیسم در نوزاد، استفراغ، اسهال، ترومبوز عروقی و مهار ترشح شیر" },
  { nameEn: "Gold salts", nameFa: "املاح طلا", category: "contraindicated", reasonFa: "نفروتوکسیسیتی و سمیت خونی نوزاد" },
  { nameEn: "Heroin & illicit opioids", nameFa: "هروئین و مواد مخدر خیابانی", category: "contraindicated", reasonFa: "اعتیاد نوزادی، سستی و تضعیف کشنده تنفسی" },
  { nameEn: "Immunosuppressants", nameFa: "داروهای سرکوب‌کننده ایمنی", category: "contraindicated", reasonFa: "مهار دفاع ایمنی و افزایش عفونت‌های تهدیدکننده در شیرخوار" },
  { nameEn: "Iodides", nameFa: "ترکیبات یدید", category: "contraindicated", reasonFa: "سرکوب عملکرد غده تیروئید نوزاد و بروز گواتر و هیپوتیروئیدی" },
  { nameEn: "Lithium", nameFa: "لیتیوم", category: "contraindicated", reasonFa: "ترشح قابل توجه در شیر، هیپوتونی، سیانوز و نارسایی کلیوی نوزاد" },
  { nameEn: "Methimazole", nameFa: "متی‌مازول (دوزهای بالا)", category: "contraindicated", reasonFa: "اختلال عملکرد تیروئید شیرخوار (پایش دوره‌ای TSH در صورت اجبار)" },
  { nameEn: "Methylamphetamine", nameFa: "مت‌آمفتامین (شیشه)", category: "contraindicated", reasonFa: "آسیب غیرقابل بازگشت مغزی و سیستم سمپاتیک کودک" },
  { nameEn: "Phencyclidine (PCP)", nameFa: "فنسیکلیدین (PCP)", category: "contraindicated", reasonFa: "سمیت عصبی شدید و پایدار" }
];

export const CAUTION_BREASTFEEDING_DRUGS: BreastfeedingDrug[] = [
  { nameEn: "Alcohol", nameFa: "الکل (اتانول)", category: "caution", reasonFa: "کاهش ترشح شیر، اختلال خواب نوزاد و ضعف رشد عصبی در مصرف مکرر" },
  { nameEn: "Amiodarone", nameFa: "آمیودارون", category: "caution", reasonFa: "نیمه‌عمر بسیار طولانی، حاوی ید و خطر دیس‌فانکشن تیروئید کودک" },
  { nameEn: "Anthraquinones (laxatives)", nameFa: "ملین‌های آنتراکوینونی (سنا و...)", category: "caution", reasonFa: "ایجاد اسهال و دل‌پیچه حاد در نوزاد" },
  { nameEn: "Aspirin (salicylates)", nameFa: "آسپرین (سالیسیلات دوز بالا)", category: "caution", reasonFa: "خطر سندرم ری (Reye Syndrome) و خونریزی؛ دوز پایین ۸۰mg با پایش مجاز است" },
  { nameEn: "Atropine", nameFa: "آتروپین", category: "caution", reasonFa: "احتمال کاهش حجم شیر مادری و عوارض آنتی‌کولینرژیک در نوزاد" },
  { nameEn: "β-adrenergic blocking agents", nameFa: "بتابلاکرها (به ویژه آتنولول)", category: "caution", reasonFa: "آتنولول در شیر تغلیظ می‌شود (لابتالول و متوپرولول بسیار ترجیح دارند)" },
  { nameEn: "Birth control pills (Combined)", nameFa: "قرص‌های ضدبارداری ترکیبی استروژنی", category: "caution", reasonFa: "کاهش حجم و کیفیت شیر مادر؛ استفاده از قرص پروژسترونی (مینی‌پیل) اولویت دارد" },
  { nameEn: "Bromides", nameFa: "برومیدها", category: "caution", reasonFa: "بثورات جلدی و خواب‌آلودگی کودک" },
  { nameEn: "Calciferol (High Dose)", nameFa: "کلسیفرول (دوزهای بسیار بالای ویتامین دی)", category: "caution", reasonFa: "خطر هایپرکلسمی نوزادی" },
  { nameEn: "Cascara", nameFa: "کاسکارا", category: "caution", reasonFa: "اسهال شدید شیرخوار" },
  { nameEn: "Ciprofloxacin", nameFa: "سیپروفلوکساسین", category: "caution", reasonFa: "احتمال آسیب غضروفی و تغییر فلور روده نوزاد؛ ترجیحاً داروهای جایگزین مصرف شوند" },
  { nameEn: "Danthron", nameFa: "دانترون", category: "caution", reasonFa: "ملین با پتانسیل سرطان‌زایی تجربی" },
  { nameEn: "Dihydrotachysterol", nameFa: "دی‌هیدروتاکی‌استرول", category: "caution", reasonFa: "احتمال تجمع ویتامین D و هایپرکلسمی" },
  { nameEn: "Domperidone", nameFa: "دامپریدون", category: "caution", reasonFa: "افزایش‌دهنده شیر اما پایش آریتمی قلبی مادری" },
  { nameEn: "Estrogens", nameFa: "استروژن‌ها", category: "caution", reasonFa: "سرکوب شیردهی و حجم شیر مادری" },
  { nameEn: "Metoclopramide", nameFa: "متوکلوپرامید", category: "caution", reasonFa: "ترشح در شیر و خواب‌آلودگی نوزاد؛ حداکثر به مدت کوتاه مصرف شود" },
  { nameEn: "Metronidazole", nameFa: "مترونیدازول", category: "caution", reasonFa: "ایجاد طعم تلخ شیر و بی‌میلی شیرخوار؛ در صورت مصرف دوز بالا وقفه ۱۲-۲۴ ساعته در شیردهی" },
  { nameEn: "Meperidine (Pethidine)", nameFa: "مپریدین (پتیدین)", category: "caution", reasonFa: "تجمع متابولیت نورمپریدین در نوزاد و سرکوب تنفسی نوزاد" },
  { nameEn: "Phenobarbital", nameFa: "فنوباربیتال", category: "caution", reasonFa: "خواب‌آلودگی عمیق، هیپوتونی و عدم توانایی مکیدن سینه در نوزاد" },
  { nameEn: "Primidone", nameFa: "پریمیدون", category: "caution", reasonFa: "خواب‌آلودگی شدید و اختلال مکیدن در نوزاد" },
  { nameEn: "Psychotropic drugs", nameFa: "داروهای سایکوتروپیک و اعصاب", category: "caution", reasonFa: "پایش شیرخوار از نظر رخوت، خواب‌آلودگی، کاهش وزن و تکامل حرکتی" },
  { nameEn: "Reserpine", nameFa: "رزرپین", category: "caution", reasonFa: "احتقان بینی شدید، برادیکاردی و خواب‌آلودگی نوزاد" },
  { nameEn: "Salicylazosulfapyridine (Sulfasalazine)", nameFa: "سولفاسالازین", category: "caution", reasonFa: "اسهال خونی یا همولیز در صورت نقص G6PD نوزاد" }
];
