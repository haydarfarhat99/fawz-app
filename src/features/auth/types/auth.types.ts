export interface SignupRequest {
  app_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone_number?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  verify_code: string;
}

export interface ResetPasswordRequest {
  email: string;
  verify_code: string;
  new_password: string;
  confirm_new_password: string;
  code_type: 'EmailVerification' | 'ResetCode';
}

export interface AuthSuccessResponse {
  message: string;
  encrypted_token: string;
  access_token: string;
  user?: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    tenant_id?: string;
    role_id?: string;
    user_status?: string;
  };
}

export interface SignupResponse {
  user_id: string;
  message: string;
}

export type CodeType = 'EmailVerification' | 'ResetCode';
