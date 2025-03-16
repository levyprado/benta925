import { useContext } from "react";
import { DeleteDialogContext } from "../contexts";

export function useDeleteDialog() {
  const context = useContext(DeleteDialogContext);
  if (context === undefined) {
    throw new Error(
      "useDeleteDialog deve ser usado dentro de um DeleteDialogContext"
    );
  }
  return context;
}
