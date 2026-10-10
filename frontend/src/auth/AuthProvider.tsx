import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import axios from 'axios';
import { authApi } from '../api/authApi';
import type { AuthDto, AuthResponse, UserProfile } from '../types/auth.types';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(() =>
    Boolean(sessionStorage.getItem('access_token')),
  );
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem('access_token')) {
      return;
    }

    let isActive = true;
    void authApi.getMe()
      .then((profile) => {
        if (isActive) {
          setUser(profile);
        }
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) {
          authApi.logout();
          return;
        }

        setSessionError('Unable to verify your saved session. Please sign in again.');
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const authenticate = useCallback(
    async (request: (data: AuthDto) => Promise<AuthResponse>, data: AuthDto) => {
      setSessionError(null);
      try {
        await request(data);
        setUser(await authApi.getMe());
      } catch (error) {
        authApi.logout();
        throw error;
      }
    },
    [],
  );

  const signIn = useCallback(
    (data: AuthDto) => authenticate(authApi.signin, data),
    [authenticate],
  );
  const signUp = useCallback(
    (data: AuthDto) => authenticate(authApi.signup, data),
    [authenticate],
  );

  const signOut = useCallback(() => {
    authApi.logout();
    setSessionError(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, sessionError, signIn, signUp, signOut }),
    [user, isLoading, sessionError, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
