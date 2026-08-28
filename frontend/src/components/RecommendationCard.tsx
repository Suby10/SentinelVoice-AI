import React from 'react';
import { ShieldCheck, PhoneCall, AlertOctagon } from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface RecommendationCardProps {
  data: NormalizedAnalysis;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ data }) => {
  const isFake = data.prediction === 'FAKE';
  const isHighRisk = isFake || data.trustEngine?.riskLevel === 'HIGH';

  const accentColor = isHighRisk ? '#ef4444' : '#059669';

  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        {isHighRisk ? (
          <AlertOctagon className="w-3.5 h-3.5 text-appTextMuted" />
        ) : (
          <ShieldCheck className="w-3.5 h-3.5 text-appTextMuted" />
        )}
        <h4 className="text-[10px] font-medium uppercase tracking-widest text-appTextMuted">
          Recommended Security Action
        </h4>
      </div>

      <div className="mb-4 pl-3 border-l-2" style={{ borderColor: accentColor }}>
        <div className="text-sm font-semibold text-appText">
          {isHighRisk ? 'PAUSE AND VERIFY' : 'PROCEED WITH NORMAL CAUTION'}
        </div>
        <p className="text-xs text-appTextSecondary mt-1.5 leading-relaxed">
          {isHighRisk
            ? 'Do not transfer money or disclose OTPs/credentials. Disconnect and independently contact the caller via a known authentic phone number.'
            : 'No immediate synthetic voice patterns detected. Maintain general security hygiene.'}
        </p>
      </div>

      {data.recommendations.length > 0 && (
        <div className="mb-4 space-y-1.5">
          {data.recommendations.map((rec, i) => (
            <div
              key={i}
              className="text-xs text-appTextSecondary flex items-start gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-appTextMuted mt-1.5 shrink-0" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      )}

      <div className="pt-3 border-t border-border">
        <button
          type="button"
          onClick={() =>
            alert('Initiating verification sequence (UI Placeholder for demo)')
          }
          className="flex items-center gap-1.5 text-[11px] text-appTextSecondary hover:text-appText transition-colors"
        >
          <PhoneCall className="w-3 h-3" />
          <span>Independent Callback Check</span>
        </button>
      </div>
    </div>
  );
};
