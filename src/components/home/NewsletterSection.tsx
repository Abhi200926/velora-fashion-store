import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast('Thank you for subscribing! Check your inbox for a welcome offer.', 'success');
    setEmail('');
  };

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink-800 to-ink-100" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-500/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-ink-800 border border-gold-500/20 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-7 h-7 text-gold-400" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-cream-50 mb-3">
          Join the VELORA Circle
        </h2>
        <p className="text-sm text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed">
          Subscribe to get exclusive access to new arrivals, private sales, and a special welcome discount of 15% on your first order.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 bg-ink-800 border border-ink-700 rounded-lg px-4 py-3.5 text-sm text-cream-100 placeholder-neutral-500 focus:outline-none focus:border-gold-500/50 transition-colors"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gold-500 text-ink-950 text-sm font-semibold rounded-lg hover:bg-gold-400 transition-colors whitespace-nowrap"
          >
            Subscribe
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-xs text-neutral-600 mt-4">
          By subscribing, you agree to our Privacy Policy and consent to receive marketing emails.
        </p>
      </div>
    </section>
  );
}
