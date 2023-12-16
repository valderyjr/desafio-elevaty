import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
  // @TODO Title de cada página derivando desse
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
