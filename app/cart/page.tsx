"use client";

import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="section">
      <ScrollReveal className="container-shell space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Cart
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Your selected white & black rolls
            </h1>
          </div>
          {items.length > 0 && (
            <p className="text-xs text-slate-500">
              Cash on Delivery only · You can edit quantities below.
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300/70 bg-white/80 px-6 py-8 text-center text-sm text-slate-500">
            <p>Your cart is empty at the moment.</p>
            <p className="mt-1">Begin with a classic white or black roll for your next suit.</p>
            <Link href="/products" className="mt-4 inline-flex">
              <Button size="sm">Browse all fabrics</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,_1.4fr)_minmax(0,_0.8fr)]">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm shadow-sm"
                >
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      {item.size}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-xs text-slate-500">Rs. {item.price.toLocaleString()} each</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-xs">
                    <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-1">
                      <button
                        type="button"
                        className="px-2 py-1"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="px-2 text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-2 py-1"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="text-[11px] text-slate-500 underline-offset-4 hover:underline"
                      onClick={() => removeItem(item.productId, item.size)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-surface flex flex-col gap-4 p-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="text-base font-semibold text-slate-900">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Shipping and COD handling will be confirmed over WhatsApp or call
                after you place the order.
              </p>
              <Link href="/checkout">
                <Button size="lg" className="w-full">
                  Continue to checkout (COD)
                </Button>
              </Link>
            </div>
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}
