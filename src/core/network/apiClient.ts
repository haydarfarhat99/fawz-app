import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@config/env';
import { logger } from '@core/utils/logger';
import { getDataSource } from '@stores/ui.store';
import {
  AppError,
  NetworkError,
  UnauthorizedError,
  ValidationError,
} from './types/apiError';

const TOKEN_STORAGE_KEY = 'fawz.auth.token';

export class MockModeError extends Error {
  constructor() {
    super('Mock data mode — skipping API call');
    this.name = 'MockModeError';
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 8_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (getDataSource() === 'mock') {
    return Promise.reject(new MockModeError());
  }

  const token = getStoredToken();
  if (token) {
    if (!config.headers) config.headers = new AxiosHeaders();
    (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
  }
  logger.debug(`→ ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.debug(`← ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError | NetworkError | MockModeError) => {
    if (error instanceof MockModeError || error instanceof NetworkError) {
      return Promise.reject(error);
    }
    const axiosError = error as AxiosError;
    if (!axiosError.response) {
      logger.error('Network error', axiosError.message);
      return Promise.reject(new NetworkError(axiosError.message));
    }
    const { status, data } = axiosError.response;
    const detail = (data as { detail?: string } | undefined)?.detail ?? axiosError.message;
    logger.warn(`API error ${status}: ${detail}`);

    if (status === 401) {
      setStoredToken(null);
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return Promise.reject(new UnauthorizedError(detail));
    }
    if (status === 422) {
      const fieldErrors = ((data as { errors?: Record<string, string> } | undefined)?.errors) ?? {};
      return Promise.reject(new ValidationError(fieldErrors));
    }
    return Promise.reject(new AppError(detail, status, `HTTP_${status}`));
  },
);

/**
 * Wraps a request and falls back to dummy data when:
 *   - the user has chosen `mock` data source, OR
 *   - the endpoint isn't deployed yet (404), OR
 *   - the user lacks permission (403), OR
 *   - any network/server error occurs.
 *
 * Real-mode 200 responses always win.
 */
export async function withFallback<T>(
  request: () => Promise<T>,
  fallback: T,
  label = 'unknown',
): Promise<T> {
  if (getDataSource() === 'mock') {
    return fallback;
  }
  try {
    return await request();
  } catch (error) {
    if (error instanceof MockModeError) return fallback;
    logger.warn(`Falling back to dummy data for: ${label}`, error);
    return fallback;
  }
}
