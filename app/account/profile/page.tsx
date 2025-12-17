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
          <div className="profile-orbit absolute -left-32 -top-40 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl" />
          <div className="profile-orbit-delayed absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_transparent_60%)]" />
        </div>
        <div className="container-shell flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-5 py-3 text-sm shadow-soft">
            <span className="h-2 w-2 animate-pulse rounded-full bg-slate-900" />
            <span className="text-slate-600">Loading your profile…</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="profile-orbit absolute -left-32 -top-40 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="profile-orbit-delayed absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_60%)]" />
      </div>
      <div className="container-shell flex min-h-[70vh] items-center justify-center py-8 sm:py-12">
        <ScrollReveal className="grid w-full max-w-4xl gap-8 rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-soft backdrop-blur-xl sm:p-8 md:grid-cols-[1.05fr,1.6fr]">
          <div className="flex flex-col justify-between border-b border-slate-200/80 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8">
            <div className="space-y-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                Profile
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold uppercase text-slate-50 shadow-sm">
                  {(name || session?.user?.name || session?.user?.email || '?')
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="space-y-1">
                  <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                    {name || session?.user?.name || 'Your profile'}
                  </h1>
                  <p className="text-xs text-slate-500">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-[11px] text-slate-500">
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
            <div className="mt-6 flex flex-wrap gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Account secured
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                Preferred for Cash on Delivery
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-sm md:pl-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-full border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Contact number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="h-10 w-full rounded-full border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900"
                  placeholder="03XXXXXXXXX"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Delivery address</label>
              <textarea
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900"
                placeholder="House, street, area, city"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
            {message && <p className="text-xs text-emerald-600">{message}</p>}

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-slate-500">
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
