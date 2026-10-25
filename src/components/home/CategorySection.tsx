import { Link } from 'react-router-dom';
import { categories } from '@/data/products';

export function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="text-center mb-10">
        <p className="text-gold-400 text-xs font-medium uppercase tracking-[0.3em] mb-2">Explore</p>
        <h2 className="text-3xl sm:text-4xl font-serif text-cream-50">Shop by Category</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {categories.slice(0, 6).map(cat => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-ink-800"
          >
            <img
              src={cat.image}
              alt={cat.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <h3 className="text-lg font-serif text-cream-50 group-hover:text-gold-300 transition-colors">
                {cat.name}
              </h3>
              <span className="text-xs text-cream-200/60 opacity-0 group-hover:opacity-100 transition-opacity">
                Shop Now →
              </span>
            </div>
            <div className="absolute inset-0 border-2 border-gold-500/0 group-hover:border-gold-500/30 rounded-xl transition-colors duration-300" />
          </Link>
        ))}
      </div>

      {/* Secondary categories */}
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {categories.slice(6).map(cat => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="px-6 py-3 bg-ink-800 border border-ink-700 rounded-full text-sm text-cream-100 hover:border-gold-500/40 hover:text-gold-300 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
