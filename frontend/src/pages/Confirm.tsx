//Confirm.tsx - Apresenta  a MSG de chamado criado com sucesso!

import { Navigate, useLocation} from "react-router";
import okSvg from "../assets/ok.svg";

export function Confirm(){
    const location = useLocation()

    if(!location.state?.fromSubmit){
        return <Navigate to="/" />
        
    }
    
    
    return (
        <div
        className="min-h-screen flex items-center justify-center  bg-orange-100">
        <div 
        className="bg-neutral-50 lg:w-[512px] rounded-xl flex flex-col items-center p-10 gap-6"
        >
            <h1
            className="text-2xl font-bold text-center text-orange-700"
            >Solicitação enviada!</h1>
            <img src={okSvg} alt="ícone de OK" className="w-30"/>

            <p
            className="text-sm text-black text-center"
            >
                Agora é só aguardar! Sua solicitação foi enviada ao <br />técnico escolhido! <br /> O mais breve possível seu chamado será atendido.
            </p>

            <a
            className="w-full p-3 text-center bg-amber-800 rounded-lg text-white uppercase hover:bg-orange-300 transition ease-linear"
            href="/called">Novo Chamado</a>
        </div>
        </div>
    )
}




