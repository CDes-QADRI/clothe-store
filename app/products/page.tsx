"use client";

import Link from 'next/link';
import { useMemo, useState, type MouseEvent } from 'react';
import { PRODUCTS, type Product } from '@/lib/products';
import { ScrollReveal } from '@/components/scroll-reveal';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/cart-store';

const CATEGORIES: (Product['category'] | 'All')[] = ['All', 'Cotton', 'Wash & Wear'];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const addItem = useCartStore((state) => state.addItem);

  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const handleQuickAdd = (event: MouseEvent<HTMLButtonElement>, product: Product) => {
    event.preventDefault();
    event.stopPropagation();
    const defaultSize = product.sizes?.[0] ?? '4m';
    addItem(product, defaultSize);
  };

  return (
    <section className="section">
      <ScrollReveal className="container-shell space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Shop unstitched white & black kapra
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Cotton & wash & wear rolls
              <span className="hidden sm:inline"> curated for you.</span>
            </h1>
            <p className="mt-2 max-w-xl text-[13px] text-slate-600">
              A focused collection of unstitched white and black cloth for everyday wear and occasions – everyday and premium cotton for whites, plus black wash & wear in regular and richer finishes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 rounded-full bg-white/80 p-1 text-[11px] shadow-sm ring-1 ring-slate-200/70">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-3.5 py-1.5 transition ${
                  activeCategory === category
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {category === 'All' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((product, index) => (
              <ScrollReveal key={product.id} delay={(index % 6) * 0.04}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group flex flex-col rounded-3xl border border-slate-200/70 bg-white/80 p-3 shadow-sm ring-1 ring-transparent transition hover:-translate-y-1 hover:border-slate-900/15 hover:shadow-soft hover:ring-slate-900/5"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-slate-50">
                    <div
                      className="aspect-square bg-cover bg-center"
                      style={{ backgroundImage: `url(${product.heroImage})` }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.18),_transparent_55%)] opacity-70 mix-blend-soft-light" />
                    {product.isNew && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-700">
                        New
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex-1 space-y-1">
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                      {product.category}
                    </p>
                    <h2 className="text-sm font-semibold text-slate-900 group-hover:underline group-hover:underline-offset-4">
                      {product.name}
                    </h2>
                    <p className="text-[12px] text-slate-500 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-slate-900">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => handleQuickAdd(event, product)}
                      className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/70 focus:ring-offset-1 focus:ring-offset-white"
                    >
                      Add to cart
                    </button>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full text-center text-sm text-slate-500">
                Nothing here yet – please check back soon for additional white and black rolls.
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="rounded-3xl border border-dashed border-slate-300/70 bg-white/70 px-4 py-4 text-[11px] text-slate-500 sm:px-6 sm:py-5">
          <p>
            All fabric is sourced with Pakistani weather in mind and shipped via Cash on Delivery.
            For bulk metres, institutional requirements or specific brands (for example export latha), this section can later be extended into a dedicated enquiry form.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
