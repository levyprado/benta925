import {
  CheckIcon,
  CircleCheckIcon,
  CircleXIcon,
  EditIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import SearchInput from "./search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Category, Product } from "@/lib/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDeleteDialog } from "@/context/hooks/use-delete-dialog";
import { BASE_URL } from "@/lib/constants";
import { toast } from "sonner";

type ProductsTableProps = {
  products: Product[];
  categories: Category[];
};

export default function ProductsTable({
  products,
  categories,
}: ProductsTableProps) {
  const { showDeleteDialog } = useDeleteDialog();
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate({ from: "/admin/produtos" });

  const handleDeleteClick = (product: Product) => {
    showDeleteDialog({
      description: (
        <>
          Você tem certeza que deseja excluir o produto{" "}
          <strong>{product.nome}</strong>? Esta ação não pode ser desfeita.
        </>
      ),
      onConfirm: async () => {
        const res = await fetch(
          `${BASE_URL}/api/produtos/${product.id}/delete`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (res.ok) {
          toast.success("Produto excluído com sucesso!");
          navigate({ to: "/admin/produtos", replace: true });
        } else {
          toast.error("Ocorreu um erro ao excluir o produto");
        }
      },
    });
  };

  const filteredProducts = products.filter((product) => {
    const searchTerms = searchValue
      .toLocaleLowerCase()
      .split(" ")
      .filter((term) => term.trim() !== "");
    const matchesSearch =
      searchTerms.length === 0 ||
      searchTerms.every((term) => product.nome.toLowerCase().includes(term));

    const matchesCategory =
      categoryFilter === "" ||
      categoryFilter === "todas" ||
      product.categoriaId.toString() === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt);
    const dateB = new Date(b.updatedAt || b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  const handleToggleStatus = async (product: Product) => {
    const newStatus = !product.disponivel;

    const res = await fetch(
      `${BASE_URL}/api/produtos/${product.id}/disponivel`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          disponivel: newStatus,
        }),
      }
    );

    if (res.ok) {
      toast.success(
        `Status atualizado para ${newStatus ? "Disponível" : "Esgotado"} com sucesso!`
      );
      navigate({ to: "/admin/produtos", replace: true });
    } else {
      toast.error("Ocorreu um erro ao atualizar o status");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="grid grid-cols-[1.5fr_1fr] gap-2 w-full sm:grid-cols-[1fr_9rem] lg:gap-4">
          <SearchInput
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            placeholder="Procurar produtos..."
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-gray-500 hover:bg-gray-600" size="lg" asChild>
          <Link to="/admin/produtos/novo">
            <PlusIcon />
            Novo produto
          </Link>
        </Button>
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 lg:w-32 lg:px-6 xl:px-10">
                Imagem
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right lg:px-6 xl:px-10">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="lg:px-6 xl:px-10">
                    <div className="size-14 rounded-md overflow-hidden lg:size-24">
                      <img
                        src={product.imagem}
                        alt={product.nome}
                        width={56}
                        height={56}
                        className="size-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-xs sm:text-sm">
                    {product.nome}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      {product.disponivel ? (
                        <CircleCheckIcon className="size-5 text-green-700 bg-green-100 lg:size-6 rounded-full" />
                      ) : (
                        <CircleXIcon className="size-5 text-red-700 bg-red-100 lg:size-6 rounded-full" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right lg:px-6 xl:px-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-9"
                        >
                          <MoreHorizontalIcon
                            className="opacity-60"
                            size={16}
                            aria-hidden="true"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            to="/admin/produtos/$produtoId"
                            params={{
                              produtoId: product.id.toString(),
                            }}
                          >
                            <EditIcon
                              size={16}
                              className="opacity-60"
                              aria-hidden="true"
                            />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(product)}
                        >
                          {product.disponivel ? (
                            <>
                              <XIcon
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                              />
                              Marcar esgotado
                            </>
                          ) : (
                            <>
                              <CheckIcon
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                              />
                              Marcar disponível
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600"
                        >
                          <TrashIcon
                            size={16}
                            className="opacity-60"
                            aria-hidden="true"
                          />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
