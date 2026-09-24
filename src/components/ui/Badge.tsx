import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'sale' | 'gold' | 'success' | 'warning' | 'danger' | 'outline' | 'neutral';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  size = 'md'
}) => {
  return (
    <span className={`elx-badge elx-badge-${variant} elx-badge-${size} ${className}`}>
      {children}
    </span>
  );
};
