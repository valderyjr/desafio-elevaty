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

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  pages: number;
};

export const getUsers = async (take: number, skip: number) => {
  return await fetchWrapper<PaginatedResponse<User>>(
    `/users?take=${take}&skip=${skip}`
  );
};

export const getUser = async (id: string) => {
  return await fetchWrapper<User>(`/users/${id}`);
};

export const createUser = async (user: Omit<User, "id">) => {
  return await fetchWrapper<User>(`/users/`, {
    method: "POST",
    body: JSON.stringify(user),
  });
};

export const updateUser = async (
  id: string,
  user: Partial<Omit<User, "id">>
) => {
  return await fetchWrapper<User>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(user),
  });
};

export const deleteUser = async (id: string) => {
  return await fetchWrapper<void>(`/users/${id}`, {
    method: "DELETE",
  });
};
