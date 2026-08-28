import React from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface ExplainabilityCardProps {
  data: NormalizedAnalysis;
}

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({ data }) => {
  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 shadow-lg">
      <div className="flex items-center space-x-2 mb-3">
        <HelpCircle className="w-4 h-4 text-indigo-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
          Why Was This Call Flagged?
        </h4>
      </div>

      {data.reasons.length > 0 ? (
        <ul className="space-y-2">
          {data.reasons.map((reason, index) => (
            <li
              key={index}
              className="text-xs text-slate-300 flex items-start space-x-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-xs text-slate-500 italic bg-slate-950/30 p-3 rounded-lg border border-slate-800/40">
          {data.isSuspicious
            ? 'Flagged by acoustic feature divergence in spectral centroid and mel-frequency cepstral coefficients.'
            : 'No abnormal voice cloning patterns or anomaly signals detected.'}
        </div>
      )}
    </div>
  );
};
