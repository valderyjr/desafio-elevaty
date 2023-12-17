import { useQuery } from "react-query";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Modal, ModalProps } from "../Modal/Modal";
import { useCreateOrEditUserForm } from "./useCreateOrEditUserForm";
import { REACT_QUERY_KEYS } from "../../utils/constants";
import { getUser } from "../../services/users";
import { useEffect } from "react";
import { formatStringDateToInput } from "../../utils/date";

type CreateOrEditUserModalProps = { id?: string } & Omit<ModalProps, "title">;

export const CreateOrEditUserModal = ({
  isOpen,
  onClose,
  id,
}: CreateOrEditUserModalProps) => {
  const {
    data,
    error,
    isLoading: isLoadingUser,
  } = useQuery({
    queryKey: [REACT_QUERY_KEYS.getUser],
    enabled: !!id,
    queryFn: () => {
      return getUser(id ?? "");
    },
  });

  const action = id ? "Editar" : "Criar";

  const handleClose = () => {
    onClose();
    clearErrors();
    reset();
  };

  const {
    loading: loadingMutation,
    onSubmit,
    hookForm: {
      handleSubmit,
      register,
      clearErrors,
      reset,
      formState: { errors },
    },
  } = useCreateOrEditUserForm({ onCloseModal: handleClose, id });

  useEffect(() => {
    if (!data) {
      return;
    }

    reset({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      birthDate: formatStringDateToInput(data.birthDate),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
        <Button type="submit" loading={loadingMutation || isLoadingUser}>
          {action}
        </Button>
      </form>
    </Modal>
  );
};
