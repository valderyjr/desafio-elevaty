export type ClientApiError = {
  statusCode: number;
  message: string;
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

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phone?: Phone | null;
  // creditCards: CreditCard[];
  // address: Address | null;
};

export type UpdateMutation<T> = {
  id: string;
  data: Omit<T, "id" | "userId">;
};
