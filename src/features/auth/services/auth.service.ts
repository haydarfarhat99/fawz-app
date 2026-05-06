import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@core/network/apiClient';
import { sleep } from '@core/utils/helpers';
import { logger } from '@core/utils/logger';
import type {
  AuthSuccessResponse,
  CodeType,
  LoginRequest,
  ResetPasswordRequest,
  SignupRequest,
  SignupResponse,
  VerifyEmailRequest,
} from '../types/auth.types';

const APP_ID = 'fawz';

function buildDemoSession(email: string, firstName = 'Demo', lastName = 'Player'): AuthSuccessResponse {
  return {
    message: 'Demo session',
    encrypted_token: 'demo-token-' + Date.now(),
    access_token: 'demo-access-' + Date.now(),
    user: {
      user_id: 'demo-user',
      first_name: firstName,
      last_name: lastName,
      email,
    },
  };
}

export function useSignup() {
  return useMutation({
    mutationFn: async (input: Omit<SignupRequest, 'app_id'>): Promise<SignupResponse> => {
      try {
        const { data } = await apiClient.post<SignupResponse>(
          '/fawz_user_management/user/sign_up',
          { ...input, app_id: APP_ID },
        );
        return data;
      } catch (err) {
        logger.warn('Signup falling back to demo mode', err);
        await sleep(700);
        return { user_id: 'demo-user', message: 'User created (demo)' };
      }
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (input: LoginRequest): Promise<AuthSuccessResponse> => {
      try {
        const { data } = await apiClient.patch<AuthSuccessResponse>(
          '/fawz_user_management/user/login_user',
          input,
        );
        return data;
      } catch (err) {
        logger.warn('Login falling back to demo mode', err);
        await sleep(700);
        return buildDemoSession(input.email);
      }
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (input: VerifyEmailRequest): Promise<AuthSuccessResponse> => {
      try {
        const { data } = await apiClient.patch<AuthSuccessResponse>(
          '/fawz_user_management/user/verify_user_email',
          input,
        );
        return data;
      } catch (err) {
        logger.warn('Verify falling back to demo mode', err);
        await sleep(600);
        return buildDemoSession(input.email);
      }
    },
  });
}

export function useRequestCode() {
  return useMutation({
    mutationFn: async (input: { email: string; code_type: CodeType }) => {
      try {
        await apiClient.post('/fawz_user_management/user/request_code', input);
      } catch (err) {
        logger.warn('Request code falling back to demo mode', err);
        await sleep(500);
      }
      return { message: 'Code sent' };
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      try {
        await apiClient.post('/fawz_user_management/user/forgot_password', { email });
      } catch (err) {
        logger.warn('Forgot password falling back to demo mode', err);
        await sleep(500);
      }
      return { message: 'Reset code sent' };
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (input: ResetPasswordRequest): Promise<AuthSuccessResponse> => {
      try {
        const { data } = await apiClient.patch<AuthSuccessResponse>(
          '/fawz_user_management/user/reset_password_by_user',
          input,
        );
        return data;
      } catch (err) {
        logger.warn('Reset password falling back to demo mode', err);
        await sleep(700);
        return buildDemoSession(input.email);
      }
    },
  });
}
