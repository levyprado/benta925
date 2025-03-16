import { Category } from "@/lib/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/constants";

type CategoryFormProps = {
  category?: Category;
};

export default function CategoryForm({ category }: CategoryFormProps) {
  const navigate = useNavigate({
    from: category
      ? "/admin/categorias/$categoriaId"
      : "/admin/categorias/novo",
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {};

    const nome = formData.get("nome") as string;

    if (!nome || nome.length < 3) {
      errors.nome = "Categoria deve ter pelo menos 3 caracteres";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) {
      toast.error("Verifique os campos do formulário");
      return;
    }

    try {
      const categoryData = {
        nome: formData.get("nome") as string,
      };

      // If there is a category PUT, else POST
      let response;
      if (category) {
        response = await fetch(
          `${BASE_URL}/api/categorias/${category.id}/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(categoryData),
          }
        );
      } else {
        response = await fetch(`${BASE_URL}/api/categorias`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(categoryData),
        });
      }

      if (response.ok) {
        toast.success(
          `Categoria ${category ? "atualizada" : "criada"} com sucesso!`
        );
        navigate({ to: "/admin/categorias", replace: true });
      } else {
        throw new Error(
          `Erro ao ${category ? "atualizar" : "criar"} categoria`
        );
      }
    } catch (err) {
      console.error(`Algo deu errado: ${err}`);
      toast.error("Algo deu errado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-[500px]">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome">Nome da categoria</Label>
        <Input
          id="nome"
          type="text"
          name="nome"
          defaultValue={category ? category.nome : ""}
        />
        {validationErrors.nome && (
          <p className="text-red-600 text-xs">{validationErrors.nome}</p>
        )}
      </div>
      <div className="flex justify-end items-center gap-4">
        <Button variant="outline" size="lg" asChild>
          <Link to="/admin/categorias">Cancelar</Link>
        </Button>
        <Button
          disabled={isSubmitting}
          type="submit"
          size="lg"
          className="bg-gray-500 hover:bg-gray-600"
        >
          {isSubmitting ? (
            <>
              <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {category ? "Atualizando..." : "Criando..."}
            </>
          ) : (
            <>{category ? "Atualizar" : "Criar"} categoria</>
          )}
        </Button>
      </div>
    </form>
  );
}
