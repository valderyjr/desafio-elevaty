import { fetchWrapper } from "../../utils/fetchWrapper";
import { CreditCard } from "../../utils/types";

export const createCreditCard = async (creditCard: Omit<CreditCard, "id">) => {
  return await fetchWrapper<CreditCard>(`/credit-cards/`, {
    method: "POST",
    body: JSON.stringify(creditCard),
  });
};

export const updateCreditCard = async (
  id: string,
  creditCard: Partial<Omit<CreditCard, "id">>
) => {
  return await fetchWrapper<CreditCard>(`/credit-cards/${id}`, {
    method: "PATCH",
    body: JSON.stringify(creditCard),
  });
};

export const deleteCreditCard = async (id: string) => {
  return await fetchWrapper<void>(`/credit-cards/${id}`, {
    method: "DELETE",
  });
};

export const getCreditCardInvoice = async (id: string) => {
  return await fetchWrapper<Blob>(
    `/credit-cards/invoice/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
      },
    },
    true
  );
};
