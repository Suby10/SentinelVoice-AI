
import type { NormalizedAnalysis } from '../types/analysis';

interface Props {
  data: NormalizedAnalysis;
}

export const TrustScoreCard: React.FC<Props> = ({ data }) => {
  const trustScore = data.trustEngine?.trustScore ?? 0;
  const overallRisk = data.trustEngine?.overallRiskScore ?? 0;
  const riskLevel = data.trustEngine?.riskLevel ?? 'UNKNOWN';
  const decision = data.trustEngine?.decision ?? 'No decision';

  const riskColor =
    riskLevel === 'HIGH'
      ? '#ef4444'
      : riskLevel === 'MEDIUM'
      ? '#d97706'
      : '#059669';

  // SVG arc gauge
  const size = 180;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const startAngle = 135;
  const endAngle = 405;
  const totalAngle = endAngle - startAngle;
  const arcLength = (totalAngle / 360) * circumference;
  const fillLength = (trustScore / 100) * arcLength;

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-widest text-appTextMuted">
            Trust Engine
          </div>
          <h2 className="text-base font-semibold text-appText mt-1">
            Overall Security Assessment
          </h2>
        </div>
        <span className="text-[10px] text-appTextMuted font-mono">
          {data.analyzedAt}
        </span>
      </div>

      {/* Gauge + Metrics */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* SVG Arc Gauge */}
        <div className="flex flex-col items-center">
          <svg width={size} height={size} className="-rotate-[0deg]">
            {/* Background arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              className="stroke-border"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${circumference}`}
              transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
            />
            {/* Filled arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={riskColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${fillLength} ${circumference}`}
              transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
              className="transition-all duration-700"
            />
            {/* Center text */}
            <text
              x={size / 2}
              y={size / 2 - 6}
              textAnchor="middle"
              fill="var(--text)"
              fontSize="28"
              fontWeight="600"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {trustScore}%
            </text>
            <text
              x={size / 2}
              y={size / 2 + 14}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize="10"
              style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}
            >
              Trust Score
            </text>
          </svg>
        </div>

        {/* Metrics Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          {/* Trust Score */}
          <div className="p-3 rounded-lg bg-surfaceHover border border-border">
            <div className="text-[10px] text-appTextMuted uppercase tracking-wider mb-1">
              Trust Score
            </div>
            <div className="text-xl font-semibold text-appText tabular-nums">
              {trustScore}%
            </div>
          </div>

          {/* Overall Risk */}
          <div className="p-3 rounded-lg bg-surfaceHover border border-border">
            <div className="text-[10px] text-appTextMuted uppercase tracking-wider mb-1">
              Overall Risk
            </div>
            <div className="text-xl font-semibold tabular-nums" style={{ color: riskColor }}>
              {overallRisk}%
            </div>
          </div>

          {/* Risk Level */}
          <div className="p-3 rounded-lg bg-surfaceHover border border-border">
            <div className="text-[10px] text-appTextMuted uppercase tracking-wider mb-1">
              Risk Level
            </div>
            <div className="text-xl font-semibold" style={{ color: riskColor }}>
              {riskLevel}
            </div>
          </div>

          {/* Decision */}
          <div className="p-3 rounded-lg bg-surfaceHover border border-border">
            <div className="text-[10px] text-appTextMuted uppercase tracking-wider mb-1">
              AI Decision
            </div>
            <div className="text-xl font-semibold text-appText">
              {decision}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-[10px] text-appTextMuted">
        <span>Classifier: Random Forest (38 Acoustic Features)</span>
        <span>Unseen test-set baseline: ~72.7%</span>
      </div>
    </div>
  );
};
