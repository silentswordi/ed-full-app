/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Pill, ClipboardList } from 'lucide-react';
import { PatientParameters } from '../types';

export type ClinicalDetailTab = 'summary' | 'drug_search';

interface ClinicalTabsProps {
  activeTab: ClinicalDetailTab;
  onSelectTab: (tab: ClinicalDetailTab) => void;
  patient: PatientParameters;
}

export const ClinicalTabs: React.FC<ClinicalTabsProps> = ({
  activeTab,
  onSelectTab,
  patient,
}) => {
  const tabs: {
    id: ClinicalDetailTab;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    activeClass: string;
  }[] = [
    {
      id: 'summary',
      label: 'Bedside SBAR Record',
      sublabel: 'Airway, vent settings & resuscitation overview',
      icon: ClipboardList,
      activeClass:
        'bg-cyan-600 text-white border-cyan-500 shadow-sm dark:shadow-md dark:shadow-cyan-950/40 ring-1 ring-cyan-500/40',
    },
    {
      id: 'drug_search',
      label: 'Drug Dosage',
      sublabel: 'Emergency & resuscitation drug dosages',
      icon: Pill,
      activeClass:
        'bg-emerald-600 text-white border-emerald-500 shadow-sm dark:shadow-md dark:shadow-emerald-950/40 ring-1 ring-emerald-500/40',
    },
  ];

  return (
    <nav
      id="clinical-detail-selector"
      aria-label="Clinical detail selection"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 sm:p-3 shadow-sm dark:shadow-lg space-y-2 transition-colors"
    >
      {/* Detail Needed Prompt Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
            Clinical Module:
          </h2>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline whitespace-nowrap">
            Select view
          </span>
        </div>

        {/* Live Patient Indicator Pill */}
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] font-mono min-w-0 max-w-full">
          <span
            className="w-2 h-2 rounded-full shrink-0 border border-slate-300 dark:border-transparent"
            style={{ backgroundColor: patient.broselowHex }}
          />
          <span className="text-slate-800 dark:text-slate-300 font-bold whitespace-nowrap">{patient.heightCm} cm</span>
          <span className="text-slate-400 dark:text-slate-500">&bull;</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold whitespace-nowrap">{patient.actualWeightKg} kg</span>
          <span className="text-slate-400 dark:text-slate-500">&bull;</span>
          <span className="text-slate-600 dark:text-slate-400 truncate max-w-[120px] sm:max-w-[180px]">
            {patient.categoryLabel}
          </span>
        </div>
      </div>

      {/* Tabs / Choice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-select-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`p-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-2 relative group min-w-0 ${
                isActive
                  ? tab.activeClass
                  : 'bg-slate-50 dark:bg-slate-950/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div
                  className={`p-1.5 rounded-md shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-transparent text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-xs sm:text-sm font-bold tracking-tight leading-tight truncate ${
                      isActive ? 'text-white' : 'text-slate-900 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </div>
                  <div
                    className={`text-[10px] truncate leading-normal ${
                      isActive ? 'text-white/85' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    }`}
                  >
                    {tab.sublabel}
                  </div>
                </div>
              </div>

              {isActive && (
                <span className="text-[9px] font-extrabold uppercase tracking-wider bg-white/25 text-white px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
