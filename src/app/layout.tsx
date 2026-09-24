import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/customer/Header';
import { MobileNav } from '@/components/customer/MobileNav';
import { Footer } from '@/components/customer/Footer';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { InstallAppPrompt } from '@/components/ui/InstallAppPrompt';

export const metadata: Metadata = {
  title: {
    template: '%s | ELLEXT Clothing & Jewells',
    default: 'ELLEXT | Haute Jewellery & Couture Clothing | Ellext Group'
  },
  description: 'Explore handcrafted fine jewels, uncut polki sets, pure silk tailoring, and luxury bridal creations by Ellext Clothing & Jewells.',
  applicationName: 'Ellext Clothing & Jewells',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ellext'
  },
  keywords: ['Ellext', 'Haute Jewellery', 'Luxury Fashion', 'Polki Choker', 'Silk Gown', 'Banarasi Saree', 'Indian Couture'],
  openGraph: {
    title: 'ELLEXT Clothing & Jewells',
    description: 'A house of refined tailoring and heirloom fine jewellery under Ellext Group.',
    url: 'https://ellext.com',
    siteName: 'ELLEXT',
    locale: 'en_IN',
    type: 'website'
  }
};

export const viewport: Viewport = {
  themeColor: '#FFF9ED',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

import { AuthProvider } from '@/context/AuthContext';
import { PwaRegister } from '@/components/ui/PwaRegister';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PwaRegister />
        <AuthProvider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>
                <Header />
                <main id="main-content">
                  {children}
                </main>
                <CartDrawer />
                <InstallAppPrompt />
                <MobileNav />
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
