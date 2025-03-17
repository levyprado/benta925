import { Product } from "@/lib/types";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button } from "./ui/button";
import { ShoppingCartIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/hooks/use-cart";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type ProductDialogProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

export default function ProductDialog({
  product,
  open,
  onClose,
}: ProductDialogProps) {
  const { addItem } = useCart();
  const [localProduct, setLocalProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (open && product) {
      setLocalProduct(product);
      setSelectedOptions({});
      setValidationErrors({});
    }
  }, [open, product]);

  const handleAddToCart = () => {
    if (!localProduct) return;

    if (localProduct.opcoes && localProduct.opcoes.length > 0) {
      const newValidationErrors: Record<string, boolean> = {};
      let hasErrors = false;

      localProduct.opcoes.forEach((option) => {
        if (!selectedOptions[option.nome]) {
          newValidationErrors[option.nome] = true;
          hasErrors = true;
        }
      });

      if (hasErrors) {
        setValidationErrors(newValidationErrors);
        return;
      }
    }

    addItem(
      localProduct,
      Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined
    );
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setLocalProduct(null);
    }, 250);
  };

  return (
    <>
      <Dialog.Root
        open={open}
        onOpenChange={(isOpen) => !isOpen && handleClose()}
      >
        <Dialog.Portal>
          <Dialog.Backdrop
            className="fixed inset-0 bg-black opacity-70 transition-all ease-out duration-250 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
            style={{ zIndex: 49 }}
          />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 w-11/12 max-w-[500px] rounded-lg overflow-hidden transition-all ease-out duration-250 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0"
            style={{ zIndex: 50 }}
          >
            {/* Product Image */}
            <div className="aspect-square relative">
              <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="absolute top-2.5 right-2.5 bg-white/50 hover:bg-white/60 text-gray-700 backdrop-blur-xs shadow-sm rounded-full"
              >
                <XIcon className="size-5" />
              </Button>
              <img
                src={localProduct?.imagem}
                alt={localProduct?.nome}
                className="size-full object-cover"
              />
            </div>
            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <Dialog.Title className="text-lg text-gray-600 leading-tight font-medium">
                  {localProduct?.nome}
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-xl text-gray-800 font-semibold">
                  {formatPrice(localProduct?.preco || 0)}
                </Dialog.Description>
              </div>

              {localProduct?.opcoes && localProduct.opcoes.length > 0 && (
                <div className="space-y-4 mb-6">
                  {localProduct.opcoes.map((option) => (
                    <div key={option.nome} className="flex flex-col gap-2">
                      <Label htmlFor={option.nome}>{option.nome}</Label>
                      <Select
                        value={selectedOptions[option.nome] || ""}
                        onValueChange={(value) => {
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [option.nome]: value,
                          }));
                          setValidationErrors((prev) => ({
                            ...prev,
                            [option.nome]: false,
                          }));
                        }}
                      >
                        <SelectTrigger id={option.nome}>
                          <SelectValue
                            placeholder={`Selecione ${option.nome.toLowerCase()}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {option.valores.map((valor) => (
                            <SelectItem key={valor} value={valor}>
                              {valor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {validationErrors[option.nome] && (
                        <p className="text-red-600 text-xs">
                          Por favor, selecione {option.nome.toLowerCase()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full text-base bg-gray-500 hover:bg-gray-600"
                >
                  <ShoppingCartIcon className="size-5" />
                  <span>Adicionar ao carrinho</span>
                </Button>
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
