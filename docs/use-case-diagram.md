# Use Case Diagram — FlexOffice

Dokumen pendamping `SRS.md`. Diagram dalam notasi Mermaid — bisa dirender langsung di GitHub, GitLab, Obsidian, atau editor Mermaid mana pun.

## Diagram

```mermaid
graph LR
  Customer((Customer))
  Admin((Admin))

  subgraph Auth
    UC1[Register]
    UC2[Verify Email]
    UC3[Login / Logout]
    UC4[Reset Password]
    UC5[Change Email]
  end

  subgraph Room Discovery
    UC6[Browse Rooms]
    UC7[Filter by Building/Type/Date]
    UC8[View Room Detail]
  end

  subgraph Booking
    UC9[Create Booking]
    UC10[View Booking Detail]
    UC11[Cancel Booking]
    UC12[Reschedule Booking]
  end

  subgraph Payment
    UC13[Pay via Midtrans]
    UC14[View Payment Result]
  end

  subgraph Post-Booking
    UC15[View Invoice]
    UC16[Download Invoice PDF]
    UC17[View Transaction History]
    UC18[Receive Notifications]
  end

  subgraph Profile
    UC19[Edit Profile]
    UC20[Change Password]
  end

  subgraph Admin Panel
    UC21[Manage Buildings]
    UC22[Manage Rooms]
    UC23[View Bookings and Payments]
    UC24[Request Room Deactivation]
    UC25[Mark Refund as Completed]
  end

  Customer --> UC1
  Customer --> UC2
  Customer --> UC3
  Customer --> UC4
  Customer --> UC5
  Customer --> UC6
  Customer --> UC7
  Customer --> UC8
  Customer --> UC9
  Customer --> UC10
  Customer --> UC11
  Customer --> UC12
  Customer --> UC13
  Customer --> UC14
  Customer --> UC15
  Customer --> UC16
  Customer --> UC17
  Customer --> UC18
  Customer --> UC19
  Customer --> UC20
  Customer -.approve/reject.-> UC24

  Admin --> UC3
  Admin --> UC21
  Admin --> UC22
  Admin --> UC23
  Admin --> UC24
  Admin --> UC25

  UC9 -.includes.-> UC13
  UC13 -.includes.-> UC14
  UC9 -.includes.-> UC15
  UC11 -.includes.-> UC14
```

## Deskripsi Aktor

| Aktor | Deskripsi |
|---|---|
| **Customer** | Pengguna yang mencari dan memesan ruangan (karyawan, freelancer, startup) |
| **Admin** | Operator tunggal yang mengelola gedung, ruangan, booking, dan refund |

## Deskripsi Use Case Kunci

### UC9 — Create Booking
- **Aktor:** Customer
- **Precondition:** Email terverifikasi, nomor telepon terisi
- **Main flow:** Pilih ruangan → pilih tanggal mulai & jumlah unit → lihat ringkasan → lanjut ke pembayaran (UC13)
- **Postcondition:** Booking berstatus `pending_payment`, slot ditahan sampai `expires_at`

### UC11 — Cancel Booking
- **Aktor:** Customer
- **Precondition:** Booking berstatus `confirmed`, belum dimulai
- **Main flow:** Buka detail booking → pilih batal → sistem hitung charge (10% jika <48 jam) → konfirmasi eksplisit
- **Postcondition:** Booking `cancelled`, refund berstatus `pending`

### UC24 — Request Room Deactivation
- **Aktor:** Admin (inisiator), Customer (approver)
- **Precondition:** Ruangan memiliki booking `confirmed` mendatang
- **Main flow:** Admin ajukan nonaktifkan paksa → sistem kirim permintaan persetujuan ke tiap user terdampak → user menyetujui/menolak
- **Postcondition:** Ruangan nonaktif hanya jika seluruh user terdampak menyetujui (lihat OQ-C di PRD.md — kasus penolakan belum diputuskan)

### UC25 — Mark Refund as Completed
- **Aktor:** Admin
- **Precondition:** Booking `cancelled` dengan `refund_status = pending`
- **Main flow:** Admin input nomor referensi transfer → tandai selesai
- **Postcondition:** `refund_status = completed`
