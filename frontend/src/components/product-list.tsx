import { useState } from "react";
import ProductDialog from "./product-dialog";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function ProductList({ products }: { products: Product[] }) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const sortedProducts = products.sort((a, b) => {
    if (a.disponivel && !b.disponivel) return -1;
    if (!a.disponivel && b.disponivel) return 1;
    return a.nome.localeCompare(b.nome);
  });

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6 lg:gap-x-4 lg:gap-y-8">
        {sortedProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => setActiveProduct(product)}
            disabled={!product.disponivel}
            className="group text-start grid grid-rows-subgrid row-span-3 group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md cursor-pointer gap-2 pb-2 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/70 focus-visible:ring-offset-2 "
          >
            <div className="aspect-square overflow-hidden relative">
              <img
                src={product.imagem}
                alt={product.nome}
                className="size-full object-cover transition-transform group-hover:scale-105 group-disabled:opacity-70"
              />
              {!product.disponivel && (
                <div className="absolute inset-0 flex items-end justify-center">
                  <span className="mb-4 bg-white/80 px-4 py-1.5 rounded-full text-sm font-medium text-gray-600 shadow-sm -rotate-12 transform">
                    Esgotado
                  </span>
                </div>
              )}
            </div>
            <h3 className="px-4 text-sm text-gray-600 lg:text-base font-medium line-clamp-2 leading-tight group-disabled:text-gray-400">
              {product.nome}
            </h3>
            {product.disponivel ? (
              <p className="px-4 text-lg text-gray-800 font-semibold">
                {formatPrice(product.preco)}
              </p>
            ) : (
              <p className="px-4 text-sm italic text-gray-400">Indisponível</p>
            )}
          </button>
        ))}
      </div>

      <ProductDialog
        open={!!activeProduct}
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
      />
    </>
  );
}
