import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  Pencil,
  Plus,
  ReceiptText,
  Save,
  Tags,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Expense = {
  id: string;
  date: string;
  amount: number;
  category: string;
  note: string;
};

type ExpenseDraft = Omit<Expense, "id" | "amount"> & {
  amount: string;
};

type FilterMode = "day" | "month" | "year";

const STORAGE_KEY = "catat-pengeluaran.expenses";

const CATEGORIES = [
  "Makanan & Minuman",
  "Transportasi",
  "Belanja",
  "Tagihan",
  "Hiburan",
  "Kesehatan",
  "Pendidikan",
  "Lainnya",
];

const categoryColors: Record<string, string> = {
  "Makanan & Minuman": "#f97316",
  Transportasi: "#0ea5e9",
  Belanja: "#ec4899",
  Tagihan: "#6366f1",
  Hiburan: "#a855f7",
  Kesehatan: "#10b981",
  Pendidikan: "#f59e0b",
  Lainnya: "#64748b",
};

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const today = new Date().toISOString().slice(0, 10);
const currentMonth = today.slice(0, 7);
const currentYear = today.slice(0, 4);

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function parseStoredExpenses(value: string | null): Expense[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as Expense[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        typeof item.id === "string" &&
        typeof item.date === "string" &&
        typeof item.amount === "number" &&
        typeof item.category === "string" &&
        typeof item.note === "string",
    );
  } catch {
    return [];
  }
}

function getFilterDefault(mode: FilterMode) {
  if (mode === "day") return today;
  if (mode === "month") return currentMonth;
  return currentYear;
}

function matchesFilter(expense: Expense, mode: FilterMode, value: string) {
  if (mode === "day") return expense.date === value;
  if (mode === "month") return expense.date.startsWith(value);
  return expense.date.startsWith(value);
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    parseStoredExpenses(localStorage.getItem(STORAGE_KEY)),
  );
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [note, setNote] = useState("");
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<ExpenseDraft | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>("month");
  const [filterValue, setFilterValue] = useState(currentMonth);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => matchesFilter(expense, filterMode, filterValue))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, filterMode, filterValue]);

  const summary = useMemo(() => {
    const categoryTotals = CATEGORIES.map((item) => ({
      category: item,
      total: filteredExpenses
        .filter((expense) => expense.category === item)
        .reduce((sum, expense) => sum + expense.amount, 0),
    }))
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total);

    const total = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const largestCategory = categoryTotals[0];

    return {
      total,
      transactionCount: filteredExpenses.length,
      largestCategory,
      categoryTotals,
    };
  }, [filteredExpenses]);

  const filterLabel =
    filterMode === "day"
      ? "Tanggal"
      : filterMode === "month"
        ? "Bulan"
        : "Tahun";

  function handleFilterModeChange(mode: FilterMode) {
    setFilterMode(mode);
    setFilterValue(getFilterDefault(mode));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericAmount = Number(amount);
    if (!date || !category || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      date,
      amount: Math.round(numericAmount),
      category,
      note: note.trim(),
    };

    setExpenses((current) => [expense, ...current]);
    setAmount("");
    setNote("");
  }

  function handleEdit(expense: Expense) {
    setEditingExpenseId(expense.id);
    setEditingDraft({
      date: expense.date,
      amount: String(expense.amount),
      category: expense.category,
      note: expense.note,
    });
  }

  function updateEditingDraft(field: keyof ExpenseDraft, value: string) {
    setEditingDraft((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );
  }

  function handleSaveEdit(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    if (!editingDraft) return;

    const numericAmount = Number(editingDraft.amount);
    if (
      !editingDraft.date ||
      !editingDraft.category ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return;
    }

    setExpenses((current) =>
      current.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              date: editingDraft.date,
              amount: Math.round(numericAmount),
              category: editingDraft.category,
              note: editingDraft.note.trim(),
            }
          : expense,
      ),
    );
    handleCancelEdit();
  }

  function handleCancelEdit() {
    setEditingExpenseId(null);
    setEditingDraft(null);
  }

  function handleDelete(id: string) {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
    if (editingExpenseId === id) {
      handleCancelEdit();
    }
  }

  return (
    <main className="app-shell">
      <section className="topbar" aria-label="Ringkasan aplikasi">
        <div>
          <p className="eyebrow">Catatan Pengeluaran</p>
          <h1>Tracking pengeluaran harian, bulanan, dan tahunan</h1>
        </div>
        <div className="period-control">
          <div className="segmented" aria-label="Pilih periode rekap">
            {(["day", "month", "year"] as FilterMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                className={filterMode === mode ? "active" : ""}
                onClick={() => handleFilterModeChange(mode)}
              >
                {mode === "day" ? "Harian" : mode === "month" ? "Bulanan" : "Tahunan"}
              </button>
            ))}
          </div>
          <label>
            <span>{filterLabel}</span>
            <input
              type={filterMode === "day" ? "date" : filterMode === "month" ? "month" : "number"}
              min={filterMode === "year" ? "2000" : undefined}
              max={filterMode === "year" ? "2100" : undefined}
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="summary-grid" aria-label="Ringkasan pengeluaran">
        <article className="summary-card primary">
          <div className="icon-box">
            <CircleDollarSign size={22} />
          </div>
          <div>
            <span>Total Pengeluaran</span>
            <strong>{formatCurrency(summary.total)}</strong>
          </div>
        </article>
        <article className="summary-card">
          <div className="icon-box">
            <ReceiptText size={22} />
          </div>
          <div>
            <span>Total Transaksi</span>
            <strong>{summary.transactionCount}</strong>
          </div>
        </article>
        <article className="summary-card">
          <div className="icon-box">
            <Tags size={22} />
          </div>
          <div>
            <span>Kategori Terbesar</span>
            <strong>{summary.largestCategory?.category ?? "-"}</strong>
          </div>
        </article>
      </section>

      <section className="workspace-grid">
        <form className="expense-form" onSubmit={handleSubmit}>
          <div className="section-heading">
            <WalletCards size={22} />
            <h2>Tambah Pengeluaran</h2>
          </div>

          <label>
            <span>Tanggal</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>

          <label>
            <span>Nominal</span>
            <input
              type="number"
              min="1"
              inputMode="numeric"
              placeholder="Contoh: 50000"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>

          <label>
            <span>Kategori</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Catatan</span>
            <input
              type="text"
              placeholder="Opsional"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>

          <div className="form-actions">
            <button className="submit-button" type="submit">
              <Plus size={20} />
              Tambah Transaksi
            </button>
          </div>
        </form>

        <section className="category-panel" aria-label="Ringkasan kategori">
          <div className="section-heading">
            <ChartNoAxesColumnIncreasing size={22} />
            <h2>Pengeluaran per Kategori</h2>
          </div>

          {summary.categoryTotals.length === 0 ? (
            <div className="empty-state">Belum ada pengeluaran pada periode ini.</div>
          ) : (
            <div className="category-list">
              {summary.categoryTotals.map((item) => {
                const percentage = summary.total ? (item.total / summary.total) * 100 : 0;
                return (
                  <div className="category-row" key={item.category}>
                    <div className="category-row-header">
                      <span>
                        <i style={{ background: categoryColors[item.category] }} />
                        {item.category}
                      </span>
                      <strong>{formatCurrency(item.total)}</strong>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${percentage}%`,
                          background: categoryColors[item.category],
                        }}
                      />
                    </div>
                    <small>{percentage.toFixed(0)}% dari total periode</small>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>

      <section className="transaction-panel" aria-label="Daftar transaksi">
        <div className="section-heading transaction-heading">
          <CalendarDays size={22} />
          <h2>Daftar Transaksi</h2>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="empty-state">Tidak ada transaksi yang cocok dengan filter.</div>
        ) : (
          <div className="transaction-list">
            {filteredExpenses.map((expense) => (
              <article
                className={`transaction-item ${
                  editingExpenseId === expense.id ? "is-editing" : ""
                }`}
                key={expense.id}
              >
                {editingExpenseId === expense.id && editingDraft ? (
                  <form
                    className="transaction-edit-form"
                    onSubmit={(event) => handleSaveEdit(event, expense.id)}
                  >
                    <label>
                      <span>Tanggal</span>
                      <input
                        type="date"
                        value={editingDraft.date}
                        onChange={(event) => updateEditingDraft("date", event.target.value)}
                      />
                    </label>
                    <label>
                      <span>Nominal</span>
                      <input
                        type="number"
                        min="1"
                        inputMode="numeric"
                        value={editingDraft.amount}
                        onChange={(event) => updateEditingDraft("amount", event.target.value)}
                      />
                    </label>
                    <label>
                      <span>Kategori</span>
                      <select
                        value={editingDraft.category}
                        onChange={(event) => updateEditingDraft("category", event.target.value)}
                      >
                        {CATEGORIES.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Catatan</span>
                      <input
                        type="text"
                        value={editingDraft.note}
                        onChange={(event) => updateEditingDraft("note", event.target.value)}
                      />
                    </label>
                    <div className="inline-edit-actions">
                      <button className="save-inline-button" type="submit" title="Simpan edit">
                        <Save size={18} />
                        Simpan
                      </button>
                      <button
                        className="secondary-button"
                        type="button"
                        title="Batal edit"
                        onClick={handleCancelEdit}
                      >
                        <X size={18} />
                        Batal
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="transaction-main">
                      <span className="category-chip">
                        <i style={{ background: categoryColors[expense.category] }} />
                        {expense.category}
                      </span>
                      <strong>{expense.note || "Tanpa catatan"}</strong>
                      <small>{dateFormatter.format(new Date(`${expense.date}T00:00:00`))}</small>
                    </div>
                    <div className="transaction-action">
                      <strong>{formatCurrency(expense.amount)}</strong>
                      <button
                        className="edit-button"
                        type="button"
                        aria-label={`Edit transaksi ${expense.note || expense.category}`}
                        title="Edit transaksi"
                        onClick={() => handleEdit(expense)}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="delete-button"
                        type="button"
                        aria-label={`Hapus transaksi ${expense.note || expense.category}`}
                        title="Hapus transaksi"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
