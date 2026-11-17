/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      id="offline-ready-badge"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors bg-slate-800/90 text-slate-300 border-slate-700"
      title="All formulas, equipment tables, and medication calculators run 100% locally on this device"
    >
      {isOnline ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden sm:inline text-slate-300">Offline-Ready (Cached)</span>
          <span className="sm:hidden text-slate-300">Offline-Ready</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-amber-300 font-semibold">Active Offline Mode</span>
        </>
      )}
    </div>
  );
};
