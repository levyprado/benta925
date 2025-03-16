import SalesTable from "@/components/admin/sales-table";
import { Button } from "@/components/ui/button";
import { getSales } from "@/lib/queries";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2Icon, PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/vendas/")({
  loader: getSales,
  pendingMs: 500,
  pendingComponent: () => (
    <div className="min-h-[calc(100dvh-65px)] grid place-content-center">
      <Loader2Icon className="text-gray-300 size-12 lg:size-14 animate-spin" />
    </div>
  ),
  component: SalesPage,
});

function SalesPage() {
  const sales = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight lg:text-3xl xl:text-4xl">
          Vendas
        </h1>
        <Button size="lg" className="bg-gray-500 hover:bg-gray-600" asChild>
          <Link to="/admin/vendas/nova">
            <PlusIcon />
            Nova venda
          </Link>
        </Button>
      </div>
      <SalesTable sales={sales} />
    </div>
  );
}
