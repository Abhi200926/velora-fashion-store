import { useEffect, useState } from 'react';
import { Truck, Sparkles } from 'lucide-react';

const messages = [
  'Free shipping on all orders above ₹999 — Shop now!',
  'Use code VELORA10 for 10% off your first order',
  'New Arrivals just dropped — Explore the latest trends',
  'Luxury Collection: Exclusive pieces now available',
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-gold-700 via-gold-500 to-gold-700 text-ink-950 text-xs sm:text-sm py-2 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-center gap-3">
        <Sparkles className="w-3.5 h-3.5 shrink-0 hidden sm:block" />
        <p key={index} className="text-center font-medium animate-fade-in whitespace-nowrap">
          {messages[index]}
        </p>
        <Truck className="w-3.5 h-3.5 shrink-0 hidden sm:block" />
      </div>
    </div>
  );
}
