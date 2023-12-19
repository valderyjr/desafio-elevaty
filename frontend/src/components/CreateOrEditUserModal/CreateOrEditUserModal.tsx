import { useQuery } from "react-query";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Modal, ModalProps } from "../Modal/Modal";
import { useCreateOrEditUserForm } from "./useCreateOrEditUserForm";
import {
  DEFAULT_PHONE_COUNTRY_CODE,
  REACT_QUERY_KEYS,
} from "../../utils/constants";
import { getUser } from "../../services/users";
import { useEffect } from "react";
import { formatStringDateToInput } from "../../utils/date";
import { Select } from "../Select/Select";
import { Controller } from "react-hook-form";

const options = [
  { label: "BR", value: "BR" },
  { label: "US", value: "US" },
];

type CreateOrEditUserModalProps = {
  id?: string;
  refetchUsers: () => void;
} & Omit<ModalProps, "title">;

export const CreateOrEditUserModal = ({
  isOpen,
  onClose,
  id,
  refetchUsers,
}: CreateOrEditUserModalProps) => {
  const {
    data,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQuery({
    queryKey: [REACT_QUERY_KEYS.getUser, id],
    enabled: !!id,
    queryFn: () => getUser(id ?? ""),
  });

  const action = id ? "Editar" : "Criar";

  const handleClose = () => {
    onClose();
    clearErrors();
    reset({
      birthDate: "",
      email: "",
      firstName: "",
      lastName: "",
      countryCode: { label: "BR", value: "BR" },
      number: "",
      phoneId: "",
    });
  };

  const handleSuccess = () => {
    refetchUsers();

    if (id) {
      refetchUser();
    }
  };

  const {
    loading: loadingMutation,
    onSubmit,
    validatePhone,
    handleOnChangePhone,
    hookForm: {
      control,
      handleSubmit,
      register,
      clearErrors,
      reset,
      formState: { errors },
    },
  } = useCreateOrEditUserForm({
    onCloseModal: handleClose,
    id,
    onSuccess: handleSuccess,
  });

  useEffect(() => {
    if (!data || !isOpen) {
      return;
    }

    reset({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      birthDate: formatStringDateToInput(data.birthDate),
      countryCode: {
        value: data.phone?.countryCode ?? DEFAULT_PHONE_COUNTRY_CODE.value,
        label:
          options.find((item) => item.value === data.phone?.countryCode)
            ?.label ?? DEFAULT_PHONE_COUNTRY_CODE.label,
      },
      number: data.phone?.number ?? "",
      phoneId: data.phone?.id ?? "",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`${action} cliente`}>
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          id="create-edit-user/first-name"
          label="Nome"
          isRequired
          inputProps={{ ...register("firstName") }}
          disabled={isLoadingUser}
          error={errors.firstName?.message}
        />
        <Input
          id="create-edit-user/last-name"
          label="Sobrenome"
          isRequired
          disabled={isLoadingUser}
          inputProps={{ ...register("lastName") }}
          error={errors.lastName?.message}
        />
        <Input
          id="create-edit-user/email"
          label="Email"
          isRequired
          disabled={isLoadingUser}
          inputProps={{ type: "email", ...register("email") }}
          error={errors.email?.message}
        />
        <Input
          id="create-edit-user/birth-date"
          label="Data de nascimento"
          isRequired
          disabled={isLoadingUser}
          inputProps={{ type: "date", ...register("birthDate") }}
          error={errors.birthDate?.message}
        />
        <div className="flex w-full gap-2">
          <Controller
            control={control}
            name="countryCode"
            render={({ field: { name, onBlur, onChange, value } }) => (
              <Select
                id="create-edit-user/country-code"
                label="País"
                isRequired
                formName={name}
                onChange={onChange}
                selected={value}
                // @TODO: opcoes
                options={options}
                placeholder="Selecione um país"
                disabled={isLoadingUser}
                error={
                  errors.countryCode?.message ||
                  errors.countryCode?.value?.message
                }
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            name="number"
            render={({ field: { onChange, ...rest } }) => (
              <Input
                id="create-edit-user/number"
                label="Número"
                disabled={isLoadingUser}
                error={errors.number?.message}
                inputProps={{
                  ...rest,
                  inputMode: "numeric",
                  onChange: async (e) => {
                    const { phone } = await handleOnChangePhone(e);
                    onChange(phone);
                  },
                  onBlur: async (e) => {
                    await validatePhone(e.target.value);
                  },
                }}
                isRequired
              />
            )}
          />
        </div>
        <Button type="submit" loading={loadingMutation || isLoadingUser}>
          {action}
        </Button>
      </form>
    </Modal>
  );
};
