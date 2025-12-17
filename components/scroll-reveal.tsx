"use client";

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
};

export function ScrollReveal({ children, className, delay = 0, once = false }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const lastScrollYRef = useRef(0);
  const hasRevealedRef = useRef(false);
  const inView = useInView(ref, {
    amount: 0.2,
    margin: '0px 0px -10% 0px',
    once: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    lastScrollYRef.current = window.scrollY;

    function onScroll() {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      if (delta > 1) {
        setScrollDirection((prev) => (prev === 'down' ? prev : 'down'));
      } else if (delta < -1) {
        setScrollDirection((prev) => (prev === 'up' ? prev : 'up'));
      }

      lastScrollYRef.current = currentY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (inView) hasRevealedRef.current = true;
  }, [inView]);

  const lockedVisible = once && hasRevealedRef.current;
  const animateVariant = lockedVisible
    ? 'visible'
    : inView
      ? 'visible'
      : scrollDirection === 'down'
        ? 'offLeft'
        : 'offRight';

  return (
    <motion.div
      ref={ref}
      className={cn('will-change-transform', className)}
      variants={{
        offLeft: { x: -32, filter: 'blur(6px)', transition: { duration: 0 } },
        offRight: { x: 32, filter: 'blur(6px)', transition: { duration: 0 } },
        visible: {
          x: 0,
          filter: 'blur(0px)',
          transition: {
            duration: 0.45,
            ease: [0.22, 0.61, 0.36, 1],
            delay
          }
        }
      }}
      initial={scrollDirection === 'down' ? 'offLeft' : 'offRight'}
      animate={animateVariant}
    >
      {children}
    </motion.div>
  );
}
