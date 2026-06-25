import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { loginApi, signupApi } from '../api';
import { TLoginRequest, TSignupRequest } from '@/shared/types';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: TLoginRequest) => loginApi(data),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push('/chat');
    },
    onError: (error: any) => {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: TSignupRequest) => signupApi(data),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push('/chat');
    },
    onError: (error: any) => {
      console.error('Signup error:', error.response?.data?.error || error.message);
    },
  });
}
