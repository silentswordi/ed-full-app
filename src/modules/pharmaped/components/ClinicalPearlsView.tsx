import React from 'react';
import { CLINICAL_PEARLS, ABBREVIATIONS } from '../data/clinicalPearls';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, BookOpen, Layers } from 'lucide-react';

export const ClinicalPearlsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro banner */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 shadow-xs flex items-start gap-3">
        <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h2 className="text-base font-bold text-amber-950 dark:text-amber-200">
            نکات کلیدی و هشدارهای طب اطفال و نوزادان
          </h2>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
            گردآوری شده بر اساس آموزه‌های بالینی اساتید گروه اطفال دانشگاه علوم پزشکی اصفهان و رفرنس‌های بین‌المللی هارریت لین و نلسون.
          </p>
        </div>
      </div>

      {/* High-priority age contraindications summary box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          محدودیت‌های دارویی بحرانی بر حسب رده سنی (Age-Specific Contraindications)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 space-y-1.5">
            <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              ممنوعیت‌های زیر ۲ سال (Under 2 Years):
            </span>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1 pr-2">
              <li><strong className="text-rose-900 dark:text-rose-200">دی‌سیکلومین:</strong> خطر ایست تنفسی، آپنه و تشنج</li>
              <li><strong className="text-rose-900 dark:text-rose-200">دیفن‌هیدرامین برای سرماخوردگی:</strong> خطر سرکوب تنفسی</li>
              <li><strong className="text-rose-900 dark:text-rose-200">پرومتازین:</strong> دپرسیون کشنده تنفسی</li>
              <li><strong className="text-rose-900 dark:text-rose-200">شیاف بیزاکودیل:</strong> تحریک شدید روده</li>
              <li><strong className="text-rose-900 dark:text-rose-200">شربت سرماخوردگی کودکان:</strong> عدم اثربخشی و عوارض جانبی</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-1.5">
            <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              ممنوعیت‌های زیر ۱ سال و نوزادی:
            </span>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1 pr-2">
              <li><strong className="text-amber-900 dark:text-amber-200">زیر ۱ سال:</strong> روغن پارافین خوراکی (خطر پنومونی لیپوئیدی)</li>
              <li><strong className="text-amber-900 dark:text-amber-200">زیر ۶ ماه:</strong> ایبوپروفن، ستیریزین، کتوتیفن، قطره کلرال هیدرات با احتیاط</li>
              <li><strong className="text-amber-900 dark:text-amber-200">زیر ۳ ماه:</strong> اندانسترون، موپیروسین موضعی</li>
              <li><strong className="text-amber-900 dark:text-amber-200">زیر ۲ ماه:</strong> کوتریموکسازول، سیلور سولفادیازین، زینک اکساید</li>
              <li><strong className="text-amber-900 dark:text-amber-200">زیر ۱ ماه:</strong> لاکتولوز، گریپ میکسچر</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Clinical rules cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-600" />
          قوانین طلایی تجویز در طب کودکان
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CLINICAL_PEARLS.map((rule) => (
            <div
              key={rule.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-teal-400 transition-all"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-full">
                  {rule.category}
                </span>
                {rule.severity === 'critical' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    بحرانی
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    نکته مهم
                  </span>
                )}
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {rule.title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Abbreviations Guide */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-500" />
          راهنمای اختصارات پزشکی (Abbreviations)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
          {ABBREVIATIONS.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-center space-y-1"
            >
              <span className="font-mono font-bold text-teal-700 dark:text-teal-400 block text-sm" dir="ltr">
                {item.abbr}
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200 block text-[11px]">
                {item.meaningFa}
              </span>
              <span className="text-[10px] text-slate-400 block" dir="ltr">
                {item.meaningEn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
