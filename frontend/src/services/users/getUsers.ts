import { fetchWrapper } from "../../utils/fetchWrapper";
import { User } from "./getUser";

export const getUsers = async () => {
  return await fetchWrapper<User[]>(`/users/`);
};
