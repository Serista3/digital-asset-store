import { User } from '@/types';

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

export default async function UserTable({ users }: { users: User[] }) {
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
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.createdAt.toLocaleString('en-En')}</TableCell>
                <TableCell>{user.updatedAt.toLocaleString('en-En')}</TableCell>
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
