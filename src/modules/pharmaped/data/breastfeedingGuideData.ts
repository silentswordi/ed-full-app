export interface BreastfeedingDrugItem {
  id: string;
  nameFa: string;
  nameEn: string;
  indication: string;
  status: 'compatible' | 'caution' | 'contraindicated';
  statusBadge: string;
  lactMedNote: string;
}

export const BREASTFEEDING_DRUGS: BreastfeedingDrugItem[] = [
  // --- سازگار در مصرف کوتاه‌مدت معمول (Compatible / Safe) ---
  {
    id: "bf-acetaminophen",
    nameFa: "استامینوفن (پاراستامول)",
    nameEn: "Acetaminophen (Paracetamol)",
    indication: "ضد تب و درد",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "ترشح کم در شیر؛ بدون خطر عمده اثبات‌شده برای شیرخوار."
  },
  {
    id: "bf-ibuprofen",
    nameFa: "ایبوپروفن",
    nameEn: "Ibuprofen",
    indication: "ضد درد و التهاب",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "میزان بسیار ناچیز در شیر مادر؛ داروی ضدالتهاب انتخابی در شیردهی."
  },
  {
    id: "bf-diclofenac",
    nameFa: "دیکلوفناک",
    nameEn: "Diclofenac",
    indication: "ضد درد و التهاب",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "غلظت بسیار کم در شیر مادر."
  },
  {
    id: "bf-ketorolac",
    nameFa: "کتورولاک",
    nameEn: "Ketorolac",
    indication: "ضد درد حاد و شدید",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "ترشح کم در شیر؛ در دوره‌های کوتاه‌مدت ایمن است."
  },
  {
    id: "bf-celecoxib",
    nameFa: "سلکوکسیب",
    nameEn: "Celecoxib",
    indication: "ضد درد و مهارکننده COX-2",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "اتصال پروتئینی بالا؛ انتقال ناچیز به شیر نوزاد."
  },
  {
    id: "bf-lidocaine",
    nameFa: "لیدوکائین",
    nameEn: "Lidocaine",
    indication: "بی‌حسی موضعی و ضدآریتمی",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "جذب خوراکی ضعیف توسط نوزاد؛ ایمن در بی‌حسی‌ها."
  },
  {
    id: "bf-bupivacaine",
    nameFa: "بوپیواکائین",
    nameEn: "Bupivacaine",
    indication: "بی‌حسی نخاعی و اپیدورال",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "انتقال ناچیز به شیر مادر پس از بی‌حسی‌های رژیونال."
  },
  {
    id: "bf-ropivacaine",
    nameFa: "روپیواکائین",
    nameEn: "Ropivacaine",
    indication: "بی‌حسی موضعی",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "مقدار کم در شیر مادر."
  },
  {
    id: "bf-fentanyl-single",
    nameFa: "فنتانیل (تک‌دوز پروسیجر)",
    nameEn: "Fentanyl (Single procedural dose)",
    indication: "آرام‌بخش و ضد درد پروسیجر",
    status: "compatible",
    statusBadge: "سازگار در مصرف تک‌دوز کوتاه‌مدت",
    lactMedNote: "تک‌دوز جهت پروسیجر ایمن است؛ پایش کوتاه‌مدت نوزاد از نظر خواب‌آلودگی."
  },
  {
    id: "bf-propofol",
    nameFa: "پروپوفول (تک‌دوز بیهوشی)",
    nameEn: "Propofol (Single dose)",
    indication: "القای بیهوشی و سدیشن",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "پس از هوشیاری کامل مادر، شیردهی می‌تواند بدون نیاز به دوشیدن و دور ریختن شیر آغاز شود."
  },
  {
    id: "bf-etomidate",
    nameFa: "اتومیدات",
    nameEn: "Etomidate",
    indication: "بیهوشی اورژانس",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "ترشح کم در شیر؛ پس از بیداری مادر شیردهی مجاز است."
  },
  {
    id: "bf-ondansetron",
    nameFa: "اندانسترون (دمیترون)",
    nameEn: "Ondansetron",
    indication: "ضد تهوع و استفراغ",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "ترشح کم در شیر مادری."
  },
  {
    id: "bf-famotidine",
    nameFa: "فاموتیدین",
    nameEn: "Famotidine",
    indication: "مهارکننده اسید معده H2 blocker",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "ایمن‌ترین داروی کاهنده اسید در شیردهی."
  },
  {
    id: "bf-pantoprazole",
    nameFa: "پانتوپرازول",
    nameEn: "Pantoprazole",
    indication: "مهارکننده پمپ پروتون PPI",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "میزان بسیار ناچیز در شیر مادر."
  },
  {
    id: "bf-omeprazole",
    nameFa: "امپرازول",
    nameEn: "Omeprazole",
    indication: "کاهش اسید معده و GERD",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "تجزیه سریع در اسید معده نوزاد و عدم جذب معنی‌دار."
  },
  {
    id: "bf-hydrocortisone",
    nameFa: "هیدروکورتیزون",
    nameEn: "Hydrocortisone",
    indication: "کورتیکواستروئید ضدالتهاب",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "ترشح کم در شیر در مصرف کوتاه‌مدت."
  },
  {
    id: "bf-cefazolin",
    nameFa: "سفازولین",
    nameEn: "Cefazolin",
    indication: "آنتی‌بیوتیک سفالوسپورین نسل اول",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "ترشح ناچیز در شیر؛ تغییر فلور روده یا مدفوع شل نوزاد پایش شود."
  },
  {
    id: "bf-cephalexin",
    nameFa: "سفالکسین",
    nameEn: "Cephalexin",
    indication: "آنتی‌بیوتیک خوراکی",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "کاملاً سازگار با شیردهی."
  },
  {
    id: "bf-ceftriaxone",
    nameFa: "سفتریاکسون",
    nameEn: "Ceftriaxone",
    indication: "آنتی‌بیوتیک تزریقی نسل سوم",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "ترشح بسیار کم در شیر مادر."
  },
  {
    id: "bf-cefuroxime",
    nameFa: "سفوروکسیم",
    nameEn: "Cefuroxime",
    indication: "آنتی‌بیوتیک سفالوسپورین نسل دوم",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "سازگار با شیردهی."
  },
  {
    id: "bf-cefixime",
    nameFa: "سفکسیم (سفیکسیم)",
    nameEn: "Cefixime",
    indication: "آنتی‌بیوتیک خوراکی نسل سوم",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "ترشح ناچیز در شیر مادر؛ کاملاً سازگار با شیردهی."
  },
  {
    id: "bf-cefepime",
    nameFa: "سفپیم",
    nameEn: "Cefepime",
    indication: "آنتی‌بیوتیک سفالوسپورین نسل چهارم",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "انتقال کم به شیر مادر."
  },
  {
    id: "bf-ceftazidime",
    nameFa: "سفتازیدیم",
    nameEn: "Ceftazidime",
    indication: "آنتی‌بیوتیک ضد سودومونا",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "سازگار با شیردهی."
  },
  {
    id: "bf-piperacillin-tazo",
    nameFa: "پیپراسیلین-تازوباکتام (تازوسین)",
    nameEn: "Piperacillin-Tazobactam",
    indication: "آنتی‌بیوتیک وسیع‌الطیف تزریقی",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "ترشح بسیار کم در شیر."
  },
  {
    id: "bf-amoxicillin",
    nameFa: "آموکسی‌سیلین",
    nameEn: "Amoxicillin",
    indication: "آنتی‌بیوتیک خط اول تنفسی و گوش",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "سازگار با شیردهی؛ داروی انتخابی."
  },
  {
    id: "bf-amox-clav",
    nameFa: "آموکسی‌سیلین-کلاوولانات (فارمنتین / کوآموکسی‌کلاو)",
    nameEn: "Amoxicillin-Clavulanate",
    indication: "آنتی‌بیوتیک",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "سازگار با شیردهی؛ پایش از نظر اسهال خفیف در نوزاد."
  },
  {
    id: "bf-penicillin-g",
    nameFa: "پنی‌سیلین جی",
    nameEn: "Penicillin G",
    indication: "آنتی‌بیوتیک",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "ایمن در دوران شیردهی."
  },
  {
    id: "bf-ampicillin",
    nameFa: "آمپی‌سیلین",
    nameEn: "Ampicillin",
    indication: "آنتی‌بیوتیک",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "سازگار با شیردهی."
  },
  {
    id: "bf-azithromycin",
    nameFa: "آزیترومایسین",
    nameEn: "Azithromycin",
    indication: "ماکرولید",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "سازگار؛ پایش از نظر مدفوع شل نوزاد."
  },
  {
    id: "bf-erythromycin",
    nameFa: "اریترومایسین",
    nameEn: "Erythromycin",
    indication: "ماکرولید",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "ترشح در شیر کم است."
  },
  {
    id: "bf-clindamycin",
    nameFa: "کلیندامایسین",
    nameEn: "Clindamycin",
    indication: "آنتی‌بیوتیک بی‌هوازی و گرم مثبت",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "ترشح کم در شیر؛ پایش حرکات روده نوزاد."
  },
  {
    id: "bf-vancomycin",
    nameFa: "ونکومایسین",
    nameEn: "Vancomycin",
    indication: "آنتی‌بیوتیک گلیکوپپتیدی",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "جذب خوراکی از دستگاه گوارش نوزاد بسیار اندک است."
  },
  {
    id: "bf-gentamicin",
    nameFa: "جنتامایسین",
    nameEn: "Gentamicin",
    indication: "آمینوگلیکوزید",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "جذب خوراکی از روده نوزاد بسیار ناچیز است."
  },
  {
    id: "bf-tobramycin",
    nameFa: "توبرامایسین",
    nameEn: "Tobramycin",
    indication: "آمینوگلیکوزید",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "عدم جذب خوراکی قابل توجه نوزاد."
  },
  {
    id: "bf-nitrofurantoin",
    nameFa: "نیتروفورانتوئین",
    nameEn: "Nitrofurantoin",
    indication: "عفونت ادراری",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (پرهیز در سن زیر ۱ ماه یا فاویسم)",
    lactMedNote: "در صورت سن نوزاد بالای ۱ ماه و عدم ابتلای نوزاد به فاویسم (نقص G6PD) سازگار است."
  },
  {
    id: "bf-fosfomycin",
    nameFa: "فوسفومایسین",
    nameEn: "Fosfomycin",
    indication: "عفونت ادراری",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "ترشح بسیار کم در شیر."
  },
  {
    id: "bf-acyclovir",
    nameFa: "آسیکلوویر",
    nameEn: "Acyclovir",
    indication: "ضدویروس هرپس و زونا",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "سازگار با شیردهی."
  },
  {
    id: "bf-oseltamivir",
    nameFa: "اوسلتامیویر (تامی‌فلو)",
    nameEn: "Oseltamivir",
    indication: "ضدویروس آنفولانزا",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول (ایمن)",
    lactMedNote: "ترشح بسیار اندک در شیر مادر."
  },
  {
    id: "bf-heparin",
    nameFa: "هپارین و انوکساپارین (LMWH)",
    nameEn: "Heparin & Enoxaparin",
    indication: "ضدانعقاد خون",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (کاملاً ایمن)",
    lactMedNote: "وزن مولکولی بالا مانع عبور به شیر و جذب گوارشی نوزاد می‌شود."
  },
  {
    id: "bf-insulins",
    nameFa: "انواع انسولین (رگولار، لیسپرو، گلارژین)",
    nameEn: "Insulins (Regular, Lispro, Glargine)",
    indication: "کنترل دیابت و قند خون",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (کاملاً ایمن)",
    lactMedNote: "انسولین مولکول پروتئینی است و در معده نوزاد هضم می‌شود و جذب نمی‌شود."
  },
  {
    id: "bf-salbutamol",
    nameFa: "سالبوتامول (آلبوترول)",
    nameEn: "Salbutamol (Albuterol)",
    indication: "برونکودیلاتور و آسم",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (ایمن)",
    lactMedNote: "مصرف استنشاقی به دلیل جذب سیستمیک بسیار پایین برای نوزاد کاملاً ایمن است."
  },
  {
    id: "bf-ipratropium",
    nameFa: "ایپراتروپیوم بروماید",
    nameEn: "Ipratropium",
    indication: "تنفسی و آسم",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (ایمن)",
    lactMedNote: "جذب سیستمیک ناچیز."
  },
  {
    id: "bf-budesonide",
    nameFa: "بودزوناید استنشاقی",
    nameEn: "Budesonide (inhaled)",
    indication: "کورتیکواستروئید استنشاقی آسم",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (ایمن)",
    lactMedNote: "سازگار و داروی انتخابی آسم در شیردهی."
  },
  {
    id: "bf-fluticasone",
    nameFa: "فلوتیکازون (استنشاقی / اسپری بینی)",
    nameEn: "Fluticasone (inhaled/nasal)",
    indication: "آسم و رینیت آلرژیک",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (ایمن)",
    lactMedNote: "سازگار با شیردهی."
  },
  {
    id: "bf-cetirizine",
    nameFa: "ستیریزین",
    nameEn: "Cetirizine",
    indication: "آنتی‌هیستامین نسل دوم",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "خواب‌آلودگی کمتری نسبت به نسل اول دارد و سازگار است."
  },
  {
    id: "bf-loratadine",
    nameFa: "لوراتادین",
    nameEn: "Loratadine",
    indication: "آنتی‌هیستامین غیرخواب‌آور",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (آنتی‌هیستامین انتخابی)",
    lactMedNote: "داروی انتخابی آنتی‌هیستامین در شیردهی با کمترین میزان ترشح در شیر."
  },
  {
    id: "bf-diphenhydramine",
    nameFa: "دیفن‌هیدرامین (تک‌دوز گهگاه)",
    nameEn: "Diphenhydramine (occasional)",
    indication: "آنتی‌هیستامین",
    status: "compatible",
    statusBadge: "سازگار در تک‌دوزهای گهگاه",
    lactMedNote: "مصرف گهگاه بلامانع است؛ مصرف مداوم ممکن است شیر مادر را کم یا نوزاد را خواب‌آلود کند."
  },
  {
    id: "bf-labetalol",
    nameFa: "لابتالول",
    nameEn: "Labetalol",
    indication: "فشار خون بارداری و پس از زایمان",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (بتابلاکر انتخابی شیردهی)",
    lactMedNote: "بتابلاکر خط اول در شیردهی؛ ترشح ناچیز در شیر در مقایسه با آتنولول."
  },
  {
    id: "bf-hydralazine",
    nameFa: "هیدرالازین",
    nameEn: "Hydralazine",
    indication: "فشار خون بالا",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "سازگار با شیردهی."
  },
  {
    id: "bf-nifedipine",
    nameFa: "نیفدیپین",
    nameEn: "Nifedipine",
    indication: "کانال‌بلاکر کلسیمی فشار خون",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (ایمن)",
    lactMedNote: "داروی انتخابی CCB در مادران شیرده."
  },
  {
    id: "bf-peg",
    nameFa: "پلی‌اتیلن گلیکول (پیدرولاکس)",
    nameEn: "Polyethylene glycol",
    indication: "ملین و درمان یبوست",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (کاملاً ایمن)",
    lactMedNote: "جذب سیستمیک ندارد و وارد شیر نمی‌شود."
  },
  {
    id: "bf-senna",
    nameFa: "سنا (سینامید / سنالین)",
    nameEn: "Senna",
    indication: "ملین گیاهی",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "در مصرف با دوز معمول سازگار است."
  },
  {
    id: "bf-loperamide",
    nameFa: "لوپرامید (دوز معمول)",
    nameEn: "Loperamide",
    indication: "ضد اسهال",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت معمول",
    lactMedNote: "جذب گوارشی ناچیز مادری و ترشح بسیار کم در شیر."
  },

  // --- با احتیاط؛ پایش یا ارزیابی شرایط لازم است (Caution / Monitoring) ---
  {
    id: "bf-levetiracetam",
    nameFa: "لوتیراستام (Levetiracetam)",
    nameEn: "Levetiracetam",
    indication: "ضدتشنج و کنترل صرع",
    status: "caution",
    statusBadge: "با احتیاط؛ پایش خواب‌آلودگی نوزاد",
    lactMedNote: "در شیر ترشح می‌شود اما خط اول تشنج در زنان شیرده است. پایش خواب‌آلودگی، وزن‌گیری و تغذیه شیرخوار توصیه می‌شود."
  },
  {
    id: "bf-aspirin-high",
    nameFa: "آسپرین دوز بالا (ضد درد)",
    nameEn: "Aspirin (High-dose analgesic)",
    indication: "ضد درد و تب دوز بالا",
    status: "caution",
    statusBadge: "با احتیاط و پرهیز (خطر سندرم ری در دوز بالا)",
    lactMedNote: "دوزهای بالای ضد درد به علت خطر خونریزی و سندرم ری توصیه نمی‌شود؛ دوز پایین ۸۰mg مجاز است."
  },
  {
    id: "bf-naproxen",
    nameFa: "ناپروکسن",
    nameEn: "Naproxen",
    indication: "ضد درد و NSAID",
    status: "caution",
    statusBadge: "با احتیاط (نیمه‌عمر طولانی)",
    lactMedNote: "نیمه‌عمر طولانی دارد؛ ایبوپروفن بسیار ترجیح داده می‌شود."
  },
  {
    id: "bf-morphine",
    nameFa: "مورفین",
    nameEn: "Morphine",
    indication: "ضد درد اوپیوئیدی شدید",
    status: "caution",
    statusBadge: "با احتیاط؛ پایش خواب‌آلودگی و تنفس نوزاد",
    lactMedNote: "دوزهای منفرد کوتاه‌مدت مجاز است؛ پایش خواب‌آلودگی، ضعف مکیدن و دپرسیون تنفسی شیرخوار."
  },
  {
    id: "bf-hydromorphone",
    nameFa: "هیدرومورفون",
    nameEn: "Hydromorphone",
    indication: "ضد درد اوپیوئیدی",
    status: "caution",
    statusBadge: "با احتیاط؛ پایش تنفس نوزاد",
    lactMedNote: "پایش رخوت و تنفس نوزاد."
  },
  {
    id: "bf-oxycodone",
    nameFa: "اکسی‌کودون",
    nameEn: "Oxycodone",
    indication: "ضد درد اوپیوئیدی",
    status: "caution",
    statusBadge: "با احتیاط شدید؛ خطر رسوب در نوزاد",
    lactMedNote: "خطر سدیشن در نوزاد؛ در صورت امکان از مورفین استفاده شود."
  },
  {
    id: "bf-lorazepam",
    nameFa: "لورازپام",
    nameEn: "Lorazepam",
    indication: "بنزودیازپین و ضد اضطراب",
    status: "caution",
    statusBadge: "با احتیاط؛ بنزودیازپین انتخابی",
    lactMedNote: "بهترین بنزودیازپین در شیردهی به دلیل نداشتن متابولیت فعال، اما پایش سدیشن نوزاد لازم است."
  },
  {
    id: "bf-diazepam",
    nameFa: "دیازپام",
    nameEn: "Diazepam",
    indication: "ضدتشنج و آرام‌بخش",
    status: "caution",
    statusBadge: "با احتیاط (تجمع متابولیت در مصرف مکرر)",
    lactMedNote: "متابولیت‌های فعال با نیمه‌عمر طولانی می‌توانند در بدن نوزاد تجمع یابند."
  },
  {
    id: "bf-alprazolam",
    nameFa: "آلپرازولام (زاناکس)",
    nameEn: "Alprazolam",
    indication: "ضد اضطراب",
    status: "caution",
    statusBadge: "با احتیاط؛ پایش سدیشن",
    lactMedNote: "پایش خواب‌آلودگی شیرخوار."
  },
  {
    id: "bf-clonazepam",
    nameFa: "کلونازپام",
    nameEn: "Clonazepam",
    indication: "ضدتشنج و آرام‌بخش",
    status: "caution",
    statusBadge: "با احتیاط",
    lactMedNote: "پایش آپنه و شلی عضلانی در نوزاد."
  },
  {
    id: "bf-promethazine",
    nameFa: "پرومتازین",
    nameEn: "Promethazine",
    indication: "ضد حساسیت و خواب‌آور",
    status: "caution",
    statusBadge: "با احتیاط (خطر دپرسیون تنفسی)",
    lactMedNote: "پایش نوزاد از نظر خواب‌آلودگی و سرکوب تنفس."
  },
  {
    id: "bf-pseudoephedrine",
    nameFa: "سودوافدرین",
    nameEn: "Pseudoephedrine",
    indication: "ضداحتقان بینی",
    status: "caution",
    statusBadge: "با احتیاط (کاهش‌دهنده شیر مادری)",
    lactMedNote: "می‌تواند حجم شیر مادری را به طور چشمگیری کاهش دهد و در نوزاد بی‌قراری ایجاد کند."
  },
  {
    id: "bf-metoprolol",
    nameFa: "متوپرولول",
    nameEn: "Metoprolol",
    indication: "بتابلاکر فشار خون و آریتمی",
    status: "caution",
    statusBadge: "با احتیاط؛ پایش ضربان قلب نوزاد",
    lactMedNote: "ترشح کم در شیر؛ پایش ضربان قلب و افت قند نوزاد."
  },
  {
    id: "bf-propranolol",
    nameFa: "پروپرانولول",
    nameEn: "Propranolol",
    indication: "بتابلاکر",
    status: "caution",
    statusBadge: "با احتیاط؛ پایش برادیکاردی نوزاد",
    lactMedNote: "اتصال پروتئینی بالا؛ با پایش نوزاد قابل استفاده است."
  },
  {
    id: "bf-atenolol",
    nameFa: "آتنولول",
    nameEn: "Atenolol",
    indication: "بتابلاکر فشار خون",
    status: "caution",
    statusBadge: "با احتیاط و پرهیز (تجمع بالا در شیر)",
    lactMedNote: "در شیر مادر تغلیظ می‌شود؛ لابتالول یا متوپرولول به جای آن ترجیح داده می‌شوند."
  },
  {
    id: "bf-enalapril",
    nameFa: "انالاپریل",
    nameEn: "Enalapril",
    indication: "مهارکننده ACE فشار خون",
    status: "caution",
    statusBadge: "با احتیاط؛ ACE-I انتخابی در شیردهی",
    lactMedNote: "برخلاف دوران بارداری، انالاپریل در شیردهی با دوز معمول سازگار است (پایش فشار خون نوزاد نارس)."
  },
  {
    id: "bf-captopril",
    nameFa: "کاپتوپریل",
    nameEn: "Captopril",
    indication: "فشار خون",
    status: "caution",
    statusBadge: "با احتیاط؛ ترشح بسیار اندک در شیر",
    lactMedNote: "در دوران شیردهی مقدار بسیار ناچیزی وارد شیر می‌شود."
  },
  {
    id: "bf-furosemide",
    nameFa: "فوروزماید (لازیکس)",
    nameEn: "Furosemide",
    indication: "دیورتیک",
    status: "caution",
    statusBadge: "با احتیاط (ممکن است شیر را کم کند)",
    lactMedNote: "دوزهای بالای دیورتیک می‌تواند حجم ترشح شیر مادر را کاهش دهد."
  },
  {
    id: "bf-spironolactone",
    nameFa: "اسپیرونولاکتون",
    nameEn: "Spironolactone",
    indication: "دیورتیک نگهدارنده پتاسیم",
    status: "caution",
    statusBadge: "با احتیاط",
    lactMedNote: "ترشح کم در شیر."
  },
  {
    id: "bf-digoxin",
    nameFa: "دیگوکسین",
    nameEn: "Digoxin",
    indication: "نارسایی قلبی و آریتمی",
    status: "caution",
    statusBadge: "با احتیاط؛ پایش سطح دارویی",
    lactMedNote: "غلظت بسیار کم در شیر."
  },
  {
    id: "bf-verapamil",
    nameFa: "وراپامیل",
    nameEn: "Verapamil",
    indication: "کانال‌بلاکر کلسیمی",
    status: "caution",
    statusBadge: "با احتیاط",
    lactMedNote: "کمتر از ۰.۵ درصد دوز مادری در شیر ترشح می‌شود."
  },
  {
    id: "bf-diltiazem",
    nameFa: "دیلتیازم",
    nameEn: "Diltiazem",
    indication: "کانال‌بلاکر کلسیمی",
    status: "caution",
    statusBadge: "با احتیاط",
    lactMedNote: "پایش ضربان قلب نوزاد."
  },
  {
    id: "bf-adenosine",
    nameFa: "آدنوزین",
    nameEn: "Adenosine",
    indication: "اورژانس آریتمی SVT",
    status: "caution",
    statusBadge: "با احتیاط (نیمه‌عمر چند ثانیه‌ای)",
    lactMedNote: "نیمه‌عمر کمتر از ۱۰ ثانیه؛ عملاً وارد شیر نوزاد نمی‌شود."
  },
  {
    id: "bf-atropine",
    nameFa: "آتروپین",
    nameEn: "Atropine",
    indication: "آنتی‌کولینرژیک",
    status: "caution",
    statusBadge: "با احتیاط",
    lactMedNote: "ممکن است ترشح شیر را کم کند یا خشکی دهان در نوزاد بدهد."
  },
  {
    id: "bf-warfarin",
    nameFa: "وارفارین",
    nameEn: "Warfarin",
    indication: "ضدانعقاد خوراکی",
    status: "caution",
    statusBadge: "با احتیاط (برخلاف بارداری، در شیردهی سازگار است)",
    lactMedNote: "اتصال پروتئینی ۹۹٪ دارد و وارد شیر نمی‌شود. برخلاف بارداری، در شیردهی با پایش PT/INR مجاز است."
  },
  {
    id: "bf-clopidogrel",
    nameFa: "کلوپیدوگرل (پلاویکس)",
    nameEn: "Clopidogrel",
    indication: "ضدپلاکت",
    status: "caution",
    statusBadge: "با احتیاط",
    lactMedNote: "داده‌های انسانی محدود است؛ پایش کبودی و خونریزی در شیرخوار."
  },
  {
    id: "bf-phenytoin",
    nameFa: "فنی‌توئین",
    nameEn: "Phenytoin",
    indication: "ضدتشنج",
    status: "caution",
    statusBadge: "با احتیاط؛ پایش سطح دارویی و خواب‌آلودگی",
    lactMedNote: "ترشح کم در شیر؛ پایش خواب‌آلودگی و مکیدن شیرخوار."
  },
  {
    id: "bf-valproate",
    nameFa: "والپروات سدیم (دپاکین)",
    nameEn: "Sodium Valproate",
    indication: "ضدتشنج",
    status: "caution",
    statusBadge: "با احتیاط (برخلاف بارداری، در شیردهی معمولاً مجاز است)",
    lactMedNote: "کمتر از ۱۰ درصد دوز مادری در شیر ترشح می‌شود؛ پایش پلاکت و عملکرد کبد نوزاد."
  },
  {
    id: "bf-carbamazepine",
    nameFa: "کاربامازپین (تگرتول)",
    nameEn: "Carbamazepine",
    indication: "ضدتشنج",
    status: "caution",
    statusBadge: "با احتیاط؛ پایش کبدی نوزاد",
    lactMedNote: "سازگار با پایش خواب‌آلودگی، زردی و آنزیم‌های کبدی شیرخوار."
  },
  {
    id: "bf-haloperidol",
    nameFa: "هالوپریدول",
    nameEn: "Haloperidol",
    indication: "آنتی‌سایکوتیک",
    status: "caution",
    statusBadge: "با احتیاط؛ پایش عوارض اکستراپیرامیدال نوزاد",
    lactMedNote: "پایش خواب‌آلودگی و سفتی عضلانی نوزاد."
  },
  {
    id: "bf-olanzapine",
    nameFa: "اولانزاپین",
    nameEn: "Olanzapine",
    indication: "آنتی‌سایکوتیک آتیپیک",
    status: "caution",
    statusBadge: "با احتیاط؛ آنتی‌سایکوتیک انتخابی شیردهی",
    lactMedNote: "ترشح کم در شیر؛ داروی انتخابی روانپزشکی در شیردهی."
  },
  {
    id: "bf-fluconazole",
    nameFa: "فلوکونازول",
    nameEn: "Fluconazole",
    indication: "ضد قارچ",
    status: "caution",
    statusBadge: "با احتیاط؛ تک‌دوز ۱۵۰mg سازگار است",
    lactMedNote: "تک‌دوز ۱۵۰ میلی‌گرم برای کاندیدیاز واژینال کاملاً سازگار است؛ در دوزهای مکرر پایش نوزاد."
  },
  {
    id: "bf-metronidazole",
    nameFa: "مترونیدازول",
    nameEn: "Metronidazole",
    indication: "ضدانگل و آنتی‌بیوتیک بی‌هوازی",
    status: "caution",
    statusBadge: "با احتیاط (طعم تلخ شیر و بی‌میلی نوزاد)",
    lactMedNote: "در دوز تک ۲ گرم ترجیحاً وقفه ۱۲ تا ۲۴ ساعته در شیردهی رعایت شود."
  },
  {
    id: "bf-ciprofloxacin",
    nameFa: "سیپروفلوکساسین",
    nameEn: "Ciprofloxacin",
    indication: "فلوروکینولون",
    status: "caution",
    statusBadge: "با احتیاط؛ ترجیح بر داروهای جایگزین",
    lactMedNote: "در صورت مصرف، پایش اسهال نوزاد یا استفاده از داروهای جایگزین."
  },
  {
    id: "bf-doxycycline",
    nameFa: "داکسی‌سایکلین (دوره کوتاه)",
    nameEn: "Doxycycline (short course)",
    indication: "تتراسایکلین",
    status: "caution",
    statusBadge: "با احتیاط در دوره‌های کوتاه تا ۱۴ روز",
    lactMedNote: "دوره‌های کوتاه کمتر از ۲ هفته به کلسیم شیر متصل شده و جذب نوزاد کم است."
  },
  {
    id: "bf-cotrimoxazole",
    nameFa: "کوتریموکسازول (تری‌متوپریم-سولفامتوکسازول)",
    nameEn: "Trimethoprim-Sulfamethoxazole",
    indication: "آنتی‌بیوتیک",
    status: "caution",
    statusBadge: "با احتیاط (منع در نوزادان زیر ۲ ماه، زردی یا فاویسم)",
    lactMedNote: "در نوزادان سالم بالای ۲ ماه قابل مصرف است؛ در نوزاد نارس، زردی و فاویسم پرهیز شود."
  },
  {
    id: "bf-metformin",
    nameFa: "متفورمین",
    nameEn: "Metformin",
    indication: "کنترل دیابت و تنبلی تخمدان",
    status: "caution",
    statusBadge: "با احتیاط؛ داروی خوراکی انتخابی دیابت",
    lactMedNote: "ترشح کم در شیر بدون عارضه مستند بر قند خون نوزاد."
  },
  {
    id: "bf-sumatriptan",
    nameFa: "سوماتریپتان",
    nameEn: "Sumatriptan",
    indication: "میگرن حاد",
    status: "caution",
    statusBadge: "با احتیاط؛ داروی انتخابی میگرن در شیردهی",
    lactMedNote: "انتقال بسیار کم در شیر مادری."
  },

  // --- معمولاً اجتناب شود یا جایگزین/مشاوره تخصصی لازم است (Contraindicated / Avoid) ---
  {
    id: "bf-codeine",
    nameFa: "کدئین",
    nameEn: "Codeine",
    indication: "ضد درد و ضد سرفه",
    status: "contraindicated",
    statusBadge: "ممنوع / اجتناب گردد (خطر مرگ و آپنه در متابولایزرهای سریع)",
    lactMedNote: "در مادران متابولیزه‌کننده فوق سریع به مورفین بالا تبدیل شده و مرگ نوزاد گزارش شده است."
  },
  {
    id: "bf-tramadol",
    nameFa: "ترامادول",
    nameEn: "Tramadol",
    indication: "مسکن اوپیوئیدی سنتتیک",
    status: "contraindicated",
    statusBadge: "ممنوع / اجتناب گردد (خطر دپرسیون شدید تنفسی نوزاد)",
    lactMedNote: "خطر سرکوب تنفسی نوزاد مشابه کدئین؛ توسط FDA در شیردهی منع شده است."
  },
  {
    id: "bf-ergotamine",
    nameFa: "ارگوتامین و ترکیبات ارگوت",
    nameEn: "Ergotamine",
    indication: "میگرن",
    status: "contraindicated",
    statusBadge: "اکیداً ممنوع (ارگوتیسم نوزادی و مهار ترشح شیر)",
    lactMedNote: "منجر به ارگوتیسم، استفراغ، اسهال و مهار تولید شیر مادر می‌شود."
  },
  {
    id: "bf-bromocriptine",
    nameFa: "بروموکریپتین و کابرگولین",
    nameEn: "Bromocriptine & Cabergoline",
    indication: "مهار پرولاکتین",
    status: "contraindicated",
    statusBadge: "اکیداً ممنوع (قطع کامل ترشح شیر)",
    lactMedNote: "ترشح شیر مادر را سرکوب و کاملاً متوقف می‌کند."
  },
  {
    id: "bf-chloramphenicol",
    nameFa: "کلرامفنیکل سیستمیک",
    nameEn: "Chloramphenicol (systemic)",
    indication: "آنتی‌بیوتیک سیستمیک",
    status: "contraindicated",
    statusBadge: "ممنوع (خطر سرکوب مغز استخوان و آپلازی)",
    lactMedNote: "خطر سمیت مغز استخوان نوزاد."
  },
  {
    id: "bf-doxorubicin",
    nameFa: "دوکسوروبیسین و آنتی‌نئوپلاستیک‌ها",
    nameEn: "Doxorubicin & Chemotherapy",
    indication: "شیمی‌درمانی سرطان",
    status: "contraindicated",
    statusBadge: "اکیداً ممنوع (سمیت ژنتیکی و سرکوب ایمنی)",
    lactMedNote: "سرکوب شدید خونسازی و ایمنی شیرخوار."
  },
  {
    id: "bf-cyclophosphamide",
    nameFa: "سیکلوفسفامید",
    nameEn: "Cyclophosphamide",
    indication: "شیمی‌درمانی و سرکوب ایمنی",
    status: "contraindicated",
    statusBadge: "اکیداً ممنوع",
    lactMedNote: "سمیت سلولی و سلول‌های تکثیر شونده نوزاد."
  },
  {
    id: "bf-methotrexate",
    nameFa: "متوترکسات (دوز بالا و سیستمیک)",
    nameEn: "Methotrexate",
    indication: "ضد روماتیسم و سرطان",
    status: "contraindicated",
    statusBadge: "اکیداً ممنوع",
    lactMedNote: "در بافت‌های نوزاد تجمع یافته و سیستم ایمنی را مختل می‌کند."
  },
  {
    id: "bf-radioiodine",
    nameFa: "ید رادیواکتیو (I-131)",
    nameEn: "Radioactive iodine (I-131)",
    indication: "پزشکی هسته‌ای و تیروئید",
    status: "contraindicated",
    statusBadge: "مطلقاً ممنوع (پرتوزایی پایدار در شیر)",
    lactMedNote: "تخریب دائمی تیروئید نوزاد؛ قطع کامل شیردهی الزامی است."
  },
  {
    id: "bf-amiodarone",
    nameFa: "آمیودارون (مصرف مزمن)",
    nameEn: "Amiodarone",
    indication: "ضدآریتمی قلبی",
    status: "contraindicated",
    statusBadge: "ممنوع / اجتناب گردد (نیمه‌عمر چندماهه و حاوی ید)",
    lactMedNote: "حاوی مقادیر بالای ید با نیمه‌عمر تا ۱۰۰ روز؛ ایجاد گواتر و هیپوتیروئیدی در شیرخوار."
  },
  {
    id: "bf-lithium",
    nameFa: "لیتیوم",
    nameEn: "Lithium",
    indication: "اختلال دوقطبی",
    status: "contraindicated",
    statusBadge: "ممنوع در اکثر مراجع (مگر با مانیتورینگ شدید)",
    lactMedNote: "غلظت بالا در شیر و خطر سمیت کلیوی و هیپوتونی نوزاد."
  },

  // --- داروهای گوارشی، بستری و بیمارستانی در شیردهی ---
  {
    id: "bf-pantoprazole",
    nameFa: "پنتوپرازول (پانتوپرازول)",
    nameEn: "Pantoprazole",
    indication: "ریفلاکس اسید، سوزش سر دل، زخم معده و ازوفاژیت",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (ایمن در شیردهی)",
    lactMedNote: "پنتوپرازول ترشح بسیار ناچیزی در شیر مادر دارد (دوز نسبی نوزاد کمتر از ۰.۲٪). علاوه بر این، به اسید معده شیرخوار حساس است و تخریب می‌شود. در طول شیردهی کاملاً سازگار و ایمن در نظر گرفته می‌شود."
  },
  {
    id: "bf-omeprazole",
    nameFa: "امپرازول",
    nameEn: "Omeprazole",
    indication: "مهارکننده اسید معده (PPI)",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول",
    lactMedNote: "ترشح کم در شیر؛ بدون عارضه جانبی گزارش‌شده بر شیرخوار."
  },
  {
    id: "bf-ondansetron",
    nameFa: "اندانسترون (دمیترون)",
    nameEn: "Ondansetron",
    indication: "ضد تهوع و استفراغ پس از جراحی یا سزارین",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول",
    lactMedNote: "ترشح در شیر بسیار اندک است؛ در دوزهای معمول بیمارستانی پس از زایمان ایمن است."
  },
  {
    id: "bf-metoclopramide",
    nameFa: "متوکلوپرامید (پلاسیل)",
    nameEn: "Metoclopramide",
    indication: "ضدتهوع و محرک ترشح شیر (Galactagogue)",
    status: "compatible",
    statusBadge: "سازگار در دوره‌های کوتاه‌مدت",
    lactMedNote: "با افزایش پرولاکتین موجب افزایش شیر می‌شود؛ مصرف کوتاه‌مدت (کمتر از ۲ تا ۳ هفته) ایمن است."
  },
  {
    id: "bf-cefixime",
    nameFa: "سفکسیم (سفیکسیم)",
    nameEn: "Cefixime",
    indication: "عفونت‌های ادراری و تنفسی",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (ایمن)",
    lactMedNote: "ترشح در شیر ناچیز است؛ ممکن است تغییرات خفیف و گذرای گوارشی در شیرخوار ایجاد کند."
  },
  {
    id: "bf-cefazolin",
    nameFa: "سفازولین",
    nameEn: "Cefazolin",
    indication: "پروفیلاکسی سزارین و جراحی",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (ایمن)",
    lactMedNote: "غلظت بسیار ناچیز در شیر مادر؛ داروی انتخابی اطراف زایمان."
  },
  {
    id: "bf-ceftriaxone",
    nameFa: "سفتریاکسون",
    nameEn: "Ceftriaxone",
    indication: "عفونت‌های شدید باکتریایی و سپسیس",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول",
    lactMedNote: "مقدار منتقل‌شده به شیر اندک بوده و جذب خوراکی نوزاد کم است."
  },
  {
    id: "bf-ampicillin",
    nameFa: "آمپی‌سیلین",
    nameEn: "Ampicillin",
    indication: "عفونت‌های باکتریایی و سپسیس نوزادی/مادری",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (ایمن)",
    lactMedNote: "یکی از ایمن‌ترین آنتی‌بیوتیک‌ها در دوران شیردهی است."
  },
  {
    id: "bf-vancomycin",
    nameFa: "ونکومایسین",
    nameEn: "Vancomycin",
    indication: "عفونت‌های استافیلوکوکی مقاوم و سپسیس",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول",
    lactMedNote: "به دلیل وزن مولکولی بالا و عدم جذب گوارشی در نوزاد، ترشح خونی ناچیز آن خطری ندارد."
  },
  {
    id: "bf-meropenem",
    nameFa: "مروپنم",
    nameEn: "Meropenem",
    indication: "عفونت‌های شدید و مقاوم بیمارستانی",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول",
    lactMedNote: "ترشح کم در شیر مادر؛ جذب خوراکی توسط نوزاد بسیار ناچیز است."
  },
  {
    id: "bf-enoxaparin",
    nameFa: "انوکساپارین (سلکسان)",
    nameEn: "Enoxaparin",
    indication: "پیشگیری و درمان ترومبوز وریدی (DVT)",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (ایمن‌ترین ضدانعقاد)",
    lactMedNote: "وزن مولکولی بالا مانع عبور به شیر شده و در دستگاه گوارش نوزاد نیز غیرفعال می‌شود."
  },
  {
    id: "bf-heparin",
    nameFa: "هپارین استاندارد (UFH)",
    nameEn: "Heparin",
    indication: "ضدانعقاد بیمارستانی",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول",
    lactMedNote: "به دلیل بار الکتریکی منفی و اندازه بزرگ وارد شیر نمی‌شود و جذب خوراکی ندارد."
  },
  {
    id: "bf-levetiracetam",
    nameFa: "لوتیراستام (کپرا)",
    nameEn: "Levetiracetam",
    indication: "کنترل صرع و تشنج",
    status: "caution",
    statusBadge: "سازگار با پایش شیرخوار (پرهیز از خواب‌آلودگی)",
    lactMedNote: "در شیر ترشح می‌شود؛ مادر می‌تواند شیردهی را ادامه دهد ولی پایش خواب‌آلودگی و وزن‌گیری نوزاد توصیه می‌شود."
  },
  {
    id: "bf-magnesium-sulfate",
    nameFa: "سولفات منیزیم",
    nameEn: "Magnesium Sulfate",
    indication: "کنترل تشنج پره‌اکلامپسی",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول",
    lactMedNote: "غلظت شیر مادر تغییر چندانی نمی‌کند و شیردهی بلامانع است."
  },
  {
    id: "bf-oxytocin",
    nameFa: "اکسی‌توسین (سنتوسینون)",
    nameEn: "Oxytocin",
    indication: "تسکین آتونی رحم و تحریک خروج شیر",
    status: "compatible",
    statusBadge: "سازگار در مصرف معمول (هورمون طبیعی خروج شیر)",
    lactMedNote: "هورمون طبیعی فیزیولوژیک جهت رفلکس خروج شیر بوده و در نوزاد تجزیه می‌شود."
  },
  {
    id: "bf-tranexamic-acid",
    nameFa: "ترانگزامیک اسید",
    nameEn: "Tranexamic Acid",
    indication: "کنترل خونریزی پس از زایمان (PPH)",
    status: "compatible",
    statusBadge: "سازگار در مصرف کوتاه‌مدت",
    lactMedNote: "غلظت آن در شیر کمتر از ۱٪ خون مادر است و عارضه‌ای در شیرخوار ندارد."
  }
];
