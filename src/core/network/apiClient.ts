import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@config/env';
import { logger } from '@core/utils/logger';
import {
  AppError,
  NetworkError,
  UnauthorizedError,
  ValidationError,
} from './types/apiError';

const TOKEN_STORAGE_KEY = 'fawz.auth.token';
const DEMO_TOKEN_PREFIX = 'demo-token-';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function isDemoToken(token: string | null): boolean {
  return !!token && token.startsWith(DEMO_TOKEN_PREFIX);
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredToken();

  if (isDemoToken(token)) {
    return Promise.reject(new NetworkError('Demo mode — using dummy data'));
  }

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
  (error: AxiosError) => {
    if (error instanceof NetworkError) {
      return Promise.reject(error);
    }
    if (!error.response) {
      logger.error('Network error', error.message);
      return Promise.reject(new NetworkError(error.message));
    }
    const { status, data } = error.response;
    const detail = (data as { detail?: string } | undefined)?.detail ?? error.message;
    logger.warn(`API error ${status}: ${detail}`);

    if (status === 401) {
      const currentToken = getStoredToken();
      if (!isDemoToken(currentToken)) {
        setStoredToken(null);
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
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
 * Wraps a request and falls back to dummy data if the endpoint fails.
 * Used for endpoints that aren't yet implemented on the backend.
 */
export async function withFallback<T>(
  request: () => Promise<T>,
  fallback: T,
  label = 'unknown',
): Promise<T> {
  try {
    return await request();
  } catch (error) {
    logger.warn(`Falling back to dummy data for: ${label}`, error);
    return fallback;
  }
}
