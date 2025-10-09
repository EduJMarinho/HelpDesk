// NewPass.tsx - Alterar Senha do user

import { useState, useEffect } from "react";
import { Input } from "../components/input";
import { Button } from "../components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import LogoImg from "../assets/Logo-HelpDesk.png";

export function NewPassRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const role = localStorage.getItem("userRole");

  useEffect(() => {
    const credentials = location.state;
    if (credentials?.email && credentials?.password) {
      setEmail(credentials.email);
      setCurrentPassword(credentials.password);
    } else {
      const storedEmail = localStorage.getItem("userEmail") || "";
      setEmail(storedEmail);
    }
  }, [location.state]);

  function validateForm() {
    if (!email) return "Usuário não autenticado.";
    if (!currentPassword) return "Informe a senha atual.";
    if (newPassword.length < 6) return "A nova senha deve ter pelo menos 6 caracteres.";
    if (newPassword !== confirmPassword) return "A nova senha e a confirmação não coincidem.";

    // Verifica se a senha atual é a padrão do role
    if (role === "admin" && currentPassword !== "helpdesk") {
      return "Senha atual inválida para administrador.";
    }
    if (role === "technical" && currentPassword !== "123456") {
      return "Senha atual inválida para técnico.";
    }

    return "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3333/users/${email}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar senha.");
      }

      alert("Senha atualizada com sucesso!");

      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", role || "customer");

      if (role === "admin") {
        localStorage.setItem("isAdmin", "true");
      } else if (role === "technical") {
        localStorage.setItem("isTechnical", "true");
      } else {
        localStorage.setItem("isCustomer", "true");
      }

      navigate("/");
    } catch (error: any) {
      setErrorMessage(error.message || "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-orange-100">
      <div className="mb-4">
        <img src={LogoImg} alt="DeskHelp" className="h-18 mx-auto" />
      </div>

      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            required
            legend="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            required
            legend="Senha atual"
            placeholder="Senha antiga"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Input
            required
            legend="Nova senha"
            placeholder="Senha substituta"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Input
            required
            legend="Confirmar nova senha"
            placeholder="Confirme a nova senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          {errorMessage && (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          )}

          <Button type="submit" isLoading={isLoading}>
            Cadastrar
          </Button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="cursor-pointer text-sm font-semibold text-orange-300 mt-0 mb-2 text-center hover:text-orange-700 uppercase transition ease-linear"
          >
            Voltar
          </button>
        </form>
      </div>
    </div>
  );
}

