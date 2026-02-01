import React, { useState, useEffect } from 'react';
import { cn } from '@/utils';

interface LiveCounterProps {
  targetValue: number;
  duration?: number; // in milliseconds
  suffix?: string;
  prefix?: string;
  className?: string;
  format?: 'number' | 'currency' | 'compact';
  locale?: string;
}

export const LiveCounter: React.FC<LiveCounterProps> = ({
  targetValue,
  duration = 2000,
  suffix = '',
  prefix = '',
  className,
  format = 'number',
  locale = 'uk-UA',
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = React.useRef<HTMLSpanElement>(null);

  // Intersection Observer to trigger animation only when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Animate counter when visible
  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * targetValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, targetValue, duration]);

  const formatValue = (value: number): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat(locale, { 
          style: 'currency', 
          currency: 'UAH',
          minimumFractionDigits: 0 
        }).format(value);
      case 'compact':
        return new Intl.NumberFormat(locale, { 
          notation: 'compact',
          compactDisplay: 'short' 
        }).format(value);
      default:
        return new Intl.NumberFormat(locale).format(value);
    }
  };

  return (
    <span ref={counterRef} className={cn('tabular-nums', className)}>
      {prefix}{formatValue(count)}{suffix}
    </span>
  );
};

// Статистический блок с живым счётчиком
interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  suffix = '',
  iconColor = 'text-blue-600',
}) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className={cn('text-3xl mb-2', iconColor)}>{icon}</div>
      <div className="text-2xl sm:text-3xl font-bold text-slate-800">
        <LiveCounter targetValue={value} suffix={suffix} />
      </div>
      <div className="text-sm text-slate-500 mt-1 text-center">{label}</div>
    </div>
  );
};
