import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { BASE_URL } from "@/lib/constants";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const response = await fetch(`${BASE_URL}/api/auth`, {
      credentials: "include",
    });
    if (response.ok) {
      throw redirect({ to: "/admin" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate({
    from: "/login",
  });

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {};
    const user = formData.get("user") as string;
    const password = formData.get("password") as string;

    if (!user) {
      errors.user = "O campo usuário é obrigatório";
    }
    if (!password) {
      errors.password = "O campo senha é obrigatório";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    if (!validateForm(formData)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const user = formData.get("user") as string;
      const password = formData.get("password") as string;

      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (response.ok) {
        toast.success("Login realizado com sucesso!");
      } else {
        throw new Error("Usuário ou senha inválidos");
      }

      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-dvh grid place-content-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg shadow-xs p-6 space-y-4"
      >
        <div className="flex justify-center">
          <img src="/logo.png" alt="Logo benta" className="w-40" />
        </div>
        <div className="text-center space-y-1">
          <h1 className="font-medium text-lg">Área de administrador</h1>
          <h2 className="text-sm text-balance text-muted-foreground">
            Entre com suas credenciais para acessar a dashboard
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="user">Usuário</Label>
          <Input
            id="user"
            type="text"
            name="user"
            placeholder="Seu nome de usuário"
          />
          {validationErrors.user && (
            <p className="text-red-600 text-sm">{validationErrors.user}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Sua senha"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-red-600 text-sm">{validationErrors.password}</p>
          )}
        </div>

        <Button
          disabled={isSubmitting}
          type="submit"
          size="lg"
          className="mt-2 w-full bg-gray-500 hover:bg-gray-600"
        >
          {isSubmitting ? (
            <>
              <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </main>
  );
}
