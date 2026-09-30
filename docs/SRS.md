# Software Requirements Specification (SRS)
## FlexOffice — Aplikasi Booking Ruangan

Kerangka: IEEE 830-1998 | Versi: 1.0 | Status: Final untuk MVP

Dokumen pendamping: `use-case-diagram.md` (diagram use case terpisah, notasi Mermaid).

---

## 1. Introduction

### 1.1 Purpose
Dokumen ini menspesifikasikan kebutuhan perangkat lunak untuk **FlexOffice**, aplikasi booking ruangan satu arah (bukan marketplace/e-commerce) yang dioperasikan oleh satu operator dengan dua gedung. Dokumen ini menerjemahkan kebutuhan produk (lihat `PRD.md`) menjadi requirement teknis yang bisa diverifikasi.

### 1.2 Document Conventions
- Requirement fungsional diberi kode `SRS-F-<fitur>-<nomor>`.
- Requirement non-fungsional diberi kode `SRS-NF-<kategori>-<nomor>`.
- Prioritas: **Wajib (Must)**, **Penting (Should)**, **Opsional (Could)** — mengikuti MoSCoW, seluruh requirement di dokumen ini berprioritas **Must** kecuali disebutkan lain, karena merupakan scope MVP.

### 1.3 Intended Audience
Pengembang (solo developer/mahasiswa), dosen pembimbing/penguji, dan pembaca portofolio yang menilai kelengkapan dokumentasi teknis.

### 1.4 Product Scope
FlexOffice memungkinkan pengguna mencari ruangan (meeting room, coworking, ruang kerja, private office, event space) di 2 gedung, memesan untuk durasi harian/bulanan/tahunan, membayar via Midtrans (termasuk QRIS), dan mengelola booking (batal/reschedule) sesuai kebijakan 48 jam. Admin mengelola gedung, ruangan, booking, dan refund manual. Di luar scope: marketplace multi-operator, chatbot, aplikasi mobile native, refund otomatis, pajak/PPN.

### 1.5 References
- `PRD.md` — Product Requirements Document FlexOffice v2 (sumber kebenaran untuk goals, user stories, dan daftar fitur).
- `use-case-diagram.md` — diagram use case (Mermaid).
- Midtrans API Documentation (Snap/Core API, Sandbox).
- ISO/IEC/IEEE 29148:2018 (referensi kerangka lanjutan, tidak dipakai penuh di dokumen ini — lihat catatan di bagian pembuka percakapan).

---

## 2. Overall Description

### 2.1 Product Perspective
Sistem baru, berdiri sendiri (bukan pengembangan dari sistem lama). Berbasis web, mengonsumsi API pihak ketiga: Midtrans (pembayaran), layanan email (verifikasi/notifikasi), dan OpenStreetMap/Leaflet (peta).

### 2.2 Product Functions (ringkas — detail di Bagian 4)
Autentikasi & verifikasi email, katalog ruangan & gedung, booking dengan auto-confirm, pembatalan & reschedule dengan kebijakan 48 jam, pembayaran Midtrans & payment result, invoice PDF, riwayat transaksi, notifikasi in-app, setting profil, dan panel admin.

### 2.3 User Classes and Characteristics
| Kelas pengguna | Karakteristik |
|---|---|
| **Customer** (karyawan, freelancer, startup) | Pengguna akhir, mengakses lewat browser desktop/laptop, tidak memerlukan pelatihan khusus |
| **Admin** | Operator tunggal, mengelola gedung/ruangan/booking/refund, memahami operasional bisnis FlexOffice |

### 2.4 Operating Environment
- **SRS-NF-ENV-01:** Sistem berjalan sebagai aplikasi web, diakses melalui browser modern (Chrome, Firefox, Edge versi dua tahun terakhir).
- **SRS-NF-ENV-02:** Target perangkat adalah **desktop dan laptop**. Tampilan mobile/tablet **tidak** menjadi target desain di MVP (berbeda dari asumsi awal di PRD — perlu diselaraskan jika PRD diperbarui).
- **SRS-NF-ENV-03:** Backend: Laravel (PHP) + MySQL. Frontend: React + Tailwind CSS + Framer Motion.
- **SRS-NF-ENV-04:** Lingkungan pembayaran memakai **Midtrans Sandbox**, bukan produksi.

### 2.5 Design and Implementation Constraints
- **SRS-NF-CON-01:** Tanpa anggaran untuk layanan berbayar — peta wajib memakai penyedia gratis (OpenStreetMap + Leaflet), bukan Google Maps.
- **SRS-NF-CON-02:** Tidak ada integrasi refund otomatis; refund dieksekusi manual oleh admin di luar sistem pembayaran.
- **SRS-NF-CON-03:** Seluruh operasi pengecekan ketersediaan dan pembuatan booking harus atomik di level transaksi database untuk mencegah race condition (double booking).

### 2.6 Assumptions and Dependencies
- Layanan pengiriman email pihak ketiga tersedia dan gratis untuk kebutuhan development/demo (mis. SMTP gratis atau sandbox seperti Mailtrap).
- Midtrans Sandbox tersedia tanpa proses verifikasi bisnis untuk keperluan testing.
- Tidak ada persyaratan hukum/regulasi lokal (mis. e-meterai, kepatuhan pajak) yang wajib dipenuhi karena sistem tidak dioperasikan secara komersial nyata.

---

## 3. External Interface Requirements

### 3.1 User Interfaces
- **SRS-NF-UI-01:** Seluruh antarmuka pengguna (label, tombol, pesan error, notifikasi, invoice) menggunakan **Bahasa Inggris**.
- **SRS-NF-UI-02:** Layout dioptimalkan untuk resolusi desktop/laptop (minimum lebar 1024px); tidak ada requirement layout khusus mobile di MVP.
- **SRS-NF-UI-03:** Halaman kunci: Landing/Search, Room Detail, Booking Checkout, Payment Result, Booking Detail, Transaction History, Invoice View, Profile Settings, Admin Dashboard (Rooms, Buildings, Bookings, Refunds).

### 3.2 Hardware Interfaces
Tidak ada. Sistem tidak berinteraksi dengan perangkat keras khusus.

### 3.3 Software Interfaces
| Sistem eksternal | Fungsi | Protokol |
|---|---|---|
| Midtrans (Snap/Core API, Sandbox) | Pemrosesan pembayaran, termasuk QRIS | REST API + Webhook (HTTP Notification), signature key verification |
| Layanan email (SMTP/sandbox) | Kirim kode verifikasi 6 digit, reset password, notifikasi email | SMTP/REST API |
| OpenStreetMap + Leaflet.js | Render peta lokasi ruangan/gedung | Tile API (gratis, tanpa API key berbayar) |
| MySQL | Penyimpanan data utama | Koneksi database (Eloquent ORM Laravel) |

### 3.4 Communication Interfaces
- **SRS-NF-COM-01:** Seluruh komunikasi klien-server memakai HTTPS.
- **SRS-NF-COM-02:** Endpoint webhook Midtrans wajib memverifikasi signature key sebelum memproses payload apa pun.

---

## 4. System Features (Functional Requirements)

Setiap fitur berikut mengacu ke FR yang sama dengan `PRD.md` Bagian 6, disusun ulang dalam format IEEE 830 (description, stimulus/response).

### 4.1 Authentication & Email Verification
**Description:** Registrasi, verifikasi email sekali dengan kode 6 digit, login, reset password, ganti email.

| ID | Requirement |
|---|---|
| SRS-F-AUTH-01 | Sistem HARUS menerima registrasi dengan nama, email (unik), password |
| SRS-F-AUTH-02 | Sistem HARUS mengirim kode verifikasi 6 digit acak ke email setelah registrasi |
| SRS-F-AUTH-03 | Sistem HARUS menyimpan kode dalam bentuk hash, berlaku 10 menit, maksimal 5 percobaan |
| SRS-F-AUTH-04 | Sistem HARUS menyediakan kirim ulang kode dengan cooldown 60 detik |
| SRS-F-AUTH-05 | Sistem HARUS menandai email terverifikasi secara permanen setelah kode benar dimasukkan sekali |
| SRS-F-AUTH-06 | Sistem HARUS menolak akses fitur booking untuk akun yang belum terverifikasi |
| SRS-F-AUTH-07 | Sistem HARUS mendukung login dengan email+password, dengan pesan error yang tidak membocorkan apakah email terdaftar |
| SRS-F-AUTH-08 | Sistem HARUS menyediakan reset password via tautan email berbatas waktu |
| SRS-F-AUTH-09 | Sistem HARUS membedakan otorisasi role `customer` dan `admin` di setiap endpoint |
| SRS-F-AUTH-10 | Sistem HARUS mewajibkan verifikasi kode 6 digit baru saat user mengganti email |

**Stimulus/Response:** Input kode verifikasi salah → sistem menampilkan pesan error dan sisa percobaan. Percobaan habis → kode dinyatakan tidak valid, sistem menawarkan kirim ulang.

### 4.2 Room & Building Catalog
| ID | Requirement |
|---|---|
| SRS-F-ROOM-01 | Sistem HARUS menampilkan daftar ruangan aktif dengan foto, nama, tipe, gedung, kapasitas, harga, dan unit harga |
| SRS-F-ROOM-02 | Sistem HARUS menyediakan filter: gedung, tipe ruangan, kapasitas minimum, rentang harga, tanggal |
| SRS-F-ROOM-03 | Sistem HARUS menampilkan halaman detail ruangan: galeri foto, deskripsi, fasilitas, peta lokasi, kebijakan pembatalan/reschedule |
| SRS-F-ROOM-04 | Sistem HARUS menampilkan kalender ketersediaan per tanggal untuk setiap ruangan |
| SRS-F-ROOM-05 | Sistem HARUS merender peta lokasi memakai OpenStreetMap/Leaflet |
| SRS-F-ROOM-06 | Sistem TIDAK BOLEH menampilkan ruangan nonaktif di daftar publik |

### 4.3 Booking
| ID | Requirement |
|---|---|
| SRS-F-BOOK-01 | Sistem HARUS menerima input tanggal mulai dan jumlah unit sesuai `price_unit` ruangan (hari/bulan/tahun), lalu menghitung `end_date` otomatis |
| SRS-F-BOOK-02 | Sistem HARUS membuat booking berstatus `pending_payment` dengan `expires_at` saat checkout dimulai |
| SRS-F-BOOK-03 | Sistem HARUS mencegah dua booking dengan rentang tanggal beririsan pada ruangan yang sama, divalidasi dalam transaksi database |
| SRS-F-BOOK-04 | Sistem HARUS mengubah status booking menjadi `confirmed` secara otomatis segera setelah menerima notifikasi pembayaran sukses dari Midtrans, tanpa langkah persetujuan admin |
| SRS-F-BOOK-05 | Sistem HARUS mengubah status booking menjadi `failed` jika `expires_at` terlampaui atau pembayaran berstatus gagal/ditolak |
| SRS-F-BOOK-06 | Sistem HARUS menyimpan `total_price` sebagai snapshot pada saat booking dibuat |
| SRS-F-BOOK-07 | Sistem TIDAK BOLEH mengizinkan pembuatan booking untuk tanggal yang sudah lewat |
| SRS-F-BOOK-08 | Sistem HARUS mencegah pembuatan booking/transaksi duplikat akibat klik ganda pada tombol bayar |

### 4.4 Cancellation & Reschedule
| ID | Requirement |
|---|---|
| SRS-F-CANCEL-01 | Sistem HARUS mengizinkan pembatalan hanya untuk booking `confirmed` yang belum dimulai |
| SRS-F-CANCEL-02 | Sistem HARUS mengenakan charge 10% dari total harga jika pembatalan dilakukan <48 jam sebelum `start_date`; 0% jika ≥48 jam |
| SRS-F-CANCEL-03 | Sistem HARUS menampilkan rincian charge/refund dan meminta konfirmasi eksplisit sebelum memproses pembatalan |
| SRS-F-CANCEL-04 | Sistem HARUS mencatat status refund sebagai `pending` setelah pembatalan, menunggu admin menandai `completed` secara manual |
| SRS-F-RESCH-01 | Sistem HARUS mengizinkan perubahan tanggal mulai booking tanpa biaya, tanpa mengizinkan perubahan ruangan/gedung |
| SRS-F-RESCH-02 | Sistem HARUS menerapkan aturan 48 jam yang sama seperti pembatalan untuk mengizinkan reschedule |
| SRS-F-RESCH-03 | Sistem TIDAK BOLEH mengizinkan lebih dari 2 kali reschedule per booking |

### 4.5 Payment & Payment Result
| ID | Requirement |
|---|---|
| SRS-F-PAY-01 | Sistem HARUS memproses pembayaran melalui Midtrans Sandbox, termasuk metode QRIS |
| SRS-F-PAY-02 | Sistem HARUS memverifikasi signature setiap webhook sebelum memproses payload |
| SRS-F-PAY-03 | Sistem HARUS memproses webhook secara idempoten (notifikasi duplikat tidak menghasilkan efek ganda) |
| SRS-F-PAY-04 | Sistem HARUS melakukan status check ke Midtrans jika webhook belum diterima saat user membuka halaman Payment Result |
| SRS-F-PAY-05 | Sistem HARUS menampilkan salah satu dari status: Success, Pending, Failed, Expired, masing-masing dengan call-to-action yang sesuai |

### 4.6 Invoice
| ID | Requirement |
|---|---|
| SRS-F-INV-01 | Sistem HARUS membuat invoice otomatis saat booking berstatus `confirmed` |
| SRS-F-INV-02 | Sistem HARUS menghasilkan nomor invoice unik dan berurutan |
| SRS-F-INV-03 | Sistem HARUS menyediakan unduhan invoice dalam format PDF |
| SRS-F-INV-04 | Sistem TIDAK BOLEH mengizinkan akses invoice oleh pengguna selain pemilik booking dan admin |

### 4.7 Transaction History
| ID | Requirement |
|---|---|
| SRS-F-HIST-01 | Sistem HARUS menampilkan seluruh booking milik user yang login, terurut dari terbaru |
| SRS-F-HIST-02 | Sistem HARUS menyediakan filter status dan rentang tanggal pada riwayat transaksi |

### 4.8 Notifications
| ID | Requirement |
|---|---|
| SRS-F-NOTIF-01 | Sistem HARUS mengirim notifikasi in-app untuk: verifikasi berhasil, booking dibuat, pembayaran berhasil/gagal, pembatalan, reschedule, invoice tersedia, permintaan persetujuan nonaktifkan ruangan |
| SRS-F-NOTIF-02 | Sistem TIDAK BOLEH menampilkan notifikasi milik user lain |

### 4.9 Profile Settings
| ID | Requirement |
|---|---|
| SRS-F-PROF-01 | Sistem HARUS mewajibkan nomor telepon terisi sebelum user dapat membuat booking, divalidasi di server |
| SRS-F-PROF-02 | Sistem HARUS mewajibkan password lama saat mengganti password |

### 4.10 Admin — Room, Building, Booking, Refund Management
| ID | Requirement |
|---|---|
| SRS-F-ADM-01 | Sistem HARUS menyediakan CRUD ruangan (gedung, tipe, harga, unit harga, fasilitas, foto, status) untuk role admin |
| SRS-F-ADM-02 | Sistem HARUS menyediakan CRUD gedung untuk role admin |
| SRS-F-ADM-03 | Sistem HARUS menampilkan daftar booking dan pembayaran dengan filter untuk role admin |
| SRS-F-ADM-04 | Sistem HARUS mencegah admin menonaktifkan ruangan yang memiliki booking `confirmed` mendatang tanpa melalui alur persetujuan eksplisit dari user terdampak |
| SRS-F-ADM-05 | Sistem HARUS mewajibkan admin mengisi nomor referensi transfer saat menandai status refund sebagai `completed` |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **SRS-NF-PERF-01:** Tidak ada target performa ketat (bukan sistem beban tinggi). Sebagai acuan wajar: waktu muat halaman utama dan pencarian ruangan di bawah ~3 detik pada koneksi normal.
- **SRS-NF-PERF-02:** Operasi pengecekan ketersediaan dan pembuatan booking harus selesai dalam satu request tanpa timeout pada kondisi normal.

### 5.2 Security
- **SRS-NF-SEC-01:** Password disimpan dalam bentuk hash (bukan plaintext).
- **SRS-NF-SEC-02:** Sesi pengguna memakai token dengan masa berlaku **24 jam**; setelah kedaluwarsa, sistem mewajibkan login ulang. *(Nilai default — konfirmasi jika ingin durasi berbeda.)*
- **SRS-NF-SEC-03:** Endpoint webhook pembayaran wajib memverifikasi signature; payload tidak valid ditolak dan dicatat.
- **SRS-NF-SEC-04:** Endpoint admin hanya dapat diakses oleh role `admin`, divalidasi di server pada setiap request.
- **SRS-NF-SEC-05:** Kode verifikasi email dibatasi percobaan (maks 5x) dan cooldown kirim ulang untuk mencegah brute-force/spam.
- **SRS-NF-SEC-06:** Setiap akses ke booking, invoice, dan notifikasi divalidasi kepemilikan datanya di server (bukan hanya disembunyikan di UI).

### 5.3 Usability
- **SRS-NF-USE-01:** Antarmuka menggunakan Bahasa Inggris secara konsisten di seluruh halaman, termasuk pesan error dan invoice.
- **SRS-NF-USE-02:** Setiap aksi berisiko (pembatalan dengan charge, nonaktifkan ruangan yang punya booking) wajib menampilkan konfirmasi eksplisit sebelum diproses.

### 5.4 Reliability & Availability
- **SRS-NF-REL-01:** Status pembayaran harus tetap konsisten meskipun webhook diterima terlambat, duplikat, atau tidak berurutan (idempotent processing).
- **SRS-NF-REL-02:** Kegagalan pembuatan PDF invoice tidak boleh mengubah status booking yang sudah `confirmed`; sistem mencoba ulang pembuatan invoice.

### 5.5 Maintainability
- **SRS-NF-MAIN-01:** Kode mengikuti struktur standar Laravel (MVC) dan komponen React yang terpisah per fitur, supaya mudah ditelusuri untuk keperluan evaluasi/portofolio.

### 5.6 Portability
- **SRS-NF-PORT-01:** Sistem hanya menargetkan browser desktop/laptop; tidak ada requirement kompatibilitas untuk aplikasi mobile native atau tampilan mobile-responsive khusus di MVP.

---

## 6. Other Requirements
Tidak ada requirement legal/regulasi/database khusus di luar yang sudah tercakup pada Bagian 5.2 (Security), karena sistem tidak dioperasikan secara komersial nyata di lingkungan produksi.

---

## Appendix A: Glossary
| Istilah | Definisi |
|---|---|
| Auto-confirm | Booking otomatis berstatus `confirmed` setelah pembayaran sukses, tanpa persetujuan admin |
| Price unit | Satuan sewa suatu ruangan: harian, bulanan, atau tahunan |
| Webhook | Notifikasi HTTP asinkron dari Midtrans yang menjadi sumber kebenaran status pembayaran |
| Slot | Rentang tanggal (`start_date`–`end_date`) yang dipesan pada suatu ruangan |

## Appendix B: Analysis Models
Lihat `use-case-diagram.md` untuk diagram use case (notasi Mermaid, aktor Customer dan Admin).

## Appendix C: Data Dictionary
Mengacu ke skema data pada `PRD.md` Bagian 7 (entitas: `buildings`, `rooms`, `room_types`, `users`, `bookings`, `payments`, `invoices`, `notifications`, `room_deactivation_requests`, dll.) — tidak diduplikasi di sini untuk menghindari dua sumber kebenaran yang bisa tidak sinkron.
