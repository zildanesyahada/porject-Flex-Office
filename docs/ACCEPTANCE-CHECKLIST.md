# Acceptance Checklist — FlexOffice (MVP)

Versi: 1.0 | Cara pakai: centang setiap item setelah fitur diimplementasi dan diuji manual. Dipecah per fitur supaya bisa dites modular, tidak perlu menunggu seluruh aplikasi selesai.

---

## F1. Auth & Email Verification
- [ ] Registrasi berhasil dengan nama, email unik, password; ditolak jika email sudah terdaftar
- [ ] Setelah registrasi, email berisi kode verifikasi 6 digit terkirim
- [ ] Kode benar → `email_verified_at` terisi, user bisa lanjut ke aplikasi
- [ ] Kode salah → pesan error muncul, sisa percobaan berkurang
- [ ] Kode salah 5x → kode hangus, muncul opsi kirim ulang
- [ ] Kirim ulang sebelum 60 detik → ditolak dengan pesan cooldown
- [ ] Kode kedaluwarsa (>10 menit) → ditolak, harus kirim ulang
- [ ] User belum verifikasi mencoba booking → diarahkan ke halaman verifikasi, bukan error mentah
- [ ] Login dengan email+password benar → berhasil, token diterima
- [ ] Login dengan password salah → pesan error generik (tidak membocorkan email terdaftar/tidak)
- [ ] Reset password: request tautan → email terkirim → set password baru berhasil → login pakai password baru
- [ ] Tautan reset password kedaluwarsa ditolak
- [ ] Ganti email: kirim kode ke email baru, email lama tetap bisa dipakai sampai kode baru dikonfirmasi
- [ ] Endpoint admin (`/admin/*`) diakses oleh role `customer` → ditolak (403)

## F2. Reset Password
- [ ] Sudah tercakup di checklist F1 (reset password adalah bagian dari modul Auth)

## F3. Room & Building Catalog
- [ ] Daftar ruangan menampilkan hanya ruangan `is_active = true`
- [ ] Ruangan nonaktif diakses lewat URL langsung → menampilkan halaman "tidak tersedia", bukan detail ruangan
- [ ] Filter gedung, tipe ruangan, kapasitas minimum, rentang harga berfungsi dan bisa dikombinasikan
- [ ] Pencarian nama ruangan mengembalikan hasil yang relevan
- [ ] Halaman detail menampilkan foto, deskripsi, fasilitas, peta, harga+unit, kebijakan pembatalan/reschedule
- [ ] Peta (OpenStreetMap/Leaflet) merender pin lokasi dengan benar
- [ ] Peta gagal dimuat → alamat teks tetap tampil, halaman tidak error
- [ ] Kalender ketersediaan menampilkan tanggal terisi vs tersedia sesuai data booking aktif
- [ ] Filter tidak menghasilkan hasil → empty state dengan saran ubah filter muncul, bukan halaman kosong

## F4. Booking & Detail Booking
- [ ] Booking dibuat dengan tanggal mulai + jumlah unit (hari/bulan/tahun) sesuai `price_unit` ruangan; `end_date` terhitung otomatis dan benar
- [ ] Ringkasan (durasi, total harga, kebijakan) tampil sebelum lanjut ke pembayaran
- [ ] Booking baru berstatus `pending_payment` dengan `expires_at` = 1 jam dari pembuatan
- [ ] Dua percobaan booking bersamaan pada tanggal sama, ruangan sama → hanya satu berhasil, yang lain dapat pesan "slot sudah terisi"
- [ ] Klik tombol bayar dua kali (double click/refresh) → tidak membuat booking/transaksi duplikat
- [ ] Booking tidak bisa dibuat untuk tanggal yang sudah lewat
- [ ] Setelah pembayaran sukses (webhook), status otomatis `confirmed` tanpa aksi admin
- [ ] `pending_payment` yang melewati `expires_at` → otomatis `failed`, slot terlepas (verifikasi lewat job/cron)
- [ ] Pembayaran gagal/ditolak dari Midtrans → status `failed`
- [ ] Halaman detail booking menampilkan kode booking, status, ruangan, gedung, tanggal, total, status pembayaran, deskripsi, peta, fasilitas, tautan invoice
- [ ] Perubahan harga ruangan setelah booking dibuat tidak mengubah `total_price` booking yang sudah ada (snapshot teruji)

## F5. Cancellation & Reschedule
- [ ] Pembatalan hanya tersedia untuk booking `confirmed` yang belum dimulai
- [ ] Pembatalan ≥48 jam sebelum `start_date` → charge 0%, refund 100%
- [ ] Pembatalan <48 jam sebelum `start_date` → charge 10%, refund 90%, keduanya tampil sebelum konfirmasi
- [ ] Setelah dibatalkan: status `cancelled`, slot terlepas (bisa dipesan orang lain), `refund_status = pending`
- [ ] Pembatalan booking `pending_payment` → tidak ada charge, langsung melepas slot
- [ ] Reschedule hanya mengizinkan ubah tanggal, tidak ada opsi ganti ruangan/gedung di UI
- [ ] Reschedule ditolak jika sisa waktu <48 jam, dengan pesan yang mengarahkan ke alur batal
- [ ] Reschedule ke-3 pada booking yang sama → ditolak (batas 2x)
- [ ] Reschedule ke tanggal yang sudah terisi ruangan lain → ditolak, jadwal lama tidak berubah
- [ ] Reschedule berhasil tercatat di `booking_reschedules` (tanggal lama & baru)
- [ ] Batal/reschedule pada booking yang tanggal mulainya sudah lewat → ditolak dengan pesan jelas

## F6. Payment & Payment Result
- [ ] Checkout membuat transaksi Midtrans Sandbox dan menampilkan opsi pembayaran termasuk QRIS
- [ ] Pembayaran sukses di sandbox → webhook diterima, signature terverifikasi, status booking berubah `confirmed`
- [ ] Webhook dengan signature tidak valid → ditolak (403), tidak memproses payload
- [ ] Webhook yang sama dikirim dua kali (simulasi) → tidak menghasilkan efek ganda (idempotency teruji)
- [ ] User menutup popup pembayaran sebelum selesai → booking tetap `pending_payment`, bisa dilanjutkan dari detail booking
- [ ] Halaman Payment Result menampilkan status yang benar untuk: Success, Pending, Failed, Expired — masing-masing dengan CTA yang sesuai
- [ ] Jika webhook belum tiba saat user kembali ke halaman, sistem melakukan status check manual ke Midtrans

## F7. Invoice
- [ ] Invoice otomatis dibuat saat booking menjadi `confirmed`
- [ ] Nomor invoice unik dan berurutan (format konsisten)
- [ ] Invoice dapat dilihat di halaman dan diunduh sebagai PDF
- [ ] Isi invoice lengkap: nomor, tanggal, data pemesan, detail ruangan/gedung/tanggal, rincian harga, total, status pembayaran, kode booking
- [ ] User A tidak bisa mengakses invoice milik user B (403/404)
- [ ] Kegagalan generate PDF tidak mengubah status booking; sistem mencoba ulang otomatis

## F8. Transaction History
- [ ] Riwayat menampilkan seluruh booking milik user login, terurut terbaru ke lama
- [ ] Filter status dan rentang tanggal berfungsi
- [ ] Klik baris riwayat membuka detail booking dan invoice terkait (jika ada)
- [ ] Paginasi berfungsi saat data lebih dari satu halaman

## F9. Notifications
- [ ] Notifikasi in-app muncul untuk: verifikasi berhasil, booking dibuat, pembayaran berhasil/gagal, pembatalan, reschedule, invoice tersedia
- [ ] Indikator belum dibaca tampil dan berkurang saat notifikasi dibuka
- [ ] Tombol "tandai sudah dibaca" berfungsi
- [ ] User A tidak bisa melihat notifikasi milik user B

## F10. Profile Settings
- [ ] Nama, nomor telepon, foto profil bisa diubah dan tersimpan
- [ ] Booking diblokir di server (bukan hanya UI) jika nomor telepon kosong
- [ ] Ganti password menolak request tanpa password lama yang benar
- [ ] Ganti password berhasil → bisa login dengan password baru, gagal dengan password lama

## F11. Admin — Room & Booking Management
- [ ] Admin bisa membuat, mengubah ruangan (gedung, tipe, harga, unit harga, fasilitas, foto, status)
- [ ] Admin bisa melihat daftar booking & pembayaran dengan filter
- [ ] Nonaktifkan ruangan tanpa booking mendatang → langsung nonaktif
- [ ] Nonaktifkan ruangan dengan booking `confirmed` mendatang → ditolak langsung, muncul opsi "nonaktifkan paksa"
- [ ] "Nonaktifkan paksa" mengirim permintaan persetujuan ke tiap user terdampak; ruangan tidak nonaktif sebelum semua user merespons approve
- [ ] Admin menandai refund selesai → wajib isi nomor referensi transfer, tidak bisa submit kosong
- [ ] Setelah ditandai selesai, `refund_status` booking terkait berubah jadi `completed`

## F12. Admin — Building Management
- [ ] Admin bisa membuat dan mengubah data gedung (nama, alamat, koordinat)
- [ ] Ruangan baru wajib terhubung ke salah satu gedung yang ada (tidak bisa tanpa gedung)

---

## Cross-Cutting (uji di akhir, setelah semua modul jadi)
- [ ] Seluruh teks UI konsisten Bahasa Inggris (tidak ada campur Bahasa Indonesia tersisa)
- [ ] Layout tidak pecah di lebar layar 1024px–1920px (target desktop/laptop)
- [ ] Token auth kedaluwarsa setelah 24 jam → user diarahkan ke login ulang
- [ ] Alur end-to-end lengkap tanpa error: register → verify → browse → book → pay (sandbox) → confirmed → invoice PDF → history
- [ ] README berisi langkah setup (env variable, migrate, seed) dan bisa diikuti dari nol
