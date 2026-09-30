# Frontend Folder Structure — FlexOffice

Versi: 1.0 | Cakupan: Blueprint pasti untuk `frontend/src/`, dibuat ulang sebelum rebuild supaya struktur tidak berantakan seperti sebelumnya.

Prinsip: **satu jenis hal, satu lokasi pasti.** Sebelum bikin file baru, cek dulu apakah sudah ada tempat untuk itu di sini — jangan bikin lokasi baru yang mirip.

---

## Struktur Lengkap

```
frontend/
├── public/
│   ├── images/
│   │   ├── boardroom.jpg              ← foto panel auth (referensi Stitch)
│   │   └── logo.svg                   ← logo FlexOffice
│   └── favicon.ico
│
├── src/
│   ├── main.tsx                       ← entry point, render <App />
│   ├── App.tsx                        ← setup Router + layout global
│   ├── index.css                      ← @import tailwindcss + @theme (token warna/font)
│   │
│   ├── pages/                         ← SATU FILE = SATU ROUTE. Tidak ada logic bisnis di sini,
│   │   │                                  cuma compose komponen dari components/ dan features/
│   │   ├── LandingPage.tsx            ← route: /
│   │   ├── auth/
│   │   │   ├── AuthLayout.tsx         ← route: /login, /register (shared split-panel)
│   │   │   ├── VerifyEmailPage.tsx    ← route: /verify-email
│   │   │   └── ForgotPasswordPage.tsx ← route: /forgot-password
│   │   ├── DashboardPage.tsx          ← route: /dashboard (placeholder dulu)
│   │   ├── rooms/
│   │   │   ├── RoomSearchPage.tsx     ← route: /rooms
│   │   │   └── RoomDetailPage.tsx     ← route: /rooms/:slug
│   │   ├── bookings/
│   │   │   ├── BookingCheckoutPage.tsx
│   │   │   ├── BookingDetailPage.tsx
│   │   │   └── TransactionHistoryPage.tsx
│   │   ├── payments/
│   │   │   └── PaymentResultPage.tsx
│   │   ├── invoices/
│   │   │   └── InvoicePage.tsx
│   │   ├── profile/
│   │   │   └── ProfileSettingsPage.tsx
│   │   └── admin/
│   │       ├── AdminRoomsPage.tsx
│   │       ├── AdminBuildingsPage.tsx
│   │       ├── AdminBookingsPage.tsx
│   │       └── AdminRefundsPage.tsx
│   │
│   ├── components/
│   │   ├── ui/                        ← KOMPONEN DASAR, generik, TIDAK tahu soal domain
│   │   │   │                             (tidak boleh import dari features/). Dipakai di mana saja.
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── PasswordInput.tsx      ← Input + toggle show/hide (dari refactor kemarin)
│   │   │   ├── Badge.tsx              ← StatusBadge (success/warning/danger soft)
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   └── index.ts               ← re-export semua, supaya import jadi `from '@/components/ui'`
│   │   │
│   │   └── shared/                    ← KOMPONEN GABUNGAN lintas halaman, BOLEH tahu domain
│   │       │                             tapi dipakai di >1 page/feature
│   │       ├── AuthImagePanel.tsx     ← panel gambar split-screen (dipakai di Login/Register/Verify)
│   │       ├── RoomCard.tsx           ← kartu ruangan (dipakai di search & mungkin admin)
│   │       ├── Navbar.tsx
│   │       └── Footer.tsx
│   │
│   ├── features/                      ← LOGIC PER DOMAIN. Satu folder = satu domain bisnis.
│   │   │                                 Ini SATU-SATUNYA tempat axios call boleh ditulis.
│   │   ├── auth/
│   │   │   ├── api.ts                 ← register(), login(), verifyEmail(), resendCode(), dst.
│   │   │   ├── types.ts               ← RegisterPayload, LoginPayload, AuthResponse
│   │   │   └── useAuthForm.ts         ← hook spesifik auth (kalau tidak reusable ke domain lain)
│   │   ├── rooms/
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   ├── bookings/
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   ├── payments/
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   └── notifications/
│   │       ├── api.ts
│   │       └── types.ts
│   │
│   ├── lib/                           ← utilitas infrastruktur, BUKAN logic domain
│   │   ├── axios.ts                   ← instance axios + interceptor token (SATU-SATUNYA instance)
│   │   ├── auth-storage.ts            ← get/set/clear token dari localStorage (satu tempat pasti)
│   │   └── utils.ts                   ← formatCurrency, formatDate, dll. (generik, tanpa domain)
│   │
│   ├── hooks/                         ← HANYA hook yang reusable LINTAS domain
│   │   │                                 (hook yang spesifik satu domain taruh di features/<domain>/)
│   │   └── useDebounce.ts
│   │
│   ├── types/                         ← tipe data ENTITAS (mengikuti ERD di SYSTEM-DESIGN.md §1),
│   │   │                                 dipakai lintas domain. Tipe request/response API tetap di
│   │   │                                 features/<domain>/types.ts, bukan di sini.
│   │   ├── room.ts                    ← Room, Building, Facility, RoomType
│   │   ├── booking.ts                 ← Booking, BookingReschedule
│   │   ├── user.ts                    ← User
│   │   └── auth.ts                    ← ImagePanelContent, dll. (tipe UI terkait auth)
│   │
│   └── router/
│       └── routes.tsx                 ← definisi semua <Route> di satu tempat (bukan tersebar)
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env
```

---

## Aturan Import (mencegah spaghetti & duplikasi)

1. **`components/ui/` tidak boleh import dari `features/` atau `pages/`.** Kalau sebuah komponen UI butuh tahu soal domain (misal "status booking"), itu tandanya dia harus pindah ke `components/shared/`, bukan `ui/`.

2. **`pages/` tidak boleh menulis axios call langsung.** Semua fetch data lewat function dari `features/<domain>/api.ts`. Kalau ketemu `axios.get(...)` langsung di dalam file `pages/`, itu salah tempat.

3. **Satu instance axios saja** (`lib/axios.ts`), semua `features/*/api.ts` import dari situ. Jangan bikin `new axios.create()` lagi di tempat lain.

4. **Sebelum bikin komponen baru, cek urutan ini:**
   - Sudah ada di `components/ui/`? → pakai itu
   - Mirip tapi beda dikit? → tambah props ke komponen yang ada, jangan duplikat
   - Butuh tahu domain tertentu & dipakai >1 tempat? → `components/shared/`
   - Cuma dipakai di 1 halaman? → boleh taruh sebagai sub-component di file `pages/` itu sendiri, TIDAK perlu file terpisah

5. **Barrel export** (`components/ui/index.ts`) wajib di-update setiap ada komponen baru di `ui/`, supaya import selalu `import { Button, Input } from '@/components/ui'`, bukan path panjang per file.

---

## Pemetaan ke Fitur PRD (untuk tahu file mana dikerjakan di modul mana)

| Modul (dari README "Urutan Implementasi") | Folder yang disentuh |
|---|---|
| Auth | `pages/auth/`, `features/auth/`, `components/shared/AuthImagePanel.tsx` |
| Room & Building | `pages/rooms/`, `features/rooms/`, `components/shared/RoomCard.tsx`, `types/room.ts` |
| Booking | `pages/bookings/`, `features/bookings/`, `types/booking.ts` |
| Payment | `pages/payments/`, `features/payments/` |
| Invoice | `pages/invoices/` |
| Notification | `components/shared/` (dropdown/bell icon), `features/notifications/` |
| Profile | `pages/profile/` |
| Admin | `pages/admin/*` |

---

## Untuk Referensi Desain dari Stitch

Kalau pakai Stitch MCP untuk generate komponen: hasil generate **tetap wajib ditempatkan sesuai struktur di atas**, bukan dibiarkan di lokasi yang Stitch tentukan sendiri. Setelah fetch dari Stitch, langkah berikutnya selalu: pindahkan/refactor hasilnya ke `components/ui/`, `components/shared/`, atau `pages/` yang sesuai — jangan biarkan ada folder baru seperti `stitch-export/` yang tidak mengikuti konvensi ini.
