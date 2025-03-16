import { Button } from "@/components/ui/button";
import {
  getCategoryCount,
  getFaturamento,
  getProductCount,
  getRecentProducts,
  getRecentSales,
  getSaleCount,
} from "@/lib/queries";
import { Product, Sale } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  DollarSignIcon,
  Loader2Icon,
  PackageIcon,
  ShoppingCartIcon,
} from "lucide-react";

export const Route = createFileRoute("/_admin/admin/")({
  loader: async () => {
    const [
      productCount,
      categoryCount,
      saleCount,
      faturamento,
      recentProducts,
      recentSales,
    ] = await Promise.all([
      getProductCount(),
      getCategoryCount(),
      getSaleCount(),
      getFaturamento(),
      getRecentProducts(),
      getRecentSales(),
    ]);
    return {
      productCount,
      categoryCount,
      saleCount,
      faturamento,
      recentProducts,
      recentSales,
    };
  },
  pendingMs: 500,
  pendingComponent: () => (
    <div className="min-h-[calc(100dvh-65px)] grid place-content-center">
      <Loader2Icon className="text-gray-300 size-12 lg:size-14 animate-spin" />
    </div>
  ),
  component: AdminHome,
});

function AdminHome() {
  const {
    productCount,
    categoryCount,
    saleCount,
    faturamento,
    recentProducts,
    recentSales,
  } = Route.useLoaderData();

  const dashboardCards = [
    {
      title: "Produtos",
      value: productCount.count,
      description: "Total de produtos disponíveis",
      icon: PackageIcon,
      trend: "up",
      trendValue: 12,
      href: "/admin/produtos",
    },
    {
      title: "Categorias",
      value: categoryCount.count,
      description: "Total de categorias ativas",
      icon: PackageIcon,
      trend: "up",
      trendValue: 12,
      href: "/admin/categorias",
    },
    {
      title: "Vendas",
      value: saleCount,
      description: "Total de vendas",
      icon: ShoppingCartIcon,
      trend: "up",
      trendValue: 12,
      href: "/admin/vendas",
    },
    {
      title: "Faturamento",
      value: formatPrice(faturamento),
      description: "Total de faturamento",
      icon: DollarSignIcon,
      trend: "up",
      trendValue: 12,
      href: "/admin/vendas",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight lg:text-3xl xl:text-4xl">
        Dashboard
      </h1>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card) => (
          <article
            key={card.description}
            className="grid grid-rows-subgrid row-span-3 gap-0 space-y-2 bg-white border border-gray-200 rounded-lg shadow-xs"
          >
            <div className="flex items-center justify-between pt-6 px-6">
              <h2 className="text-sm font-medium">{card.title}</h2>
              <card.icon className="size-4 text-gray-500" />
            </div>
            <div className="px-6">
              <span className="text-2xl font-bold">{card.value}</span>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
            <div className="px-2 py-2">
              <Button
                variant="ghost"
                size="lg"
                className="w-full justify-between"
                asChild
              >
                <Link to={card.href}>
                  Ver detalhes
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="grid grid-rows-subgrid row-span-3 gap-0 space-y-2 bg-white border border-gray-200 rounded-lg shadow-xs">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-xl font-semibold leading-none tracking-tight">
              Produtos Recentes
            </h2>
            <p className="text-sm text-muted-foreground">
              Produtos recentemente adicionados ou atualizados
            </p>
          </div>
          <div className="p-6 pt-0 space-y-4">
            {recentProducts.map((produto: Product) => (
              <div key={produto.id} className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <PackageIcon className="size-5 text-gray-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {produto.nome}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(produto.preco)}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(
                    produto.updatedAt > produto.createdAt
                      ? produto.updatedAt
                      : produto.createdAt
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center p-6 pt-0">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/produtos" className="w-full">
                Ver todos produtos
              </Link>
            </Button>
          </div>
        </article>
        <article className="grid grid-rows-subgrid row-span-3 gap-0 space-y-2 bg-white border border-gray-200 rounded-lg shadow-xs">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-xl font-semibold leading-none tracking-tight">
              Vendas Recentes
            </h2>
            <p className="text-sm text-muted-foreground">
              Últimas vendas adicionadas
            </p>
          </div>
          <div className="p-6 pt-0 space-y-4">
            {recentSales.map((sale: Sale) => (
              <div key={sale.id} className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <ShoppingCartIcon className="size-5 text-gray-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {sale.nome}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(sale.valorTotal)}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(sale.data)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center p-6 pt-0">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/vendas" className="w-full">
                Ver todas vendas
              </Link>
            </Button>
          </div>
        </article>
      </section>
    </div>
  );
}
