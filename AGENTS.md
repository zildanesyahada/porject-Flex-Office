# AGENTS.md — Konteks Proyek FlexOffice

File ini dibaca otomatis oleh OpenCode (dan agent lain yang mendukung konvensi AGENTS.md) di awal setiap sesi. Isinya peta ke dokumen lain, bukan duplikat isinya — supaya konteks yang dimuat tetap ringkas dan relevan dengan task yang sedang dikerjakan.

## Ringkasan Proyek
FlexOffice: aplikasi booking ruangan (2 gedung, 5 tipe ruangan) satu operator, bukan marketplace. Booking dihitung per hari/bulan/tahun, auto-confirm setelah pembayaran Midtrans (Sandbox) sukses. Stack: Laravel API (backend/) + React SPA (frontend/), MySQL, deploy ke Vercel (frontend) + Railway/Render (backend).

## Dokumen Mana untuk Task Apa
**Jangan baca semua dokumen di `docs/` untuk setiap task.** Pilih sesuai kebutuhan:

| Sedang mengerjakan... | Baca dokumen ini |
|---|---|
| Memahami requirement/aturan bisnis suatu fitur | `docs/PRD.md` bagian 6 (FR per fitur) |
| Requirement teknis versi formal (kode SRS-F-xxx) | `docs/SRS.md` |
| Struktur tabel database, field, tipe data | `docs/SYSTEM-DESIGN.md` §1 (ERD) |
| Membuat/mengubah endpoint API | `docs/SYSTEM-DESIGN.md` §2 (API spec) |
| Logic status booking/refund/deactivation | `docs/SYSTEM-DESIGN.md` §3 (state diagram) |
| Algoritma cek overlap, hitung charge, webhook idempotency | `docs/SYSTEM-DESIGN.md` §4 |
| Naming/lokasi file di backend (Controller/Service/Repository) | `docs/SYSTEM-DESIGN.md` §7 |
| Warna, font, spacing, komponen UI | `docs/design.md` |
| Cek fitur sudah lengkap atau belum | `docs/ACCEPTANCE-CHECKLIST.md` |
| Alur antar service, deployment | `docs/ARCHITECTURE.md` |

**Jangan pernah menebak aturan bisnis** (mis. besaran charge, durasi expire, batas reschedule) — semua nilai sudah eksplisit di `PRD.md`/`SYSTEM-DESIGN.md`. Kalau sebuah keputusan tidak ditemukan di dokumen manapun, itu artinya belum diputuskan — tandai sebagai TODO/komentar di kode, jangan diasumsikan sendiri.

## Aturan Keras (jangan dilanggar walau kelihatan lebih simpel)
- Booking auto-confirm HANYA lewat webhook Midtrans, bukan redirect browser (`SRS-F-PAY-04`).
- Pengecekan overlap booking WAJIB dalam database transaction dengan row lock (`SYSTEM-DESIGN.md` §4.1) — jangan cek lalu insert di dua query terpisah tanpa lock.
- Webhook wajib verifikasi signature sebelum diproses.
- Reschedule TIDAK boleh mengizinkan ganti ruangan/gedung, hanya tanggal.
- UI text: Bahasa Inggris. Target device: desktop/laptop saja, bukan mobile-first.
- Refund TIDAK diproses otomatis oleh sistem — hanya dicatat status `pending`/`completed`, dieksekusi manual oleh admin di luar sistem.

## Code Quality Rules (WAJIB, berlaku di setiap task frontend maupun backend)
- **Jangan duplikasi markup/logic lebih dari sekali.** Kalau elemen UI atau logic yang sama (atau hampir sama) dipakai di 2+ tempat, ekstrak jadi komponen (`components/ui/` atau `components/shared/` untuk frontend; Service/Trait untuk backend) SEBELUM menulis pemakaian kedua — jangan copy-paste dulu baru dirapikan belakangan.
- **Cek dulu sebelum menulis kode baru** apakah sudah ada komponen/fungsi serupa di `components/ui/`, `components/shared/`, `features/<domain>/`, atau `app/Services/` yang bisa dipakai ulang atau diperluas, daripada bikin versi baru yang mirip.
- **Class/style yang tidak berfungsi harus dihapus, bukan dibiarkan menumpuk** — contoh: class Flexbox/Grid yang salah target parent-nya, import yang tidak dipakai, state yang tidak pernah dibaca.
- **Posisi elemen `absolute` wajib punya parent `relative` yang eksplisit** di komponen yang sama, jangan mengandalkan parent di luar komponen yang bisa berubah sewaktu-waktu.
- **Sebelum menandai task selesai**, tinjau ulang file yang baru dibuat/diubah: apakah ada blok kode yang identik atau hampir identik diulang lebih dari sekali di file yang sama atau file lain dalam task ini? Kalau ya, ekstrak dulu sebelum selesai, jangan tinggalkan sebagai "nanti dirapikan".

## Urutan Implementasi
Ikuti urutan di `README.md` bagian "Urutan Implementasi" — jangan mulai modul Payment sebelum Booking selesai dan teruji, karena Payment bergantung pada state `pending_payment`.

## Struktur Folder
- `backend/` — Laravel, pola Controller → Service → Repository (lihat `SYSTEM-DESIGN.md` §7)
- `frontend/` — React, pola `pages/` + `features/<domain>/api.ts` untuk axios call per domain, komponen reusable di `components/ui/` (dasar) dan `components/shared/` (gabungan/cross-page)

## Yang Belum Diputuskan (cek sebelum implementasi terkait)
- Hosting backend final: Railway atau Render (`ARCHITECTURE.md` OQ-ARCH-2, terkait dukungan cron job)
- Kasus user menolak persetujuan nonaktifkan ruangan (`PRD.md` OQ-C) — jangan implementasi F11 deactivation-forced sebelum ini jelas
- Hero/landing page: foto asli atau ilustrasi (`design.md` OQ-DS-1)
