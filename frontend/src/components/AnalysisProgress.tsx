import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import type { AnalysisStage } from '../types/analysis';

interface AnalysisProgressProps {
  stage: AnalysisStage;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ stage }) => {
  const stages = [
    { id: 'uploading', label: 'Audio Received' },
    { id: 'extracting_features', label: 'Extracting Acoustic Features (38 Features)' },
    { id: 'evaluating_model', label: 'Evaluating Random Forest Classifier' },
    { id: 'complete', label: 'Analysis Complete' },
  ];

  const getStageIndex = (s: AnalysisStage) => {
    switch (s) {
      case 'uploading':
        return 0;
      case 'extracting_features':
        return 1;
      case 'evaluating_model':
        return 2;
      case 'complete':
        return 3;
      default:
        return -1;
    }
  };

  const currentIndex = getStageIndex(stage);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
        <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
          Processing Security Pipeline
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {stages.map((stg, idx) => {
          const isDone =
            currentIndex > idx || stage === 'complete';

          const isCurrent =
            currentIndex === idx && stage !== 'complete';

          return (
            <div
              key={stg.id}
              className={`p-2.5 rounded-lg border text-xs flex items-center space-x-2 transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 ring-1 ring-indigo-500/30'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
              )}

              <span className="truncate">
                {stg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
