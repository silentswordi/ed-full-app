/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PatientParameters, VentilatorSetup } from '../types';
import {
  Wind,
  Activity,
  Gauge,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface VentilatorCardProps {
  patient: PatientParameters;
  vent: VentilatorSetup;
}

export const VentilatorCard: React.FC<VentilatorCardProps> = ({ patient, vent }) => {
  return (
    <div id="ventilator-workstation" className="space-y-5">
      {/* Header & Mode Callout */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shadow-sm">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Mechanical Ventilator Setup
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-950 text-teal-300 border border-teal-800">
                  PALICC Guideline
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lung-protective parameters tailored to <strong>{patient.actualWeightKg} kg</strong> ({patient.categoryLabel})
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Mode Banner */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Primary Recommended Ventilation Mode
            </span>
            <div className="text-base sm:text-lg font-black text-teal-300">
              {vent.mode}
            </div>
          </div>
          <div className="text-xs text-slate-400 sm:text-right">
            <span className="text-[11px] font-mono text-emerald-400 font-bold block">
              Target Vt: 7 mL/kg
            </span>
            <span>Flow Trigger: {vent.triggerSensitivity}</span>
          </div>
        </div>

        {/* Target Tidal Volume Card (Lower & Upper Limits Removed) */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Target Tidal Volume (mL)
            </span>
            <span className="font-mono">Formula: 7 mL/kg &times; {patient.actualWeightKg} kg</span>
          </div>

          <div className="p-5 rounded-xl bg-teal-950/40 border-2 border-teal-500/80 text-center shadow-lg shadow-teal-950/40 relative">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
              Recommended Target Tidal Volume (7 mL/kg)
            </span>
            <div className="mt-2 text-4xl sm:text-5xl font-black text-teal-200 font-mono tracking-tight">
              {vent.tidalVolume7mL} <span className="text-lg font-normal text-teal-400">mL</span>
            </div>
            <span className="text-xs text-teal-400/90 font-medium mt-1 block">
              Lung-protective baseline volume for {patient.actualWeightKg} kg
            </span>
          </div>
        </div>

        {/* Key Ventilator Setting Parameters */}
        <div className="mt-6 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Core Machine Settings &amp; Limits
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Respiratory Rate */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-bold">Rate (RR)</span>
              </div>
              <div className="text-lg font-black text-teal-300 font-mono">
                {vent.respiratoryRateBpm}
              </div>
              <span className="text-[10px] text-slate-500">breaths/min</span>
            </div>

            {/* PEEP */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Gauge className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-bold">PEEP</span>
              </div>
              <div className="text-lg font-black text-teal-300 font-mono">
                {vent.peepCmH2O}
              </div>
              <span className="text-[10px] text-slate-500">cmH2O</span>
            </div>

            {/* PIP Limit */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold">PIP Limit</span>
              </div>
              <div className="text-lg font-black text-amber-300 font-mono">
                {vent.pipLimitCmH2O}
              </div>
              <span className="text-[10px] text-slate-500">cmH2O safety pop-off</span>
            </div>

            {/* Inspiratory Time */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold">Insp Time (Ti)</span>
              </div>
              <div className="text-lg font-black text-white font-mono">
                {vent.inspiratoryTimeSec}
              </div>
              <span className="text-[10px] text-slate-500">I:E {vent.ieRatio}</span>
            </div>

            {/* Initial FiO2 */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Wind className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-bold">Initial FiO2</span>
              </div>
              <div className="text-lg font-black text-white font-mono">
                {vent.initialFiO2}
              </div>
              <span className="text-[10px] text-slate-500">titrate down rapidly</span>
            </div>

            {/* Target SpO2 */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold">Target SpO2</span>
              </div>
              <div className="text-lg font-black text-emerald-400 font-mono">
                {vent.targetSpO2}
              </div>
              <span className="text-[10px] text-slate-500">avoid hyperoxia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
