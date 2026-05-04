import { CircleAlert, Sparkles, Zap } from "lucide-react";
import { MonthlySummary } from "../types";
import { formatMonth } from "../utils/formatters";

type InsightCardProps = {
  summary: MonthlySummary;
  monthlyBudget: number;
  selectedMonth: string;
  onDemo: () => void;
};

export function InsightCard({ summary, monthlyBudget, selectedMonth, onDemo }: InsightCardProps) {
  const budgetPercentage =
    monthlyBudget > 0 ? Math.round((summary.total / monthlyBudget) * 100) : 0;

  return (
    <section className="insight-card">
      <div className="insight-icon">
        {monthlyBudget > 0 && summary.total > monthlyBudget ? (
          <CircleAlert size={22} />
        ) : (
          <Sparkles size={22} />
        )}
      </div>
      <div>
        <strong>
          {summary.largestCategory
            ? `Pengeluaran terbesar bulan ini: ${summary.largestCategory.category.name}`
            : "Belum ada pola pengeluaran bulan ini"}
        </strong>
        <p>
          {monthlyBudget > 0
            ? `Kamu sudah memakai ${budgetPercentage}% dari budget ${formatMonth(selectedMonth)}.`
            : "Atur budget untuk melihat status sisa dana secara otomatis."}
        </p>
      </div>
      <button className="ghost-button compact" type="button" onClick={onDemo}>
        <Zap size={17} />
        Demo 3 Bulan
      </button>
    </section>
  );
}
