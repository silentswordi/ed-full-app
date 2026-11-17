import React, { useState } from 'react';
import { CONTRAINDICATED_BREASTFEEDING_DRUGS, CAUTION_BREASTFEEDING_DRUGS, BreastfeedingDrug } from '../data/breastfeedingData';
import { ShieldAlert, AlertTriangle, Search, XCircle } from 'lucide-react';
import { matchesSmartSearch } from '../../../utils/smartSearch';

export const BreastfeedingView: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'contraindicated' | 'caution'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterList = (list: BreastfeedingDrug[]) => {
    return list.filter((item) =>
      matchesSmartSearch(searchQuery, [item.nameEn, item.nameFa, item.reasonFa])
    );
  };

  const filteredContra = filterList(CONTRAINDICATED_BREASTFEEDING_DRUGS);
  const filteredCaution = filterList(CAUTION_BREASTFEEDING_DRUGS);

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی داروی شیردهی (آمفتامین، الکل، لیتیوم، آمیودارون...)"
            className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3" />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl shrink-0">
          <button
            onClick={() => setFilterType('all')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            همه
          </button>
          <button
            onClick={() => setFilterType('contraindicated')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              filterType === 'contraindicated'
                ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            اکیداً ممنوع ({CONTRAINDICATED_BREASTFEEDING_DRUGS.length})
          </button>
          <button
            onClick={() => setFilterType('caution')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              filterType === 'caution'
                ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            با احتیاط ({CAUTION_BREASTFEEDING_DRUGS.length})
          </button>
        </div>
      </div>

      {/* Contraindicated Section */}
      {(filterType === 'all' || filterType === 'contraindicated') && filteredContra.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h3 className="font-bold text-sm">داروهای کاملاً ممنوع در دوران شیردهی (CONTRAINDICATED)</h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                تجویز این داروها با شیردهی مغایرت مطلق داشته و شیردهی باید قطع گردد یا داروی بی‌خطر جایگزین شود.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredContra.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-rose-200/80 dark:border-rose-900/60 shadow-xs hover:border-rose-400 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.nameFa}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                    ممنوع
                  </span>
                </div>
                <div className="text-xs font-sans font-semibold text-rose-600 dark:text-rose-400" dir="ltr">
                  {item.nameEn}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                  {item.reasonFa}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Caution Section */}
      {(filterType === 'all' || filterType === 'caution') && filteredCaution.length > 0 && (
        <div className="space-y-3 pt-3">
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h3 className="font-bold text-sm">داروهای نیازمند احتیاط یا پرهیز در شیردهی (AVOID OR GIVE WITH CAUTION)</h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                در صورت نیاز بالینی شدید، با پایش دقیق علائم شیرخوار یا تنظیم زمان مصرف پس از شیردهی تجویز شوند.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredCaution.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 shadow-xs hover:border-amber-400 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.nameFa}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                    با احتیاط
                  </span>
                </div>
                <div className="text-xs font-sans font-semibold text-amber-600 dark:text-amber-400" dir="ltr">
                  {item.nameEn}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                  {item.reasonFa}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
