import { es } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns";

export const timeAgo = (date: any) => {
  const distance = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: es,
  });
  return distance;
};

export const formatDate = (date: any, short: boolean) => {
  const formattedDate = format(new Date(date), short ? 'dd/MM/yyyy' : 'HH:mm - d MMMM yyyy', {
    locale: es,
  });
  return formattedDate;
};
