export class CreditCard {
  id: string;
  userId: string;
  brand: string;
  expirationMonth: number;
  expirationYear: number;
  number: string;
  invoiceUrl?: string | null;
}
