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
  - Makanan & Minuman
  - Transportasi
  - Belanja
  - Tagihan
  - Hiburan
  - Kesehatan
  - Pendidikan
  - Lainnya
- Filter rekap:
  - harian
  - bulanan
  - tahunan
- Dashboard menampilkan:
  - total pengeluaran
  - total transaksi
  - kategori pengeluaran terbesar
- Ringkasan pengeluaran per kategori dengan progress bar.
- Daftar transaksi mengikuti filter periode.
- Hapus transaksi.
- Edit transaksi langsung di kartu/item transaksi, bukan melalui form tambah.
- Data tetap tersimpan setelah browser di-refresh.

## File Utama

- `src/App.tsx`: semua logic aplikasi, state, filter, rekap, tambah/edit/hapus transaksi.
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

- Tambah fitur pencarian transaksi.
- Tambah export/import CSV.
- Tambah kategori custom.
- Tambah budget per kategori.
- Tambah grafik tren pengeluaran.
- Tambah mode pemasukan dan saldo.
- Tambah dark mode.
- Tambah konfirmasi sebelum hapus transaksi.
- Tambah reset semua data.
