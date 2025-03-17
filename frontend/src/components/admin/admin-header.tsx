import { ExternalLinkIcon, LogOutIcon, MenuIcon, XIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { Dialog } from "@base-ui-components/react/dialog";
import { BASE_URL, mobileMenuItems } from "@/lib/constants";
import { apiRequest, cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import { useUser } from "@/context/user-context";

export default function AdminHeader() {
  const { user } = useUser();

  const handleLogOut = async () => {
    const response = await apiRequest(`${BASE_URL}/api/logout`, {
      method: "POST",
    });
    if (response.ok) {
      toast.success("Saiu com sucesso");
      window.location.href = "/login";
    } else {
      toast.error("Ocorreu um erro ao sair");
    }
  };

  return (
    <Dialog.Root>
      <header className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 shadow-xs rounded-b-xl">
        <div className="flex items-center justify-between px-4 h-16 lg:px-6 xl:px-8 2xl:px-10">
          <div className="lg:hidden">
            <Dialog.Trigger
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <MenuIcon className="size-5" />
            </Dialog.Trigger>
          </div>
          <Link to="/admin">
            <img src="/logo.png" alt="Benta 925" className="w-32 sm:w-36" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 -mr-2">
                <div className="size-9 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {"L"}
                  </span>
                </div>
                <span className="hidden md:inline">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="capitalize">
                {user?.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-between" asChild>
                <Link to="/">
                  Ir para o catálogo
                  <ExternalLinkIcon className="size-4 opacity-60" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogOut}
                className="justify-between"
              >
                Sair
                <LogOutIcon className="size-4 opacity-60" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu */}
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black opacity-70 transition-all ease-out duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <Dialog.Popup className="fixed top-0 left-0 h-full bg-white w-10/12 max-w-[300px] rounded-r-lg overflow-hidden transition-all ease-out duration-300 data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full">
            <div className="h-16 flex items-center px-4">
              <Dialog.Close
                className={buttonVariants({ variant: "outline", size: "icon" })}
              >
                <XIcon className="size-5" />
              </Dialog.Close>
            </div>
            <nav className="space-y-1 mt-4 px-2">
              {mobileMenuItems.map((item) => (
                <Dialog.Close
                  key={item.href}
                  render={
                    <Link
                      to={item.href}
                      className="group w-full flex items-center gap-3 px-3 py-3 font-medium rounded-md text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 "
                      activeOptions={{ exact: item.href === "/admin" }}
                      activeProps={{
                        className: `bg-gray-100 text-gray-900 hover:bg-gray-100`,
                      }}
                    >
                      {({ isActive }: { isActive: boolean }) => {
                        return (
                          <>
                            <item.icon
                              className={cn(
                                "size-5 shrink-0 transition-colors",
                                isActive
                                  ? "text-gray-500"
                                  : "text-gray-400 group-hover:text-gray-500"
                              )}
                            />
                            <span className="text-base font-medium">
                              {item.label}
                            </span>
                          </>
                        );
                      }}
                    </Link>
                  }
                ></Dialog.Close>
              ))}
            </nav>
          </Dialog.Popup>
        </Dialog.Portal>
      </header>
    </Dialog.Root>
  );
}
