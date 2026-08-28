import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Fingerprint,
  Activity,
  Gauge,
  Lock,
} from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface Props {
  data: NormalizedAnalysis;
}

export const VoiceResultCardV2: React.FC<Props> = ({ data }) => {
  const trustScore = data.trustEngine?.trustScore ?? 0;
  const overallRisk = data.trustEngine?.overallRiskScore ?? 0;
  const riskLevel = data.trustEngine?.riskLevel ?? 'UNKNOWN';
  const decision = data.trustEngine?.decision ?? 'UNKNOWN';

  const isFake = data.prediction === 'FAKE';
  const isReal = data.prediction === 'REAL';

  const accentColor =
    riskLevel === 'HIGH'
      ? '#ef4444'
      : riskLevel === 'MEDIUM'
        ? '#f59e0b'
        : '#22c55e';

  const RiskIcon =
    riskLevel === 'HIGH'
      ? ShieldAlert
      : riskLevel === 'LOW'
        ? ShieldCheck
        : ShieldQuestion;

  const confidenceColor =
    data.confidencePercentage >= 70
      ? '#22c55e'
      : data.confidencePercentage >= 40
        ? '#f59e0b'
        : '#ef4444';

  const riskBarColor =
    overallRisk >= 70
      ? '#ef4444'
      : overallRisk >= 40
        ? '#f59e0b'
        : '#22c55e';

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl shadow-black/30 relative overflow-hidden group">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 group-hover:opacity-[0.06] transition-opacity duration-700" />

      {/* Corner glow */}
      <div
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-[80px] opacity-10 pointer-events-none"
        style={{ background: accentColor }}
      />

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5 relative">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08]">
            <Fingerprint className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Voice Analysis
            </h3>
            <p className="text-[10px] text-slate-600">Impersonation Detection</p>
          </div>
        </div>
        <span className="text-[10px] text-slate-500 font-mono bg-white/[0.03] border border-white/[0.06] rounded-lg px-2 py-1">
          {data.analyzedAt}
        </span>
      </div>

      {/* ── Large Prediction Badge ── */}
      <div className="relative mb-5">
        <div
          className={`flex items-center justify-center gap-3 py-4 rounded-2xl border ${
            isFake
              ? 'bg-rose-500/10 border-rose-500/25'
              : isReal
                ? 'bg-emerald-500/10 border-emerald-500/25'
                : 'bg-white/[0.04] border-white/[0.08]'
          }`}
        >
          {isFake ? (
            <AlertTriangle className="w-7 h-7 text-rose-400" />
          ) : isReal ? (
            <CheckCircle className="w-7 h-7 text-emerald-400" />
          ) : (
            <HelpCircle className="w-7 h-7 text-slate-400" />
          )}
          <div className="text-center">
            <div
              className={`text-2xl font-black tracking-tight ${
                isFake ? 'text-rose-400' : isReal ? 'text-emerald-400' : 'text-slate-300'
              }`}
            >
              {data.prediction}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {data.predictionLabel}
            </div>
          </div>
        </div>
      </div>

      {/* ── Confidence Meter ── */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-violet-400" />
            Confidence Meter
          </span>
          <span
            className="text-xs font-bold font-mono"
            style={{ color: confidenceColor }}
          >
            {data.confidencePercentage}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${data.confidencePercentage}%`,
              background: `linear-gradient(90deg, ${confidenceColor}88, ${confidenceColor})`,
              boxShadow: `0 0 12px ${confidenceColor}44`,
            }}
          />
        </div>
      </div>

      {/* ── Metrics Row ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Voice Confidence */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Lock className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Voice Confidence
            </span>
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            {data.confidencePercentage}
            <span className="text-xs text-slate-400 ml-0.5">%</span>
          </div>
          <div className="mt-2 h-1 rounded-full bg-white/[0.05] overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${data.confidencePercentage}%` }}
            />
          </div>
        </div>

        {/* Overall Risk */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Gauge className="w-3 h-3" style={{ color: riskBarColor }} />
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Overall Risk
            </span>
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            {overallRisk}
            <span className="text-xs text-slate-400 ml-0.5">%</span>
          </div>
          <div className="mt-2 h-1 rounded-full bg-white/[0.05] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${overallRisk}%`,
                background: riskBarColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Trust Score + Risk Level ── */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.05] px-4 py-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}33` }}
          >
            <RiskIcon className="w-4 h-4" style={{ color: accentColor }} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Trust Score
            </div>
            <div className="text-sm font-bold text-white font-mono">
              {trustScore}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.05] px-4 py-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}33` }}
          >
            <ShieldAlert className="w-4 h-4" style={{ color: accentColor }} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Risk Level
            </div>
            <div className="text-sm font-bold font-mono" style={{ color: accentColor }}>
              {riskLevel}
            </div>
          </div>
        </div>
      </div>

      {/* ── Decision Footer ── */}
      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
        <span className="text-[10px] text-slate-600">
          Classifier: Random Forest &bull; 38 Features
        </span>
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
            decision === 'ALLOW'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              : decision === 'VERIFY'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {decision}
        </div>
      </div>
    </div>
  );
};

export default VoiceResultCardV2;
