import { fetchWrapper } from "../../utils/fetchWrapper";
import { PaginatedResponse, User } from "../../utils/types";

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
