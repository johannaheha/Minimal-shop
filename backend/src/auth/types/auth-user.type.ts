export type AuthRole = 'user' | 'admin';

export interface AuthUser {
  userId: string;
  email: string;
  role: AuthRole;
}
