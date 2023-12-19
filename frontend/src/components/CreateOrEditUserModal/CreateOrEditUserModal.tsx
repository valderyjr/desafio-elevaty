import { useQuery } from "react-query";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Modal, ModalProps } from "../Modal/Modal";
import { useCreateOrEditUserForm } from "./useCreateOrEditUserForm";
import {
  DEFAULT_PHONE_COUNTRY_CODE,
  REACT_QUERY_KEYS,
  STATES,
} from "../../utils/constants";
import { getUser } from "../../services/users";
import { useEffect, useState } from "react";
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
  const [hasSearchedZipCode, setHasSearchedZipCode] = useState(false);

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
      countryCode: DEFAULT_PHONE_COUNTRY_CODE,
      phoneNumber: "",
      phoneId: "",
      city: "",
      complement: "",
      neighborhood: "",
      number: "",
      state: STATES.at(0),
      street: "",
      zipCode: "",
      addressId: "",
    });
    setHasSearchedZipCode(false);
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
    handleOnChangeZipCode,
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
    onSearchZipCode: () => setHasSearchedZipCode(true),
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
      phoneNumber: data.phone?.number ?? "",
      phoneId: data.phone?.id ?? "",
      city: data.address?.city ?? "",
      complement: data.address?.complement ?? "",
      neighborhood: data.address?.neighborhood ?? "",
      number: data.address?.number ?? "",
      state: {
        label:
          STATES.find((state) => state.value === data.address?.state)?.label ??
          STATES.at(0)?.label,
        value:
          STATES.find((state) => state.value === data.address?.state)?.value ??
          STATES.at(0)?.value,
      },
      street: data.address?.street ?? "",
      zipCode: data.address?.zipCode ?? "",
      addressId: data.address?.id ?? "",
    });

    setHasSearchedZipCode(Boolean(data.address?.zipCode));

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
            name="phoneNumber"
            render={({ field: { onChange, ...rest } }) => (
              <Input
                id="create-edit-user/phone-number"
                label="Telefone"
                disabled={isLoadingUser}
                error={errors.phoneNumber?.message}
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
        <div className="flex w-full gap-2">
          <Controller
            control={control}
            name="zipCode"
            render={({ field }) => (
              <Input
                id="create-edit-user/zip-code"
                label="CEP"
                disabled={isLoadingUser}
                error={errors.zipCode?.message}
                inputProps={{
                  ...field,
                  inputMode: "numeric",
                  onChange: async (e) => {
                    await handleOnChangeZipCode(e);
                  },
                }}
                isRequired
              />
            )}
          />
          <Controller
            control={control}
            name="state"
            render={({ field: { name, onBlur, onChange, value } }) => (
              <Select
                id="create-edit-user/state"
                label="Estado"
                isRequired
                formName={name}
                onChange={onChange}
                selected={value}
                options={STATES}
                placeholder="Selecione um estado"
                disabled={isLoadingUser || !hasSearchedZipCode}
                error={errors.state?.message || errors.state?.value?.message}
                onBlur={onBlur}
              />
            )}
          />
        </div>
        <div className="flex w-full gap-2">
          <Input
            id="create-edit-user/city"
            label="Cidade"
            disabled={isLoadingUser || !hasSearchedZipCode}
            error={errors.city?.message}
            inputProps={{
              ...register("city"),
            }}
            isRequired
          />
          <Input
            id="create-edit-user/neighborhood"
            label="Bairro"
            disabled={isLoadingUser || !hasSearchedZipCode}
            error={errors.neighborhood?.message}
            inputProps={{
              ...register("neighborhood"),
            }}
            isRequired
          />
        </div>
        <div className="flex w-full gap-2">
          <Input
            id="create-edit-user/street"
            label="Logradouro"
            disabled={isLoadingUser || !hasSearchedZipCode}
            error={errors.street?.message}
            inputProps={{
              ...register("street"),
            }}
            isRequired
          />
          <Input
            id="create-edit-user/number"
            label="Número"
            disabled={isLoadingUser || !hasSearchedZipCode}
            error={errors.number?.message}
            inputProps={{
              ...register("number"),
            }}
            isRequired
          />
        </div>

        <Input
          id="create-edit-user/complement"
          label="Complemento"
          disabled={isLoadingUser || !hasSearchedZipCode}
          error={errors.complement?.message}
          inputProps={{
            ...register("complement"),
          }}
        />
        <Button type="submit" loading={loadingMutation || isLoadingUser}>
          {action}
        </Button>
      </form>
    </Modal>
  );
};
