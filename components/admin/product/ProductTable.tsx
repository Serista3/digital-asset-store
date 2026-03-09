import Image from "next/image";
import EmptyStorage from "../EmptyStorage";
import { Product } from "@/types";
import { MoreHorizontalIcon, Package } from "lucide-react";
import { LIMIT_RESULT } from "@/action/constants";
import { formattedDateToRead, formattedPrice } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ProductDelete from "./ProductDelete";
import Link from "next/link";

interface ProductTableProps {
  products: Product[];
  page?: number;
}

export default function ProductTable({ products, page = 1 }: ProductTableProps) {
  return (
    <>
      {/* User Table */}
      {products.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead colSpan={2}>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{(page - 1) * LIMIT_RESULT + index + 1}</TableCell>
                <TableCell className="overflow-hidden w-15 h-15">
                  <Image 
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.category?.title || 'No category'}</TableCell>
                <TableCell>{formattedPrice(product.priceInCents)}</TableCell>
                <TableCell>{formattedDateToRead(product.createdAt)}</TableCell>
                <TableCell>{formattedDateToRead(product.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" asChild>
                          <ProductDelete product={product} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {products.length === 0 && (
        <EmptyStorage
          title="Product Storage Empty"
          description="Create your product here."
          content="Create Product"
          linkAction="/admin/products/new"
          iconEl={<Package />}
        />
      )}
    </>
  );
}
