# Prompt Review & Optimasi Aplikasi Catat Pengeluaran

Gunakan dokumen ini sebagai prompt untuk meminta ChatGPT melakukan review dan memberi rekomendasi optimasi terhadap aplikasi **Catat Pengeluaran**.

## Konteks Project

Saya sedang membangun aplikasi web single-page bernama **Catat Pengeluaran**.

Aplikasi ini adalah expense tracker sederhana untuk mencatat dan merekap pengeluaran pribadi/umum. Scope aplikasi sengaja dibuat ringan, tanpa login, tanpa backend, tanpa database server, dan tanpa fitur akuntansi kompleks.

Stack saat ini:

- Vite
- React
- TypeScript
- CSS biasa di `src/styles.css`
- `lucide-react`
- `localStorage`
- Deploy ke Vercel

Data disimpan lokal di browser menggunakan `localStorage`.

## Tujuan Aplikasi

Membantu user mencatat pengeluaran harian dengan cepat, lalu memahami rekap pengeluaran berdasarkan periode, kategori, budget, dan perubahan dibanding periode sebelumnya.

Target UX:

- Mudah dipakai harian
- Mobile-first
- Cepat untuk input transaksi
- Dashboard langsung terbaca dalam 5 detik
- UI terasa clean, modern, dan premium
- Tetap simple, bukan accounting app

## Fitur Inti Saat Ini

- Tambah transaksi pengeluaran
- Edit transaksi
- Hapus transaksi
- Data transaksi:
  - tanggal
  - nominal
  - kategori
  - catatan opsional
- Dashboard default bulan berjalan
- Selector periode:
  - Bulanan
  - Custom range
  - Tahunan
- Preset periode:
  - Bulan ini
  - Bulan lalu
  - Tahun ini
  - 7 hari terakhir
  - 30 hari terakhir
  - Custom
- Set budget bulanan
- Summary dashboard:
  - Total pengeluaran
  - Sisa budget
  - Jumlah transaksi
  - Kategori terbesar
  - Rata-rata transaksi
- Budget progress bar
- Ringkasan pengeluaran per kategori
- Donut chart CSS
- Daftar transaksi digrup berdasarkan tanggal
- Search transaksi
- Filter transaksi berdasarkan kategori
- Demo data 3 bulan: Maret, April, Mei 2026
- Reset data lokal
- Persist data di `localStorage`

## Fitur Unggulan Saat Ini

- Quick Add Expense
  - Contoh input:
    - `35000 kopi`
    - `75k bensin`
    - `1.2jt listrik`
    - `5000 gorengan tahu`
  - App otomatis membaca nominal, catatan, kategori, dan tanggal hari ini.
- Auto category detection berdasarkan keyword.
- Setting Keyword:
  - User bisa tambah keyword kategori.
  - User bisa edit keyword kategori.
  - User bisa hapus keyword kategori.
  - Keyword map tersimpan di `localStorage`.
- Custom category:
  - User bisa membuat kategori baru.
  - Kategori custom muncul di form, filter, chart, dan comparison.
- Learning rule:
  - Jika user edit kategori transaksi, app menyimpan rule lokal dari catatan ke kategori pilihan.
  - Rule dipakai lebih dulu saat Quick Add berikutnya.
- Period comparison apple-to-apple:
  - Bulan berjalan dibanding tanggal yang sama di bulan sebelumnya.
  - Bulan selesai dibanding full bulan sebelumnya.
  - Custom range dibanding range sebelumnya dengan durasi sama.
  - Tahun dibanding tahun sebelumnya.
- Analitik kategori:
  - Nominal kategori
  - Persentase kontribusi terhadap total periode
  - Status perubahan: naik, turun, stabil, baru periode ini, tidak ada pengeluaran
- Input nominal dan budget memakai separator ribuan Indonesia.
  - Contoh: `15000000` tampil sebagai `15.000.000`
  - Data tetap disimpan sebagai number murni.

## Kategori Default

- Makanan
- Transportasi
- Belanja
- Tagihan
- Hiburan
- Kesehatan
- Pendidikan
- Lainnya

## Hal Yang Tidak Ingin Ditambahkan

Jangan merekomendasikan fitur berikut kecuali sangat sederhana dan jelas manfaatnya:

- Login
- Backend
- Database server
- Payment
- Accounting kompleks
- Recurring expense
- Halaman monthly report terpisah
- Multi-user/team management
- Fitur pajak
- Integrasi bank

## Fokus Review Yang Diminta

Tolong review aplikasi ini dari sisi:

1. UI/UX
2. Alur input transaksi
3. Kejelasan dashboard
4. Mobile-first experience
5. Analitik kategori dan period comparison
6. Quick Add dan auto category detection
7. Struktur fitur agar tetap simple
8. Potensi edge case data/localStorage
9. Optimasi copywriting bahasa Indonesia
10. Prioritas improvement berikutnya

## Format Jawaban Yang Diinginkan

Berikan hasil review dalam format berikut:

### 1. Ringkasan Penilaian

Nilai keseluruhan UX dari 1 sampai 10, lalu jelaskan secara singkat.

### 2. Hal Yang Sudah Kuat

Sebutkan fitur atau keputusan desain yang sudah bagus dan sebaiknya dipertahankan.

### 3. Masalah / Risiko UX

Sebutkan masalah yang kemungkinan mengganggu user.

Prioritaskan dari yang paling penting.

### 4. Rekomendasi Optimasi UI/UX

Berikan rekomendasi konkret, bukan teori umum.

Contoh:

- Ubah label X menjadi Y
- Pindahkan komponen A ke atas B
- Gabungkan informasi C agar tidak terlalu ramai
- Tambahkan helper text di bagian D

### 5. Rekomendasi Optimasi Fitur

Berikan saran fitur kecil yang masih sesuai scope aplikasi sederhana.

Jangan menyarankan fitur berat seperti backend, login, integrasi bank, atau accounting app.

### 6. Rekomendasi Optimasi Teknis

Berikan saran teknis untuk React/TypeScript/localStorage/CSS agar aplikasi lebih rapi, aman, dan mudah dikembangkan.

### 7. Prioritas Implementasi

Buat daftar prioritas:

- P0: wajib diperbaiki
- P1: penting
- P2: nice to have

### 8. Prompt Lanjutan Untuk Developer

Buat prompt siap pakai untuk developer/Codex agar bisa langsung mengimplementasikan rekomendasi prioritas tertinggi.

## Catatan Penting

Gunakan bahasa Indonesia.

Jaga scope aplikasi tetap sederhana.

Fokus pada peningkatan kualitas UI/UX dan kegunaan harian, bukan menambah kompleksitas.

Hindari rekomendasi yang membutuhkan backend.

Pastikan rekomendasi cocok untuk aplikasi Vite React TypeScript dengan CSS biasa dan localStorage.
