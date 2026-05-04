import { FormEvent, useState } from "react";
import { Sparkles, Zap } from "lucide-react";

type QuickAddResult = {
  ok: boolean;
  message: string;
};

type QuickAddExpenseProps = {
  onQuickAdd: (value: string) => QuickAddResult;
};

export function QuickAddExpense({ onQuickAdd }: QuickAddExpenseProps) {
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<QuickAddResult | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = onQuickAdd(value);
    setFeedback(result);

    if (result.ok) {
      setValue("");
    }
  }

  return (
    <section className="quick-add-card" aria-label="Tambah pengeluaran cepat">
      <div className="quick-add-copy">
        <div className="quick-add-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <strong>Quick Add</strong>
          <p>Tulis satu baris, nominal dan kategori akan dibaca otomatis.</p>
        </div>
      </div>

      <form className="quick-add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Contoh: 35000 kopi kenangan"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button className="primary-button" type="submit">
          <Zap size={17} />
          Tambah Cepat
        </button>
      </form>

      {feedback && (
        <p className={feedback.ok ? "quick-add-feedback success" : "quick-add-feedback warning"}>
          {feedback.message}
        </p>
      )}
    </section>
  );
}
