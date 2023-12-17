"use client";

import { useQuery } from "react-query";
import { Button } from "../../components/Button/Button";
import { Table, TableColumn } from "../../components/Table/Table";
import { formatStringDate } from "../../utils/date";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CreateOrEditUserModal } from "../../components/CreateOrEditUserModal/CreateOrEditUserModal";
import { REACT_QUERY_KEYS } from "../../utils/constants";
import { User, getUsers } from "../../services/users";

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

  const { data, isLoading } = useQuery({
    queryKey: [REACT_QUERY_KEYS.getUsers],
    queryFn: getUsers,
  });

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
    { property: "id", title: "Ações" },
  ];

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        <div className="flex gap-2 justify-between w-full items-center">
          <h1 className="text-xl font-semibold">Clientes</h1>
          <Button onClick={() => setIsOpen((prev) => !prev)}>
            <PlusCircleIcon className="h-5 w-5 stroke-2" />
            <span>Criar</span>
          </Button>
        </div>
        <Table columns={columns} data={data ?? []} isLoading={isLoading} />
      </div>
      <CreateOrEditUserModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
