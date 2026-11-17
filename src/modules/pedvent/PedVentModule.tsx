/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { HeightWeightInput } from './components/HeightWeightInput';
import { ClinicalTabs, ClinicalDetailTab } from './components/ClinicalTabs';
import { EmergencyDrugSearch } from './components/EmergencyDrugSearch';
import { EmergencySummarySection } from './components/EmergencySummarySection';
import {
  calculatePatientParameters,
  calculateAirwayEquipment,
  calculateVentilatorSetup,
  calculateDefibEnergy,
  calculateEmergencyMedications,
} from './data/pediatricCalculations';

export default function PedVentModule() {
  // Primary clinical input: patient height in cm, default 50 cm (multiples of 5)
  const [heightCm, setHeightCm] = useState<number>(50);

  // Active tab: default to 'summary' (Bedside SBAR Record), alternative is 'drug_search'
  const [activeTab, setActiveTab] = useState<ClinicalDetailTab>('summary');

  // Core calculations derived directly from height (and estimated weight)
  const patient = useMemo(() => {
    return calculatePatientParameters(heightCm, null);
  }, [heightCm]);

  const airway = useMemo(() => {
    return calculateAirwayEquipment(patient);
  }, [patient]);

  const vent = useMemo(() => {
    return calculateVentilatorSetup(patient);
  }, [patient]);

  const defib = useMemo(() => {
    return calculateDefibEnergy(patient.actualWeightKg);
  }, [patient.actualWeightKg]);

  const medications = useMemo(() => {
    return calculateEmergencyMedications(patient);
  }, [patient]);

  return (
    <div dir="ltr" className="min-h-[calc(100vh-2.75rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-rose-500 selection:text-white transition-colors">
      {/* Main Clinical Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3">
        {/* Step 1: Patient Height Slider Input (Multiples of 5 only) */}
        <HeightWeightInput
          patient={patient}
          onHeightChange={(val) => setHeightCm(val)}
        />

        {/* Step 2: Detail Selector Tabs (Bedside SBAR Record & Drug Dosage) */}
        <ClinicalTabs
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          patient={patient}
        />

        {/* Focused Module View */}
        <div>
          {activeTab === 'summary' && (
            <EmergencySummarySection
              patient={patient}
              airway={airway}
              vent={vent}
              defib={defib}
            />
          )}

          {activeTab === 'drug_search' && (
            <EmergencyDrugSearch
              patient={patient}
              medications={medications}
            />
          )}
        </div>
      </main>

      {/* Footer & Clinical Disclaimer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-3.5 text-center text-[11px] text-slate-500 px-3 space-y-1 transition-colors">
        <p>
          Designed for Pediatric Emergency Medicine Specialists, Neonatologists, and Critical Care Teams.
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-600">
          Based on standard clinical guidelines (PALS, NRP, PALICC, Broselow Pediatric Tape). Offline PWA cached for bedside access.
        </p>
      </footer>
    </div>
  );
}
