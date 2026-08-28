import { useState } from 'react';
import { Header } from './components/Header';
import { AudioUploader } from './components/AudioUploader';
import { AnalysisProgress } from './components/AnalysisProgress';
import { VoiceResultCard } from './components/VoiceResultCard';
import { analyzeAudio } from './services/api';
import { normalizeAnalysisResponse } from './services/responseNormalizer';
import type { NormalizedAnalysis, AnalysisStage } from './types/analysis';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<NormalizedAnalysis | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<AnalysisStage>('idle');

  const [assistedProtection, setAssistedProtection] = useState(false);

  // Backend is currently running and responding.
  const [engineOnline] = useState(true);

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a WAV audio file first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setStage('uploading');

    try {
      setStage('extracting_features');
      const data = await analyzeAudio(file);
      setStage('evaluating_model');
      const normalized = normalizeAnalysisResponse(data);
      setResult(normalized);
      setStage('complete');
    } catch (err) {
      setStage('error');
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to analyze the audio file.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setResult(null);
    setError('');
  };

  const handleToggleAssisted = () => {
    setAssistedProtection((current) => !current);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* TOP HEADER */}
      <Header
        engineOnline={engineOnline}
        assistedProtection={assistedProtection}
        onToggleAssisted={handleToggleAssisted}
      />

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            Voice Authenticity Analysis
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Analyze recorded voice calls for potential AI impersonation.
          </p>
        </div>

        {/* AUDIO UPLOADER */}
        {loading && <AnalysisProgress stage={stage} />}
        <AudioUploader
          selectedFile={file}
          onFileSelect={handleFileSelect}
          onAnalyze={handleAnalyze}
          isAnalyzing={loading}
        />

        {/* ERROR */}
        {error && (
          <div
            className={`mt-5 rounded-xl border p-4 ${
              assistedProtection
                ? 'border-red-500 bg-red-950/60'
                : 'border-red-800/50 bg-red-950/30'
            }`}
          >
            <div className="font-semibold text-red-400">
              âŒ Analysis Error
            </div>

            <p
              className={`mt-1 ${
                assistedProtection
                  ? 'text-base text-red-200'
                  : 'text-sm text-red-300'
              }`}
            >
              {error}
            </p>
          </div>
        )}
        {/* RESULT */}
        {result && <VoiceResultCard data={result} />}



        {/* FOOTER */}
        <div className="text-center text-xs text-slate-600 mt-8 pb-6">
          SentinelVoice â€¢ AI-Powered Voice Impersonation Protection
        </div>

      </main>
    </div>
  );
}

export default App;










