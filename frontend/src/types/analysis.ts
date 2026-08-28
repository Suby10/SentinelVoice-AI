// Raw response formats from backend (both Current and Future spec)
export interface BackendRawResponse {
  filename?: string;
  prediction?: string;
  confidence?: number;
  status?: string;
  message?: string;
  audio?: {
    duration?: number;
    sample_rate?: number;
  };
  transcript?: {
    text?: string;
    language?: string;
  };
  voice_analysis?: {
    prediction?: string;
    clone_probability?: number;
    confidence?: number;
    reasons?: string[];
  };
  context_analysis?: {
    risk_score?: number;
    risk_level?: string;
    detected_signals?: string[];
    risk_reasons?: string[];
  };
  trust_analysis?: {
    voice_risk_score?: number;
    context_risk_score?: number;
    overall_risk_score?: number;
    trust_score?: number;
    risk_level?: string;
    decision?: string;
  };
  protection?: {
    enabled?: boolean;
    recommendations?: string[];
  };
}

// Normalized response consumed across the UI
export interface NormalizedAnalysis {
  filename: string;
  prediction: 'FAKE' | 'REAL' | 'UNKNOWN';
  predictionLabel: string;
  isSuspicious: boolean;
  confidencePercentage: number; // 0 to 100
  audio?: {
    duration?: number;
    sampleRate?: number;
  };
  transcript?: {
    text: string;
    language: string;
  };
  reasons: string[];
  contextRisk?: {
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
    signals: string[];
  };
  trustEngine?: {
    overallRiskScore?: number;
    trustScore?: number;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
    decision?: string;
  };
  recommendations: string[];
  analyzedAt: string;
}

export type AnalysisStage = 
  | 'idle'
  | 'uploading'
  | 'extracting_features'
  | 'evaluating_model'
  | 'complete'
  | 'error';