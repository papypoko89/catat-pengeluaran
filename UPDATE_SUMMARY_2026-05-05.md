# Update Summary - 2026-05-05

Ringkasan perubahan terbaru aplikasi **Catat Pengeluaran**.

## Fokus Update

- Quick Add lebih pintar dan lebih tahan input natural.
- Deteksi kategori Quick Add tersambung langsung ke keyword map.
- UX feedback dibuat lebih halus.
- Empty state dibuat lebih jelas.
- Insight dashboard dibuat lebih actionable.
- Search dan list transaksi dibuat lebih ringan.

## Quick Add

- Mendukung format nominal seperti:
  - `35k`
  - `35 k`
  - `35rb`
  - `35 ribu`
  - `35000`
  - `35.000`
  - `1.2jt`
  - `1,2jt`
  - `1.200.000`
- Nominal dikonversi menjadi number integer bersih.
- Sisa teks setelah nominal menjadi catatan transaksi.
- Deteksi kategori memakai `keywordMap` aktif dari Setting Keyword.
- Contoh:
  - Input: `300k langganan netflix`
  - Amount: `300000`
  - Note: `langganan netflix`
  - Keyword: `netflix`
  - Kategori: `Hiburan`
- Jika tidak ada keyword yang cocok, kategori fallback ke `Lainnya`.

## UX Polish

- Toast kecil muncul setelah transaksi berhasil ditambahkan.
- Format toast:
  - `Rp 35.000 • kopi`
- Transaksi baru diberi animasi fade dan slight scale.
- Angka summary dashboard diberi animasi soft saat berubah.
- Empty state diperjelas:
  - `Mulai catat pengeluaran pertama kamu`
  - `Contoh: 35k kopi`
  - CTA `Tambah Pengeluaran`

## Insight Dashboard

- Menampilkan perubahan pengeluaran vs periode sebelumnya.
- Menampilkan kategori terbesar periode aktif.
- Menampilkan status budget:
  - `Aman`
  - `Waspada`
  - `Melebihi budget`
- Perbandingan insight memakai range apple-to-apple dari period comparison.

## Data Trust & Performance

- Menambahkan label ringan:
  - `Data tersimpan di perangkat ini`
- Search transaksi memakai debounce 300ms.
- Filter transaksi dan grouping transaksi di-memoize.
- Tidak ada backend, login, cloud sync, atau dependency baru.

## Verifikasi

- Build command:

```powershell
npm.cmd run build
```

- Status terakhir sebelum publish: build berhasil tanpa error TypeScript.
