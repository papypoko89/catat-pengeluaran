import { getAllCategories } from "../data/categories";
import {
  Category,
  CategoryComparison,
  CategoryComparisonStatus,
  Expense,
  MonthlySummary,
  PeriodRange,
} from "../types";
import { formatCurrency } from "./formatters";

export function getMonthlyExpenses(expenses: Expense[], selectedMonth: string) {
  return expenses
    .filter((expense) => expense.date.startsWith(selectedMonth))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getExpensesForRange(expenses: Expense[], startDate: string, endDate: string) {
  return expenses
    .filter((expense) => expense.date >= startDate && expense.date <= endDate)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPeriodSummary(
  periodExpenses: Expense[],
  allCategories: Category[],
): MonthlySummary {
  const total = periodExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoriesWithExpenseNames = Array.from(
    new Set([...allCategories.map((category) => category.name), ...periodExpenses.map((expense) => expense.category)]),
  );
  const enrichedCategories = categoriesWithExpenseNames.map(
    (categoryName) =>
      allCategories.find((category) => category.name === categoryName) ?? {
        name: categoryName,
        color: "#64748b",
        softColor: "#f1f5f9",
        icon: allCategories[allCategories.length - 1].icon,
        isCustom: true,
      },
  );
  const categoryTotals = enrichedCategories
    .map((category) => ({
      category,
      total: periodExpenses
        .filter((expense) => expense.category === category.name)
        .reduce((sum, expense) => sum + expense.amount, 0),
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);
  const largestCategory = categoryTotals[0];
  const transactionCount = periodExpenses.length;

  return {
    total,
    categoryTotals,
    largestCategory,
    transactionCount,
    average: transactionCount ? total / transactionCount : 0,
  };
}

export function getMonthlySummary(monthlyExpenses: Expense[]): MonthlySummary {
  return getPeriodSummary(monthlyExpenses, getAllCategories());
}

export function filterExpenses(
  periodExpenses: Expense[],
  categoryFilter: string,
  allCategoriesLabel: string,
  searchQuery: string,
) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return periodExpenses.filter((expense) => {
    const matchesCategory =
      categoryFilter === allCategoriesLabel || expense.category === categoryFilter;
    const searchableText = `${expense.category} ${expense.note} ${expense.date} ${
      expense.amount
    } ${formatCurrency(expense.amount)}`.toLowerCase();
    const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });
}

export function groupExpensesByDate(expenses: Expense[]) {
  return expenses.reduce<Record<string, Expense[]>>((groups, expense) => {
    groups[expense.date] = [...(groups[expense.date] ?? []), expense];
    return groups;
  }, {});
}

function getCategoryTotal(expenses: Expense[], categoryName: string) {
  return expenses
    .filter((expense) => expense.category === categoryName)
    .reduce((sum, expense) => sum + expense.amount, 0);
}

function getComparisonStatus(
  currentTotal: number,
  previousTotal: number,
  difference: number,
): CategoryComparisonStatus {
  if (currentTotal === 0 && previousTotal === 0) return "none";
  if (previousTotal === 0 && currentTotal > 0) return "new";
  if (currentTotal === 0 && previousTotal > 0) return "down";

  const ratio = Math.abs(difference) / previousTotal;
  if (ratio < 0.05) return "stable";
  return difference > 0 ? "up" : "down";
}

export function getCategoryComparisons(
  expenses: Expense[],
  allCategories: Category[],
  periodRange: PeriodRange,
): CategoryComparison[] {
  const currentExpenses = getExpensesForRange(
    expenses,
    periodRange.comparisonCurrentStartDate,
    periodRange.comparisonCurrentEndDate,
  );
  const previousExpenses = getExpensesForRange(
    expenses,
    periodRange.comparisonStartDate,
    periodRange.comparisonEndDate,
  );
  const categoryNames = Array.from(
    new Set([
      ...allCategories.map((category) => category.name),
      ...currentExpenses.map((expense) => expense.category),
      ...previousExpenses.map((expense) => expense.category),
    ]),
  );

  return categoryNames.map((categoryName) => {
    const category =
      allCategories.find((item) => item.name === categoryName) ??
      ({
        name: categoryName,
        color: "#64748b",
        softColor: "#f1f5f9",
        icon: allCategories[allCategories.length - 1].icon,
        isCustom: true,
      } as Category);
    const currentTotal = getCategoryTotal(currentExpenses, categoryName);
    const previousTotal = getCategoryTotal(previousExpenses, categoryName);
    const difference = currentTotal - previousTotal;
    const percentageChange =
      previousTotal === 0 ? null : Math.round((difference / previousTotal) * 100);

    return {
      category,
      currentTotal,
      previousTotal,
      difference,
      percentageChange,
      status: getComparisonStatus(currentTotal, previousTotal, difference),
    };
  });
}
