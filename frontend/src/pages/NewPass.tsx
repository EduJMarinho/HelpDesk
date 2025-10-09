/// NewPass.tsx - Alterar Senha do user

// NewPass.tsx - Alterar Senha do user

import { useState, useEffect } from "react";
import { Input } from "../components/input";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import LogoImg from "../assets/Logo-HelpDesk.png";

export function NewPass() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("authToken");
  const defaultPassword = localStorage.getItem("defaultPassword");

  useEffect(() => {
    if (!token || !defaultPassword) {
      setErrorMessage("Acesso não autorizado. Faça login primeiro.");
      navigate("/");
    }
  }, [token, defaultPassword, navigate]);

  function validateForm() {
    if (!newPassword || !confirmPassword) return "Preencha todos os campos.";
    if (newPassword.length < 6) return "A nova senha deve ter pelo menos 6 caracteres.";
    if (newPassword !== confirmPassword) return "A nova senha e a confirmação não coincidem.";
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
      const response = await fetch("http://localhost:3333/secure-users/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: defaultPassword,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Erro ao atualizar senha.";

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } else {
          const text = await response.text();
          console.warn("Resposta não JSON:", text);
        }

        throw new Error(errorMessage);
      }

      alert("Senha atualizada com sucesso!");
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
            legend="Nova senha"
            placeholder="Nova senha"
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
            Trocar Senha
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


