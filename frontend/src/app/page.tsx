import { Metadata } from "next";
import { UsersTemplate } from "../components/templates/UsersTemplate";

export const metadata: Metadata = {
  title: "Desafio Elevaty | Clientes",
};

export default function Home() {
  return <UsersTemplate />;
}
