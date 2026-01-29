export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  userId: string;
  username: string;
  fullName?: string;
}

export interface User {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
}
