interface AppEnv {
  apiBaseUrl: string;
  appName: string;
  environment: 'development' | 'staging' | 'production';
  testEmail: string;
  testPassword: string;
}

export const env: AppEnv = {
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ?? 'https://dev.iqarx.com/api/v0',
  appName: import.meta.env.VITE_APP_NAME ?? 'FAWZ',
  environment:
    (import.meta.env.VITE_ENVIRONMENT as AppEnv['environment']) ?? 'development',
  testEmail: import.meta.env.VITE_TEST_EMAIL ?? 'test@fawz.io',
  testPassword: import.meta.env.VITE_TEST_PASSWORD ?? 'Test1234!',
};

export const isDev = env.environment === 'development';
export const isProd = env.environment === 'production';
