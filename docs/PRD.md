# PRD: FlexOffice — Aplikasi Booking Ruangan

Versi: Final v2 | Status: Siap untuk pengembangan MVP

---

## 1. Problem Statement

**Siapa yang dirugikan dan kenapa**

- **Pencari ruangan** (karyawan/organisasi yang cari tempat rapat, freelancer yang cari suasana baru, startup yang cari kantor sewa): informasi ketersediaan dan harga ruangan tersebar, ketersediaan tidak real-time, pembayaran dan bukti transaksi manual, aturan pembatalan tidak transparan.
- **Operator ruangan** (dikelola admin): risiko double booking, konfirmasi manual memakan waktu, rekap transaksi/invoice dikerjakan manual.

Tidak ada satu alur yang menyatukan cek ketersediaan, booking, bayar, dan bukti transaksi.

*Catatan: hipotesis, belum divalidasi riset pasar — cukup untuk konteks portofolio.*

---

## 2. Target User dan Persona

**Segmen:** karyawan, organisasi, freelancer, startup, mencari ruangan di salah satu dari **2 gedung** FlexOffice. **Aktor tambahan:** Admin (operator tunggal).

### Persona A: Koordinator Rapat
- Karyawan/anggota organisasi yang menyiapkan tempat rapat untuk tim.
- Butuh: cek ketersediaan cepat, kapasitas dan fasilitas sesuai, invoice untuk reimbursement.
- Frustrasi: ruangan ternyata terpakai, harus tanya dulu, jadwal sering berubah.
- Perilaku: booking harian jangka pendek, sering reschedule tanggal, butuh invoice PDF.

### Persona B: Freelancer / Founder Startup
- Bekerja mandiri atau memimpin tim kecil, mencari coworking/ruang kerja bernuansa baru, atau kantor untuk disewa bulanan/tahunan.
- Butuh: bandingkan opsi antar gedung, lihat lokasi di peta, bayar praktis (QRIS).
- Frustrasi: sulit membandingkan opsi, harga/fasilitas tidak jelas.
- Perilaku: booking bulanan/tahunan, sensitif harga dan aturan pembatalan.

---

## 3. Goals dan Non-Goals

### Goals
1. Alur end-to-end bisa didemokan: daftar → verifikasi email → cari ruangan → booking → bayar → auto-confirm → invoice → riwayat.
2. Nol double booking, dijamin di level database.
3. Booking dihitung per **hari/bulan/tahun** (bukan per jam), akurat lintas 2 gedung.
4. Aturan pembatalan (charge 10% jika <48 jam) dan reschedule (hanya ganti tanggal, maks 2x, aturan 48 jam sama) dieksekusi konsisten.
5. Pembayaran via Midtrans Sandbox (termasuk QRIS), status selalu sinkron lewat webhook.
6. Kode dan dokumentasi rapi untuk dinilai sebagai portofolio.

### Non-Goals (MVP)
- Marketplace (pemilik ruangan lain mendaftar berjualan) — satu operator saja.
- Chatbot customer service (dibahas terpisah nanti).
- Aplikasi mobile native.
- Pembayaran produksi sungguhan (tetap sandbox).
- Refund otomatis via payment gateway — refund MVP dikirim **manual oleh admin**.
- Konfirmasi booking manual oleh admin — booking **auto-confirm** setelah bayar sukses.
- Pindah ruangan/gedung lewat reschedule — harus batal lalu pesan baru.
- Pajak/PPN dan data perusahaan pada invoice/profil — masuk v2.
- Hapus akun — masuk v2.
- Login sosial.
- Blokir tanggal untuk maintenance oleh admin — masuk v2.
- Multi-bahasa, loyalty/poin, integrasi kalender eksternal.

---

## 4. User Stories

**Auth**
- Sebagai pengguna baru, saya ingin mendaftar dengan email, supaya saya punya akun.
- Sebagai pengguna baru, saya ingin memverifikasi email dengan kode 6 digit sekali saja, supaya akun saya terbukti memakai email asli.
- Sebagai pengguna terdaftar, saya ingin login dan logout, supaya data saya aman.
- Sebagai pengguna yang lupa password, saya ingin mereset password, supaya saya tidak terkunci dari akun.
- Sebagai pengguna, saya ingin mengganti email dengan verifikasi kode baru, supaya email saya tetap valid.

**Ruangan**
- Sebagai pencari ruangan, saya ingin memilih gedung dan memfilter ruangan berdasarkan tipe, kapasitas, dan tanggal, supaya saya cepat menemukan yang cocok.
- Sebagai pencari ruangan, saya ingin melihat detail ruangan (foto, deskripsi, fasilitas, peta, harga, kebijakan), supaya saya bisa memutuskan tanpa bertanya.
- Sebagai pencari ruangan, saya ingin melihat ketersediaan per tanggal, supaya saya tidak memilih slot yang sudah terisi.

**Booking**
- Sebagai pengguna, saya ingin memesan ruangan untuk sejumlah hari/bulan/tahun mulai tanggal tertentu, supaya durasi sewa saya jelas.
- Sebagai pengguna, saya ingin booking langsung terkonfirmasi setelah pembayaran berhasil, supaya saya tidak menunggu persetujuan siapa pun.
- Sebagai pengguna, saya ingin melihat detail booking, supaya saya punya semua informasi saat hari-H.
- Sebagai pengguna, saya ingin membatalkan booking dan melihat charge sebelum saya konfirmasi, supaya tidak ada kejutan biaya.
- Sebagai pengguna, saya ingin mengubah tanggal booking (bukan ruangan) tanpa biaya tambahan, selama masih ≥48 jam sebelum mulai, supaya saya fleksibel saat rencana berubah.

**Pembayaran dan invoice**
- Sebagai pengguna, saya ingin membayar dengan QRIS atau metode lain di Midtrans, supaya pembayaran praktis.
- Sebagai pengguna, saya ingin melihat hasil pembayaran (berhasil/pending/gagal), supaya saya tahu langkah berikutnya.
- Sebagai pengguna, saya ingin melihat dan mengunduh invoice, supaya saya punya bukti transaksi.
- Sebagai pengguna, saya ingin melihat riwayat transaksi, supaya saya bisa menelusuri semua booking dan pembayaran.

**Notifikasi dan profil**
- Sebagai pengguna, saya ingin menerima notifikasi untuk peristiwa penting, supaya saya tidak melewatkan status booking/pembayaran.
- Sebagai pengguna, saya ingin mengubah data profil, nomor telepon, dan password, supaya data saya tetap akurat.

**Admin**
- Sebagai admin, saya ingin mengelola gedung dan ruangan (tambah, ubah, nonaktifkan), supaya katalog selalu akurat.
- Sebagai admin, saya ingin melihat daftar booking dan pembayaran, supaya saya bisa memantau operasional.
- Sebagai admin, saya ingin dikonfirmasi user sebelum menonaktifkan ruangan yang masih punya booking mendatang, supaya user tidak dirugikan sepihak.
- Sebagai admin, saya ingin menandai refund manual sebagai selesai dengan nomor referensi transfer, supaya ada jejak audit.

---

## 5. Daftar Fitur

### MVP
| # | Fitur | Catatan |
|---|---|---|
| F1 | Auth + verifikasi email (kode 6 digit, sekali) | Register, verifikasi, login, logout, ganti email (verifikasi ulang) |
| F2 | Reset password | |
| F3 | Daftar ruangan, filter (termasuk gedung), detail ruangan | Kalender ketersediaan per tanggal |
| F4 | Booking + detail booking | Auto-confirm setelah bayar; durasi harian/bulanan/tahunan |
| F5 | Pembatalan (charge 10% jika <48 jam) dan reschedule (ganti tanggal saja, maks 2x, aturan 48 jam sama) | |
| F6 | Pembayaran Midtrans Sandbox (+QRIS) dan halaman Payment Result | Webhook wajib |
| F7 | Invoice + download PDF | Tanpa pajak/PPN |
| F8 | Riwayat transaksi | |
| F9 | Notifikasi (in-app) | |
| F10 | Setting profil | Nomor telepon wajib sebelum booking |
| F11 | Admin: CRUD ruangan, lihat booking/pembayaran, tandai refund manual selesai | |
| F12 | Admin: CRUD gedung (2 gedung) | |

Tipe ruangan MVP: meeting room, coworking, ruang kerja, private office, event space.

### v2
- Notifikasi email dan reminder.
- Review/rating setelah booking selesai.
- Favorit/wishlist ruangan.
- Kode promo/voucher.
- Pajak/PPN dan data perusahaan pada invoice/profil.
- Hapus akun.
- Blokir tanggal untuk maintenance/acara internal.
- Dashboard laporan admin (okupansi, pendapatan).

### Nanti
- Chatbot customer service.
- Booking berulang (recurring).
- Akun tim/perusahaan dan tagihan konsolidasi.
- Add-on (katering, perlengkapan tambahan).
- Multi-bahasa.
- Gedung/lokasi tambahan di luar 2 yang sudah ada.

---

## 6. Functional Requirements (MVP)

### F1. Auth dan Verifikasi Email
- FR-AUTH-01: Registrasi dengan nama, email, password, email unik.
- FR-AUTH-02: Setelah registrasi, sistem mengirim kode verifikasi **6 digit** acak ke email.
- FR-AUTH-03: Kode di-hash, berlaku 10 menit, maksimal 5 percobaan salah, lalu hangus dan user minta kode baru.
- FR-AUTH-04: Tombol kirim ulang dengan cooldown 60 detik dan batas jumlah kirim per jam.
- FR-AUTH-05: Verifikasi hanya sekali — setelah `email_verified_at` terisi, tidak diminta lagi.
- FR-AUTH-06: User belum terverifikasi tidak bisa booking; diarahkan ke halaman verifikasi.
- FR-AUTH-07: Login email + password, password di-hash, pesan error tidak membocorkan status registrasi email.
- FR-AUTH-08: Reset password lewat tautan email berbatas waktu.
- FR-AUTH-09: Role `customer` dan `admin`; endpoint admin hanya untuk role `admin`.
- FR-AUTH-10: Ganti email memicu alur sama seperti register — kirim kode 6 digit ke email baru; email lama tetap aktif sampai kode baru terverifikasi.
- Tidak ada login sosial di MVP.

### F3. Ruangan dan Detail Ruangan
- FR-ROOM-00: Setiap ruangan terikat ke satu `building`; user bisa memfilter berdasarkan gedung.
- FR-ROOM-01: Kartu ruangan menampilkan foto sampul, nama, tipe, gedung, kapasitas, harga, dan `price_unit` (harian/bulanan/tahunan — satu ruangan satu unit). Hanya ruangan aktif.
- FR-ROOM-02: Filter: gedung, tipe ruangan, kapasitas minimum, rentang harga, tanggal ketersediaan. Pencarian berdasarkan nama.
- FR-ROOM-03: Halaman detail: galeri foto, deskripsi, kapasitas, harga, fasilitas, alamat, peta lokasi, ringkasan kebijakan pembatalan/reschedule.
- FR-ROOM-04: Kalender ketersediaan menampilkan tanggal terisi vs tersedia.
- FR-ROOM-05: Peta pakai **OpenStreetMap + Leaflet** (gratis, tanpa billing).
- FR-ROOM-06: Ruangan nonaktif tidak muncul di daftar; akses langsung via URL menampilkan "tidak tersedia".
- Tidak ada pembatasan hari/jam operasional — booking bisa dibuat untuk tanggal apa pun termasuk hari libur.

### F4. Booking dan Detail Booking
- FR-BOOK-01: User memilih ruangan, tanggal mulai, dan jumlah unit (mis. 3 hari, 2 bulan) sesuai `price_unit` ruangan; `end_date` dihitung otomatis. Ringkasan (durasi, total, kebijakan) ditampilkan sebelum lanjut bayar.
- FR-BOOK-02: Saat lanjut ke pembayaran, sistem membuat booking `pending_payment` dan menahan slot sampai `expires_at` (durasi tahan default 1 jam — **konfirmasi jika ingin nilai lain**).
- FR-BOOK-03: Pencegahan double booking di server, dalam satu transaksi database, berbasis rentang tanggal. Slot terisi jika ada booking `confirmed` atau `pending_payment` (belum expired) yang tanggalnya overlap.
- FR-BOOK-04: **Auto-confirm** — booking menjadi `confirmed` otomatis saat pembayaran sukses dari webhook Midtrans, tanpa persetujuan admin.
- FR-BOOK-05: Jika `pending_payment` melewati `expires_at`, atau pembayaran gagal/ditolak/kedaluwarsa dari Midtrans → booking menjadi **`failed`**, slot dilepas, user harus membuat pesanan baru (tidak ada reservasi ulang otomatis).
- FR-BOOK-06: Total harga disimpan sebagai snapshot saat booking dibuat.
- FR-BOOK-07: Booking tidak bisa dibuat untuk tanggal yang sudah lewat.
- FR-BOOK-08: Halaman detail booking: kode booking, status, ruangan, gedung, tanggal, total, status pembayaran, deskripsi, peta, fasilitas, tombol batal/reschedule (jika diizinkan), tautan invoice.
- FR-BOOK-09: Klik ganda tombol bayar tidak membuat booking/transaksi ganda (idempotency).

### F5. Pembatalan dan Reschedule
**Pembatalan**
- FR-CANCEL-01: Hanya untuk booking `confirmed` yang belum dimulai.
- FR-CANCEL-02: Jika sisa waktu ke `start_date` ≥48 jam → tanpa charge, refund penuh. Jika <48 jam → charge **10% dari total harga**, sisanya (90%) jadi nilai refund.
- FR-CANCEL-03: User melihat rincian charge dan refund sebelum konfirmasi eksplisit.
- FR-CANCEL-04: Setelah dibatalkan: status `cancelled`, slot dilepas, `cancellation_fee`/`refund_amount` dicatat, status refund `pending`, notifikasi dikirim. Refund **tidak diproses otomatis** — dikirim manual oleh admin di luar sistem.
- FR-CANCEL-05: Pembatalan booking `pending_payment` tidak kena charge, langsung melepas slot.

**Reschedule**
- FR-RESCH-01: Hanya boleh mengubah **tanggal mulai**, ruangan dan gedung tetap sama.
- FR-RESCH-02: Hanya diizinkan jika sisa waktu ke `start_date` lama ≥48 jam — aturan sama persis dengan pembatalan. Jika <48 jam, tombol reschedule dinonaktifkan; user diarahkan membatalkan (kena charge 10%) lalu memesan ulang.
- FR-RESCH-03: Maksimal **2 kali reschedule** per booking.
- FR-RESCH-04: Slot baru divalidasi dengan aturan sama seperti booking baru (FR-BOOK-03, FR-BOOK-07); slot lama dilepas dan slot baru ditahan dalam satu transaksi database.
- FR-RESCH-05: Setiap reschedule dicatat (tanggal lama, tanggal baru, waktu) untuk audit.

### F6. Pembayaran dan Payment Result
- FR-PAY-01: Pembayaran via **Midtrans Sandbox**; metode termasuk QRIS.
- FR-PAY-02: Setiap percobaan bayar punya `midtrans_order_id` unik.
- FR-PAY-03: Sumber kebenaran status pembayaran adalah **webhook Midtrans**, bukan redirect browser. Signature webhook wajib diverifikasi.
- FR-PAY-04: Pemrosesan webhook idempoten.
- FR-PAY-05: Jika webhook belum tiba saat user kembali, halaman Payment Result menanyakan status ke Midtrans (status check).
- FR-PAY-06: Payment Result menampilkan salah satu: **Berhasil**, **Menunggu pembayaran**, **Gagal/Ditolak**, **Kedaluwarsa**, masing-masing dengan aksi lanjutan jelas.

### F7. Invoice
- FR-INV-01: Dibuat otomatis saat booking `confirmed`.
- FR-INV-02: Nomor invoice unik dan berurutan (format: `INV/FO/YYYY/MM/000001`).
- FR-INV-03: Isi: nomor, tanggal terbit, data pemesan (nama, email, telepon), detail ruangan/gedung/tanggal, rincian harga, total, metode dan status pembayaran, kode booking. **Tanpa pajak/PPN** dan tanpa data perusahaan (v2).
- FR-INV-04: Bisa dilihat di aplikasi dan diunduh sebagai PDF.
- FR-INV-05: Hanya bisa diakses pemilik booking dan admin.
- FR-INV-06: Booking yang dibatalkan/reschedule tetap mempertahankan invoice asli; perubahan tercatat di riwayat reschedule.

### F8. Riwayat Transaksi
- FR-HIST-01: Daftar semua booking milik user, urut terbaru: kode booking, ruangan, gedung, tanggal, total, status booking, status pembayaran.
- FR-HIST-02: Filter berdasarkan status dan rentang tanggal; paginasi.
- FR-HIST-03: Setiap baris membuka detail booking dan invoice (jika ada).

### F9. Notifikasi
- FR-NOTIF-01: In-app, dengan indikator belum dibaca dan tombol tandai sudah dibaca.
- FR-NOTIF-02: Pemicu: verifikasi berhasil, booking dibuat (menunggu bayar), pembayaran berhasil/gagal, booking dibatalkan, jadwal diubah, invoice tersedia, ruangan dinonaktifkan paksa (butuh persetujuan).
- FR-NOTIF-03: Hanya bisa dilihat pemiliknya.

### F10. Setting Profil
- FR-PROF-01: Ubah nama, **nomor telepon wajib**, foto profil. Sistem memblokir proses booking (di server, bukan hanya UI) jika telepon kosong.
- FR-PROF-02: Ganti password mewajibkan password lama.
- FR-PROF-03: Ganti email memakai alur FR-AUTH-10.
- FR-PROF-04: Hapus akun — tidak ada di MVP (v2).

### F11/F12. Admin
- FR-ADM-01: CRUD ruangan: gedung, nama, tipe, deskripsi, kapasitas, harga, `price_unit`, alamat, koordinat, fasilitas, foto, status aktif.
- FR-ADM-02: Kelola tipe ruangan dan daftar fasilitas.
- FR-ADM-03: CRUD gedung: nama, alamat, koordinat, foto opsional.
- FR-ADM-04: Daftar booking dan pembayaran dengan filter; lihat detail.
- FR-ADM-05: **Nonaktifkan ruangan:**
  1. Admin mencoba nonaktifkan ruangan.
  2. Sistem cek booking `confirmed` mendatang di ruangan itu.
  3. Tidak ada booking mendatang → langsung nonaktif.
  4. Ada booking mendatang → admin memilih "nonaktifkan paksa" → sistem mengirim **permintaan persetujuan eksplisit** ke setiap user terdampak. Ruangan **baru benar-benar nonaktif setelah user menyetujui** (atau booking terkait ditangani/dibatalkan sesuai persetujuan tersebut).
- FR-ADM-06: Menandai refund manual sebagai `completed`, dengan **nomor referensi transfer wajib diisi** untuk jejak audit.

**Lintas-fitur**
- Zona waktu WIB, mata uang IDR.
- Halaman responsif (mobile-first, berbasis web).
- Otorisasi sisi server untuk setiap akses booking, invoice, notifikasi.

---

## 7. Sketsa Data Model

```
buildings
  id, name, address, latitude, longitude, is_active

rooms
  id, building_id, room_type_id, name, slug, description, capacity,
  price, price_unit (harian|bulanan|tahunan),
  latitude, longitude, is_active

room_types
  id, name, slug   -- meeting room, coworking, ruang kerja, private office, event space

room_images
  id, room_id, path, sort_order, is_cover

facilities
  id, name, icon

room_facility
  room_id, facility_id

users
  id, name, email (unique), password_hash, phone (required),
  avatar_path, role (customer|admin), email_verified_at, created_at

email_verifications
  id, user_id, purpose (register|change_email), new_email (nullable),
  code_hash, expires_at, attempts, last_sent_at, consumed_at

bookings
  id, booking_code (unique), user_id, room_id,
  start_date, end_date, unit_count, price_unit_snapshot,
  status (pending_payment|confirmed|completed|cancelled|failed),
  total_price, expires_at,
  cancelled_at, cancellation_fee, refund_amount,
  refund_status (none|pending|completed), refund_reference,
  reschedule_count, created_at

booking_reschedules
  id, booking_id, old_start_date, old_end_date,
  new_start_date, new_end_date, created_at

payments
  id, booking_id, midtrans_order_id (unique), midtrans_transaction_id,
  payment_type, gross_amount, transaction_status,
  paid_at, expiry_time, raw_payload (json)

invoices
  id, invoice_number (unique), booking_id, payment_id,
  issued_at, subtotal, total, pdf_path

notifications
  id, user_id, type, title, body, data (json), read_at, created_at

room_deactivation_requests
  id, room_id, requested_by, reason, status (pending|approved|rejected),
  created_at

room_deactivation_approvals
  id, request_id, booking_id, user_id, status (pending|approved|rejected),
  responded_at
```

**Relasi kunci:** `buildings 1–N rooms`, `users 1–N bookings`, `rooms 1–N bookings`, `bookings 1–N payments`, `bookings 1–1 invoices` (setelah confirmed), `bookings 1–N booking_reschedules`, `rooms N–N facilities`, `room_deactivation_requests 1–N room_deactivation_approvals`.

**Integritas:** cegah overlap booking di level transaksi database; indeks pada `(room_id, start_date, end_date)` dan `status`.

---

## 8. Edge Case dan Failure State

| Skenario | Perilaku yang diharapkan |
|---|---|
| Dua user memilih tanggal sama di ruangan sama | Satu berhasil; yang lain dapat pesan "slot baru saja terisi" |
| Klik bayar dua kali / refresh saat proses | Tidak ada booking/transaksi ganda (idempotency) |
| Pembayaran gagal / kedaluwarsa | Booking → `failed`; user membuat pesanan baru, tanpa reservasi ulang otomatis |
| Webhook terlambat / tidak sampai | Status check ke Midtrans saat user membuka Payment Result |
| Webhook terkirim ganda / tidak berurutan | Diproses idempoten; status tidak mundur |
| Signature webhook tidak valid | Ditolak, dicatat sebagai log keamanan |
| Kode verifikasi salah / kedaluwarsa / percobaan habis | Pesan error jelas; kode hangus, tawarkan kirim ulang |
| Spam kirim ulang kode | Ditolak dengan pesan cooldown |
| Layanan email gagal mengirim | Tampilkan error dan opsi coba lagi, dicatat |
| User belum verifikasi mencoba booking | Diarahkan ke halaman verifikasi |
| Batal tepat di batas 48 jam | ≥48:00:00 bebas charge; kurang dari itu kena charge 10% |
| Reschedule saat sisa waktu <48 jam | Ditolak, diarahkan ke alur batal (charge 10%) → pesan baru |
| Reschedule mencoba ganti ruangan/gedung | Tidak tersedia di UI; hanya tanggal yang bisa diubah |
| Reschedule ke-3 dalam booking yang sama | Ditolak — sudah mencapai batas 2x |
| Reschedule ke tanggal yang sudah terisi | Ditolak; jadwal lama tetap utuh |
| Batal/reschedule setelah tanggal mulai lewat | Ditolak dengan pesan jelas |
| Refund setelah pembatalan | Status `pending` sampai admin menandai `completed` dengan nomor referensi transfer |
| Admin nonaktifkan ruangan tanpa booking mendatang | Langsung nonaktif |
| Admin nonaktifkan ruangan dengan booking mendatang | Ditolak langsung; butuh persetujuan eksplisit tiap user terdampak sebelum benar-benar nonaktif |
| Harga ruangan diubah setelah booking dibuat | Booking memakai snapshot harga lama |
| Invoice gagal dibuat / PDF gagal dirender | Booking tetap `confirmed`; invoice dicoba ulang otomatis, user melihat "invoice sedang diproses" |
| User akses booking/invoice/notifikasi milik orang lain | 403/404, tidak ada kebocoran data |
| Sesi habis saat proses pembayaran | Setelah login ulang, user kembali ke booking yang sama |
| Peta gagal dimuat | Tampilkan alamat teks; halaman tetap berfungsi |
| Foto ruangan hilang | Tampilkan placeholder |
| Tidak ada ruangan sesuai filter | Empty state dengan saran ubah filter |

---

## 9. Success Metrics

**A. Definition of Done (demo)**
- Alur lengkap berjalan tanpa error: daftar → verifikasi → cari → booking → bayar (QRIS/sandbox) → auto-confirm → invoice PDF → riwayat.
- Skenario gagal terdemonstrasi: pembayaran gagal/expired, pembatalan <48 jam (charge 10%), pembatalan ≥48 jam (tanpa charge), reschedule sukses dan ditolak (>2x atau <48 jam).
- Uji bentrok: dua sesi mencoba tanggal sama, hanya satu berhasil.
- Webhook terverifikasi (signature) dan idempoten.
- Admin bisa menambah ruangan/gedung dan menandai refund selesai; alur persetujuan nonaktifkan ruangan terdemonstrasi.
- Aplikasi ter-deploy atau bisa dijalankan dengan panduan setup jelas di README.

**B. Metrik produk (jika dipakai user sungguhan)**
| Metrik | Definisi | Target awal |
|---|---|---|
| Penyelesaian verifikasi email | user terverifikasi ÷ user terdaftar | ≥80% |
| Konversi booking | booking `confirmed` ÷ booking dibuat | ≥60% |
| Keberhasilan pembayaran | pembayaran sukses ÷ percobaan bayar | ≥90% |
| Double booking | jumlah kejadian | 0 |
| Sinkronisasi pembayaran | webhook terproses tanpa intervensi manual | 100% |
| Kelengkapan invoice | booking `confirmed` yang punya invoice | 100% |
| Waktu admin menuntaskan refund manual | dari `pending` sampai `completed` | <2x24 jam |
| Tingkat penolakan reschedule (<48 jam atau >2x) | dipantau, tanpa target awal | — |
| Okupansi ruangan per gedung | jam/hari terpesan ÷ tersedia | dipantau, tanpa target awal |

---

## 10. Open Questions (Sisa)

- **OQ-A:** Durasi penahanan slot untuk `pending_payment` (default diusulkan 1 jam) — setujukah, atau ingin nilai lain?
- **OQ-B:** Satu ruangan hanya punya satu `price_unit` (mis. kantor startup hanya bisa disewa bulanan/tahunan, meeting room hanya harian) — konfirmasi ini sesuai maksud, tidak ada kasus ruangan yang perlu multi-unit harga.
- **OQ-C:** Pada "nonaktifkan paksa", jika user **menolak** persetujuan — apa langkah selanjutnya? Admin tidak bisa menonaktifkan sama sekali, atau ada eskalasi (mis. booking dibatalkan paksa dengan refund penuh)?
- **OQ-D:** Nama produk sudah **FlexOffice** — perlu tagline atau tidak, di luar scope PRD ini.

---

*Dokumen ini final untuk kebutuhan MVP. Perubahan lanjutan (v2/nanti) mengikuti daftar fitur di bagian 5.*
