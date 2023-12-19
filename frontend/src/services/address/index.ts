import { fetchWrapper } from "../../utils/fetchWrapper";
import { Address } from "../../utils/types";

export const createAddress = async (address: Omit<Address, "id">) => {
  return await fetchWrapper<Address>(`/addresses/`, {
    method: "POST",
    body: JSON.stringify(address),
  });
};

export const updateAddress = async (
  id: string,
  address: Partial<Omit<Address, "id">>
) => {
  return await fetchWrapper<Address>(`/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(address),
  });
};
