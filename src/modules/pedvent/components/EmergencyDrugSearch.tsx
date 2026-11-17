/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PatientParameters, EmergencyMedication } from '../types';
import {
  Search,
  X,
  AlertTriangle,
  Copy,
  Check,
  Pill,
} from 'lucide-react';
import { matchesSmartSearch } from '../../../utils/smartSearch';

interface EmergencyDrugSearchProps {
  patient: PatientParameters;
  medications: EmergencyMedication[];
}

type CategoryFilter =
  | 'all'
  | 'cardiac_arrest'
  | 'fluids_electrolytes'
  | 'status_epilepticus'
  | 'anaphylaxis'
  | 'respiratory'
  | 'antidote_reversal'
  | 'rsi';

export const EmergencyDrugSearch: React.FC<EmergencyDrugSearchProps> = ({
  patient,
  medications,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { id: CategoryFilter; label: string; count: number }[] = useMemo(() => {
    const counts: Record<string, number> = {
      all: medications.length,
      cardiac_arrest: 0,
      fluids_electrolytes: 0,
      status_epilepticus: 0,
      anaphylaxis: 0,
      respiratory: 0,
      antidote_reversal: 0,
      rsi: 0,
    };

    medications.forEach((m) => {
      if (m.category === 'cardiac_arrest') counts.cardiac_arrest++;
      else if (m.category === 'fluids_electrolytes') counts.fluids_electrolytes++;
      else if (m.category === 'status_epilepticus') counts.status_epilepticus++;
      else if (m.category === 'anaphylaxis') counts.anaphylaxis++;
      else if (m.category === 'respiratory') counts.respiratory++;
      else if (m.category === 'antidote_reversal') counts.antidote_reversal++;
      else if (m.category === 'rsi_induction' || m.category === 'rsi_paralytic' || m.category === 'sedation_analgesia') counts.rsi++;
    });

    return [
      { id: 'all', label: 'All Medications', count: counts.all },
      { id: 'cardiac_arrest', label: 'Resuscitation & Arrest', count: counts.cardiac_arrest },
      { id: 'rsi', label: 'RSI & Sedation', count: counts.rsi },
      { id: 'status_epilepticus', label: 'Seizures & Status', count: counts.status_epilepticus },
      { id: 'anaphylaxis', label: 'Anaphylaxis', count: counts.anaphylaxis },
      { id: 'respiratory', label: 'Airway & Asthma', count: counts.respiratory },
      { id: 'fluids_electrolytes', label: 'Fluids & Dextrose', count: counts.fluids_electrolytes },
      { id: 'antidote_reversal', label: 'Antidotes & Reversals', count: counts.antidote_reversal },
    ];
  }, [medications]);

  const filteredMeds = useMemo(() => {
    return medications.filter((m) => {
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'rsi') {
          if (
            m.category !== 'rsi_induction' &&
            m.category !== 'rsi_paralytic' &&
            m.category !== 'sedation_analgesia'
          ) {
            return false;
          }
        } else if (m.category !== selectedCategory) {
          return false;
        }
      }

      return matchesSmartSearch(searchQuery, [
        m.name,
        m.genericName,
        m.indication,
        m.categoryLabel,
        m.route,
      ]);
    });
  }, [medications, searchQuery, selectedCategory]);

  const handleCopy = (med: EmergencyMedication) => {
    const text = `${med.name} (${med.genericName}):
Patient Dose: ${med.calculatedDoseDisplay} (${med.doseFormula})
Concentration: ${med.standardConcentration}
Route: ${med.route}
Indication: ${med.indication}
Alert: ${med.clinicalAlert || 'Standard precaution'}`;

    navigator.clipboard.writeText(text);
    setCopiedId(med.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="emergency-drug-search-section"
      className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-sm dark:shadow-lg overflow-hidden backdrop-blur-sm transition-colors"
    >
      {/* Search Header */}
      <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-600/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-xs shrink-0">
              <Pill className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  Emergency Drug Dosages
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0 whitespace-nowrap">
                  Weight-Adjusted
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Adjusted for {patient.actualWeightKg} kg ({patient.categoryLabel})
              </p>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap">
            <strong className="text-slate-900 dark:text-white">{filteredMeds.length}</strong> / {medications.length} meds
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="emergency-drug-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drug, antidote, or condition (e.g., Epi, Atropine, Dextrose, Naloxone, Seizure)..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline whitespace-nowrap">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-semibold whitespace-nowrap transition cursor-pointer border flex items-center gap-1 shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1 py-0.2 rounded text-[9px] font-mono font-bold ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Container */}
      <div className="p-3 sm:p-3.5">
        {filteredMeds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredMeds.map((med) => (
              <div
                key={med.id}
                className={`p-2.5 sm:p-3 rounded-lg border transition-all ${
                  med.highPriority
                    ? 'bg-rose-50/40 dark:bg-slate-950/90 border-rose-200 dark:border-rose-900/60 hover:border-rose-300 dark:hover:border-rose-700'
                    : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                } flex flex-col justify-between space-y-2 min-w-0 overflow-hidden`}
              >
                {/* Top Row: Name, Category, Copy */}
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-1.5 min-w-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                          {med.name}
                        </h3>
                        {med.highPriority && (
                          <span className="px-1 py-0.2 rounded text-[8px] font-extrabold uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shrink-0 whitespace-nowrap">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                        {med.genericName}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(med)}
                      className="p-1 rounded bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer shrink-0 ml-1"
                      title="Copy drug details"
                    >
                      {copiedId === med.id ? (
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {/* Indication */}
                  <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                    {med.indication}
                  </p>
                </div>

                {/* Patient Calculated Dose Box */}
                <div className="p-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2 min-w-0">
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
                      Calculated Dose
                    </span>
                    <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400 font-mono block truncate leading-tight mt-0.5" title={med.calculatedDoseDisplay}>
                      {med.calculatedDoseDisplay}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono block truncate mt-0.5" title={`Formula: ${med.doseFormula}`}>
                      Formula: {med.doseFormula}
                    </span>
                  </div>

                  <div className="text-right shrink-0 whitespace-nowrap pl-2 border-l border-slate-200 dark:border-slate-800/80">
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Concentration
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-slate-800 dark:text-slate-200 block leading-tight mt-0.5" title={med.standardConcentration}>
                      {med.standardConcentration}
                    </span>
                  </div>
                </div>

                {/* Route & Max Dose */}
                <div className="text-[10px] bg-white dark:bg-slate-900/60 p-1.5 rounded border border-slate-200/80 dark:border-slate-800/60 space-y-0.5 min-w-0">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 gap-2 min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 shrink-0">Route:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate" title={med.route}>{med.route}</span>
                  </div>
                  {med.maxDoseDisplay && (
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 gap-2 min-w-0">
                      <span className="text-slate-500 dark:text-slate-400 shrink-0">Max Cap:</span>
                      <span className="font-mono text-amber-700 dark:text-amber-300 font-semibold truncate text-right">{med.maxDoseDisplay}</span>
                    </div>
                  )}
                </div>

                {/* Clinical Alert */}
                {med.clinicalAlert && (
                  <div className="p-1.5 rounded bg-amber-50/70 dark:bg-slate-900/40 border border-amber-200/80 dark:border-slate-800/80 text-[10px] text-slate-700 dark:text-slate-300 leading-tight flex items-start gap-1 min-w-0">
                    <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span className="break-words">{med.clinicalAlert}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-8 text-center space-y-2">
            <div className="w-9 h-9 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              No medications matched &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try searching by drug name (e.g. Epi, Atropine, Dextrose), generic name, or condition.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
