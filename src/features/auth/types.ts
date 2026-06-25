export interface TAuthState {
  token: string | null;
  user: any | null;
  isLoading: boolean;
}

export interface TAuthActions {
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}
