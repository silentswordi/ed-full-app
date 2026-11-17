import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowUpLeft,
  BookOpen,
  Calculator,
  ClipboardCheck,
  Flame,
  FlaskConical,
  Pill,
  ShieldAlert,
} from 'lucide-react';

export type AppTabId =
  | 'overview'
  | 'pedvent'
  | 'zaribka'
  | 'pharmaped'
  | 'needlestick'
  | 'edscores'
  | 'toxicology'
  | 'burns'
  | 'ebooks';

interface OverviewHubProps {
  onSelectTab: (tab: AppTabId) => void;
}

const MODULES: {
  id: Exclude<AppTabId, 'overview'>;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  emblemClass: string;
  glowClass: string;
  borderHoverClass: string;
  arrowClass: string;
}[] = [
  {
    id: 'pharmaped',
    title: 'بارداری و اطفال',
    icon: Pill,
    iconClass: 'text-teal-600 dark:text-teal-300',
    emblemClass:
      'bg-gradient-to-br from-teal-50 to-teal-100/80 dark:from-teal-950/90 dark:to-teal-900/40 border-teal-200/80 dark:border-teal-800/70 shadow-teal-500/10',
    glowClass:
      'bg-[radial-gradient(circle_at_85%_15%,rgba(20,184,166,0.14),transparent_60%)] dark:bg-[radial-gradient(circle_at_85%_15%,rgba(45,212,191,0.12),transparent_60%)]',
    borderHoverClass: 'hover:border-teal-300 dark:hover:border-teal-700/80',
    arrowClass: 'text-teal-500 dark:text-teal-400',
  },
  {
    id: 'pedvent',
    title: 'خط کش برازلو',
    icon: Activity,
    iconClass: 'text-rose-600 dark:text-rose-300',
    emblemClass:
      'bg-gradient-to-br from-rose-50 to-rose-100/80 dark:from-rose-950/90 dark:to-rose-900/40 border-rose-200/80 dark:border-rose-800/70 shadow-rose-500/10',
    glowClass:
      'bg-[radial-gradient(circle_at_85%_15%,rgba(244,63,94,0.14),transparent_60%)] dark:bg-[radial-gradient(circle_at_85%_15%,rgba(251,113,133,0.12),transparent_60%)]',
    borderHoverClass: 'hover:border-rose-300 dark:hover:border-rose-700/80',
    arrowClass: 'text-rose-500 dark:text-rose-400',
  },
  {
    id: 'zaribka',
    title: 'ضریب کا',
    icon: Calculator,
    iconClass: 'text-emerald-600 dark:text-emerald-300',
    emblemClass:
      'bg-gradient-to-br from-emerald-50 to-emerald-100/80 dark:from-emerald-950/90 dark:to-emerald-900/40 border-emerald-200/80 dark:border-emerald-800/70 shadow-emerald-500/10',
    glowClass:
      'bg-[radial-gradient(circle_at_85%_15%,rgba(16,185,129,0.14),transparent_60%)] dark:bg-[radial-gradient(circle_at_85%_15%,rgba(52,211,153,0.12),transparent_60%)]',
    borderHoverClass: 'hover:border-emerald-300 dark:hover:border-emerald-700/80',
    arrowClass: 'text-emerald-500 dark:text-emerald-400',
  },
  {
    id: 'needlestick',
    title: 'نیدل استیک',
    icon: ShieldAlert,
    iconClass: 'text-sky-600 dark:text-sky-300',
    emblemClass:
      'bg-gradient-to-br from-sky-50 to-sky-100/80 dark:from-sky-950/90 dark:to-sky-900/40 border-sky-200/80 dark:border-sky-800/70 shadow-sky-500/10',
    glowClass:
      'bg-[radial-gradient(circle_at_85%_15%,rgba(14,165,233,0.14),transparent_60%)] dark:bg-[radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.12),transparent_60%)]',
    borderHoverClass: 'hover:border-sky-300 dark:hover:border-sky-700/80',
    arrowClass: 'text-sky-500 dark:text-sky-400',
  },
  {
    id: 'edscores',
    title: 'اسکورهای اورژانس',
    icon: ClipboardCheck,
    iconClass: 'text-amber-600 dark:text-amber-300',
    emblemClass:
      'bg-gradient-to-br from-amber-50 to-amber-100/80 dark:from-amber-950/90 dark:to-amber-900/40 border-amber-200/80 dark:border-amber-800/70 shadow-amber-500/10',
    glowClass:
      'bg-[radial-gradient(circle_at_85%_15%,rgba(245,158,11,0.15),transparent_60%)] dark:bg-[radial-gradient(circle_at_85%_15%,rgba(251,191,36,0.12),transparent_60%)]',
    borderHoverClass: 'hover:border-amber-300 dark:hover:border-amber-700/80',
    arrowClass: 'text-amber-500 dark:text-amber-400',
  },
  {
    id: 'toxicology',
    title: 'مسمومیت‌ها',
    icon: FlaskConical,
    iconClass: 'text-violet-600 dark:text-violet-300',
    emblemClass:
      'bg-gradient-to-br from-violet-50 to-violet-100/80 dark:from-violet-950/90 dark:to-violet-900/40 border-violet-200/80 dark:border-violet-800/70 shadow-violet-500/10',
    glowClass:
      'bg-[radial-gradient(circle_at_85%_15%,rgba(139,92,246,0.15),transparent_60%)] dark:bg-[radial-gradient(circle_at_85%_15%,rgba(167,139,250,0.12),transparent_60%)]',
    borderHoverClass: 'hover:border-violet-300 dark:hover:border-violet-700/80',
    arrowClass: 'text-violet-500 dark:text-violet-400',
  },
  {
    id: 'burns',
    title: 'سوختگی',
    icon: Flame,
    iconClass: 'text-orange-600 dark:text-orange-300',
    emblemClass:
      'bg-gradient-to-br from-orange-50 to-rose-100/80 dark:from-orange-950/90 dark:to-rose-900/40 border-orange-200/80 dark:border-orange-800/70 shadow-orange-500/10',
    glowClass:
      'bg-[radial-gradient(circle_at_85%_15%,rgba(249,115,22,0.16),transparent_60%)] dark:bg-[radial-gradient(circle_at_85%_15%,rgba(251,146,60,0.13),transparent_60%)]',
    borderHoverClass: 'hover:border-orange-300 dark:hover:border-orange-700/80',
    arrowClass: 'text-orange-500 dark:text-orange-400',
  },
  {
    id: 'ebooks',
    title: 'کتابخانه',
    icon: BookOpen,
    iconClass: 'text-indigo-600 dark:text-indigo-300',
    emblemClass:
      'bg-gradient-to-br from-indigo-50 to-indigo-100/80 dark:from-indigo-950/90 dark:to-indigo-900/40 border-indigo-200/80 dark:border-indigo-800/70 shadow-indigo-500/10',
    glowClass:
      'bg-[radial-gradient(circle_at_85%_15%,rgba(99,102,241,0.16),transparent_60%)] dark:bg-[radial-gradient(circle_at_85%_15%,rgba(129,140,248,0.13),transparent_60%)]',
    borderHoverClass: 'hover:border-indigo-300 dark:hover:border-indigo-700/80',
    arrowClass: 'text-indigo-500 dark:text-indigo-400',
  },
];

export const OverviewHub: React.FC<OverviewHubProps> = ({ onSelectTab }) => {
  return (
    <div
      dir="rtl"
      className="relative min-h-[calc(100vh-2.75rem)] overflow-hidden bg-[#f6f8fb] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors"
    >
      {/* Subtle Clinical Ambient Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_45%_at_50%_0%,rgba(14,165,233,0.08),transparent)] dark:bg-[radial-gradient(ellipse_75%_45%_at_50%_0%,rgba(56,189,248,0.09),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.16] [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] dark:[background-image:radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* Centered Symmetric Launchpad */}
      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <motion.button
                key={mod.id}
                type="button"
                onClick={() => onSelectTab(mod.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: idx * 0.045, ease: 'easeOut' }}
                className={`group relative overflow-hidden w-[calc(50%-0.5rem)] sm:w-[214px] aspect-square rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/90 dark:border-slate-800/90 ring-1 ring-inset ring-white/80 dark:ring-white/[0.04] p-5 sm:p-6 flex flex-col items-center justify-center gap-4 text-center shadow-[0_2px_10px_-3px_rgba(15,23,42,0.06),0_12px_28px_-12px_rgba(15,23,42,0.08)] dark:shadow-[0_12px_30px_-14px_rgba(0,0,0,0.75)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_-6px_rgba(15,23,42,0.12),0_18px_36px_-16px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_18px_38px_-14px_rgba(0,0,0,0.9)] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${mod.borderHoverClass}`}
              >
                {/* Soft Specialty Corner Glow */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 opacity-75 group-hover:opacity-100 transition-opacity duration-200 ${mod.glowClass}`}
                />

                {/* Subtle Directional Affordance on Hover */}
                <ArrowUpLeft
                  aria-hidden="true"
                  className={`absolute top-4 left-4 w-4 h-4 opacity-0 translate-x-1 translate-y-1 group-hover:opacity-80 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 ${mod.arrowClass}`}
                />

                {/* Tactile Icon Medallion */}
                <div
                  className={`relative z-10 w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-[22px] border shadow-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${mod.emblemClass} ${mod.iconClass}`}
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.1]" />
                </div>

                {/* Clean Module Title */}
                <span className="relative z-10 text-sm sm:text-[15px] font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                  {mod.title}
                </span>
              </motion.button>
            );
          })}
        </div>
      </main>

      {/* Understated Attribution Footer */}
      <footer className="relative z-10 py-5 text-center">
        <span
          dir="ltr"
          className="inline-block text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500"
        >
          made by Dr Ashkan Ahmadi
        </span>
      </footer>
    </div>
  );
};
