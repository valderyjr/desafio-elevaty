import { CreditCard } from 'src/credit-cards/entities/credit-card.entity';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  creditCards: CreditCard[];
}
