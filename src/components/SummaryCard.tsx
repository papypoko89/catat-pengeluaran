import { ReactNode } from "react";

type SummaryCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
};

export function SummaryCard({ label, value, helper, icon }: SummaryCardProps) {
  return (
    <article className="summary-card">
      <div className="summary-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </article>
  );
}
