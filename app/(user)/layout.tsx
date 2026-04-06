import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/store/CartContext';
import { ibmPlexSansThai } from '../fonts';
import { getCurrentUser } from '@/action/user';

import MainNavigation from '@/components/layout/navigation/MainNavigation';
import Footer from '@/components/layout/footer/Footer';
import Providers from '../providers';
import { Toaster } from 'sonner';
import '../globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | DigiDrop', 
    default: 'DigiDrop | Your Digital Marketplace',
  },
  description: 'Discover and download high-quality digital products, UI kits, templates, and more at DigiDrop.',
  openGraph: {
    title: 'DigiDrop | Your Digital Marketplace',
    description: 'Discover and download high-quality digital products, UI kits, templates, and more at DigiDrop.',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // User Cart Items
  const user = await getCurrentUser();
  const isUserValid = user && !(user instanceof Error)

  const initialCartItems = (isUserValid && user.cart) ? user.cart.items : [];

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${ibmPlexSansThai.className} antialiased`}>
          <Providers color='#000'>
            <CartProvider initialItems={initialCartItems}>
              <MainNavigation />
              <TooltipProvider>
                <main className='min-h-screen max-w-275 mx-auto px-4 pt-10 pb-15'>
                  {children}
                </main>
              </TooltipProvider>
              <Footer />
              <Toaster />
            </CartProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
