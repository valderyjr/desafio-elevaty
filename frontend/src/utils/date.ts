export const formatStringDate = (date: string) => {
  const splitIsoDate = date.split("T");
  const splitDate = splitIsoDate.at(0)?.split("-");
  const day = splitDate?.at(2);
  const month = splitDate?.at(1);
  const year = splitDate?.at(0);
  return `${day}/${month}/${year}`;
};

export const formatStringDateToInput = (date: string) => {
  const splitDate = date.split("T");
  return splitDate.at(0);
};

export function parseInputStringToDate(stringDate: string) {
  const date = new Date(stringDate.replaceAll("-", "/"));

  // this validate if is really a date
  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

export function getExpirationValuesFromInput(stringDate: string) {
  const splittedDate = stringDate.split("-");

  const year = splittedDate.at(0) ? Number(splittedDate.at(0)) : undefined;

  const month = splittedDate.at(1) ? Number(splittedDate.at(1)) - 1 : undefined;

  return { year, month };
}

export function parseExpirationValuesToInput(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}
