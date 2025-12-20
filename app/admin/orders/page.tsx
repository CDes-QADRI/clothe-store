"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ScrollReveal } from '@/components/scroll-reveal';

type AdminOrderItem = {
  name: string;
  size: string;
  quantity: number;
  price: number;
};

type AdminOrder = {
  _id: string;
  userEmail: string | null;
  customerName: string;
  phone: string;
  city: string;
  area: string;
  address: string;
  subtotal: number;
  items: AdminOrderItem[];
  createdAt: string;
};

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? 'Could not load orders.');
          return;
        }

        setOrders(data.orders ?? []);
      } catch {
        setError('Something went wrong while loading orders.');
      }
    };

    fetchOrders();
  }, [session, status, router]);

  if (status === 'loading') {
    return null;
  }

  return (
    <section className="section">
      <ScrollReveal className="container-shell space-y-6">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
            Admin
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            All orders
          </h1>
          <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
            Signed in as <span className="font-mono">{session?.user?.email}</span>
          </p>
        </div>

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {orders.length === 0 && !error ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-7 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
            <p>No orders found yet.</p>
            <p className="mt-1">
              Once customers place Cash on Delivery orders, they will appear here.
            </p>
          </div>
        ) : null}

        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-zinc-200 bg-white p-5 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                      Order {String(order._id).slice(-6).toUpperCase()}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {order.city} · {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {order.customerName} · {order.phone}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{order.address}</p>
                    {order.userEmail && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Account email: <span className="font-mono">{order.userEmail}</span>
                      </p>
                    )}
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
