

interface TrustGaugeProps {
  value: number;
  label: string;
}

export const TrustGauge: React.FC<TrustGaugeProps> = ({
  value,
  label,
}) => {
  const radius = 60;
  const stroke = 10;

  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;

  const offset =
    circumference - (value / 100) * circumference;

  let color = "#22c55e";

  if (value < 40) color = "#ef4444";
  else if (value < 70) color = "#f59e0b";

  return (
    <div className="flex flex-col items-center">
      <svg width="150" height="150">

        {/* Background Circle */}

        <circle
          stroke="#1e293b"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="75"
          cy="75"
        />

        {/* Progress */}

        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={normalizedRadius}
          cx="75"
          cy="75"
          transform="rotate(-90 75 75)"
        />

        <text
          x="75"
          y="72"
          textAnchor="middle"
          fill="white"
          fontSize="28"
          fontWeight="bold"
        >
          {value}%
        </text>

        <text
          x="75"
          y="94"
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="10"
        >
          {label}
        </text>
      </svg>
    </div>
  );
};