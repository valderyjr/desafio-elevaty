export const formatStringDate = (date: String) => {
  const splitIsoDate = date.split("T");
  const splitDate = splitIsoDate.at(0)?.split("-");
  const day = splitDate?.at(2);
  const month = splitDate?.at(1);
  const year = splitDate?.at(0);
  return `${day}/${month}/${year}`;
};
