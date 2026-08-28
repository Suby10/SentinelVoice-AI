import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface Props {
  data: NormalizedAnalysis;
}

export const RecommendationCardV2: React.FC<Props> = ({ data }) => {
  const isFake = data.prediction === 'FAKE';
  const isHighRisk = isFake || data.trustEngine?.riskLevel === 'HIGH';
  const riskLevel = data.trustEngine?.riskLevel ?? 'UNKNOWN';
  const decision = data.trustEngine?.decision ?? 'UNKNOWN';

  const accentColor = isHighRisk ? '#ef4444' : '#22c55e';
  const accentBg = isHighRisk ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.06)';

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl shadow-black/30 relative overflow-hidden group">
      {/* Ambient glow */}
      <div
        className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-[80px] opacity-[0.06] pointer-events-none transition-colors duration-700"
        style={{ background: accentColor }}
      />

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5 relative">
        <div className="flex items-center gap-2.5">
          <div
            className="p-2 rounded-xl border"
            style={{ background: accentBg, borderColor: `${accentColor}20` }}
          >
            {isHighRisk ? (
              <ShieldAlert className="w-4 h-4" style={{ color: accentColor }} />
            ) : (
              <ShieldCheck className="w-4 h-4" style={{ color: accentColor }} />
            )}
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Recommended Security Action
            </h3>
            <p className="text-[10px] text-slate-600 mt-0.5">
              AI-generated protective guidance
            </p>
          </div>
        </div>

        {/* Risk badge */}
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border"
          style={{
            color: accentColor,
            background: accentBg,
            borderColor: `${accentColor}25`,
          }}
        >
          {isHighRisk ? (
            <AlertTriangle className="w-3 h-3" />
          ) : (
            <CheckCircle className="w-3 h-3" />
          )}
          {riskLevel}
        </div>
      </div>

      {/* ── Primary Action Banner ── */}
      <div
        className="rounded-xl border p-4 mb-4 relative overflow-hidden"
        style={{
          background: accentBg,
          borderColor: `${accentColor}15`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
            style={{
              background: `${accentColor}18`,
              borderColor: `${accentColor}30`,
            }}
          >
            {isHighRisk ? (
              <AlertTriangle className="w-5 h-5" style={{ color: accentColor }} />
            ) : (
              <CheckCircle className="w-5 h-5" style={{ color: accentColor }} />
            )}
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight">
              {isHighRisk ? 'PAUSE AND VERIFY' : 'PROCEED WITH CAUTION'}
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {isHighRisk
                ? 'Do not transfer money or disclose OTPs/credentials. Disconnect and independently contact the caller via a known authentic phone number.'
                : 'No immediate synthetic voice patterns detected. Maintain general security hygiene.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Recommendations List ── */}
      {data.recommendations.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Action Items
            </span>
            <span className="text-[10px] text-slate-600 bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded-full font-mono">
              {data.recommendations.length}
            </span>
          </div>
          {data.recommendations.map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] transition-all group/item"
            >
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}20` }}
              >
                <ArrowRight className="w-3 h-3" style={{ color: accentColor }} />
              </div>
              <span className="text-sm text-slate-300 leading-relaxed flex-1">
                {rec}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Action Button ── */}
      <div className="pt-3 border-t border-white/[0.05] flex items-center gap-3 relative">
        <button
          type="button"
          onClick={() =>
            alert('Initiating verification sequence (UI Placeholder for demo)')
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: accentBg,
            color: accentColor,
            borderColor: `${accentColor}25`,
          }}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          Independent Callback Check
          <ExternalLink className="w-3 h-3 opacity-50" />
        </button>

        <span className="text-[10px] text-slate-600">
          Decision: <span className="font-bold text-slate-400">{decision}</span>
        </span>
      </div>
    </div>
  );
};

export default RecommendationCardV2;
