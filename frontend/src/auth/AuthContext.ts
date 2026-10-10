import { createContext } from 'react';
import type { AuthDto, UserProfile } from '../types/auth.types';

export interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  sessionError: string | null;
  signIn: (data: AuthDto) => Promise<void>;
  signUp: (data: AuthDto) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
