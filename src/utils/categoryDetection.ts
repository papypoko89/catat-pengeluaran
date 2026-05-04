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

function parseAmountToken(token: string, nextToken?: string) {
  const rawToken = token.toLowerCase().replace(/\s+/g, "");
  const hasThousandSuffix = /(?:k|rb)$/.test(rawToken) || nextToken?.toLowerCase() === "rb";
  const hasMillionSuffix = /jt$/.test(rawToken) || nextToken?.toLowerCase() === "jt";
  const suffixlessToken = rawToken.replace(/(?:k|rb|jt)$/g, "");
  const numericText = hasMillionSuffix
    ? suffixlessToken.replace(",", ".")
    : suffixlessToken.replace(/\./g, "").replace(",", ".");
  const numericValue = Number(numericText);

  if (!Number.isFinite(numericValue) || numericValue <= 0) return null;
  if (hasMillionSuffix) return Math.round(numericValue * 1_000_000);
  if (hasThousandSuffix) return Math.round(numericValue * 1_000);
  return Math.round(numericValue);
}

function extractAmount(input: string) {
  const match = input.match(/(\d+(?:[.,]\d+)?(?:\s?(?:k|rb|jt))?)/i);
  if (!match || match.index === undefined) return null;

  const token = match[0].trim();
  const nextToken = input.slice(match.index + match[0].length).trim().split(/\s+/)[0];
  const amount = parseAmountToken(token, nextToken);
  if (!amount) return null;

  const removeLength =
    nextToken && ["rb", "jt"].includes(nextToken.toLowerCase()) && !/(?:rb|jt)$/i.test(token)
      ? match[0].length + nextToken.length + 1
      : match[0].length;
  const note = `${input.slice(0, match.index)} ${input.slice(match.index + removeLength)}`.trim();

  return {
    amount,
    note: note.replace(/\s+/g, " "),
  };
}

function findRuleCategory(note: string, userCategoryRules: UserCategoryRules) {
  const normalizedNote = normalizeText(note);
  const matchedRule = Object.entries(userCategoryRules)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([keyword]) => normalizedNote.includes(keyword));

  return matchedRule?.[1];
}

export function normalizeKeyword(value: string) {
  return normalizeText(value);
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

  const normalizedNote = normalizeText(note);
  const matchedCategory = Object.entries(keywordMap).find(([, keywords]) =>
    keywords.some((keyword) => normalizedNote.includes(keyword)),
  );

  if (matchedCategory) {
    return {
      category: matchedCategory[0],
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
