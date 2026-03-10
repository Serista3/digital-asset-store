import { getStorefrontCategories } from "@/action/category";
import { getStorefrontProducts } from "@/action/product";
import ExplorerLayout from "@/components/layout/ExplorerLayout";
import FilterControls from "@/components/user/products/FilterControls";

import { ProductSearchParams } from "@/types";

export default async function Products({ searchParams }: { searchParams: Promise<ProductSearchParams> }){
    const categories = await getStorefrontCategories();
    const params = await searchParams
    const products = await getStorefrontProducts({ ...params })
    console.log(products)

    return (
        <ExplorerLayout title="Products">
            <FilterControls categories={categories} />
        </ExplorerLayout>
    )
}