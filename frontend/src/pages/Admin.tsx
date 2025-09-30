//Apresenta a lista dos chamados e suas características.

import { useEffect, useState } from "react";

import searchSvg from "../assets/search.svg";
import { SERVICES } from "../utils/services";

import { Input } from "../components/input";
import { Button } from "../components/Button";
import { Pagination } from "../components/Pagination";
import { CalledItem } from "../components/CalledItem";
import type { CalledItemProps } from "../components/CalledItem";


const CALLED_EXAMPLE = {
  categoryImg: SERVICES["printer"].icon,
  id: "123",
  customer: "Ana Clara Ferreira",
  technical: "Eduardo José Marinho",
  called: "Suporte a Impressoras e periféricos",
  amount: "R$85,00",
  status: "em atendimento",
};

export function Admin() {
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [totalOfPage, setTotalOfPage] = useState(10);
  const [called, setCalled] = useState<CalledItemProps[]>([]);

  useEffect(() => {
    console.log("Componente Admin carregado");

    // 🔄 FUTURA INTEGRAÇÃO COM API:
    // Aqui será feita a chamada para a API que retorna os chamados
    // Exemplo: fetch('/api/chamados').then(res => res.json()).then(setCalled)

    const stored = localStorage.getItem("calledList");
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log("Chamados carregados do localStorage:", parsed);
      setCalled(parsed);
    } else {
      const mockCalledList: CalledItemProps[] = [
        CALLED_EXAMPLE,
        {
          categoryImg: SERVICES["internet"].icon,
          id: "124",
          customer: "Bruno Silva",
          technical: "Mariana Costa",
          called: "Manutenção de computadores",
          amount: "R$120,00",
          status: "pendente",
        },
        {
          categoryImg: SERVICES["peripherals"].icon,
          id: "125",
          customer: "Carlos Mendes",
          technical: "Eduardo José Marinho",
          called: "Configuração de rede corporativa",
          amount: "R$250,00",
          status: "finalizado",
        },
        {
          categoryImg: SERVICES["software"].icon,
          id: "126",
          customer: "Fernanda Lima",
          technical: "João Pedro",
          called: "Instalação de software ERP",
          amount: "R$300,00",
          status: "em atendimento",
        },
        {
          categoryImg: SERVICES["printer"].icon,
          id: "127",
          customer: "Juliana Rocha",
          technical: "Eduardo José Marinho",
          called: "Troca de cartucho e limpeza",
          amount: "R$60,00",
          status: "pendente",
        },
        {
          categoryImg: SERVICES["internet"].icon,
          id: "124",
          customer: "Bruno Silva",
          technical: "Mariana Costa",
          called: "Manutenção de computadores",
          amount: "R$120,00",
          status: "pendente",
        },
        {
          categoryImg: SERVICES["peripherals"].icon,
          id: "125",
          customer: "Carlos Mendes",
          technical: "Eduardo José Marinho",
          called: "Configuração de rede corporativa",
          amount: "R$250,00",
          status: "finalizado",
        },
        {
          categoryImg: SERVICES["software"].icon,
          id: "126",
          customer: "Fernanda Lima",
          technical: "João Pedro",
          called: "Instalação de software ERP",
          amount: "R$300,00",
          status: "em atendimento",
        },
        {
          categoryImg: SERVICES["printer"].icon,
          id: "127",
          customer: "Juliana Rocha",
          technical: "Eduardo José Marinho",
          called: "Troca de cartucho e limpeza",
          amount: "R$60,00",
          status: "pendente",
        },
        {
          categoryImg: SERVICES["software"].icon,
          id: "126",
          customer: "Fernanda Lima",
          technical: "João Pedro",
          called: "Instalação de software ERP",
          amount: "R$300,00",
          status: "em atendimento",
        },
        {
          categoryImg: SERVICES["printer"].icon,
          id: "127",
          customer: "Juliana Rocha",
          technical: "Eduardo José Marinho",
          called: "Troca de cartucho e limpeza",
          amount: "R$60,00",
          status: "pendente",
        },
      ];

      console.log("Chamados simulados salvos no localStorage:", mockCalledList);
      localStorage.setItem("calledList", JSON.stringify(mockCalledList));
      setCalled(mockCalledList);
    }
  }, []);

  function fetchCalled(e: React.FormEvent) {
    e.preventDefault();

    // 🔄 FUTURA INTEGRAÇÃO COM API:
    // Aqui será feita a busca por nome do técnico via API
    // Exemplo: fetch(`/api/chamados?tecnico=${name}`)

    console.log("Buscar:", name);
  }

  function handlePagination(action: "next" | "previous") {
    setPage((prevPage) => {
      if (action === "next" && prevPage < totalOfPage) {
        return prevPage + 1;
      }

      if (action === "previous" && prevPage > 1) {
        return prevPage - 1;
      }

      return prevPage;
    });
  }

  // 🔍 FILTRO LOCAL POR NOME DO TÉCNICO, CLIENTE OU SERVIÇO
  const filteredCalled = called.filter((item) =>
    item.technical.toLowerCase().includes(name.toLowerCase()) ||
    item.customer.toLowerCase().includes(name.toLowerCase()) ||
    item.called.toLowerCase().includes(name.toLowerCase())
  );

  console.log("Chamados filtrados:", filteredCalled);

  return (
    <div className="bg-neutral-50 md:min-w-[768px] rounded-xl items-center p-10">
      <h1 className="text-orange-700 font-bold text-xl flex-1">Chamados</h1>

      <form
        onSubmit={fetchCalled}
        className="flex items-center justify-between pb-6 border-b-[1px] border-b-gray-400 md:flex-row gap-2 mt-6"
      >
        <Input
          placeholder="Pesquisar por Técnico, Cliente ou Serviço"
          onChange={(e) => setName(e.target.value)}
        />

        <Button type="submit" variant="icon">
          <img src={searchSvg} alt="ícone de pesquisa" />
        </Button>
      </form>

      <div className="my-6 flex flex-col gap-4 max-h-[342px] overflow-y-scroll">
        {filteredCalled.map((item) => (
          <CalledItem
            key={item.id}
            data={item}
            href={`/called/${item.id}`}
          />
        ))}
      </div>

      <Pagination
        current={page}
        total={totalOfPage}
        onNext={() => handlePagination("next")}
        onPrevious={() => handlePagination("previous")}
      />
    </div>
  );
}