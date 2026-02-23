import { PackageSearch } from 'lucide-react';
import { Button } from '../../ui/button';
import Link from 'next/link';
import UserMenu from './UserMenu';
import WebLogo from './WebLogo';

export default async function MainNavigation() {
  return (
    <nav className="w-full py-6 border border-gray-300">
      <div className="max-w-275 mx-auto px-4 flex items-center gap-3 justify-between">
        {/* Logo */}
        <WebLogo />

        {/* Nav Menu */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-lg"
            className="rounded-full border-gray-300"
            aria-label='All Product'
            asChild
          >
            <Link href="products">
              <PackageSearch className="size-5.5" />
            </Link>
          </Button>

          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
