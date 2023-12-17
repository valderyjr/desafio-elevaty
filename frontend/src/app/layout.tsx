import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header/Header";
import { ReactQueryProvider } from "../providers/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "Desafio Elevaty | %s",
    default: "Desafio Elevaty",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="w-full h-full text-brand-secondary">
      <body className={`${inter.className} w-full h-full flex flex-col`}>
        <Header />
        <main className="p-4 max-w-7xl mx-auto h-full w-full">
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </main>
      </body>
    </html>
  );
}
