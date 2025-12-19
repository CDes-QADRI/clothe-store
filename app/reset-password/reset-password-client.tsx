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
          <ScrollReveal className="w-full max-w-sm rounded-3xl border border-slate-200/70 bg-white/80 p-6 text-sm shadow-soft">
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
        <ScrollReveal className="w-full max-w-sm space-y-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft">
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Reset password
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Choose a new password
            </h1>
            <p className="text-[11px] text-slate-500">
              Your new password must have at least 8 characters, one uppercase letter, one number and one special character.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">New password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-full border border-slate-200 bg-white px-3 pr-10 text-sm shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-[11px] text-slate-500 hover:text-slate-900"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="flex items-center gap-1 text-[11px] text-slate-500">
                <span
                  className={
                    'inline-flex h-3 w-3 items-center justify-center rounded-full border text-[9px]' +
                    (isPasswordValid
                      ? ' border-emerald-400 bg-emerald-50 text-emerald-600'
                      : ' border-slate-300 bg-slate-50 text-slate-400')
                  }
                >
                  {isPasswordValid ? '✓' : '×'}
                </span>
                Must include uppercase, number and special character
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 w-full rounded-full border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900"
                placeholder="Repeat password"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            {message && <p className="text-xs text-emerald-600">{message}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
