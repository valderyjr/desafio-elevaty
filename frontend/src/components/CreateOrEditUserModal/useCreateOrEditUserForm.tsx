import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import {
  DEFAULT_PHONE_COUNTRY_CODE,
  INPUT_ERROR_MESSAGES,
  INPUT_LENGTHS,
  REACT_QUERY_KEYS,
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
import { Phone, UpdateMutation, User } from "../../utils/types";
import { ChangeEvent, FocusEvent } from "react";
import {
  AsYouType,
  CountryCode,
  parsePhoneNumberWithError,
} from "libphonenumber-js";

interface useCreateOrEditUserFormProps {
  onCloseModal: () => void;
  onSuccess: () => void;
  id?: string;
}

export const useCreateOrEditUserForm = ({
  onSuccess,
  onCloseModal,
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
    number: z
      .string()
      .min(INPUT_LENGTHS.required, INPUT_ERROR_MESSAGES.required)
      .max(INPUT_LENGTHS.phoneNumber, INPUT_ERROR_MESSAGES.maxLength),
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
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      phoneId: "",
      countryCode: {
        value: DEFAULT_PHONE_COUNTRY_CODE.value,
        label: DEFAULT_PHONE_COUNTRY_CODE.label,
      },
      number: "",
    },
  });

  const { mutateAsync: createUserMutate, isLoading: isLoadingCreateUser } =
    useMutation({
      mutationKey: [REACT_QUERY_KEYS.createUser],
      mutationFn: createUserMutation,
    });

  const { mutateAsync: updateUserMutate, isLoading: isLoadingUpdateUser } =
    useMutation({
      mutationKey: [REACT_QUERY_KEYS.updateUser],
      mutationFn: ({ id, data }: UpdateMutation<User>) =>
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
    const currentValue = getValues("number");
    const value = e.target.value;

    const { phone } = await parsePhone(value, countryCode as CountryCode);

    if (currentValue === phone) {
      return { phone: currentValue.slice(0, -1) };
    }

    return { phone };
  };

  const validatePhone = async (value: string) => {
    if (value.length < INPUT_LENGTHS.required) {
      setError("number", { message: INPUT_ERROR_MESSAGES.required });
      return true;
    }

    if (value.length > INPUT_LENGTHS.phoneNumber) {
      setError("number", { message: INPUT_ERROR_MESSAGES.maxLength });
      return true;
    }

    const countryCode = getValues("countryCode.value");

    const { error } = await parsePhone(value, countryCode as CountryCode);

    if (error) {
      setError("number", { message: INPUT_ERROR_MESSAGES.invalidPhone });
      return true;
    }

    clearErrors("number");
    return false;
  };

  const handlePhoneMutation = async (userId: string, data: UserFormData) => {
    const formattedData = {
      countryCode: data.countryCode.value,
      number: data.number,
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
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      const errorInPhone = await validatePhone(data.number);

      if (errorInPhone) {
        return;
      }

      if (id) {
        await handleUpdateUser(id, data);
      } else {
        await handleCreateUser(data);
      }
      onSuccess();
      onCloseModal();
    } catch (error) {
      console.error(error);
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
    handleOnChangePhone,
    validatePhone,
    onSubmit,
    loading:
      isLoadingCreateUser ||
      isLoadingUpdateUser ||
      isLoadingCreatePhone ||
      isLoadingUpdatePhone,
  };
};
