import { ToxinCategory, ToxinDefinition } from '../types';
import { ANALGESICS_CARDIO_TOXINS } from './analgesicsCardioToxins';
import { NEURO_ABUSE_TOXINS } from './neuroAbuseToxins';
import { ALCOHOLS_GAS_METALS_TOXINS } from './alcoholsGasMetalsToxins';
import { CAUSTICS_PLANTS_METABOLIC_TOXINS } from './causticsPlantsMetabolicToxins';
import { ADDITIONAL_TINTINALLI_TOXINS } from './additionalTintinalliToxins';
import { COMMON_DRUGS_TOXINS } from './commonDrugsToxins';

export const TINTINALLI_TOXINS: ToxinDefinition[] = [
  ...ANALGESICS_CARDIO_TOXINS,
  ...NEURO_ABUSE_TOXINS,
  ...ALCOHOLS_GAS_METALS_TOXINS,
  ...CAUSTICS_PLANTS_METABOLIC_TOXINS,
  ...ADDITIONAL_TINTINALLI_TOXINS,
  ...COMMON_DRUGS_TOXINS,
];

export const TOXIN_CATEGORIES: { id: 'all' | ToxinCategory; label: string }[] = [
  { id: 'all', label: 'همه' },
  { id: 'analgesics', label: 'مسکن‌ها و ضدالتهاب' },
  { id: 'cardiovascular', label: 'قلبی و عروقی' },
  { id: 'neuro_psych', label: 'مغز و اعصاب / روان‌پزشکی' },
  { id: 'drugs_of_abuse', label: 'مواد مخدر و سوءمصرف' },
  { id: 'alcohols_gases', label: 'الکل‌ها و گازهای سمی' },
  { id: 'pesticides_metals', label: 'آفت‌کش‌ها و فلزات سنگین' },
  { id: 'caustics_plants_metabolic', label: 'سوزاننده‌ها، گیاهان و متابولیک' },
];

export interface ToxidromeReferenceItem {
  id: string;
  nameFa: string;
  nameEn: string;
  vitals: string;
  pupils: string;
  skin: string;
  bowelUrinary: string;
  mentalStatus: string;
  commonAgents: string;
  keyManagement: string;
}

export const TOXIDROMES_GUIDE: ToxidromeReferenceItem[] = [
  {
    id: 'anticholinergic',
    nameFa: 'آنتی‌کولینرژیک',
    nameEn: 'Anticholinergic',
    vitals: 'تاکی‌کاردی، هیپرتانسیون خفیف، تب (هایپرترمی)',
    pupils: 'میدریاز (گشاد)',
    skin: 'گرم، خشک و برافروخته (عدم تعریق زیر بغل)',
    bowelUrinary: 'کاهش یا قطع صداهای روده، احتباس ادرار',
    mentalStatus: 'هذیان، توهم، آژیتاسیون (Mad as a hatter)',
    commonAgents: 'آتروپین، دیفن‌هیدرامین، TCAها، داتورا، پرومتازین، کلوزاپین',
    keyManagement: 'بنزودیازپین IV (خط اول)؛ فیزوستیگمین فقط در هذیان شدید با QRS باریک',
  },
  {
    id: 'cholinergic',
    nameFa: 'کولینرژیک (DUMBELS)',
    nameEn: 'Cholinergic',
    vitals: 'برادی‌کاردی (موسکارینی) یا تاکی‌کاردی (نیکوتینی)، تاکی‌پنه/آپنه',
    pupils: 'میوز (سنجاقی)',
    skin: 'تعریق شدید و خیس (Diaphoresis)',
    bowelUrinary: 'اسهال، استفراغ، ادرار مکرر، برونکوره و اشک/بزاق فراوان',
    mentalStatus: 'لتارژی، گیجی، تشنج، کما، فاسیکولاسیون عضلانی و ضعف',
    commonAgents: 'ارگانوفسفره‌ها، کاربامات‌ها، عوامل عصبی (سارین/VX)، برخی قارچ‌ها',
    keyManagement: 'آتروپین دوز بالا تا خشک شدن ریه + پرالیدوکسیم (2-PAM) + بنزودیازپین',
  },
  {
    id: 'opioid',
    nameFa: 'اپیوئیدی',
    nameEn: 'Opioid',
    vitals: 'برادیکاردی نسبی، برادپینه/آپنه، هیپوترمی، هیپوتانسیون خفیف',
    pupils: 'میوز (نقطه‌ای — استثنا: مپریدین/ترامادول ممکن است نرمال باشد)',
    skin: 'سرد یا نرمال، سیانوتیک در هیپوونتیلاسیون',
    bowelUrinary: 'کاهش صداهای روده',
    mentalStatus: 'دپرسیون CNS تا کما',
    commonAgents: 'مورفین، متادون، فنتانیل، هروئین، اکسی‌کدون، ترامادول، لوپرامید',
    keyManagement: 'حفظ راه هوایی و تهویه + تیتراسیون نالوکسان تا بازگشت تنفس خودبه‌خودی',
  },
  {
    id: 'sympathomimetic',
    nameFa: 'سمپاتومیمتیک',
    nameEn: 'Sympathomimetic',
    vitals: 'تاکی‌کاردی، هیپرتانسیون شدید، تاکی‌پنه، هیپرترمی',
    pupils: 'میدریاز (واکنش‌دار به نور)',
    skin: 'مرطوب و تعریق فراوان (برخلاف آنتی‌کولینرژیک!)',
    bowelUrinary: 'افزایش یا نرمال بودن صداهای روده',
    mentalStatus: 'آژیتاسیون، پارانویا، تشنج، سایکوز',
    commonAgents: 'کوکائین، مت‌آمفتامین، آمفتامین، کافئین، تئوفیلین، افدرین',
    keyManagement: 'بنزودیازپین IV (خط اول) + خنک‌سازی فعال؛ اجتناب از بتابلاکر تنها در کوکائین',
  },
  {
    id: 'serotonin',
    nameFa: 'سندرم سروتونین',
    nameEn: 'Serotonin Syndrome',
    vitals: 'تاکی‌کاردی، فشار خون متغیر، هیپرترمی شدید',
    pupils: 'میدریاز',
    skin: 'تعریق فراوان و گرگرفتگی',
    bowelUrinary: 'افزایش صداهای روده، اسهال',
    mentalStatus: 'آژیتاسیون + کلونوس القایی/خودبه‌خودی (به‌خصوص اندام تحتانی) و هیپررفلکسی',
    commonAgents: 'SSRI + ترامادول/مپریدین/لاینزولید/دکسترومتورفان/MAOI/MDMA',
    keyManagement: 'قطع عامل + بنزودیازپین IV + خنک‌سازی + سیپروهپتادین (12 mg اولیه)',
  },
  {
    id: 'sedative-hypnotic',
    nameFa: 'سداتیو-هیپنوتیک',
    nameEn: 'Sedative-Hypnotic',
    vitals: 'نرمال یا هیپوتانسیون و هیپوترمی؛ آپنه در مصرف هم‌زمان یا دوز بالا',
    pupils: 'متغیر (معمولاً نرمال؛ در باربیتورات/GHB ممکن است کوچک یا میدریاز هیپوکسیک)',
    skin: 'نرمال یا تاول‌های فشاری (باربیتورات)',
    bowelUrinary: 'نرمال یا کاهش‌یافته',
    mentalStatus: 'خواب‌آلودگی، آتاکسی، اختلال تکلم تا کمای عمیق',
    commonAgents: 'بنزودیازپین‌ها، اتانول، زولپیدم، باکلوفن، GHB، فنوباربیتال',
    keyManagement: 'حمایت راه هوایی/تنفس (اصلی)؛ فلومازنیل در مصرف مزمن یا مخلوط ممنوع است',
  },
  {
    id: 'sodium-channel',
    nameFa: 'بلوک کانال سدیم',
    nameEn: 'Sodium Channel Blockade',
    vitals: 'تاکی‌کاردی و سپس هیپوتانسیون شدید، افت سریع هوشیاری و تشنج',
    pupils: 'متغیر (معمولاً میدریاز در TCA/کوکائین/دیفن‌هیدرامین)',
    skin: 'متغیر بر اساس داروی زمینه',
    bowelUrinary: 'اغلب کاهش‌یافته در TCA/آنتی‌هیستامین',
    mentalStatus: 'کما و تشنج ناگهانی (QRS > 100 ms، موج R > 3 mm در aVR)',
    commonAgents: 'TCAها، کوکائین، دیفن‌هیدرامین، کاربامازپین، کلروکین، پروپرانولول، فلکاینید',
    keyManagement: 'بیکربنات سدیم IV بلوس 1–2 mEq/kg فوری با هدف باریک شدن QRS',
  },
];
