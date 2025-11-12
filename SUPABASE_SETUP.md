# Supabase Backend Setup untuk BaTukang

## Kredensial Supabase
- **URL**: `https://pqeknnzavuxfzihqqxfz.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZWtubnphdnV4ZnppaHFxeGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzUxNzMsImV4cCI6MjA3MTIxMTE3M30.y-a3EewQiA8kZ_3j9mSeuPW4A4FL9TT7ZAgAKUH4UB8`

## Langkah Setup Database

### 1. Jalankan SQL Schema
Buka Supabase Dashboard → SQL Editor, kemudian jalankan file `supabase-schema.sql` yang ada di root project.

File ini akan membuat:
- Tabel `profiles` untuk data user
- Tabel `workers` untuk data tukang
- Tabel `bookings` untuk data pemesanan
- Tabel `reviews` untuk ulasan
- Tabel `gallery` untuk galeri foto pekerjaan
- Row Level Security (RLS) policies
- Triggers untuk auto-update rating

### 2. Insert Data Sample (Opsional)

Setelah schema dibuat, Anda bisa menambahkan data sample untuk testing:

```sql
-- Insert sample user (password: password123)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'user@example.com', '$2a$10$rKvVvJ8xN7qZxZxZxZxZxOxZxZxZxZxZxZxZxZxZxZxZxZxZxZx', NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'tukang@example.com', '$2a$10$rKvVvJ8xN7qZxZxZxZxZxOxZxZxZxZxZxZxZxZxZxZxZxZxZxZx', NOW(), NOW(), NOW());

-- Insert profiles
INSERT INTO profiles (id, email, name, phone, role, avatar, location)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'user@example.com', 'Andi Susanto', '+62 812-3456-7890', 'user', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2', 'Jl. Tadulako No. 123, Palu Barat'),
  ('550e8400-e29b-41d4-a716-446655440001', 'tukang@example.com', 'Pak Budi Santoso', '+62 812-9876-5432', 'tukang', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2', 'Palu Barat, Sulawesi Tengah');

-- Insert worker profile
INSERT INTO workers (user_id, category, rating, reviews_count, price, experience, description, services, completed_jobs)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Tukang Listrik', 4.8, 127, 75000, '15 tahun', 'Pengalaman 15 tahun dalam bidang instalasi listrik rumah dan komersial. Spesialisasi dalam perbaikan korsleting, pemasangan lampu, dan instalasi panel listrik.', 
   ARRAY['Instalasi Listrik', 'Perbaikan Korsleting', 'Pemasangan Lampu', 'Panel Listrik'], 1247);

-- Insert gallery
INSERT INTO gallery (worker_id, image_url)
SELECT id, 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
FROM workers WHERE user_id = '550e8400-e29b-41d4-a716-446655440001'
UNION ALL
SELECT id, 'https://images.pexels.com/photos/159358/electrical-installation-electric-electricity-159358.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
FROM workers WHERE user_id = '550e8400-e29b-41d4-a716-446655440001';
```

### 3. Konfigurasi Authentication

Di Supabase Dashboard → Authentication → Settings:
- Enable Email provider
- Disable Email Confirmations (untuk development)
- Set Site URL ke URL aplikasi Anda

### 4. Test Koneksi

Jalankan aplikasi dan coba:
1. Register user baru
2. Login dengan user yang sudah dibuat
3. Browse daftar tukang
4. Lihat detail tukang

## Struktur Database

### Tabel `profiles`
- Menyimpan data dasar semua user (user, tukang, admin)
- Terhubung dengan `auth.users` via foreign key

### Tabel `workers`
- Menyimpan data spesifik untuk user dengan role 'tukang'
- Terhubung dengan `profiles` via `user_id`

### Tabel `bookings`
- Menyimpan data pemesanan
- Terhubung dengan `profiles` (user) dan `workers`

### Tabel `reviews`
- Menyimpan ulasan dari user untuk tukang
- Auto-update rating tukang via trigger

### Tabel `gallery`
- Menyimpan foto-foto pekerjaan tukang

## API Services

Aplikasi menggunakan service layer di `lib/services/`:
- `workers.ts` - CRUD operations untuk data tukang
- `bookings.ts` - CRUD operations untuk pemesanan
- `reviews.ts` - CRUD operations untuk ulasan

## Authentication Flow

1. User register → Create auth user + profile + worker (jika role tukang)
2. User login → Fetch profile + worker data (jika tukang)
3. Session management via Supabase Auth dengan AsyncStorage

## Security

- Row Level Security (RLS) enabled di semua tabel
- Policies mengatur akses berdasarkan user role
- Users hanya bisa update data mereka sendiri
- Reviews dan bookings memiliki validasi ownership

## Troubleshooting

### Error: "relation does not exist"
- Pastikan schema SQL sudah dijalankan dengan benar
- Check di Supabase Dashboard → Table Editor

### Error: "JWT expired"
- Refresh session atau login ulang
- Check token expiry di Supabase settings

### Error: "permission denied"
- Check RLS policies
- Pastikan user sudah authenticated

## Development Tips

1. Gunakan Supabase Studio (local) untuk development
2. Enable logging di `lib/supabase.ts` untuk debugging
3. Test RLS policies di SQL Editor
4. Backup database sebelum perubahan schema major

## Production Checklist

- [ ] Enable email confirmations
- [ ] Set proper CORS settings
- [ ] Configure rate limiting
- [ ] Enable database backups
- [ ] Set up monitoring
- [ ] Review and tighten RLS policies
- [ ] Add indexes untuk query optimization
