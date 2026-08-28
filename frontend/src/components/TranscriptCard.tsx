import React from 'react';
import { FileText, Globe } from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface TranscriptCardProps {
  data: NormalizedAnalysis;
}

export const TranscriptCard: React.FC<TranscriptCardProps> = ({ data }) => {
  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-appTextMuted" />
          <h4 className="text-[10px] font-medium uppercase tracking-widest text-appTextMuted">
            Conversation Transcript
          </h4>
        </div>

        {data.transcript && (
          <div className="flex items-center gap-1.5 text-[10px] text-appTextMuted">
            <Globe className="w-3 h-3" />
            <span className="uppercase font-mono">
              {data.transcript.language}
            </span>
          </div>
        )}
      </div>

      {data.transcript?.text ? (
        <div className="max-h-40 overflow-y-auto pr-2 text-xs leading-relaxed text-appText bg-surfaceHover p-3 rounded-lg border border-border font-mono select-text">
          &ldquo;{data.transcript.text}&rdquo;
        </div>
      ) : (
        <div className="text-[11px] text-appTextMuted italic">
          Speech transcription is not available in current analysis.
        </div>
      )}
    </div>
  );
};
