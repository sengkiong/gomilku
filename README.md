# Go Milku

Situs product knowledge dan penjualan **SR12 Go Milku** — susu kambing etawa bubuk
varian Original, Cokelat, dan Stroberi.

Live: https://sengkiong.github.io/gomilku/

Situs statis, tanpa build step dan tanpa dependensi. HTML + CSS + JavaScript biasa.

---

## Yang masih perlu diisi

Dua hal sengaja dikosongkan dan menunggu data dari Anda.

### 1. Link affiliate

Di [`assets/js/data.js`](assets/js/data.js), objek `CTA`:

```js
CTA: {
  mode: 'off',            // ubah ke 'affiliate' setelah URL diisi
  affiliate: {
    default:  '',         // dipakai tombol umum (navbar, hero, banner, CTA bawah)
    original: '', cokelat: '', stroberi: ''
  }
}
```

Selama `mode: 'off'`, semua tombol pesan tampil tapi tidak aktif — supaya tidak
ada pesan nyasar ke nomor yang belum tentu benar. Varian yang URL-nya kosong
otomatis memakai `default`.

Mode `'wa'` juga tersedia kalau ingin kembali ke WhatsApp; isi `waNumber`
dengan kode negara tanpa `+` dan tanpa spasi.

*(Video sudah beres — lihat bagian Video di bawah.)*

---

## Struktur

```
index.html                 satu halaman, seluruh section
assets/css/styles.css      design system (navy + emas + Playfair/Poppins)
assets/js/data.js          SEMUA teks, angka gizi, dan konfigurasi
assets/js/app.js           nav, tab gizi, akordion, lightbox, scroll-reveal
assets/img/                gambar hasil olahan (satu-satunya aset di repo)
tools/optimize_images.py   pembuat assets/img/ dari aset sumber
serve.py                   server lokal dengan dukungan HTTP Range
```

Hampir semua isi halaman dirender dari `data.js`. Untuk mengubah teks, angka
gizi, judul video, atau testimoni, cukup sunting file itu — tidak perlu
menyentuh HTML.

Sumber datanya: dokumen *Product Knowledge SR12 Gomilku All Varian 2026*.

## Menjalankan secara lokal

```bash
python serve.py
```

Buka http://localhost:5173. Pakai `serve.py`, bukan `python -m http.server`,
karena yang bawaan tidak mendukung HTTP Range sehingga video tidak bisa di-seek.

## Setelah mengubah CSS atau JS: naikkan `?v=`

GitHub Pages menyajikan aset dengan `max-age=600`, jadi pengunjung yang pernah
membuka situs akan melihat versi lama sampai 10 menit. Supaya perubahan langsung
terlihat, naikkan angka versi di tiga baris pada `index.html`:

```html
<link rel="stylesheet" href="assets/css/styles.css?v=3">
<script src="assets/js/data.js?v=3"></script>
<script src="assets/js/app.js?v=3"></script>
```

`3` → `4` → `5` dan seterusnya. Angkanya bebas, yang penting berubah. Ini juga
berlaku waktu Anda mengisi link affiliate — tanpa menaikkan versinya, tombolnya
kelihatan masih mati padahal sudah diperbaiki.

## Video

Video di-host sendiri dari `assets/video/`, bukan dari YouTube. Alasannya:
pemutar YouTube selalu menampilkan nama channel di bilah atas dan itu tidak bisa
dimatikan lagi — parameter `modestbranding` dihapus YouTube pada 2023 dan
`showinfo` pada 2018. Dengan file sendiri, pemutarnya bersih total, tanpa logo,
tanpa video terkait, dan tanpa kuota.

Rekaman mentahnya (folder `Tenaga Ahli/`, 169,6 MB) tidak ikut repo. Yang masuk
adalah hasil kompresi **28,1 MB** — hemat 83%:

```bash
winget install Gyan.FFmpeg
python tools/compress_videos.py
```

Skrip itu menurunkan 60 fps ke 30 fps, memperkecil resolusi seperlunya
(540×960 untuk video tegak, 1280×720 untuk video produksi), dan mengambil satu
frame sebagai `poster` yang dipakai jadi thumbnail kartu.

Field `drive` dan `youtube` di `data.js` hanya **cadangan** — dipakai otomatis
kalau file lokalnya gagal dimuat. Keduanya menerima ID telanjang maupun URL
lengkap; untuk Drive, file wajib di-share *Anyone with the link → Viewer*.

## Membuat ulang gambar

Aset sumber (`Product/`, `Testimoni/`) tidak ada di repo. Kalau perlu membuat
ulang isi `assets/img/`, salin dulu kedua folder itu ke root, lalu:

```bash
pip install Pillow
python tools/optimize_images.py
```

Skrip ini memperkecil gambar produk (transparansi dipertahankan) dan memotong
infografis testimoni ke panel chat WhatsApp-nya saja. Koordinat crop dicatat
manual per file di dalam skrip karena posisi panelnya berbeda-beda.

## Catatan

Testimoni yang ditampilkan adalah pengalaman pribadi masing-masing individu dan
hasilnya dapat berbeda pada setiap orang. SR12 Go Milku adalah produk pangan
olahan, **bukan obat**. Disclaimer ini terpasang di halaman dan sebaiknya tidak
dihapus.
