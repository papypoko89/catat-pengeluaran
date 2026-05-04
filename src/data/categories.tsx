import {
  Car,
  Clapperboard,
  GraduationCap,
  HeartPulse,
  MoreHorizontal,
  ReceiptText,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { Category } from "../types";

export const ALL_CATEGORIES = "Semua Kategori";

export const baseCategories: Category[] = [
  {
    name: "Makanan",
    color: "#f97316",
    softColor: "#fff4e8",
    icon: <Utensils size={18} />,
  },
  {
    name: "Transportasi",
    color: "#0ea5e9",
    softColor: "#eaf7ff",
    icon: <Car size={18} />,
  },
  {
    name: "Belanja",
    color: "#ec4899",
    softColor: "#fff0f8",
    icon: <ShoppingBag size={18} />,
  },
  {
    name: "Tagihan",
    color: "#6366f1",
    softColor: "#f0f1ff",
    icon: <ReceiptText size={18} />,
  },
  {
    name: "Hiburan",
    color: "#a855f7",
    softColor: "#f8f0ff",
    icon: <Clapperboard size={18} />,
  },
  {
    name: "Kesehatan",
    color: "#10b981",
    softColor: "#ecfdf5",
    icon: <HeartPulse size={18} />,
  },
  {
    name: "Pendidikan",
    color: "#f59e0b",
    softColor: "#fffbeb",
    icon: <GraduationCap size={18} />,
  },
  {
    name: "Lainnya",
    color: "#64748b",
    softColor: "#f1f5f9",
    icon: <MoreHorizontal size={18} />,
  },
];

const customCategoryColors = [
  ["#0891b2", "#ecfeff"],
  ["#7c3aed", "#f5f3ff"],
  ["#059669", "#ecfdf5"],
  ["#be123c", "#fff1f2"],
  ["#ca8a04", "#fefce8"],
  ["#475569", "#f8fafc"],
] as const;

export const categories = baseCategories;
export const categoryNames = baseCategories.map((category) => category.name);

const categoryAliases: Record<string, string> = {
  "makanan & minuman": "Makanan",
};

export function normalizeCategory(category: string) {
  const trimmedCategory = category.trim();
  const normalized = categoryAliases[trimmedCategory.toLowerCase()] ?? trimmedCategory;
  return normalized.trim() || "Lainnya";
}

export function getAllCategories(customCategoryNames: string[] = []): Category[] {
  const baseCategoryKeys = new Set(categoryNames.map((category) => category.toLowerCase()));
  const customCategoryMap = new Map<string, string>();

  customCategoryNames.forEach((category) => {
    const normalizedCategory = normalizeCategory(category);
    const categoryKey = normalizedCategory.toLowerCase();

    if (normalizedCategory && !baseCategoryKeys.has(categoryKey) && !customCategoryMap.has(categoryKey)) {
      customCategoryMap.set(categoryKey, normalizedCategory);
    }
  });

  const uniqueCustomNames = Array.from(customCategoryMap.values());
  const customCategories = uniqueCustomNames.map((categoryName, index) => {
    const [color, softColor] = customCategoryColors[index % customCategoryColors.length];

    return {
      name: categoryName,
      color,
      softColor,
      icon: <MoreHorizontal size={18} />,
      isCustom: true,
    };
  });

  return [...baseCategories, ...customCategories];
}

export function getCategory(categoryName: string, customCategoryNames: string[] = []) {
  const allCategories = getAllCategories(customCategoryNames);
  const normalizedName = normalizeCategory(categoryName).toLowerCase();

  return (
    allCategories.find((category) => category.name.toLowerCase() === normalizedName) ??
    allCategories[allCategories.length - 1]
  );
}

export function isDuplicateCategoryName(name: string, customCategoryNames: string[] = []) {
  const normalizedName = normalizeCategory(name).toLowerCase();
  return getAllCategories(customCategoryNames).some(
    (category) => category.name.toLowerCase() === normalizedName,
  );
}
