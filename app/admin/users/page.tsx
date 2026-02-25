import { getUsers } from '@/action/user';

import AlertDestructive from '@/components/admin/AlertDestructive';
import BasicPagination from '@/components/admin/BasicPagination';
import UserSearch from '@/components/admin/user/UserSearch';
import UserTable from '@/components/admin/user/UserTable';
import ExplorerLayout from '@/components/layout/ExplorerLayout';

interface UsersProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function Users({ searchParams }: UsersProps) {
  const { search, page } = await searchParams;
  const users = await getUsers(search, Number(page ?? 1));

  return (
    <ExplorerLayout title="Users">
      <>
        {'data' in users && (
          <div>
            {/* User Search */}
            <div className='flex justify-end mb-6'>
              <UserSearch />
            </div>

            {/* User Table */}
            <UserTable users={users.data} />

            {/* Pagination */}
            <BasicPagination totalPages={users.totalPages} />
          </div>
        )}
        {'cause' in users && <AlertDestructive error={users} />}
      </>
    </ExplorerLayout>
  );
}
