import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AudioUploader } from './components/AudioUploader';
import { AnalysisProgress } from './components/AnalysisProgress';
import { VoiceResultCard } from './components/VoiceResultCard';
import { ContextAnalysisCard } from './components/ContextAnalysisCard';
import { TranscriptCard } from './components/TranscriptCard';
import { ExplainabilityCard } from './components/ExplainabilityCard';
import { RecommendationCard } from './components/RecommendationCard';
import { AssistedProtection } from './components/AssistedProtection';
import { DemoAudioSelector } from './components/DemoAudioSelector';
import { analyzeAudio, checkBackendHealth } from './services/api';
import { normalizeAnalysisResponse } from './services/responseNormalizer';
import type { NormalizedAnalysis, AnalysisStage } from './types/analysis';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stage, setStage] = useState<AnalysisStage>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<NormalizedAnalysis | null>(null);
  const [assistedProtection, setAssistedProtection] = useState<boolean>(false);
  const [engineOnline, setEngineOnline] = useState<boolean>(false);

  useEffect(() => {
    checkBackendHealth().then(setEngineOnline);
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setErrorMessage(null);
    setStage('uploading');

    try {
      setTimeout(() => setStage('extracting_features'), 400);
      setTimeout(() => setStage('evaluating_model'), 900);

      const rawResponse = await analyzeAudio(selectedFile);
      const normalized = normalizeAnalysisResponse(rawResponse);

      setAnalysisResult(normalized);
      setStage('complete');
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Analysis could not be completed.'
      );
      setStage('error');
      setAnalysisResult(null);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    setStage('idle');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        engineOnline={engineOnline}
        assistedProtection={assistedProtection}
        onToggleAssisted={() => setAssistedProtection((prev) => !prev)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AudioUploader
              selectedFile={selectedFile}
              onFileSelect={(file) => {
                setSelectedFile(file);
                if (!file) handleClear();
              }}
              onAnalyze={handleAnalyze}
              isAnalyzing={
                stage !== 'idle' &&
                stage !== 'complete' &&
                stage !== 'error'
              }
            />
          </div>

          <div className="space-y-4">
            <DemoAudioSelector
              onSelectSample={(_name, file) => {
                setSelectedFile(file);
                setAnalysisResult(null);
                setErrorMessage(null);
                setStage('idle');
              }}
              disabled={
                stage !== 'idle' &&
                stage !== 'complete' &&
                stage !== 'error'
              }
            />

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-300">
                About SentinelVoice AI
              </div>
              <p>
                Acoustic feature extraction maps 38 temporal and spectral parameters into our trained Random Forest classifier.
              </p>
            </div>
          </div>
        </div>

        {stage !== 'idle' && stage !== 'complete' && (
          <AnalysisProgress stage={stage} />
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-start space-x-3 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Analysis Failed: </span>
              <span>{errorMessage}</span>
            </div>

            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {assistedProtection && analysisResult && (
          <AssistedProtection data={analysisResult} />
        )}

        {analysisResult && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Security Analysis Overview
              </h2>
            </div>

            <VoiceResultCard data={analysisResult} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExplainabilityCard data={analysisResult} />
              <RecommendationCard data={analysisResult} />
              <ContextAnalysisCard data={analysisResult} />
              <TranscriptCard data={analysisResult} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-600">
        <p>
          SentinelVoice &bull; Smart India Hackathon Prototype &bull; Prototype RF Model
        </p>
      </footer>
    </div>
  );
};

export default App;
