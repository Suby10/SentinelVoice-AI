import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface AssistedProtectionProps {
  data: NormalizedAnalysis;
}

export const AssistedProtection: React.FC<AssistedProtectionProps> = ({ data }) => {
  const isHighRisk = data.prediction === 'FAKE';

  return (
    <div
      className="bg-surface border rounded-xl p-5 pl-4 border-l-[3px]"
      style={{ borderColor: 'var(--warning-border)', borderLeftColor: 'var(--warning-text)' }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <ShieldAlert className="w-5 h-5 text-warningText" />
        <div>
          <span className="text-[10px] uppercase font-medium tracking-wider text-warningText/80">
            Assisted Protection Alert
          </span>
          <h2 className="text-sm font-semibold text-appText mt-0.5">
            {isHighRisk
              ? 'This Call May Be Dangerous'
              : 'Voice Call Appears Safe'}
          </h2>
        </div>
      </div>

      {isHighRisk ? (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-surfaceHover border border-border">
            <h3 className="text-xs font-medium text-warningText/80 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" />
              Warning signs detected:
            </h3>
            <ul className="text-xs text-appText space-y-1 ml-4 list-disc">
              <li>
                Possible AI-generated / clone voice detected (
                {data.confidencePercentage}% model confidence)
              </li>
              <li>High risk of impersonation or financial fraud</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-surfaceHover border border-border">
            <h3 className="text-xs font-medium text-appText mb-2">
              What you should do right now:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-surfaceHover border border-border text-[11px] text-appText">
                1. DO NOT send money or share bank details.
              </div>
              <div className="p-2.5 rounded-lg bg-surfaceHover border border-border text-[11px] text-appText">
                2. Hang up and call the real person back directly.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-appTextSecondary leading-relaxed">
          The acoustic characteristics match genuine human speech patterns.
          Always confirm before transferring funds.
        </p>
      )}
    </div>
  );
};
