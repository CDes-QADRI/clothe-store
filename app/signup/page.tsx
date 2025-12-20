"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';

const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export default function SignupPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'signup' | 'verify' | 'done'>('signup');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setOtpError(null);
    setOtpMessage(null);
    setDevOtpCode(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const passwordValue = String(formData.get('password') ?? '');

    if (!strongPasswordRegex.test(passwordValue)) {
      setError(
        'Password must be at least 8 characters and include an uppercase letter, a number, and a special character.'
      );
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: passwordValue })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Could not create account.');
        setSubmitting(false);
        return;
      }

      setSignupEmail(email);
      setOtpMessage(
        data.message ??
          'We have sent a 6-digit code to your email to verify your account.'
      );

      if (process.env.NODE_ENV !== 'production' && typeof data.devCode === 'string') {
        setDevOtpCode(data.devCode);
      }
      setStep('verify');
      setSubmitting(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOtpError(null);

    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpError('Please enter the 6-digit verification code.');
      return;
    }

    setVerifying(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, code: otpCode })
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error ?? 'Could not verify code.');
        setVerifying(false);
        return;
      }

      setStep('done');
      setVerifying(false);
    } catch {
      setOtpError('Something went wrong while verifying. Please try again.');
      setVerifying(false);
    }
  }

  async function handleResend() {
    if (!signupEmail) return;
    setResending(true);
    setResendMessage(null);
    setOtpError(null);

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error ?? 'Could not resend code.');
        setResending(false);
        return;
      }

      setResendMessage(data.message ?? 'Code resent.');

      if (process.env.NODE_ENV !== 'production' && typeof data.devCode === 'string') {
        setDevOtpCode(data.devCode);
      }
      setResending(false);
    } catch {
      setOtpError('Something went wrong while resending. Please try again.');
      setResending(false);
    }
  }

  return (
    <section className="section">
      <div className="container-shell flex justify-center">
        <ScrollReveal className="w-full max-w-sm space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-soft dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
              Create account
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Join White Kapra Studio
            </h1>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Create an account to save your orders and details for
              faster Cash on Delivery checkouts.
            </p>
          </div>
          {step === 'done' ? (
            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <p className="font-medium dark:text-zinc-100">Account created.</p>
              <p>Your email has been verified. You can now sign in.</p>
              <Button size="sm" onClick={() => router.push('/login')}>
                Go to sign in
              </Button>
            </div>
          ) : step === 'verify' ? (
            <form noValidate onSubmit={handleVerify} className="space-y-4 text-sm">
              <div className="space-y-1">
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  We&apos;ve sent a 6-digit verification code to
                  <span className="font-medium text-zinc-900 dark:text-zinc-100"> {signupEmail}</span>.
                  Enter it below to verify your account.
                </p>
                {otpMessage && (
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{otpMessage}</p>
                )}
                {process.env.NODE_ENV !== 'production' && devOtpCode && (
                  <p className="text-[11px] text-amber-600">
                    Dev OTP (SMTP down): <span className="font-semibold">{devOtpCode}</span>
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Verification code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-center text-sm text-zinc-900 tracking-[0.5em] shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                  placeholder="••••••"
                />
              </div>
              <div className="space-y-1">
                {otpError && <p className="text-xs text-red-500">{otpError}</p>}
                {resendMessage && !otpError && (
                  <p className="text-xs text-emerald-600">{resendMessage}</p>
                )}
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={verifying}>
                {verifying ? 'Verifying…' : 'Verify email'}
              </Button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="w-full text-[11px] font-medium text-zinc-600 underline-offset-4 hover:underline disabled:opacity-60 dark:text-zinc-400"
              >
                {resending ? 'Resending code…' : 'Didn\'t get a code? Resend'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Full name</label>
                <input
                  name="name"
                  required
                  className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                  placeholder="Ali Khan"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);
                      setIsPasswordValid(strongPasswordRegex.test(value));
                    }}
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
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Password must be at least 8 characters and include an uppercase
                  letter, a number, and a special character.
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px]">
                  <span
                    className={`inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[9px] ${
                      isPasswordValid
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                        : 'border-red-400 bg-red-50 text-red-500'
                    }`}
                  >
                    {isPasswordValid ? '✓' : '✕'}
                  </span>
                  <span
                    className={
                      isPasswordValid ? 'text-emerald-600' : 'text-red-500'
                    }
                  >
                    {isPasswordValid
                      ? 'Password requirements met'
                      : 'Password does not meet requirements'}
                  </span>
                </div>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? 'Creating account…' : 'Sign up'}
              </Button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
