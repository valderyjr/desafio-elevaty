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
  const dat = new Date(stringDate.replaceAll("-", "/"));

  // validate if is really a date
  if (isNaN(dat.getTime())) {
    return undefined;
  }

  return dat;
}
