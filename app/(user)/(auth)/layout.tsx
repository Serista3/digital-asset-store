import type { Metadata } from 'next';
import '@/app/globals.css';

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

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex justify-center mt-10">{children}</div>;
}
