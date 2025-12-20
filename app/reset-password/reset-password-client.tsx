"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';

const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export function ResetPasswordClient({ token }: { token?: string }) {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isPasswordValid = strongPasswordRegex.test(password);

  if (!token) {
    return (
      <section className="section">
        <div className="container-shell flex justify-center">
          <ScrollReveal className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 text-sm shadow-soft dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100">
            Invalid or missing reset token.
          </ScrollReveal>
        </div>
      </section>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Could not reset password.');
      } else {
        setMessage(data.message ?? 'Password updated successfully.');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container-shell flex justify-center">
        <ScrollReveal className="w-full max-w-sm space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-soft dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
              Reset password
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Choose a new password
            </h1>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Your new password must have at least 8 characters, one uppercase letter, one number and one special character.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">New password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 pr-10 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-[11px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                <span
                  className={
                    'inline-flex h-3 w-3 items-center justify-center rounded-full border text-[9px]' +
                    (isPasswordValid
                      ? ' border-emerald-400 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/50'
                      : ' border-zinc-300 bg-zinc-50 text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-500')
                  }
                >
                  {isPasswordValid ? '✓' : '×'}
                </span>
                Must include uppercase, number and special character
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                placeholder="Repeat password"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            {message && <p className="text-xs text-emerald-600 dark:text-emerald-400">{message}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
