import React from 'react';
import { Baby, Heart, ShieldAlert, Sparkles, Calculator, BookOpen } from 'lucide-react';

export type MainTabType = 'pediatric' | 'pregnancy' | 'neonatal' | 'breastfeeding' | 'pearls' | 'calculator';

interface NavigationTabsProps {
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="space-y-2">
      {/* Primary Two Tabs matching screenshot layout */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 max-w-xl mx-auto shadow-xs">
        <button
          onClick={() => setActiveTab('pediatric')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm md:text-base transition-all duration-200 ${
            activeTab === 'pediatric'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm border border-slate-200/50 dark:border-slate-700 scale-[1.01]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Baby className="w-5 h-5 shrink-0" />
          <span>داروهای اطفال</span>
        </button>

        <button
          onClick={() => setActiveTab('pregnancy')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm md:text-base transition-all duration-200 ${
            activeTab === 'pregnancy'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200/50 dark:border-slate-700 scale-[1.01]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Heart className="w-5 h-5 shrink-0" />
          <span>داروها در بارداری</span>
        </button>
      </div>

      {/* Secondary Quick Reference Tabs */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 px-1 text-xs font-medium no-scrollbar">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all shrink-0 ${
            activeTab === 'calculator'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Calculator className="w-3.5 h-3.5 text-emerald-600" />
          <span>محاسبه‌گر دوز وزنی</span>
        </button>

        <button
          onClick={() => setActiveTab('neonatal')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all shrink-0 ${
            activeTab === 'neonatal'
              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700 font-bold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>داروهای نوزادان</span>
        </button>

        <button
          onClick={() => setActiveTab('breastfeeding')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all shrink-0 ${
            activeTab === 'breastfeeding'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 font-bold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
          <span>داروها در شیردهی</span>
        </button>

        <button
          onClick={() => setActiveTab('pearls')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all shrink-0 ${
            activeTab === 'pearls'
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>نکات کلیدی و هشدارها</span>
        </button>
      </div>
    </div>
  );
};
