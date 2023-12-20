export const API_VALIDATION_ERRORS: { [key in string]: string } = {
  USER_ALREADY_EXISTS: "Este email já pertence a algum usuário cadastrado.",
  INVALID_CREDIT_CARD_EXPIRATION:
    "A validade do cartão de crédito precisa ser posterior ao mês atual.",
  INVALID_CREDIT_CARD_NUMBER: "Número de cartão de crédito inválido.",
};

export const API_DATABASE_ERRORS: { [key in string]: string } = {
  USER_NOT_FOUND: "Não conseguimos encontrar um usuário com este ID.",
  USER_ALREADY_HAS_PHONE:
    "Este usuário já possui um número de telefone cadastrado.",
  PHONE_NOT_FOUND:
    "Não conseguimos encontrar um número de telefone associado a este usuário.",
  USER_ALREADY_HAS_ADDRESS: "Este usuário já possui um endereço cadastrado.",
  ADDRESS_NOT_FOUND:
    "Não conseguimos encontrar um endereço associado a este usuário",
  CREDIT_CARD_NOT_FOUND:
    "Não conseguimos encontrar esse cartão de crédito  associado a este usuário",
  MAX_LENGTH_CREDIT_CARDS_BY_USER:
    "O usuário já atingiu o número máximo de cartões de créditos permitidos. Exclua ou edite um dos já existentes.",
};

type FormattedApiError<T> =
  | {
      validation: {
        field: T;
        message: string;
      };
      database: null;
    }
  | {
      validation: null;
      database: string;
    }
  | void;

export const getFormattedApiError = <T>(
  error: any,
  field: T
): FormattedApiError<T> => {
  const isValidationError =
    error?.message && typeof error.message === "string"
      ? API_VALIDATION_ERRORS[error.message]
      : false;

  const isDatabaseError =
    error?.message && typeof error.message === "string"
      ? API_DATABASE_ERRORS[error.message]
      : false;

  if (isValidationError) {
    return {
      validation: {
        field,
        message: isValidationError,
      },
      database: null,
    };
  }

  if (isDatabaseError) {
    return {
      validation: null,
      database: isDatabaseError,
    };
  }
};
