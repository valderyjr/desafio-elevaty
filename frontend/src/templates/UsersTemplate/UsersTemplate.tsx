"use client";

import { useMutation, useQuery } from "react-query";
import { Button } from "../../components/Button/Button";
import { Table, TableColumn } from "../../components/Table/Table";
import { formatStringDate } from "../../utils/date";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CreateOrEditUserModal } from "../../components/CreateOrEditUserModal/CreateOrEditUserModal";
import { REACT_QUERY_KEYS } from "../../utils/constants";
import {
  User,
  deleteUser as deleteUserMutation,
  getUsers,
} from "../../services/users";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";

const renderName = (user: User) => (
  <p
    className="truncate max-w-[200px]"
    title={`${user.firstName} ${user.lastName}`}
  >
    {user.firstName} {user.lastName}
  </p>
);

const renderEmail = (user: User) => (
  <p className="truncate max-w-[200px]" title={user.email}>
    {user.email}
  </p>
);

const renderBirthDate = (user: User) => {
  const formattedDate = formatStringDate(user.birthDate);
  return formattedDate;
};

export const UsersTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userIdToEdit, setUserIdToEdit] = useState("");

  const {
    data,
    isLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: [REACT_QUERY_KEYS.getUsers],
    queryFn: getUsers,
  });

  const { mutate: deleteUser, isLoading: isLoadingDeleteUser } = useMutation({
    mutationKey: [REACT_QUERY_KEYS.deleteUser],
    mutationFn: deleteUserMutation,
  });

  const openModal = (id?: string) => {
    setUserIdToEdit(id ?? "");
    setIsOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id, { onSuccess: () => refetchUsers() });
  };

  const renderAction = (item: User) => {
    return (
      <div className="flex gap-2 items-center">
        <Button
          variant="outlined"
          size="sm"
          title={`Editar o cliente ${item.firstName} ${item.lastName}`}
          loading={isLoadingDeleteUser}
          onClick={() => {
            openModal(item.id);
          }}
        >
          <PencilIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outlined"
          size="sm"
          title={`Excluir o cliente ${item.firstName} ${item.lastName}`}
          loading={isLoadingDeleteUser}
          onClick={() => handleDeleteUser(item.id)}
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const columns: TableColumn<User>[] = [
    {
      property: "firstName",
      title: "Nome completo",
      render: renderName,
    },
    { property: "email", title: "Email", render: renderEmail },
    {
      property: "birthDate",
      title: "Data de nascimento",
      render: renderBirthDate,
    },
    { property: "id", title: "Ações", render: renderAction },
  ];

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        <div className="flex gap-2 justify-between w-full items-center">
          <h1 className="text-xl font-semibold">Clientes</h1>
          <Button onClick={() => openModal()}>
            <PlusCircleIcon className="h-5 w-5 stroke-2" />
            <span>Criar</span>
          </Button>
        </div>
        <Table columns={columns} data={data ?? []} isLoading={isLoading} />
      </div>
      <CreateOrEditUserModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        id={userIdToEdit}
      />
    </>
  );
};
