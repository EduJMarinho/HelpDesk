// Página de Login.

import { useState } from "react";
import { Input } from "../components/input";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

export function SigIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (email === "admin@deskhelp.com" && password === "helpdesk") {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else if (email === "technical@deskhelp.com" && password === "123456") {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", "technical");
      localStorage.setItem("isTechnical", "true");
      navigate("/admin");
    } else if (email === "customer@deskhelp.com" && password === "123123") {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", "customer");
      localStorage.setItem("isCustomer", "true");
      navigate("/called");
    } else {
      setErrorMessage("O email ou a senha não confere!");
    }

    setIsLoading(false);
  }

 function handlePasswordChange() {
  setErrorMessage("");

  const credentials = {
    email,
    password,
  };

  if (
    (email === "admin@deskhelp.com" && password === "helpdesk") ||
    (email === "technical@deskhelp.com" && password === "123456") ||
    (email === "customer@deskhelp.com" && password === "123123")
  ) {
    navigate("/newpass", { state: credentials });
  } else {
    setErrorMessage("O email ou a senha não confere!");
  }
}

  const isFormFilled = email.trim() !== "" && password.trim() !== "";

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
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
        legend="Senha"
        type="password"
        placeholder="123456"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {errorMessage && (
        <div className="text-red-500 text-sm text-center">{errorMessage}</div>
      )}

      <Button type="submit" isLoading={isLoading}>
        Entrar
      </Button>

      <button
        type="button"
        onClick={handlePasswordChange}
        disabled={!isFormFilled}
        className={`text-sm font-semibold mt-2 text-center uppercase transition ease-linear ${
          isFormFilled
            ? "text-orange-300 hover:text-amber-800"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        Trocar a Senha
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