// Apresenta MSG de página não encontrada.

export function NotFound(){
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="flex flex-col">
            <h1 className=" text-red-600 font-semibold text-2xl mb-10">
                Op's! Essa página não existe. 😵‍💫</h1>

            <a 
            href="/"
            className="font-semibold text-center text-orange-300 hover:text-amber-800 transition ease-linear"
            >Voltar para o início</a>

        </div>    
        </div>
    )
}