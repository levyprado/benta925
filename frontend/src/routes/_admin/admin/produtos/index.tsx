import ProductsTable from "@/components/admin/products-table";
import { getCategories, getProducts } from "@/lib/queries";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/produtos/")({
  loader: async () => {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    return { products, categories };
  },
  pendingMs: 500,
  pendingComponent: () => (
    <div className="min-h-[calc(100dvh-65px)] grid place-content-center">
      <Loader2Icon className="text-gray-300 size-12 lg:size-14 animate-spin" />
    </div>
  ),
  component: ProductsPage,
});

function ProductsPage() {
  const { products, categories } = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight lg:text-3xl xl:text-4xl">
        Produtos
      </h1>
      <ProductsTable products={products} categories={categories} />
    </div>
  );
}
