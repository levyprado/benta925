import ProductList from "@/components/product-list";
import { getCategories, getProducts } from "@/lib/queries";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";

export const Route = createFileRoute("/_app/")({
  loader: async () => {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    return { products, categories };
  },
  component: Home,
  staleTime: 60_000, // 1 minute
  pendingMs: 1000,
  pendingComponent: () => (
    <div className="min-h-[calc(100dvh-65px)] grid place-content-center">
      <Loader2Icon className="text-gray-300 size-12 lg:size-14 animate-spin" />
    </div>
  ),
});

function Home() {
  const { products, categories } = Route.useLoaderData();

  return (
    <main className="min-h-[calc(100dvh-65px)] bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <ProductList products={products} categories={categories} />
      </div>
    </main>
  );
}
