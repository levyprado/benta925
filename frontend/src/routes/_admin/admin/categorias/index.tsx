import CategoriesTable from "@/components/admin/categories-table";
import { getCategoriesWithProductCount } from "@/lib/queries";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/categorias/")({
  loader: getCategoriesWithProductCount,
  pendingMs: 500,
  pendingComponent: () => (
    <div className="min-h-[calc(100dvh-65px)] grid place-content-center">
      <Loader2Icon className="text-gray-300 size-12 lg:size-14 animate-spin" />
    </div>
  ),
  component: CategoriesPage,
});

function CategoriesPage() {
  const categories = Route.useLoaderData();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight lg:text-3xl xl:text-4xl">
        Categorias
      </h1>
      <CategoriesTable categories={categories} />
    </div>
  );
}
