
// src/pages/AdminPanel.tsx

import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { NotFound } from "./NotFound";
import { Input } from "../components/input";
import { Button } from "../components/Button";
import { SERVICES } from "../utils/services";
import type { CalledItemProps } from "../components/CalledItem";

export function AdminPanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [calledData, setCalledData] = useState<CalledItemProps | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newTechnical, setNewTechnical] = useState("");
  const [customTechnical, setCustomTechnical] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") return;

    async function fetchCalled() {
      try {
        const response = await api.get(`/calleds/${id}`);
        const data = response.data;

        const formattedAmount = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(data.amount);

        const serviceKey = Object.keys(SERVICES).includes(data.service)
          ? (data.service as keyof typeof SERVICES)
          : null;

        const serviceData = serviceKey
          ? SERVICES[serviceKey]
          : { name: data.service, icon: "" };

        setCalledData({
          id: data.id,
          customer: data.customer || data.user?.name || "Cliente não informado",
          technical: data.technical || "Técnico não atribuído",
          called: serviceData.name,
          categoryImg: serviceData.icon,
          amount: formattedAmount,
          status: data.status,
        });

        setNewStatus(data.status);
        setNewTechnical(data.technical || "");
      } catch {
        setCalledData(null);
      }
    }

    fetchCalled();
  }, [id]);

  async function updateStatus() {
    try {
      await api.put(`/calleds/${id}`, { status: newStatus });
      setCalledData((prev) => prev && { ...prev, status: newStatus });
      alert(`Status atualizado para: ${newStatus}`);
    } catch {
      alert("Erro ao atualizar status.");
    }
  }

  async function updateTechnical() {
    let updatedTechnical = newTechnical;
    if (newTechnical === "__remover__") updatedTechnical = "";
    if (newTechnical === "__novo__" && customTechnical.trim()) {
      updatedTechnical = customTechnical;
    }

    try {
      await api.put(`/calleds/${id}`, { technical: updatedTechnical });
      setCalledData((prev) => prev && { ...prev, technical: updatedTechnical });
      alert(`Técnico atualizado para: ${updatedTechnical || "Removido"}`);
    } catch {
      alert("Erro ao atualizar técnico.");
    }
  }

  async function deleteCalled() {
    const confirm = window.confirm("Deseja realmente excluir este chamado?");
    if (!confirm) return;

    try {
      await api.delete(`/calleds/${id}`);
      alert("Chamado excluído.");
      navigate("/admin");
    } catch {
      alert("Erro ao excluir chamado.");
    }
  }

  if (!calledData) return <NotFound />;

  return (
    <div className=" bg-orange-100 flex justify-center px-4 ">
      <div className="bg-neutral-50 rounded-xl p-6 w-full max-w-xl shadow-md">
        <h1 className="text-xl font-bold text-orange-700 mb-4 text-center">Detalhes do Chamado</h1>

        <div className="flex flex-col gap-3 mb-6 text-sm text-gray-800">
          <div className="flex items-center gap-3">
            <img
              src={calledData.categoryImg || SERVICES["software"].icon}
              alt="Categoria"
              className="w-10 h-10"
            />
            <span className="font-semibold text-orange-700">{calledData.called}</span>
          </div>
          <p><strong>Cliente:</strong> {calledData.customer}</p>
          <p><strong>Técnico:</strong> {calledData.technical}</p>
          <p><strong>Valor:</strong> {calledData.amount}</p>
          <p><strong>Status:</strong> {calledData.status}</p>
        </div>

        <div className="flex flex-col gap-6 text-sm">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Alterar Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="aberto">Aberto</option>
              <option value="em atendimento">Em atendimento</option>
              <option value="encerrado">Encerrado</option>
            </select>
            <Button
              className="mt-2 bg-orange-300 hover:bg-amber-800 text-white px-4 py-2 rounded"
              onClick={updateStatus}
            >
              Confirmar Status
            </Button>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Técnico</label>
            <select
              value={newTechnical}
              onChange={(e) => setNewTechnical(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione ou remova</option>
              <option value="__remover__">Remover Técnico</option>
              <option value="Carlos Silva">Carlos Silva</option>
              <option value="Mariana Rocha">Mariana Rocha</option>
              <option value="__novo__">Adicionar novo técnico</option>
            </select>
            {newTechnical === "__novo__" && (
              <Input
                type="text"
                placeholder="Nome do novo técnico"
                value={customTechnical}
                onChange={(e) => setCustomTechnical(e.target.value)}
                className="mt-2"
              />
            )}
            <Button
              className="mt-2 bg-gray-500 hover:bg-amber-800 text-white px-4 py-2 rounded"
              onClick={updateTechnical}
            >
              Confirmar Técnico
            </Button>
          </div>

          <Button
            className="mt-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={deleteCalled}
          >
            Excluir Chamado
          </Button>
        </div>

        <Button
          className="mt-6 bg-orange-300 hover:bg-amber-800 text-white px-4 py-2 rounded w-full"
          onClick={() => navigate("/admin")}
        >
          ← Voltar
        </Button>
      </div>
    </div>
  );
}





