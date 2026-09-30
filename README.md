# FlexOffice

Aplikasi booking ruangan (meeting room, coworking, ruang kerja, private office, event space) di 2 gedung, dengan auto-confirm setelah pembayaran, dibangun sebagai proyek portofolio.

## Dokumentasi Proyek
| Dokumen | Isi |
|---|---|
| [`PRD.md`](./PRD.md) | Product requirements — problem, goals, fitur, data model, metrik |
| [`SRS.md`](./SRS.md) | Software requirements spec (IEEE 830) |
| [`use-case-diagram.md`](./use-case-diagram.md) | Diagram use case |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Arsitektur level tinggi, deployment view |
| [`SYSTEM-DESIGN.md`](./SYSTEM-DESIGN.md) | ERD detail, API contract, algoritma, struktur folder backend |
| [`design.md`](./design.md) | Design system — warna, tipografi, komponen |
| [`ACCEPTANCE-CHECKLIST.md`](./ACCEPTANCE-CHECKLIST.md) | Checklist uji manual per fitur |

## Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion, shadcn/ui, axios — SPA terpisah, di-deploy ke **Vercel**
- **Backend:** Laravel (PHP), Sanctum (token auth) — REST API, di-deploy ke layanan terpisah (Railway/Render — belum final, lihat `ARCHITECTURE.md` §6)
- **Database:** MySQL
- **Payment:** Midtrans Sandbox (Snap/Core API, termasuk QRIS)
- **Maps:** OpenStreetMap + Leaflet.js

---

## Struktur Repository
Proyek dipisah jadi dua folder/repo karena frontend dan backend di-deploy independen:
```
flexoffice/
├── backend/     -- Laravel API
└── frontend/    -- React SPA
```

---

## Setup — Backend (Laravel)

### Prasyarat
- PHP ≥ 8.2, Composer
- MySQL ≥ 8.0
- Akun Midtrans Sandbox (untuk server key & client key)

### Langkah
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

### Environment Variables (`.env`)
```env
APP_NAME=FlexOffice
APP_URL=http://localhost:8000
APP_ENV=local
APP_DEBUG=true

FRONTEND_URL=http://localhost:5173   # untuk CORS

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=flexoffice
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_TOKEN_EXPIRATION=1440   # menit = 24 jam

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io   # atau SMTP gratis lain
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=no-reply@flexoffice.test
MAIL_FROM_NAME="FlexOffice"

MIDTRANS_MERCHANT_ID=
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
```

### Migrate & Seed
```bash
php artisan migrate
php artisan db:seed
```
Seeder menyiapkan: 1 akun admin, 2 gedung, beberapa ruangan contoh per tipe, dan daftar fasilitas dasar — lihat detail di `database/seeders/`.

**Akun admin default (dari seeder):**
```
email: admin@flexoffice.test
password: password
```
*(Ganti setelah setup pertama.)*

### Jalankan
```bash
php artisan serve
php artisan queue:work        # jika notifikasi/email pakai queue
php artisan schedule:work     # untuk scheduled jobs (expire booking, dll — lihat SYSTEM-DESIGN.md §5)
```
Backend berjalan di `http://localhost:8000`.

### Webhook Midtrans (testing lokal)
Untuk menerima webhook dari Midtrans Sandbox di localhost, pakai tunnel seperti `ngrok`:
```bash
ngrok http 8000
```
Lalu daftarkan URL ngrok sebagai **Payment Notification URL** di dashboard Midtrans Sandbox: `https://<ngrok-url>/api/v1/webhooks/midtrans`.

---

## Setup — Frontend (React)

### Prasyarat
- Node.js ≥ 18, npm/pnpm

### Langkah
```bash
cd frontend
npm install
cp .env.example .env
```

### Environment Variables (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_MIDTRANS_CLIENT_KEY=
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Jalankan
```bash
npm run dev
```
Frontend berjalan di `http://localhost:5173`.

---

## Urutan Implementasi (disarankan)
Ikuti urutan ini supaya dependency antar modul tidak menghambat development:
1. Auth (register, verifikasi email, login)
2. Room & Building catalog (termasuk seed data)
3. Booking (create, cek overlap)
4. Payment (integrasi Midtrans + webhook)
5. Invoice (generate setelah confirmed)
6. Cancellation & Reschedule
7. Notification, Transaction History, Profile Settings
8. Admin panel (Room/Building CRUD, Booking list, Refund, Deactivation approval)

## Testing Manual
Gunakan [`ACCEPTANCE-CHECKLIST.md`](./ACCEPTANCE-CHECKLIST.md) untuk verifikasi tiap fitur setelah diimplementasi.

## Catatan
- Aplikasi ini memakai Midtrans **Sandbox** — tidak ada transaksi uang sungguhan.
- Refund diproses **manual oleh admin** di luar sistem (lihat `PRD.md` FR-CANCEL-04); sistem hanya mencatat status dan nomor referensi transfer.
- Target platform: **desktop/laptop browser** — tidak dioptimalkan untuk tampilan mobile di MVP ini.
