/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, Printer, RotateCcw, AlertTriangle } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { OfflineIndicator } from './OfflineIndicator';
import { PatientParameters } from '../types';

interface HeaderProps {
  patient: PatientParameters;
  onReset: () => void;
  onOpenSummary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  patient,
  onReset,
  onOpenSummary,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center text-white shadow-lg shadow-rose-950/50">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                PediResus &amp; Vent Setup
              </h1>
              <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-rose-950 text-rose-300 border border-rose-800">
                PALS / NRP / PALICC
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pediatric &amp; Neonatal Emergency Resuscitation, Airway &amp; Ventilator Calculator
            </p>
          </div>
        </div>

        {/* Action Controls & Offline Badges */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <OfflineIndicator />
          <PWAInstallButton />

          {/* Printable Emergency SBAR / Chart Summary */}
          <button
            id="open-summary-btn"
            onClick={onOpenSummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow transition cursor-pointer"
            title="View & Copy Bedside SBAR Emergency Summary"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bedside Summary</span>
            <span className="sm:hidden">Summary</span>
          </button>

          {/* Quick Reset */}
          <button
            id="reset-inputs-btn"
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
            title="Reset to 50 cm Term Newborn"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
