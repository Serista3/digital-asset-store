'use server';

import db from '@/lib/db';
import { calTotalPages, prepareBaseQueryInfo } from '@/lib/utils';
import { ResultItems, SearchParams, User } from '@/types';
import { auth } from '@clerk/nextjs/server';

// Admin role
export const isAdminUser = async function(){
  const { isAuthenticated, sessionClaims } = await auth()
  return isAuthenticated && sessionClaims.metadata.role === 'admin'
}

// Fetch Users
export const getUsers = async function (searchParams: SearchParams): Promise<ResultItems<User>> {
  const { searchTerm, skip, limit } = prepareBaseQueryInfo(searchParams)

  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    const [users, totalUsers] = await db.$transaction([
      db.user.findMany({
        where: {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        take: limit,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      db.user.count({
        where: {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    const totalPages = calTotalPages(totalUsers);

    return {
      data: users,
      totalPages,
    };
  } catch (err) {
    return err as Error;
  }
};

// Fetch Current User
export const getCurrentUser = async function (): Promise<User | Error | null> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('You are not login. Please login before view detail.');

    const user = await db.user.findFirst({
      where: {
        clerkId: userId, 
      },
      include: {
        cart: {
          include: {
            items: true
          }
        }
      }
    });

    return user;
  } catch (err) {
    return err as Error;
  }
};
