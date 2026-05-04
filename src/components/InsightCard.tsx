import { CircleAlert, Sparkles, Zap } from "lucide-react";
import { MonthlySummary } from "../types";
import { formatCurrency, formatMonth } from "../utils/formatters";

type InsightCardProps = {
  summary: MonthlySummary;
  monthlyBudget: number;
  selectedMonth: string;
  currentComparisonTotal: number;
  previousTotal: number;
  onDemo: () => void;
};

function getSpendingChangeInsight(currentTotal: number, previousTotal: number) {
  if (currentTotal === 0 && previousTotal === 0) {
    return "Belum ada pengeluaran di periode ini dan periode sebelumnya.";
  }

  if (previousTotal === 0) {
    return `Pengeluaran periode ini mulai tercatat sebesar ${formatCurrency(currentTotal)}.`;
  }

  const change = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
  if (Math.abs(change) < 5) return "Pengeluaran relatif stabil dibanding periode sebelumnya.";
  if (change > 0) return `Pengeluaran naik ${change}% dibanding periode sebelumnya.`;

  return `Pengeluaran turun ${Math.abs(change)}% dibanding periode sebelumnya.`;
}

function getBudgetStatusInsight(total: number, monthlyBudget: number, selectedMonth: string) {
  if (monthlyBudget <= 0) {
    return "Atur budget untuk melihat status sisa dana secara otomatis.";
  }

  const budgetPercentage = Math.round((total / monthlyBudget) * 100);
  const status =
    budgetPercentage < 70 ? "Aman" : budgetPercentage <= 100 ? "Waspada" : "Melebihi budget";

  return `${status}: ${budgetPercentage}% dari budget ${formatMonth(selectedMonth)} sudah terpakai.`;
}

export function InsightCard({
  summary,
  monthlyBudget,
  selectedMonth,
  currentComparisonTotal,
  previousTotal,
  onDemo,
}: InsightCardProps) {
  const topCategoryInsight = summary.largestCategory
    ? `Kategori terbesar periode ini: ${summary.largestCategory.category.name}.`
    : "Belum ada kategori dominan di periode ini.";

  return (
    <section className="insight-card">
      <div className="insight-icon">
        {monthlyBudget > 0 && summary.total > monthlyBudget ? (
          <CircleAlert size={22} />
        ) : (
          <Sparkles size={22} />
        )}
      </div>
      <div className="insight-copy">
        <strong>{getSpendingChangeInsight(currentComparisonTotal, previousTotal)}</strong>
        <p>{topCategoryInsight}</p>
        <p>{getBudgetStatusInsight(summary.total, monthlyBudget, selectedMonth)}</p>
      </div>
      <button className="ghost-button compact" type="button" onClick={onDemo}>
        <Zap size={17} />
        Demo 3 Bulan
      </button>
    </section>
  );
}
