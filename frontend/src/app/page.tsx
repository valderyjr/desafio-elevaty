import { Metadata } from "next";
import { Input } from "../components/Input/Input";
import { Table } from "../components/Table/Table";

export const metadata: Metadata = {
  title: "Desafio Elevaty | Clientes",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2"></main>
  );
}
