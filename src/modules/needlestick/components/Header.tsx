import React from 'react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <span className="text-base font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0">
          راهنمای نیدل استیک
        </span>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg bg-sky-800 dark:bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-900 dark:hover:bg-sky-600 transition-colors whitespace-nowrap shrink-0"
          >
            شروع مجدد
          </button>
        </div>
      </div>
    </header>
  );
};
