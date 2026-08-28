import React, { useRef, useState } from 'react';
import { UploadCloud, FileAudio, Play, Pause, Trash2, MicOff, AlertCircle } from 'lucide-react';

interface AudioUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  selectedFile,
  onFileSelect,
  onAnalyze,
  isAnalyzing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const validateAndSetFile = (file: File) => {
    setValidationError(null);
    if (!file.name.toLowerCase().endsWith('.wav')) {
      setValidationError('Unsupported format. Please upload an uncompressed WAV audio file.');
      return;
    }
    onFileSelect(file);
    setIsPlaying(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !selectedFile) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = URL.createObjectURL(selectedFile);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleClear = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    onFileSelect(null);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 mb-5 border-b border-slate-800/80 gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <span>Analyze a Voice Call</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload a recorded call to inspect acoustic features and identify potential impersonation risk.
          </p>
        </div>
        
        {/* Live Mic placeholder for future expansion */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 self-start">
          <MicOff className="w-3 h-3 text-slate-500" />
          <span>Live Stream (Roadmap)</span>
        </div>
      </div>

      {/* Drag & Drop Card */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/5'
            : selectedFile
            ? 'border-slate-700 bg-slate-950/40'
            : 'border-slate-800 hover:border-slate-700 bg-slate-950/20 cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".wav,audio/wav"
          onChange={handleFileInput}
          className="hidden"
          disabled={isAnalyzing}
        />

        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-3 text-indigo-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-200">
              Drag and drop your audio file, or <span className="text-indigo-400 underline">browse</span>
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              Supports uncompressed .WAV recordings (mono/stereo)
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            <div className="flex items-center space-x-3 text-left w-full">
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <FileAudio className="w-6 h-6" />
              </div>
              <div className="truncate flex-1">
                <p className="text-sm font-medium text-slate-200 truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Audio/WAV
                </p>
              </div>
            </div>

            {/* Audio Preview controls */}
            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayback();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium flex items-center space-x-1.5 border border-slate-700"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play Preview'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                disabled={isAnalyzing}
                className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-slate-700 transition"
                title="Clear selected audio"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {validationError && (
        <div className="mt-3 flex items-center space-x-2 text-xs text-red-400 bg-red-950/30 border border-red-800/40 p-2.5 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-5 flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={handleClear}
          disabled={!selectedFile || isAnalyzing}
          className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-40 transition"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!selectedFile || isAnalyzing}
          className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white shadow-lg transition-all flex items-center space-x-2"
        >
          <span>{isAnalyzing ? 'Analyzing Recording...' : 'Analyze Call'}</span>
        </button>
      </div>
    </div>
  );
};