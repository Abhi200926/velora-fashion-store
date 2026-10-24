import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export function Rating({ rating, reviewCount, size = 'sm' }: RatingProps) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => {
          const fill = Math.max(0, Math.min(1, rating - (i - 1)));
          return (
            <div key={i} className="relative">
              <Star className={`${starSize} text-neutral-600`} fill="currentColor" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={`${starSize} text-gold-400`} fill="currentColor" />
              </div>
            </div>
          );
        })}
      </div>
      <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-neutral-400`}>
        {rating.toFixed(1)}
        {reviewCount !== undefined && ` (${reviewCount})`}
      </span>
    </div>
  );
}
