import { useMutation } from '@tanstack/react-query';
import { sleep } from '@core/utils/helpers';
import type {
  AuthSuccessResponse,
  CodeType,
  LoginRequest,
  ResetPasswordRequest,
  SignupRequest,
  SignupResponse,
  VerifyEmailRequest,
} from '../types/auth.types';

/**
 * Auth flow runs entirely against local fixtures so login is instant
 * regardless of backend availability. Real-API integration can be re-added
 * later via the data-source toggle once the sandbox is ready.
 */

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
      await sleep(300);
      return { user_id: 'mock-' + input.email, message: 'User created (mock)' };
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (input: LoginRequest): Promise<AuthSuccessResponse> => {
      await sleep(250);
      return buildMockSession(input.email);
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (input: VerifyEmailRequest): Promise<AuthSuccessResponse> => {
      await sleep(250);
      return buildMockSession(input.email);
    },
  });
}

export function useRequestCode() {
  return useMutation({
    mutationFn: async (input: { email: string; code_type: CodeType }) => {
      await sleep(250);
      return { message: `Code sent to ${input.email} (mock)` };
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      await sleep(250);
      return { message: `Reset code sent to ${email} (mock)` };
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (input: ResetPasswordRequest): Promise<AuthSuccessResponse> => {
      await sleep(300);
      return buildMockSession(input.email);
    },
  });
}
