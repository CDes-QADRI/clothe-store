"use client";

import Link from 'next/link';
import Image from 'next/image';
import { getNewArrivalProducts } from '@/lib/products';

const arrivals = getNewArrivalProducts();

export function NewArrivalsRow() {
  return (
    <section className="section border-t border-slate-200/70 bg-slate-50/60">
      <div className="container-shell flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
            New rolls this week
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
            Fresh unstitched white & black cloth
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Focused updates in cotton and wash & wear  timeless white and black qualities instead of chasing every passing colour trend.
          </p>
        </div>
        <div className="flex flex-1 flex-wrap gap-3">
          {arrivals.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="flex-1 min-w-[210px] max-w-[250px] rounded-2xl border border-slate-200/70 bg-white/90 p-2 text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex gap-2">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
                  <Image
                    src={item.heroImage}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-[11px] text-slate-500">{item.shortDescription}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
