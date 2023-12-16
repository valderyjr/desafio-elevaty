import { Metadata } from "next";
import { Input } from "../components/Input/Input";

export const metadata: Metadata = {
  title: "Desafio Elevaty | Clientes",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Input id="input" label="Label" />
    </main>
  );
}
