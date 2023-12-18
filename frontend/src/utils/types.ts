export type ClientApiError = {
  statusCode: number;
  message: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  pages: number;
};

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

export type UpdateUserMutation = {
  id: string;
  user: Omit<User, "id">;
};
