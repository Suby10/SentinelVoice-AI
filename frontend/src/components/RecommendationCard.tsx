import React from 'react';
import { ShieldCheck, PhoneCall, AlertOctagon } from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface RecommendationCardProps {
  data: NormalizedAnalysis;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ data }) => {
  const isFake = data.prediction === 'FAKE';
  const isHighRisk = isFake || data.trustEngine?.riskLevel === 'HIGH';

  return (
    <div className={`rounded-xl border p-5 shadow-lg ${
      isHighRisk
        ? 'bg-rose-950/30 border-rose-800/50 text-rose-100'
        : 'bg-slate-900/80 border-slate-800 text-slate-200'
    }`}>
      <div className="flex items-center space-x-2 mb-3">
        {isHighRisk ? (
          <AlertOctagon className="w-4 h-4 text-rose-400" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        )}

        <h4 className="text-xs font-bold uppercase tracking-wider">
          Recommended Security Action
        </h4>
      </div>

      <div className="mb-3">
        <div className="text-sm font-bold tracking-tight">
          {isHighRisk ? 'PAUSE AND VERIFY' : 'PROCEED WITH NORMAL CAUTION'}
        </div>

        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          {isHighRisk
            ? 'Do not transfer money or disclose OTPs/credentials. Disconnect and independently contact the caller via a known authentic phone number.'
            : 'No immediate synthetic voice patterns detected. Maintain general security hygiene.'}
        </p>
      </div>

      {data.recommendations.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1.5">
          {data.recommendations.map((rec, i) => (
            <div
              key={i}
              className="text-xs text-slate-300 flex items-center space-x-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            alert('Initiating verification sequence (UI Placeholder for demo)')
          }
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center space-x-1.5"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Independent Callback Check</span>
        </button>
      </div>
    </div>
  );
};
