import { ArrowUpDown, LayoutDashboard, ShoppingCart, TextAlignEnd } from 'lucide-react';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from '@clerk/nextjs';
import { currentUser, auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';

export default async function UserMenu() {
  const user = await currentUser();
  const { sessionClaims } = await auth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label='User Menu'
          className="rounded-full border-gray-300"
        >
          <TextAlignEnd className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <SignedIn>
            <DropdownMenuLabel className="flex gap-1.5 items-center">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-300">
                <Image
                  className="object-cover w-full h-full"
                  src={user?.imageUrl || '/user-empty.png'}
                  width={20}
                  height={20}
                  alt={user?.firstName || 'user image'}
                />
              </div>
              {user?.firstName || 'User'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sessionClaims?.metadata.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex gap-1.5 items-center">
                  <LayoutDashboard />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/cart" className="flex gap-1.5 items-center">
                <ShoppingCart />
                Cart
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders" className="flex gap-1.5 items-center">
                <ArrowUpDown />
                Order
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Button className="w-full" asChild variant="default">
              <SignOutButton>Logout</SignOutButton>
            </Button>
          </SignedIn>
          <SignedOut>
            <Button className="w-full" asChild>
              <SignInButton>Login</SignInButton>
            </Button>
            <DropdownMenuSeparator />
            <Button className="w-full" asChild variant="outline">
              <SignUpButton>Register</SignUpButton>
            </Button>
          </SignedOut>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
