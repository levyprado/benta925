import CategoryForm from "@/components/admin/category-form";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/categorias/novo")({
  component: NewCategoryPage,
});

function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/categorias">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl xl:text-4xl">
          Nova Categoria
        </h1>
      </div>
      <CategoryForm />
    </div>
  );
}
