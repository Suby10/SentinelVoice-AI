import type { BackendRawResponse } from '../types/analysis';

// Base URL configured via environment variables (default to local FastAPI server)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
export class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Uploads a WAV audio file to the backend `/analyze` endpoint via multipart/form-data.
 * NEVER creates fake or mock scores when an API error occurs.
 */
export async function analyzeAudio(file: File): Promise<BackendRawResponse> {
  if (!file.name.toLowerCase().endsWith('.wav') && file.type !== 'audio/wav' && file.type !== 'audio/x-wav') {
    throw new Error('Unsupported audio format. Please upload a standard WAV file.');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown server error');
      throw new ApiError(
        response.status,
        `Backend service error (${response.status}): ${errorText || response.statusText}`
      );
    }

    const data: BackendRawResponse = await response.json();
    return data;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Unable to connect to SentinelVoice backend at ${API_BASE_URL}. Ensure FastAPI is running.`);
    }
    throw new Error(err.message || 'Failed to analyze recording. Please try again.');
  }
}

/**
 * Verifies backend engine health
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/docs`, { method: 'HEAD' });
    return res.ok || res.status === 200 || res.status === 307;
  } catch {
    return false;
  }
}