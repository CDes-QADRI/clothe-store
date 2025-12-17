import { HeroSection } from '@/components/hero-section';
import { FeaturedGrid } from '@/components/featured-grid';
import { NewArrivalsRow } from '@/components/new-arrivals-row';
import { ScrollReveal } from '@/components/scroll-reveal';

export default function HomePage() {
  return (
    <div className="space-y-10 sm:space-y-16">
      <ScrollReveal>
        <HeroSection />
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <FeaturedGrid />
      </ScrollReveal>
      <ScrollReveal delay={0.12}>
        <NewArrivalsRow />
      </ScrollReveal>
    </div>
  );
}
