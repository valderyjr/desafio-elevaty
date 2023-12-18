import Link from "next/link";

export default function NotFoundUserPage() {
  return (
    <div className="w-full items-center flex flex-col gap-4">
      <h1 className="font-bold text-lg">
        Não conseguimos encontrar nenhum usuário com o ID solicitado.
      </h1>
      <Link
        href={"/"}
        className="transition-colors ease-linear duration-200 font-semibold rounded flex gap-1 items-center justify-center text-sm bg-gray-800 hover:bg-gray-900 text-white active:bg-gray-950 px-5 py-2"
      >
        Voltar para a página principal
      </Link>
    </div>
  );
}
