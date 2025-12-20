"use client";

import { FormEvent, useState } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ScrollReveal } from '@/components/scroll-reveal';

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(formData.get('name') ?? ''),
          phone: String(formData.get('phone') ?? ''),
          city: String(formData.get('city') ?? ''),
          area: String(formData.get('area') ?? ''),
          address: String(formData.get('address') ?? ''),
          subtotal,
          items: items.map((item) => ({
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Failed to place order', data);
        return;
      }

      setPlacedOrderId(data.id ?? null);
      clear();
      form.reset();
    } catch (err) {
      console.error('Error placing order', err);
    }
  }

  if (status === 'loading') {
    return (
      <section className="section">
        <div className="container-shell max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
          Checking your account please wait...
        </div>
      </section>
    );
  }

  if (status === 'unauthenticated' || !session) {
    return (
      <section className="section">
        <ScrollReveal className="container-shell max-w-xl space-y-5">
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
              Checkout
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Please sign in to continue
            </h1>
            <p className="text-[13px] text-zinc-600 dark:text-zinc-400">
              You need an account to place an order. Sign in to continue to checkout or create a new account in a few seconds.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/login?callbackUrl=/checkout">
              <Button size="lg" className="px-6">
                Sign in and continue
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="px-6">
                Create a new account
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    );
  }

  if (placedOrderId) {
    return (
      <section className="section">
        <ScrollReveal className="container-shell max-w-xl space-y-5">
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
              Order placed (COD)
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Shukriya – we have your request.
            </h1>
            <p className="text-[13px] text-zinc-600 dark:text-zinc-400">
              Your order ID is <span className="font-mono font-semibold">{placedOrderId}</span>.
              Our team will call or WhatsApp you shortly to confirm sizing,
              address and delivery window before dispatching on Cash on
              Delivery.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white px-4 py-4 text-[12px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
            <p className="font-semibold dark:text-zinc-100">What happens next?</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>A stylist confirms your size and preferred fit.</li>
              <li>We share expected delivery day and shipping charges.</li>
              <li>You pay in cash when your whites arrive – simple.</li>
            </ul>
          </div>
          <Link href="/products" className="inline-flex">
            <Button size="sm">Back to shop</Button>
          </Link>
        </ScrollReveal>
      </section>
    );
  }

  return (
    <section className="section">
      <ScrollReveal className="container-shell grid gap-8 lg:grid-cols-[minmax(0,_1.2fr)_minmax(0,_0.9fr)]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
              Checkout · COD only
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
              Delivery details
            </h1>
            <p className="mt-2 text-[13px] text-zinc-600 dark:text-zinc-400">
              We only need a few details to dispatch your white kapra order on
              Cash on Delivery within Pakistan.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1 text-sm">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Full name</label>
              <input
                name="name"
                required
                className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                placeholder="Ali Khan"
              />
            </div>
            <div className="space-y-1 text-sm">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">WhatsApp number</label>
              <input
                name="phone"
                required
                className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                placeholder="03xx-xxxxxxx"
              />
            </div>
            <div className="space-y-1 text-sm">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">City</label>
              <input
                name="city"
                required
                className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                placeholder="Karachi, Lahore, Islamabad..."
              />
            </div>
            <div className="space-y-1 text-sm">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Area / locality</label>
              <input
                name="area"
                required
                className="h-10 w-full rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                placeholder="DHA Phase 6, Johar Town..."
              />
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Complete address</label>
            <textarea
              name="address"
              required
              rows={3}
              className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
              placeholder="House / flat number, street, nearest landmark, etc."
            />
          </div>
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Place order (Cash on Delivery)
          </Button>
        </form>

        <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-5 text-sm shadow-soft dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Order summary
            </p>
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white dark:bg-white dark:text-zinc-900">
              COD only
            </span>
          </div>
          {items.length === 0 ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Your cart is empty. You can still fill in your details, but we
              recommend picking a product first.
            </p>
          ) : (
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="flex justify-between">
                  <span>
                    {item.name} · {item.size} × {item.quantity}
                  </span>
                  <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              Final total and delivery window will be confirmed on call /
              WhatsApp before dispatch. No advance payment required.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
