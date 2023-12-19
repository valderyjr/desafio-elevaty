import { fetchWrapper } from "../../utils/fetchWrapper";
import { Phone } from "../../utils/types";

export const createPhone = async (phone: Omit<Phone, "id">) => {
  return await fetchWrapper<Phone>(`/phones/`, {
    method: "POST",
    body: JSON.stringify(phone),
  });
};

export const updatePhone = async (
  id: string,
  phone: Partial<Omit<Phone, "id">>
) => {
  return await fetchWrapper<Phone>(`/phones/${id}`, {
    method: "PATCH",
    body: JSON.stringify(phone),
  });
};
