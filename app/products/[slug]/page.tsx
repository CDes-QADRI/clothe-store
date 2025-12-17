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
          <div className="relative overflow-hidden rounded-3xl bg-slate-50">
            <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden flex items-center justify-center bg-slate-50">
              <img
                src={product.heroImage}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.18),_transparent_55%)] mix-blend-soft-light" />
          </div>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
              {product.category}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {product.name}
            </h1>
            <p className="text-[13px] text-slate-600">{product.shortDescription}</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-2xl font-semibold text-slate-900">
              Rs. {product.price.toLocaleString()}
            </span>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white">
              AURALEEN
            </span>
          </div>
          <Suspense>
            <AddToCartClient product={product} />
          </Suspense>
          <div className="space-y-3 border-t border-slate-200/70 pt-4 text-[12px] text-slate-600">
            <p>{product.description}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Fabric & feel
                </p>
                <p className="mt-1">{product.fabric}</p>
                <p className="text-[11px] text-slate-500">Approx. {product.gsm} GSM</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Fit notes
                </p>
                <p className="mt-1">{product.fitNotes}</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
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
