import { Category } from "@/lib/types";
import SearchInput from "./search-input";
import { useState } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  EditIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDeleteDialog } from "@/context/hooks/use-delete-dialog";
import { BASE_URL } from "@/lib/constants";
import { toast } from "sonner";
import { apiRequest } from "@/lib/utils";

type CategoryWithProductCount = Category & {
  produtosCount: number;
};

type CategoriesTableProps = {
  categories: CategoryWithProductCount[];
};

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const { showDeleteDialog } = useDeleteDialog();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate({ from: "/admin/categorias" });

  const filteredCategories = categories.filter((category) =>
    category.nome.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleDeleteClick = (category: Category) => {
    showDeleteDialog({
      description: (
        <>
          Você tem certeza que deseja excluir a categoria{" "}
          <strong>{category.nome}</strong>? Esta ação não pode ser desfeita.
        </>
      ),
      onConfirm: async () => {
        const res = await apiRequest(
          `${BASE_URL}/api/categorias/${category.id}/delete`,
          {
            method: "DELETE",
          }
        );
        if (res.ok) {
          toast.success("Produto excluído com sucesso!");
          navigate({ to: "/admin/categorias", replace: true });
        } else {
          toast.error("Ocorreu um erro ao excluir o produto");
        }
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          placeholder="Pesquisar categorias..."
        />
        <Button className="bg-gray-500 hover:bg-gray-600" size="lg" asChild>
          <Link to="/admin/categorias/novo">
            <PlusIcon />
            Nova categoria
          </Link>
        </Button>
      </div>

      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="lg:px-6 xl:px-10">Nome</TableHead>
              <TableHead className="text-center">Produtos</TableHead>
              <TableHead className="text-right lg:px-6 xl:px-10">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="lg:px-6 xl:px-10">
                    <div className="flex items-center gap-2">
                      <TagIcon className="size-4 text-gray-500" />
                      {category.nome}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{category.produtosCount}</Badge>
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
                            to="/admin/categorias/$categoriaId"
                            params={{
                              categoriaId: category.id.toString(),
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(category)}
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
