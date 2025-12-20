"use client";

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [devError, setDevError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    setDevResetUrl(null);
    setDevError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok && data.error) {
        setError(data.error);
      } else {
        setMessage(
          data.message ||
            'If an account exists for this email, a reset link has been sent.'
        );

        if (process.env.NODE_ENV !== 'production') {
          if (typeof data.devResetUrl === 'string') {
            setDevResetUrl(data.devResetUrl);
          }
          if (typeof data.devError === 'string') {
            setDevError(data.devError);
          }
        }
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
              Forgot password
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Reset your password
            </h1>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Enter the email you used for your AURALEEN account and we will
              send you a link to choose a new password.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email</label>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                placeholder="you@example.com"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            {message && <p className="text-xs text-emerald-600 dark:text-emerald-400">{message}</p>}
            {process.env.NODE_ENV !== 'production' && devError && (
              <p className="text-xs text-amber-600">Dev SMTP error: {devError}</p>
            )}
            {process.env.NODE_ENV !== 'production' && devResetUrl && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Dev reset link:{' '}
                <a className="underline" href={devResetUrl}>
                  {devResetUrl}
                </a>
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Sending link…' : 'Send reset link'}
            </Button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
