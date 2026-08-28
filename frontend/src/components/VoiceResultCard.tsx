import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface VoiceResultCardProps {
  data: NormalizedAnalysis;
}

export const VoiceResultCard: React.FC<VoiceResultCardProps> = ({ data }) => {
  const riskLevel = data.trustEngine?.riskLevel ?? 'UNKNOWN';
  const trustScore = data.trustEngine?.trustScore ?? 0;
  const overallRisk = data.trustEngine?.overallRiskScore ?? 0;
  const decision = data.trustEngine?.decision ?? 'No decision available';

  const isFake = data.prediction === 'FAKE';
  const isReal = data.prediction === 'REAL';

  const accentColor =
    riskLevel === 'HIGH'
      ? '#ef4444'
      : riskLevel === 'MEDIUM'
      ? '#d97706'
      : '#059669';

  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-medium uppercase tracking-widest text-appTextMuted">
          Voice Analysis
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border"
          style={{
            color: accentColor,
            background: `${accentColor}0a`,
            borderColor: `${accentColor}20`,
          }}
        >
          {isFake ? (
            <AlertTriangle className="w-3 h-3" />
          ) : isReal ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <HelpCircle className="w-3 h-3" />
          )}
          {riskLevel}
        </div>
      </div>

      {/* Prediction */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-lg font-semibold"
            style={{ color: accentColor }}
          >
            {data.prediction}
          </span>
          <span className="text-xs text-appTextMuted">
            {data.predictionLabel}
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-surfaceHover border border-border">
          <div className="text-[10px] text-appTextMuted uppercase tracking-wider mb-1">
            Trust Score
          </div>
          <div className="text-lg font-semibold text-appText tabular-nums">
            {trustScore}%
          </div>
        </div>
        <div className="p-3 rounded-lg bg-surfaceHover border border-border">
          <div className="text-[10px] text-appTextMuted uppercase tracking-wider mb-1">
            Overall Risk
          </div>
          <div className="text-lg font-semibold tabular-nums" style={{ color: accentColor }}>
            {overallRisk}%
          </div>
        </div>
      </div>

      {/* Decision */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-appTextSecondary">{decision}</span>
        <span className="text-[10px] text-appTextMuted font-mono">{data.analyzedAt}</span>
      </div>
    </div>
  );
};
