// src/pages/SigIn.tsx - Página de Login.

import { useActionState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { api } from "../services/api";
import { Input } from "../components/input";
import { Button } from "../components/Button";

// Schema de validação fora do escopo da função
const signInSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().trim().min(1, { message: "Informe a senha" }),
});

export function SigIn() {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Função de login com redirecionamento por role
  async function signIn(_: any, formData: FormData) {
    try {
      const data = signInSchema.parse({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      const response = await api.post("/sessions", data);
      const { token, user } = response.data;

      // ✅ Salva os dados no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", user.name); // ✅ Nome do usuário salvo
      localStorage.setItem("defaultPassword", data.password);

      if (user.role === "admin") {
        localStorage.setItem("isAdmin", "true");
      } else if (user.role === "technical") {
        localStorage.setItem("isTechnical", "true");
      } else {
        localStorage.setItem("isCustomer", "true");
      }

      // Redirecionamento por role
      if (user.role === "admin" || user.role === "technical") {
        navigate("/admin");
      } else {
        navigate("/called");
      }
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        return { message: error.issues[0].message };
      }

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message };
      }

      return { message: "Não foi possível entrar!" };
    }
  }

  const [state, formAction, isLoading] = useActionState(signIn, null);

  // Função para troca de senha
  async function handlePasswordChangeLogin() {
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    try {
      const data = signInSchema.parse({ email, password });

      const response = await api.post("/sessions", data);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", user.name); // ✅ Nome também salvo aqui
      localStorage.setItem("defaultPassword", data.password);

      navigate("/newpass");
    } catch {
      alert("Credenciais inválidas para troca de senha.");
    }
  }

  return (
    <form action={formAction} className="w-full flex flex-col gap-4">
      <Input
        name="email"
        required
        legend="E-mail"
        type="email"
        placeholder="seu@email.com"
        ref={emailRef}
      />

      <Input
        name="password"
        required
        legend="Senha"
        type="password"
        placeholder="123456"
        ref={passwordRef}
      />

      <p className="text-lg text-red-500 text-center my-4 font-bold">
        {state?.message}
      </p>

      <Button type="submit" isLoading={isLoading}>
        Entrar
      </Button>

      <button
        type="button"
        onClick={handlePasswordChangeLogin}
        className="text-sm font-semibold mt-2 text-center uppercase transition ease-linear text-orange-300 hover:text-amber-800"
      >
        Trocar Senha
      </button>

      <a
        href="/signup"
        className="text-sm font-semibold text-orange-300 mb-1 text-center hover:text-amber-800 uppercase transition ease-linear"
      >
        Criar conta
      </a>
    </form>
  );
}



