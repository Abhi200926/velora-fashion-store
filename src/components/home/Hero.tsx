import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[560px] lg:h-[92vh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/33714925/pexels-photo-33714925.jpeg?auto=compress&cs=tinysrgb&h=1400&w=2000"
          alt="VELORA Autumn/Winter 2026 editorial fashion campaign"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl animate-fade-in-up">
          <p className="text-gold-300 text-sm font-medium uppercase tracking-[0.3em] mb-4">
            VELORA · Autumn / Winter 2026
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-white leading-[1.05] text-balance">
            Elegance is
            <br />
            <span className="gold-gradient-text font-semibold">an attitude.</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg mt-6 max-w-md leading-relaxed font-light">
            Discover curated collections that blend everyday comfort with luxury craftsmanship. Style that speaks, for every occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              to="/category/women"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 text-white text-sm font-semibold rounded-lg hover:bg-gold-600 transition-all hover:shadow-lg hover:shadow-gold-500/30"
            >
              Shop Women
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/category/men"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-all"
            >
              Shop Men
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/style-finder"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-white text-sm font-semibold rounded-lg border border-gold-400/50 hover:bg-gold-500/10 transition-all"
            >
              Find Your Style
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
        <div className="w-px h-12 bg-gradient-to-b from-gold-400/0 via-gold-400/60 to-gold-400/0" />
      </div>
    </section>
  );
}
