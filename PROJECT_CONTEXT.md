# Catat Pengeluaran - Project Context

## Ringkasan

Ini adalah aplikasi web single-page untuk mencatat pengeluaran pribadi/umum. Aplikasi dibuat dengan Vite, React, dan TypeScript. Data transaksi disimpan di browser menggunakan `localStorage`, jadi belum memakai login, database, atau backend.

## Link Penting

- Local dev: http://127.0.0.1:5173/
- GitHub: https://github.com/papypoko89/catat-pengeluaran
- Vercel public: https://catat-pengeluaran-six.vercel.app

## Stack

- Vite
- React
- TypeScript
- CSS biasa di `src/styles.css`
- Icon: `lucide-react`
- Storage: `localStorage`

## Fitur Saat Ini

- Tambah transaksi pengeluaran.
- Data transaksi:
  - tanggal
  - nominal
  - kategori
  - catatan opsional
- Kategori awal:
  - Makanan
  - Transportasi
  - Belanja
  - Tagihan
  - Hiburan
  - Kesehatan
  - Pendidikan
  - Lainnya
- Dashboard default tetap fokus bulan berjalan.
- Period selector mendukung:
  - Bulanan
  - Custom range
  - Tahunan
- Preset cepat periode:
  - Bulan ini
  - Bulan lalu
  - Tahun ini
  - 7 hari terakhir
  - 30 hari terakhir
  - Custom
- Dashboard menampilkan:
  - total pengeluaran
  - sisa budget
  - total transaksi
  - kategori pengeluaran terbesar
  - rata-rata per transaksi
- User dapat set budget per bulan.
- Budget progress bar menampilkan persentase terpakai dan status budget.
- Budget menjadi fokus utama hanya di mode bulanan; custom range/tahunan menampilkan budget sebagai konteks ringan.
- Ringkasan pengeluaran per kategori dengan donut chart CSS dan progress bar.
- Daftar transaksi mengikuti periode aktif dan digrup per tanggal.
- Cari transaksi berdasarkan catatan, kategori, tanggal, atau nominal.
- Filter transaksi berdasarkan kategori.
- Perubahan kategori digabung ke ringkasan kategori, bukan section terpisah.
- Perubahan kategori memakai perbandingan apple-to-apple:
  - mode bulanan berjalan dibanding tanggal yang sama di bulan sebelumnya
  - mode bulanan selesai dibanding full bulan sebelumnya
  - mode tahunan dibanding tahun sebelumnya
  - custom range dibanding range sebelumnya dengan durasi sama
- Row kategori menampilkan nominal, kontribusi total, dan status naik/turun/stabil/baru.
- Quick Add Expense:
  - contoh input `35000 kopi kenangan`
  - mendukung nominal normal seperti `5000`, serta `35k`, `35rb`, `35 rb`, `1.2jt`, `1,2jt`
  - auto-detect kategori dari keyword
  - memberi feedback kategori terdeteksi atau fallback ke `Lainnya`
- Input nominal modal tambah/edit menampilkan separator ribuan Indonesia, misalnya `750.000`, tetapi data tetap disimpan sebagai number.
- Input budget bulanan juga menampilkan separator ribuan Indonesia, misalnya `15.000.000`, tetapi data tetap disimpan sebagai number.
- Custom category:
  - bisa dibuat dari modal tambah/edit transaksi
  - tersimpan di `localStorage`
  - muncul di filter, chart, comparison, dan pilihan kategori
- Learning rule sederhana:
  - jika user edit kategori transaksi, app menyimpan keyword dari catatan ke kategori pilihan
  - rule dipakai lebih dulu saat Quick Add berikutnya
- Hapus transaksi.
- Edit transaksi melalui modal/bottom sheet yang sama dengan tambah transaksi.
- Tambah transaksi melalui modal desktop dan bottom sheet mobile.
- Tombol floating tambah transaksi di mobile.
- Demo data untuk mengisi contoh pengeluaran realistis 3 bulan: Maret, April, Mei 2026.
- Reset semua data lokal dengan konfirmasi.
- Data tetap tersimpan setelah browser di-refresh.

## File Utama

- `src/App.tsx`: orchestrator utama aplikasi, state global, persistensi, dan susunan layout.
- `src/components/`: komponen UI reusable seperti summary card, modal transaksi, chart, dan daftar transaksi.
- `src/data/categories.tsx`: daftar kategori, warna, icon, dan helper kategori.
- `src/utils/`: formatter, periode, parser localStorage, demo data, validasi form, deteksi kategori, dan kalkulasi transaksi.
- `src/types.ts`: tipe data aplikasi.
- `src/styles.css`: semua styling responsive desktop/mobile.
- `src/main.tsx`: entry React.
- `package.json`: script dan dependencies.

## Cara Menjalankan Lokal

Masuk dulu ke folder project:

```powershell
cd "C:\Users\Andika\Documents\New project"
```

Jalankan dev server:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Buka:

```text
http://127.0.0.1:5173/
```

## Cara Build

```powershell
npm.cmd run build
```

## Cara Push Update ke GitHub

```powershell
git status
git add .
git commit -m "Deskripsi perubahan"
git push
```

Setelah `git push`, Vercel akan otomatis deploy ulang karena repo sudah terhubung.

## Catatan untuk Chat Baru

Project ini sudah ada di:

```text
C:\Users\Andika\Documents\New project
```

Jika memulai chat baru, beri instruksi:

```text
Lanjutkan project Catat Pengeluaran di C:\Users\Andika\Documents\New project. Baca PROJECT_CONTEXT.md dulu, lalu bantu revisi fitur/UI.
```

## Ide Revisi Lanjutan

- Tambah export/import CSV.
- Tambah kategori custom.
- Tambah grafik tren pengeluaran.
- Tambah mode pemasukan dan saldo.
- Tambah dark mode.
- Komponen sudah dipisah dari `src/App.tsx`:
  - `SummaryCard`
  - `ExpenseModal`
  - `TransactionList`
  - `CategoryChart`
  - `BudgetProgress`
  - `EmptyState`
  - `PeriodSelector`
  - `QuickAddExpense`
  - `InsightCard`
- Pertimbangkan migrasi desain ke Tailwind/shadcn dan Recharts jika nanti ingin mengikuti brief teknis penuh.
