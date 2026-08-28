import type { BackendRawResponse, NormalizedAnalysis } from '../types/analysis';

/**
 * Normalizes backend responses into a consistent UI contract.
 * Automatically adapts between the current single Random Forest output
 * and future Whisper / Context / Trust module expansions.
 */
export function normalizeAnalysisResponse(data: BackendRawResponse): NormalizedAnalysis {
  // Normalize confidence (convert 0.91 -> 91, or preserve 91 -> 91)
  let rawConfidence = data.confidence ?? data.voice_analysis?.confidence ?? 0;
  if (rawConfidence <= 1 && rawConfidence > 0) {
    rawConfidence = Math.round(rawConfidence * 100);
  } else {
    rawConfidence = Math.round(rawConfidence);
  }

  // Normalize prediction identifier
  const rawPred = (data.prediction || data.voice_analysis?.prediction || '').toLowerCase();
  let prediction: 'FAKE' | 'REAL' | 'UNKNOWN' = 'UNKNOWN';
  let predictionLabel = 'Uncertain';
  let isSuspicious = false;

  if (rawPred.includes('fake') || rawPred.includes('ai') || rawPred.includes('synthetic')) {
    prediction = 'FAKE';
    predictionLabel = 'Likely AI Generated';
    isSuspicious = true;
  } else if (rawPred.includes('real') || rawPred.includes('human') || rawPred.includes('genuine')) {
    prediction = 'REAL';
    predictionLabel = 'Likely Human';
    isSuspicious = false;
  }

  // Aggregate Explainability Reasons (without inventing any)
  const reasons: string[] = [];
  if (data.voice_analysis?.reasons && Array.isArray(data.voice_analysis.reasons)) {
    reasons.push(...data.voice_analysis.reasons);
  }
  if (data.context_analysis?.risk_reasons && Array.isArray(data.context_analysis.risk_reasons)) {
    reasons.push(...data.context_analysis.risk_reasons);
  }

  // Parse context signals
  let contextRisk = undefined;
  if (data.context_analysis) {
    let lvl: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN' = 'UNKNOWN';
    const rawLvl = data.context_analysis.risk_level?.toUpperCase();
    if (rawLvl === 'LOW' || rawLvl === 'MEDIUM' || rawLvl === 'HIGH') {
      lvl = rawLvl;
    }
    contextRisk = {
      score: data.context_analysis.risk_score ?? 0,
      level: lvl,
      signals: data.context_analysis.detected_signals || [],
    };
  }

  // Parse Trust Engine
  let trustEngine = undefined;
  if (data.trust_analysis) {
    let lvl: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN' = 'UNKNOWN';
    const rawLvl = data.trust_analysis.risk_level?.toUpperCase();
    if (rawLvl === 'LOW' || rawLvl === 'MEDIUM' || rawLvl === 'HIGH') {
      lvl = rawLvl;
    }
    trustEngine = {
      overallRiskScore: data.trust_analysis.overall_risk_score,
      trustScore: data.trust_analysis.trust_score,
      riskLevel: lvl,
      decision: data.trust_analysis.decision,
    };
  }

  // Action Recommendations
  const recommendations: string[] = [];
  if (data.protection?.recommendations && Array.isArray(data.protection.recommendations)) {
    recommendations.push(...data.protection.recommendations);
  }

  return {
    filename: data.filename || 'uploaded_recording.wav',
    prediction,
    predictionLabel,
    isSuspicious,
    confidencePercentage: Math.min(100, Math.max(0, rawConfidence)),
    audio: data.audio
      ? {
          duration: data.audio.duration,
          sampleRate: data.audio.sample_rate,
        }
      : undefined,
    transcript: data.transcript?.text
      ? {
          text: data.transcript.text,
          language: data.transcript.language || 'en',
        }
      : undefined,
    reasons,
    contextRisk,
    trustEngine,
    recommendations,
    analyzedAt: new Date().toLocaleTimeString(),
  };
}