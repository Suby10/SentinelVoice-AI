import React from 'react';
import { ShieldCheck, Activity, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

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
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-base/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-appTextMuted" />
          <span className="text-sm font-semibold tracking-tight text-appText">
            SentinelVoice
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-appTextMuted font-mono">
            v1.0-RF
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Engine status */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-appTextMuted">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                engineOnline ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>{engineOnline ? 'Online' : 'Checking...'}</span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 border-border" style={{ background: 'var(--border)' }} />

          {/* Theme Toggle */}
          <div
            className="flex items-center rounded-md border border-border overflow-hidden"
            role="radiogroup"
            aria-label="Toggle theme"
          >
            <button
              type="button"
              role="radio"
              aria-checked={theme === 'light'}
              aria-label="Light mode"
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`flex items-center justify-center w-7 h-7 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-appText focus-visible:ring-offset-1 ${
                theme === 'light'
                  ? 'bg-surfaceHover text-appText'
                  : 'text-appTextMuted hover:text-appText'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={theme === 'dark'}
              aria-label="Dark mode"
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`flex items-center justify-center w-7 h-7 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-appText focus-visible:ring-offset-1 ${
                theme === 'dark'
                  ? 'bg-surfaceHover text-appText'
                  : 'text-appTextMuted hover:text-appText'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-4 border-border" style={{ background: 'var(--border)' }} />

          {/* Assisted toggle */}
          <button
            onClick={onToggleAssisted}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              assistedProtection
                ? 'bg-warning-bg text-warningText border border-warning-border'
                : 'text-appTextMuted hover:text-appText'
            }`}
            style={
              assistedProtection
                ? undefined
                : undefined
            }
            title="Assisted mode enlarges warnings for seniors and non-technical users"
          >
            <Activity className="w-3 h-3" />
            <span className="hidden sm:inline">
              Assist {assistedProtection ? 'On' : 'Off'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
