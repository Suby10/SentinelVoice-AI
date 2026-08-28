import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Activity,
  Wifi,
  WifiOff,
  Clock,
  Cpu,
  Layers,
} from 'lucide-react';

interface HeaderV2Props {
  engineOnline: boolean;
  assistedProtection: boolean;
  onToggleAssisted: () => void;
}

export const HeaderV2: React.FC<HeaderV2Props> = ({
  engineOnline,
  assistedProtection,
  onToggleAssisted,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateString = currentTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl sticky top-0 z-50">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* ── Brand Identity ── */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            {/* Online pulse dot */}
            {engineOnline && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">
                SentinelVoice
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-400 font-mono border border-white/[0.08]">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">
              AI-Powered Voice Impersonation Shield
            </p>
          </div>
        </div>

        {/* ── Center Status Pills ── */}
        <div className="hidden md:flex items-center gap-3">
          {/* AI Engine Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              AI Engine
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                engineOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span
              className={`text-[10px] font-bold ${
                engineOnline ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {engineOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Backend Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            {engineOnline ? (
              <Wifi className="w-3 h-3 text-emerald-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-rose-400" />
            )}
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Backend
            </span>
            <span
              className={`text-[10px] font-bold ${
                engineOnline ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {engineOnline ? 'Connected' : 'Unreachable'}
            </span>
          </div>

          {/* Current Time */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-mono text-slate-300">
              {timeString}
            </span>
            <span className="text-[10px] text-slate-600">
              {dateString}
            </span>
          </div>
        </div>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-3">
          {/* Mobile: single status pill */}
          <div className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                engineOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-[10px] text-slate-400 font-medium">
              {engineOnline ? 'Online' : 'Checking...'}
            </span>
          </div>

          {/* Version badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <Layers className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] text-slate-500 font-mono">
              RF-38
            </span>
          </div>

          {/* Assisted Mode Toggle */}
          <button
            onClick={onToggleAssisted}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
              assistedProtection
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/25 shadow-lg shadow-amber-500/5'
                : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-slate-200 hover:border-white/[0.1]'
            }`}
            title="Assisted mode enlarges warnings for seniors and non-technical users"
          >
            <Activity className="w-3 h-3" />
            <span className="hidden sm:inline">
              Assist: {assistedProtection ? 'ON' : 'OFF'}
            </span>
            <span className="sm:hidden">
              {assistedProtection ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderV2;
