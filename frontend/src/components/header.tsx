import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/context/hooks/use-cart";

export default function Header() {
  const { items } = useCart();
  const itemCount = items.length;

  return (
    <header className="sticky top-0 z-10 w-full border-b border-gray-200 bg-white rounded-b-xl shadow-xs">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <img
              src="/logo.png"
              alt="Benta 925"
              className="w-32 sm:w-36 lg:w-40"
            />
          </Link>

          <Button variant="outline" size="icon" asChild className="relative">
            <Link to="/carrinho">
              <ShoppingCartIcon className="size-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-gray-700 text-xs text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
