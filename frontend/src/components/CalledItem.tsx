//Exibi visualmente cada chamado individual na lista da página /admin.


import { Link } from "react-router-dom";
import type React from "react";

export type CalledItemProps = {
  categoryImg: string;
  id: string;
  customer: string;
  technical: string;
  called: string;
  amount: string;
  status: string;
};

type Props = React.ComponentProps<"a"> & {
  data: CalledItemProps;
  href: string;
};

export function CalledItem({ data, href, ...rest }: Props) {
  return (
    <Link
      to={href}
      className="flex flex-col md:flex-row md:items-center md:justify-between hover:bg-orange-300/5 cursor-pointer rounded-md p-4 w-full gap-2"
      {...rest}
    >
      <div className="flex items-center gap-4">
        <span className="w-6 h-6">{data.categoryImg}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-x-2 gap-y-1 w-full text-orange-700 text-sm md:text-base">
        <div className="font-semibold">{data.customer}</div>
        <div>{data.called}</div>
        <div>{data.amount}</div>
        <div className="font-semibold">{data.technical}</div>
        <div className="flex md:justify-end">
          <span className="bg-orange-300 text-white rounded-2xl px-3 py-0.5 hover:bg-amber-800 whitespace-nowrap">
            {data.status}
          </span>
        </div>
      </div>
    </Link>
  );
}