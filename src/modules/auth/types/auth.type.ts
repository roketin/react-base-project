import type { TPermission } from '@/modules/app/constants/permission.constant';

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
  login: string;
  password: string;
};

export type TAuthLoginResponse = {
  access_token: string;
  refresh_token: string;
  is_first_time_login: boolean;
};

export type TAuthForgot = Pick<TAuthLogin, 'login'>;

export type TAuthReset = {
  password: string;
  password_confirm: string;
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
  permissions?: TPermission[];
};
