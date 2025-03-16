import AdminHeader from "@/components/admin/admin-header";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { DeleteDialogProvider } from "@/context/delete-dialog-provider";
import { useUser } from "@/context/user-context";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="size-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
        <span className="ml-3">Verificando autenticação...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DeleteDialogProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-full">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 px-4 py-6 lg:px-12 lg:py-8 xl:px-16 xl:py-10">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </DeleteDialogProvider>
  );
}
