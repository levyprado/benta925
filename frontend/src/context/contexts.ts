import { Product } from "@/lib/types";
import { createContext } from "react";
import { CartItem } from "./cart-provider";

// CART
type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, selectedOptions?: Record<string, string>) => void;
  removeItem: (
    productId: number,
    selectedOptions?: Record<string, string>
  ) => void;
  total: number;
};
export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

type DeleteDialogContextType = {
  showDeleteDialog: (options: {
    description: React.ReactNode;
    onConfirm: () => void;
  }) => void;
};

export const DeleteDialogContext = createContext<
  DeleteDialogContextType | undefined
>(undefined);
