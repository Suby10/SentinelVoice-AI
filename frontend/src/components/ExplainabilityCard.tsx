import React from 'react';
import { HelpCircle } from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface ExplainabilityCardProps {
  data: NormalizedAnalysis;
}

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({ data }) => {
  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-3.5 h-3.5 text-appTextMuted" />
        <h4 className="text-[10px] font-medium uppercase tracking-widest text-appTextMuted">
          Why Was This Call Flagged?
        </h4>
      </div>

      {data.reasons.length > 0 ? (
        <ul className="space-y-2">
          {data.reasons.map((reason, index) => (
            <li
              key={index}
              className="text-xs text-appText flex items-start gap-2.5 pl-3 border-l-2 border-warningText/30"
            >
              <span className="leading-relaxed">{reason}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-[11px] text-appTextMuted italic">
          {data.isSuspicious
            ? 'Flagged by acoustic feature divergence in spectral centroid and mel-frequency cepstral coefficients.'
            : 'No abnormal voice cloning patterns or anomaly signals detected.'}
        </div>
      )}
    </div>
  );
};
