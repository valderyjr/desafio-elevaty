export function removeNonNumeric(value: string) {
  return value.replace(/\D/g, "");
}

export function formatZipCode(value: string) {
  return removeNonNumeric(value).replace(/(\d{5})(\d)/, "$1-$2");
}

export function formatCreditCardNumber(value: string) {
  const onlyNumbers = removeNonNumeric(value);
  return onlyNumbers.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
}
