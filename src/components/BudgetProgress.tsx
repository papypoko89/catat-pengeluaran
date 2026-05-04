import { formatCurrency } from "../utils/formatters";

type BudgetProgressProps = {
  total: number;
  budget: number;
};

export function BudgetProgress({ total, budget }: BudgetProgressProps) {
  const percentage = budget > 0 ? Math.min((total / budget) * 100, 140) : 0;
  const displayedPercentage = budget > 0 ? Math.round((total / budget) * 100) : 0;
  const isOverBudget = budget > 0 && total > budget;

  return (
    <div className="budget-progress">
      <div className="budget-progress-copy">
        <span>Progress budget</span>
        <strong>{budget > 0 ? `${displayedPercentage}% terpakai` : "Belum ada budget"}</strong>
      </div>
      <div className="budget-track">
        <div
          className={isOverBudget ? "budget-fill is-over" : "budget-fill"}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className={isOverBudget ? "budget-note is-over" : "budget-note"}>
        {budget === 0
          ? "Atur budget bulanan untuk melihat sisa dana."
          : isOverBudget
            ? `Lewat ${formatCurrency(total - budget)}. Tenang, masih bisa dirapikan.`
            : `Sisa budget ${formatCurrency(budget - total)} untuk bulan ini.`}
      </p>
    </div>
  );
}
