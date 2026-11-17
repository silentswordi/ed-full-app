/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  PatientParameters,
  AirwayEquipment,
  VentilatorSetup,
  DefibShockEnergy,
} from '../types';
import {
  Stethoscope,
  Wind,
} from 'lucide-react';

interface EmergencySummarySectionProps {
  patient: PatientParameters;
  airway: AirwayEquipment;
  vent: VentilatorSetup;
  defib: DefibShockEnergy;
  onOpenDetailedModal?: () => void;
}

export const EmergencySummarySection: React.FC<EmergencySummarySectionProps> = ({
  patient,
  airway,
  vent,
  defib,
}) => {
  return (
    <section
      id="emergency-summary-section"
      className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-sm dark:shadow-lg overflow-hidden backdrop-blur-sm transition-colors"
    >
      {/* Summary Header */}
      <div className="px-3 sm:px-3.5 py-2.5 bg-slate-50 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-600/20 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-700 dark:text-cyan-400 shadow-xs shrink-0">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate">
                Emergency Resuscitation &amp; Ventilator Summary
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 whitespace-nowrap shrink-0">
                Bedside SBAR
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {patient.heightCm} cm &bull; {patient.actualWeightKg} kg ({patient.categoryLabel})
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Key Clinical Sections: Airway, Ventilator, Defib */}
      <div className="p-3 sm:p-3.5 space-y-3">
        {/* Row 1: Patient Key Metric Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Card 1: Length */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 min-w-0 overflow-hidden flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
              Patient Length
            </span>
            <div className="mt-0.5 flex items-baseline gap-1 whitespace-nowrap overflow-hidden">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">{patient.heightCm}</span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">cm</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                ({(patient.heightCm / 2.54).toFixed(1)}″)
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-cyan-700 dark:text-cyan-400 font-medium mt-0.5 block truncate" title={patient.categoryLabel}>
              {patient.categoryLabel}
            </span>
          </div>

          {/* Card 2: Weight */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 min-w-0 overflow-hidden flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
              Working Weight
            </span>
            <div className="mt-0.5 flex items-baseline gap-1 whitespace-nowrap overflow-hidden">
              <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 leading-tight">{patient.actualWeightKg}</span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">kg</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                ({(patient.actualWeightKg * 2.20462).toFixed(1)} lbs)
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 block truncate">
              Length-estimated
            </span>
          </div>

          {/* Card 3: Broselow */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 min-w-0 overflow-hidden flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
              Broselow Zone
            </span>
            <div className="mt-0.5 flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 border border-slate-400 dark:border-white/40 shadow-xs"
                style={{ backgroundColor: patient.broselowHex }}
              />
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate" title={patient.broselowLabel}>
                {patient.broselowLabel}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 block truncate">
              Tape Band
            </span>
          </div>

          {/* Card 4: Defib */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 min-w-0 overflow-hidden flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
              Defib Shock
            </span>
            <div className="mt-0.5 flex items-baseline gap-1 whitespace-nowrap overflow-hidden">
              <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 leading-tight">{defib.initialJ}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">J (1st)</span>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold ml-0.5">&bull; {defib.subsequentJ}J (2nd)</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 block truncate" title={`Sync: ${defib.cardioversionInitialJ}J • ${defib.paddleSize}`}>
              Sync: <strong className="text-slate-800 dark:text-slate-200">{defib.cardioversionInitialJ}J</strong> &bull; {defib.paddleSize}
            </span>
          </div>
        </div>

        {/* Row 2: Airway Equipment & Ventilator Setup Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Airway Equipment Summary Block */}
          <div className="rounded-lg bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3 space-y-2.5 min-w-0">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider truncate">
                  Airway &amp; ETT Equipment
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900 shrink-0 whitespace-nowrap">
                PALS / NRP
              </span>
            </div>

            {/* ETT & Depth Callouts */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-w-0 overflow-hidden">
                <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block truncate">
                  ETT Cuffed
                </span>
                <span className="text-xs sm:text-sm font-black text-blue-700 dark:text-blue-400 block truncate leading-tight mt-0.5" title={airway.ettCuffedSize}>
                  {airway.ettCuffedSize}
                </span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-w-0 overflow-hidden">
                <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block truncate">
                  ETT Uncuffed
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 block truncate leading-tight mt-0.5" title={airway.ettUncuffedSize}>
                  {airway.ettUncuffedSize}
                </span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-w-0 overflow-hidden">
                <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block truncate">
                  Lip Depth
                </span>
                <div className="flex items-baseline gap-1 whitespace-nowrap mt-0.5">
                  <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400 leading-tight">
                    {airway.ettLipDepthCm}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">cm</span>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block truncate">
                  Nasal: {airway.ettNasalDepthCm} cm
                </span>
              </div>
            </div>

            {/* Laryngoscope & Accessories */}
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center gap-2 py-1 px-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/60 min-w-0">
                <span className="text-slate-500 dark:text-slate-400 shrink-0">Blade:</span>
                <span className="font-bold text-slate-900 dark:text-white text-right truncate" title={`${airway.laryngoscopeType} — Size ${airway.laryngoscopeSize}`}>
                  {airway.laryngoscopeType} &mdash; <span className="text-amber-700 dark:text-amber-300 font-extrabold">Size {airway.laryngoscopeSize}</span>
                </span>
              </div>
              <div className="flex justify-between items-center gap-2 py-1 px-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/60 min-w-0">
                <span className="text-slate-500 dark:text-slate-400 shrink-0">Backup ETTs:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate text-right">{airway.backupEttSizes}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 min-w-0">
                <div className="py-1 px-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between gap-1 min-w-0">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">Suction:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{airway.suctionCatheterFr}</span>
                </div>
                <div className="py-1 px-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between gap-1 min-w-0">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">LMA Rescue:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate" title={airway.lmaSize}>{airway.lmaSize}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 min-w-0">
                <div className="py-1 px-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between gap-1 min-w-0">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">BVM Size:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate ml-1 text-right" title={airway.bvmSize}>{airway.bvmSize}</span>
                </div>
                <div className="py-1 px-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between gap-1 min-w-0">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">Chest Tube:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate ml-1 text-right">{airway.chestTubePneumoFr}</span>
                </div>
              </div>
            </div>

            {/* Airway blade note */}
            <p className="text-[10px] text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-900/40 p-1.5 rounded border border-slate-200/80 dark:border-slate-800/50 leading-tight">
              💡 {airway.laryngoscopeNotes}
            </p>
          </div>

          {/* Ventilator Setup Summary Block */}
          <div className="rounded-lg bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3 space-y-2.5 min-w-0">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider truncate">
                  Initial Ventilator Setup
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-900 shrink-0 whitespace-nowrap">
                PALICC Standard
              </span>
            </div>

            {/* Mode & Target Tidal Volume */}
            <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-bold uppercase text-slate-500 dark:text-slate-400 block truncate">Mode</span>
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 truncate block" title={vent.mode}>
                  {vent.mode}
                </span>
              </div>
              <div className="text-right shrink-0 whitespace-nowrap pl-2 border-l border-slate-200 dark:border-slate-800">
                <span className="text-[9px] font-bold text-teal-700 dark:text-teal-400 uppercase block tracking-wider">Target Vt (7 mL/kg)</span>
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-base sm:text-lg font-black text-teal-800 dark:text-teal-200 font-mono leading-none">
                    {vent.tidalVolume7mL}
                  </span>
                  <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">mL</span>
                </div>
              </div>
            </div>

            {/* Key Ventilator Settings Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-[11px] min-w-0">
              <div className="py-1 px-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/60 flex justify-between items-center gap-1 min-w-0">
                <span className="text-slate-500 dark:text-slate-400 shrink-0">Resp Rate:</span>
                <span className="font-bold text-teal-700 dark:text-teal-300 truncate text-right">{vent.respiratoryRateBpm}</span>
              </div>
              <div className="py-1 px-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/60 flex justify-between items-center gap-1 min-w-0">
                <span className="text-slate-500 dark:text-slate-400 shrink-0">PEEP:</span>
                <span className="font-bold text-teal-700 dark:text-teal-300 truncate text-right">{vent.peepCmH2O}</span>
              </div>
              <div className="py-1 px-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/60 flex justify-between items-center gap-1 min-w-0">
                <span className="text-slate-500 dark:text-slate-400 shrink-0">PIP Limit:</span>
                <span className="font-bold text-amber-700 dark:text-amber-300 truncate text-right">{vent.pipLimitCmH2O}</span>
              </div>
              <div className="py-1 px-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/60 flex justify-between items-center gap-1 min-w-0">
                <span className="text-slate-500 dark:text-slate-400 shrink-0">Ti (Insp):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate text-right">{vent.inspiratoryTimeSec}</span>
              </div>
              <div className="py-1 px-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/60 flex justify-between items-center gap-1 min-w-0">
                <span className="text-slate-500 dark:text-slate-400 shrink-0">Initial FiO2:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate text-right">{vent.initialFiO2}</span>
              </div>
              <div className="py-1 px-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/60 flex justify-between items-center gap-1 min-w-0">
                <span className="text-slate-500 dark:text-slate-400 shrink-0">Target SpO2:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 truncate text-right">{vent.targetSpO2}</span>
              </div>
            </div>

            {/* Trigger sensitivity */}
            <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/40 p-1.5 rounded border border-slate-200/80 dark:border-slate-800/50 flex justify-between items-center gap-2 min-w-0">
              <span className="truncate">Trigger: <strong className="text-slate-800 dark:text-slate-200 font-mono">{vent.triggerSensitivity}</strong></span>
              <span className="shrink-0 whitespace-nowrap">I:E: <strong className="text-slate-800 dark:text-slate-200 font-mono">{vent.ieRatio}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
