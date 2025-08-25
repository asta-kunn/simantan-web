# Struktur Folder dan Penamaan

## src/
Folder utama yang menyimpan seluruh kode source.

## src/components/
Folder untuk komponen-komponen reusable. Gunakan nama komponen dalam bentuk PascalCase (huruf kapital pada setiap awal kata).

Contoh:
- Button
- Card  
- Modal

## src/pages/
Folder untuk komponen halaman. Setiap halaman dalam aplikasi biasanya diatur sebagai komponen besar. Nama halaman juga menggunakan PascalCase.

Contoh:
- Home
- About 
- Contact

## src/hooks/
Folder untuk custom hooks yang digunakan dalam proyek. Nama hooks biasanya diawali dengan prefix use, diikuti dengan deskripsi dalam camelCase.

Contoh:
- useAuth
- useFetchData
- useToggle

## src/services/
Folder untuk kode yang berhubungan dengan permintaan API atau services eksternal lainnya. Nama file dalam bentuk camelCase.

Contoh:
- apiService.js
- authService.js

## src/utils/
Folder untuk fungsi-fungsi utilitas yang dapat digunakan di berbagai tempat. Nama file dalam camelCase.

Contoh:
- formatDate.js
- calculateTotal.js

## src/assets/
Folder untuk aset seperti gambar, ikon, atau fonts. Subfolder dapat dibuat berdasarkan jenis aset:

Contoh subfolder:
- images
- icons
- fonts

## src/styles/
Folder untuk file CSS global atau file theme.

Contoh:
- global.css
- variables.scss
- theme.js

## src/context/
Folder untuk context API dalam React, jika digunakan. Nama file dalam bentuk PascalCase.

Contoh:
- AuthContext.js
- ThemeContext.js

## src/store/
Folder untuk state management seperti Redux. Struktur dapat diatur berdasarkan fitur aplikasi, dengan setiap fitur memiliki actions, reducers, dan selectors masing-masing.

## Tips Tambahan

- **File Index**: Setiap folder dapat memiliki index.js untuk mempermudah impor.
- **Pemisahan Berdasarkan Fitur**: Jika proyek besar, Anda bisa memisahkan folder berdasarkan fitur, seperti src/features/user/ atau src/features/products/.
- **PascalCase untuk Komponen**: Selalu gunakan PascalCase untuk komponen agar mudah dibedakan dari file lain.
- **Nama Singkat dan Deskriptif**: Berikan nama yang jelas dan singkat sesuai dengan fungsinya.

Dengan standar ini, struktur React Anda menjadi lebih teratur dan mudah dipelihara, terutama dalam tim atau proyek besar.
