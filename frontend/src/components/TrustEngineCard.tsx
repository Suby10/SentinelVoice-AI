import React from 'react';
import type { NormalizedAnalysis } from '../types/analysis';

interface Props {
  data: NormalizedAnalysis;
}

export const TrustEngineCard: React.FC<Props> = ({ data }) => {
  const trust = data.trustEngine?.trustScore ?? 0;
  const risk = data.trustEngine?.overallRiskScore ?? 0;
  const decision = data.trustEngine?.decision ?? 'UNKNOWN';
  const level = data.trustEngine?.riskLevel ?? 'UNKNOWN';

  const levelColor =
    level === 'HIGH'
      ? '#ef4444'
      : level === 'MEDIUM'
      ? '#d97706'
      : '#059669';

  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <div className="text-[10px] font-medium uppercase tracking-widest text-appTextMuted mb-4">
        Trust Engine
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Trust Score */}
        <div className="p-3 rounded-lg bg-surfaceHover border border-border">
          <div className="text-[10px] text-appTextMuted uppercase tracking-wider mb-2">Trust</div>
          <div className="text-2xl font-semibold text-appText tabular-nums">{trust}%</div>
          <div className="mt-2 h-1 rounded-full bg-surfaceHover overflow-hidden border border-border">
            <div
              className="h-full rounded-full bg-successText/60"
              style={{ width: `${trust}%` }}
            />
          </div>
        </div>

        {/* Risk Score */}
        <div className="p-3 rounded-lg bg-surfaceHover border border-border">
          <div className="text-[10px] text-appTextMuted uppercase tracking-wider mb-2">Risk</div>
          <div className="text-2xl font-semibold tabular-nums" style={{ color: levelColor }}>{risk}%</div>
          <div className="mt-2 h-1 rounded-full bg-surfaceHover overflow-hidden border border-border">
            <div
              className="h-full rounded-full"
              style={{ width: `${risk}%`, background: levelColor }}
            />
          </div>
        </div>

        {/* AI Decision */}
        <div className="p-3 rounded-lg bg-surfaceHover border border-border">
          <div className="text-[10px] text-appTextMuted uppercase tracking-wider mb-2">AI Decision</div>
          <div
            className={`text-sm font-semibold ${
              decision === 'ALLOW'
                ? 'text-successText'
                : decision === 'VERIFY'
                ? 'text-warningText'
                : 'text-errorText'
            }`}
          >
            {decision}
          </div>
        </div>

        {/* Voice Result */}
        <div className="p-3 rounded-lg bg-surfaceHover border border-border">
          <div className="text-[10px] text-appTextMuted uppercase tracking-wider mb-2">Voice Result</div>
          <div className="text-sm font-semibold text-appText">{data.predictionLabel}</div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border text-[10px] text-appTextMuted">
        Risk Level: <span style={{ color: levelColor }} className="font-medium">{level}</span>
      </div>
    </div>
  );
};
