import { CSSProperties, FormEvent, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { Category, Expense, ExpenseDraft, FormErrors } from "../types";
import { formatNumberInput, onlyDigits } from "../utils/formatters";

type ExpenseModalProps = {
  isOpen: boolean;
  editingExpense: Expense | null;
  draft: ExpenseDraft;
  formErrors: FormErrors;
  categories: Category[];
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDraftChange: (field: keyof ExpenseDraft, value: string) => void;
  onCreateCategory: (name: string) => { ok: boolean; message: string; categoryName?: string };
};

export function ExpenseModal({
  isOpen,
  editingExpense,
  draft,
  formErrors,
  categories,
  onClose,
  onSubmit,
  onDraftChange,
  onCreateCategory,
}: ExpenseModalProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryFeedback, setCategoryFeedback] = useState("");

  if (!isOpen) return null;

  function handleCreateCategory() {
    const result = onCreateCategory(newCategoryName);
    setCategoryFeedback(result.message);

    if (result.ok && result.categoryName) {
      onDraftChange("category", result.categoryName);
      setNewCategoryName("");
      setIsAddingCategory(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="expense-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-grabber" />
        <div className="modal-header">
          <div>
            <span>{editingExpense ? "Edit transaksi" : "Transaksi baru"}</span>
            <h2 id="expense-modal-title">
              {editingExpense ? "Perbarui Pengeluaran" : "Tambah Pengeluaran"}
            </h2>
          </div>
          <button className="icon-button subtle" type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="expense-form" onSubmit={onSubmit}>
          <label className="amount-field">
            <span>Nominal</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={formatNumberInput(draft.amount)}
              onChange={(event) => onDraftChange("amount", onlyDigits(event.target.value))}
              autoFocus
            />
            {formErrors.amount && <small>{formErrors.amount}</small>}
          </label>

          <div className="form-grid">
            <label>
              <span>Tanggal</span>
              <input
                type="date"
                value={draft.date}
                onChange={(event) => onDraftChange("date", event.target.value)}
              />
              {formErrors.date && <small>{formErrors.date}</small>}
            </label>

            <label>
              <span>Catatan</span>
              <input
                type="text"
                placeholder="Contoh: makan siang"
                value={draft.note}
                onChange={(event) => onDraftChange("note", event.target.value)}
              />
              {formErrors.note && <small>{formErrors.note}</small>}
            </label>
          </div>

          <div className="category-picker">
            <span>Kategori</span>
            <div className="category-chip-grid">
              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  className={draft.category === category.name ? "category-option active" : "category-option"}
                  style={
                    {
                      "--category-color": category.color,
                      "--category-soft": category.softColor,
                    } as CSSProperties
                  }
                  onClick={() => onDraftChange("category", category.name)}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
              <button
                type="button"
                className="category-option add-category-option"
                onClick={() => setIsAddingCategory(true)}
              >
                <Plus size={18} />
                Kategori Baru
              </button>
            </div>
            {formErrors.category && <small>{formErrors.category}</small>}
            {isAddingCategory && (
              <div className="new-category-box">
                <label>
                  <span>Nama kategori baru</span>
                  <input
                    type="text"
                    placeholder="Contoh: Operasional"
                    value={newCategoryName}
                    onChange={(event) => {
                      setNewCategoryName(event.target.value);
                      setCategoryFeedback("");
                    }}
                  />
                </label>
                <div className="new-category-actions">
                  <button className="secondary-button" type="button" onClick={handleCreateCategory}>
                    Simpan Kategori
                  </button>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName("");
                      setCategoryFeedback("");
                    }}
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
            {categoryFeedback && <small>{categoryFeedback}</small>}
          </div>

          <div className="modal-actions">
            <button className="ghost-button" type="button" onClick={onClose}>
              Batal
            </button>
            <button className="primary-button" type="submit">
              <Save size={18} />
              {editingExpense ? "Simpan Perubahan" : "Simpan Transaksi"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
