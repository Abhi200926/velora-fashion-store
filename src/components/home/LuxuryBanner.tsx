import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function LuxuryBanner() {
  return (
    <section className="relative overflow-hidden my-16">
      <div className="relative h-[400px] lg:h-[500px]">
        <img
          src="https://images.pexels.com/photos/17896699/pexels-photo-17896699.jpeg?auto=compress&cs=tinysrgb&h=1000&w=1600"
          alt="Luxury collection"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-lg">
              <p className="text-gold-400 text-xs font-medium uppercase tracking-[0.3em] mb-3">
                The Luxury Collection
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-cream-50 leading-[1.1]">
                Where Craft Meets
                <span className="block gold-gradient-text font-semibold">Artistry</span>
              </h2>
              <p className="text-cream-200/70 text-base mt-4 max-w-md leading-relaxed">
                Handcrafted from the finest materials, our luxury line redefines elegance for the discerning connoisseur.
              </p>
              <Link
                to="/category/luxury"
                className="group inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-all hover:shadow-lg hover:shadow-gold-500/20"
              >
                Explore Luxury
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
