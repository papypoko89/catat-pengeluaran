import { ReactNode } from "react";

export type Expense = {
  id: string;
  date: string;
  amount: number;
  category: string;
  note: string;
};

export type ExpenseDraft = {
  date: string;
  amount: string;
  category: string;
  note: string;
};

export type FormErrors = Partial<Record<keyof ExpenseDraft, string>>;

export type Category = {
  name: string;
  color: string;
  softColor: string;
  icon: ReactNode;
  isCustom?: boolean;
};

export type CategoryTotal = {
  category: Category;
  total: number;
};

export type MonthlySummary = {
  total: number;
  categoryTotals: CategoryTotal[];
  largestCategory?: CategoryTotal;
  transactionCount: number;
  average: number;
};

export type PeriodMode = "month" | "range" | "year";

export type PeriodPreset =
  | "this-month"
  | "last-month"
  | "this-year"
  | "last-7-days"
  | "last-30-days"
  | "custom";

export type PeriodState = {
  mode: PeriodMode;
  month: string;
  year: string;
  startDate: string;
  endDate: string;
  preset: PeriodPreset;
};

export type PeriodRange = {
  mode: PeriodMode;
  startDate: string;
  endDate: string;
  label: string;
  comparisonCurrentStartDate: string;
  comparisonCurrentEndDate: string;
  comparisonStartDate: string;
  comparisonEndDate: string;
  comparisonHelperText: string;
  budgetMonth?: string;
};

export type CategoryComparisonStatus =
  | "up"
  | "down"
  | "stable"
  | "new"
  | "none";

export type CategoryComparison = {
  category: Category;
  currentTotal: number;
  previousTotal: number;
  difference: number;
  percentageChange: number | null;
  status: CategoryComparisonStatus;
};

export type UserCategoryRules = Record<string, string>;

export type KeywordMap = Record<string, string[]>;
