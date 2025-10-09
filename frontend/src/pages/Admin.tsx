//Apresenta a lista dos chamados e suas características.

// src/pages/Admin.tsx

import { useEffect, useState } from "react";
import searchSvg from "../assets/search.svg";
import { SERVICES, SERVICES_KEYS } from "../utils/services";
import { Input } from "../components/input";
import { Button } from "../components/Button";
import { Pagination } from "../components/Pagination";
import { CalledItem } from "../components/CalledItem";
import type { CalledItemProps } from "../components/CalledItem";
import { api } from "../services/api";

type ServiceKey = keyof typeof SERVICES;

export function Admin() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [called, setCalled] = useState<CalledItemProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  async function fetchCalled() {
    try {
      const response = await api.get("/calleds", {
        params: { page },
      });

      const data = response.data.calleds;
      const formatted = formatCalledList(data);
      setCalled(formatted);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
    }
  }

  async function searchCalled() {
    try {
      setIsSearching(true);

      const response = await api.get("/calleds/search", {
        params: { name: searchTerm },
      });

      const data = response.data;
      const formatted = formatCalledList(data);

      setCalled(formatted);
      setTotalPages(1);
      setPage(1);
    } catch (error) {
      console.error("Erro ao pesquisar chamados:", error);
    } finally {
      setIsSearching(false);
    }
  }

  function formatCalledList(data: any[]): CalledItemProps[] {
    return data.map((item: any) => {
      const serviceKey = SERVICES_KEYS.includes(item.service)
        ? (item.service as ServiceKey)
        : null;

      const serviceData = serviceKey
        ? SERVICES[serviceKey]
        : { name: item.service, icon: "", value: 0 };

      const extra = item.serviceEntries?.reduce((sum: number, s: any) => sum + s.value, 0) || 0;
      const totalAmount = item.amount + extra;

      return {
        id: item.id,
        customer: item.user?.name || "Cliente não informado",
        technical: item.technical || "Técnico não atribuído",
        called: serviceData.name,
        categoryImg: serviceData.icon,
        amount: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(totalAmount),
        status: item.status || "aberto",
        serviceEntries: item.serviceEntries || [],
      };
    });
  }

  useEffect(() => {
    if (!isSearching && searchTerm.trim() === "") {
      fetchCalled();
    }
  }, [page]);

  useEffect(() => {
    const handleFocus = () => {
      if (!isSearching && searchTerm.trim() === "") {
        fetchCalled();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isSearching, searchTerm]);

  function handlePagination(action: "next" | "previous") {
    setPage((prevPage) => {
      if (action === "next" && prevPage < totalPages) return prevPage + 1;
      if (action === "previous" && prevPage > 1) return prevPage - 1;
      return prevPage;
    });
  }

  return (
    <div className="bg-white md:min-w-[768px] rounded-xl items-center p-10">
      <h1 className="text-orange-700 font-bold text-xl mb-6">Chamados</h1>

      <form

        onSubmit={(e) => {
          e.preventDefault();
          if (searchTerm.trim()) {
            searchCalled();
          } else {
            fetchCalled();
            setPage(1);
            setTotalPages(1);
          }
        }}

        className="flex items-center justify-between pb-6 border-b-[1px] border-b-gray-400 md:flex-row gap-2"
      >
        <Input
          placeholder="Pesquisar por cliente, serviço ou técnico"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" variant="icon">
          <img src={searchSvg} alt="ícone de pesquisa" />
        </Button>
      </form>

      <div className="my-6 flex flex-col gap-4 max-h-[342px] overflow-y-scroll">
        {called.map((item) => (
          <CalledItem key={item.id} data={item} href={`/called/${item.id}`} />
        ))}
      </div>

      {!isSearching && searchTerm.trim() === "" && (
        <Pagination
          current={page}
          total={totalPages}
          onNext={() => handlePagination("next")}
          onPrevious={() => handlePagination("previous")}
        />
      )}
    </div>
  );
}