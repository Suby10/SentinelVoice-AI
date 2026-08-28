import React from 'react';
import { MessageSquareWarning, ShieldAlert } from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface ContextAnalysisCardProps {
  data: NormalizedAnalysis;
}

export const ContextAnalysisCard: React.FC<ContextAnalysisCardProps> = ({ data }) => {
  if (!data.contextRisk) {
    return (
      <div className="bg-slate-900/60 rounded-xl border border-slate-800/70 p-5">
        <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
          <MessageSquareWarning className="w-4 h-4 text-slate-500" />
          <span>Conversation Intelligence</span>
        </div>

        <p className="text-xs text-slate-500 mt-2 italic">
          Natural Language semantic context analysis is not configured on this baseline model.
        </p>
      </div>
    );
  }

  const { score, level, signals } = data.contextRisk;

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Conversation Intelligence
          </h4>
        </div>

        <span
          className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
            level === 'HIGH'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : level === 'MEDIUM'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          {level} RISK ({score}/100)
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Detected Social Engineering & Coercion Signals:
      </p>

      {signals.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {signals.map((sig, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono capitalize"
            >
              {sig.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic">
          No overt manipulation signals reported.
        </p>
      )}
    </div>
  );
};

