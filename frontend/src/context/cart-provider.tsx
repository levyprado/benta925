import { Product } from "@/lib/types";
import { useEffect, useState } from "react";
import { CartContext } from "./contexts";
import { toast } from "sonner";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { BASE_URL } from "@/lib/constants";

export type CartItem = Product & {
  selectedOptions?: Record<string, string>;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
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

  const removeUnavailableProducts = async () => {
    const productIds = items.map((item) => item.id);

    if (productIds.length === 0) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/products?ids=${productIds.join(",")}`
      );
      if (!response.ok) throw new Error("Erro ao buscar produtos");

      const currentProducts: Product[] = await response.json();

      const availabilityMap = currentProducts.reduce(
        (map, product) => {
          map[product.id] = product.disponivel;
          return map;
        },
        {} as Record<number, boolean>
      );

      const updatedItems = items.filter((item) => {
        const isAvailable = availabilityMap[item.id] !== false;

        if (!isAvailable) {
          toast.info(`${item.nome} foi removido do carrinho pois foi esgotado`);
        }
        return isAvailable;
      });

      if (updatedItems.length !== items.length) {
        setItems(updatedItems);
      }
    } catch (err) {
      console.error(`Erro checando produtos indisponíveis: ${err}`);
    }
  };

  useEffect(() => {
    removeUnavailableProducts();
  }, []);

  const addItem = (
    product: Product,
    selectedOptions?: Record<string, string>
  ) => {
    setItems((prevItems) => {
      // Check if product with same options exists
      const existingItem = prevItems.find((item) => {
        if (item.id !== product.id) return false;
        if (!selectedOptions && !item.selectedOptions) return true;

        // Compare selected options
        return (
          JSON.stringify(item.selectedOptions) ===
          JSON.stringify(selectedOptions)
        );
      });

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
        const newItem: CartItem = {
          ...product,
          selectedOptions,
        };
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
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (
    productId: number,
    selectedOptions?: Record<string, string>
  ) => {
    setItems((prevItems) =>
      prevItems.filter((item) => {
        if (item.id !== productId) return true;

        // If no options were provided for removal or item has no options, remove the item
        if (!selectedOptions && !item.selectedOptions) return false;

        // Keep item if options don't match
        return (
          JSON.stringify(item.selectedOptions) !==
          JSON.stringify(selectedOptions)
        );
      })
    );

    // Check if cart is empty after removal
    if (items.length === 0) localStorage.removeItem("carrinho");
  };

  const total = items.reduce((sum, item) => sum + item.preco, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, total }}>
      {children}
    </CartContext.Provider>
  );
}
