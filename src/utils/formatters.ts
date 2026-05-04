const numberFormatter = new Intl.NumberFormat("id-ID");
const monthFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
});
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function toLocalDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const today = toLocalDateInputValue(new Date());
export const currentMonth = today.slice(0, 7);

export function formatCurrency(value: number) {
  return `Rp ${numberFormatter.format(Math.max(0, Math.round(value)))}`;
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatNumberInput(value: string) {
  const digits = onlyDigits(value);
  if (!digits) return "";

  return numberFormatter.format(Number(digits));
}

export function formatMonth(month: string) {
  return monthFormatter.format(new Date(`${month}-01T00:00:00`));
}

export function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00`));
}
