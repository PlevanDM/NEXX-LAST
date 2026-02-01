import React, { useState, useEffect, useCallback } from 'react';
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

interface DesktopHeroCarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
  className?: string;
  onSlideChange?: (index: number) => void;
}

export const DesktopHeroCarousel: React.FC<DesktopHeroCarouselProps> = ({
  slides,
  autoPlayInterval = 5000,
  className,
  onSlideChange,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    onSlideChange?.(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, onSlideChange]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (autoPlayInterval <= 0) return;
    
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (slides.length === 0) return null;

  const slide = slides[currentSlide];

  return (
    <div className={cn('hidden md:block relative overflow-hidden', className)}>
      {/* Main Carousel */}
      <div className="relative h-[500px] lg:h-[600px] xl:h-[700px]">
        {/* Background */}
        <div
          className={cn(
            'absolute inset-0 transition-all duration-700',
            slide.bgColor || 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'
          )}
        />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
          <div className="grid grid-cols-2 gap-8 h-full items-center">
            {/* Text Content */}
            <div className={cn(
              'space-y-6 transform transition-all duration-500',
              isAnimating ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'
            )}>
              {slide.subtitle && (
                <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                  {slide.subtitle}
                </span>
              )}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                {slide.title}
              </h1>
              {slide.description && (
                <p className="text-lg text-slate-300 max-w-xl">
                  {slide.description}
                </p>
              )}
              {slide.ctaText && (
                <div className="flex gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => slide.ctaLink && (window.location.href = slide.ctaLink)}
                  >
                    {slide.ctaText}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Дізнатися більше
                  </Button>
                </div>
              )}
            </div>

            {/* Image */}
            <div className={cn(
              'flex justify-center items-center transform transition-all duration-500',
              isAnimating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
            )}>
              <img
                src={slide.image}
                alt={slide.title}
                className="max-h-[400px] lg:max-h-[500px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-300',
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/30 hover:bg-white/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
