import { fetchWrapper } from "../../utils/fetchWrapper";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  // creditCards: CreditCard[];
  // phone: Phone | null;
  // address: Address | null;
};

export const getUser = async (id: string) => {
  return await fetchWrapper<User>(`/users/${id}`);
};
