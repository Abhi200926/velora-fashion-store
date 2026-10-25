import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ananya Reddy',
    location: 'Mumbai',
    rating: 5,
    text: 'The quality of VELORA\'s pieces exceeded my expectations. The stitching, the fabric, the packaging — everything feels premium. My go-to for occasion wear now.',
    product: 'Midnight Elegance Dress',
  },
  {
    name: 'Vikram Patel',
    location: 'Bengaluru',
    rating: 5,
    text: 'Bought the Tailored Charcoal Suit for a wedding and got countless compliments. The fit was perfect off the rack and the fabric is luxurious. Worth every rupee.',
    product: 'Tailored Charcoal Suit',
  },
  {
    name: 'Priya Nair',
    location: 'Delhi',
    rating: 4,
    text: 'Beautiful collections and incredibly fast delivery. The size guide was spot on and the return process was hassle-free. VELORA has become my favourite fashion destination.',
    product: 'Quilted Luxe Handbag',
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="text-center mb-12">
        <p className="text-gold-600 text-xs font-medium uppercase tracking-[0.3em] mb-2">Loved by Thousands</p>
        <h2 className="text-3xl sm:text-4xl font-serif text-ink-100">What Our Customers Say</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-ink-900 border border-ink-700/50 rounded-xl p-6 lg:p-8 relative"
          >
            <Quote className="w-8 h-8 text-gold-400/30 absolute top-6 right-6" />
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-4 h-4 ${idx < t.rating ? 'fill-gold-400 text-gold-400' : 'text-ink-400'}`}
                />
              ))}
            </div>
            <p className="text-sm text-ink-200 leading-relaxed mb-6">{t.text}</p>
            <div className="flex items-center gap-3 pt-4 border-t border-ink-700/50">
              <div className="w-10 h-10 rounded-full bg-gold-100 border border-gold-300/50 flex items-center justify-center text-gold-700 font-medium text-sm">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-ink-100">{t.name}</p>
                <p className="text-xs text-ink-400">{t.location} · Bought {t.product}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
