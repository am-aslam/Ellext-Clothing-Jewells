import React from 'react';
import Image from 'next/image';

export type LogoVariant = 'header' | 'header-mobile' | 'auth' | 'admin' | 'footer' | 'icon';
export type LogoColorMode = 'dark' | 'light' | 'gold';

interface LogoProps {
  variant?: LogoVariant;
  colorMode?: LogoColorMode;
  className?: string;
  priority?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'header',
  colorMode,
  className = '',
  priority = false
}) => {
  // Default colorMode based on context: dark for light headers, light for dark surfaces
  const resolvedColorMode: LogoColorMode =
    colorMode ||
    (variant === 'footer' || variant === 'admin' || variant === 'auth' ? 'light' : 'dark');

  // Exact aspect ratio of transparent cropped asset (684 x 277 = ~2.47:1)
  const dimensions = {
    header: { width: 110, height: 44 },
    'header-mobile': { width: 88, height: 35 },
    auth: { width: 148, height: 60 },
    admin: { width: 108, height: 44 },
    footer: { width: 138, height: 56 },
    icon: { width: 44, height: 44 }
  }[variant];

  const srcMap: Record<LogoColorMode, string> = {
    dark: '/assets/brand/ellext-logo-dark.png',
    light: '/assets/brand/ellext-logo-light.png',
    gold: '/assets/brand/ellext-logo-gold.png'
  };

  const logoSrc = srcMap[resolvedColorMode];

  return (
    <div
      className={`elx-logo-container elx-logo-${variant} elx-logo-${resolvedColorMode} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <Image
        src={logoSrc}
        alt="ELLEXT Clothing & Jewells"
        width={dimensions.width}
        height={dimensions.height}
        priority={priority || variant === 'header' || variant === 'header-mobile'}
        style={{
          objectFit: 'contain',
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          background: 'transparent'
        }}
      />
    </div>
  );
};
