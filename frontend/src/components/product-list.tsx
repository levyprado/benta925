import { useEffect, useState } from "react";
import ProductDialog from "./product-dialog";
import { Category, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import SearchInput from "./admin/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function ProductList({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (product) => product.categoriaId.toString() === selectedCategory
      );
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((product) =>
        product.nome.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.preco - b.preco);
        break;
      case "price-desc":
        result.sort((a, b) => b.preco - a.preco);
        break;
      case "name-asc":
        result.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case "name-desc":
        result.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      default:
        // Default sorting (no change)
        break;
    }

    result.sort((a, b) => {
      if (a.disponivel && !b.disponivel) return -1;
      if (!a.disponivel && b.disponivel) return 1;
      return 0;
    });

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, sortOption]);

  return (
    <>
      {/* Search and filter section */}
      <div className="mb-6 flex flex-col gap-2">
        <SearchInput
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
          placeholder="Buscar produtos..."
        />

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* <FilterIcon className="size-4" /> */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="category" className="w-36">
                <SelectValue placeholder="Categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {/* <ArrowUpDown className="size-5" /> */}
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger id="sort" className="w-36">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Padrão</SelectItem>
                <SelectItem value="price-asc">Menor preço</SelectItem>
                <SelectItem value="price-desc">Maior preço</SelectItem>
                <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-500">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1
            ? "produto encontrado"
            : "produtos encontrados"}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6 lg:gap-x-4 lg:gap-y-8">
        {filteredProducts.map((product) => (
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
