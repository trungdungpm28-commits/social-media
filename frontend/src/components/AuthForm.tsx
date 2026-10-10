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
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailError = !email.trim()
    ? 'Email is required.'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? 'Enter a valid email address.'
      : '';
  const passwordError = password.length === 0 ? 'Password is required.' : '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setEmailTouched(true);
    setPasswordTouched(true);
    if (emailError || passwordError) {
      return;
    }

    await onSubmit({
      email: email.trim(),
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={loading}
          aria-invalid={emailTouched && Boolean(emailError)}
          aria-describedby={emailTouched && emailError ? 'email-error' : undefined}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
        {emailTouched && emailError && (
          <p id="email-error" className="mt-1.5 text-sm text-rose-600">
            {emailError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setPasswordTouched(true)}
          placeholder="Enter your password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          disabled={loading}
          aria-invalid={passwordTouched && Boolean(passwordError)}
          aria-describedby={passwordTouched && passwordError ? 'password-error' : undefined}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
        {passwordTouched && passwordError && (
          <p id="password-error" className="mt-1.5 text-sm text-rose-600">
            {passwordError}
          </p>
        )}
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-wait disabled:opacity-70"
        type="submit"
        disabled={loading}
      >
        {loading
          ? isLogin ? 'Signing in…' : 'Creating account…'
          : isLogin
            ? 'Sign In'
            : 'Create Account'}
      </button>
    </form>
  );
};