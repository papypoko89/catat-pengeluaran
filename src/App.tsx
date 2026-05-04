import {
  BarChart3,
  CalendarDays,
  PiggyBank,
  Plus,
  ReceiptText,
  RotateCcw,
  Save,
  Wallet,
  Zap,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { BudgetProgress } from "./components/BudgetProgress";
import { CategoryChart } from "./components/CategoryChart";
import { ExpenseModal } from "./components/ExpenseModal";
import { InsightCard } from "./components/InsightCard";
import { PeriodSelector } from "./components/PeriodSelector";
import { QuickAddExpense } from "./components/QuickAddExpense";
import { SummaryCard } from "./components/SummaryCard";
import { TransactionList } from "./components/TransactionList";
import {
  ALL_CATEGORIES,
  baseCategories,
  getAllCategories,
  isDuplicateCategoryName,
  normalizeCategory,
} from "./data/categories";
import { Expense, ExpenseDraft, FormErrors } from "./types";
import { getLearningKeyword, parseQuickAddInput } from "./utils/categoryDetection";
import { buildThreeMonthDemoExpenses, demoBudgets, demoMonths } from "./utils/demoData";
import {
  filterExpenses,
  getCategoryComparisons,
  getExpensesForRange,
  getPeriodSummary,
} from "./utils/expenseCalculations";
import { getInitialDraft, validateDraft } from "./utils/expenseForm";
import {
  currentMonth,
  formatCurrency,
  formatNumberInput,
  onlyDigits,
  today,
} from "./utils/formatters";
import { derivePeriodRange, getDefaultPeriod, getPeriodTitle } from "./utils/period";
import {
  BUDGETS_STORAGE_KEY,
  CATEGORY_RULES_STORAGE_KEY,
  CUSTOM_CATEGORIES_STORAGE_KEY,
  EXPENSES_STORAGE_KEY,
  parseStoredBudgets,
  parseStoredCategoryRules,
  parseStoredCustomCategories,
  parseStoredExpenses,
} from "./utils/storage";

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    parseStoredExpenses(localStorage.getItem(EXPENSES_STORAGE_KEY)),
  );
  const [budgets, setBudgets] = useState<Record<string, number>>(() =>
    parseStoredBudgets(localStorage.getItem(BUDGETS_STORAGE_KEY)),
  );
  const [customCategories, setCustomCategories] = useState<string[]>(() =>
    parseStoredCustomCategories(localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY)),
  );
  const [categoryRules, setCategoryRules] = useState<Record<string, string>>(() =>
    parseStoredCategoryRules(localStorage.getItem(CATEGORY_RULES_STORAGE_KEY)),
  );
  const [period, setPeriod] = useState(getDefaultPeriod);
  const [budgetDraft, setBudgetDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [draft, setDraft] = useState<ExpenseDraft>(() => getInitialDraft(currentMonth));
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(customCategories));
  }, [customCategories]);

  useEffect(() => {
    localStorage.setItem(CATEGORY_RULES_STORAGE_KEY, JSON.stringify(categoryRules));
  }, [categoryRules]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", isExpenseModalOpen);
    return () => document.body.classList.remove("modal-open");
  }, [isExpenseModalOpen]);

  const periodRange = useMemo(() => derivePeriodRange(period), [period]);
  const activeBudgetMonth = periodRange.budgetMonth ?? currentMonth;
  const allCategories = useMemo(() => {
    const existingCategoryNames = expenses
      .map((expense) => expense.category)
      .filter((category) => !baseCategories.some((baseCategory) => baseCategory.name === category));

    return getAllCategories([...customCategories, ...existingCategoryNames]);
  }, [customCategories, expenses]);

  useEffect(() => {
    setBudgetDraft(budgets[activeBudgetMonth] ? String(budgets[activeBudgetMonth]) : "");
  }, [activeBudgetMonth, budgets]);

  const periodExpenses = useMemo(
    () => getExpensesForRange(expenses, periodRange.startDate, periodRange.endDate),
    [expenses, periodRange.endDate, periodRange.startDate],
  );
  const summary = useMemo(
    () => getPeriodSummary(periodExpenses, allCategories),
    [allCategories, periodExpenses],
  );
  const visibleExpenses = useMemo(
    () => filterExpenses(periodExpenses, categoryFilter, ALL_CATEGORIES, searchQuery),
    [categoryFilter, periodExpenses, searchQuery],
  );
  const categoryComparisons = useMemo(
    () => getCategoryComparisons(expenses, allCategories, periodRange),
    [allCategories, expenses, periodRange],
  );

  const activeBudget = budgets[activeBudgetMonth] ?? 0;
  const remainingBudget = activeBudget - summary.total;
  const isMonthlyMode = periodRange.mode === "month";

  function handlePeriodChange(nextPeriod: typeof period) {
    setPeriod(nextPeriod);
    setSearchQuery("");
    setCategoryFilter(ALL_CATEGORIES);
  }

  function openCreateModal() {
    setEditingExpense(null);
    const defaultDraft = getInitialDraft(activeBudgetMonth);
    setDraft({
      ...defaultDraft,
      date:
        today >= periodRange.startDate && today <= periodRange.endDate
          ? today
          : periodRange.startDate,
    });
    setFormErrors({});
    setIsExpenseModalOpen(true);
  }

  function openEditModal(expense: Expense) {
    setEditingExpense(expense);
    setDraft({
      date: expense.date,
      amount: String(expense.amount),
      category: expense.category,
      note: expense.note,
    });
    setFormErrors({});
    setIsExpenseModalOpen(true);
  }

  function closeExpenseModal() {
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
    setFormErrors({});
  }

  function updateDraft(field: keyof ExpenseDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: field === "amount" ? onlyDigits(value) : value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleExpenseSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateDraft(draft);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const nextExpense: Expense = {
      id: editingExpense?.id ?? crypto.randomUUID(),
      date: draft.date,
      amount: Math.round(Number(draft.amount)),
      category: draft.category,
      note: draft.note.trim(),
    };

    setExpenses((current) =>
      editingExpense
        ? current.map((expense) => {
            if (expense.id !== editingExpense.id) return expense;

            if (expense.category !== nextExpense.category) {
              learnCategoryRule(nextExpense.note, nextExpense.category);
            }

            return nextExpense;
          })
        : [nextExpense, ...current],
    );
    closeExpenseModal();
  }

  function handleBudgetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericBudget = Number(budgetDraft);
    if (!Number.isFinite(numericBudget) || numericBudget < 0) return;

    setBudgets((current) => ({
      ...current,
      [activeBudgetMonth]: Math.round(numericBudget),
    }));
  }

  function handleDelete(id: string) {
    const target = expenses.find((expense) => expense.id === id);
    const description = target?.note || target?.category || "transaksi ini";

    if (!window.confirm(`Hapus ${description}? Tindakan ini tidak bisa dibatalkan.`)) return;

    setExpenses((current) => current.filter((expense) => expense.id !== id));
  }

  function handleDemoData() {
    const demoExpenses = buildThreeMonthDemoExpenses();

    setExpenses((current) => [
      ...demoExpenses,
      ...current.filter(
        (expense) => !demoMonths.some((month) => expense.id.startsWith(`demo-${month}-`)),
      ),
    ]);
    setBudgets((current) => ({
      ...current,
      ...Object.fromEntries(
        Object.entries(demoBudgets).map(([month, budget]) => [month, current[month] ?? budget]),
      ),
    }));
  }

  function handleResetData() {
    if (
      !window.confirm(
        "Reset semua transaksi dan budget lokal? Data yang dihapus tidak bisa dikembalikan.",
      )
    ) {
      return;
    }

    setExpenses([]);
    setBudgets({});
    setCustomCategories([]);
    setCategoryRules({});
    setSearchQuery("");
    setCategoryFilter(ALL_CATEGORIES);
  }

  function learnCategoryRule(note: string, category: string) {
    const keyword = getLearningKeyword(note);
    if (!keyword || category === "Lainnya") return;

    setCategoryRules((current) => ({
      ...current,
      [keyword]: category,
    }));
  }

  function handleQuickAdd(value: string) {
    const result = parseQuickAddInput(value, customCategories, categoryRules);
    if (!result.ok) return result;

    const expense: Expense = {
      id: crypto.randomUUID(),
      amount: result.amount,
      category: result.category,
      note: result.note,
      date:
        today >= periodRange.startDate && today <= periodRange.endDate
          ? today
          : periodRange.startDate,
    };

    setExpenses((current) => [expense, ...current]);

    return {
      ok: true,
      message: `Transaksi berhasil ditambahkan. ${result.message}`,
    };
  }

  function handleCreateCategory(name: string) {
    const categoryName = normalizeCategory(name);

    if (!categoryName) {
      return { ok: false, message: "Nama kategori wajib diisi." };
    }

    if (isDuplicateCategoryName(categoryName, customCategories)) {
      return { ok: false, message: "Kategori dengan nama ini sudah ada." };
    }

    setCustomCategories((current) => [...current, categoryName]);

    return {
      ok: true,
      message: "Kategori baru berhasil dibuat.",
      categoryName,
    };
  }

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Pencatat Pengeluaran</p>
          <h1>Pantau pengeluaran bulanan dengan lebih rapi.</h1>
          <p>
            Dashboard personal yang ringan, cepat dipakai, dan tetap tersimpan di browser tanpa
            login.
          </p>
        </div>

        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={openCreateModal}>
            <Plus size={19} />
            Tambah Pengeluaran
          </button>
        </div>
      </section>

      <PeriodSelector period={period} onChange={handlePeriodChange} />
      <QuickAddExpense onQuickAdd={handleQuickAdd} />

      <section className="dashboard-grid">
        <article className="hero-card">
          <div className="hero-card-top">
            <div>
              <span>Total Pengeluaran</span>
              <strong>{formatCurrency(summary.total)}</strong>
              <small>{getPeriodTitle(period)}</small>
            </div>
            <div className="hero-card-icon">
              <Wallet size={28} />
            </div>
          </div>

          {isMonthlyMode ? (
            <BudgetProgress total={summary.total} budget={activeBudget} />
          ) : (
            <div className="budget-context">
              <span>Budget bulanan sebagai konteks</span>
              <strong>{formatCurrency(activeBudget)}</strong>
              <p>Mode ini fokus pada total periode, bukan progress budget bulanan.</p>
            </div>
          )}

          {isMonthlyMode && (
            <form className="budget-form" onSubmit={handleBudgetSubmit}>
              <label>
                <span>Budget bulanan</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Contoh: 3500000"
                  value={formatNumberInput(budgetDraft)}
                  onChange={(event) => setBudgetDraft(onlyDigits(event.target.value))}
                />
              </label>
              <button className="secondary-button" type="submit">
                <Save size={17} />
                Simpan
              </button>
            </form>
          )}
        </article>

        <div className="summary-grid" aria-label="Ringkasan bulan ini">
          {isMonthlyMode ? (
            <SummaryCard
              label="Sisa Budget"
              value={
                activeBudget > 0
                  ? remainingBudget >= 0
                    ? formatCurrency(remainingBudget)
                    : `-${formatCurrency(Math.abs(remainingBudget))}`
                  : "Belum diatur"
              }
              helper={
                activeBudget === 0
                  ? "Tambahkan budget bulan ini"
                  : remainingBudget >= 0
                    ? "Masih aman untuk bulan ini"
                    : "Melewati budget bulan ini"
              }
              icon={<PiggyBank size={21} />}
            />
          ) : (
            <SummaryCard
              label="Mode Rekap"
              value={periodRange.mode === "year" ? "Tahunan" : "Custom"}
              helper={periodRange.label.replace("Periode: ", "")}
              icon={<PiggyBank size={21} />}
            />
          )}
          <SummaryCard
            label="Kategori Terbesar"
            value={summary.largestCategory?.category.name ?? "-"}
            helper={
              summary.largestCategory
                ? formatCurrency(summary.largestCategory.total)
                : "Belum ada data"
            }
            icon={<BarChart3 size={21} />}
          />
          <SummaryCard
            label="Jumlah Transaksi"
            value={String(summary.transactionCount)}
            helper="Transaksi bulan ini"
            icon={<ReceiptText size={21} />}
          />
          <SummaryCard
            label="Rata-rata"
            value={formatCurrency(summary.average)}
            helper="Per transaksi"
            icon={<CalendarDays size={21} />}
          />
        </div>
      </section>

      <InsightCard
        summary={summary}
        monthlyBudget={isMonthlyMode ? activeBudget : 0}
        selectedMonth={activeBudgetMonth}
        onDemo={handleDemoData}
      />

      <section className="content-grid">
        <CategoryChart
          total={summary.total}
          categoryTotals={summary.categoryTotals}
          comparisons={categoryComparisons}
          comparisonHelperText={periodRange.comparisonHelperText}
        />
        <TransactionList
          monthlyExpenses={periodExpenses}
          visibleExpenses={visibleExpenses}
          categories={allCategories}
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          onSearchChange={setSearchQuery}
          onCategoryFilterChange={setCategoryFilter}
          onAdd={openCreateModal}
          onDemo={handleDemoData}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </section>

      <div className="utility-actions">
        <button className="ghost-button" type="button" onClick={handleDemoData}>
          <Zap size={17} />
          Demo 3 Bulan
        </button>
        <button className="danger-button" type="button" onClick={handleResetData}>
          <RotateCcw size={17} />
          Reset Data
        </button>
      </div>

      <button className="mobile-fab" type="button" onClick={openCreateModal}>
        <Plus size={22} />
        Tambah
      </button>

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        editingExpense={editingExpense}
        draft={draft}
        formErrors={formErrors}
        categories={allCategories}
        onClose={closeExpenseModal}
        onSubmit={handleExpenseSubmit}
        onDraftChange={updateDraft}
        onCreateCategory={handleCreateCategory}
      />
    </main>
  );
}

export default App;
