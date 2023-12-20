import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import {
  COUNTRY_CODES,
  INPUT_ERROR_MESSAGES,
  INPUT_LENGTHS,
  REACT_QUERY_KEYS,
  STATES,
} from "../../utils/constants";
import { parseInputStringToDate } from "../../utils/date";
import {
  createUser as createUserMutation,
  updateUser as updateUserMutation,
} from "../../services/users";
import {
  createPhone as createPhoneMutation,
  updatePhone as updatePhoneMutation,
} from "../../services/phones";
import {
  createAddress as createAddressMutation,
  updateAddress as updateAddressMutation,
} from "../../services/address";
import { Address, Phone, UpdateMutation, User } from "../../utils/types";
import { ChangeEvent, useState } from "react";
import {
  AsYouType,
  CountryCode,
  parsePhoneNumberWithError,
} from "libphonenumber-js";
import { fetchZipCode } from "../../services/zip-code";
import { formatZipCode } from "../../utils/string";
import { useToastStore } from "../../hooks/toastStore";
import { getFormattedApiError } from "../../utils/apiErrors";

interface useCreateOrEditUserFormProps {
  onCloseModal: () => void;
  onSuccess: () => void;
  onSearchZipCode: () => void;
  id?: string;
}

export const useCreateOrEditUserForm = ({
  onSuccess,
  onCloseModal,
  onSearchZipCode,
  id,
}: useCreateOrEditUserFormProps) => {
  const userSchema = z.object({
    firstName: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .max(INPUT_LENGTHS.defaultString, INPUT_ERROR_MESSAGES.maxLength),
    lastName: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .max(INPUT_LENGTHS.defaultString, INPUT_ERROR_MESSAGES.maxLength),
    email: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .max(INPUT_LENGTHS.defaultString, INPUT_ERROR_MESSAGES.maxLength)
      .email(INPUT_ERROR_MESSAGES.email),
    birthDate: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .refine((value) => {
        const date = parseInputStringToDate(value);
        if (!date) {
          return false;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
      }, INPUT_ERROR_MESSAGES.datePreviousToday),
    phoneId: z.string().optional(),
    countryCode: z.object({
      value: z
        .string()
        .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required),
      label: z.string(),
    }),
    phoneNumber: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .max(INPUT_LENGTHS.phoneNumber, INPUT_ERROR_MESSAGES.maxLength),
    addressId: z.string().optional(),
    zipCode: z
      .string()
      .length(INPUT_LENGTHS.zipCode, INPUT_ERROR_MESSAGES.invalidZipCode),
    state: z.object({
      label: z.string(),
      value: z.string().length(INPUT_LENGTHS.state, {
        message: INPUT_ERROR_MESSAGES.required,
      }),
    }),
    city: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .max(INPUT_LENGTHS.defaultString, INPUT_ERROR_MESSAGES.maxLength),
    street: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .max(INPUT_LENGTHS.defaultString, INPUT_ERROR_MESSAGES.maxLength),
    number: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .max(INPUT_LENGTHS.defaultString, INPUT_ERROR_MESSAGES.maxLength),
    neighborhood: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .max(INPUT_LENGTHS.defaultString, INPUT_ERROR_MESSAGES.maxLength),
    complement: z
      .string()
      .max(INPUT_LENGTHS.defaultString, INPUT_ERROR_MESSAGES.maxLength)
      .optional(),
  });

  type UserFormData = z.infer<typeof userSchema>;

  const {
    register,
    handleSubmit,
    formState,
    control,
    clearErrors,
    reset,
    setError,
    getValues,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      phoneId: "",
      countryCode: COUNTRY_CODES.at(0),
      phoneNumber: "",
      city: "",
      complement: "",
      neighborhood: "",
      number: "",
      state: STATES.at(0),
      street: "",
      zipCode: "",
    },
  });

  const { showToast } = useToastStore();

  const { mutateAsync: createUserMutate, isLoading: isLoadingCreateUser } =
    useMutation({
      mutationKey: [REACT_QUERY_KEYS.createUser],
      mutationFn: createUserMutation,
    });

  const { mutateAsync: updateUserMutate, isLoading: isLoadingUpdateUser } =
    useMutation({
      mutationKey: [REACT_QUERY_KEYS.updateUser],
      mutationFn: ({ id, data }: UpdateMutation<Omit<User, "creditCards">>) =>
        updateUserMutation(id, data),
    });

  const { mutateAsync: createPhoneMutate, isLoading: isLoadingCreatePhone } =
    useMutation({
      mutationKey: [REACT_QUERY_KEYS.createPhone],
      mutationFn: createPhoneMutation,
    });

  const { mutateAsync: updatePhoneMutate, isLoading: isLoadingUpdatePhone } =
    useMutation({
      mutationKey: [REACT_QUERY_KEYS.updatePhone],
      mutationFn: ({ id, data }: UpdateMutation<Phone>) =>
        updatePhoneMutation(id, data),
    });

  const {
    mutateAsync: createAddressMutate,
    isLoading: isLoadingCreateAddress,
  } = useMutation({
    mutationKey: [REACT_QUERY_KEYS.createAddress],
    mutationFn: createAddressMutation,
  });

  const {
    mutateAsync: updateAddressMutate,
    isLoading: isLoadingUpdateAddress,
  } = useMutation({
    mutationKey: [REACT_QUERY_KEYS.updateAddress],
    mutationFn: ({ id, data }: UpdateMutation<Address>) =>
      updateAddressMutation(id, data),
  });

  const handleOnChangeZipCode = async (e: ChangeEvent<HTMLInputElement>) => {
    const formattedZipCode = formatZipCode(e.target.value);

    const validationOptions = {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    };

    setValue("zipCode", formattedZipCode, validationOptions);

    if (formattedZipCode.length < INPUT_LENGTHS.zipCode) {
      return;
    }

    const [data, error] = await fetchZipCode(formattedZipCode);

    onSearchZipCode();

    if (error) {
      showToast({
        children:
          "Tivemos um erro ao buscar esse CEP. Insira os dados manualmente, por favor.",
        color: "error",
      });
      return;
    }

    setValue("city", data.localidade, validationOptions);
    setValue("street", data.logradouro, validationOptions);
    setValue("neighborhood", data.bairro, validationOptions);
    setValue("complement", data.complemento, validationOptions);

    const stateOption = STATES.find((state) => state.value === data.uf);

    if (!stateOption) {
      return;
    }

    setValue("state", stateOption, validationOptions);
  };

  const parsePhone = async (phoneNumber: string, countryCode: CountryCode) => {
    try {
      const hasError = await parsePhoneNumberWithError(
        phoneNumber,
        countryCode
      );

      return {
        error: !hasError.isValid(),
        phone: new AsYouType(countryCode).input(phoneNumber),
      };
    } catch (error) {
      return {
        error: phoneNumber.length > 0 ? true : false,
        phone: new AsYouType(countryCode).input(phoneNumber),
      };
    }
  };

  const handleOnChangePhone = async (e: ChangeEvent<HTMLInputElement>) => {
    const countryCode = getValues("countryCode.value");
    const currentValue = getValues("phoneNumber");
    const value = e.target.value;

    const { phone } = await parsePhone(value, countryCode as CountryCode);

    if (currentValue === phone) {
      return { phone: currentValue.slice(0, -1) };
    }

    return { phone };
  };

  // @TODO: FOTOS E README
  // @TODO: COM O JOAO PARA TESTAR

  const validatePhone = async (value: string) => {
    if (value.length < INPUT_LENGTHS.required) {
      setError("phoneNumber", { message: INPUT_ERROR_MESSAGES.required });
      return true;
    }

    if (value.length > INPUT_LENGTHS.phoneNumber) {
      setError("phoneNumber", { message: INPUT_ERROR_MESSAGES.maxLength });
      return true;
    }

    const countryCode = getValues("countryCode.value");

    const { error } = await parsePhone(value, countryCode as CountryCode);

    if (error) {
      setError("phoneNumber", { message: INPUT_ERROR_MESSAGES.invalidPhone });
      return true;
    }

    clearErrors("phoneNumber");
    return false;
  };

  const handlePhoneMutation = async (userId: string, data: UserFormData) => {
    const formattedData = {
      countryCode: data.countryCode.value,
      number: data.phoneNumber,
    };

    if (data.phoneId) {
      await updatePhoneMutate({
        id: data.phoneId,
        data: formattedData,
      });
    } else {
      await createPhoneMutate({
        ...formattedData,
        userId,
      });
    }
  };

  const handleAddressMutation = async (userId: string, data: UserFormData) => {
    const formattedData = {
      city: data.city,
      neighborhood: data.neighborhood,
      number: data.number,
      state: data.state.value,
      street: data.street,
      zipCode: data.zipCode,
      complement: data.complement,
    };

    if (data.addressId) {
      await updateAddressMutate({
        id: data.addressId,
        data: formattedData,
      });
    } else {
      await createAddressMutate({
        ...formattedData,
        userId,
      });
    }
  };

  const handleCreateUser = async (data: UserFormData) => {
    const createdUser = await createUserMutate({
      birthDate: data.birthDate,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    if (!createdUser) {
      throw new Error("Should have created user.");
    }

    await handlePhoneMutation(createdUser.id, data);
    await handleAddressMutation(createdUser.id, data);
  };

  const handleUpdateUser = async (id: string, data: UserFormData) => {
    await updateUserMutate({
      id,
      data: {
        birthDate: data.birthDate,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    await handlePhoneMutation(id, data);
    await handleAddressMutation(id, data);
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      const errorInPhone = await validatePhone(data.phoneNumber);

      if (errorInPhone) {
        return;
      }

      if (id) {
        await handleUpdateUser(id, data);
      } else {
        await handleCreateUser(data);
      }

      showToast({
        color: "success",
        children: `Usuário ${id ? "editado" : "criado"} com sucesso.`,
      });
      onSuccess();
      onCloseModal();
    } catch (error: any) {
      console.error(error);

      const formattedError = getFormattedApiError<"email">(error, "email");

      if (formattedError?.database) {
        showToast({
          color: "error",
          children: formattedError.database,
        });
        return;
      }

      if (formattedError?.validation) {
        setError(formattedError.validation.field, {
          message: formattedError.validation.message,
        });

        return;
      }

      showToast({
        color: "error",
        children:
          "Tivemos um erro interno. Tente novamente mais tarde, por favor.",
      });
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
    handleOnChangeZipCode,
    handleOnChangePhone,
    validatePhone,
    onSubmit,
    loading:
      isLoadingCreateUser ||
      isLoadingUpdateUser ||
      isLoadingCreatePhone ||
      isLoadingUpdatePhone ||
      isLoadingCreateAddress ||
      isLoadingUpdateAddress,
  };
};
