import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
interface HeaderProps {
  engineOnline: boolean;
  assistedProtection: boolean;
  onToggleAssisted: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  engineOnline,
  assistedProtection,
  onToggleAssisted,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">SentinelVoice</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                v1.0-RF
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              AI-Powered Voice Impersonation Protection
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                engineOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-slate-300 font-medium">
              {engineOnline ? 'AI Engine Online' : 'Checking Engine...'}
            </span>
          </div>

          {/* Assisted Mode Toggle for Elderly / High-Risk Users */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <button
              onClick={onToggleAssisted}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
                assistedProtection
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
              title="Assisted mode enlarges warnings for seniors and non-technical users"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Assisted Protection: {assistedProtection ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};