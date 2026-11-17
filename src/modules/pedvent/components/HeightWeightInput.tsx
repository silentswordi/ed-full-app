/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Ruler, Scale } from 'lucide-react';
import { PatientParameters, BroselowColor } from '../types';

interface HeightWeightInputProps {
  patient: PatientParameters;
  onHeightChange: (heightCm: number) => void;
}

const BROSELOW_COLOR_MAP: Record<BroselowColor, { bg: string; text: string; border: string; label: string }> = {
  grey: { bg: 'bg-slate-700', text: 'text-slate-100', border: 'border-slate-500', label: 'Grey (0-5 kg)' },
  pink: { bg: 'bg-pink-600', text: 'text-white', border: 'border-pink-400', label: 'Pink (6-7 kg)' },
  red: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-400', label: 'Red (8-9 kg)' },
  purple: { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-400', label: 'Purple (10-11 kg)' },
  yellow: { bg: 'bg-amber-500', text: 'text-slate-950', border: 'border-amber-300', label: 'Yellow (12-14 kg)' },
  white: { bg: 'bg-slate-100', text: 'text-slate-900', border: 'border-slate-300', label: 'White (15-18 kg)' },
  blue: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-400', label: 'Blue (19-23 kg)' },
  orange: { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-400', label: 'Orange (24-29 kg)' },
  green: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-400', label: 'Green (30-36 kg)' },
  adult: { bg: 'bg-cyan-700', text: 'text-white', border: 'border-cyan-400', label: 'Adolescent (>36 kg)' },
};

export const HeightWeightInput: React.FC<HeightWeightInputProps> = ({
  patient,
  onHeightChange,
}) => {
  const broselowStyle = BROSELOW_COLOR_MAP[patient.broselowColor] || BROSELOW_COLOR_MAP.grey;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onHeightChange(val);
    }
  };

  return (
    <section
      id="patient-input-section"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-3.5 shadow-sm dark:shadow-lg relative overflow-hidden transition-colors"
    >
      {/* Broselow color top indicator banner */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${broselowStyle.bg} transition-all duration-300`}
        title={`Broselow Zone: ${patient.broselowLabel}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center mt-0.5">
        {/* Left Column: Height Slider (Multiples of 5 only) */}
        <div className="lg:col-span-7 space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400 shrink-0">
                <Ruler className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  Patient Height / Length
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Step 5 cm (30 &ndash; 180 cm)
                </p>
              </div>
            </div>

            {/* Current Height Display */}
            <div className="flex items-baseline gap-1 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0 whitespace-nowrap">
              <span className="text-lg sm:text-xl font-black text-cyan-700 dark:text-cyan-400 font-mono tracking-tight leading-none">
                {patient.heightCm}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-none">cm</span>
            </div>
          </div>

          {/* Slider Only */}
          <div className="space-y-1 pt-0.5">
            <div className="relative">
              <input
                id="height-range-slider"
                type="range"
                min="30"
                max="180"
                step="5"
                value={patient.heightCm}
                onChange={handleSliderChange}
                className="w-full h-2 bg-slate-200 dark:bg-slate-950 rounded-md appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-400 border border-slate-300 dark:border-slate-700"
              />
            </div>

            {/* Stepped Scale Indicator Markers */}
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 px-0.5 font-mono select-none">
              <span className={patient.heightCm === 30 ? 'text-cyan-700 dark:text-cyan-400 font-bold' : ''}>30cm</span>
              <span className={patient.heightCm === 50 ? 'text-cyan-700 dark:text-cyan-400 font-bold' : ''}>50cm</span>
              <span className={patient.heightCm === 75 ? 'text-cyan-700 dark:text-cyan-400 font-bold' : ''}>75cm</span>
              <span className={patient.heightCm === 100 ? 'text-cyan-700 dark:text-cyan-400 font-bold' : ''}>100cm</span>
              <span className={patient.heightCm === 130 ? 'text-cyan-700 dark:text-cyan-400 font-bold' : ''}>130cm</span>
              <span className={patient.heightCm === 160 ? 'text-cyan-700 dark:text-cyan-400 font-bold' : ''}>160cm</span>
              <span className={patient.heightCm === 180 ? 'text-cyan-700 dark:text-cyan-400 font-bold' : ''}>180cm</span>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Weight & Broselow Zone */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 space-y-1.5 min-w-0">
          {/* Working Weight Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider truncate">
                <Scale className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Working Weight
              </div>
              <div className="flex items-baseline gap-1 mt-0.5 whitespace-nowrap">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight leading-none">
                  {patient.actualWeightKg.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-none">kg</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono ml-0.5 leading-none">
                  ({(patient.actualWeightKg * 2.20462).toFixed(1)} lbs)
                </span>
              </div>
            </div>

            {/* Broselow Tape Classification */}
            <div
              className={`px-2 py-1 rounded-md font-bold text-[10px] sm:text-[11px] flex items-center gap-1.5 border ${broselowStyle.bg} ${broselowStyle.text} ${broselowStyle.border} shadow-sm shrink-0 whitespace-nowrap`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/70 border border-white/90"></span>
              <span>{patient.broselowLabel}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/80 min-w-0">
            <span className="truncate">Category: <strong className="text-slate-800 dark:text-slate-200">{patient.categoryLabel}</strong></span>
            <span className="text-emerald-700 dark:text-emerald-400/90 font-mono shrink-0 whitespace-nowrap">Length-based</span>
          </div>
        </div>
      </div>
    </section>
  );
};
