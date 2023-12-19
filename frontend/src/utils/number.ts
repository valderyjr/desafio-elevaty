export function removeNonNumeric(value: string) {
  return value.replace(/\D/g, "");
}
