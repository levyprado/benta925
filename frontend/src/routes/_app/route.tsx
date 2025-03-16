import Header from "@/components/header";
import { CartProvider } from "@/context/cart-provider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <CartProvider>
      <Header />
      <Outlet />
    </CartProvider>
  );
}
