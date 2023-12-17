import Image from "next/image";

export const Header = () => {
  return (
    <header className="w-full bg-brand-primary">
      <div className="flex p-4 max-w-7xl mx-auto items-center">
        <Image
          alt="Logo da empresa Elevaty"
          src={"/logo.png"}
          width={48}
          height={48}
        />
        <p className="font-bold text-xl text-brand-secondary">
          Desafio Elevaty
        </p>
      </div>
    </header>
  );
};
