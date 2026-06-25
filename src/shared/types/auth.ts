export interface TLoginRequest {
  email: string;
  password: string;
}

export interface TSignupRequest extends TLoginRequest {
  firstName: string;
}
