import { ProductCategory } from '@/types';
import { Library, MoreHorizontalIcon } from 'lucide-react';
import EmptyStorage from '../EmptyStorage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CategoryDelete from './CategoryDelete';

interface CategoryTableProps {
  productCategories: ProductCategory[];
}

export default function CategoryTable({
  productCategories,
}: CategoryTableProps) {
  return (
    <>
      {/* Category Table */}
      {productCategories.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productCategories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{category.title}</TableCell>
                <TableCell>
                  {category.createdAt.toLocaleString('en-En')}
                </TableCell>
                <TableCell>
                  {category.updatedAt.toLocaleString('en-En')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/product-categories/${category.id}`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" asChild>
                        <CategoryDelete category={category} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {productCategories.length === 0 && (
        <EmptyStorage
          title="Product Category Storage Empty"
          description="Create your product category here."
          content="Create Product Category"
          linkAction="/admin/product-categories/new"
          iconEl={<Library />}
        />
      )}
    </>
  );
}
