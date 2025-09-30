//Cria um novo chamado


import { SERVICES, SERVICES_KEYS } from "../utils/services";
import { useState } from "react";
import { Input } from "../components/input";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";

export function Called() {
    const [services, setServices] = useState<keyof typeof SERVICES | "">("");
    const [serviceValue, setServiceValue] = useState("");
    const [technical, setTechnical] = useState("");
    const navigate = useNavigate()

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        const serviceName = services ? SERVICES[services].name : "Serviço não selecionado";

        console.log(serviceName, serviceValue, technical);
        navigate("/confirm", {state: {fromSubmit: true }})
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
            className="bg-neutral-50 w-full rounded-xl flex flex-col p-10 gap-6 lg:min-w-[512px]"
        >
            <header>
                <h1 className="text-xl font-bold text-orange-300">
                    Chamado de Serviço
                </h1>
                <p className="text-sm text-black mt-2 mb-4">
                    Serviço solicitado
                </p>
            </header>

            <div className="flex gap-4">
                <Select
                    className="w-92 h-12 rounded-lg border border-gray-300 px-4 text-sm"
                    required
                    legend="Serviço"
                    value={services}
                    onChange={handleServiceChange}
                >
                    {SERVICES_KEYS.map((service) => (
                        <option key={service} value={service}>
                            {SERVICES[service].name}
                        </option>
                    ))}
                </Select>

                <Input
                    className="w-24 h-12"
                    legend="Valor"
                    value={serviceValue}
                    onChange={(e) => setServiceValue(e.target.value)}
                    readOnly
                />
            </div>

            <Input
                required
                legend="Escolher Técnico para o serviço"
                value={technical}
                onChange={(e) => setTechnical(e.target.value)}
            />

            <Button
                type="submit"
                disabled={!isFormValid}
                className={`flex items-center justify-center uppercase text-xxs rounded-lg text-white mt-1
                     cursor-pointer transition easy-linear h-12 ${isFormValid ? "bg-orange-300 hover:bg-amber-800" : "bg-orange-200 cursor-not-allowed"}`}
            >
                Enviar
            </Button>
        </form>
    );
}