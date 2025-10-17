import { useEffect, useState } from "react";
import { api } from "../services/api";
import { SERVICES } from "../utils/services";
import { NotFound } from "./NotFound";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";

type Called = {
  id: string;
  service: string;
  technical: string;
  amount: number;
  status: string;
  createdAt: string;
};

export function MyCalleds() {
  const [calleds, setCalleds] = useState<Called[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMyCalleds() {
      try {
        const response = await api.get("/calleds");
        const userRole = localStorage.getItem("userRole");

        if (userRole !== "customer") {
          setCalleds([]);
          return;
        }

        setCalleds(response.data.calleds || []);
      } catch (error) {
        console.error("Erro ao buscar chamados:", error);
        setCalleds([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMyCalleds();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-600 mt-10">
        Carregando seus chamados...
      </div>
    );
  }

  if (!calleds.length) {
    return <NotFound message="Você ainda não possui chamados registrados." />;
  }

  return (
    <div className="bg-orange-100 min-h-screen px-4 py-6 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-xl font-bold text-orange-700 mb-4 text-center">
          Meus Chamados
        </h1>

        <ul className="space-y-4">
          {calleds.map((called) => {
            const serviceData = SERVICES[called.service as keyof typeof SERVICES];
            const formattedAmount = new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(called.amount);

            return (
              <li
                key={called.id}
                className="border border-gray-200 rounded-lg p-4 bg-neutral-50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={serviceData?.icon || SERVICES["software"].icon}
                    alt="Ícone"
                    className="w-8 h-8"
                  />
                  <span className="font-semibold text-orange-700">
                    {serviceData?.name || called.service}
                  </span>
                </div>
                <p><strong>Técnico:</strong> {called.technical || "Não atribuído"}</p>
                <p><strong>Valor:</strong> {formattedAmount}</p>
                <p><strong>Status:</strong> {called.status}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Criado em: {new Date(called.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </li>
            );
          })}
        </ul>

        <Button
          className="mt-6 bg-orange-300 hover:bg-amber-800 text-white px-4 py-2 rounded w-full"
          onClick={() => navigate("/called")}
        >
          ← VOLTAR
        </Button>
      </div>
    </div>
  );
}