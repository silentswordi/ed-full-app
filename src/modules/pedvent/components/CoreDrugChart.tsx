/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PatientParameters, CoreMedicationChartItem } from '../types';
import { getCoreRsiSedationChart } from '../data/pediatricCalculations';
import {
  Pill,
  Syringe,
  AlertTriangle,
  Clock,
  Copy,
  Check,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface CoreDrugChartProps {
  patient: PatientParameters;
}

export const CoreDrugChart: React.FC<CoreDrugChartProps> = ({ patient }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  // Get the 10 requested medications calculated for the current patient
  const coreMeds = getCoreRsiSedationChart(patient);

  const handleCopyDrug = (med: CoreMedicationChartItem) => {
    const text = `${med.name} (${med.genericName}):
Calculated Dose: ${med.calculatedDose} (${med.doseFormula})
Concentration: ${med.standardConcentration}
Volume to Draw: ${med.volumeToDraw}
Route: ${med.route}
Max Dose: ${med.maxDose || 'N/A'}
Onset/Duration: ${med.onsetDuration}
Alert: ${med.clinicalAlert}`;

    navigator.clipboard.writeText(text);
    setCopiedId(med.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getBadgeStyle = (color: CoreMedicationChartItem['priorityColor']) => {
    switch (color) {
      case 'rose':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      case 'amber':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'cyan':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
      case 'purple':
        return 'bg-purple-950/80 text-purple-300 border-purple-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <section
      id="core-drug-chart-section"
      className="bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm"
    >
      {/* Chart Section Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-sm">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Emergency RSI &amp; Sedation Drug Chart
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                10 Core Medications
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Calculated doses &amp; draw-up volumes for <strong>{patient.actualWeightKg} kg</strong> ({patient.categoryLabel})
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] font-semibold text-slate-400 block">
            Doses scaled to working weight
          </span>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {patient.actualWeightKg} kg &bull; {patient.heightCm} cm
          </span>
        </div>
      </div>

      {/* Desktop & Tablet Table View (hidden on small mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 w-48">Medication &amp; Class</th>
              <th className="py-3 px-4 w-52">Indication &amp; Route</th>
              <th className="py-3 px-4 w-36">Dose Formula</th>
              <th className="py-3 px-4 w-44 bg-slate-900/50">
                <span className="text-emerald-400 font-bold">Patient Dose</span>
              </th>
              <th className="py-3 px-4 w-56 bg-emerald-950/20">
                <span className="text-emerald-300 font-extrabold flex items-center gap-1">
                  <Syringe className="w-3.5 h-3.5" />
                  Volume to Draw (mL)
                </span>
              </th>
              <th className="py-3 px-4">Safety Pearls &amp; Onset</th>
              <th className="py-3 px-3 w-14 text-center">Copy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-medium">
            {coreMeds.map((med, index) => (
              <tr
                key={med.id}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                {/* Index */}
                <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-bold text-xs">
                  {index + 1}
                </td>

                {/* Medication Name & Class */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white text-sm tracking-tight">
                    {med.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {med.genericName}
                  </div>
                  <span
                    className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getBadgeStyle(
                      med.priorityColor
                    )}`}
                  >
                    {med.classType}
                  </span>
                </td>

                {/* Indication & Route */}
                <td className="py-3.5 px-4">
                  <p className="text-slate-300 leading-snug text-[11px] line-clamp-2">
                    {med.indication}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500">Route:</span>
                    <span className="font-semibold text-slate-200">{med.route}</span>
                  </div>
                </td>

                {/* Dose Formula */}
                <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                  {med.doseFormula}
                </td>

                {/* Calculated Dose */}
                <td className="py-3.5 px-4 bg-slate-900/40 font-mono">
                  <span className="text-sm font-black text-emerald-400 block tracking-tight">
                    {med.calculatedDose}
                  </span>
                  {med.maxDose && (
                    <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
                      Cap: {med.maxDose}
                    </span>
                  )}
                </td>

                {/* Volume to Draw & Standard Concentration */}
                <td className="py-3.5 px-4 bg-emerald-950/10 font-mono">
                  <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 inline-block">
                    <span className="text-sm font-black text-emerald-300 tracking-tight block">
                      {med.volumeToDraw}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Conc: <span className="text-slate-300 font-semibold">{med.standardConcentration}</span>
                  </div>
                </td>

                {/* Safety Alert & Onset */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 mb-1">
                    <Clock className="w-3 h-3" />
                    <span>{med.onsetDuration}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {med.clinicalAlert}
                  </p>
                </td>

                {/* Copy Button */}
                <td className="py-3.5 px-3 text-center">
                  <button
                    onClick={() => handleCopyDrug(med)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition cursor-pointer"
                    title={`Copy ${med.name} dose`}
                  >
                    {copiedId === med.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (displayed on phones) */}
      <div className="md:hidden divide-y divide-slate-800/80">
        {coreMeds.map((med, index) => (
          <div key={med.id} className="p-4 space-y-3">
            {/* Title & Badge */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px] font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-white text-base">
                    {med.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-mono ml-7">
                  {med.genericName}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getBadgeStyle(
                    med.priorityColor
                  )}`}
                >
                  {med.classType.split(' ')[0]}
                </span>
                <button
                  onClick={() => handleCopyDrug(med)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                  title="Copy dose"
                >
                  {copiedId === med.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Calculated Dose & Volume Callout Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Patient Dose
                </span>
                <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">
                  {med.calculatedDose}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block truncate">
                  {med.doseFormula}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/80">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Syringe className="w-3 h-3" />
                  Draw Volume
                </span>
                <span className="text-base font-black text-emerald-300 font-mono mt-0.5 block">
                  {med.volumeToDraw}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block truncate">
                  {med.standardConcentration}
                </span>
              </div>
            </div>

            {/* Indication, Route, & Onset */}
            <div className="text-xs space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Route:</span>
                <span className="font-semibold text-white">{med.route}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Timing:</span>
                <span className="font-mono text-amber-400 text-[11px]">{med.onsetDuration}</span>
              </div>
              {med.maxDose && (
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Max Dose:</span>
                  <span className="font-mono text-slate-200">{med.maxDose}</span>
                </div>
              )}
            </div>

            {/* Safety alert */}
            <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-200 leading-snug flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{med.clinicalAlert}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Footer Note */}
      <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <span>
          💡 <strong>Clinical Pearl:</strong> Always ensure pre-oxygenation with 100% O2 prior to RSI induction and confirm bag-valve-mask ventilatability.
        </span>
        <span className="font-mono text-slate-500">
          PALS &bull; ASPEN &bull; NICU Guideline Standards
        </span>
      </div>
    </section>
  );
};
