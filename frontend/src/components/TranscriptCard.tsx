import React from 'react';
import { FileText, Globe } from 'lucide-react';
import type { NormalizedAnalysis } from '../types/analysis';

interface TranscriptCardProps {
  data: NormalizedAnalysis;
}

export const TranscriptCard: React.FC<TranscriptCardProps> = ({ data }) => {
  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Conversation Transcript
          </h4>
        </div>

        {data.transcript && (
          <div className="flex items-center space-x-1 text-[11px] text-slate-400">
            <Globe className="w-3 h-3" />
            <span className="uppercase font-mono">
              {data.transcript.language}
            </span>
          </div>
        )}
      </div>

      {data.transcript?.text ? (
        <div className="max-h-40 overflow-y-auto pr-2 text-xs leading-relaxed text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 font-sans select-text">
          &ldquo;{data.transcript.text}&rdquo;
        </div>
      ) : (
        <div className="text-xs text-slate-500 italic bg-slate-950/30 p-3 rounded-lg border border-slate-800/40">
          Speech transcription is not available in current analysis.
        </div>
      )}
    </div>
  );
};
