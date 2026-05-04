import { getAllCategories, normalizeCategory } from "../data/categories";
import {
  Category,
  CategoryComparison,
  CategoryComparisonStatus,
  Expense,
  MonthlySummary,
  PeriodRange,
} from "../types";
import { formatCurrency } from "./formatters";

function getCategoryKey(categoryName: string) {
  return normalizeCategory(categoryName).toLowerCase();
}

function buildCategoryList(allCategories: Category[], expenses: Expense[]) {
  const categoriesByKey = new Map<string, Category>();
  const fallbackIcon = allCategories[allCategories.length - 1].icon;

  allCategories.forEach((category) => {
    categoriesByKey.set(getCategoryKey(category.name), category);
  });

  expenses.forEach((expense) => {
    const categoryName = normalizeCategory(expense.category);
    const categoryKey = getCategoryKey(categoryName);

    if (!categoriesByKey.has(categoryKey)) {
      categoriesByKey.set(categoryKey, {
        name: categoryName,
        color: "#64748b",
        softColor: "#f1f5f9",
        icon: fallbackIcon,
        isCustom: true,
      });
    }
  });

  return Array.from(categoriesByKey.values());
}

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
  const enrichedCategories = buildCategoryList(allCategories, periodExpenses);
  const categoryTotals = enrichedCategories
    .map((category) => ({
      category,
      total: periodExpenses
        .filter((expense) => getCategoryKey(expense.category) === getCategoryKey(category.name))
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
      categoryFilter === allCategoriesLabel ||
      getCategoryKey(expense.category) === getCategoryKey(categoryFilter);
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
  const categoryKey = getCategoryKey(categoryName);

  return expenses
    .filter((expense) => getCategoryKey(expense.category) === categoryKey)
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
  const categories = buildCategoryList(allCategories, [...currentExpenses, ...previousExpenses]);

  return categories.map((category) => {
    const currentTotal = getCategoryTotal(currentExpenses, category.name);
    const previousTotal = getCategoryTotal(previousExpenses, category.name);
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
