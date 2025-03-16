import SaleForm from "@/components/admin/sale-form";
import { Button } from "@/components/ui/button";
import { getProducts, getSale } from "@/lib/queries";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/vendas/$vendaId")({
  loader: async ({ params: { vendaId } }) => {
    const [sale, products] = await Promise.all([
      getSale(vendaId),
      getProducts(),
    ]);
    return { sale, products };
  },
  pendingMs: 500,
  pendingComponent: () => (
    <div className="min-h-[calc(100dvh-65px)] grid place-content-center">
      <Loader2Icon className="text-gray-300 size-12 lg:size-14 animate-spin" />
    </div>
  ),
  component: RouteComponent,
});

function RouteComponent() {
  const { sale, products } = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/vendas">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl xl:text-4xl">
          Editar Venda
        </h1>
      </div>
      <SaleForm sale={sale} products={products} />
    </div>
  );
}
