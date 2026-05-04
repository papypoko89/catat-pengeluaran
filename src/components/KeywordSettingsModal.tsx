import { FormEvent, useMemo, useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { Category, KeywordMap } from "../types";
import { normalizeKeyword } from "../utils/categoryDetection";

type KeywordSettingsModalProps = {
  isOpen: boolean;
  categories: Category[];
  keywordMap: KeywordMap;
  onClose: () => void;
  onChange: (keywordMap: KeywordMap) => void;
};

export function KeywordSettingsModal({
  isOpen,
  categories,
  keywordMap,
  onClose,
  onChange,
}: KeywordSettingsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name ?? "Makanan");
  const [keywordDraft, setKeywordDraft] = useState("");
  const [editingKeyword, setEditingKeyword] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const selectedKeywords = useMemo(
    () => keywordMap[selectedCategory] ?? [],
    [keywordMap, selectedCategory],
  );

  if (!isOpen) return null;

  function upsertKeyword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextKeyword = normalizeKeyword(keywordDraft);
    if (!nextKeyword) {
      setFeedback("Keyword wajib diisi.");
      return;
    }

    const currentKeywords = keywordMap[selectedCategory] ?? [];
    const hasDuplicate = currentKeywords.some(
      (keyword) => keyword === nextKeyword && keyword !== editingKeyword,
    );

    if (hasDuplicate) {
      setFeedback("Keyword ini sudah ada di kategori tersebut.");
      return;
    }

    const nextKeywords = editingKeyword
      ? currentKeywords.map((keyword) => (keyword === editingKeyword ? nextKeyword : keyword))
      : [...currentKeywords, nextKeyword];

    onChange({
      ...keywordMap,
      [selectedCategory]: nextKeywords,
    });
    setKeywordDraft("");
    setEditingKeyword(null);
    setFeedback(editingKeyword ? "Keyword berhasil diperbarui." : "Keyword berhasil ditambahkan.");
  }

  function startEdit(keyword: string) {
    setEditingKeyword(keyword);
    setKeywordDraft(keyword);
    setFeedback("");
  }

  function deleteKeyword(keyword: string) {
    onChange({
      ...keywordMap,
      [selectedCategory]: selectedKeywords.filter((item) => item !== keyword),
    });

    if (editingKeyword === keyword) {
      setEditingKeyword(null);
      setKeywordDraft("");
    }

    setFeedback("Keyword berhasil dihapus.");
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="expense-modal keyword-settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyword-settings-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-grabber" />
        <div className="modal-header">
          <div>
            <span>Setting</span>
            <h2 id="keyword-settings-title">Master Data Keyword Map</h2>
          </div>
          <button className="icon-button subtle" type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="keyword-settings-layout">
          <label>
            <span>Kategori</span>
            <select
              value={selectedCategory}
              onChange={(event) => {
                setSelectedCategory(event.target.value);
                setKeywordDraft("");
                setEditingKeyword(null);
                setFeedback("");
              }}
            >
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <form className="keyword-form" onSubmit={upsertKeyword}>
            <label>
              <span>{editingKeyword ? "Edit keyword" : "Tambah keyword"}</span>
              <input
                type="text"
                placeholder="Contoh: kopi, kfc, listrik"
                value={keywordDraft}
                onChange={(event) => {
                  setKeywordDraft(event.target.value);
                  setFeedback("");
                }}
              />
            </label>
            <button className="secondary-button" type="submit">
              {editingKeyword ? <Save size={17} /> : <Plus size={17} />}
              {editingKeyword ? "Simpan" : "Tambah"}
            </button>
            {editingKeyword && (
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  setEditingKeyword(null);
                  setKeywordDraft("");
                  setFeedback("");
                }}
              >
                Batal
              </button>
            )}
          </form>

          {feedback && <p className="keyword-feedback">{feedback}</p>}

          <div className="keyword-list" aria-label={`Keyword kategori ${selectedCategory}`}>
            {selectedKeywords.length === 0 ? (
              <p className="muted">Belum ada keyword untuk kategori ini.</p>
            ) : (
              selectedKeywords.map((keyword) => (
                <div className="keyword-row" key={keyword}>
                  <span>{keyword}</span>
                  <div>
                    <button
                      className="icon-button subtle"
                      type="button"
                      aria-label={`Edit keyword ${keyword}`}
                      onClick={() => startEdit(keyword)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="icon-button danger"
                      type="button"
                      aria-label={`Hapus keyword ${keyword}`}
                      onClick={() => deleteKeyword(keyword)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
