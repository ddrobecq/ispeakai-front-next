import { create } from 'zustand';
import { TAuthState, TAuthActions } from '../types';

interface AuthStore extends TAuthState, TAuthActions {}

export const useAuthStore = create<AuthStore>((set) => {
  // Hydrate from localStorage on initialization
  if (typeof window !== 'undefined') {
    const savedToken = localStorage.getItem('auth-token');
    const savedUser = localStorage.getItem('auth-user');
    if (savedToken && savedUser) {
      set({
        token: savedToken,
        user: JSON.parse(savedUser),
      });
    }
  }

  return {
    token: null,
    user: null,
    isLoading: false,

    setAuth: (token, user) => {
      localStorage.setItem('auth-token', token);
      localStorage.setItem('auth-user', JSON.stringify(user));
      
      // Also save to cookie for middleware (server-side auth check)
      if (typeof window !== 'undefined') {
        document.cookie = `auth-token=${token}; path=/; max-age=${24 * 60 * 60}`;
      }
      
      set({ token, user });
    },

    logout: async () => {
      // Clear localStorage
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      
      // Clear cookie
      if (typeof window !== 'undefined') {
        document.cookie = 'auth-token=; path=/; max-age=0';
      }
      
      set({ token: null, user: null });

      // Clear httpOnly cookie via API
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (err) {
        console.error('Error calling logout API:', err);
      }

      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  };
});

