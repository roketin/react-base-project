export type TAuthStore = {
  token: string;
  refreshToken: string;
  authData: TAuthProfile | null;
  isAuthenticated: () => boolean;
  setCredential: (token: string, refreshToken: string) => void;
  clearCredential: () => void;
  setAuthData: (data: TAuthProfile) => void;
};

export type TAuthLogin = {
  email: string;
  password: string;
};

export type TAuthLoginResponse = {
  id: string;
  name: string;
  email: string;
  expires_in: number;
  expires_at: string;
  access_token: string;
  refresh_token: string;
};

export type TAuthRole = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  guard_name: string;
};

export type TAuthProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};
