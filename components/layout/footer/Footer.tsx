import Paragraph from '@/components/typography/Paragraph';
import WebLogo from '../navigation/WebLogo';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ibmPlexSansThai } from '@/app/fonts';

export default function Footer() {
  return (
    <footer className="border-t border-gray-300">
      <div className="max-w-275 mx-auto px-4 py-8 flex flex-col gap-4">
        <WebLogo />
        <Paragraph className={`text-gray-500 ${ibmPlexSansThai.className}`}>
          แหล่งรวม Digital Assets คุณภาพสูง สำหรับนักพัฒนาและ นักออกแบบ
        </Paragraph>
        <nav className="flex items-center gap-6">
          <Link href="/">Home</Link>
          <Link href="/products">All Product</Link>
        </nav>
        <Separator />
        <Paragraph className='text-gray-500'>© 2026 DigiDrop. All rights reserved.</Paragraph>
      </div>
    </footer>
  );
}
