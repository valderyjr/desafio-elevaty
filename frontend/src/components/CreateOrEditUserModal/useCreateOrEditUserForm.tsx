import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import {
  INPUT_ERROR_MESSAGES,
  INPUT_LENGTHS,
  REACT_QUERY_KEYS,
} from "../../utils/constants";
import { parseInputStringToDate } from "../../utils/date";
import {
  createUser as createUserMutation,
  updateUser as updateUserMutation,
} from "../../services/users";
import { UpdateUserMutation } from "../../utils/types";

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
  });

  type UserFormData = z.infer<typeof userSchema>;

  const { register, handleSubmit, formState, control, clearErrors, reset } =
    useForm<UserFormData>({
      resolver: zodResolver(userSchema),
      mode: "onBlur",
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
      },
    });

  const { mutate: createUserMutate, isLoading: isLoadingCreateUser } =
    useMutation({
      mutationKey: [REACT_QUERY_KEYS.createUser],
      mutationFn: createUserMutation,
    });

  const { mutate: updateUserMutate, isLoading: isLoadingUpdateUser } =
    useMutation({
      mutationKey: [REACT_QUERY_KEYS.updateUser],
      mutationFn: ({ id, user }: UpdateUserMutation) =>
        updateUserMutation(id, user),
    });

  const updateUser = async (data: UserFormData) => {
    updateUserMutate(
      { id: id ?? "", user: data },
      {
        onSuccess: () => {
          onSuccess();
          onCloseModal();
        },
        onError: (e) => console.log(e),
      }
    );
  };

  const createUser = async (data: UserFormData) => {
    createUserMutate(data, {
      onSuccess: () => {
        onSuccess();
        onCloseModal();
      },
      onError: (e) => console.log(e),
    });
  };

  const onSubmit = async (data: UserFormData) => {
    if (id) {
      await updateUser(data);
    } else {
      await createUser(data);
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
    loading: isLoadingCreateUser,
  };
};
