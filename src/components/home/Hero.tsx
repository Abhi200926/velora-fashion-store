import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[500px] lg:h-[85vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/33714925/pexels-photo-33714925.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600"
          alt="Fashion editorial"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-ink-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />
      </div>

      {/* Content */}
      <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl animate-fade-in-up">
          <p className="text-gold-400 text-sm font-medium uppercase tracking-[0.3em] mb-4">
            VELORA · Autumn/Winter 2026
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-cream-50 leading-[1.1] text-balance">
            Elegance is
            <br />
            <span className="gold-gradient-text font-semibold">an attitude.</span>
          </h1>
          <p className="text-cream-200/80 text-base sm:text-lg mt-6 max-w-md leading-relaxed">
            Discover curated collections that blend everyday comfort with luxury craftsmanship. Style that speaks, for every occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              to="/category/women"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-all hover:shadow-lg hover:shadow-gold-500/20"
            >
              Shop Women
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/category/men"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink-900/50 backdrop-blur border border-cream-100/20 text-cream-100 text-sm font-semibold rounded-lg hover:border-gold-500/50 hover:text-gold-300 transition-all"
            >
              Shop Men
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
        <div className="w-px h-12 bg-gradient-to-b from-gold-500/0 via-gold-500/60 to-gold-500/0" />
      </div>
    </section>
  );
}
