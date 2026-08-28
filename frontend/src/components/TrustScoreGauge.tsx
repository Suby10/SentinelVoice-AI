interface Props {
  score: number;
}

export default function TrustScoreGauge({ score }: Props) {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;

  const circumference = normalizedRadius * 2 * Math.PI;

  const offset =
    circumference - (score / 100) * circumference;

  const color =
    score >= 70
      ? "#22c55e"
      : score >= 40
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="flex justify-center">
      <svg width="150" height="150">
        <circle
          stroke="#1e293b"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="75"
          cy="75"
        />

        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          r={normalizedRadius}
          cx="75"
          cy="75"
          transform="rotate(-90 75 75)"
        />

        <text
          x="75"
          y="70"
          textAnchor="middle"
          className="fill-white text-xl font-bold"
        >
          {score}
        </text>

        <text
          x="75"
          y="92"
          textAnchor="middle"
          className="fill-slate-400 text-xs"
        >
          Trust
        </text>
      </svg>
    </div>
  );
}