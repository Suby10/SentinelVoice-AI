import React from 'react';
import { MessageSquareWarning, ShieldAlert } from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface ContextAnalysisCardProps {
  data: NormalizedAnalysis;
}

export const ContextAnalysisCard: React.FC<ContextAnalysisCardProps> = ({ data }) => {
  if (!data.contextRisk) {
    return (
      <div className="bg-surface rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 text-appTextSecondary text-xs font-medium">
          <MessageSquareWarning className="w-3.5 h-3.5 text-appTextMuted" />
          <span>Conversation Intelligence</span>
        </div>
        <p className="text-xs text-appTextMuted mt-2 italic">
          Natural Language semantic context analysis is not configured on this baseline model.
        </p>
      </div>
    );
  }

  const { score, level, signals } = data.contextRisk;

  const levelColor =
    level === 'HIGH'
      ? '#ef4444'
      : level === 'MEDIUM'
      ? '#d97706'
      : '#059669';

  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-appTextMuted" />
          <h4 className="text-[10px] font-medium uppercase tracking-widest text-appTextMuted">
            Conversation Intelligence
          </h4>
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded font-medium border"
          style={{
            color: levelColor,
            background: `${levelColor}0a`,
            borderColor: `${levelColor}20`,
          }}
        >
          {level} ({score}/100)
        </span>
      </div>

      <p className="text-[11px] text-appTextMuted mb-3">
        Detected Social Engineering & Coercion Signals:
      </p>

      {signals.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {signals.map((sig, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-surfaceHover border border-border text-appTextSecondary text-[11px] font-mono capitalize"
            >
              {sig.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-appTextMuted italic">
          No overt manipulation signals reported.
        </p>
      )}
    </div>
  );
};
