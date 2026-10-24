import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Shield, Truck, RefreshCw, CreditCard } from 'lucide-react';

const footerLinks = {
  'Customer Support': [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Help Center', href: '/help' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'My Account', href: '/account' },
    { label: 'Returns & Exchange', href: '/returns' },
  ],
  'About VELORA': [
    { label: 'Our Story', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Sustainability', href: '/sustainability' },
  ],
  Policies: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Refund Policy', href: '/refund' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-ink-950 border-t border-gold-500/15">
      {/* Features strip */}
      <div className="border-b border-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '7-day return policy' },
              { icon: Shield, title: 'Secure Payment', desc: '100% protected checkout' },
              { icon: CreditCard, title: 'COD Available', desc: 'Cash on delivery option' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-ink-800 border border-gold-500/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-cream-100">{item.title}</h4>
                  <p className="text-xs text-neutral-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-serif gold-gradient-text mb-3">VELORA</h3>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
              Style That Speaks. Discover affordable everyday fashion and premium luxury pieces, curated for the modern Indian wardrobe.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-ink-800 border border-ink-700 flex items-center justify-center text-neutral-400 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
                  aria-label="Social media"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-cream-100 mb-4 uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-neutral-400 hover:text-gold-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Bengaluru, India
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> +91 80 4567 8900
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> care@velora.in
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            © 2026 VELORA Fashion Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
