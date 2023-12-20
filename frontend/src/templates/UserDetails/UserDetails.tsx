"use client";
import { useQuery } from "react-query";
import { User } from "../../utils/types";
import {
  DIAL_CODES_BY_COUNTRY,
  INPUT_LENGTHS,
  REACT_QUERY_KEYS,
} from "../../utils/constants";
import { getUser } from "../../services/users";
import {
  formatStringDate,
  parseExpirationValuesToInput,
} from "../../utils/date";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { CreditCard } from "../../components/CreditCard/CreditCard";
import { CreditCardActions } from "../../components/CreditCard/CreditCardActions";
import { useCreditCardForm } from "./useCreditCardForm";
import { Controller } from "react-hook-form";
import { removeNonNumeric } from "../../utils/string";
import { useMemo } from "react";

type UserDetailsProps = {
  id: string;
  initialData: User;
};

const getPhoneContent = (user: User) => {
  if (!user.phone) {
    return "Não informado.";
  }

  const dialCode =
    DIAL_CODES_BY_COUNTRY.find(
      (country) => country.value === user.phone?.countryCode
    )?.label ?? user.phone.countryCode;
  return `${dialCode} ${user.phone.number}`;
};

const getAddressContent = (user: User) => {
  if (!user.address) {
    return "Não informado.";
  }
  return `${user.address.street}, ${user.address.number}, ${
    user.address.neighborhood
  }${user.address.complement ? `, ${user.address.complement}.` : "."} ${
    user.address.city
  } - ${user.address.state}. ${user.address.zipCode}`;
};

export const UserDetails = ({ id, initialData }: UserDetailsProps) => {
  const { data: user, refetch } = useQuery({
    queryKey: [REACT_QUERY_KEYS.getUser, id],
    queryFn: () => getUser(id),
    initialData: initialData,
  });

  const {
    loading,
    onClickToEdit,
    onClickToDelete,
    onClickToGetInvoice,
    onSubmit,
    hookForm: {
      control,
      formState: { errors },
      handleSubmit,
      register,
    },
  } = useCreditCardForm({ userId: id, onSuccess: refetch });

  const minExpirationDate = useMemo(() => {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    return parseExpirationValuesToInput(today.getFullYear(), today.getMonth());
  }, []);

  if (!user) {
    return <></>;
  }

  const personalInfos = [
    { title: "Email", content: user?.email },
    { title: "Data de nascimento", content: formatStringDate(user?.birthDate) },
    { title: "Telefone", content: getPhoneContent(user) },
    { title: "Endereço", content: getAddressContent(user) },
  ];

  return (
    <div className="w-full flex flex-col gap-3">
      <Link
        href={"/"}
        className="font-semibold text-base gap-1 hover:underline flex items-center w-fit"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Voltar
      </Link>
      <h1 className="text-3xl font-bold">
        {user.firstName} {user.lastName}
      </h1>

      <section className="w-full h-full flex gap-3 lg:flex-row flex-col">
        <div className="w-full bg-gray-200 flex flex-col rounded p-4 gap-1">
          <h2 className="font-bold text-xl mb-1">Informações pessoais</h2>
          {personalInfos.map((info) => (
            <p className="text-sm" key={`personal-info-${info.title}`}>
              <b>{info.title}: </b>
              {info.content}
            </p>
          ))}
        </div>
        <div className="w-full bg-gray-200 flex flex-col rounded p-4 gap-1">
          <h2 className="font-bold text-xl mb-1">Criar cartão</h2>
          <form
            className="w-full flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="number"
              render={({ field: { onChange, ...rest } }) => (
                <Input
                  id="credit-card/number"
                  label="Número do cartão"
                  isRequired
                  inputProps={{
                    ...rest,
                    inputMode: "numeric",
                    onChange: (e) => onChange(removeNonNumeric(e.target.value)),
                    maxLength: INPUT_LENGTHS.defaultString,
                  }}
                  error={errors.number?.message}
                />
              )}
            />
            <div className="flex w-full gap-2 flex-col md:flex-row">
              <Input
                id="credit-card/brand"
                label="Bandeira"
                isRequired
                inputProps={{
                  ...register("brand"),
                  maxLength: INPUT_LENGTHS.defaultString,
                }}
                error={errors.brand?.message}
              />
              <Input
                id="credit-card/expiration"
                label="Data de validade"
                isRequired
                inputProps={{
                  ...register("expiration"),
                  type: "month",
                  min: minExpirationDate,
                }}
                error={errors.expiration?.message}
              />
            </div>
            <Button type="submit" variant="primary" loading={loading}>
              Adicionar
            </Button>
          </form>
          <h3 className="font-bold text-xl mt-4 mb-1">Cartões</h3>
          {Boolean(user.creditCards.length) ? (
            <div className="flex w-full gap-2 gap-y-6 flex-wrap">
              {user.creditCards.map((creditCard) => (
                <article
                  key={`credit-card-${creditCard.id}`}
                  className="w-full sm:w-[calc(50%_-.5rem)] flex flex-col gap-2"
                >
                  <CreditCard
                    brand={creditCard.brand}
                    expirationMonth={creditCard.expirationMonth}
                    expirationYear={creditCard.expirationYear}
                    number={creditCard.number}
                  />

                  <CreditCardActions
                    loading={loading}
                    onDelete={() => {
                      onClickToDelete(creditCard.id);
                    }}
                    onEdit={() => {
                      onClickToEdit(creditCard);
                    }}
                    onGetInvoice={() => {
                      onClickToGetInvoice(creditCard.id);
                    }}
                  />
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm">
              O usuário não possui nenhum cartão cadastrado.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
