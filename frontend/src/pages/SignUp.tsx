//SignUp - Cadastro de nova conta .

import { api } from "../services/api";
import { useState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { Input } from "../components/input";
import { Button } from "../components/Button";
import type React from "react";

const signUpSchema = z.object({
  name: z.string().trim().min(1, { message: "Informe o nome" }),
  email: z.email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 dígitos" }),
});

export function SigUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password !== passwordConfirm) {
        alert("As senhas não coincidem");
        return;
      }

      const data = signUpSchema.parse({
        name,
        email,
        password,       
      });

      await api.post("/users", data)

      if(confirm("Cadastrado com sucesso. Ir para a tela de entrar?")){
        navigate("/")
      }

      console.log("Dados validados:", data);
    } catch (error) {
      if (error instanceof ZodError) {
        alert(error.issues[0].message);
        return;
      }
      if (error instanceof AxiosError){
        return alert.apply(error.response?.data.message)
      }

      alert("Não foi possível cadastrar");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
      <Input
        required
        legend="Nome"
        placeholder="Seu nome"
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        required
        legend="E-mail"
        type="email"
        placeholder="seu@email.com"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        required
        legend="Senha"
        type="password"
        placeholder="123456"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        required
        legend="Confirmação da Senha"
        type="password"
        placeholder="123456"
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />

      <Button type="submit" isLoading={isLoading}>
        Cadastrar
      </Button>

      <a
        href="/"
        className="text-sm font-semibold text-orange-300 mt-6 mb-4 text-center hover:text-amber-800 uppercase transition ease-linear"
      >
        Já tenho uma conta
      </a>
    </form>
  );
}

