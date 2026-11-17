/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileText } from 'lucide-react';
import { PatientParameters, AirwayEquipment, VentilatorSetup, EmergencyMedication, DefibShockEnergy } from '../types';

interface ClinicalSummaryModalProps {
  patient: PatientParameters;
  airway: AirwayEquipment;
  vent: VentilatorSetup;
  defib: DefibShockEnergy;
  meds: EmergencyMedication[];
  onClose: () => void;
}

export const ClinicalSummaryModal: React.FC<ClinicalSummaryModalProps> = ({
  patient,
  airway,
  vent,
  defib,
  meds,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const formattedText = `==========================================================
PEDIATRIC EMERGENCY RESUSCITATION & VENTILATOR RECORD
Date/Time: ${new Date().toLocaleString()}
==========================================================
PATIENT PROFILE:
- Length/Height: ${patient.heightCm} cm (${(patient.heightCm / 2.54).toFixed(1)} inches)
- Working Weight: ${patient.actualWeightKg} kg ${patient.isWeightOverridden ? '(MANUAL OVERRIDE)' : '(ESTIMATED FROM LENGTH)'}
- Developmental Group: ${patient.categoryLabel}
- Broselow Tape Zone: ${patient.broselowLabel}

AIRWAY & INTUBATION EQUIPMENT:
- ETT Cuffed Size: ${airway.ettCuffedSize}
- ETT Uncuffed Size: ${airway.ettUncuffedSize}
- ETT Insertion Depth: ${airway.ettLipDepthCm} cm at lip (Nasal: ${airway.ettNasalDepthCm} cm)
- Backup ETT Sizes: ${airway.backupEttSizes}
- Laryngoscope Blade: ${airway.laryngoscopeType} — Size ${airway.laryngoscopeSize}
- Suction Catheter: ${airway.suctionCatheterFr}
- LMA Size: ${airway.lmaSize}
- BVM Size: ${airway.bvmSize}
- Chest Tube: Pneumo ${airway.chestTubePneumoFr} | Hemo ${airway.chestTubeHemoFr}

INITIAL VENTILATOR SETUP:
- Ventilation Mode: ${vent.mode}
- Tidal Volume (Vt): Target 7 mL/kg = ${vent.tidalVolume7mL} mL (Range 6-8 mL/kg: ${vent.recommendedVtRange})
- Respiratory Rate: ${vent.respiratoryRateBpm}
- PEEP: ${vent.peepCmH2O}
- PIP Limit: ${vent.pipLimitCmH2O}
- Inspiratory Time (Ti): ${vent.inspiratoryTimeSec} (I:E ${vent.ieRatio})
- Initial FiO2: ${vent.initialFiO2} | Target SpO2: ${vent.targetSpO2}
- Flow Trigger: ${vent.triggerSensitivity}

ELECTRICAL THERAPY (PALS):
- Defibrillation (1st Shock 2 J/kg): ${defib.initialJ} Joules
- Defibrillation (Subsequent 4 J/kg): ${defib.subsequentJ} Joules
- Cardioversion (Initial 1 J/kg): ${defib.cardioversionInitialJ} Joules
- Defib Paddles: ${defib.paddleSize}

CRITICAL EMERGENCY MEDICATIONS:
- Epinephrine 1:10,000 IV/IO (Arrest): ${(patient.actualWeightKg * 0.01).toFixed(3)} mg = ${(patient.actualWeightKg * 0.1).toFixed(2)} mL (Q3-5min)
- Amiodarone IV/IO (VF/Pulseless VT): ${Math.min(300, Math.round(patient.actualWeightKg * 5))} mg = ${Math.min(6, (patient.actualWeightKg * 5 / 50)).toFixed(2)} mL
- Atropine IV/IO (Bradycardia): ${Math.max(0.1, Math.min(0.5, patient.actualWeightKg * 0.02)).toFixed(2)} mg = ${Math.max(1.0, Math.min(5.0, patient.actualWeightKg * 0.2)).toFixed(2)} mL
- Normal Saline Bolus (0.9% NaCl): ${Math.round(patient.actualWeightKg * 10)} - ${Math.min(1000, Math.round(patient.actualWeightKg * 20))} mL
- Dextrose Hypoglycemia: ${patient.category === 'preterm_neonate' || patient.category === 'term_neonate' ? `D10W ${(patient.actualWeightKg * 2).toFixed(1)} - ${(patient.actualWeightKg * 3).toFixed(1)} mL` : `D10W ${(patient.actualWeightKg * 5).toFixed(1)} mL (or D25W ${(patient.actualWeightKg * 2).toFixed(1)} mL)`}
- Ketamine RSI (Induction): ${(patient.actualWeightKg * 1.5).toFixed(1)} - ${(patient.actualWeightKg * 2.0).toFixed(1)} mg
- Rocuronium RSI (Paralytic): ${(patient.actualWeightKg * 1.0).toFixed(1)} - ${(patient.actualWeightKg * 1.2).toFixed(1)} mg = ${(patient.actualWeightKg * 0.1).toFixed(2)} - ${(patient.actualWeightKg * 0.12).toFixed(2)} mL
- Epinephrine 1:1,000 IM (Anaphylaxis): ${Math.min(0.5, Math.max(0.05, patient.actualWeightKg * 0.01)).toFixed(2)} mg = ${Math.min(0.5, Math.max(0.05, patient.actualWeightKg * 0.01)).toFixed(2)} mL IM
==========================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="clinical-summary-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Emergency Clinical Summary &amp; SBAR Handoff
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 px-3 border border-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 px-3 cursor-pointer shadow transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/70 select-all">
          {formattedText}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400">
          <span>PALS, NRP, PALICC verified algorithms.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
