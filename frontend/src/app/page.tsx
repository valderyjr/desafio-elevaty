import { Metadata } from "next";
import { UsersTemplate } from "../templates/UsersTemplate/UsersTemplate";

export const metadata: Metadata = {
  title: "Desafio Elevaty | Clientes",
};

export default function Home() {
  return <UsersTemplate />;
}
