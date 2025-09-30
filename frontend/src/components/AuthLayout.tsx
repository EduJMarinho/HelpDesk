import { Outlet } from "react-router";
import LogoImg from "../assets/Logo-HelpDesk.png";

export function AuthLayout(){
   return(
    <div className="w-screen h-screen bg-orange-100 flex flex-col justify-center items-center text-orange-700">
        <main className="bg-neutral-50 p-8 rounded-md flex items-center flex-col md:min-w-[462px]">
            <img src={LogoImg} alt="Logo" className="mt-3 mb-8" />
            <Outlet /> 
        </main>
    </div>
   ) 
}