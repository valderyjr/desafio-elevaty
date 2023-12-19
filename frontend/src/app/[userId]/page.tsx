import { notFound } from "next/navigation";
import Link from "next/link";
import { getUser } from "../../services/users";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { formatStringDate } from "../../utils/date";
import { User } from "../../utils/types";

const handleGetUser = async (userId: string) =>
  await getUser(userId).catch(() => undefined);

const getPhoneContent = (user: User) => {
  if (!user.phone) {
    return "Não informado.";
  }
  return `${user.phone.countryCode} ${user.phone.number}`;
};

export default async function UserPage({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const user = await handleGetUser(userId);

  if (!user) {
    return notFound();
  }

  const personalInfos = [
    { title: "Email", content: user.email },
    { title: "Data de nascimento", content: formatStringDate(user.birthDate) },
    { title: "Telefone", content: getPhoneContent(user) },
    { title: "Endereço", content: "ender" },
  ];

  return (
    <div className="w-full flex flex-col gap-3">
      <Link
        href={"/"}
        className="font-semibold text-base gap-1 hover:underline flex items-center w-fit"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Voltar
      </Link>
      <h1 className="text-lg font-bold">
        {user.firstName} {user.lastName}
      </h1>

      <section className="w-full h-full flex gap-3 ">
        <div className="w-full bg-gray-200 flex flex-col rounded p-2 gap-1">
          <h2 className="font-semibold text-base mb-1">Informações pessoais</h2>
          {personalInfos.map((info) => (
            <p className="text-sm" key={`personal-info-${info.title}`}>
              <b>{info.title}: </b>
              {info.content}
            </p>
          ))}
        </div>
        <div className="w-full bg-gray-200 flex flex-col rounded p-2">
          <h2 className="font-semibold text-base mb-1">Cartões de crédito</h2>
        </div>
      </section>
    </div>
  );
}
