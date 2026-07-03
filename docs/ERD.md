# ERD Simple - Admin Iuran RT

ERD ini dibuat sederhana agar mudah dipahami. Fokus relasinya adalah penghuni, rumah, histori hunian, tagihan iuran, pembayaran, dan pengeluaran.

```mermaid
erDiagram
    USERS {
        bigint id PK
        string name
        string email
        string password
    }

    API_TOKENS {
        bigint id PK
        bigint user_id FK
        string name
        string token
    }

    RESIDENTS {
        bigint id PK
        string full_name
        string ktp_photo_path
        enum resident_status "permanent | contract"
        string phone_number
        enum marital_status "single | married"
    }

    HOUSES {
        bigint id PK
        string house_number
        text address
        enum house_status "vacant | occupied"
    }

    HOUSE_OCCUPANCIES {
        bigint id PK
        bigint house_id FK
        bigint resident_id FK
        date start_date
        date end_date
        text notes
    }

    FEE_TYPES {
        bigint id PK
        string name
        string code
        decimal amount
        boolean is_active
    }

    INVOICES {
        bigint id PK
        bigint house_id FK
        bigint resident_id FK
        bigint house_occupancy_id FK
        date period_month
        date due_date
        decimal total_amount
        decimal paid_amount
        enum status "unpaid | partial | paid"
    }

    INVOICE_ITEMS {
        bigint id PK
        bigint invoice_id FK
        bigint fee_type_id FK
        string description
        decimal amount
    }

    PAYMENTS {
        bigint id PK
        bigint resident_id FK
        bigint house_id FK
        date payment_date
        decimal amount
        string payment_method
        text notes
    }

    PAYMENT_ALLOCATIONS {
        bigint id PK
        bigint payment_id FK
        bigint invoice_item_id FK
        decimal amount
    }

    EXPENSE_CATEGORIES {
        bigint id PK
        string name
    }

    EXPENSES {
        bigint id PK
        bigint expense_category_id FK
        date expense_date
        decimal amount
        text description
        string proof_path
    }

    USERS ||--o{ API_TOKENS : "memiliki"
    HOUSES ||--o{ HOUSE_OCCUPANCIES : "punya histori hunian"
    RESIDENTS ||--o{ HOUSE_OCCUPANCIES : "pernah menghuni"
    HOUSES ||--o{ INVOICES : "ditagihkan"
    RESIDENTS ||--o{ INVOICES : "wajib membayar"
    HOUSE_OCCUPANCIES ||--o{ INVOICES : "dasar tagihan"
    INVOICES ||--o{ INVOICE_ITEMS : "berisi"
    FEE_TYPES ||--o{ INVOICE_ITEMS : "jenis iuran"
    RESIDENTS ||--o{ PAYMENTS : "melakukan"
    HOUSES ||--o{ PAYMENTS : "dibayarkan untuk"
    PAYMENTS ||--o{ PAYMENT_ALLOCATIONS : "dialokasikan"
    INVOICE_ITEMS ||--o{ PAYMENT_ALLOCATIONS : "dibayar"
    EXPENSE_CATEGORIES ||--o{ EXPENSES : "mengelompokkan"
```

## Penjelasan Singkat

- `residents` menyimpan data penghuni: nama lengkap, foto KTP, status tetap/kontrak, nomor telepon, dan status menikah.
- `houses` menyimpan data rumah dan status rumah: `occupied` untuk dihuni, `vacant` untuk tidak dihuni.
- `house_occupancies` menyimpan histori penghuni per rumah. Jika penghuni rumah berubah, data lama tetap tersimpan dengan `end_date`.
- `fee_types` menyimpan jenis iuran. Seeder membuat dua iuran utama: `Satpam` dan `Kebersihan`.
- `invoices` menyimpan tagihan iuran per rumah, penghuni, dan bulan.
- `invoice_items` menyimpan detail komponen iuran pada invoice, misalnya Satpam dan Kebersihan.
- `payments` menyimpan pembayaran yang dilakukan penghuni.
- `payment_allocations` menghubungkan pembayaran ke item invoice. Ini membuat pembayaran bisa melunasi sebagian atau beberapa item tagihan.
- `expenses` menyimpan pengeluaran RT seperti gaji satpam, token listrik, perbaikan jalan, dan perbaikan selokan.

## Alur Data Utama

1. Admin menambahkan penghuni di `residents`.
2. Admin menambahkan rumah di `houses`.
3. Admin mengisi penghuni rumah di `house_occupancies`.
4. Sistem generate invoice bulanan dari rumah yang sedang dihuni.
5. Setiap invoice berisi item iuran dari `fee_types`, yaitu Satpam dan Kebersihan.
6. Saat penghuni membayar, data masuk ke `payments`.
7. Jika pembayaran dialokasikan ke invoice item, status invoice berubah menjadi `unpaid`, `partial`, atau `paid`.
8. Pengeluaran dicatat di `expenses`.
9. Laporan bulanan mengambil total pemasukan dari `payments` dan total pengeluaran dari `expenses`.
