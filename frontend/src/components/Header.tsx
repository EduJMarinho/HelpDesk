// src/components/Header.tsx

import logoImg from "../assets/Logo-HelpDesk-sm.png";
import logoutImg from "../assets/sair.png";

export function Header() {
  const userName = localStorage.getItem("userName") ?? "Usuário";

  return (
    <header className="w-full flex justify-between">
      <img src={logoImg} alt="Logo" className="my-8" />
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-amber-800">
          Olá, {userName}
        </span>
        <a href="/">
          <img
            src={logoutImg}
            alt="Ícone de sair"
             title=" Voltar ao login "
            className="w-5 h-5 my-8 cursor-pointer hover:opacity-75 transition ease-linear "
          />
        </a>
      </div>
    </header>
  );
}