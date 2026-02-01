import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/utils';
import { Button } from './ui/Button';

interface CarouselSlide {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  bgColor?: string;
}

interface MobileHeroCarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
  className?: string;
  onSlideChange?: (index: number) => void;
}

export const MobileHeroCarousel: React.FC<MobileHeroCarouselProps> = ({
  slides,
  autoPlayInterval = 5000,
  className,
  onSlideChange,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback((index: number) => {
    const newIndex = Math.max(0, Math.min(slides.length - 1, index));
    setCurrentSlide(newIndex);
    onSlideChange?.(newIndex);
  }, [slides.length, onSlideChange]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (autoPlayInterval <= 0) return;
    
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval, nextSlide]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swipe left - next slide
        goToSlide(currentSlide + 1);
      } else {
        // Swipe right - previous slide
        goToSlide(currentSlide - 1);
      }
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  if (slides.length === 0) return null;

  const slide = slides[currentSlide];

  return (
    <div className={cn('md:hidden', className)}>
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background */}
        <div
          className={cn(
            'absolute inset-0',
            slide.bgColor || 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
          )}
        />

        {/* Content */}
        <div className="relative z-10 px-4 py-8 min-h-[500px] flex flex-col justify-center">
          {/* Image */}
          <div className="flex justify-center mb-6">
            <img
              src={slide.image}
              alt={slide.title}
              className="max-h-[200px] object-contain drop-shadow-xl"
            />
          </div>

          {/* Text Content */}
          <div className="text-center space-y-4">
            {slide.subtitle && (
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                {slide.subtitle}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {slide.title}
            </h2>
            {slide.description && (
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                {slide.description}
              </p>
            )}
            {slide.ctaText && (
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => slide.ctaLink && (window.location.href = slide.ctaLink)}
                  fullWidth
                >
                  {slide.ctaText}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === currentSlide
                  ? 'bg-white w-6'
                  : 'bg-white/30'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
