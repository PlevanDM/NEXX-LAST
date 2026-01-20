import React from 'react';
import { cn } from '@/utils';

interface TrustpilotWidgetProps {
  rating: number; // 1-5
  reviewCount: number;
  className?: string;
  variant?: 'compact' | 'default' | 'detailed';
  theme?: 'light' | 'dark';
}

export const TrustpilotWidget: React.FC<TrustpilotWidgetProps> = ({
  rating = 4.8,
  reviewCount = 1250,
  className,
  variant = 'default',
  theme = 'light',
}) => {
  // Render stars based on rating
  const renderStars = (size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.floor(rating);
          const isPartial = star === Math.ceil(rating) && rating % 1 !== 0;
          const partialPercent = isPartial ? (rating % 1) * 100 : 0;

          return (
            <div key={star} className={cn('relative', sizes[size])}>
              {/* Background star */}
              <svg
                className={cn(sizes[size], 'text-slate-200')}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {/* Filled star */}
              {(isFilled || isPartial) && (
                <svg
                  className={cn(sizes[size], 'text-green-500 absolute inset-0')}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={isPartial ? { clipPath: `inset(0 ${100 - partialPercent}% 0 0)` } : undefined}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-800';
  const mutedColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {renderStars('sm')}
        <span className={cn('text-sm font-medium', textColor)}>{rating.toFixed(1)}</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn('p-4 bg-white rounded-xl border border-slate-200 shadow-sm', className)}>
        <div className="flex items-center gap-3 mb-2">
          {/* Trustpilot Logo */}
          <div className="flex items-center gap-1.5">
            <span className="text-xl">⭐</span>
            <span className={cn('font-bold text-lg', textColor)}>Trustpilot</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          {renderStars('lg')}
          <span className={cn('text-2xl font-bold', textColor)}>{rating.toFixed(1)}</span>
        </div>
        <p className={cn('text-sm', mutedColor)}>
          На основі <span className="font-medium">{reviewCount.toLocaleString()}</span> відгуків
        </p>
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="text-xs text-green-600 font-medium">✓ Перевірені відгуки</span>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center gap-1.5">
        <span className="text-lg">⭐</span>
        <span className={cn('font-semibold', textColor)}>Trustpilot</span>
      </div>
      <div className="flex items-center gap-2">
        {renderStars('md')}
        <span className={cn('font-bold', textColor)}>{rating.toFixed(1)}</span>
        <span className={cn('text-sm', mutedColor)}>
          ({reviewCount.toLocaleString()} відгуків)
        </span>
      </div>
    </div>
  );
};
