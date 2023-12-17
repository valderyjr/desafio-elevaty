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
  User,
  createUser as createUserMutation,
  updateUser as updateUserMutation,
} from "../../services/users";

interface useCreateOrEditUserFormProps {
  onCloseModal: () => void;
  id?: string;
}

export const useCreateOrEditUserForm = ({
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
    useMutation<User, unknown, Partial<Omit<User, "id">>>({
      mutationKey: [REACT_QUERY_KEYS.updateUser],
      mutationFn: (user) => updateUserMutation(id ?? "", user),
    });

  const updateUser = async (data: UserFormData) => {
    updateUserMutate(data, {
      onSuccess: () => {
        onCloseModal();
      },
      onError: (e) => console.log(e),
    });
  };

  const createUser = async (data: UserFormData) => {
    createUserMutate(data, {
      onSuccess: () => {
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
