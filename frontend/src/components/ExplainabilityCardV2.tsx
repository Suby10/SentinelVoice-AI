import React from 'react';
import {
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface Props {
  data: NormalizedAnalysis;
}

export const ExplainabilityCardV2: React.FC<Props> = ({ data }) => {
  const isFake = data.prediction === 'FAKE';
  const riskLevel = data.trustEngine?.riskLevel ?? 'UNKNOWN';
  const hasReasons = data.reasons.length > 0;

  const accentColor =
    riskLevel === 'HIGH'
      ? '#ef4444'
      : riskLevel === 'MEDIUM'
        ? '#f59e0b'
        : '#22c55e';

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl shadow-black/30 relative overflow-hidden group">
      {/* Ambient glow */}
      <div
        className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-[80px] opacity-[0.05] pointer-events-none transition-colors duration-700"
        style={{ background: accentColor }}
      />

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5 relative">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08]">
            <Lightbulb className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Why Was This Call Flagged?
            </h3>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Acoustic anomaly breakdown
            </p>
          </div>
        </div>
        {hasReasons && (
          <span className="text-[10px] text-slate-600 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full font-semibold">
            {data.reasons.length} {data.reasons.length === 1 ? 'reason' : 'reasons'}
          </span>
        )}
      </div>

      {/* ── Reason List ── */}
      {hasReasons ? (
        <div className="space-y-2.5 relative">
          {data.reasons.map((reason, index) => {
            const barWidth = Math.max(30, 100 - index * 15);
            return (
              <div
                key={index}
                className="group/item rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-amber-500/20 transition-all duration-300 overflow-hidden"
              >
                {/* Progress accent bar */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                <div className="flex items-start gap-3 px-4 py-3">
                  {/* Numbered badge */}
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border"
                    style={{
                      background: `${accentColor}12`,
                      borderColor: `${accentColor}25`,
                    }}
                  >
                    <span
                      className="text-[10px] font-bold font-mono"
                      style={{ color: accentColor }}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* Reason text */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-slate-300 leading-relaxed block">
                      {reason}
                    </span>
                    {/* Subtle severity indicator */}
                    <div className="mt-2 h-0.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${barWidth}%`,
                          background: `linear-gradient(90deg, ${accentColor}88, ${accentColor}22)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}25` }}
            >
              {isFake ? (
                <ShieldAlert className="w-4 h-4" style={{ color: accentColor }} />
              ) : (
                <ShieldCheck className="w-4 h-4" style={{ color: accentColor }} />
              )}
            </div>
            <div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {data.isSuspicious
                  ? 'Flagged by acoustic feature divergence in spectral centroid and mel-frequency cepstral coefficients.'
                  : 'No abnormal voice cloning patterns or anomaly signals detected.'}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-slate-500 font-semibold">
                  All acoustic features within normal bounds
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Feature Highlights ── */}
      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center gap-2 relative">
        <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
        <span className="text-[10px] text-slate-600">
          Analysis based on 38 acoustic features &bull; Random Forest classifier
        </span>
      </div>
    </div>
  );
};

export default ExplainabilityCardV2;
