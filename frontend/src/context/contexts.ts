import { Product } from "@/lib/types";
import { createContext } from "react";

// CART
type CartContextType = {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
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
