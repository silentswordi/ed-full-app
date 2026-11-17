import React, { useState } from 'react';
import { NEONATAL_ANTIBIOTICS, NEONATAL_COMMON_DRUGS } from '../data/neonatalData';
import { Search, Sparkles, ShieldAlert, Pill, Table, ListFilter } from 'lucide-react';
import { matchesSmartSearch } from '../../../utils/smartSearch';

export const NeonatalView: React.FC = () => {
  const [subTab, setSubTab] = useState<'antibiotics' | 'common'>('antibiotics');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAntibiotics = NEONATAL_ANTIBIOTICS.filter((item) =>
    matchesSmartSearch(searchQuery, [item.name, item.route])
  );

  const filteredCommon = NEONATAL_COMMON_DRUGS.filter((item) =>
    matchesSmartSearch(searchQuery, [item.name, item.nameFa, item.indication])
  );

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl max-w-md mx-auto">
        <button
          onClick={() => setSubTab('antibiotics')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
            subTab === 'antibiotics'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          جدول دوزاژ آنتی‌بیوتیک در نوزادان
        </button>
        <button
          onClick={() => setSubTab('common')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all ${
            subTab === 'common'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          داروهای شایع نوزادان (NICU)
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={subTab === 'antibiotics' ? "جستجوی آنتی‌بیوتیک نوزادی (آمیکاسین، آمپی‌سیلین، ونکومایسین...)" : "جستجوی داروی شایع نوزادان (آدنوزین، کافئین، فنوباربیتال...)"}
          className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
        />
        <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3" />
      </div>

      {subTab === 'antibiotics' ? (
        <div className="space-y-3">
          <div className="p-3 bg-teal-50/70 dark:bg-teal-950/30 rounded-xl border border-teal-200/60 dark:border-teal-900 text-xs text-teal-950 dark:text-teal-200">
            <span className="font-bold">راهنمای جدول نوزادان:</span> دوزها بر اساس وزن تولد نوزاد (کمتر از ۱۲۰۰ گرم، ۱۲۰۰ تا ۲۰۰۰ گرم، و بالای ۲۰۰۰ گرم) و سن پس از تولد (روز ۰ تا ۷ و بالای ۷ روز) تفکیک گردیده‌اند. علامت (★) نشانه لزوم تعدیل دوز در نارسایی کلیه است.
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">آنتی‌بیوتیک</th>
                  <th className="p-3">روش تجویز</th>
                  <th className="p-3 text-center border-r border-slate-200 dark:border-slate-700">
                    وزن کمتر از ۱۲۰۰g
                    <span className="block text-[10px] font-normal text-slate-500">سن ۰ تا ۴ هفته</span>
                  </th>
                  <th className="p-3 text-center border-r border-slate-200 dark:border-slate-700" colSpan={2}>
                    وزن ۱۲۰۰ تا ۲۰۰۰g
                    <span className="block text-[10px] font-normal text-slate-500">۰ تا ۷ روز | بالای ۷ روز</span>
                  </th>
                  <th className="p-3 text-center border-r border-slate-200 dark:border-slate-700" colSpan={2}>
                    وزن بالای ۲۰۰۰g
                    <span className="block text-[10px] font-normal text-slate-500">۰ تا ۷ روز | بالای ۷ روز</span>
                  </th>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2"></th>
                  <th className="p-2"></th>
                  <th className="p-2 text-center border-r border-slate-200 dark:border-slate-700">۰-۴ هفته</th>
                  <th className="p-2 text-center border-r border-slate-200 dark:border-slate-700">۰-۷ روز</th>
                  <th className="p-2 text-center">بالای ۷ روز</th>
                  <th className="p-2 text-center border-r border-slate-200 dark:border-slate-700">۰-۷ روز</th>
                  <th className="p-2 text-center">بالای ۷ روز</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {filteredAntibiotics.map((ab, i) => (
                  <tr key={i} className="hover:bg-teal-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-sans font-bold text-slate-900 dark:text-white flex items-center gap-1.5" dir="ltr">
                      {ab.hasRenalAdjustment && <span className="text-amber-500 font-bold" title="تنظیم کلیوی">★</span>}
                      <span>{ab.name}</span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400" dir="ltr">{ab.route}</td>
                    <td className="p-3 text-center border-r border-slate-100 dark:border-slate-800 text-teal-800 dark:text-teal-300" dir="ltr">{ab.wtUnder1200_0to4w}</td>
                    <td className="p-3 text-center border-r border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300" dir="ltr">{ab.wt1200to2000_0to7d}</td>
                    <td className="p-3 text-center text-slate-700 dark:text-slate-300" dir="ltr">{ab.wt1200to2000_gt7d}</td>
                    <td className="p-3 text-center border-r border-slate-100 dark:border-slate-800 text-emerald-800 dark:text-emerald-300" dir="ltr">{ab.wtOver2000_0to7d}</td>
                    <td className="p-3 text-center text-emerald-800 dark:text-emerald-300 font-bold" dir="ltr">{ab.wtOver2000_gt7d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
            {filteredAntibiotics.map((ab, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white" dir="ltr">
                    {ab.hasRenalAdjustment && <span className="text-amber-500">★</span>}
                    <span>{ab.name}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono" dir="ltr">
                    {ab.route}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-500 dark:text-slate-400">وزن &lt; ۱۲۰۰ گرم (۰-۴ هفته):</span>
                    <span className="font-mono font-bold text-teal-800 dark:text-teal-300" dir="ltr">{ab.wtUnder1200_0to4w}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-500 dark:text-slate-400">وزن ۱۲۰۰-۲۰۰۰ گرم (۰-۷ روز):</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300" dir="ltr">{ab.wt1200to2000_0to7d}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-500 dark:text-slate-400">وزن ۱۲۰۰-۲۰۰۰ گرم (&gt; ۷ روز):</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300" dir="ltr">{ab.wt1200to2000_gt7d}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30">
                    <span className="text-slate-500 dark:text-slate-400">وزن &gt; ۲۰۰۰ گرم (۰-۷ روز):</span>
                    <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300" dir="ltr">{ab.wtOver2000_0to7d}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30">
                    <span className="text-slate-500 dark:text-slate-400">وزن &gt; ۲۰۰۰ گرم (&gt; ۷ روز):</span>
                    <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300" dir="ltr">{ab.wtOver2000_gt7d}</span>
                  </div>
                </div>

                {ab.notice && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    {ab.notice}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Common Neonatal Drugs (NICU) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCommon.map((drug) => (
            <div key={drug.no} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400">#{drug.no}</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{drug.nameFa}</h4>
                    {drug.hasRenalAdjustment && <span className="text-amber-500 text-xs font-bold" title="تنظیم کلیوی">★</span>}
                  </div>
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 font-sans tracking-wide" dir="ltr">
                    {drug.name}
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {drug.indication}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="p-2.5 rounded-lg bg-teal-50/50 dark:bg-teal-950/30 text-teal-950 dark:text-teal-100">
                  <span className="font-bold block mb-1">دوز نوزادی:</span>
                  <p className="whitespace-pre-line font-medium leading-relaxed" dir="ltr">{drug.dosage}</p>
                </div>

                <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 dark:text-slate-400">فاصله تجویز:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200" dir="ltr">{drug.interval}</span>
                </div>

                {drug.notice && (
                  <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
                    <span className="font-bold">نکته بالینی: </span>
                    {drug.notice}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
