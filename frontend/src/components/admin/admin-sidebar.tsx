import { mobileMenuItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:flex lg:h-screen lg:flex-col lg:w-64 lg:sticky lg:top-0 lg:rounded-r-xl lg:bg-white lg:border-r lg:border-gray-200">
      <div className="mt-16">
        <nav className="space-y-1 mt-4 px-2">
          {mobileMenuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group flex items-center gap-3 px-3 py-3 font-medium rounded-md text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
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
                    <span className="text-sm font-medium">{item.label}</span>
                  </>
                );
              }}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
