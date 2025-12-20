import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/products';
import React, { Suspense } from 'react';
import { AddToCartClient } from '@/components/add-to-cart-client';
import { ScrollReveal } from '@/components/scroll-reveal';

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="section">
      <ScrollReveal className="container-shell grid gap-10 lg:grid-cols-[minmax(0,_1.05fr)_minmax(0,_1fr)] lg:items-start">
        <div className="space-y-4 max-w-xl mx-auto lg:max-w-none">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-50 dark:bg-zinc-800">
            <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-800">
              <img
                src={product.heroImage}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.18),_transparent_55%)] mix-blend-soft-light dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_55%)]" />
          </div>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
              {product.category}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              {product.name}
            </h1>
            <p className="text-[13px] text-zinc-600 dark:text-zinc-400">{product.shortDescription}</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Rs. {product.price.toLocaleString()}
            </span>
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white dark:bg-zinc-100 dark:text-zinc-900">
              AURALEEN
            </span>
          </div>
          <Suspense>
            <AddToCartClient product={product} />
          </Suspense>
          <div className="space-y-3 border-t border-zinc-200 pt-4 text-[12px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            <p>{product.description}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  Fabric & feel
                </p>
                <p className="mt-1">{product.fabric}</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-500">Approx. {product.gsm} GSM</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  Fit notes
                </p>
                <p className="mt-1">{product.fitNotes}</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Care
              </p>
              <p className="mt-1">{product.care}</p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
