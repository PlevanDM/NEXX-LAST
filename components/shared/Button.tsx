import React from 'react';
import { colors, transitions, borderRadius, shadows } from '../../lib/design-system';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string; // Font Awesome icon class
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
}) => {
  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  // Variant styles
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-green-500 to-green-600
      text-white
      hover:from-green-600 hover:to-green-700
      focus:ring-green-500
      shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-gradient-to-r from-blue-600 to-blue-700
      text-white
      hover:from-blue-700 hover:to-blue-800
      focus:ring-blue-500
      shadow-lg hover:shadow-xl
    `,
    outline: `
      bg-transparent
      border-2 border-blue-600
      text-blue-600
      hover:bg-blue-50
      focus:ring-blue-500
    `,
    ghost: `
      bg-transparent
      text-slate-700
      hover:bg-slate-100
      focus:ring-slate-400
    `,
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles}
    >
      {icon && iconPosition === 'left' && (
        <i className={`fa ${icon}`} />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <i className={`fa ${icon}`} />
      )}
    </button>
  );
};

export default Button;
