import { useState } from "react";
import { DeleteDialogContext } from "./contexts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteDialogOptions = {
  description: React.ReactNode;
  onConfirm: () => void;
};

export function DeleteDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DeleteDialogOptions>({
    description: "",
    onConfirm: () => {},
  });

  const showDeleteDialog = (newOptions: DeleteDialogOptions) => {
    setOptions(newOptions);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    options.onConfirm();
    setIsOpen(false);
  };

  return (
    <DeleteDialogContext.Provider value={{ showDeleteDialog }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              {options.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DeleteDialogContext.Provider>
  );
}
