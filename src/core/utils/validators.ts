import { z } from 'zod';

export const emailSchema = z.string().email();
export const passwordSchema = z
  .string()
  .min(8)
  .regex(/[A-Z]/, 'must contain uppercase')
  .regex(/[a-z]/, 'must contain lowercase')
  .regex(/[0-9]/, 'must contain digit');

export const phoneIqSchema = z
  .string()
  .regex(/^(\+964|0)?7\d{9}$/, 'invalid Iraqi mobile number');

export const otpSchema = z.string().regex(/^\d{6}$/, 'OTP must be 6 digits');
export const fawzNumberSchema = z.string().regex(/^\d{10}$/, 'Fawz number must be 10 digits');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
