export const REACT_QUERY_KEYS = {
  getUsers: "getUsers",
  getUser: "getUser",
  createUser: "createUser",
  updateUser: "updateUser",
  deleteUser: "deleteUser",
  createPhone: "createPhone",
  updatePhone: "updatePhone",
};

export const INPUT_LENGTHS = {
  required: 1,
  defaultString: 255,
  phoneNumber: 20,
};

export const INPUT_ERROR_MESSAGES = {
  required: "Este campo é obrigatório.",
  maxLength: "Você excedeu o limite de caracteres.",
  email: "Digite um email válido.",
  datePreviousToday: "A data selecionada precisa ser anterior a hoje.",
  invalidPhone: "Digite um número de telefone válido.",
};

export const TAKE = 2;

export const MIN_PAGE_TO_BREAKPOINT = 5;
export const DYNAMIC_PAGES_LENGTH = 3;
export const DYNAMIC_PAGES_LENGTH_2 = 4;

export const DEFAULT_PHONE_COUNTRY_CODE = {
  value: "BR",
  label: "BR",
};
