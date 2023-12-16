import { Address } from 'src/addresses/entities/address.entity';
import { CreditCard } from 'src/credit-cards/entities/credit-card.entity';
import { Phone } from 'src/phones/entities/phone.entity';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  creditCards: CreditCard[];
  phone: Phone | null;
  address: Address | null;
}
