'use server';

import db from '@/lib/db';
import { ResultItems, User } from '@/types';

// Fetch Users
export const getUsers = async function (
  search?: string,
  currentPage: number = 1,
): Promise<ResultItems<User>> {
  const searchTerm = search?.trim().toLocaleLowerCase() || '';
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  try {
    const [users, totalUsers] = await db.$transaction([
      db.user.findMany({
        where: {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        take: limit,
        skip: skip,
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

    const totalPages = Math.ceil(totalUsers / limit);

    return {
      data: users,
      totalPages,
    };
  } catch (err) {
    return err as Error;
  }
};
