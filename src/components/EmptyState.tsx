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
      <h3>Mulai catat pengeluaran pertamamu</h3>
      <p>
        Tambahkan transaksi atau gunakan data demo untuk melihat dashboard lengkap dalam beberapa
        detik.
      </p>
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
