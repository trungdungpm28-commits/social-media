// frontend/src/components/AuthForm.tsx

import React, { useState } from 'react';
import type { AuthDto } from '../types/auth.types';

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (data: AuthDto) => Promise<void>;
  loading: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  onSubmit,
  loading,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Không cho submit nhiều lần khi đang xử lý
    if (loading) {
      return;
    }

    await onSubmit({
      email,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email */}
      <div className="form-field">
        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          required
          disabled={loading}
        />
      </div>

      <button className="auth-submit" type="submit" disabled={loading}>
        {loading
          ? isLogin ? 'Signing in...' : 'Creating account...'
          : isLogin
            ? 'Sign In'
            : 'Create Account'}
      </button>
    </form>
  );
};