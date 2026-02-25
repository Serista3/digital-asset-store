import {
  ArrowUpDown,
  LayoutDashboard,
  Library,
  Package,
  TextAlignEnd,
  UsersRound,
} from 'lucide-react';
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

export default async function AdminMenu() {
  const user = await currentUser();
  const { sessionClaims } = await auth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size="icon" aria-label="Admin Menu">
          <TextAlignEnd className="size-4" />
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
                  Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link
                href="/admin/products"
                className="flex gap-1.5 items-center"
              >
                <Package />
                Product
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/admin/product-categories"
                className="flex gap-1.5 items-center"
              >
                <Library />
                Category
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/orders" className="flex gap-1.5 items-center">
                <ArrowUpDown />
                Order
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/users" className="flex gap-1.5 items-center">
                <UsersRound />
                User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Button className="w-full" variant='destructive' asChild>
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
