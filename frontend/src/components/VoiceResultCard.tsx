import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface VoiceResultCardProps {
  data: NormalizedAnalysis;
}

export const VoiceResultCard: React.FC<VoiceResultCardProps> = ({ data }) => {
  const isFake = data.prediction === 'FAKE';
  const isReal = data.prediction === 'REAL';

  return (
    <div className={`rounded-2xl border p-6 shadow-xl relative overflow-hidden ${
      isFake
        ? 'bg-rose-950/20 border-rose-800/40'
        : isReal
        ? 'bg-emerald-950/20 border-emerald-800/40'
        : 'bg-slate-900/60 border-slate-800'
    }`}>
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full filter blur-3xl opacity-10 pointer-events-none ${
        isFake ? 'bg-rose-500' : 'bg-emerald-500'
      }`} />

      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Voice Authenticity
          </span>
          <h3 className="text-xs text-slate-500">
            Acoustic Feature Classification
          </h3>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {data.analyzedAt}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 my-2">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${
            isFake
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              : isReal
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            {isFake ? (
              <AlertTriangle className="w-8 h-8" />
            ) : isReal ? (
              <CheckCircle className="w-8 h-8" />
            ) : (
              <HelpCircle className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className={`text-2xl font-black tracking-tight uppercase ${
              isFake
                ? 'text-rose-400'
                : isReal
                ? 'text-emerald-400'
                : 'text-slate-300'
            }`}>
              {data.predictionLabel}
            </div>

            <p className="text-xs text-slate-400 mt-0.5">
              Source file:{' '}
              <span className="font-mono text-slate-300">
                {data.filename}
              </span>
            </p>
          </div>
        </div>

        <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Model Confidence
          </div>

          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {data.confidencePercentage}%
          </div>

          <div className="w-36 bg-slate-800 h-2 rounded-full mt-1.5 overflow-hidden border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isFake ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${data.confidencePercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          Classifier: Random Forest (38 Acoustic Features)
        </span>

        <span className="text-slate-500">
          Unseen test-set baseline: ~72.7%
        </span>
      </div>
    </div>
  );
};
