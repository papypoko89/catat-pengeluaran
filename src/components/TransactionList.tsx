import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { ALL_CATEGORIES } from "../data/categories";
import { Category, Expense } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";
import { groupExpensesByDate } from "../utils/expenseCalculations";
import { EmptyState } from "./EmptyState";

type TransactionListProps = {
  monthlyExpenses: Expense[];
  visibleExpenses: Expense[];
  categories: Category[];
  searchQuery: string;
  categoryFilter: string;
  onSearchChange: (query: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onAdd: () => void;
  onDemo: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
};

export function TransactionList({
  monthlyExpenses,
  visibleExpenses,
  categories,
  searchQuery,
  categoryFilter,
  onSearchChange,
  onCategoryFilterChange,
  onAdd,
  onDemo,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const groupedExpenses = groupExpensesByDate(visibleExpenses);

  return (
    <article className="panel transaction-panel">
      <div className="panel-heading transaction-heading">
        <div>
          <span>Transaksi</span>
          <h2>Daftar Pengeluaran</h2>
          <p>
            Menampilkan {visibleExpenses.length} dari {monthlyExpenses.length} transaksi.
          </p>
        </div>
        <button className="icon-button" type="button" onClick={onAdd}>
          <Plus size={20} />
        </button>
      </div>

      <div className="filter-row">
        <label className="search-field">
          <span>Cari transaksi</span>
          <div className="search-input-wrap">
            <Search size={18} />
            <input
              type="search"
              placeholder="Cari catatan, nominal..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        </label>
        <label>
          <span>Kategori</span>
          <select
            value={categoryFilter}
            onChange={(event) => onCategoryFilterChange(event.target.value)}
          >
            <option value={ALL_CATEGORIES}>{ALL_CATEGORIES}</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {monthlyExpenses.length === 0 ? (
        <EmptyState onAdd={onAdd} onDemo={onDemo} />
      ) : visibleExpenses.length === 0 ? (
        <div className="empty-state small">
          <h3>Tidak ada transaksi yang cocok</h3>
          <p>Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
        </div>
      ) : (
        <div className="transaction-groups">
          {Object.entries(groupedExpenses).map(([date, items]) => (
            <div className="transaction-group" key={date}>
              <div className="date-divider">
                <span>{formatDate(date)}</span>
                <small>{formatCurrency(items.reduce((sum, item) => sum + item.amount, 0))}</small>
              </div>

              {items.map((expense) => {
                const category =
                  categories.find((item) => item.name === expense.category) ??
                  categories[categories.length - 1];

                return (
                  <article className="transaction-item" key={expense.id}>
                    <div
                      className="transaction-category-icon"
                      style={{ background: category.softColor, color: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div className="transaction-main">
                      <strong>{expense.note || "Tanpa catatan"}</strong>
                      <span>{expense.category}</span>
                    </div>
                    <div className="transaction-action">
                      <strong>-{formatCurrency(expense.amount)}</strong>
                      <button
                        className="icon-button subtle"
                        type="button"
                        aria-label={`Edit transaksi ${expense.note || expense.category}`}
                        onClick={() => onEdit(expense)}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        className="icon-button danger"
                        type="button"
                        aria-label={`Hapus transaksi ${expense.note || expense.category}`}
                        onClick={() => onDelete(expense.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
