"use client";

import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/products';
import { useCartStore } from '@/lib/cart-store';
import type { MouseEvent } from 'react';

const featured = getFeaturedProducts();

export function FeaturedGrid() {
  const addItem = useCartStore((state) => state.addItem);

  const handleQuickAdd = (event: MouseEvent<HTMLButtonElement>, item: (typeof featured)[number]) => {
    event.preventDefault();
    event.stopPropagation();
    const defaultSize = item.sizes?.[0] ?? '4m';
    addItem(item, defaultSize);
  };

  return (
    <section className="section pt-0">
      <div className="container-shell space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Featured unstitched whites & blacks
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Cotton and wash & wear selections
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-medium text-slate-700 underline-offset-4 hover:underline"
          >
            View all products
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="card-surface flex flex-col gap-3 p-4 transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50">
                <Image
                  src={item.heroImage}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.12),_transparent_60%)] mix-blend-soft-light" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                  {item.category}
                </p>
                <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
                <p className="text-[12px] text-slate-500 line-clamp-2">{item.shortDescription}</p>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">
                  Rs. {item.price.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={(event) => handleQuickAdd(event, item)}
                  className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/70 focus:ring-offset-1 focus:ring-offset-white"
                >
                  Add to cart
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
