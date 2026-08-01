/* ==========================================================================
   Go Milku — data sumber halaman
   Semua teks & angka gizi ditranskrip dari:
   "Product Knowledge SR12 Gomilku All Varian (Original, Cokelat, Strawberry) 2026.pdf"
   ========================================================================== */

window.GOMILKU = {

  /* ==================================================================
     PENGATURAN TOMBOL PESAN (CTA)
     ------------------------------------------------------------------
     mode 'off'       -> tombol tampil tapi tidak aktif. Dipakai selama
                         link affiliate belum siap, supaya tidak ada
                         pesan nyasar ke nomor yang bukan milik Anda.
     mode 'affiliate' -> tombol membuka URL affiliate di bawah.
                         Varian yang URL-nya kosong ikut URL default.
     mode 'wa'        -> semua tombol membuka WhatsApp ke waNumber.

     LANGKAH SAAT LINK AFFILIATE SUDAH ADA:
       1. isi affiliate.default (dan per varian kalau berbeda)
       2. ubah mode: 'off'  ->  mode: 'affiliate'
     ================================================================== */
  CTA: {
    mode: 'off',

    // kode negara tanpa "+" dan tanpa spasi. Belum diisi nomor asli.
    waNumber: '6281234567890',

    affiliate: {
      default: '',    // dipakai tombol umum (navbar, hero, banner, CTA bawah)
      original: '',
      cokelat: '',
      stroberi: ''
    }
  },

  brand: {
    name: 'Go Milku',
    parent: 'SR12',
    tagline: 'Susu Kambing Etawa Bubuk',
    halal: 'ID33110015719330124'
  },

  /* ------------------------------ VARIAN ------------------------------ */
  variants: [
    {
      id: 'original',
      name: 'Original',
      full: 'SR12 Go Milku Original',
      tagline: 'Rasa susu etawa murni. Netral, lembut, cocok untuk konsumsi harian seluruh keluarga.',
      bpom: 'BPOM RI MD 271111000300341',
      image: 'assets/img/gomilku-original',
      highlights: [
        { label: 'Energi', value: '120 kkal' },
        { label: 'Protein', value: '3 g' },
        { label: 'Vitamin E', value: '100% AKG' }
      ],
      komposisi: 'Susu kambing etawa (±40%), NDC, Maltodekstrin, Padatan Susu, Gula, Madu, Daun Kelor, Ekstrak Ikan Gabus.'
    },
    {
      id: 'cokelat',
      name: 'Cokelat',
      full: 'SR12 Go Milku Cokelat',
      tagline: 'Bubuk kakao asli menutup aroma khas kambing. Protein tertinggi di antara ketiga varian.',
      bpom: 'BPOM RI MD 271111000500341',
      image: 'assets/img/gomilku-cokelat',
      highlights: [
        { label: 'Energi', value: '140 kkal' },
        { label: 'Protein', value: '7 g' },
        { label: 'Vitamin E', value: '100% AKG' }
      ],
      komposisi: 'Susu kambing etawa (±40%), NDC, Maltodekstrin, Padatan Susu, Gula, Madu, Daun Kelor, Ekstrak Ikan Gabus, Bubuk kakao.'
    },
    {
      id: 'stroberi',
      name: 'Stroberi',
      full: 'SR12 Go Milku Stroberi',
      tagline: 'Pewarna alami dari bit merah dan perisa stroberi. Favorit anak-anak yang susah minum susu.',
      bpom: 'BPOM RI MD 271111000700341',
      image: 'assets/img/gomilku-stroberi',
      highlights: [
        { label: 'Energi', value: '130 kkal' },
        { label: 'Protein', value: '5 g' },
        { label: 'Vitamin E', value: '100% AKG' }
      ],
      komposisi: 'Susu kambing etawa (±40%), NDC, Maltodekstrin, Padatan Susu, Gula, Madu, Daun Kelor, Ekstrak Ikan Gabus, Pewarna alami merah bit, Perisa sintetik stroberi.'
    }
  ],

  sizes: ['Sachet 25 g', '200 g', '600 g'],

  /* --------------------------- NILAI GIZI ---------------------------
     Takaran saji 25 g · 8 sajian per kemasan (200 g)
     akg: null = tidak dicantumkan pada label
     ------------------------------------------------------------------ */
  nutrition: {
    original: {
      energi: { total: '120 kkal', lemak: '30 kkal', lemakJenuh: '25 kkal' },
      makro: [
        { name: 'Lemak Total', value: '3,5 g', akg: 5 },
        { name: 'Lemak Jenuh', value: '2,5 g', akg: 13 },
        { name: 'Kolesterol', value: '0 mg', akg: 0 },
        { name: 'Protein', value: '3 g', akg: 5 },
        { name: 'Karbohidrat', value: '21 g', akg: 6 },
        { name: 'Serat Pangan', value: '5 g', akg: 18 },
        { name: 'Sukrosa', value: '3 g', akg: null },
        { name: 'Garam (Natrium)', value: '60 mg', akg: 4 }
      ],
      mikro: [
        { name: 'Vitamin A', akg: 8 },
        { name: 'Vitamin D', akg: 35 },
        { name: 'Vitamin E', akg: 100 },
        { name: 'Vitamin B6', akg: 40 },
        { name: 'Asam Folat', akg: 15 },
        { name: 'Kalsium', akg: 10 },
        { name: 'Fosfor', akg: 10 },
        { name: 'Magnesium', akg: 20 },
        { name: 'Zat Besi', akg: 40 },
        { name: 'Iodium', akg: 20 },
        { name: 'Kolin', akg: 10 },
        { name: 'Kalium', akg: 2 }
      ]
    },
    cokelat: {
      energi: { total: '140 kkal', lemak: '30 kkal', lemakJenuh: '25 kkal' },
      makro: [
        { name: 'Lemak Total', value: '3,5 g', akg: 5 },
        { name: 'Lemak Jenuh', value: '2,5 g', akg: 13 },
        { name: 'Kolesterol', value: '0 mg', akg: 0 },
        { name: 'Protein', value: '7 g', akg: 11 },
        { name: 'Karbohidrat', value: '21 g', akg: 6 },
        { name: 'Serat Pangan', value: '5 g', akg: 18 },
        { name: 'Sukrosa', value: '3 g', akg: null },
        { name: 'Garam (Natrium)', value: '65 mg', akg: 4 }
      ],
      mikro: [
        { name: 'Vitamin A', akg: 8 },
        { name: 'Vitamin D', akg: 35 },
        { name: 'Vitamin E', akg: 100 },
        { name: 'Vitamin B6', akg: 40 },
        { name: 'Asam Folat', akg: 15 },
        { name: 'Kalsium', akg: 10 },
        { name: 'Fosfor', akg: 10 },
        { name: 'Magnesium', akg: 20 },
        { name: 'Zat Besi', akg: 40 },
        { name: 'Iodium', akg: 20 },
        { name: 'Kolin', akg: 10 },
        { name: 'Kalium', akg: 4 }
      ]
    },
    stroberi: {
      energi: { total: '130 kkal', lemak: '30 kkal', lemakJenuh: '25 kkal' },
      makro: [
        { name: 'Lemak Total', value: '3 g', akg: 5 },
        { name: 'Lemak Jenuh', value: '2,5 g', akg: 13 },
        { name: 'Kolesterol', value: '0 mg', akg: 0 },
        { name: 'Protein', value: '5 g', akg: 8 },
        { name: 'Karbohidrat', value: '21 g', akg: 6 },
        { name: 'Serat Pangan', value: '5 g', akg: 18 },
        { name: 'Sukrosa', value: '3 g', akg: null },
        { name: 'Garam (Natrium)', value: '60 mg', akg: 4 }
      ],
      mikro: [
        { name: 'Vitamin A', akg: 8 },
        { name: 'Vitamin D', akg: 40 },
        { name: 'Vitamin E', akg: 100 },
        { name: 'Vitamin B6', akg: 40 },
        { name: 'Asam Folat', akg: 15 },
        { name: 'Kalsium', akg: 10 },
        { name: 'Fosfor', akg: 10 },
        { name: 'Magnesium', akg: 20 },
        { name: 'Zat Besi', akg: 40 },
        { name: 'Iodium', akg: 20 },
        { name: 'Kolin', akg: 10 },
        { name: 'Kalium', akg: 2 }
      ]
    }
  },

  /* ------------------------- KANDUNGAN UTAMA ------------------------- */
  ingredients: [
    {
      id: 'etawa',
      name: 'Susu Kambing Etawa',
      badge: '±40% komposisi',
      lead: 'Susu kambing peranakan etawa dari peternakan Magelang, Wonosobo, dan Sleman — Jawa Tengah. Pakan konsentrat dan daun hijau pagi–sore, diperah 2× sehari, 1–2 liter per ekor per hari.',
      points: [
        ['Kesehatan & kepadatan tulang', 'Kalsium dibutuhkan untuk pembentukan dan perawatan jaringan rangka. Densitas mineral tulang yang normal menurunkan risiko fraktur dan osteoporosis.'],
        ['Kesehatan saluran pernapasan', 'Kandungan fluorine bersifat antiseptik alami, baik untuk menjaga kesehatan pernapasan dan paru-paru.'],
        ['Sistem imun tetap fit', 'Globul lemaknya sangat kecil sehingga vitamin dan mineral lebih mudah diserap tanpa membebani pencernaan.'],
        ['Jantung & pembuluh darah', 'MCT (Medium Chain Triglyceride) langsung dimetabolisme hati menjadi energi — tidak disimpan sebagai lemak cadangan maupun diubah jadi kolesterol.'],
        ['Lambung & saluran cerna', 'Bersifat alkali/basa sehingga menetralkan kondisi saluran cerna yang asam. Aman dikonsumsi rutin oleh pemilik riwayat maag.'],
        ['Alternatif alergi susu sapi', 'Kandungan laktosa lebih rendah dari susu sapi, sehingga lebih mudah diterima tubuh — terutama anak dengan intoleransi susu sapi.']
      ]
    },
    {
      id: 'gabus',
      name: 'Ekstrak Ikan Gabus',
      badge: 'Sumber albumin',
      lead: 'Ikan gabus memiliki kadar protein tertinggi dibanding jenis ikan sejenis, dengan protein albumin sebagai kandungan andalannya.',
      points: [
        ['Membantu merawat luka', 'Albumin merangsang sel jaringan untuk beregenerasi, membantu luka ringan maupun luka pasca operasi lebih cepat kering melalui pembentukan jaringan fibrin baru.'],
        ['Kesehatan & perkembangan otak', 'Mengandung asam amino serta DHA dari Omega 3 dan Omega 9 yang dibutuhkan untuk pengembangan sel otak, terutama anak di masa generasi emas.'],
        ['Sumber zat gizi', 'Protein, omega, vitamin, dan mineral untuk memenuhi kebutuhan nutrisi harian tubuh.']
      ]
    },
    {
      id: 'kelor',
      name: 'Daun Kelor',
      badge: 'ASI booster',
      lead: 'Daun kelor dikenal sebagai salah satu sumber mikronutrien paling lengkap: tinggi zat besi, kalsium, Vitamin A, betakaroten, Vitamin C, zinc, dan serat.',
      points: [
        ['Membantu melancarkan ASI', 'Zat besi dan kalsium merupakan kofaktor pembentukan dan pengeluaran ASI — membantu ibu menyusui yang produksinya belum mencukupi.'],
        ['Sumber gizi & nutrisi', 'Memenuhi kebutuhan nutrisi harian yang meningkat pada masa kehamilan dan menyusui.']
      ]
    },
    {
      id: 'madu',
      name: 'Madu',
      badge: 'Pemanis alami',
      lead: 'Madu menyumbang rasa manis alami sekaligus mikronutrien: asam amino, asam lemak, kalsium, fosfor, potasium, sodium, zat besi, serta enzim amilase dan lisozim.',
      points: [
        ['Mencukupi kebutuhan gizi harian', 'Vitamin A, B, C dan mineral (zat besi, fosfor, natrium, kalium) yang juga bersifat antioksidan membantu menangkal radikal bebas.'],
        ['Memelihara sistem imun', 'Sumber karbohidrat dan zat besi. Kandungan magnesiumnya setara magnesium dalam darah, dan zat besinya membantu meningkatkan kadar hemoglobin.'],
        ['Membantu mencegah anemia', 'Peningkatan jumlah eritrosit berperan dalam pencegahan kondisi anemia.']
      ]
    }
  ],

  /* --------------------- SUSU KAMBING VS SUSU SAPI --------------------- */
  comparison: [
    ['Protein penyebab alergi', 'Tidak mengandung protein kompleks penyebab alergi', 'Mengandung beberapa protein yang menyebabkan alergi'],
    ['Kandungan asam lemak', 'Lebih tinggi', 'Lebih rendah'],
    ['Sifat pH', 'Lebih bersifat alkali (mirip seperti ASI)', 'Sedikit lebih bersifat asam'],
    ['Lama dicerna lambung', '± 20 menit', '2–3 jam'],
    ['Kandungan kalsium', 'Tinggi', 'Lebih rendah dari susu kambing (tergantung merk)'],
    ['Vitamin & mineral', 'Beberapa kandungannya lebih tinggi', 'Beberapa kandungannya lebih rendah (tergantung merk)'],
    ['Kandungan laktosa', 'Lebih kecil dari susu sapi', 'Cenderung lebih besar'],
    ['Untuk yang alergi susu sapi', 'Merupakan susu alternatif', 'Berpotensi menyebabkan alergi (diare/kembung/gatal)']
  ],

  /* --------------------------- CARA KONSUMSI --------------------------- */
  servingSteps: [
    ['Cuci tangan & peralatan', 'Cuci tangan sebelum menyiapkan susu, dan pastikan semua peralatan bersih.'],
    ['Tuang 150 ml air panas', 'Gunakan air panas atau hangat sesuai selera ke dalam gelas.'],
    ['Masukkan 2–3 sendok takar', 'Setara 25 gram atau 1 sachet Go Milku.'],
    ['Aduk hingga larut merata', 'Susu siap dihidangkan dan sebaiknya langsung diminum.'],
    ['Habiskan maksimal 1 jam', 'Jangan biarkan seduhan lebih dari 1 jam setelah pembuatan.']
  ],

  servingNotes: [
    'Dapat dikonsumsi 2× sehari.',
    'Untuk awal konsumsi, mulai dari dosis dan frekuensi rendah serta diminum setelah makan, lalu tingkatkan perlahan sesuai metabolisme tubuh.',
    'Agar lebih nikmat dapat disajikan bersama sari kurma atau madu.',
    'Direkomendasikan untuk usia 1 tahun ke atas — di bawah 1 tahun tetap ASI eksklusif sebagai sumber susu utama.'
  ],

  /* ------------------------ REAKSI AWAL KONSUMSI ------------------------ */
  reactions: [
    ['Mual atau ingin muntah', 'Susu kambing cenderung basa, sehingga saat menetralkan saluran cerna yang asam dapat muncul gas flatulensi berupa tahak atau kentut — ini normal. Jika terus terasa berlebihan, kemungkinan tubuh kurang cocok dengan susu kambing.'],
    ['Pusing atau lemas', 'Penyesuaian penyerapan kadar oksigen dalam darah dapat memicu pusing, umumnya pada orang dengan kadar gula rendah atau yang sedang berdiet. Bila memiliki riwayat gula/tekanan darah rendah, konsumsi bersama sari kurma atau madu.'],
    ['Alergi', 'Dapat berupa gatal, kemerahan, bengkak, ruam bentol, atau sesak napas pada orang yang sensitif terhadap salah satu kandungan — terutama protein hewani susu kambing, ikan gabus, atau laktosa.'],
    ['BAB lebih lancar', 'Globul susu kambing sangat kecil sehingga sangat mudah dicerna. Pada yang sensitif, BAB dapat menjadi lebih lunak — namun bukan diare (diare bila frekuensi BAB lebih dari 4× sehari disertai feses melunak).']
  ],

  /* --------------------------- PROSES PRODUKSI --------------------------- */
  process: [
    ['Peternakan', 'Susu kambing peranakan etawa bersumber dari peternakan mitra di Magelang, Wonosobo, dan Sleman, Jawa Tengah.'],
    ['Pemberian Pakan', 'Kambing diberi pakan konsentrat dan daun hijau dua kali sehari, pagi dan sore, untuk menjaga mutu susu.'],
    ['Pemerahan', 'Pemerahan dilakukan 2× sehari dengan hasil 1–2 liter per ekor per hari, langsung ditangani segar.'],
    ['Produksi', 'Susu segar diolah menjadi bubuk dan diformulasikan bersama daun kelor, ekstrak ikan gabus, madu, dan NDC.'],
    ['Uji Mutu & Legalitas', 'Setiap varian terdaftar BPOM RI MD dan bersertifikat halal ' + 'ID33110015719330124.'],
    ['Pengemasan', 'Dikemas dalam sachet 25 g, kotak 200 g, dan 600 g. Simpan di tempat kering di bawah 30°C, terhindar dari sinar matahari.']
  ],

  /* ------------------------- BANNER GROSIR/RESELLER ------------------------- */
  wholesale: {
    eyebrow: 'Grosir & Reseller',
    title: 'Paket Khusus Komunitas, Klinik, dan Posyandu',
    desc: 'Harga khusus untuk pembelian karton, program stunting, majelis, dan kegiatan komunitas. Konsultasikan kebutuhan Anda.',
    cta: 'Konsultasi Paket'
  },

  /* ----------------------------- TUJUAN BISNIS ----------------------------- */
  businessGoals: [
    'Menghadirkan susu kambing etawa berkualitas dengan harga yang terjangkau bagi keluarga Indonesia.',
    'Bermitra dengan peternak lokal di Magelang, Wonosobo, dan Sleman untuk menjaga mutu sekaligus ekonomi desa.',
    'Menjaga legalitas dan mutu setiap batch: terdaftar BPOM RI MD dan bersertifikat halal.',
    'Mendukung program gizi masyarakat — posyandu, majelis, dan kegiatan pencegahan stunting.'
  ],

  /* ==================================================================
     VIDEO
     ------------------------------------------------------------------
     File .mp4 TIDAK ikut di repo (terlalu besar untuk GitHub Pages),
     jadi di situs online video diambil dari YouTube.

     CARA MENGISI:
       1. unggah videonya ke YouTube (boleh "Unlisted")
       2. ambil ID dari URL — youtu.be/XXXXXXXXXXX  ->  XXXXXXXXXXX
       3. tempel ID itu ke field `youtube` di bawah

     Selama `youtube` masih kosong, halaman memakai file lokal `src`
     (jalan di komputer sendiri, tapi kosong di GitHub Pages).
     ================================================================== */
  experts: [
    {
      youtube: 'https://youtube.com/shorts/RE3VTu9mtx0?feature=share',
      src: 'Tenaga Ahli/WhatsApp Video 2025-10-06 at 12.43.25.mp4',
      title: 'Mengenal SR12 Go Milku',
      desc: 'Pengantar produk dan siapa yang cocok mengonsumsinya.'
    },
    {
      youtube: 'https://youtube.com/shorts/Jxs2RfsqdZg?feature=share',
      src: 'Tenaga Ahli/WhatsApp Video 2025-10-06 at 12.48.30.mp4',
      title: 'Kandungan & Manfaat',
      desc: 'Susu etawa, daun kelor, ikan gabus, dan madu.'
    },
    {
      youtube: 'https://youtube.com/shorts/tkYBmBurKQI?feature=share',
      src: 'Tenaga Ahli/WhatsApp Video 2025-10-06 at 12.48.32.mp4',
      title: 'Cara Konsumsi yang Tepat',
      desc: 'Takaran, frekuensi, dan waktu terbaik meminumnya.'
    },
    {
      youtube: 'https://youtube.com/shorts/sDu5WiBRE_w?feature=share',
      src: 'Tenaga Ahli/WhatsApp Video 2025-10-06 at 12.48.34.mp4',
      title: 'Reaksi Awal & Adaptasi',
      desc: 'Apa yang wajar terjadi di hari-hari pertama.'
    }
  ],

  productionYoutube: 'https://youtu.be/LTauG9wSP-k?feature=share',
  productionVideo: 'Produksi GoMilku_1 Menit.mp4',

  /* ------------------------------ TESTIMONI ------------------------------
     Hasil crop panel chat WhatsApp dari infografis asli di folder Testimoni/.
     Dibuat oleh tools/optimize_images.py — jalankan ulang skrip itu kalau
     sumbernya berubah.
     -------------------------------------------------------------------- */
  testimonials: [
    'assets/img/testi-01', 'assets/img/testi-02', 'assets/img/testi-03',
    'assets/img/testi-04', 'assets/img/testi-05', 'assets/img/testi-06',
    'assets/img/testi-07', 'assets/img/testi-08', 'assets/img/testi-09',
    'assets/img/testi-10', 'assets/img/testi-11'
  ]
};
