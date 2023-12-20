import { notFound } from "next/navigation";
import { getUser } from "../../services/users";
import { Metadata } from "next";
import { UserDetails } from "../../templates/UserDetails/UserDetails";

const handleGetUser = async (userId: string) =>
  await getUser(userId).catch(() => undefined);

export async function generateMetadata({
  params: { userId },
}: {
  params: { userId: string };
}): Promise<Metadata> {
  const user = await handleGetUser(userId);

  return {
    title: user ? `${user.firstName} ${user.lastName}` : "Não encontrado",
  };
}

export default async function UserPage({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const user = await handleGetUser(userId);

  if (!user) {
    return notFound();
  }

  return <UserDetails id={userId} initialData={user} />;
}
