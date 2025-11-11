# BaTukang - EAS Build Instructions

Proyek BaTukang sudah dikonfigurasi untuk build dengan EAS (Expo Application Services). Berikut adalah langkah-langkah untuk melakukan build:

## Prerequisites
- [x] EAS CLI sudah terinstall
- [x] Expo account sudah login (ifailamir)
- [x] Project sudah terhubung ke EAS (Project ID: be28c06a-d46b-4e34-bfd7-1186c46a841a)
- [x] Git repository sudah diinisialisasi
- [x] expo-dev-client sudah terinstall

## Build Profiles yang Tersedia

### 1. Development Build
```bash
export PATH="/opt/homebrew/bin:$PATH"
eas build --platform android --profile development
```
- Untuk testing dengan Expo Dev Client
- Memerlukan keystore (akan dibuat otomatis saat pertama kali)

### 2. Preview Build  
```bash
export PATH="/opt/homebrew/bin:$PATH"
eas build --platform android --profile preview
```
- Untuk internal testing
- Menghasilkan APK yang bisa diinstall langsung

### 3. Production Build
```bash
export PATH="/opt/homebrew/bin:$PATH"
eas build --platform android --profile production
```
- Untuk submission ke Google Play Store
- Menghasilkan AAB (Android App Bundle)

## Build untuk iOS
```bash
export PATH="/opt/homebrew/bin:$PATH"
eas build --platform ios --profile preview
```

## Build untuk Semua Platform
```bash
export PATH="/opt/homebrew/bin:$PATH"
eas build --platform all --profile preview
```

## Catatan Penting

1. **Keystore Generation**: Saat pertama kali build Android, EAS akan meminta untuk membuat keystore baru. Pilih "Yes" untuk membuat keystore otomatis.

2. **Interactive Mode**: Build harus dijalankan dalam mode interaktif untuk setup credentials pertama kali.

3. **Build Status**: Setelah build dimulai, Anda bisa memonitor progress di:
   - Terminal output
   - Expo dashboard: https://expo.dev/accounts/ifailamir/projects/batukang

4. **Download Build**: Setelah build selesai, download link akan tersedia di terminal dan dashboard.

## Troubleshooting

Jika mengalami masalah dengan PATH, pastikan Homebrew path sudah ditambahkan:
```bash
export PATH="/opt/homebrew/bin:$PATH"
```

Atau tambahkan ke ~/.zshrc untuk permanent:
```bash
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## App Information
- **App Name**: BaTukang
- **Bundle ID**: com.ifailamir.batukang
- **Package Name**: com.ifailamir.batukang
- **Version**: 1.0.0
