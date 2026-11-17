/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PatientParameters, AirwayEquipment, DefibShockEnergy } from '../types';
import {
  Stethoscope,
  Zap,
  Info,
} from 'lucide-react';

interface AirwayCardProps {
  patient: PatientParameters;
  airway: AirwayEquipment;
  defib: DefibShockEnergy;
}

export const AirwayCard: React.FC<AirwayCardProps> = ({ patient, airway, defib }) => {
  return (
    <div id="airway-workstation" className="space-y-5">
      {/* Airway Equipment Header */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  RSI Airway &amp; Resuscitation Equipment
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  PALS / NRP Standard
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Endotracheal tube sizes, insertion depths, and resuscitation tools for <strong>{patient.actualWeightKg} kg</strong> ({patient.categoryLabel})
              </p>
            </div>
          </div>
        </div>

        {/* Primary ETT Sizing Callouts */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* ETT Cuffed (Primary) */}
          <div className="p-4 rounded-xl bg-blue-950/40 border-2 border-blue-500/80 shadow-lg shadow-blue-950/30 relative">
            <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-blue-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
              Recommended Choice
            </div>
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">
              ETT Cuffed ID
            </span>
            <div className="mt-1 text-3xl font-black text-blue-200 font-mono">
              {airway.ettCuffedSize}
            </div>
            <p className="text-[11px] text-blue-300/80 mt-1">
              Micro-cuff provides seal without mucosal pressure. Formula: (Age/4) + 3.5
            </p>
          </div>

          {/* ETT Uncuffed */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              ETT Uncuffed ID (Traditional)
            </span>
            <div className="mt-1 text-3xl font-black text-slate-200 font-mono">
              {airway.ettUncuffedSize}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Alternative uncuffed tube. Formula: (Age/4) + 4.0
            </p>
          </div>

          {/* ETT Depth at Lip */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/80">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
              Lip Insertion Depth
            </span>
            <div className="mt-1 text-3xl font-black text-emerald-300 font-mono">
              {airway.ettLipDepthCm} <span className="text-sm font-normal text-emerald-400">cm</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Nasal depth: <strong className="text-white">{airway.ettNasalDepthCm} cm</strong> &bull; ETT size &times; 3
            </p>
          </div>
        </div>

        {/* Laryngoscope, Rescue Airway & Surgical Equipment Grid */}
        <div className="mt-6 space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Laryngoscope, Backup &amp; Rescue Devices
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Laryngoscope Blade Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Laryngoscope Blade
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  Size {airway.laryngoscopeSize}
                </span>
              </div>
              <div className="text-base font-black text-white">
                {airway.laryngoscopeType} &bull; Blade Size <span className="text-amber-400">{airway.laryngoscopeSize}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                💡 {airway.laryngoscopeNotes}
              </p>
            </div>

            {/* Backup ETT Sizes */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Backup Tubes on Tray
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  &plusmn;0.5 mm
                </span>
              </div>
              <div className="text-base font-black text-white">
                {airway.backupEttSizes}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Always have 1 size smaller (subglottic edema/stenosis) and 1 size larger immediately available at bedside.
              </p>
            </div>
          </div>

          {/* Grid of Accessories */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Suction Catheter
              </span>
              <div className="text-lg font-black text-white font-mono mt-1">
                {airway.suctionCatheterFr}
              </div>
              <span className="text-[10px] text-slate-500 block">Endotracheal &amp; oral</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                LMA Rescue Size
              </span>
              <div className="text-lg font-black text-cyan-300 font-mono mt-1">
                {airway.lmaSize}
              </div>
              <span className="text-[10px] text-slate-500 block">Cannot intubate / rescue</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                BVM Size
              </span>
              <div className="text-sm font-bold text-white mt-1 truncate">
                {airway.bvmSize}
              </div>
              <span className="text-[10px] text-slate-500 block">Pressure release valve</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Chest Tube (Thoracostomy)
              </span>
              <div className="text-xs font-bold text-white mt-1">
                Pneumo: <span className="text-amber-300">{airway.chestTubePneumoFr}</span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Hemo: <span className="text-rose-300">{airway.chestTubeHemoFr}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Electrical Defibrillation & Cardioversion */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Defibrillation &amp; Synchronized Cardioversion (Joules)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Paddles: <strong className="text-amber-300">{defib.paddleSize}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                1st Shock (Defib 2 J/kg)
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                {defib.initialJ} <span className="text-xs font-normal text-slate-400">Joules</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">VF / Pulseless VT</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Subsequent Shock (4 J/kg)
              </span>
              <div className="text-2xl font-black text-amber-300 font-mono mt-1">
                {defib.subsequentJ} <span className="text-xs font-normal text-slate-400">Joules</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Refractory arrest (max 10 J/kg)</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Sync Cardioversion (1 J/kg)
              </span>
              <div className="text-2xl font-black text-cyan-300 font-mono mt-1">
                {defib.cardioversionInitialJ} <span className="text-xs font-normal text-slate-400">Joules</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">SVT / Unstable VT with pulse</span>
            </div>
          </div>
        </div>

        {/* Anatomical Pearls */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold">
            <Info className="w-3.5 h-3.5" />
            <span>Pediatric Airway Anatomical Considerations:</span>
          </div>
          <p className="leading-relaxed">
            In neonates and young infants, the occiput is prominent (place a shoulder roll to achieve a sniffing position). The tongue is relatively large and larynx is high and anterior (C3-C4). The narrowest segment of the pediatric airway is at the nondistensible cricoid ring.
          </p>
        </div>
      </div>
    </div>
  );
};
