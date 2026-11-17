import React, { useState, useEffect, useMemo } from 'react';
import { PediatricDrugCard } from './components/PediatricDrugCard';
import { PregnancyDrugCard } from './components/PregnancyDrugCard';
import { BreastfeedingDrugCard } from './components/BreastfeedingDrugCard';
import { AddDrugModal } from './components/AddDrugModal';
import { EditDrugModal, EditingTarget } from './components/EditDrugModal';
import { PEDIATRIC_DRUGS, PediatricDrug } from './data/pediatricDrugs';
import { PREGNANCY_DRUGS, PregnancyDrugItem } from './data/pregnancyDrugs';
import { BREASTFEEDING_DRUGS, BreastfeedingDrugItem } from './data/breastfeedingGuideData';
import {
  ADDITIONAL_PEDIATRIC_DRUGS,
  ADDITIONAL_PREGNANCY_DRUGS,
  ADDITIONAL_BREASTFEEDING_DRUGS
} from './data/commonOtcDrugs';
import { Search, X, Plus, Trash2 } from 'lucide-react';
import { matchesSmartSearch } from '../../utils/smartSearch';

type DeleteTarget =
  | { type: 'pediatric'; drug: PediatricDrug }
  | { type: 'pregnancy'; drug: PregnancyDrugItem }
  | { type: 'breastfeeding'; drug: BreastfeedingDrugItem }
  | null;

interface PharmaPedModuleProps {
  isDark: boolean;
}

export default function PharmaPedModule({ isDark: darkMode }: PharmaPedModuleProps) {

  // Active Tab: 1) pediatric, 2) pregnancy, 3) breastfeeding
  const [activeTab, setActiveTab] = useState<'pediatric' | 'pregnancy' | 'breastfeeding'>('pediatric');

  // Search queries for each tab
  const [pediatricSearch, setPediatricSearch] = useState<string>('');
  const [pregnancySearch, setPregnancySearch] = useState<string>('');
  const [breastfeedingSearch, setBreastfeedingSearch] = useState<string>('');

  // Add drug modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Edit drug modal target
  const [editingTarget, setEditingTarget] = useState<EditingTarget>(null);

  // Delete confirmation modal target
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  // Custom User-Added Drugs persisted to localStorage
  const [customPediatricDrugs, setCustomPediatricDrugs] = useState<PediatricDrug[]>(() => {
    try {
      const saved = localStorage.getItem('custom_pediatric_drugs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customPregnancyDrugs, setCustomPregnancyDrugs] = useState<PregnancyDrugItem[]>(() => {
    try {
      const saved = localStorage.getItem('custom_pregnancy_drugs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customBreastfeedingDrugs, setCustomBreastfeedingDrugs] = useState<BreastfeedingDrugItem[]>(() => {
    try {
      const saved = localStorage.getItem('custom_breastfeeding_drugs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Overrides for Existing Drugs persisted to localStorage
  const [pediatricOverrides, setPediatricOverrides] = useState<Record<number, PediatricDrug>>(() => {
    try {
      const saved = localStorage.getItem('med_pediatric_overrides');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [pregnancyOverrides, setPregnancyOverrides] = useState<Record<string, PregnancyDrugItem>>(() => {
    try {
      const saved = localStorage.getItem('med_pregnancy_overrides');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [breastfeedingOverrides, setBreastfeedingOverrides] = useState<Record<string, BreastfeedingDrugItem>>(() => {
    try {
      const saved = localStorage.getItem('med_breastfeeding_overrides');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Deleted Drug IDs persisted to localStorage
  const [deletedPediatricNos, setDeletedPediatricNos] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('med_deleted_pediatric');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deletedPregnancyIds, setDeletedPregnancyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('med_deleted_pregnancy');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deletedBreastfeedingIds, setDeletedBreastfeedingIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('med_deleted_breastfeeding');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('custom_pediatric_drugs', JSON.stringify(customPediatricDrugs));
  }, [customPediatricDrugs]);

  useEffect(() => {
    localStorage.setItem('custom_pregnancy_drugs', JSON.stringify(customPregnancyDrugs));
  }, [customPregnancyDrugs]);

  useEffect(() => {
    localStorage.setItem('custom_breastfeeding_drugs', JSON.stringify(customBreastfeedingDrugs));
  }, [customBreastfeedingDrugs]);

  useEffect(() => {
    localStorage.setItem('med_pediatric_overrides', JSON.stringify(pediatricOverrides));
  }, [pediatricOverrides]);

  useEffect(() => {
    localStorage.setItem('med_pregnancy_overrides', JSON.stringify(pregnancyOverrides));
  }, [pregnancyOverrides]);

  useEffect(() => {
    localStorage.setItem('med_breastfeeding_overrides', JSON.stringify(breastfeedingOverrides));
  }, [breastfeedingOverrides]);

  useEffect(() => {
    localStorage.setItem('med_deleted_pediatric', JSON.stringify(deletedPediatricNos));
  }, [deletedPediatricNos]);

  useEffect(() => {
    localStorage.setItem('med_deleted_pregnancy', JSON.stringify(deletedPregnancyIds));
  }, [deletedPregnancyIds]);

  useEffect(() => {
    localStorage.setItem('med_deleted_breastfeeding', JSON.stringify(deletedBreastfeedingIds));
  }, [deletedBreastfeedingIds]);

  const handleAddPediatric = (drug: PediatricDrug) => {
    setCustomPediatricDrugs(prev => [drug, ...prev]);
  };

  const handleAddPregnancy = (drug: PregnancyDrugItem) => {
    setCustomPregnancyDrugs(prev => [drug, ...prev]);
  };

  const handleAddBreastfeeding = (drug: BreastfeedingDrugItem) => {
    setCustomBreastfeedingDrugs(prev => [drug, ...prev]);
  };

  // Edit / Save Handlers
  const handleSavePediatric = (updated: PediatricDrug) => {
    setCustomPediatricDrugs(prev => prev.map(d => d.no === updated.no ? updated : d));
    setPediatricOverrides(prev => ({ ...prev, [updated.no]: updated }));
  };

  const handleResetPediatric = (no: number) => {
    setPediatricOverrides(prev => {
      const next = { ...prev };
      delete next[no];
      return next;
    });
  };

  const handleSavePregnancy = (updated: PregnancyDrugItem) => {
    setCustomPregnancyDrugs(prev => prev.map(d => d.id === updated.id ? updated : d));
    setPregnancyOverrides(prev => ({ ...prev, [updated.id]: updated }));
  };

  const handleResetPregnancy = (id: string) => {
    setPregnancyOverrides(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSaveBreastfeeding = (updated: BreastfeedingDrugItem) => {
    setCustomBreastfeedingDrugs(prev => prev.map(d => d.id === updated.id ? updated : d));
    setBreastfeedingOverrides(prev => ({ ...prev, [updated.id]: updated }));
  };

  const handleResetBreastfeeding = (id: string) => {
    setBreastfeedingOverrides(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Permanent Delete Handler
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'pediatric') {
      const no = deleteTarget.drug.no;
      setCustomPediatricDrugs(prev => prev.filter(d => d.no !== no));
      setPediatricOverrides(prev => {
        const next = { ...prev };
        delete next[no];
        return next;
      });
      setDeletedPediatricNos(prev => (prev.includes(no) ? prev : [...prev, no]));
    } else if (deleteTarget.type === 'pregnancy') {
      const id = deleteTarget.drug.id;
      setCustomPregnancyDrugs(prev => prev.filter(d => d.id !== id));
      setPregnancyOverrides(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setDeletedPregnancyIds(prev => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      const id = deleteTarget.drug.id;
      setCustomBreastfeedingDrugs(prev => prev.filter(d => d.id !== id));
      setBreastfeedingOverrides(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setDeletedBreastfeedingIds(prev => (prev.includes(id) ? prev : [...prev, id]));
    }
    setDeleteTarget(null);
  };

  // Combined lists with OTC, hospital drugs, user edits/overrides merged, deduplicated & deleted excluded
  const allPediatricDrugs = useMemo(() => {
    const deletedSet = new Set(deletedPediatricNos);
    const seen = new Set<number>();
    const merged: PediatricDrug[] = [];
    for (const drug of [...customPediatricDrugs, ...PEDIATRIC_DRUGS, ...ADDITIONAL_PEDIATRIC_DRUGS]) {
      if (deletedSet.has(drug.no) || seen.has(drug.no)) continue;
      seen.add(drug.no);
      merged.push(pediatricOverrides[drug.no] || drug);
    }
    return merged;
  }, [customPediatricDrugs, pediatricOverrides, deletedPediatricNos]);

  const allPregnancyDrugs = useMemo(() => {
    const deletedSet = new Set(deletedPregnancyIds);
    const seen = new Set<string>();
    const merged: PregnancyDrugItem[] = [];
    for (const drug of [...customPregnancyDrugs, ...PREGNANCY_DRUGS, ...ADDITIONAL_PREGNANCY_DRUGS]) {
      if (deletedSet.has(drug.id) || seen.has(drug.id)) continue;
      seen.add(drug.id);
      merged.push(pregnancyOverrides[drug.id] || drug);
    }
    return merged;
  }, [customPregnancyDrugs, pregnancyOverrides, deletedPregnancyIds]);

  const allBreastfeedingDrugs = useMemo(() => {
    const deletedSet = new Set(deletedBreastfeedingIds);
    const seen = new Set<string>();
    const merged: BreastfeedingDrugItem[] = [];
    for (const drug of [...customBreastfeedingDrugs, ...BREASTFEEDING_DRUGS, ...ADDITIONAL_BREASTFEEDING_DRUGS]) {
      if (deletedSet.has(drug.id) || seen.has(drug.id)) continue;
      seen.add(drug.id);
      merged.push(breastfeedingOverrides[drug.id] || drug);
    }
    return merged;
  }, [customBreastfeedingDrugs, breastfeedingOverrides, deletedBreastfeedingIds]);

  // Search filtering logic
  // Requirement 9: On first load (when search query is empty), show ONLY ONE sample drug!
  const isPediatricSearching = pediatricSearch.trim().length > 0;
  const filteredPediatricDrugs = useMemo(() => {
    if (!isPediatricSearching) {
      // Show ONLY one sample drug (e.g. Acetaminophen)
      return allPediatricDrugs.slice(0, 1);
    }
    return allPediatricDrugs.filter((drug) =>
      matchesSmartSearch(pediatricSearch, [
        drug.nameFa,
        drug.nameEn,
        drug.indication,
        drug.form,
      ])
    );
  }, [allPediatricDrugs, pediatricSearch, isPediatricSearching]);

  const isPregnancySearching = pregnancySearch.trim().length > 0;
  const filteredPregnancyDrugs = useMemo(() => {
    if (!isPregnancySearching) {
      // Show ONLY one sample drug
      return allPregnancyDrugs.slice(0, 1);
    }
    return allPregnancyDrugs.filter((drug) =>
      matchesSmartSearch(pregnancySearch, [
        drug.nameFa,
        drug.nameEn,
        drug.indication,
      ])
    );
  }, [allPregnancyDrugs, pregnancySearch, isPregnancySearching]);

  const isBreastfeedingSearching = breastfeedingSearch.trim().length > 0;
  const filteredBreastfeedingDrugs = useMemo(() => {
    if (!isBreastfeedingSearching) {
      // Show ONLY one sample drug
      return allBreastfeedingDrugs.slice(0, 1);
    }
    return allBreastfeedingDrugs.filter((drug) =>
      matchesSmartSearch(breastfeedingSearch, [
        drug.nameFa,
        drug.nameEn,
        drug.indication,
      ])
    );
  }, [allBreastfeedingDrugs, breastfeedingSearch, isBreastfeedingSearching]);

  return (
    <div dir="rtl" className={`min-h-[calc(100vh-2.75rem)] ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} flex flex-col font-sans transition-colors duration-150`}>
      {/* Top Action Section: App Title + Compact Add Button */}
      <div className="max-w-4xl w-full mx-auto px-4 pt-5 pb-2 flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          راهنمای دارویی اطفال و بارداری
        </h1>

        <div className="flex items-center gap-2">
          {/* Compact Add button with only the plus icon */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            title="افزودن داروی جدید"
            className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-2xs active:scale-95 transition-all"
            aria-label="افزودن داروی جدید"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-3 space-y-5">
        {/* 3 Main Tabs separated with a clean line, NOT in a box (Requirement 12 & 15) */}
        <div className="border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-around sm:justify-center sm:gap-12 pb-0">
          <button
            onClick={() => setActiveTab('pediatric')}
            className={`py-3 px-3 sm:px-6 text-sm sm:text-base font-extrabold transition-all border-b-2 -mb-[2px] ${
              activeTab === 'pediatric'
                ? 'border-teal-600 text-teal-700 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            داروهای اطفال
          </button>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 sm:hidden"></div>

          <button
            onClick={() => setActiveTab('pregnancy')}
            className={`py-3 px-3 sm:px-6 text-sm sm:text-base font-extrabold transition-all border-b-2 -mb-[2px] ${
              activeTab === 'pregnancy'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            داروهای در بارداری
          </button>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 sm:hidden"></div>

          <button
            onClick={() => setActiveTab('breastfeeding')}
            className={`py-3 px-3 sm:px-6 text-sm sm:text-base font-extrabold transition-all border-b-2 -mb-[2px] ${
              activeTab === 'breastfeeding'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            داروها در شیردهی
          </button>
        </div>

        {/* --- TAB 1: PEDIATRIC DRUGS --- */}
        {activeTab === 'pediatric' && (
          <div className="space-y-4">
            {/* Simple clean search box */}
            <div className="relative">
              <input
                type="text"
                value={pediatricSearch}
                onChange={(e) => setPediatricSearch(e.target.value)}
                placeholder="جستجوی نام داروی اطفال به فارسی یا انگلیسی (مثلاً: سفکسیم، لوتیراستام، استامینوفن...)"
                className="w-full pl-10 pr-12 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs text-slate-900 dark:text-white"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-4" />
              {pediatricSearch && (
                <button
                  onClick={() => setPediatricSearch('')}
                  className="absolute left-3.5 top-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* List of Drug Cards */}
            {filteredPediatricDrugs.length > 0 ? (
              <div className="space-y-4">
                {filteredPediatricDrugs.map((drug) => (
                  <PediatricDrugCard
                    key={drug.no}
                    drug={drug}
                    onEdit={(d) => setEditingTarget({ type: 'pediatric', drug: d })}
                    onDelete={(d) => setDeleteTarget({ type: 'pediatric', drug: d })}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">دارویی یافت نشد</p>
                <p className="text-xs text-slate-400">نام فارسی یا انگلیسی دارو را به درستی تایپ کنید.</p>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: PREGNANCY DRUGS --- */}
        {activeTab === 'pregnancy' && (
          <div className="space-y-4">
            {/* Simple clean search box */}
            <div className="relative">
              <input
                type="text"
                value={pregnancySearch}
                onChange={(e) => setPregnancySearch(e.target.value)}
                placeholder="جستجوی نام دارو در بارداری (مثلاً: سفکسیم، لوتیراستام، متیل‌دوپا، استامینوفن...)"
                className="w-full pl-10 pr-12 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-xs text-slate-900 dark:text-white"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-4" />
              {pregnancySearch && (
                <button
                  onClick={() => setPregnancySearch('')}
                  className="absolute left-3.5 top-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* List of Drug Cards */}
            {filteredPregnancyDrugs.length > 0 ? (
              <div className="space-y-4">
                {filteredPregnancyDrugs.map((drug) => (
                  <PregnancyDrugCard
                    key={drug.id}
                    drug={drug}
                    onEdit={(d) => setEditingTarget({ type: 'pregnancy', drug: d })}
                    onDelete={(d) => setDeleteTarget({ type: 'pregnancy', drug: d })}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">دارویی یافت نشد</p>
                <p className="text-xs text-slate-400">نام فارسی یا انگلیسی دارو را به درستی تایپ کنید.</p>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: BREASTFEEDING DRUGS (Requirement 12) --- */}
        {activeTab === 'breastfeeding' && (
          <div className="space-y-4">
            {/* Simple clean search box */}
            <div className="relative">
              <input
                type="text"
                value={breastfeedingSearch}
                onChange={(e) => setBreastfeedingSearch(e.target.value)}
                placeholder="جستجوی نام دارو در شیردهی (مثلاً: سفکسیم، لوتیراستام، ایبوپروفن، وارفارین...)"
                className="w-full pl-10 pr-12 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs text-slate-900 dark:text-white"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-4" />
              {breastfeedingSearch && (
                <button
                  onClick={() => setBreastfeedingSearch('')}
                  className="absolute left-3.5 top-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* List of Drug Cards */}
            {filteredBreastfeedingDrugs.length > 0 ? (
              <div className="space-y-4">
                {filteredBreastfeedingDrugs.map((drug) => (
                  <BreastfeedingDrugCard
                    key={drug.id}
                    drug={drug}
                    onEdit={(d) => setEditingTarget({ type: 'breastfeeding', drug: d })}
                    onDelete={(d) => setDeleteTarget({ type: 'breastfeeding', drug: d })}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">دارویی یافت نشد</p>
                <p className="text-xs text-slate-400">نام فارسی یا انگلیسی دارو را به درستی تایپ کنید.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Drug Modal (Requirement 13) */}
      <AddDrugModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPediatric={handleAddPediatric}
        onAddPregnancy={handleAddPregnancy}
        onAddBreastfeeding={handleAddBreastfeeding}
        defaultTab={activeTab}
      />

      {/* Edit Drug Modal with Form Management & Reset Options */}
      <EditDrugModal
        target={editingTarget}
        isOpen={editingTarget !== null}
        onClose={() => setEditingTarget(null)}
        onSavePediatric={handleSavePediatric}
        onSavePregnancy={handleSavePregnancy}
        onSaveBreastfeeding={handleSaveBreastfeeding}
        onResetPediatric={handleResetPediatric}
        onResetPregnancy={handleResetPregnancy}
        onResetBreastfeeding={handleResetBreastfeeding}
        isCustomized={
          editingTarget?.type === 'pediatric'
            ? Boolean(pediatricOverrides[editingTarget.drug.no])
            : editingTarget?.type === 'pregnancy'
            ? Boolean(pregnancyOverrides[editingTarget.drug.id])
            : editingTarget?.type === 'breastfeeding'
            ? Boolean(breastfeedingOverrides[editingTarget.drug.id])
            : false
        }
      />

      {/* Delete Drug Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  حذف دارو
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  این دارو به طور کامل از لیست حذف خواهد شد.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {deleteTarget.drug.nameFa}
              </div>
              <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 font-sans mt-0.5">
                {deleteTarget.drug.nameEn}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-all active:scale-95"
              >
                حذف شود
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-all active:scale-95"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
