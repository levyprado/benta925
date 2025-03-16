import { Category, Product } from "@/lib/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { PlusIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Tag, TagInput } from "emblor";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { BASE_URL } from "@/lib/constants";
import { toast } from "sonner";

type ProductOption = {
  id: number;
  nome: string;
  valores: string[];
};

type ProductFormProps = {
  product?: Product;
  categories: Category[];
};

export default function ProductForm({ product, categories }: ProductFormProps) {
  const navigate = useNavigate({
    from: product ? "/admin/produtos/$produtoId" : "/admin/produtos/novo",
  });
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [productOptions, setProductOptions] = useState<ProductOption[]>(() => {
    if (product && product.opcoes) {
      return product.opcoes.map((option) => ({
        id: option.id,
        nome: option.nome,
        valores: option.valores,
      }));
    }
    return [];
  });
  const [activeTagIndices, setActiveTagIndices] = useState<
    Record<string, number | null>
  >({});
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.imagem || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {};

    const nome = formData.get("nome") as string;
    const precoStr = formData.get("preco") as string;
    const categoriaStr = formData.get("categoria") as string;

    if (!nome || nome.length < 3) {
      errors.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    const preco = precoStr ? Number(precoStr) : 0;
    if (isNaN(preco) || preco <= 0) {
      errors.preco = "Preço deve ser maior que zero";
    }

    if (!categoriaStr || categoriaStr === "" || categoriaStr === undefined) {
      errors.categoria = "Selecione uma categoria";
    }

    // Validate options
    if (productOptions.length > 0) {
      productOptions.forEach((option) => {
        if (!option.nome) {
          errors[`option-${option.id}-nome`] = "Nome da opção é obrigatório";
        }

        if (option.valores.length === 0) {
          errors[`option-${option.id}-valores`] =
            "Adicione pelo menos um valor";
        }
      });
    }

    if (!imagePreview && !fileInputRef.current?.files?.[0]) {
      errors.imagem = "Envie uma imagem";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOption = () => {
    const newOption: ProductOption = {
      id: Date.now(),
      nome: "",
      valores: [],
    };
    setProductOptions((prev) => [...prev, newOption]);
  };

  const handleRemoveOption = (optionId: number) => {
    setProductOptions((prev) =>
      prev.filter((option) => option.id !== optionId)
    );
  };

  const handleOptionNameChange = (optionId: number, nome: string) => {
    setProductOptions((prev) =>
      prev.map((option) =>
        option.id === optionId ? { ...option, nome } : option
      )
    );
  };

  const handleOptionValueChange = (optionId: number, tags: Tag[]) => {
    setProductOptions((prev) =>
      prev.map((option) =>
        option.id === optionId
          ? { ...option, valores: tags.map((tag) => tag.text) }
          : option
      )
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

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
      const imageFile = fileInputRef.current?.files?.[0];
      let imageUrl = product?.imagem || null;

      if (imageFile) {
        const cloudinaryData = new FormData();
        cloudinaryData.append("file", imageFile);
        cloudinaryData.append("upload_preset", "benta925");

        // Upload
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/dkbcfzvrs/image/upload`,
          {
            method: "POST",
            body: cloudinaryData,
          }
        );
        const cloudinaryResult = await cloudinaryResponse.json();

        imageUrl = cloudinaryResult.secure_url;
      }

      const productData = {
        nome: formData.get("nome") as string,
        preco: Number(formData.get("preco") as string) * 100,
        categoriaId: parseInt(formData.get("categoria") as string),
        disponivel: formData.get("disponivel") === "on",
        imagem: imageUrl,
        opcoes: productOptions.map((option) => ({
          nome: option.nome,
          valores: option.valores,
        })),
      };

      let response;
      if (product) {
        response = await fetch(
          `${BASE_URL}/api/produtos/${product.id}/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(productData),
          }
        );
      } else {
        response = await fetch(`${BASE_URL}/api/produtos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(productData),
        });
      }

      if (response.ok) {
        router.invalidate();
        toast.success(
          `Produto ${product ? "atualizado" : "criado"} com sucesso!`
        );
        navigate({ to: "/admin/produtos", replace: true });
      } else {
        throw new Error("Erro ao criar produto");
      }
    } catch (error) {
      console.error("Erro ao criar produto", error);
      toast.error("Algo deu errado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-2 xl:gap-12">
        {/* Product information */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              defaultValue={product ? product.nome : ""}
            />
            {validationErrors.nome && (
              <p className="text-red-600 text-xs">{validationErrors.nome}</p>
            )}
          </div>
          <div className="grid gap-6 grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="preco">
                Preço <em className="text-xs text-gray-500">(Ex: 129.99)</em>
              </Label>
              <Input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product ? (product.preco / 100).toFixed(2) : ""}
              />
              {validationErrors.preco && (
                <p className="text-red-600 text-xs">{validationErrors.preco}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                name="categoria"
                defaultValue={
                  product ? product.categoriaId.toString() : undefined
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.categoria && (
                <p className="text-red-600 text-xs">
                  {validationErrors.categoria}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="disponivel"
              name="disponivel"
              defaultChecked={product ? product.disponivel : true}
              className="data-[state=checked]:bg-gray-500 cursor-pointer"
            />
            <Label htmlFor="disponivel">Disponível</Label>
          </div>
          {/* Product options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Opções do Produto</Label>
              <Button type="button" variant="outline" onClick={handleAddOption}>
                <PlusIcon className="" />
                Adicionar opção
              </Button>
            </div>
            {productOptions.length > 0 ? (
              productOptions.map((option) => (
                <div
                  key={option.id}
                  className="bg-white p-4 space-y-4 border border-gray-200 rounded-lg shadow-xs overflow-hidden"
                >
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`option-${option.id}`}>Nome</Label>
                    <div className="flex items-center justify-between">
                      <Input
                        id={`option-${option.id}`}
                        placeholder="Ex: Tamanho"
                        value={option.nome}
                        onChange={(e) =>
                          handleOptionNameChange(option.id, e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(option.id)}
                      >
                        <XIcon />
                      </Button>
                    </div>
                    {validationErrors[`option-${option.id}-nome`] && (
                      <p className="text-red-600 text-xs">
                        {validationErrors[`option-${option.id}-nome`]}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`option-values-${option.id}`}>
                      Valores
                    </Label>
                    <TagInput
                      id={`option-values-${option.id}`}
                      tags={option.valores.map((valor, index) => ({
                        id: `${option.id}-${index}`,
                        text: valor,
                      }))}
                      setTags={(tags) =>
                        handleOptionValueChange(option.id, tags as Tag[])
                      }
                      placeholder="Ex: Azul"
                      styleClasses={{
                        inlineTagsContainer:
                          "h-10 flex flex-wrap border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1",
                        input:
                          "w-full min-w-[80px] shadow-none px-2 h-7 outline-none",
                        tag: {
                          body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                          closeButton:
                            "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                        },
                      }}
                      activeTagIndex={activeTagIndices[option.id] || null}
                      setActiveTagIndex={(index) =>
                        setActiveTagIndices((prev) => ({
                          ...prev,
                          [option.id]: index,
                        }))
                      }
                    />
                    {validationErrors[`option-${option.id}-valores`] && (
                      <p className="text-red-600 text-xs">
                        {validationErrors[`option-${option.id}-valores`]}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Adicione valores como: tamanhos, cores ou outras variações
                      do produto
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm border rounded-md">
                Nenhuma opção adicionada
              </div>
            )}
          </div>
        </div>

        {/* Product image */}
        <div>
          <div className="flex flex-col gap-2">
            <Label>Imagem</Label>
            <label
              htmlFor="imagem"
              className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden"
            >
              <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="size-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500">
                      Carregando imagem...
                    </p>
                  </div>
                ) : imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview da imagem"
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <UploadIcon className="size-12 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">
                      Clique para selecionar uma imagem
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="imagem">Enviar imagem</Label>
                  <Input
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    disabled={isUploading}
                    id="imagem"
                    type="file"
                    name="imagem"
                    accept="image/*"
                    className="h-auto py-2.25"
                  />
                  {validationErrors.imagem && (
                    <p className="text-red-600 text-xs">
                      {validationErrors.imagem}
                    </p>
                  )}
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" size="lg" asChild>
            <Link to="/admin/produtos">Cancelar</Link>
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
                {product ? "Atualizando..." : "Criando..."}
              </>
            ) : (
              <>{product ? "Atualizar" : "Criar"} produto</>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
