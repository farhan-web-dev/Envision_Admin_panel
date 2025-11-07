import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/apis/product";
import { fetchCategories } from "@/lib/apis/categories";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  const [page, setPage] = useState(1);

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products", page],
    queryFn: fetchProducts,
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // console.log("categores", categories?.data?.categories);

  // Map category ID to name
  const getCategoryName = (category: any) => {
    const categoryId = typeof category === "object" ? category._id : category; // handle both cases
    const found = categories?.data?.categories?.find(
      (cat: any) => cat._id === categoryId
    );
    return found ? found.name : "Unknown";
  };

  const columns = [
    { header: "Product Name", accessor: "title" as const },
    {
      header: "Category",
      accessor: (product: any) => getCategoryName(product.categoryId),
    },
    {
      header: "Price",
      accessor: (product: any) => `$${product.price.toFixed(2)}`,
    },
    { header: "Stock", accessor: "stock" as const },
    {
      header: "Type",
      accessor: (product: any) => (
        <Badge variant={product.type === "physical" ? "default" : "secondary"}>
          {product.type}
        </Badge>
      ),
    },
  ];

  if (productsLoading || categoriesLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-64 rounded bg-slate-200"></div>
          <div className="h-96 rounded-lg bg-slate-200"></div>
        </div>
      </AdminLayout>
    );
  }

  const productList = products?.data?.products || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-slate-600">Manage your product inventory</p>
          </div>
        </div>

        <DataTable data={productList} columns={columns} />

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {productList.length} of {productList.length} products
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
