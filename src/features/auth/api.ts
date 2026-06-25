import { api } from '@/shared/lib/axios';
import { TAuthResponse, TLoginRequest, TSignupRequest } from '@/shared/types';

export async function loginApi(data: TLoginRequest): Promise<TAuthResponse> {
  const response = await api.post<TAuthResponse>('/auth/login', data);
  return response.data;
}

export async function signupApi(data: TSignupRequest): Promise<TAuthResponse> {
  const response = await api.post<TAuthResponse>('/auth/signup', data);
  return response.data;
}
