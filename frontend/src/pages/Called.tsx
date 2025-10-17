import { SERVICES, SERVICES_KEYS } from "../utils/services";
import { useState, useEffect } from "react";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { api } from "../services/api";

export function Called() {
  const [services, setServices] = useState<keyof typeof SERVICES | "">("");
  const [serviceValue, setServiceValue] = useState("");
  const [technical, setTechnical] = useState("");
  const [technicians, setTechnicians] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/users?role=technical").then((res) => {
      setTechnicians(res.data.map((user: any) => user.name));
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!services || !technical) return;

    const payload = {
      service: services,
      amount: SERVICES[services].value,
      technical,
    };

    try {
      await api.post("/calleds", payload);
      navigate("/confirm", { state: { fromSubmit: true } });
    } catch (error) {
      alert("Erro ao enviar chamado. Tente novamente.");
      console.error(error);
    }
  }

  function handleServiceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedService = e.target.value as keyof typeof SERVICES;
    setServices(selectedService);

    const value = SERVICES[selectedService]?.value;

    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));

    setServiceValue(formattedValue);
  }

  const isFormValid = services !== "" && serviceValue !== "" && technical.trim() !== "";

  return (
    <form
      onSubmit={onSubmit}
      className="bg-neutral-50 w-full max-w-xl mx-auto rounded-xl flex flex-col p-6 gap-6 shadow-md"
    >
      <header className="mb-2">
        <h1 className="text-lg font-bold text-orange-300">Chamado de Serviço</h1>
        <p className="text-xs text-gray-700 mt-1">Preencha os dados para registrar o chamado</p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-col gap-2">
          <Select
            className="w-full h-10 rounded-lg border border-gray-300 px-4 text-sm"
            required
            legend="Serviço"
            value={services}
            onChange={handleServiceChange}
          >
            <option value="">Selecione</option>
            {SERVICES_KEYS.map((service) => (
              <option key={service} value={service}>
                {SERVICES[service].name}
              </option>
            ))}
          </Select>

          {serviceValue && (
            <span className="text-sm text-gray-700">
              <strong>Valor:</strong> {serviceValue}
            </span>
          )}
        </div>

        <div>
          <Select
            required
            legend="Técnico responsável"
            value={technical}
            onChange={(e) => setTechnical(e.target.value)}
            className="w-full md:w-1/2 h-10 rounded-lg border border-gray-300 px-4 text-sm"
          >
            <option value="">Selecione um técnico</option>
            {technicians.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <footer className="pt-2 flex justify-between items-center">
        <Button
          type="submit"
          disabled={!isFormValid}
          className={`flex items-center justify-center uppercase text-sm rounded-lg text-white h-12 px-6 transition ease-linear ${
            isFormValid
              ? "bg-orange-300 hover:bg-amber-800"
              : "bg-orange-200 cursor-not-allowed"
          }`}
        >
          Enviar
        </Button>

        <Button
          type="button"
          className="bg-orange-300 hover:bg-amber-800 text-white text-sm rounded-lg h-12 px-6"
          onClick={() => navigate("/my-calleds")}
        >
          MEUS CHAMADOS
        </Button>
      </footer>
    </form>
  );
}