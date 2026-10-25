import { Hero } from '@/components/home/Hero';
import { CategorySection } from '@/components/home/CategorySection';
import { ProductSection } from '@/components/home/ProductSection';
import { LuxuryBanner } from '@/components/home/LuxuryBanner';
import { PromotionalOffers } from '@/components/home/PromotionalOffers';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { products } from '@/data/products';

export function HomePage() {
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 8);
  const trending = products.filter(p => p.isBestseller && !p.isNewArrival).slice(0, 4);
  const bestsellers = products.filter(p => p.isBestseller).slice(0, 8);

  return (
    <div>
      <Hero />
      <CategorySection />
      <ProductSection
        title="New Arrivals"
        badge="Just In"
        subtitle="The latest additions to our curated collection"
        products={newArrivals}
        viewAllLink="/category/new-arrivals"
      />
      <ProductSection
        title="Trending Now"
        badge="Hot Picks"
        subtitle="What everyone's loving this season"
        products={trending}
      />
      <LuxuryBanner />
      <ProductSection
        title="Bestsellers"
        badge="Most Loved"
        subtitle="Customer favorites that keep flying off the shelves"
        products={bestsellers}
        viewAllLink="/category/bestsellers"
      />
      <PromotionalOffers />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
