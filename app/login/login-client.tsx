"use client";

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollReveal } from '@/components/scroll-reveal';

export function LoginClient({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const safeCallbackUrl = useMemo(() => {
    if (!callbackUrl) return '/';
    // only allow internal redirects
    return callbackUrl.startsWith('/') ? callbackUrl : '/';
  }, [callbackUrl]);

  const comingFromCheckout = safeCallbackUrl.startsWith('/checkout');
  const headingText = comingFromCheckout
    ? 'Access your orders by signing in'
    : 'Get Full Access to AURALEEN';

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(safeCallbackUrl);
    }
  }, [status, safeCallbackUrl, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    setLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: safeCallbackUrl
    });

    setLoading(false);

    if (!result || result.error) {
      setError('Incorrect email or password.');
      return;
    }

    router.push(result.url ?? '/');
  }

  return (
    <section className="section">
      <div className="container-shell flex justify-center">
        <ScrollReveal className="w-full max-w-sm space-y-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft">
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Sign in
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {headingText}
            </h1>
            <p className="text-[11px] text-slate-500">
              Use the email and password you signed up with to view and track your Cash on Delivery orders.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                required
                className="h-10 w-full rounded-full border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
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
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="pt-1 text-center text-[11px] text-slate-500">
            <Link
              href="/forgot-password"
              className="font-medium text-slate-900 underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </p>
          <p className="text-center text-[11px] text-slate-500">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/signup"
              className="font-medium text-slate-900 underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
