import { z } from 'zod';

// Login validation - no minimum length requirement for password (existing passwords)
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Password required'),
});

// Signup validation - requires minimum 6 characters for new passwords
export const signupSchema = z.object({
  firstName: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
