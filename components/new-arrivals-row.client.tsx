"use client";

import Link from 'next/link';
import Image from 'next/image';
import { getNewArrivalProducts } from '@/lib/products';

const arrivals = getNewArrivalProducts();

export function NewArrivalsRow() {
  return (
    <section className="section border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="container-shell flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
            New rolls this week
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Fresh unstitched white & black cloth
          </h2>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            Focused updates in cotton and wash & wear - timeless white and black qualities instead of chasing every passing colour trend.
          </p>
        </div>
        <div className="flex flex-1 flex-wrap gap-3">
          {arrivals.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="flex-1 min-w-[210px] max-w-[250px] rounded-2xl border border-zinc-200 bg-white p-2 text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="flex gap-2">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-zinc-100 flex items-center justify-center dark:bg-zinc-800">
                  <Image
                    src={item.heroImage}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{item.name}</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{item.shortDescription}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
