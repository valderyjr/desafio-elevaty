export type ClientApiError = {
  statusCode: number;
  message: string;
};

export type ZipCodeApiResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  pages: number;
};

export type Phone = {
  id: string;
  userId: string;
  countryCode: string;
  number: string;
};

export type Address = {
  id: string;
  userId: string;
  zipCode: string;
  state: string;
  city: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string | null;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phone?: Phone | null;
  address?: Address | null;
  // creditCards: CreditCard[];
};

export type UpdateMutation<T> = {
  id: string;
  data: Omit<T, "id" | "userId">;
};
