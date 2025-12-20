"use client";

import { FormEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status !== 'authenticated') return;

    const loadProfile = async () => {
      try {
        const res = await fetch('/api/account/profile');
        if (!res.ok) {
          throw new Error('Failed to load profile');
        }
        const data = await res.json();
        setName(data.name ?? '');
        setContactNumber(data.contactNumber ?? '');
        setAddress(data.address ?? '');
      } catch {
        setError('Could not load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [status, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contactNumber, address })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Could not update profile.');
        setSaving(false);
        return;
      }

      setMessage('Profile updated successfully.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="section relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="profile-orbit absolute -left-32 -top-40 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl dark:bg-sky-900/30" />
          <div className="profile-orbit-delayed absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl dark:bg-emerald-900/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(24,24,27,0.85),_transparent_60%)]" />
        </div>
        <div className="container-shell flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm shadow-soft dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-900 dark:bg-zinc-100" />
            <span className="text-zinc-600 dark:text-zinc-400">Loading your profile…</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="profile-orbit absolute -left-32 -top-40 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl dark:bg-sky-900/30" />
        <div className="profile-orbit-delayed absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl dark:bg-emerald-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(24,24,27,0.9),_transparent_60%)]" />
      </div>
      <div className="container-shell flex min-h-[70vh] items-center justify-center py-8 sm:py-12">
        <ScrollReveal className="grid w-full max-w-4xl gap-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-soft backdrop-blur-xl sm:p-8 md:grid-cols-[1.05fr,1.6fr] dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex flex-col justify-between border-b border-zinc-200 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8 dark:border-zinc-800">
            <div className="space-y-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
                Profile
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold uppercase text-zinc-50 shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
                  {(name || session?.user?.name || session?.user?.email || '?')
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="space-y-1">
                  <h1 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-100">
                    {name || session?.user?.name || 'Your profile'}
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                <p>
                  This information is used for delivery, order updates, and a more
                  personal experience in your White Kapra Studio account.
                </p>
                <p>
                  Keep your contact number and address up to date so your parcels
                  reach you smoothly.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-700 dark:bg-zinc-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Account secured
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-700 dark:bg-zinc-800">
                Preferred for Cash on Delivery
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-sm md:pl-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Full name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-sm shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Contact number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-sm shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                  placeholder="03XXXXXXXXX"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Delivery address</label>
              <textarea
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                placeholder="House, street, area, city"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
            {message && <p className="text-xs text-emerald-600 dark:text-emerald-400">{message}</p>}

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Your changes are saved securely to your account.
              </p>
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
