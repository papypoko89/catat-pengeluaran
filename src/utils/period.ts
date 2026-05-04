import { PeriodPreset, PeriodRange, PeriodState } from "../types";
import { currentMonth, formatDate, formatMonth, today } from "./formatters";

const dayInMs = 24 * 60 * 60 * 1000;

function toDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: string, days: number) {
  return toDateInputValue(new Date(toDate(date).getTime() + days * dayInMs));
}

function getDaysInclusive(startDate: string, endDate: string) {
  return Math.max(1, Math.round((toDate(endDate).getTime() - toDate(startDate).getTime()) / dayInMs) + 1);
}

export function getMonthEnd(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return toDateInputValue(new Date(year, monthNumber, 0));
}

export function getMonthStart(month: string) {
  return `${month}-01`;
}

export function getYearStart(year: string) {
  return `${year}-01-01`;
}

export function getYearEnd(year: string) {
  return `${year}-12-31`;
}

export function getPreviousMonth(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return toDateInputValue(new Date(year, monthNumber - 2, 1)).slice(0, 7);
}

function getSameDayInMonth(month: string, day: number) {
  const monthEndDay = Number(getMonthEnd(month).slice(8, 10));
  const safeDay = Math.min(day, monthEndDay);
  return `${month}-${String(safeDay).padStart(2, "0")}`;
}

export function getDefaultPeriod(): PeriodState {
  return {
    mode: "month",
    month: currentMonth,
    year: currentMonth.slice(0, 4),
    startDate: getMonthStart(currentMonth),
    endDate: getMonthEnd(currentMonth),
    preset: "this-month",
  };
}

export function applyPreset(preset: PeriodPreset): PeriodState {
  const currentYear = currentMonth.slice(0, 4);

  if (preset === "last-month") {
    const month = getPreviousMonth(currentMonth);
    return {
      mode: "month",
      month,
      year: month.slice(0, 4),
      startDate: getMonthStart(month),
      endDate: getMonthEnd(month),
      preset,
    };
  }

  if (preset === "this-year") {
    return {
      mode: "year",
      month: currentMonth,
      year: currentYear,
      startDate: getYearStart(currentYear),
      endDate: getYearEnd(currentYear),
      preset,
    };
  }

  if (preset === "last-7-days" || preset === "last-30-days") {
    const days = preset === "last-7-days" ? 6 : 29;
    return {
      mode: "range",
      month: currentMonth,
      year: currentYear,
      startDate: addDays(today, -days),
      endDate: today,
      preset,
    };
  }

  return getDefaultPeriod();
}

export function derivePeriodRange(period: PeriodState): PeriodRange {
  if (period.mode === "year") {
    const startDate = getYearStart(period.year);
    const endDate = getYearEnd(period.year);
    const previousYear = String(Number(period.year) - 1);

    return {
      mode: period.mode,
      startDate,
      endDate,
      label: `Periode: Tahun ${period.year}`,
      comparisonCurrentStartDate: startDate,
      comparisonCurrentEndDate: endDate,
      comparisonStartDate: getYearStart(previousYear),
      comparisonEndDate: getYearEnd(previousYear),
      comparisonHelperText: "Dibandingkan dengan periode sebelumnya.",
    };
  }

  if (period.mode === "range") {
    const startDate = period.startDate <= period.endDate ? period.startDate : period.endDate;
    const endDate = period.startDate <= period.endDate ? period.endDate : period.startDate;
    const days = getDaysInclusive(startDate, endDate);
    const comparisonEndDate = addDays(startDate, -1);
    const comparisonStartDate = addDays(comparisonEndDate, -(days - 1));

    return {
      mode: period.mode,
      startDate,
      endDate,
      label: `Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`,
      comparisonCurrentStartDate: startDate,
      comparisonCurrentEndDate: endDate,
      comparisonStartDate,
      comparisonEndDate,
      comparisonHelperText: "Dibandingkan dengan periode sebelumnya.",
      budgetMonth: startDate.slice(0, 7),
    };
  }

  const month = period.month || currentMonth;
  const previousMonth = getPreviousMonth(month);
  const monthStart = getMonthStart(month);
  const monthEnd = getMonthEnd(month);
  const isCurrentIncompleteMonth = month === currentMonth && today < monthEnd;
  const comparisonDay = Number(today.slice(8, 10));
  const comparisonCurrentEndDate = isCurrentIncompleteMonth ? today : monthEnd;
  const previousComparisonEndDate = isCurrentIncompleteMonth
    ? getSameDayInMonth(previousMonth, comparisonDay)
    : getMonthEnd(previousMonth);

  return {
    mode: "month",
    startDate: monthStart,
    endDate: monthEnd,
    label: `Periode: ${formatDate(monthStart)} - ${formatDate(monthEnd)}`,
    comparisonCurrentStartDate: monthStart,
    comparisonCurrentEndDate,
    comparisonStartDate: getMonthStart(previousMonth),
    comparisonEndDate: previousComparisonEndDate,
    comparisonHelperText: isCurrentIncompleteMonth
      ? "Bulan berjalan - dibandingkan dengan tanggal yang sama di bulan sebelumnya."
      : "Dibandingkan dengan periode sebelumnya.",
    budgetMonth: month,
  };
}

export function getPeriodTitle(period: PeriodState) {
  if (period.mode === "year") return `Tahun ${period.year}`;
  if (period.mode === "range") return `${formatDate(period.startDate)} - ${formatDate(period.endDate)}`;
  return formatMonth(period.month);
}

export function updatePeriodMode(period: PeriodState, mode: PeriodState["mode"]): PeriodState {
  if (mode === "month") {
    return {
      ...period,
      mode,
      preset: "custom",
      startDate: getMonthStart(period.month),
      endDate: getMonthEnd(period.month),
      year: period.month.slice(0, 4),
    };
  }

  if (mode === "year") {
    return {
      ...period,
      mode,
      preset: "custom",
      startDate: getYearStart(period.year),
      endDate: getYearEnd(period.year),
    };
  }

  return {
    ...period,
    mode,
    preset: "custom",
  };
}
