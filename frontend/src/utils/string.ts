export function removeNonNumeric(value: string) {
  return value.replace(/\D/g, "");
}

export function formatZipCode(value: string) {
  return removeNonNumeric(value).replace(/(\d{5})(\d)/, "$1-$2");
}
