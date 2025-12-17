"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const slides = [
  {
    title: 'Everyday white cotton, tailored for wear',
    subtitle:
      'Lightweight white cotton that stays breathable in Lahore heat yet presses crisp for a clean look.',
    tag: 'Cotton · Everyday',
    image: '/WhiteAura.jpg'
  },
  {
    title: 'Premium white cotton for occasions',
    subtitle:
      'Higher-thread-count white cotton with a smoother finish for juma, dawats and formal wear.',
    tag: 'Cotton · Premium',
    image: '/WhiteAura.jpg'
  },
  {
    title: 'Black wash & wear that holds shape',
    subtitle:
      'Crease‑light black blend that falls clean, resists wrinkles and carries you from office to evening.',
    tag: 'Wash & Wear · Black',
    image: '/BlackAura.jpg'
  }
];

export function HeroSection() {
  return (
    <section className="section pb-10">
      <div className="container-shell grid gap-12 lg:grid-cols-[1.15fr_minmax(0,_1fr)] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-7"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
            AURALEEN · White & Black Unstitched Kapra
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.1rem] lg:leading-[1.05]">
            White & black unstitched cloth
            <br className="hidden sm:block" />
             designed for Pakistani tailoring.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-[0.95rem]">
            A focused range of cotton and wash & wear in whites and blacks only – tuned GSM, clean fall and dependable finish so your darzi&apos;s stitching always looks premium.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/products">
              <Button size="lg" className="px-7">
                Shop unstitched suits
              </Button>
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <span>Cash on Delivery · Pakistan‑wide shipping.</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/70 bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Fresh whites weekly
              </span>
            </div>
          </div>
          <div className="mt-4 grid gap-3 text-[11px] text-slate-500 sm:grid-cols-3">
            <div className="flex items-start gap-2">
              <span className="mt-[3px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] text-white">
                ✓
              </span>
              <p>Weights tuned so your kameez falls sharp, not floppy.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-[3px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] text-white">
                ✓
              </span>
              <p>Ideal for shalwar kameez, kurta pyjama and waistcoats.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-[3px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] text-white">
                ✓
              </span>
              <p>Pay cash on delivery anywhere in Pakistan.</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative card-surface overflow-hidden border-slate-100/80 bg-white/90"
        >
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.05),_transparent_55%)]" />
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            loop
            pagination={{ clickable: true }}
            className="relative h-full w-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.title}>
                <div className="grid h-full min-h-[320px] grid-rows-[1.3fr_auto] overflow-hidden sm:min-h-[430px]">
                  <div
                    className="relative bg-contain bg-center bg-no-repeat bg-slate-900"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/5" />
                  </div>
                  <div className="flex items-center justify-between gap-3 px-5 py-4 text-xs text-slate-700">
                    <div>
                      <p className="font-medium uppercase tracking-[0.2em] text-slate-500">
                        {slide.tag}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">{slide.title}</p>
                      <p className="text-[11px] text-slate-600 sm:text-xs">
                        {slide.subtitle}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">
                      White & Black only
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
