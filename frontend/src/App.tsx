import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { Header } from './components/Header';
import { AudioUploader } from './components/AudioUploader';
import { AnalysisProgress } from './components/AnalysisProgress';
import { TrustScoreCard } from './components/TrustScoreCard';
import { TrustEngineCard } from './components/TrustEngineCard';
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
    <ThemeProvider>
      <div className="min-h-screen bg-base text-appText flex flex-col font-sans">
        <Header
          engineOnline={engineOnline}
          assistedProtection={assistedProtection}
          onToggleAssisted={() => setAssistedProtection((prev) => !prev)}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

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

              <div className="p-4 rounded-xl bg-surface border border-border text-xs text-appTextSecondary space-y-1.5">
                <div className="font-semibold text-appText text-[11px] uppercase tracking-wider">
                  About SentinelVoice
                </div>
                <p className="leading-relaxed">
                  Acoustic feature extraction maps 38 temporal and spectral parameters into our trained Random Forest classifier.
                </p>
              </div>
            </div>
          </div>

          {stage !== 'idle' && stage !== 'complete' && (
            <AnalysisProgress stage={stage} />
          )}

          {errorMessage && (
            <div
              className="p-4 rounded-xl border text-xs flex items-start space-x-3"
              style={{
                background: 'var(--error-bg)',
                borderColor: 'var(--error-border)',
                color: 'var(--error-text)',
              }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold">Analysis Failed: </span>
                <span style={{ opacity: 0.8 }}>{errorMessage}</span>
              </div>

              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="opacity-60 hover:opacity-100 transition-opacity"
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
              <div className="border-b border-border pb-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-appTextMuted">
                  Security Analysis Results
                </h2>
              </div>

              <TrustScoreCard data={analysisResult} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VoiceResultCard data={analysisResult} />
                <TrustEngineCard data={analysisResult} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExplainabilityCard data={analysisResult} />
                <RecommendationCard data={analysisResult} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ContextAnalysisCard data={analysisResult} />
                <TranscriptCard data={analysisResult} />
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-border py-6 text-center text-[11px] text-appTextMuted">
          SentinelVoice · Smart India Hackathon Prototype · Prototype RF Model
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;
