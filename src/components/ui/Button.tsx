import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseClasses = 'elx-btn';
  const variantClass = `elx-btn-${variant}`;
  const sizeClass = `elx-btn-${size}`;
  const widthClass = fullWidth ? 'elx-btn-full' : '';
  const loadingClass = isLoading ? 'elx-btn-loading' : '';

  return (
    <button
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="elx-btn-spinner" aria-hidden="true" />
      ) : null}
      <span className="elx-btn-text">{children}</span>
    </button>
  );
};
