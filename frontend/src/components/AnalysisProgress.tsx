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
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Loader2 className="w-3.5 h-3.5 text-appTextMuted animate-spin" />
        <span className="text-[11px] font-medium text-appTextMuted uppercase tracking-wider">
          Processing Security Pipeline
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5">
        {stages.map((stg, idx) => {
          const isDone = currentIndex > idx || stage === 'complete';
          const isCurrent = currentIndex === idx && stage !== 'complete';

          return (
            <div
              key={stg.id}
              className={`p-2.5 rounded-lg text-[11px] flex items-center gap-2 transition-colors ${
                isDone
                  ? 'text-successText'
                  : isCurrent
                  ? 'text-appText bg-surfaceHover'
                  : 'text-appTextMuted'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3 h-3 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-3 h-3 animate-spin shrink-0" />
              ) : (
                <div className="w-3 h-3 rounded-full border border-border shrink-0" />
              )}
              <span className="truncate">{stg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
