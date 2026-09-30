# Design System — FlexOffice

Versi: 1.0 | Cakupan: Visual foundation untuk implementasi UI (vibe coding reference)

---

## 1. Brand Direction
Korporat, tenang, "soft corporate" — bukan startup consumer yang playful, tapi juga bukan enterprise yang kaku/dingin. Warna primary mengikuti logo, elemen pendukung dibuat lembut supaya keseluruhan tampilan tidak berat.

## 2. Logo
- Wordmark "FLEX OFFICE" + ikon kursi kerja, garis outline, warna tunggal primary blue.
- **Clear space:** jaga jarak kosong di sekeliling logo minimal setinggi huruf "F" pada wordmark.
- **Penggunaan:** logo penuh (ikon + wordmark) untuk header/landing; ikon saja untuk favicon dan avatar kecil.
- **Jangan:** mengubah warna logo di luar primary blue dan varian monokrom (putih untuk background gelap, hitam/abu gelap untuk dokumen cetak).

## 3. Color Palette

### Primary
| Token | Hex | Penggunaan |
|---|---|---|
| `primary` | `#296EB4` | Tombol utama, link aktif, logo, elemen brand |
| `primary-hover` | `#1F5490` | Hover/active state tombol primary |
| `primary-soft` | `#E4EEF8` | Background badge/highlight ringan, hover state halus, selected state |

### Neutral
| Token | Hex | Penggunaan |
|---|---|---|
| `background` | `#F8F9FC` | Background halaman |
| `surface` | `#FFFFFF` | Card, modal, form container |
| `border` | `#E4E7EC` | Border input, divider, table row |
| `text-primary` | `#1A1F2B` | Heading, body text utama |
| `text-secondary` | `#5B6472` | Label, caption, teks pendukung |
| `text-disabled` | `#A0A6B1` | Placeholder, elemen nonaktif |

### Status (dipakai konsisten untuk badge status booking/pembayaran)
| Token | Hex | Konteks |
|---|---|---|
| `success` | `#2E9E6D` | `confirmed`, `completed`, payment success |
| `success-soft` | `#E5F3ED` | Background badge success |
| `warning` | `#D6941E` | `pending_payment`, refund pending |
| `warning-soft` | `#FBF1E1` | Background badge warning |
| `danger` | `#C4463B` | `failed`, `cancelled` |
| `danger-soft` | `#FBEAE8` | Background badge danger |

**Prinsip:** warna solid (`primary`, `success`, `warning`, `danger`) hanya dipakai untuk teks/icon/border tipis, tidak untuk fill besar (background penuh) — supaya kesan tetap soft. Fill besar pakai varian `-soft`.

## 4. Typography

- **Font utama (UI/body):** **Plus Jakarta Sans** — dipakai untuk seluruh teks aplikasi (heading, body, tombol, form, tabel).
- **Font logo/display besar (opsional):** font geometric bold seperti pada wordmark logo — hanya untuk elemen brand (landing hero, bukan UI form/tabel).

| Level | Size | Weight | Line-height | Penggunaan |
|---|---|---|---|---|
| Display | 36px | 700 | 1.2 | Hero landing page |
| H1 | 28px | 700 | 1.3 | Judul halaman |
| H2 | 22px | 600 | 1.3 | Judul section |
| H3 | 18px | 600 | 1.4 | Judul card/subsection |
| Body | 15px | 400 | 1.6 | Teks utama |
| Body Small | 13px | 400 | 1.5 | Caption, meta info |
| Label | 13px | 500 | 1.4 | Form label, badge |
| Button | 14px | 600 | 1 | Teks tombol |

## 5. Spacing & Layout
- Skala spacing (Tailwind default cocok dipakai langsung): `4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px`.
- Container max-width halaman utama: `1280px`, padding horizontal `24px`.
- Grid card ruangan: 3 kolom di layar besar (≥1280px), 2 kolom di medium (≥768px) — meski target utama desktop, tetap beri breakpoint wajar agar tidak pecah di layar sedang.

## 6. Border Radius & Shadow
- **Radius:** `8px` untuk button/input, `12px` untuk card, `16px` untuk modal — konsisten "soft corners", bukan tajam (0px) atau terlalu bulat (>16px, kesan playful).
- **Shadow:** dipakai tipis, jangan dramatis.
  - Card: `0 1px 3px rgba(16, 24, 40, 0.08)`
  - Modal/dropdown: `0 4px 16px rgba(16, 24, 40, 0.12)`

## 7. Component Approach
**Custom build dari nol**, murni Tailwind CSS tanpa library komponen pihak ketiga. Konsekuensinya:
- Setiap komponen interaktif (Dialog, Dropdown, Date Picker, Toast, Tabs) harus dibangun manual, termasuk accessibility (keyboard navigation, focus trap, ARIA attributes) dan state management-nya (open/closed, disabled, loading).
- Simpan komponen dasar di `frontend/src/components/ui/` (lihat struktur folder di `AGENTS.md`), satu file per komponen (`Button.tsx`, `Input.tsx`, `Badge.tsx`, dst.), supaya reusable dan konsisten dengan token di dokumen ini.
- Untuk komponen yang butuh logic rumit (Date Picker, Toast queue), pertimbangkan library headless yang tidak membawa styling sendiri (mis. Radix Primitives) supaya accessibility tetap terjamin tanpa mengorbankan kontrol visual penuh — beda dari shadcn/ui karena kamu yang menulis markup dan class Tailwind-nya sendiri dari primitive tersebut, bukan copy komponen jadi.

**Setup awal:**
- Import Plus Jakarta Sans lewat Google Fonts, set sebagai `font-sans` default di Tailwind config.
- Definisikan token warna (§3) sebagai CSS variable atau langsung di `tailwind.config` `theme.extend.colors`, supaya dipakai konsisten lewat class Tailwind (`bg-primary`, `text-danger`, dll.) bukan hex ditulis manual di tiap komponen.

## 8. Key Component Specs

### Button
| Variant | Background | Text | Border | Penggunaan |
|---|---|---|---|---|
| Primary | `primary` | white | none | Aksi utama (Book Now, Pay, Save) |
| Secondary | `surface` | `primary` | 1px `primary` | Aksi sekunder (Cancel, Back) |
| Ghost | transparent | `text-secondary` | none | Aksi tersier (Skip, Close) |
| Danger | `danger` | white | none | Aksi destruktif (Confirm Cancellation) |

Semua button: padding `10px 20px`, radius `8px`, font-weight 600.

### Status Badge
Pill shape (radius penuh), background `-soft`, teks warna solid sesuai status, padding `4px 12px`, font 13px weight 500.

### Card Ruangan (Room Card)
- Foto (aspect ratio 4:3) di atas, radius mengikuti card (12px) hanya di sudut atas.
- Padding konten `16px`.
- Harga ditonjolkan dengan weight 600, warna `text-primary`, unit (per hari/bulan/tahun) di teks secondary lebih kecil di sebelahnya.

### Form Input
- Height `40px`, padding horizontal `12px`, border `1px solid border`, radius `8px`.
- Focus state: border `primary`, ring soft `primary-soft` (box-shadow 3px).
- Error state: border `danger`, pesan error teks `danger` 13px di bawah input.

## 9. Iconography
Gunakan icon set garis tipis (outline), konsisten dengan gaya logo (outline chair icon) — rekomendasi: **Lucide Icons** (sudah tersedia sebagai library React, gratis, gaya outline yang cocok).

---

## 10. Open Questions
- **OQ-DS-1:** Untuk landing/hero page, apakah ingin pakai foto ruangan asli (butuh sumber foto/stok) atau ilustrasi sederhana? Ini menentukan apakah perlu cari aset foto tambahan sebelum development dimulai.
