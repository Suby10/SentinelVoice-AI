import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface AssistedProtectionProps {
  data: NormalizedAnalysis;
}

export const AssistedProtection: React.FC<AssistedProtectionProps> = ({ data }) => {
  const isHighRisk = data.prediction === 'FAKE';

  return (
    <div className="bg-amber-950/40 border-2 border-amber-500 rounded-2xl p-6 sm:p-8 my-6 text-white shadow-2xl animate-fade-in">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-amber-500 text-slate-950 rounded-xl font-bold">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            Assisted Protection Alert
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-100">
            {isHighRisk
              ? 'STOP — THIS CALL MAY BE DANGEROUS'
              : 'VOICE CALL APPEARS SAFE'}
          </h2>
        </div>
      </div>

      {isHighRisk ? (
        <div className="space-y-4">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30">
            <h3 className="text-sm font-bold text-amber-300 mb-2 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Warning signs detected in this recording:</span>
            </h3>

            <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
              <li>
                Possible AI-generated / clone voice detected (
                {data.confidencePercentage}% model confidence)
              </li>
              <li>High risk of impersonation or financial fraud</li>
            </ul>
          </div>

          <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/40">
            <h3 className="text-sm font-bold text-white mb-2">
              What you should do right now:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 text-xs font-semibold text-slate-200">
                1. DO NOT send money or share bank details.
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 text-xs font-semibold text-slate-200">
                2. Hang up and call the real person back directly.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-200">
          The acoustic characteristics match genuine human speech patterns.
          Always confirm before transferring funds.
        </p>
      )}
    </div>
  );
};
