/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Share, CheckCircle2, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, show installed badge
  if (isInstalled) {
    return (
      <div
        id="pwa-installed-badge"
        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-700/60 rounded-full"
        title="App is installed on this device"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Installed App</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow transition-colors cursor-pointer"
        title="Install offline application to home screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-ios-install-btn"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 hover:border-slate-400 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          title="Install on iOS device"
        >
          <Share className="w-3.5 h-3.5 text-cyan-400" />
          <span>Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div
            id="pwa-ios-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          >
            <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  Install for 100% Offline Use
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 text-sm text-slate-300 space-y-3">
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-900 text-cyan-300 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Tap the <strong>Share</strong> button (box with upward arrow) in the Safari toolbar.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-900 text-cyan-300 flex items-center justify-center text-xs font-bold">2</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-900 text-cyan-300 flex items-center justify-center text-xs font-bold">3</span>
                  <span>Tap <strong>Add</strong> in the top right. Launch directly anytime without internet.</span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-lg bg-cyan-600 hover:bg-cyan-500 py-2 text-sm font-semibold text-white transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
