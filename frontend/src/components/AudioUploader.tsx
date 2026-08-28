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
    <div className="bg-surface rounded-xl border border-border p-5 relative overflow-hidden">
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 mb-5 border-b border-border gap-2">
        <div>
          <h2 className="text-sm font-semibold text-appText">
            Analyze a Voice Call
          </h2>
          <p className="text-xs text-appTextMuted mt-0.5">
            Upload a recorded call to inspect acoustic features and identify potential impersonation risk.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] text-appTextMuted self-start">
          <MicOff className="w-3 h-3" />
          <span>Live Stream (Roadmap)</span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`border border-dashed rounded-lg p-5 text-center transition-colors ${
          dragActive
            ? 'border-appText/30 bg-surfaceHover'
            : selectedFile
            ? 'border-border bg-surfaceHover/50'
            : 'border-border hover:border-strong cursor-pointer'
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
          <div className="flex flex-col items-center justify-center py-3">
            <UploadCloud className="w-5 h-5 text-appTextMuted mb-2" />
            <p className="text-xs text-appText font-medium">
              Drag and drop your audio file, or{' '}
              <span className="text-appTextSecondary underline">browse</span>
            </p>
            <p className="text-[11px] text-appTextMuted mt-1">
              Supports uncompressed .WAV recordings
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1">
            <div className="flex items-center gap-2.5 text-left w-full">
              <FileAudio className="w-4 h-4 text-appTextMuted shrink-0" />
              <div className="truncate flex-1">
                <p className="text-xs font-medium text-appText truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-appTextMuted">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Audio/WAV
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayback();
                }}
                className="px-2.5 py-1 rounded text-[11px] text-appText hover:bg-surfaceHover transition-colors flex items-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                disabled={isAnalyzing}
                className="p-1.5 rounded hover:bg-error-bg text-appTextMuted hover:text-errorText transition-colors"
                title="Clear selected audio"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {validationError && (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-errorText">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleClear}
          disabled={!selectedFile || isAnalyzing}
          className="px-3 py-1.5 rounded text-[11px] text-appTextMuted hover:text-appText disabled:opacity-30 transition-colors"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!selectedFile || isAnalyzing}
          className="px-4 py-1.5 rounded text-[11px] font-medium bg-surfaceHover hover:bg-strong disabled:opacity-30 disabled:text-appTextMuted text-appText transition-colors border border-border"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Call'}
        </button>
      </div>
    </div>
  );
};
