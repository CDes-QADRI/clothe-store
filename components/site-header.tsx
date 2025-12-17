"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/cart-store';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop unstitched suits' },
  { href: '/cart', label: 'Cart' }
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!accountMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (!accountMenuRef.current) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!accountMenuRef.current.contains(target)) {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [accountMenuOpen]);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut({ redirect: false });
      useCartStore.getState().clear();
      router.push('/');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-bold shadow-sm">
            AL
          </span>
          <span className="text-sm sm:text-base">AURALEEN</span>
        </Link>
        <nav className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 sm:flex">
          {navItems.map((item) => {
            const isCart = item.href === '/cart';
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative inline-flex items-center gap-1 transition hover:text-slate-900',
                  isActive &&
                    'text-slate-900 underline underline-offset-4 decoration-slate-300'
                )}
              >
                <span>{item.label}</span>
                {isCart && cartCount > 0 && (
                  <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {session ? (
            <div
              className="relative hidden items-center sm:flex"
              ref={accountMenuRef}
            >
              <button
                type="button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white text-[11px] font-medium text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800',
                  accountMenuOpen && 'border-emerald-300 bg-emerald-100 text-emerald-800'
                )}
                aria-label="Open account menu"
              >
                <span className="flex flex-col gap-[3px]">
                  <span className="h-[1.5px] w-4 rounded-full bg-slate-900" />
                  <span className="h-[1.5px] w-4 rounded-full bg-slate-900" />
                  <span className="h-[1.5px] w-4 rounded-full bg-slate-900" />
                </span>
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 top-11 w-52 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 text-xs shadow-lg">
                  <div className="border-b border-slate-200/70 px-3 py-2 text-[11px] text-slate-500">
                    <p className="text-[11px] font-medium text-slate-900 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <nav className="flex flex-col py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600">
                    <Link
                      href="/account/profile"
                      onClick={() => setAccountMenuOpen(false)}
                      className="px-3 py-2 hover:bg-slate-50"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setAccountMenuOpen(false)}
                      className="px-3 py-2 hover:bg-slate-50"
                    >
                      Orders
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        void handleSignOut();
                      }}
                      className="px-3 py-2 text-left text-slate-700 hover:bg-slate-900 hover:text-white disabled:opacity-60"
                      disabled={signingOut}
                    >
                      {signingOut ? 'Signing out…' : 'Sign out'}
                    </button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </Link>
          )}

          {/* Mobile cart + menu */}
          <Link
            href="/cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-medium text-slate-700 shadow-sm sm:hidden"
          >
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-medium text-slate-700 shadow-sm sm:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            <span className="flex flex-col gap-[3px]">
              <span
                className={cn(
                  'h-[1.5px] w-4 rounded-full bg-slate-900 transition-transform',
                  mobileOpen && 'translate-y-[4px] rotate-45'
                )}
              />
              <span
                className={cn(
                  'h-[1.5px] w-3 rounded-full bg-slate-900 transition-opacity',
                  mobileOpen && 'opacity-0'
                )}
              />
              <span
                className={cn(
                  'h-[1.5px] w-5 rounded-full bg-slate-900 transition-transform',
                  mobileOpen && '-translate-y-[4px] -rotate-45'
                )}
              />
            </span>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-slate-200/70 bg-white/95 py-3 shadow-md sm:hidden">
          <div className="container-shell flex flex-col gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isCart = item.href === '/cart';
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center justify-between rounded-full border border-transparent bg-slate-50 px-4 py-2 text-[11px] tracking-[0.18em] transition hover:border-slate-200 hover:bg-white',
                      isActive && 'border-slate-900 bg-slate-900 text-white'
                    )}
                  >
                    <span>{item.label}</span>
                    {isCart && cartCount > 0 && (
                      <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-semibold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-1 flex flex-col gap-2">
              {session && (
                <>
                  <Link
                    href="/account/orders"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] tracking-[0.18em] text-slate-700"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/account/profile"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] tracking-[0.18em] text-slate-700"
                  >
                    Profile
                  </Link>
                </>
              )}
              {session ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    void handleSignOut();
                  }}
                  className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white disabled:opacity-60"
                  disabled={signingOut}
                >
                  {signingOut ? 'Signing out…' : 'Sign out'}
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
