import React from 'react';
import { Moon, Sun, Bookmark, Info, Baby, HeartHandshake, Stethoscope } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (val: boolean) => void;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  favoritesCount,
  showFavoritesOnly,
  setShowFavoritesOnly,
  onOpenInfo
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side actions (matching the screenshot where dark mode toggle is on top-left) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"}
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all shadow-xs active:scale-95"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            title="نشان‌شده‌ها (علاقه‌مندی‌ها)"
            className={`p-2.5 rounded-full border transition-all active:scale-95 relative ${
              showFavoritesOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${showFavoritesOnly ? 'fill-white' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[11px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white dark:border-slate-900">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenInfo}
            title="درباره منابع و اساتید"
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Center / Right Title (in Persian RTL, title on the right/center) */}
        <div className="text-right flex items-center gap-2">
          <div>
            <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 inline-flex">
                <Stethoscope className="w-5 h-5" />
              </span>
              راهنمای دارویی اطفال و بارداری
            </h1>
            <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">
              مرجع بالینی تجویز دوز اطفال، نوزادان و ایمنی بارداری
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
