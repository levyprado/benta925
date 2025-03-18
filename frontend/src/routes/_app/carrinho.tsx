import { Button } from "@/components/ui/button";
import { useCart } from "@/context/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon, Trash2Icon, ShoppingBagIcon } from "lucide-react";

export const Route = createFileRoute("/_app/carrinho")({
  component: Cart,
});

function Cart() {
  const { items, removeItem, total } = useCart();

  const handleCheckout = () => {
    const phoneNumber = "5565992775467";

    let message = "🩶 *Novo Pedido Benta*\n\n";

    // Adicionar itens do carrinho
    message += "*Itens do Pedido:*\n";
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.nome}* - ${formatPrice(item.preco)}\n`;

      // Adicionar opções selecionadas, se houver
      if (
        item.selectedOptions &&
        Object.entries(item.selectedOptions).length > 0
      ) {
        message += "   *Opções:* ";
        Object.entries(item.selectedOptions).forEach(
          ([option, value], i, arr) => {
            message += `${option}: ${value}${i < arr.length - 1 ? ", " : ""}`;
          }
        );
        message += "\n";
      }
    });

    // Adicionar total
    message += `\n*Total do Pedido:* ${formatPrice(total)}\n\n`;
    message += "Por favor, confirme meu pedido. Obrigado!";

    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message);

    // Criar URL do WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    // Abrir WhatsApp em uma nova janela
    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="bg-gray-50 min-h-[calc(100dvh-65px)]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Carrinho</h1>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeftIcon className="size-5" />
              <span>Voltar para o catálogo</span>
            </Link>
          </Button>
        </div>
        {items.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ul className="border border-gray-200 rounded-lg bg-white">
                {items.map((item) => (
                  <li
                    key={`${item.id}-${JSON.stringify(item.selectedOptions)}`}
                    className="flex items-center gap-4 border-b border-gray-200 p-4 last:border-0"
                  >
                    <div className="size-22 shrink-0 overflow-hidden rounded-md border border-gray-200 sm:size-24">
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-sm leading-tight font-medium text-gray-900 sm:text-base">
                        {item.nome}
                      </h3>
                      {item.selectedOptions &&
                        Object.entries(item.selectedOptions).length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {Object.entries(item.selectedOptions).map(
                              ([option, value]) => (
                                <p
                                  key={option}
                                  className="text-xs text-gray-500"
                                >
                                  <span className="font-medium">{option}:</span>{" "}
                                  {value}
                                </p>
                              )
                            )}
                          </div>
                        )}
                      <p className="mt-1 text-sm font-medium text-gray-500 sm:text-base">
                        {formatPrice(item.preco)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() =>
                          removeItem(item.id, item.selectedOptions)
                        }
                        variant="ghost"
                        size="icon"
                      >
                        <Trash2Icon className="text-gray-500" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 h-fit rounded-lg border border-gray-200 bg-white">
              <h2 className="text-xl font-semibold">Resumo do pedido</h2>
              <ul className="mt-4 space-y-1.5">
                {items.map((item) => (
                  <li
                    key={`summary-${item.id}-${JSON.stringify(item.selectedOptions)}`}
                    className="space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900 line-clamp-1">
                        {item.nome}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatPrice(item.preco)}
                      </span>
                    </div>
                    {item.selectedOptions &&
                      Object.entries(item.selectedOptions).length > 0 && (
                        <div className="flex flex-wrap gap-x-2">
                          {Object.entries(item.selectedOptions).map(
                            ([option, value]) => (
                              <p key={option} className="text-xs text-gray-500">
                                {value}
                              </p>
                            )
                          )}
                        </div>
                      )}
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-semibold">
                    {formatPrice(total)}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full bg-gray-500 hover:bg-gray-600"
                >
                  <ShoppingBagIcon />
                  <span>Finalizar pedido via WhatsApp</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Empty cart message
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingBagIcon className="size-16 text-gray-300" />
            <h2 className="mt-4 text-lg text-center font-medium">
              Seu carrinho está vazio
            </h2>
            <p className="mt-1 text-sm text-gray-500 text-center text-balance">
              Parece que você ainda não adicionou nenhum produto no carrinho.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 text-base bg-gray-500 hover:bg-gray-600"
            >
              <Link to="/">Ver produtos</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
