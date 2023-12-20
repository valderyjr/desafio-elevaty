import { formatCreditCardNumber } from "../../utils/string";

type CreditCardProps = {
  number: string;
  expirationMonth: number;
  expirationYear: number;
  brand: string;
};

export const CreditCard = ({
  brand,
  expirationMonth,
  expirationYear,
  number,
}: CreditCardProps) => {
  return (
    <div className="p-2 rounded bg-slate-600 w-full flex flex-col text-white font-semibold text-xs h-[144px] justify-between">
      <p>{formatCreditCardNumber(number)}</p>
      <span className="flex w-full justify-between gap-1">
        <p>{brand}</p>
        <p>
          {String(expirationMonth + 1).padStart(2, "0")}/{expirationYear}
        </p>
      </span>
    </div>
  );
};
