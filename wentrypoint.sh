#!/bin/bash
# ================================================================
# Script akan dijalankan setiap kali Dockerfile dipanggil, output
# dapat dibaca pada logs pipeline cicd.
# Script ini akan menjalankan perintah-perintah linux secara
# sederhana
# ----------------------------------------------------------------
# Jul 29, 2023 @wayan.dana, DevOpsSec
# ================================================================
echo "Image ini menggunakan OS:"
cat /etc/os-release
echo "Image ini menggunakan nodeJS versi:"
node -v
depcheck
npm-check
echo "Catatan: Agar coding anda baik digunakan dalam jangka panjang, gunakan versi module uptodate dan hapus modul yang tidak digunakan. Hubungi DevOps untuk keterangan lebih lanjut"
