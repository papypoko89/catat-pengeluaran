import { Plus, Sparkles, Zap } from "lucide-react";

type EmptyStateProps = {
  onAdd: () => void;
  onDemo: () => void;
};

export function EmptyState({ onAdd, onDemo }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-illustration">
        <Sparkles size={28} />
      </div>
      <h3>Mulai catat pengeluaran pertama kamu</h3>
      <p>Contoh: 35k kopi. Tambahkan transaksi pertama atau gunakan data demo.</p>
      <div className="empty-actions">
        <button className="primary-button" type="button" onClick={onAdd}>
          <Plus size={18} />
          Tambah Pengeluaran
        </button>
        <button className="ghost-button" type="button" onClick={onDemo}>
          <Zap size={18} />
          Demo 3 Bulan
        </button>
      </div>
    </div>
  );
}
