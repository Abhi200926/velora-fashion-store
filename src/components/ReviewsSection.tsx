import { useState } from 'react';
import { ThumbsUp, BadgeCheck, ChevronDown } from 'lucide-react';
import type { Product } from '@/types';
import { getReviewsByProductId, getRatingBreakdown } from '@/data/reviews';
import { Rating } from '@/components/Rating';

interface ReviewsSectionProps {
  product: Product;
}

export function ReviewsSection({ product }: ReviewsSectionProps) {
  const allReviews = getReviewsByProductId(product.id);
  const [visibleCount, setVisibleCount] = useState(3);
  const [helpfulIds, setHelpfulIds] = useState<number[]>([]);

  const breakdown = getRatingBreakdown(product.id);
  const visibleReviews = allReviews.slice(0, visibleCount);

  const ratingDist = [
    { label: '5★', percent: 68 },
    { label: '4★', percent: 22 },
    { label: '3★', percent: 7 },
    { label: '2★', percent: 2 },
    { label: '1★', percent: 1 },
  ];

  return (
    <div className="mt-12 border-t border-ink-800 pt-8">
      <h2 className="text-2xl font-serif text-cream-50 mb-6">Customer Reviews</h2>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-ink-900 border border-ink-700/50 rounded-xl p-6 text-center">
          <p className="text-4xl font-serif font-semibold text-cream-50">{product.rating.toFixed(1)}</p>
          <div className="flex justify-center mt-2">
            <Rating rating={product.rating} size="md" />
          </div>
          <p className="text-xs text-neutral-400 mt-2">Based on {product.reviewCount} reviews</p>
        </div>

        <div className="md:col-span-2 bg-ink-900 border border-ink-700/50 rounded-xl p-6">
          <div className="space-y-2">
            {breakdown.map(item => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 w-8">{item.stars}★</span>
                <div className="flex-1 h-2 bg-ink-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-500 w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      {visibleReviews.length === 0 ? (
        <div className="text-center py-12 bg-ink-900 border border-ink-700/50 rounded-xl">
          <p className="text-sm text-neutral-400">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleReviews.map(review => (
            <div key={review.id} className="bg-ink-900 border border-ink-700/50 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 font-medium text-sm">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-cream-100">{review.author}</span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-400">
                          <BadgeCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">{review.date}{review.size && ` · Size: ${review.size}`}</p>
                  </div>
                </div>
                <Rating rating={review.rating} />
              </div>
              <h4 className="text-sm font-medium text-cream-50 mb-1">{review.title}</h4>
              <p className="text-sm text-neutral-300 leading-relaxed">{review.comment}</p>
              <button
                onClick={() =>
                  setHelpfulIds(prev =>
                    prev.includes(review.id) ? prev.filter(id => id !== review.id) : [...prev, review.id],
                  )
                }
                className={`inline-flex items-center gap-1.5 mt-3 text-xs transition-colors ${
                  helpfulIds.includes(review.id)
                    ? 'text-gold-400'
                    : 'text-neutral-500 hover:text-cream-100'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${helpfulIds.includes(review.id) ? 'fill-current' : ''}`} />
                Helpful ({helpfulIds.includes(review.id) ? 1 : 0})
              </button>
            </div>
          ))}

          {visibleCount < allReviews.length && (
            <button
              onClick={() => setVisibleCount(prev => prev + 3)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-ink-800 border border-ink-700 rounded-lg text-sm text-cream-100 hover:border-gold-500/40 transition-colors"
            >
              Load More Reviews
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
