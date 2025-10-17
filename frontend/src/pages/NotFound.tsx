// Apresenta MSG de página não encontrada.


type Props = {
  message?: string;
};

export function NotFound({ message }: Props) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col">
        <h1 className="text-red-600 font-semibold text-2xl mb-10 text-center">
          {message || "Op's! Essa página não existe. 😵‍💫"}
        </h1>

        <a
          href="/"
          className="font-semibold text-orange-300 hover:text-amber-800 transition ease-linear text-center"
        >
          Voltar para o início
        </a>
      </div>
    </div>
  );
}