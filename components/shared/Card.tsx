import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
}) => {
  const baseStyles = 'rounded-xl transition-all duration-200';

  const variantStyles = {
    default: 'bg-white',
    outlined: 'bg-white border-2 border-slate-200',
    elevated: 'bg-white shadow-lg',
  };

  const hoverStyles = hover
    ? 'hover:shadow-xl hover:scale-105 cursor-pointer'
    : '';

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const styles = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${paddingStyles[padding]} ${className}`;

  return <div className={styles}>{children}</div>;
};

export default Card;
