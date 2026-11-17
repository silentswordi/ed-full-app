export type BurnAgeGroup = 'adult' | 'pediatric';

export type BurnDepthId =
  | 'first'
  | 'second_superficial'
  | 'second_deep'
  | 'third'
  | 'fourth';

export type RegionCoverage = 0 | 0.25 | 0.5 | 1;

export interface BodyRegionDefinition {
  id:
    | 'head'
    | 'anterior_trunk'
    | 'posterior_trunk'
    | 'right_arm'
    | 'left_arm'
    | 'right_leg'
    | 'left_leg'
    | 'perineum';
  labelFa: string;
  adultPct: number;
  pediatricPct: number;
  isFunctionalArea?: boolean;
}

export const BODY_REGIONS: BodyRegionDefinition[] = [
  { id: 'head', labelFa: 'سر و گردن', adultPct: 9, pediatricPct: 18, isFunctionalArea: true },
  { id: 'anterior_trunk', labelFa: 'تنه قدامی (سینه و شکم)', adultPct: 18, pediatricPct: 18 },
  { id: 'posterior_trunk', labelFa: 'تنه خلفی (پشت و باسن)', adultPct: 18, pediatricPct: 18 },
  { id: 'right_arm', labelFa: 'اندام فوقانی راست', adultPct: 9, pediatricPct: 9, isFunctionalArea: true },
  { id: 'left_arm', labelFa: 'اندام فوقانی چپ', adultPct: 9, pediatricPct: 9, isFunctionalArea: true },
  { id: 'right_leg', labelFa: 'اندام تحتانی راست', adultPct: 18, pediatricPct: 13.5, isFunctionalArea: true },
  { id: 'left_leg', labelFa: 'اندام تحتانی چپ', adultPct: 18, pediatricPct: 13.5, isFunctionalArea: true },
  { id: 'perineum', labelFa: 'ناحیه تناسلی و پرینه', adultPct: 1, pediatricPct: 1, isFunctionalArea: true },
];

export interface BurnDepthGuideline {
  id: BurnDepthId;
  shortTitleFa: string;
  titleFa: string;
  subtitleEn: string;
  layerFa: string;
  appearance: string;
  sensation: string;
  blanching: string;
  healing: string;
  countsInTbsa: boolean;
}

export const BURN_DEPTH_GUIDELINES: BurnDepthGuideline[] = [
  {
    id: 'first',
    shortTitleFa: 'درجه ۱',
    titleFa: 'درجه ۱ (سطحی)',
    subtitleEn: 'Superficial (Epidermal)',
    layerFa: 'فقط اپیدرم',
    appearance: 'قرمز (اریتم)، خشک، بدون تاول (مشابه آفتاب‌سوختگی)',
    sensation: 'دردناک و حساس به لمس',
    blanching: 'سفید شدن سریع با فشار',
    healing: '۳ تا ۶ روز بدون اسکار',
    countsInTbsa: false,
  },
  {
    id: 'second_superficial',
    shortTitleFa: 'درجه ۲ سطحی',
    titleFa: 'درجه ۲ سطحی',
    subtitleEn: 'Superficial Partial-Thickness',
    layerFa: 'اپیدرم + درم پاپیلاری سطحی',
    appearance: 'صورتی/قرمز مرطوب، تاول‌های واضح و پر از مایع',
    sensation: 'شدیداً دردناک به لمس و هوا',
    blanching: 'سفید شدن سریع با فشار',
    healing: '۷ تا ۲۱ روز (معمولاً بدون اسکار)',
    countsInTbsa: true,
  },
  {
    id: 'second_deep',
    shortTitleFa: 'درجه ۲ عمقی',
    titleFa: 'درجه ۲ عمقی',
    subtitleEn: 'Deep Partial-Thickness',
    layerFa: 'اپیدرم + درم رتیکولار عمقی',
    appearance: 'لکه‌دار سفید و قرمز (مومی‌شکل)، تاول‌های پاره‌شده',
    sensation: 'کاهش درد به سوزن (فقط فشار عمیق)',
    blanching: 'کند یا غایب با فشار',
    healing: 'بیش از ۲۱ روز؛ اغلب نیازمند گرافت',
    countsInTbsa: true,
  },
  {
    id: 'third',
    shortTitleFa: 'درجه ۳',
    titleFa: 'درجه ۳ (تمام ضخامت)',
    subtitleEn: 'Full-Thickness',
    layerFa: 'تمام ضخامت اپیدرم و درم تا چربی زیرجلد',
    appearance: 'سفید گچی، قهوه‌ای چرمی، خاکستری یا سیاه؛ خشک و سفت',
    sensation: 'بی‌حس و بدون درد به سوزن و لمس',
    blanching: 'سفید نمی‌شود (عدم پرشدگی مویرگی)',
    healing: 'ترمیم خودبه‌خودی ندارد؛ نیازمند گرافت پوستی',
    countsInTbsa: true,
  },
  {
    id: 'fourth',
    shortTitleFa: 'درجه ۴',
    titleFa: 'درجه ۴ (بافت عمقی)',
    subtitleEn: 'Deep Tissue Involvement',
    layerFa: 'فاسیا، عضله، تاندون یا استخوان',
    appearance: 'سیاه و زغالی با نمایان شدن عضله/استخوان',
    sensation: 'کاملاً بی‌حس در مرکز',
    blanching: 'فاقد خون‌رسانی موضعی',
    healing: 'نیازمند جراحی اورژانسی یا بازسازی',
    countsInTbsa: true,
  },
];

const DEPTH_RANK: Record<BurnDepthId, number> = {
  first: 1,
  second_superficial: 2,
  second_deep: 3,
  third: 4,
  fourth: 5,
};

export interface RegionAssessment {
  coverage: RegionCoverage;
  depth: BurnDepthId;
}

export interface AbaReferralCriterion {
  id: string;
  labelFa: string;
  triggered: boolean;
}

export interface BurnEvaluationResult {
  tbsa: number;
  countedTbsa: number;
  hasAnyBurn: boolean;
  isFirstDegreeOnly: boolean;
  maxDepth: BurnDepthId | null;
  needsFluidResuscitation: boolean;
  parklandTotalMl: number | null;
  parklandFirst8hRate: number | null;
  parklandNext16hRate: number | null;
  targetUrineOutput: string;
  referralTriggered: boolean;
  referralCriteria: AbaReferralCriterion[];
  treatmentSteps: string[];
  woundCareSteps: string[];
  specialAlerts: string[];
}

export interface BurnAssessmentInput {
  ageGroup: BurnAgeGroup;
  regions: Record<BodyRegionDefinition['id'], RegionAssessment>;
  weightKg: number | null;
  hasInhalationInjury: boolean;
  isCircumferential: boolean;
  hasSpecialAreasInvolved: boolean;
  hasMajorComorbidityOrTrauma: boolean;
}

export function evaluateBurnManagement(input: BurnAssessmentInput): BurnEvaluationResult {
  let rawTbsa = 0;
  let countedTbsa = 0;
  let hasFullThickness = false;
  let maxDepthRank = 0;
  let maxDepth: BurnDepthId | null = null;

  for (const region of BODY_REGIONS) {
    const state = input.regions[region.id];
    if (!state || state.coverage === 0) continue;

    const basePct = input.ageGroup === 'adult' ? region.adultPct : region.pediatricPct;
    const areaPct = basePct * state.coverage;
    rawTbsa += areaPct;

    if (state.depth !== 'first') {
      countedTbsa += areaPct;
    }
    if (state.depth === 'third' || state.depth === 'fourth') {
      hasFullThickness = true;
    }
    if (DEPTH_RANK[state.depth] > maxDepthRank) {
      maxDepthRank = DEPTH_RANK[state.depth];
      maxDepth = state.depth;
    }
  }

  rawTbsa = Math.min(100, Math.round(rawTbsa * 10) / 10);
  countedTbsa = Math.min(100, Math.round(countedTbsa * 10) / 10);

  const hasAnyBurn = rawTbsa > 0;
  const isFirstDegreeOnly = hasAnyBurn && countedTbsa === 0;

  // Calculate Parkland whenever countedTbsa > 0 (any burn deeper than 1st degree)
  const needsFluidResuscitation = countedTbsa > 0;
  const validWeight = input.weightKg !== null && input.weightKg > 0 ? input.weightKg : null;

  let parklandTotalMl: number | null = null;
  let parklandFirst8hRate: number | null = null;
  let parklandNext16hRate: number | null = null;

  if (validWeight && needsFluidResuscitation) {
    parklandTotalMl = Math.round(4 * validWeight * countedTbsa);
    const parklandHalf = Math.round(parklandTotalMl / 2);
    parklandFirst8hRate = Math.round(parklandHalf / 8);
    parklandNext16hRate = Math.round(parklandHalf / 16);
  }

  const targetUrineOutput =
    input.ageGroup === 'pediatric'
      ? '۱ mL/kg/hr (در کودکان کمتر از ۳۰ kg همزمان مایع نگهداری حاوی دکستروز D5-LR اضافه شود)'
      : '۱ mL/kg/hr (تنظیم دقیق سرعت سرم رینگر لاکتات بر اساس برون‌ده ادراری ساعتی)';

  const headBurnCounted =
    input.regions.head.coverage > 0 && input.regions.head.depth !== 'first';
  const perineumBurnCounted =
    input.regions.perineum.coverage > 0 && input.regions.perineum.depth !== 'first';

  const specialAreasTriggered =
    input.hasSpecialAreasInvolved || headBurnCounted || perineumBurnCounted;

  const referralCriteria: AbaReferralCriterion[] = [
    {
      id: 'tbsa_gt_10',
      labelFa: 'سوختگی ضخامت نسبی (درجه ۲ و بالاتر) بیش از ۱۰٪ سطح کل بدن (TBSA)',
      triggered: countedTbsa > 10,
    },
    {
      id: 'special_areas',
      labelFa: 'درگیری صورت، دست‌ها، پاها، ناحیه تناسلی/پرینه یا مفاصل اصلی',
      triggered: specialAreasTriggered,
    },
    {
      id: 'full_thickness',
      labelFa: 'هرگونه سوختگی تمام‌ضخامت (درجه ۳ یا ۴) در هر گروه سنی',
      triggered: hasFullThickness,
    },
    {
      id: 'inhalation',
      labelFa: 'آسیب استنشاقی راه هوایی یا مسمومیت با دود آتش‌سوزی',
      triggered: input.hasInhalationInjury,
    },
    {
      id: 'comorbid_peds_circumferential',
      labelFa:
        'سوختگی حلقوی، بیماری زمینه‌ای مهم، ترومای همزمان، یا کودک نیازمند مراقبت تخصصی',
      triggered:
        input.hasMajorComorbidityOrTrauma ||
        input.isCircumferential ||
        (input.ageGroup === 'pediatric' && countedTbsa >= 10),
    },
  ];

  const referralTriggered = referralCriteria.some((c) => c.triggered);

  const treatmentSteps: string[] = [];
  if (input.hasInhalationInjury) {
    treatmentSteps.push(
      'اولویت اول — راه هوایی: در صورت استریدور، خشونت صدا، دوده در حلق یا سوختگی موهای بینی، **انتوباسیون زودهنگام** (پیش از پیشرفت ادم حنجره) + اکسیژن ۱۰۰٪.'
    );
    treatmentSteps.push(
      'بررسی **کربوکسی‌هموگلوبین (CO)** و در آتش‌سوزی فضای بسته با لاکتات بالا شک به مسمومیت **سیانید** (هیدروکسوکوبالامین ۵g IV).'
    );
  } else {
    treatmentSteps.push(
      'ارزیابی اولیه ABCDE، اکسیژن‌درمانی در صورت نیاز و تعبیه رگ محیطی مناسب از پوست سالم.'
    );
  }

  if (needsFluidResuscitation) {
    treatmentSteps.push(
      'شروع مایع‌درمانی با **رینگر لاکتات (Lactated Ringer)** مطابق فرمول پارکلند (نیمی از حجم کل در ۸ ساعت اول از زمان سوختگی و نیمی در ۱۶ ساعت بعدی) و تنظیم ساعتی بر اساس برون‌ده ادراری (سوند فولی در سوختگی‌های وسیع).'
    );
    if (input.ageGroup === 'pediatric') {
      treatmentSteps.push(
        'در کودکان < ۲۰–۳۰ کیلوگرم، علاوه بر LR، سرم نگهداری حاوی دکستروز (D5W در 0.45NS یا D5LR) برای پیشگیری از هیپوگلیسمی تجویز شود.'
      );
    }
  } else {
    treatmentSteps.push(
      'سوختگی درجه ۱ نیاز به مایع‌درمانی فرمولی (Parkland) ندارد؛ هیدراتاسیون خوراکی و مسکن ساده کافی است.'
    );
  }

  if (input.isCircumferential) {
    treatmentSteps.push(
      '**اسکاروتومی اورژانسی**: در سوختگی درجه ۳ حلقوی اندام (علائم ایسکمی/فشار کمپارتمان) یا قفسه سینه (اختلال تهویه)، **اسکاروتومی طولی فوری** انجام شود.'
    );
  }

  treatmentSteps.push(
    'کنترل درد: در سوختگی متوسط/شدید از **مسکن وریدی تیتراسیون‌شده** (مثل فنتانیل یا مورفین IV) استفاده کنید و از تزریق عضلانی بپرهیزید.'
  );
  treatmentSteps.push(
    'بررسی وضعیت **کزاز (Td/Tdap)**: در صورت گذشت بیش از ۵ سال از آخرین دوز در زخم‌های عمیق، یادآور تزریق شود؛ **آنتی‌بیوتیک پروفیلاکتیک سیستمیک روتین نیاز نیست**.'
  );

  const woundCareSteps: string[] = [
    'سرد کردن ملایم با **آب خنک جاری (نه یخ)** به مدت ۱۵–۲۰ دقیقه در دقایق اولیه، سپس پوشاندن با ملحفه خشک و پیشگیری از هیپوترمی.',
    'شستشوی ملایم زخم با نرمال‌سالین و خارج کردن بافت‌های مرده شل و تاول‌های پاره‌شده.',
  ];

  if (isFirstDegreeOnly) {
    woundCareSteps.push(
      'در سوختگی درجه ۱: مرطوب‌کننده ساده/آلوئه‌ورا، **پماد زینک اکساید** یا وازلین استریل کافی است و پماد آنتی‌بیوتیک موضعی نیاز نیست.'
    );
  } else {
    woundCareSteps.push(
      '**ممنوعیت پماد نقره روی صورت:** روی **صورت و اطراف چشم هرگز از پماد نقره (سیلور سولفادیازین) استفاده نکنید**؛ برای صورت از پماد **زینک اکساید، باسیتراسین، موپیروسین، اریترومایسین چشمی یا وازلین استریل** استفاده شود.'
    );
    woundCareSteps.push(
      'سایر نواحی بدن (غیر از صورت): برای سوختگی درجه ۲ یا ۳ می‌توان از **سیلور سولفادیازین ۱٪ (پماد نقره)** (به‌جز در بارداری، نوزاد < ۲ ماه و کمبود G6PD) یا پماد **زینک اکساید / باسیتراسین / وازلین استریل** همراه با گاز نچسب استفاده کرد.'
    );
  }

  const specialAlerts: string[] = [];
  if (specialAreasTriggered) {
    specialAlerts.push(
      'در سوختگی صورت/چشم: معاینه فوری قرنیه با فلورسئین پیش از تورم پلک‌ها انجام شود و **اکیداً از پماد نقره (سیلور سولفادیازین) روی صورت استفاده نشود**.'
    );
  }
  if (isFirstDegreeOnly) {
    specialAlerts.push(
      'تمام نواحی انتخاب‌شده از نوع درجه ۱ هستند؛ بنابراین %TBSA مؤثر برای محاسبه مایع‌درمانی و معیار وسعت ABA برابر با ۰٪ است.'
    );
  }

  return {
    tbsa: rawTbsa,
    countedTbsa,
    hasAnyBurn,
    isFirstDegreeOnly,
    maxDepth,
    needsFluidResuscitation,
    parklandTotalMl,
    parklandFirst8hRate,
    parklandNext16hRate,
    targetUrineOutput,
    referralTriggered,
    referralCriteria,
    treatmentSteps,
    woundCareSteps,
    specialAlerts,
  };
}
