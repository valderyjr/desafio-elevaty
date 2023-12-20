export const REACT_QUERY_KEYS = {
  getUsers: "getUsers",
  getUser: "getUser",
  createUser: "createUser",
  updateUser: "updateUser",
  deleteUser: "deleteUser",
  createPhone: "createPhone",
  updatePhone: "updatePhone",
  createAddress: "createAddress",
  updateAddress: "updateAddress",
  createCreditCard: "createCreditCard",
  updateCreditCard: "updateCreditCard",
  deleteCreditCard: "deleteCreditCard",
  getCreditCardInvoice: "getCreditCardInvoice",
};

export const INPUT_LENGTHS = {
  required: 1,
  defaultString: 255,
  phoneNumber: 20,
  zipCode: 9,
  state: 2,
  expirationDate: 4,
};

export const INPUT_ERROR_MESSAGES = {
  required: "Este campo é obrigatório.",
  maxLength: "Você excedeu o limite de caracteres.",
  email: "Digite um email válido.",
  datePreviousToday: "A data selecionada precisa ser anterior a hoje.",
  dateNextMonth: "A data selecionada precisa ser posterior ao mês atual.",
  invalidPhone: "Digite um número de telefone válido.",
  invalidZipCode: "Digite um CEP válido com 8 caracteres.",
  dateMinLength: "Este campo deve possuir no mínimo 4 caracteres.",
};

export const TAKE = 10;

export const MIN_PAGE_TO_BREAKPOINT = 5;
export const DYNAMIC_PAGES_LENGTH = 3;
export const DYNAMIC_PAGES_LENGTH_2 = 4;

export const DEFAULT_PHONE_COUNTRY_CODE = {
  value: "BR",
  label: "BR",
};

export const STATES = [
  { label: "AC", value: "AC" },
  { label: "AL", value: "AL" },
  { label: "AP", value: "AP" },
  { label: "AM", value: "AM" },
  { label: "BA", value: "BA" },
  { label: "CE", value: "CE" },
  { label: "DF", value: "DF" },
  { label: "ES", value: "ES" },
  { label: "GO", value: "GO" },
  { label: "MA", value: "MA" },
  { label: "MT", value: "MT" },
  { label: "MS", value: "MS" },
  { label: "MG", value: "MG" },
  { label: "PA", value: "PA" },
  { label: "PB", value: "PB" },
  { label: "PR", value: "PR" },
  { label: "PE", value: "PE" },
  { label: "PI", value: "PI" },
  { label: "RJ", value: "RJ" },
  { label: "RN", value: "RN" },
  { label: "RS", value: "RS" },
  { label: "RO", value: "RO" },
  { label: "RR", value: "RR" },
  { label: "SC", value: "SC" },
  { label: "SP", value: "SP" },
  { label: "SE", value: "SE" },
  { label: "TO", value: "TO" },
];
