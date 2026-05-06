import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@core/network/apiClient';
import { sleep } from '@core/utils/helpers';
import { getDataSource } from '@stores/ui.store';
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

function buildMockSession(email: string, firstName = 'Demo', lastName = 'Player'): AuthSuccessResponse {
  return {
    message: 'Mock session',
    encrypted_token: 'mock-' + Date.now(),
    access_token: 'mock-access-' + Date.now(),
    user: {
      user_id: 'mock-user',
      first_name: firstName,
      last_name: lastName,
      email,
    },
  };
}

export function useSignup() {
  return useMutation({
    mutationFn: async (input: Omit<SignupRequest, 'app_id'>): Promise<SignupResponse> => {
      if (getDataSource() === 'mock') {
        await sleep(500);
        return { user_id: 'mock-user', message: 'User created (mock)' };
      }
      const { data } = await apiClient.post<SignupResponse>(
        '/fawz_user_management/user/sign_up',
        { ...input, app_id: APP_ID },
      );
      return data;
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (input: LoginRequest): Promise<AuthSuccessResponse> => {
      if (getDataSource() === 'mock') {
        await sleep(500);
        return buildMockSession(input.email);
      }
      const { data } = await apiClient.patch<AuthSuccessResponse>(
        '/fawz_user_management/user/login_user',
        input,
      );
      return data;
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (input: VerifyEmailRequest): Promise<AuthSuccessResponse> => {
      if (getDataSource() === 'mock') {
        await sleep(400);
        return buildMockSession(input.email);
      }
      const { data } = await apiClient.patch<AuthSuccessResponse>(
        '/fawz_user_management/user/verify_user_email',
        input,
      );
      return data;
    },
  });
}

export function useRequestCode() {
  return useMutation({
    mutationFn: async (input: { email: string; code_type: CodeType }) => {
      if (getDataSource() === 'mock') {
        await sleep(400);
        return { message: 'Code sent (mock)' };
      }
      await apiClient.post('/fawz_user_management/user/request_code', input);
      return { message: 'Code sent' };
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      if (getDataSource() === 'mock') {
        await sleep(400);
        return { message: 'Reset code sent (mock)' };
      }
      await apiClient.post('/fawz_user_management/user/forgot_password', { email });
      return { message: 'Reset code sent' };
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (input: ResetPasswordRequest): Promise<AuthSuccessResponse> => {
      if (getDataSource() === 'mock') {
        await sleep(500);
        return buildMockSession(input.email);
      }
      const { data } = await apiClient.patch<AuthSuccessResponse>(
        '/fawz_user_management/user/reset_password_by_user',
        input,
      );
      return data;
    },
  });
}
