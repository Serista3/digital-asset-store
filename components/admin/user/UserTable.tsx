import { User } from '@prisma/client';

import { UsersRound } from 'lucide-react';
import EmptyStorage from '../EmptyStorage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LIMIT_RESULT } from '@/action/constants';
import { formattedDateToRead } from '@/lib/utils';

export default async function UserTable({ users, page = 1 }: { users: User[], page?: number }) {
  return (
    <>
      {/* User Table */}
      {users.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{(page - 1) * LIMIT_RESULT + index + 1}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{formattedDateToRead(user.createdAt)}</TableCell>
                <TableCell>{formattedDateToRead(user.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {users.length === 0 && (
        <EmptyStorage
          title="User Storage Empty"
          description="No users found."
          iconEl={<UsersRound />}
        />
      )}
    </>
  );
}
