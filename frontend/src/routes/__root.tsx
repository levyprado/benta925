import { Button } from "@/components/ui/button";
import { UserProvider } from "@/context/user-context";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div className="bg-gray-50 min-h-screen grid place-content-center">
        <div className="flex flex-col items-center gap-6">
          <img src="/logo.png" alt="Logo benta" className="w-40" />
          <h1 className="text-2xl font-bold">Página não encontrada</h1>
          <Button size="lg" className="bg-gray-500 hover:bg-gray-600" asChild>
            <Link to="/">Voltar para página inicial</Link>
          </Button>
        </div>
      </div>
    );
  },
});

function RootComponent() {
  return (
    <UserProvider>
      <Outlet />
      <Toaster
        mobileOffset={{ top: "64px" }}
        offset={{ top: "64px" }}
        position="top-center"
        toastOptions={{ className: "font-sans" }}
      />
    </UserProvider>
  );
}
