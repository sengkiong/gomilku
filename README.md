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

### 2. Video

File `.mp4` tidak ikut di repo (±174 MB, terlalu besar untuk GitHub Pages), jadi
video diambil dari sumber eksternal. Dua pilihan, keduanya menerima **ID
telanjang maupun URL lengkap** yang disalin dari address bar:

```js
experts: [
  { drive: '', youtube: 'https://youtube.com/shorts/XXXXXXXXXXX', ... },
]
productionDrive: '',
productionYoutube: 'https://youtu.be/XXXXXXXXXXX',
```

**Google Drive** — unggah, lalu klik kanan → Share → ubah "Restricted" jadi
**"Anyone with the link"** peran *Viewer*. Wajib; kalau masih Restricted,
pengunjung dapat halaman login. Salin URL `drive.google.com/file/d/FILE_ID/view`
ke field `drive`. Perhatikan Drive punya kuota unduh harian per file — kalau satu
video ramai ditonton, Drive bisa menolak sementara dengan pesan *"Sorry, you
can't view or download this file at this time"*.

**YouTube** — terima bentuk apa pun: `youtu.be/...`, `/shorts/...`, `watch?v=...`.
Tidak ada batas kuota, lebih tahan trafik.

Kalau keduanya diisi, `drive` yang dipakai. Kalau dua-duanya kosong, situs jatuh
ke file lokal `src` — jalan di komputer sendiri, dan di GitHub Pages muncul pesan
bahwa video belum tersedia.

Pakai `portrait: true` untuk video rekaman tegak (Shorts / video HP) supaya tidak
dipaksa 16:9 dan penuh bilah hitam.

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
