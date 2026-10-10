// frontend/src/pages/AuthPage.tsx

import React, { useState } from 'react';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../auth/useAuth';
import type { AuthDto } from '../types/auth.types';
import axios from 'axios';

export const AuthPage: React.FC = () => {
  const { signIn, signUp, sessionError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthSubmit = async (data: AuthDto) => {
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signIn(data);
      } else {
        await signUp(data);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
        const status = error.response?.status;
        const responseMessage = error.response?.data?.message;
        const message = Array.isArray(responseMessage)
          ? responseMessage.join(', ')
          : responseMessage;

        if (!error.response) {
          setError('Unable to connect to the server. Please try again.');
        } else if (status === 401 || (isLogin && status === 403)) {
          setError('Invalid email or password.');
        } else if (!isLogin && status === 403) {
          setError('An account with this email already exists.');
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
    <main className="flex min-h-screen items-center justify-center bg-[#f4f5fb] p-4 sm:p-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(31,41,55,0.12)] md:min-h-[620px] md:grid-cols-[0.95fr_1.05fr]" aria-labelledby="auth-heading">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700 p-12 text-white md:flex">
          <div className="absolute -right-24 -top-20 size-80 rounded-full border border-white/15" aria-hidden="true" />
          <div className="absolute -bottom-32 -left-24 size-96 rounded-full border border-white/15" aria-hidden="true" />
          <a className="relative z-10 flex items-center gap-3 text-lg font-bold tracking-tight" href="/" aria-label="Social App home">
            <span className="grid size-10 place-items-center rounded-xl bg-white/15 text-xl">S</span>
            Social App
          </a>
          <div className="relative z-10 max-w-sm">
            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-violet-200">YOUR COMMUNITY, IN ONE PLACE</p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight">Good things happen when we connect.</h2>
            <p className="mt-5 text-base leading-7 text-indigo-100">Share what matters, discover new perspectives, and keep up with the people you care about.</p>
          </div>
          <p className="relative z-10 text-sm text-indigo-200">A little closer, every day.</p>
        </aside>

        <div className="flex items-center justify-center px-6 py-10 sm:px-12 md:px-14">
          <div className="w-full max-w-md">
            <a className="mb-10 flex w-fit items-center gap-2 text-lg font-bold tracking-tight text-slate-900 md:hidden" href="/" aria-label="Social App home">
              <span className="grid size-9 place-items-center rounded-xl bg-violet-100 text-violet-700">S</span>
              Social App
            </a>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-600">
              {isLogin ? 'Welcome back' : 'Get started'}
            </p>
            <h1 id="auth-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h1>
            <p className="mt-3 text-[15px] leading-6 text-slate-500">
              {isLogin ? 'Pick up right where you left off.' : 'Join the conversation and make yourself at home.'}
            </p>

            {(error || sessionError) && (
              <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700" role="alert">
                {error || sessionError}
              </div>
            )}

            <AuthForm
              key={isLogin ? 'signin' : 'signup'}
              isLogin={isLogin}
              loading={loading}
              onSubmit={handleAuthSubmit}
            />

            <p className="mt-7 text-center text-sm text-slate-500">
              {isLogin ? 'New to Social App? ' : 'Already have an account?'}
              <button
                type="button"
                onClick={handleToggleMode}
                className="ml-1 font-semibold text-violet-700 hover:text-violet-800 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              >
                {isLogin ? 'Create an account' : 'Sign in'}
              </button>
            </p>
            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
