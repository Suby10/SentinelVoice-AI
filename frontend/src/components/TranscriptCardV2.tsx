import React, { useMemo } from 'react';
import {
  FileText,
  Globe,
  AudioLines,
  Copy,
  CheckCheck,
} from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface Props {
  data: NormalizedAnalysis;
}

/* ── Tiny waveform bar config ── */
const BAR_COUNT = 48;

/** Deterministic pseudo-random from a seed string */
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return (Math.abs(h) % 1000) / 1000;
}

/** Lerp between two hex colours by t ∈ [0, 1] */
function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    const v = parseInt(hex.replace('#', ''), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${bl})`;
}

/** Map trust score (0–100) to a waveform colour palette */
function getWaveformPalette(trust: number) {
  if (trust >= 70) {
    // Safe → emerald / teal
    return { base: '#10b981', mid: '#14b8a6', glow: '#34d399' };
  }
  if (trust >= 40) {
    // Suspicious → amber
    return { base: '#f59e0b', mid: '#f97316', glow: '#fbbf24' };
  }
  // Scam → rose / red
  return { base: '#ef4444', mid: '#f43f5e', glow: '#fb7185' };
}

export const TranscriptCardV2: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = React.useState(false);

  const trustScore = data.trustEngine?.trustScore ?? 50;
  const palette = getWaveformPalette(trustScore);

  /* Generate deterministic bar heights + animation durations from transcript text */
  const bars = useMemo(() => {
    const text = data.transcript?.text ?? '';
    return Array.from({ length: BAR_COUNT }, (_, i) => {
      const seed = `${text}-${i}`;
      const r = seededRandom(seed);
      const height = 12 + r * 88; // 12% – 100%
      const duration = 0.8 + seededRandom(seed + 'd') * 1.4; // 0.8s – 2.2s
      const delay = seededRandom(seed + 't') * -2; // stagger
      const opacity = 0.25 + r * 0.75;
      // Each bar gets a slightly different hue along the palette gradient
      const hueShift = r; // 0–1
      return { height, duration, delay, opacity, hueShift };
    });
  }, [data.transcript?.text]);

  const handleCopy = async () => {
    if (!data.transcript?.text) return;
    await navigator.clipboard.writeText(data.transcript.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasTranscript = Boolean(data.transcript?.text);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/30 relative overflow-hidden group">
      {/* ── Ambient glow (risk-responsive) ── */}
      <div
        className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-[80px] opacity-[0.07] pointer-events-none transition-colors duration-700"
        style={{ background: palette.glow }}
      />

      {/* ── Waveform Visualization ── */}
      <div className="relative h-28 overflow-hidden border-b border-white/[0.05]">
        {/* Gradient overlay at edges for fade-out */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 z-10 bg-gradient-to-t from-white/[0.03] to-transparent pointer-events-none" />

        {/* Bar container */}
        <div className="absolute inset-0 flex items-end justify-center gap-[2px] px-4 pb-3">
          {bars.map((bar, i) => {
            const barColor = lerpColor(palette.base, palette.mid, bar.hueShift);
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-colors duration-700"
                style={{
                  height: hasTranscript ? `${bar.height}%` : '8%',
                  opacity: hasTranscript ? bar.opacity : 0.08,
                  background: hasTranscript
                    ? `linear-gradient(to top, ${barColor}cc, ${barColor}44)`
                    : 'rgba(255,255,255,0.04)',
                  animation: hasTranscript
                    ? `waveBar ${bar.duration}s ease-in-out ${bar.delay}s infinite alternate`
                    : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Center play icon overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {hasTranscript && (
            <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <AudioLines className="w-4 h-4" style={{ color: palette.glow }} />
            </div>
          )}
        </div>

        {/* Inline keyframes injected once */}
        <style>{`
          @keyframes waveBar {
            0%   { transform: scaleY(1); }
            100% { transform: scaleY(0.35); }
          }
        `}</style>
      </div>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 relative">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08]">
            <FileText className="w-3.5 h-3.5" style={{ color: palette.glow }} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Conversation Transcript
            </h3>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Extracted from audio analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language badge */}
          {data.transcript && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">
                {data.transcript.language}
              </span>
            </div>
          )}

          {/* Copy button */}
          {hasTranscript && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all text-[10px] text-slate-400 font-semibold"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Transcript Text ── */}
      <div className="px-5 pb-5 relative">
        {hasTranscript ? (
          <div className="max-h-40 overflow-y-auto pr-2 text-sm leading-relaxed text-slate-300 bg-white/[0.02] p-4 rounded-xl border border-white/[0.05] font-sans select-text scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <span style={{ color: `${palette.glow}99` }} className="text-lg leading-none">&ldquo;</span>
            {data.transcript.text}
            <span style={{ color: `${palette.glow}99` }} className="text-lg leading-none">&rdquo;</span>
          </div>
        ) : (
          <div className="text-xs text-slate-600 italic bg-white/[0.02] p-4 rounded-xl border border-white/[0.04] flex items-center gap-2">
            <AudioLines className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            Speech transcription is not available in current analysis.
          </div>
        )}

        {/* Word count */}
        {hasTranscript && (
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
            <span>
              {data.transcript.text.split(/\s+/).filter(Boolean).length} words
            </span>
            <span>{data.transcript.text.length} characters</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptCardV2;
