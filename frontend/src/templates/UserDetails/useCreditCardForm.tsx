import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import {
  INPUT_ERROR_MESSAGES,
  INPUT_LENGTHS,
  REACT_QUERY_KEYS,
} from "../../utils/constants";
import {
  createCreditCard,
  deleteCreditCard,
  getCreditCardInvoice,
  updateCreditCard,
} from "../../services/credit-cards";
import { CreditCard, UpdateMutation } from "../../utils/types";
import {
  getExpirationValuesFromInput,
  parseExpirationValuesToInput,
} from "../../utils/date";

type useCreditCardFormProps = {
  userId: string;
  onSuccess: () => void;
};

export const useCreditCardForm = ({
  userId,
  onSuccess,
}: useCreditCardFormProps) => {
  const creditCardSchema = z.object({
    id: z.string().optional(),
    brand: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .max(INPUT_LENGTHS.defaultString, INPUT_ERROR_MESSAGES.maxLength),
    number: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .max(INPUT_LENGTHS.defaultString, INPUT_ERROR_MESSAGES.maxLength),
    expiration: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .min(INPUT_LENGTHS.expirationDate, INPUT_ERROR_MESSAGES.dateMinLength)
      .refine((value) => {
        if (value.length < 4) {
          return;
        }

        const { month, year } = getExpirationValuesFromInput(value);

        const today = new Date();

        // month can be 0 and 0 is falsy
        if (month === undefined || !year) {
          return false;
        }

        const isInFutureYear = year > today.getFullYear();

        const isInSameYearAndFutureMonth =
          year === today.getFullYear() && month > today.getMonth();
        console.log(
          month,
          year,
          today.getFullYear(),
          today.getMonth(),
          isInFutureYear,
          isInSameYearAndFutureMonth
        );

        return isInFutureYear || isInSameYearAndFutureMonth;
      }, INPUT_ERROR_MESSAGES.dateNextMonth),
  });

  type CreditCardFormData = z.infer<typeof creditCardSchema>;

  const { register, handleSubmit, formState, control, clearErrors, reset } =
    useForm<CreditCardFormData>({
      resolver: zodResolver(creditCardSchema),
      mode: "onBlur",
      defaultValues: {
        brand: "",
        expiration: "",
        id: "",
        number: "",
      },
    });

  const {
    mutateAsync: createCreditCardMutate,
    isLoading: isLoadingCreateCreditCard,
  } = useMutation({
    mutationKey: [REACT_QUERY_KEYS.createCreditCard],
    mutationFn: createCreditCard,
  });

  const {
    mutateAsync: updateCreditCardMutate,
    isLoading: isLoadingUpdateCreditCard,
  } = useMutation({
    mutationKey: [REACT_QUERY_KEYS.updateCreditCard],
    mutationFn: ({ id, data }: UpdateMutation<CreditCard>) =>
      updateCreditCard(id, data),
  });

  const {
    mutate: deleteCreditCardMutate,
    isLoading: isLoadingDeleteCreditCard,
  } = useMutation({
    mutationKey: [REACT_QUERY_KEYS.deleteCreditCard],
    mutationFn: deleteCreditCard,
  });

  const {
    mutate: getCreditCardInvoiceMutate,
    isLoading: isLoadingGetCreditCardInvoice,
  } = useMutation({
    mutationKey: [REACT_QUERY_KEYS.getCreditCardInvoice],
    mutationFn: getCreditCardInvoice,
  });

  const onClickToEdit = (creditCard: CreditCard) => {
    reset({
      brand: creditCard.brand,
      expiration: parseExpirationValuesToInput(
        creditCard.expirationYear,
        creditCard.expirationMonth
      ),
      id: creditCard.id,
      number: creditCard.number,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onClickToDelete = (creditCardId: string) => {
    deleteCreditCardMutate(creditCardId, {
      onSuccess: onSuccess,
      onError: (e) => console.error("a", e),
    });
  };

  const onClickToGetInvoice = (creditCardId: string) => {
    getCreditCardInvoiceMutate(creditCardId, {
      onSuccess: (blob) => {
        if (!blob) {
          console.log("eita");
          return;
        }

        const url = window.URL.createObjectURL(blob);
        window.open(url, "__blank");
      },
      onError: (e) => console.error("a", e),
    });
  };

  const onSubmit = async (data: CreditCardFormData) => {
    try {
      const { month, year } = getExpirationValuesFromInput(data.expiration);

      //   month can be 0 and 0 is falsy
      if (month === undefined || !year) {
        throw new Error("Should have date");
      }

      const formattedData = {
        brand: data.brand,
        expirationMonth: month,
        expirationYear: year,
        number: data.number,
      };

      if (data.id) {
        await updateCreditCardMutate({
          id: data.id,
          data: formattedData,
        });
      } else {
        await createCreditCardMutate({ ...formattedData, userId });
      }
      reset({ brand: "", expiration: "", id: "", number: "" });
      onSuccess();
    } catch (error) {
      console.error("oi", error);
    }
  };

  return {
    hookForm: {
      register,
      handleSubmit,
      formState,
      control,
      clearErrors,
      reset,
    },
    onSubmit,
    onClickToEdit,
    onClickToDelete,
    onClickToGetInvoice,
    loading:
      isLoadingCreateCreditCard ||
      isLoadingUpdateCreditCard ||
      isLoadingDeleteCreditCard ||
      isLoadingGetCreditCardInvoice,
  };
};
