import { normalizeCategory } from "../data/categories";
import { Expense, KeywordMap } from "../types";
import { normalizeKeyword } from "./categoryDetection";

export const EXPENSES_STORAGE_KEY = "catat-pengeluaran.expenses";
export const BUDGETS_STORAGE_KEY = "catat-pengeluaran.budgets";
export const CUSTOM_CATEGORIES_STORAGE_KEY = "catat-pengeluaran.custom-categories";
export const CATEGORY_RULES_STORAGE_KEY = "catat-pengeluaran.category-rules";
export const KEYWORD_MAP_STORAGE_KEY = "catat-pengeluaran.keyword-map";

export function parseStoredExpenses(value: string | null): Expense[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as Expense[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item) =>
          typeof item.id === "string" &&
          typeof item.date === "string" &&
          typeof item.amount === "number" &&
          typeof item.category === "string" &&
          typeof item.note === "string",
      )
      .map((item) => ({
        ...item,
        amount: Math.max(0, Math.round(item.amount)),
        category: normalizeCategory(item.category),
      }));
  } catch {
    return [];
  }
}

export function parseStoredCustomCategories(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as string[];
    if (!Array.isArray(parsed)) return [];

    return Array.from(
      new Set(
        parsed
          .filter((item) => typeof item === "string")
          .map((item) => normalizeCategory(item))
          .filter(Boolean),
      ),
    );
  } catch {
    return [];
  }
}

export function parseStoredCategoryRules(value: string | null): Record<string, string> {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value) as Record<string, string>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(
          ([keyword, category]) =>
            typeof keyword === "string" &&
            keyword.trim().length > 0 &&
            typeof category === "string" &&
            category.trim().length > 0,
        )
        .map(([keyword, category]) => [keyword.trim().toLowerCase(), normalizeCategory(category)]),
    );
  } catch {
    return {};
  }
}

export function parseStoredKeywordMap(value: string | null): KeywordMap | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as KeywordMap;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([category, keywords]) => typeof category === "string" && Array.isArray(keywords))
        .map(([category, keywords]) => [
          normalizeCategory(category),
          Array.from(
            new Set(
              keywords
                .filter((keyword) => typeof keyword === "string")
                .map((keyword) => normalizeKeyword(keyword))
                .filter(Boolean),
            ),
          ),
        ]),
    );
  } catch {
    return null;
  }
}

export function parseStoredBudgets(value: string | null): Record<string, number> {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value) as Record<string, number>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([month, amount]) => /^\d{4}-\d{2}$/.test(month) && typeof amount === "number",
      ),
    );
  } catch {
    return {};
  }
}
