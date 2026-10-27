export interface AuthUser {
  id?: string;
  userName: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
  user?: AuthUser;
}

export interface AuthRequest {
  userName?: string;
  email: string;
  password: string;
  role?: 'ROLE_USER';
}
