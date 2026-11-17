import React from 'react';
import { X, Award, BookOpen, Stethoscope, HeartHandshake } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              درباره مجموعه و منابع علمی
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900 space-y-2">
            <h4 className="font-bold text-teal-950 dark:text-teal-200 flex items-center gap-1.5 text-sm">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              کتابچه داروهای شایع در نوزادان و کودکان
            </h4>
            <div className="space-y-1 text-slate-700 dark:text-slate-300">
              <p><strong>تدوین:</strong> دکتر رسول کرمانی (متخصص بیماری‌های کودکان و نوزادان، استادیار دانشگاه علوم پزشکی اصفهان)</p>
              <p><strong>همکار:</strong> دکتر المیرا کلانتری</p>
              <p className="text-slate-500 text-xs">ایمیل مؤلف: rasoolkermani@yahoo.com</p>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-indigo-500" />
              تقدیر از اساتید گروه اطفال دانشگاه علوم پزشکی اصفهان:
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              خانم‌ها: دکتر پورمقدس، دکتر فاموری
              <br />
              آقایان: دکتر مصطفوی، دکتر نصیری، دکتر رئیسی، دکتر یوسفیان، دکتر احمدی، دکتر آرمانیان، دکتر قضاوی
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-500" />
              منابع بالینی مورد استفاده (References):
            </h5>
            <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1" dir="ltr">
              <li>Nelson Textbook of Pediatrics 2015</li>
              <li>Red Book: 2012 Report of the Committee on Infectious Diseases (AAP)</li>
              <li>The Harriet Lane Handbook 2015 (Johns Hopkins Hospital)</li>
              <li>Manual of Neonatal Care 2012 (Cloherty and Stark's)</li>
              <li>Fanaroff and Martin's Neonatal-Perinatal Medicine 2011</li>
              <li>MED SKILL Clinical Pregnancy & Lactation Pharmacology Guides</li>
            </ol>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 leading-normal border border-slate-200/60 dark:border-slate-800">
            <strong>سلب مسئولیت پزشکی:</strong> این نرم‌افزار جهت راهنمایی بالینی پزشکان، داروسازان و کادر درمان طراحی شده است و تجویز نهایی دارو باید با تکیه بر قضاوت بالینی پزشک معالج، وزن و شرایط فردی بیمار انجام پذیرد.
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
