import React from 'react';
import { cn } from '@/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  padding = 'md',
  variant = 'default',
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-xl overflow-hidden';
  
  const variants = {
    default: 'shadow-sm border border-slate-200',
    elevated: 'shadow-lg border border-slate-100',
    outlined: 'border-2 border-slate-200',
  };
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };
  
  const hoverStyles = hover 
    ? 'cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1' 
    : '';

  return (
    <div
      className={cn(baseStyles, variants[variant], paddings[padding], hoverStyles, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Card sub-components for better composition
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('border-b border-slate-100 pb-4 mb-4', className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <h3 className={cn('text-xl font-bold text-slate-800', className)}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <p className={cn('text-slate-600 text-sm mt-1', className)}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('', className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('border-t border-slate-100 pt-4 mt-4', className)}>
    {children}
  </div>
);
