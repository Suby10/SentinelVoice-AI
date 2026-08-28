import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Gauge,
  Activity,
  Brain,
  BarChart3,
  Clock,
  Radio,
  Globe,
  Zap,
  Lock,
  Target,
} from 'lucide-react';
import { CircularProgress } from './CircularProgress';
import type { NormalizedAnalysis } from '../types/analysis';

interface Props {
  data: NormalizedAnalysis;
}

export const TrustDashboard: React.FC<Props> = ({ data }) => {
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

  return (
    <div className="space-y-6">
      {/* ── Top Section: Overall Security Assessment ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl shadow-black/30 relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-15 pointer-events-none"
          style={{ background: accentColor }}
        />

        <div className="flex items-center justify-between mb-6 relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08]">
              <RiskIcon className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Overall Security Assessment
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Combined Voice + Context Risk Analysis
              </p>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-mono bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1">
            {data.analyzedAt}
          </div>
        </div>

        {/* Two Circular Progress Rings */}
        <div className="flex items-center justify-center gap-12 relative py-4">
          <CircularProgress
            value={trustScore}
            color="#6366f1"
            label="Trust Score"
          />
          <div className="h-24 w-px bg-white/[0.06]" />
          <CircularProgress
            value={overallRisk}
            color={accentColor}
            label="Overall Risk"
          />
        </div>

        {/* Decision badge */}
        <div className="flex justify-center mt-4 relative">
          <div
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold border ${
              decision === 'ALLOW'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : decision === 'VERIFY'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {decision}
          </div>
        </div>
      </div>

      {/* ── Four Information Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* AI Decision */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 group hover:border-white/[0.12] transition-all">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              AI Decision
            </span>
          </div>
          <div
            className={`text-lg font-extrabold ${
              decision === 'ALLOW'
                ? 'text-emerald-400'
                : decision === 'VERIFY'
                  ? 'text-amber-400'
                  : 'text-rose-400'
            }`}
          >
            {decision}
          </div>
          <div className="mt-2 h-1 rounded-full bg-white/[0.05] overflow-hidden">
            <div
              className={`h-full rounded-full ${
                decision === 'ALLOW'
                  ? 'bg-emerald-500'
                  : decision === 'VERIFY'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
              }`}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Risk Level */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 group hover:border-white/[0.12] transition-all">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Risk Level
            </span>
          </div>
          <div className="text-lg font-extrabold" style={{ color: accentColor }}>
            {riskLevel}
          </div>
          <div className="mt-2 h-1 rounded-full bg-white/[0.05] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background: accentColor,
                width: `${overallRisk}%`,
              }}
            />
          </div>
        </div>

        {/* Voice Result */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 group hover:border-white/[0.12] transition-all">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-violet-400" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Voice Result
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFake ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : isReal ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span
              className={`text-lg font-extrabold ${
                isFake ? 'text-rose-400' : isReal ? 'text-emerald-400' : 'text-slate-300'
              }`}
            >
              {data.prediction}
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500">
            {data.predictionLabel}
          </div>
        </div>

        {/* Context Level */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 group hover:border-white/[0.12] transition-all">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Context Level
            </span>
          </div>
          <div
            className={`text-lg font-extrabold ${
              data.contextRisk?.level === 'HIGH'
                ? 'text-rose-400'
                : data.contextRisk?.level === 'MEDIUM'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
            }`}
          >
            {data.contextRisk?.level ?? 'N/A'}
          </div>
          <div className="mt-2 text-[10px] text-slate-500">
            Score: {data.contextRisk?.score ?? 0}%
          </div>
        </div>
      </div>

      {/* ── Risk Factors ── */}
      {data.reasons.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-rose-500/5 blur-[60px] pointer-events-none" />

          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Risk Factors
            </h3>
            <span className="ml-auto text-[10px] text-slate-600 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
              {data.reasons.length} detected
            </span>
          </div>

          <div className="space-y-2">
            {data.reasons.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-rose-500/20 transition-colors"
              >
                <div className="w-5 h-5 rounded-md bg-rose-500/15 border border-rose-500/25 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-rose-400">
                    {index + 1}
                  </span>
                </div>
                <span className="text-sm text-slate-300 leading-relaxed">
                  {reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Audio Information ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Audio Information
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
            <Clock className="w-4 h-4 text-indigo-400 mx-auto mb-2" />
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
              Duration
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {data.audio?.duration ?? '—'}
              <span className="text-xs text-slate-400 ml-1">s</span>
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
            <Target className="w-4 h-4 text-cyan-400 mx-auto mb-2" />
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
              Sample Rate
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {data.audio?.sampleRate ?? '—'}
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
            <Globe className="w-4 h-4 text-emerald-400 mx-auto mb-2" />
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
              Language
            </div>
            <div className="text-lg font-bold text-white font-mono uppercase">
              {data.transcript?.language ?? '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Overall Risk % + Voice Confidence % ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 relative overflow-hidden group hover:border-white/[0.12] transition-all">
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[60px] opacity-10 pointer-events-none"
            style={{ background: accentColor }}
          />
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4" style={{ color: accentColor }} />
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Overall Risk
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {overallRisk}
            <span className="text-lg text-slate-400">%</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ background: accentColor, width: `${overallRisk}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 relative overflow-hidden group hover:border-white/[0.12] transition-all">
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[60px] opacity-10 bg-indigo-500 pointer-events-none" />
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Voice Confidence
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {data.confidencePercentage}
            <span className="text-lg text-slate-400">%</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-1000"
              style={{ width: `${data.confidencePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Classifier Footer ── */}
      <div className="text-center text-[10px] text-slate-600 pb-2">
        Classifier: Random Forest (38 Acoustic Features) &bull; Unseen test-set
        baseline: ~72.7%
      </div>
    </div>
  );
};

export default TrustDashboard;
