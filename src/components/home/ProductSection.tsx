import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  badge?: string;
}

export function ProductSection({ title, subtitle, products, viewAllLink, badge }: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          {badge && (
            <p className="text-gold-400 text-xs font-medium uppercase tracking-[0.3em] mb-2">{badge}</p>
          )}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-cream-50">{title}</h2>
          {subtitle && <p className="text-sm text-neutral-400 mt-2">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="group inline-flex items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300 transition-colors whitespace-nowrap"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
