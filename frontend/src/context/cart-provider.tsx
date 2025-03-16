import { Product } from "@/lib/types";
import { useEffect, useState } from "react";
import { CartContext } from "./contexts";
import { toast } from "sonner";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem("carrinho");
    if (savedCart) {
      return JSON.parse(savedCart);
    } else {
      return [];
    }
  });

  // Update local storage when items changes
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product) => {
    setItems((prevItems) => {
      // Check if product already exist in the cart
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        toast(
          <div className="flex-1 flex items-center font-sans">
            <div className="flex items-center gap-2">
              <XCircleIcon className="size-5" />
              <span className="font-medium text-base">
                Esse produto já está no carrinho
              </span>
            </div>
          </div>
        );
        return prevItems;
      } else {
        toast(
          <div className="flex-1 flex items-center font-sans">
            <div className="w-full space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="size-5" />
                <span className="font-semibold text-lg">
                  Adicionado ao carrinho
                </span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <p className="text-sm text-gray-500 font-medium">
                  {product.nome} foi adicionado ao carrinho.
                </p>
                <Button
                  onClick={() => toast.dismiss()}
                  asChild
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  <Link to={"/carrinho"}>Ver</Link>
                </Button>
              </div>
            </div>
          </div>
        );
        return [...prevItems, product];
      }
    });
  };

  const removeItem = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));

    if (items.length === 0) localStorage.removeItem("carrinho");
  };

  const total = items.reduce((sum, item) => sum + item.preco, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, total }}>
      {children}
    </CartContext.Provider>
  );
}
