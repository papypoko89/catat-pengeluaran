import { ExpenseDraft, FormErrors } from "../types";
import { currentMonth, today } from "./formatters";

export function getInitialDraft(month: string): ExpenseDraft {
  const draftDate = month === currentMonth ? today : `${month}-01`;
  return {
    date: draftDate,
    amount: "",
    category: "Makanan",
    note: "",
  };
}

export function validateDraft(draft: ExpenseDraft): FormErrors {
  const errors: FormErrors = {};
  const numericAmount = Number(draft.amount);

  if (!draft.amount.trim()) {
    errors.amount = "Nominal wajib diisi.";
  } else if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    errors.amount = "Masukkan nominal yang lebih dari Rp 0.";
  }

  if (!draft.date) errors.date = "Tanggal wajib dipilih.";
  if (!draft.category) errors.category = "Pilih salah satu kategori.";
  if (!draft.note.trim()) errors.note = "Tambahkan catatan singkat agar mudah diingat.";

  return errors;
}
