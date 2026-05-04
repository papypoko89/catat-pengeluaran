import { BarChart3 } from "lucide-react";
import { CategoryComparison, CategoryTotal } from "../types";
import { formatCurrency } from "../utils/formatters";

type CategoryChartProps = {
  total: number;
  categoryTotals: CategoryTotal[];
  comparisons: CategoryComparison[];
  comparisonHelperText: string;
};

function getChartBackground(total: number, categoryTotals: CategoryTotal[]) {
  if (categoryTotals.length === 0 || total === 0) {
    return "conic-gradient(#e2e8f0 0deg 360deg)";
  }

  let cursor = 0;
  const segments = categoryTotals.map((item) => {
    const start = cursor;
    const angle = (item.total / total) * 360;
    cursor += angle;
    return `${item.category.color} ${start}deg ${cursor}deg`;
  });

  return `conic-gradient(${segments.join(", ")})`;
}

function getComparisonCopy(comparison: CategoryComparison) {
  if (comparison.status === "new") return "Baru periode ini";
  if (comparison.status === "none") return "Tidak ada pengeluaran";
  if (comparison.status === "stable") return "Stabil vs periode sebelumnya";
  if (comparison.status === "down") {
    const percentage = comparison.percentageChange === null ? 100 : Math.abs(comparison.percentageChange);
    return `Turun ${percentage}% vs periode sebelumnya`;
  }

  return `Naik ${comparison.percentageChange ?? 0}% vs periode sebelumnya`;
}

export function CategoryChart({
  total,
  categoryTotals,
  comparisons,
  comparisonHelperText,
}: CategoryChartProps) {
  const categoryRows = comparisons
    .filter((comparison) => comparison.currentTotal > 0 || comparison.previousTotal > 0)
    .sort((a, b) => b.currentTotal - a.currentTotal || b.previousTotal - a.previousTotal);

  return (
    <article className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <span>Analitik</span>
          <h2>Pengeluaran per Kategori</h2>
          <p>{comparisonHelperText}</p>
        </div>
        <BarChart3 size={22} />
      </div>

      <div className="donut-layout">
        <div className="donut-chart" style={{ background: getChartBackground(total, categoryTotals) }}>
          <div>
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>
        <div className="category-list">
          {categoryRows.length === 0 ? (
            <p className="muted">Belum ada transaksi untuk divisualisasikan.</p>
          ) : (
            categoryRows.map((item) => {
              const percentage = total ? (item.currentTotal / total) * 100 : 0;

              return (
                <div className="category-row" key={item.category.name}>
                  <div className="category-row-header">
                    <span>
                      <i style={{ background: item.category.color }} />
                      {item.category.name}
                    </span>
                    <strong>{formatCurrency(item.currentTotal)}</strong>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                        background: item.category.color,
                      }}
                    />
                  </div>
                  <small>
                    {percentage.toFixed(0)}% dari total periode ini - {getComparisonCopy(item)}
                  </small>
                </div>
              );
            })
          )}
        </div>
      </div>
    </article>
  );
}
