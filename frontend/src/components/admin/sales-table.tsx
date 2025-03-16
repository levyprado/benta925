import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  CircleCheckIcon,
  CreditCardIcon,
  DollarSignIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Link, useNavigate } from "@tanstack/react-router";
import SearchInput from "./search-input";
import { useMemo, useState } from "react";
import { Sale } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useDeleteDialog } from "@/context/hooks/use-delete-dialog";
import { BASE_URL } from "@/lib/constants";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

type SalesTableProps = {
  sales: Sale[];
};

export default function SalesTable({ sales }: SalesTableProps) {
  const { showDeleteDialog } = useDeleteDialog();
  const navigate = useNavigate({ from: "/admin/vendas" });
  const [searchValue, setSearchValue] = useState("");

  // Filtering and sorting states
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string | null>(
    null
  );
  const [priceSort, setPriceSort] = useState<string | null>(null);
  const [dateSort, setDateSort] = useState<string | null>(null);

  const handleDeleteClick = (sale: Sale) => {
    showDeleteDialog({
      description: (
        <>
          Você tem certeza que deseja excluir a venda de{" "}
          <strong>{sale.nome}</strong>? Esta ação não pode ser desfeita.
        </>
      ),
      onConfirm: async () => {
        const res = await fetch(`${BASE_URL}/api/vendas/${sale.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          toast.success("Venda excluída com sucesso!");
          navigate({ to: "/admin/vendas", replace: true });
        } else {
          toast.error("Ocorreu um erro ao excluir a venda");
        }
      },
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "DINHEIRO":
        return "Dinheiro";
      case "PIX":
        return "PIX";
      case "CARTAO":
        return "Cartão";
      case "CREDIARIO":
        return "Crediário";
      default:
        return method;
    }
  };

  const filteredSales = useMemo(() => {
    let result = [...sales];

    if (searchValue) {
      result = result.filter((sale) =>
        sale.nome.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((sale) => sale.status === statusFilter);
    }

    // Apply payment method filter
    if (paymentMethodFilter) {
      result = result.filter(
        (sale) => sale.metodoPagamento === paymentMethodFilter
      );
    }

    // Apply date sorting
    if (dateSort) {
      result.sort((a, b) => {
        const dateA = new Date(a.data).getTime();
        const dateB = new Date(b.data).getTime();
        return dateSort === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    // Apply price sorting (only if date sorting is not applied)
    if (priceSort && !dateSort) {
      result.sort((a, b) => {
        return priceSort === "asc"
          ? a.valorTotal - b.valorTotal
          : b.valorTotal - a.valorTotal;
      });
    }

    return result;
  }, [
    sales,
    searchValue,
    statusFilter,
    paymentMethodFilter,
    dateSort,
    priceSort,
  ]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          placeholder="Procurar nomes..."
        />
        <div className="flex flex-wrap gap-2">
          {/* Status filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <CircleCheckIcon />
                Status
                {statusFilter && (
                  <Badge variant="secondary">
                    {statusFilter === "PAGO" ? "Pago" : "Pendente"}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={statusFilter || ""}
                onValueChange={(value) => setStatusFilter(value || null)}
              >
                <DropdownMenuRadioItem value="">Todos</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="PENDENTE">
                  Pendente
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="PAGO">Pago</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Payment Method Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <CreditCardIcon />
                Pagamento
                {paymentMethodFilter && (
                  <Badge variant="secondary">
                    {getPaymentMethodLabel(paymentMethodFilter)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={paymentMethodFilter || ""}
                onValueChange={(value) => setPaymentMethodFilter(value || null)}
              >
                <DropdownMenuRadioItem value="">Todos</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="DINHEIRO">
                  Dinheiro
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="PIX">PIX</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="CARTAO">
                  Cartão
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="CREDIARIO">
                  Crediário
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Price Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <DollarSignIcon />
                Preço
                {priceSort && (
                  <Badge variant="secondary">
                    {priceSort === "asc" ? "Menor primeiro" : "Maior primeiro"}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={priceSort || ""}
                onValueChange={(value: string) => setPriceSort(value || null)}
              >
                <DropdownMenuRadioItem value="">Padrão</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="asc">
                  Menor primeiro
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">
                  Maior primeiro
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <CalendarIcon />
                Data Venda
                {dateSort && (
                  <Badge variant="secondary">
                    {dateSort === "asc" ? (
                      <ArrowUpIcon className="size-3" />
                    ) : (
                      <ArrowDownIcon className="size-3" />
                    )}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={dateSort || ""}
                onValueChange={(value: string) => {
                  setDateSort(value || null);
                  if (value) setPriceSort(null);
                }}
              >
                <DropdownMenuRadioItem value="">Padrão</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="asc">
                  Mais antiga primeiro
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">
                  Mais recente primeiro
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="bg-background border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="lg:px-6 xl:px-10">Nome</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right lg:px-6 xl:px-10">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-semibold text-xs sm:text-sm lg:px-6 xl:px-10">
                    {sale.nome}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {formatDate(new Date(sale.data))}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {(sale.valorTotal / 100)
                      .toFixed(2)
                      .toString()
                      .replace(".", ",")}
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
                            to="/admin/vendas/$vendaId"
                            params={{
                              vendaId: sale.id.toString(),
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
                          onClick={() => handleDeleteClick(sale)}
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
                  Nenhuma venda encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
