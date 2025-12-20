"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';

type StoredOrderItem = {
  name: string;
  size: string;
  quantity: number;
  price: number;
};

type StoredOrder = {
  id: string;
  subtotal: number;
  createdAt: string;
  email: string | null;
  customerName: string;
  city: string;
  items: StoredOrderItem[];
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    if (!session?.user?.email) return;
    if (typeof window === 'undefined') return;

    const raw = window.localStorage.getItem('wk-orders');
    if (!raw) {
      setOrders([]);
      return;
    }

    try {
      const all: StoredOrder[] = JSON.parse(raw);
      setOrders(all.filter((o) => o.email === session.user?.email));
    } catch {
      setOrders([]);
    }
  }, [session?.user?.email]);

  if (status === 'loading') {
    return null;
  }

  if (!session) {
    return (
      <section className="section">
        <ScrollReveal className="container-shell max-w-lg space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Your orders
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Please sign in with your White Kapra account to see any Cash on
            Delivery orders placed under your email.
          </p>
          <Link href="/login">
            <Button size="sm">Sign in</Button>
          </Link>
        </ScrollReveal>
      </section>
    );
  }

  return (
    <section className="section">
      <ScrollReveal className="container-shell space-y-6">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
            Orders
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Your order history
          </h1>
          <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
            Signed in as <span className="font-mono">{session.user?.email}</span>
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-7 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
            <p>No orders found for this account yet.</p>
            <p className="mt-1">
              Place an order using checkout while signed in and it will appear
              here for easy tracking.
            </p>
            <Link href="/products" className="mt-4 inline-flex">
              <Button size="sm">Shop whites</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-zinc-200 bg-white p-5 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                      Order {order.id}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {order.city} · {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Rs. {order.subtotal.toLocaleString()}
                  </p>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {item.name} · {item.size} × {item.quantity}
                      </span>
                      <span>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}
