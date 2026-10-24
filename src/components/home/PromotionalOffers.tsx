import { Link } from 'react-router-dom';
import { Tag, Percent, Gift } from 'lucide-react';

export function PromotionalOffers() {
  const offers = [
    {
      icon: Percent,
      title: 'Up to 70% Off',
      desc: 'Mega Fashion Sale on selected styles',
      link: '/category/bestsellers',
      cta: 'Shop Sale',
    },
    {
      icon: Gift,
      title: 'Buy 2 Get 1 Free',
      desc: 'On all accessories and eyewear',
      link: '/category/accessories',
      cta: 'Shop Now',
    },
    {
      icon: Tag,
      title: 'Flat ₹500 Off',
      desc: 'On minimum purchase of ₹2,999. Code: FASHION15',
      link: '/category/new-arrivals',
      cta: 'Use Code',
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <p className="text-gold-400 text-xs font-medium uppercase tracking-[0.3em] mb-2">Offers</p>
        <h2 className="text-3xl sm:text-4xl font-serif text-cream-50">Promotional Offers</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {offers.map((offer, i) => (
          <Link
            key={i}
            to={offer.link}
            className="group relative bg-ink-900 border border-ink-700/50 rounded-xl p-6 hover:border-gold-500/30 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl group-hover:bg-gold-500/10 transition-colors" />
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-ink-800 border border-gold-500/20 flex items-center justify-center mb-4">
                <offer.icon className="w-5 h-5 text-gold-400" />
              </div>
              <h3 className="text-xl font-serif text-cream-50 mb-1">{offer.title}</h3>
              <p className="text-sm text-neutral-400">{offer.desc}</p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm text-gold-400 group-hover:text-gold-300 transition-colors">
                {offer.cta} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
