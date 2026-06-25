export interface TAuthResponse {
  token: string;
  user: TUser;
}

export interface TUser {
  id: string;
  email: string;
  first_name: string;
  native_language: string;
  target_language: string;
  current_level: string;
  target_level: string;
}
