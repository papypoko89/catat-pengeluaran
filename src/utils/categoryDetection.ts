import { ALL_CATEGORIES, getAllCategories, normalizeCategory } from "../data/categories";
import { KeywordMap, UserCategoryRules } from "../types";

export const defaultKeywordMap: KeywordMap = {
  Makanan: [
    "makan",
    "nasi",
    "ayam",
    "kopi",
    "kfc",
    "mcd",
    "mcdonald",
    "gorengan",
    "tahu",
    "tempe",
    "cafe",
    "restoran",
    "resto",
    "gofood",
    "grabfood",
    "snack",
    "minum",
    "roti",
    "bakso",
    "mie",
  ],
  Transportasi: [
    "bensin",
    "parkir",
    "tol",
    "gojek",
    "grab",
    "taxi",
    "taksi",
    "mrt",
    "bus",
    "kereta",
    "ojol",
  ],
  Belanja: [
    "shopee",
    "tokopedia",
    "lazada",
    "tiktok shop",
    "baju",
    "celana",
    "sepatu",
    "barang",
    "marketplace",
    "ace",
    "hardware",
  ],
  Tagihan: ["listrik", "air", "pdam", "internet", "wifi", "pulsa", "token", "pln", "telkom", "indihome"],
  Hiburan: ["bioskop", "netflix", "spotify", "game", "nonton", "konser", "tiket"],
  Kesehatan: ["obat", "dokter", "klinik", "rumah sakit", "vitamin", "apotek", "lab"],
  Pendidikan: ["buku", "kursus", "sekolah", "kuliah", "kelas", "seminar", "training"],
};

type QuickAddParseResult =
  | {
      ok: true;
      amount: number;
      note: string;
      category: string;
      detectedFrom: "user-rule" | "keyword" | "fallback";
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeAmountText(value: string, hasSuffix: boolean) {
  const compactValue = value.replace(/\s+/g, "");
  const decimalSeparatorCount = (compactValue.match(/[.,]/g) ?? []).length;

  if (hasSuffix) {
    return compactValue.replace(",", ".");
  }

  if (decimalSeparatorCount > 1) {
    return compactValue.replace(/[.,]/g, "");
  }

  const separatorMatch = compactValue.match(/[.,]/);
  if (!separatorMatch) return compactValue;

  const [, fraction = ""] = compactValue.split(separatorMatch[0]);
  return fraction.length === 3 ? compactValue.replace(/[.,]/g, "") : compactValue.replace(",", ".");
}

function cleanParsedNote(value: string) {
  return value
    .replace(/\b(?:rp|rupiah)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAmountToken(token: string) {
  try {
    const rawToken = token.toLowerCase().replace(/\s+/g, "");
    const suffixMatch = rawToken.match(/(ribu|rb|k|jt)$/);
    const suffix = suffixMatch?.[1] ?? "";
    const numericToken = rawToken.replace(/(ribu|rb|k|jt)$/g, "");
    const numericValue = Number(normalizeAmountText(numericToken, Boolean(suffix)));

    if (!Number.isFinite(numericValue) || numericValue <= 0) return null;
    if (["k", "rb", "ribu"].includes(suffix)) return Math.round(numericValue * 1_000);
    if (suffix === "jt") return Math.round(numericValue * 1_000_000);
    return Math.round(numericValue);
  } catch {
    return null;
  }
}

function extractAmount(input: string) {
  try {
    const normalizedInput = input.replace(/\s+/g, " ").trim();
    const amountPattern = /\d+(?:[.,]\d+)*(?:\s*(?:ribu|rb|k|jt))?/i;
    const match = normalizedInput.match(amountPattern);
    if (!match || match.index === undefined) return null;

    const token = match[0].trim();
    const amount = parseAmountToken(token);
    if (!amount) return null;

    const note = cleanParsedNote(`${normalizedInput.slice(0, match.index)} ${normalizedInput.slice(
      match.index + match[0].length,
    )}`);

    return {
      amount,
      note,
    };
  } catch {
    return null;
  }
}

function findRuleCategory(note: string, userCategoryRules: UserCategoryRules) {
  const normalizedNote = normalizeText(note);
  const matchedRule = Object.entries(userCategoryRules)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([keyword]) => matchesKeyword(normalizedNote, keyword));

  return matchedRule?.[1];
}

export function normalizeKeyword(value: string) {
  return normalizeText(value);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesKeyword(normalizedNote: string, keyword: string) {
  const normalizedKeyword = normalizeKeyword(keyword);
  if (!normalizedKeyword) return false;

  const boundaryPattern = new RegExp(
    `(^|[^a-z0-9])${escapeRegExp(normalizedKeyword)}([^a-z0-9]|$)`,
    "i",
  );

  return boundaryPattern.test(normalizedNote);
}

function findKeywordCategory(note: string, keywordMap: KeywordMap) {
  const normalizedNote = normalizeText(note);
  const keywordEntries = Object.entries(keywordMap).flatMap(([category, keywords]) =>
    keywords
      .map((keyword) => normalizeKeyword(keyword))
      .filter(Boolean)
      .map((keyword) => ({
        category: normalizeCategory(category),
        keyword,
      })),
  );

  const matchedKeyword = keywordEntries
    .sort((a, b) => b.keyword.length - a.keyword.length)
    .find(({ keyword }) => matchesKeyword(normalizedNote, keyword));

  return matchedKeyword?.category;
}

export function mergeKeywordMapWithCategories(keywordMap: KeywordMap, categoryNames: string[]) {
  return categoryNames.reduce<KeywordMap>(
    (current, categoryName) => ({
      ...current,
      [categoryName]: current[categoryName] ?? [],
    }),
    { ...keywordMap },
  );
}

export function detectCategory(
  note: string,
  userCategoryRules: UserCategoryRules,
  keywordMap: KeywordMap,
) {
  const ruleCategory = findRuleCategory(note, userCategoryRules);
  if (ruleCategory) {
    return {
      category: normalizeCategory(ruleCategory),
      detectedFrom: "user-rule" as const,
    };
  }

  const matchedCategory = findKeywordCategory(note, keywordMap);

  if (matchedCategory) {
    return {
      category: matchedCategory,
      detectedFrom: "keyword" as const,
    };
  }

  return {
    category: "Lainnya",
    detectedFrom: "fallback" as const,
  };
}

export function parseQuickAddInput(
  input: string,
  customCategoryNames: string[],
  userCategoryRules: UserCategoryRules,
  keywordMap: KeywordMap,
): QuickAddParseResult {
  const amountResult = extractAmount(input);
  if (!amountResult) {
    return {
      ok: false,
      message: "Tulis nominal di awal atau dalam kalimat, misalnya 35000 kopi.",
    };
  }

  const note = amountResult.note || "Tanpa catatan";
  const detected = detectCategory(note, userCategoryRules, keywordMap);
  const allCategoryNames = getAllCategories(customCategoryNames).map((category) => category.name);
  const category = allCategoryNames.includes(detected.category) ? detected.category : ALL_CATEGORIES;
  const finalCategory = category === ALL_CATEGORIES ? "Lainnya" : category;

  return {
    ok: true,
    amount: amountResult.amount,
    note,
    category: finalCategory,
    detectedFrom: detected.detectedFrom,
    message:
      detected.detectedFrom === "fallback"
        ? "Kategori belum terdeteksi. Disimpan sebagai Lainnya, bisa diedit nanti."
        : `Terdeteksi sebagai ${finalCategory}.`,
  };
}

const ignoredWords = new Set([
  "dan",
  "di",
  "ke",
  "dari",
  "untuk",
  "yang",
  "dengan",
  "atau",
  "tanpa",
  "catatan",
]);

export function getLearningKeyword(note: string) {
  const words = normalizeText(note)
    .split(" ")
    .map((word) => word.replace(/[^a-z0-9]/g, ""))
    .filter((word) => word.length >= 3 && !ignoredWords.has(word));

  return words.slice(0, 2).join(" ") || words[0] || "";
}
