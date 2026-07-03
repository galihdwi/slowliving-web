# Panduan Instalasi - Admin Iuran RT

Panduan ini tidak menggunakan Docker. Backend dan frontend dijalankan terpisah.

## 1. Kebutuhan Sistem

Pastikan perangkat sudah memiliki:

- PHP `8.3` atau lebih baru
- Composer `2.x`
- MySQL `8.x` atau MariaDB yang kompatibel
- Node.js `20` atau lebih baru
- npm `10` atau lebih baru
- Git

Ekstensi PHP yang perlu aktif:

- `pdo`
- `pdo_mysql`
- `mbstring`
- `openssl`
- `tokenizer`
- `xml`
- `ctype`
- `json`
- `fileinfo`
- `curl`

Cek versi:

```bash
php -v
composer -V
mysql --version
node -v
npm -v
```

## 2. Clone Project

```bash
git clone <url-repository>
cd jagoan
```

Struktur project:

```txt
jagoan/
├── backend/   # Laravel API
├── frontend/  # React + Vite + shadcn UI
└── docs/      # ERD dan dokumentasi instalasi
```

## 3. Setup Database MySQL

Login ke MySQL:

```bash
mysql -u root -p
```

Buat database:

```sql
CREATE DATABASE admin_iuran_rt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'admin_iuran_rt'@'localhost' IDENTIFIED BY 'password_admin_iuran_rt';
GRANT ALL PRIVILEGES ON admin_iuran_rt.* TO 'admin_iuran_rt'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Jika ingin memakai user MySQL yang sudah ada, bagian `CREATE USER` dan `GRANT` boleh disesuaikan.

## 4. Setup Backend Laravel

Masuk ke folder backend:

```bash
cd backend
```

Install dependency PHP:

```bash
composer install
```

Buat file `.env`:

```bash
cp .env.example .env
```

Edit file `.env`, minimal menjadi seperti ini:

```env
APP_NAME="Slowliving System"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=admin_iuran_rt
DB_USERNAME=admin_iuran_rt
DB_PASSWORD=password_admin_iuran_rt

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
FILESYSTEM_DISK=public
```

Generate app key:

```bash
php artisan key:generate
```

Jalankan migrasi dan seeder:

```bash
php artisan migrate --seed
```

Buat symbolic link storage agar file upload bisa diakses:

```bash
php artisan storage:link
```

Bersihkan cache config:

```bash
php artisan optimize:clear
```

Jalankan backend:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Backend akan berjalan di:

```txt
http://127.0.0.1:8000
```

Cek endpoint index:

```bash
curl http://127.0.0.1:8000/
```

Output yang benar:

```json
{
  "status": "success",
  "data": {
    "message": "Admin Iuran RT API is running.",
    "service": "admin-iuran-rt-api",
    "version": "1.0.0"
  }
}
```

## 5. Akun Login Default

Seeder membuat akun admin:

```txt
Email    : test@example.com
Password : password
```

Test login API:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

Jika sukses, response berisi `access_token`.

## 6. Setup Frontend React

Buka terminal baru dari root project:

```bash
cd frontend
```

Install dependency JavaScript:

```bash
npm install
```

Buat file `.env`:

```bash
cp .env.example .env
```

Pastikan isi `.env` frontend:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Jalankan frontend:

```bash
npm run dev
```

Frontend akan berjalan di:

```txt
http://127.0.0.1:5173
```

Buka browser ke URL tersebut, lalu login memakai:

```txt
Email    : test@example.com
Password : password
```

## 7. Build Frontend untuk Production

Untuk memastikan frontend tidak ada error TypeScript:

```bash
npm run build
```

Jika berhasil, hasil build ada di:

```txt
frontend/dist/
```

Preview hasil build:

```bash
npm run preview
```

## 8. Endpoint API Utama

Base URL local:

```txt
http://127.0.0.1:8000/api
```

Endpoint auth:

```txt
POST /auth/login
POST /auth/logout
GET  /me
```

Endpoint penghuni:

```txt
GET  /residents
POST /residents
GET  /residents/{resident}
PUT  /residents/{resident}
```

Endpoint rumah:

```txt
GET  /houses
POST /houses
GET  /houses/{house}
PUT  /houses/{house}
POST /houses/{house}/occupancies
```

Endpoint invoice:

```txt
GET  /invoices
POST /invoices/generate-monthly
GET  /invoices/{invoice}
```

Endpoint pembayaran:

```txt
GET  /payments
POST /payments
```

Endpoint pengeluaran:

```txt
GET  /expenses
POST /expenses
PUT  /expenses/{expense}
```

Endpoint laporan:

```txt
GET /reports/monthly-summary?year=2026
GET /reports/monthly-detail?month=2026-06
```

Dokumentasi OpenAPI tersedia di:

```txt
backend/docs/openapi.yaml
```

## 9. CORS untuk Development dan Production

Frontend local yang sudah diizinkan:

```txt
http://127.0.0.1:5173
http://localhost:5173
```

Domain production yang sudah diizinkan:

```txt
https://slowliving.galihdwi.dev
```

Jika domain frontend berubah, tambahkan origin baru di:

```txt
backend/config/cors.php
```

Setelah mengubah config di server:

```bash
php artisan optimize:clear
```

## 10. Generate Invoice Bulanan

Invoice dibuat untuk rumah yang statusnya `occupied` dan memiliki penghuni aktif.

Contoh generate invoice bulan Juni 2026:

```bash
curl -X POST http://127.0.0.1:8000/api/invoices/generate-monthly \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"month":"2026-06","due_date":"2026-06-30"}'
```

Jenis iuran default dari seeder:

```txt
Satpam     : Rp100.000
Kebersihan : Rp15.000
```

## 11. Troubleshooting

### Error: No application encryption key has been specified

Jalankan:

```bash
cd backend
php artisan key:generate
php artisan optimize:clear
```

### Error koneksi database

Pastikan `.env` backend sudah benar:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=admin_iuran_rt
DB_USERNAME=admin_iuran_rt
DB_PASSWORD=password_admin_iuran_rt
```

Lalu cek koneksi:

```bash
php artisan migrate:status
```

### Error table tidak ditemukan

Jalankan migrasi:

```bash
php artisan migrate --seed
```

### Error CORS di browser

Pastikan backend berjalan di `http://127.0.0.1:8000` dan frontend `.env` berisi:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Jika frontend memakai domain lain, tambahkan origin tersebut di `backend/config/cors.php`, lalu:

```bash
php artisan optimize:clear
```

### Upload foto KTP atau bukti tidak tampil

Jalankan:

```bash
php artisan storage:link
```

Pastikan `.env` backend:

```env
FILESYSTEM_DISK=public
```

### Port sudah digunakan

Jalankan backend di port lain:

```bash
php artisan serve --host=127.0.0.1 --port=8001
```

Jika port backend berubah, update `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8001/api
```

Lalu restart frontend:

```bash
npm run dev
```

## 12. Urutan Menjalankan Aplikasi Setiap Hari

Terminal 1:

```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Buka:

```txt
http://127.0.0.1:5173
```
