import ProductForm from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/queries";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/produtos/novo")({
  loader: getCategories,
  pendingMs: 500,
  pendingComponent: () => (
    <div className="min-h-[calc(100dvh-65px)] grid place-content-center">
      <Loader2Icon className="text-gray-300 size-12 lg:size-14 animate-spin" />
    </div>
  ),
  component: NewProductPage,
});

function NewProductPage() {
  const categories = Route.useLoaderData();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/produtos">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl xl:text-4xl">
          Novo Produto
        </h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
