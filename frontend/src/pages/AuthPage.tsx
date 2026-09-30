// frontend/src/pages/AuthPage.tsx

import React, { useState } from 'react';
import { AuthForm } from '../components/AuthForm';
import { authApi } from '../api/authApi';
import type { AuthDto } from '../types/auth.types';
import axios from 'axios';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthSubmit = async (data: AuthDto) => {
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await authApi.signin(data);
      } else {
        await authApi.signup(data);
      }
      await onLoginSuccess();
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
        const status = error.response?.status;
        const responseMessage = error.response?.data?.message;
        const message = Array.isArray(responseMessage)
          ? responseMessage.join(', ')
          : responseMessage;

        if (status === 401 || status === 403) {
          setError('Invalid email or password.');
        } else if (!error.response) {
          setError('Unable to connect to the server.');
        } else {
          setError(message || 'Something went wrong. Please try again.');
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin((prev) => !prev);
    setError(null);
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-heading">
        <a className="brand auth-brand" href="/" aria-label="Social App">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>Social App</span>
        </a>
        <p className="auth-eyebrow">YOUR COMMUNITY, IN ONE PLACE</p>
        <h1 id="auth-heading" className="auth-title">
          {isLogin ? 'Welcome back' : 'Join the conversation'}
        </h1>
        <p className="auth-intro">
          {isLogin ? 'Sign in to continue to your account.' : 'Create an account to get started.'}
        </p>

        {/* Thông báo lỗi */}
        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <AuthForm
          isLogin={isLogin}
          loading={loading}
          onSubmit={handleAuthSubmit}
        />

        <div className="auth-switch">
          <span>{isLogin ? 'No account yet? ' : 'Already registered? '}</span>

          <button
            type="button"
            onClick={handleToggleMode}
          >
            {isLogin ? 'Create an account' : 'Sign in'}
          </button>
        </div>
      </section>
    </main>
  );
};
