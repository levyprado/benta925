import { Product, Sale } from "@/lib/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import SearchInput from "./search-input";
import { useState } from "react";
import { apiRequest, formatPrice } from "@/lib/utils";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/constants";

type SaleFormProps = {
  products: Product[];
  sale?: Sale;
};

export default function SaleForm({ products, sale }: SaleFormProps) {
  const navigate = useNavigate({
    from: sale ? "/admin/vendas/$vendaId" : "/admin/vendas/nova",
  });
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [saleProducts, setSaleProducts] = useState(() => {
    if (sale && sale.itensVenda) {
      return sale.itensVenda.map((item) => item.produto);
    } else {
      return [];
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {};

    const nome = formData.get("nome");
    const data = formData.get("data");
    const status = formData.get("status");
    const metodoPagamento = formData.get("metodoPagamento");

    if (!nome) errors.nome = "O nome é obrigatório";
    if (!data) errors.data = "A data é obrigatória";
    if (!status) errors.status = "O status é obrigatório";
    if (saleProducts.length === 0) errors.produtos = "Adicione um produto";
    if (!metodoPagamento)
      errors.metodoPagamento = "O método de pagamento é obrigatório";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const filteredProducts = products.filter((product) => {
    const searchTerms = searchValue
      .toLocaleLowerCase()
      .split(" ")
      .filter((term) => term.trim() !== "");
    const matchesSearch =
      searchTerms.length === 0 ||
      searchTerms.every((term) => product.nome.toLowerCase().includes(term));
    return matchesSearch;
  });

  const handleAddProduct = (product: Product) => {
    if (saleProducts.find((p) => p.id === product.id)) return;
    setSaleProducts((prev) => [...prev, product]);
    setSearchValue("");
    setShowProductSearch(false);
  };

  const handleRemoveProduct = (product: Product) => {
    setSaleProducts((prev) => prev.filter((p) => p.id !== product.id));
    setShowProductSearch(false);
  };

  const saleProductsTotal = saleProducts.reduce((total, product) => {
    return total + product.preco;
  }, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) {
      setIsSubmitting(false);
      toast.error("Verifique os campos do formulário");
      return;
    }

    try {
      const saleData = {
        nome: formData.get("nome") as string,
        telefone: formData.get("telefone") as string,
        data: new Date(formData.get("data") as string),
        status: formData.get("status") as string,
        produtos: saleProducts,
        observacoes: formData.get("observacoes") as string,
        metodoPagamento: formData.get("metodoPagamento") as string,
        parcelas: parseInt(formData.get("parcelas") as string),
      };

      let response;
      if (sale) {
        response = await apiRequest(`${BASE_URL}/api/vendas/${sale.id}`, {
          method: "PUT",
          body: JSON.stringify(saleData),
        });
      } else {
        response = await apiRequest(`${BASE_URL}/api/vendas`, {
          method: "POST",
          body: JSON.stringify(saleData),
        });
      }

      if (response.ok) {
        router.invalidate();
        toast.success(`Venda ${sale ? "atualizada" : "criada"} com sucesso!`);
        navigate({ to: "/admin/vendas", replace: true });
      } else {
        throw new Error("Erro ao criar venda");
      }
    } catch (err) {
      console.error("Erro ao criar venda", err);
      toast.error("Algo deu errado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome">Nome Comprador(a)</Label>
        <Input
          id="nome"
          type="text"
          name="nome"
          defaultValue={sale ? sale.nome : ""}
        />
        {validationErrors.nome && (
          <p className="text-red-600 text-xs">{validationErrors.nome}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="telefone">
          Telefone <span className="text-xs text-gray-500">(Opcional)</span>
        </Label>
        <Input
          id="telefone"
          type="text"
          name="telefone"
          defaultValue={sale ? sale.telefone : ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            type="date"
            name="data"
            defaultValue={
              sale ? new Date(sale.data).toISOString().split("T")[0] : ""
            }
          />
          {validationErrors.data && (
            <p className="text-red-600 text-xs">{validationErrors.data}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={sale ? sale.status : undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDENTE">Pendente</SelectItem>
              <SelectItem value="PAGO">Pago</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.status && (
            <p className="text-red-600 text-xs">{validationErrors.status}</p>
          )}
        </div>
      </div>
      <div className="bg-white border border-input rounded-lg shadow-xs p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-medium">Produtos</p>
          <Button
            type="button"
            onClick={() => setShowProductSearch(true)}
            variant="outline"
          >
            <PlusIcon />
            Adicionar Produto
          </Button>
        </div>

        {/* Product Search */}
        {showProductSearch && (
          <div className="space-y-2">
            <SearchInput
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Procurar produtos..."
              autoFocus
            />

            {/* Product list */}

            {searchValue && (
              <div className="border rounded-md max-h-60 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  <div className="divide-y">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleAddProduct(product)}
                        className="p-2.5 hover:bg-gray-50 cursor-pointer flex justify-between items-center gap-4"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-tight">
                            {product.nome}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(product.preco)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-9"
                        >
                          <PlusIcon />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2.5 text-sm text-center text-gray-500">
                    Nenhum produto encontrado
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {validationErrors.produtos && (
          <p className="text-red-600 text-xs">{validationErrors.produtos}</p>
        )}

        {/* Products Table */}
        {saleProducts.length > 0 ? (
          <div className="bg-background overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-32 sm:w-auto lg:px-6 xl:px-10">
                    Nome
                  </TableHead>
                  <TableHead className="text-center">Preço</TableHead>
                  <TableHead className="text-right lg:px-6 xl:px-10">
                    Remover
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="min-w-32 sm:w-auto font-medium text-xs sm:text-sm lg:px-6 xl:px-10">
                      {product.nome}
                    </TableCell>
                    <TableCell className="text-center font-medium text-xs sm:text-sm">
                      {(product.preco / 100)
                        .toFixed(2)
                        .toString()
                        .replace(".", ",")}
                    </TableCell>
                    <TableCell className="text-right lg:px-6 xl:px-10">
                      <Button
                        onClick={() => handleRemoveProduct(product)}
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-9"
                      >
                        <MinusIcon size={16} aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          // Empty state
          <div className="rounded-md border border-input grid place-items-center p-8">
            <ShoppingCartIcon className="size-8 text-gray-400" />
            <p className="text-gray-500">Nenhum produto</p>
            <p className="text-sm text-gray-400">
              Clique em "Adicionar Produto"
            </p>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between font-medium text-lg pt-2">
          <span>Total</span>
          <span>{formatPrice(saleProductsTotal)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          name="observacoes"
          defaultValue={sale ? sale.observacoes : ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
          <Select
            name="metodoPagamento"
            defaultValue={sale ? sale.metodoPagamento : undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
              <SelectItem value="PIX">Pix</SelectItem>
              <SelectItem value="CARTAO">Cartão</SelectItem>
              <SelectItem value="CREDIARIO">Crediário</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.metodoPagamento && (
            <p className="text-red-600 text-xs">
              {validationErrors.metodoPagamento}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="parcelas">Parcelas</Label>
          <Select
            name="parcelas"
            defaultValue={sale ? sale.parcelas.toString() : "1"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="3">3x</SelectItem>
              <SelectItem value="4">4x</SelectItem>
              <SelectItem value="5">5x</SelectItem>
              <SelectItem value="6">6x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" size="lg" asChild>
          <Link to="/admin/vendas">Cancelar</Link>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="bg-gray-500 hover:bg-gray-600"
        >
          {isSubmitting ? (
            <>
              <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {sale ? "Atualizando..." : "Criando..."}
            </>
          ) : (
            <>{sale ? "Atualizar" : "Criar"} venda</>
          )}
        </Button>
      </div>
    </form>
  );
}
