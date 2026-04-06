import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import AdminNavigation from '@/components/layout/navigation/AdminNavigation';
import { Toaster } from '@/components/ui/sonner';
import { inter } from '../fonts';
import Providers from '../providers';
import '../globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Admin Dashboard', 
    default: 'Admin Dashboard | My Store', 
  },
  description: 'Management system for products, categories, orders, and users.',
  openGraph: {
    title: 'Admin Dashboard | My Store',
    description: 'Management system for products, categories, orders, and users.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} antialiased`}>
          <Providers>
            <AdminNavigation />
            <main className="min-h-screen max-w-275 mx-auto px-4 pt-10 pb-15">
              {children}
            </main>
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
