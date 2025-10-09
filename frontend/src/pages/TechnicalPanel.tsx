// src/pages/TechnicalPanel.tsx

import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { NotFound } from "./NotFound";
import { Input } from "../components/input";
import { Button } from "../components/Button";
import { SERVICES, SERVICES_KEYS } from "../utils/services";
import type { CalledItemProps } from "../components/CalledItem";

type ServiceEntry = {
  description: string;
  value: number;
};

export function TechnicalPanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [calledData, setCalledData] = useState<CalledItemProps | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [services, setServices] = useState<ServiceEntry[]>([]);
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServiceValue, setNewServiceValue] = useState("");

  async function fetchCalled() {
    try {
      const response = await api.get(`/calleds/${id}`);
      const data = response.data;

      const serviceKey = SERVICES_KEYS.includes(data.service)
        ? (data.service as keyof typeof SERVICES)
        : null;

      const serviceData = serviceKey
        ? SERVICES[serviceKey]
        : { name: data.service, icon: "", value: 0 };

      const formattedAmount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(data.amount);

      setCalledData({
        id: data.id,
        customer: data.customer || "Cliente não informado",
        technical: data.technical || "Técnico não atribuído",
        called: serviceData.name,
        categoryImg: serviceData.icon,
        amount: formattedAmount,
        status: data.status,
      });

      setServices(data.serviceEntries || []);
      setNewStatus(data.status);
    } catch {
      setCalledData(null);
    }
  }

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "technical") return;
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

  async function addService() {
    if (!newServiceDesc.trim()) return;

    try {
      await api.post(`/calleds/${id}/services`, {
        description: newServiceDesc,
      });
      await fetchCalled();
      setNewServiceDesc("");
      setNewServiceValue("");
    } catch {
      alert("Erro ao adicionar serviço.");
    }
  }

  const totalValue = (() => {
    const base = parseFloat(calledData?.amount.replace("R$", "").replace(",", ".") || "0");
    const extra = services.reduce((sum, s) => sum + s.value, 0);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(base + extra);
  })();

  if (!calledData) return <NotFound />;

  return (
    <div className="bg-orange-100 flex justify-center px-4 py-4">
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
          <p><strong>Valor original:</strong> {calledData.amount}</p>
          <p><strong>Status:</strong> {calledData.status}</p>
          <p><strong>Valor total:</strong> {totalValue}</p>
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
            <label className="block font-medium text-gray-700 mb-1">Adicionar Serviço</label>
            <select
              value={newServiceDesc}
              onChange={(e) => {
                const selected = e.target.value;
                setNewServiceDesc(selected);
                const value = SERVICES[selected as keyof typeof SERVICES]?.value || 0;
                setNewServiceValue(value.toString());
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione um serviço</option>
              {SERVICES_KEYS.map((key) => (
                <option key={key} value={key}>
                  {SERVICES[key].name}
                </option>
              ))}
            </select>

            <Input
              type="text"
              placeholder="Valor"
              value={newServiceValue}
              readOnly
              className="mt-2"
            />

            <Button
              className="mt-2 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={addService}
            >
              Adicionar Serviço
            </Button>
          </div>

          {services.length > 0 && (
            <div className="mt-1">
              <p className="font-semibold text-orange-700 ">Serviços Adicionados:</p>
              <ul className="list-disc pl-5 text-sm">
                {services.map((s, i) => (
                  <li key={i}>
                    <span className="font-medium">
                      {SERVICES[s.description as keyof typeof SERVICES]?.name || s.description}
                    </span>{" "}
                    —{" "}
                    <span className="text-gray-600">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(s.value)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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