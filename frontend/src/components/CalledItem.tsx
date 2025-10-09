// src/components/CalledItem.tsx

import { Link } from "react-router-dom";
import type React from "react";
import { SERVICES } from "../utils/services";

export type CalledItemProps = {
  id: string;
  customer: string;
  technical: string;
  called: string;
  categoryImg: string;
  amount: string;
  status: string;
  serviceEntries?: {
    description: string;
    value: number;
  }[];
};

type Props = React.ComponentProps<"a"> & {
  data: CalledItemProps;
  href: string;
};

export function CalledItem({ data, href, ...rest }: Props) {
  return (
    <Link
      to={href}
      className="bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 w-full flex flex-col gap-4"
      {...rest}
    >
      <div className="flex items-center gap-4">
        {data.categoryImg ? (
          <img src={data.categoryImg} alt="Categoria" className="w-8 h-8" />
        ) : (
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
        )}
        <h2 className="text-lg font-semibold text-orange-700">{data.called}</h2>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-4 text-sm md:text-base text-gray-800">
        <div className="flex-1 min-w-[120px]">
          <p className="font-semibold text-orange-700">Cliente</p>
          <p>{data.customer}</p>
        </div>

        <div className="flex-1 min-w-[160px]">
          <p className="font-semibold text-orange-700">Serviço</p>
          <p>{data.called}</p>
        </div>

        <div className="flex-none w-24">
          <p className="font-semibold text-orange-700">Valor</p>
          <p>{data.amount}</p>
        </div>

        <div className="flex-none w-40">
          <p className="font-semibold text-orange-700">Técnico</p>
          <p>{data.technical}</p>
        </div>

        <div className="flex items-center justify-end flex-1">
          <span className="bg-orange-300 text-white rounded-2xl px-3 py-1 hover:bg-amber-800 whitespace-nowrap">
            {data.status}
          </span>
        </div>
      </div>


{data.serviceEntries && data.serviceEntries.length > 0 && (
  <div className="mt-4 border-t pt-3 text-sm text-gray-700 w-full break-words">
    <p className="font-semibold text-orange-700 mb-2">Serviços adicionais:</p>
    <ul className="list-disc ml-5 space-y-1">
      {data.serviceEntries.map((entry, index) => (
        <li key={index}>
          <span className="font-medium">
            {SERVICES[entry.description as keyof typeof SERVICES]?.name || entry.description}
          </span>{" "}
          —{" "}
          <span className="text-gray-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(entry.value)}
          </span>
        </li>
      ))}
    </ul>
  </div>
)}


    </Link>
  );
}


