"""Menyiapkan aset gambar untuk situs Go Milku.

- Produk : diperkecil ke lebar maks 900 px, transparansi (alpha) dipertahankan,
           diekspor sebagai WebP + PNG fallback.
- Testimoni : di-crop ke panel chat WhatsApp-nya saja (logo SR12, latar berwarna,
           kutipan, dan foto kemasan dibuang), lalu diekspor WebP + JPG fallback.

Aset asli di Product/ dan Testimoni/ tidak pernah ditimpa — semua hasil
ditulis ke assets/img/.

Jalankan:  python tools/optimize_images.py
"""

import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "img")

PRODUCT_MAX_W = 900
TESTI_MAX_W = 900

# Produk: nama file sumber -> (nama dasar hasil, kanvas seragam atau None)
#
# File sumber punya framing yang berbeda-beda: dua kotak 200 g persegi dengan
# banyak ruang kosong, sedangkan stroberi potret dan hampir penuh. Kalau
# dipasang apa adanya, kotak stroberi terlihat jauh lebih besar di kartu.
# Karena itu gambar varian dipotong ke batas piksel non-transparan lalu
# ditempel di tengah kanvas 900x1200 — hasilnya ketiga kartu punya skala sama.
# Nilai None berarti hanya dipangkas (dipakai untuk foto tiga kemasan di hero,
# yang bentuknya melebar).
PRODUCTS = {
    "all gomilku 600gr.png": ("gomilku-all-600", None),
    "gomilku original 200g.png": ("gomilku-original", (900, 1200)),
    "gomilku cokelat 200g.png": ("gomilku-cokelat", (900, 1200)),
    "gomilku stroberi 200g.png": ("gomilku-stroberi", (900, 1200)),
    "gomilku original 600g.png": ("gomilku-original-600", (900, 1200)),
}

# Kotak crop panel chat, dalam fraksi (kiri, atas, kanan, bawah) terhadap
# ukuran gambar. Dicatat manual per gambar karena posisi panelnya berbeda-beda
# (sebagian besar di kiri; 07-24-00 panelnya di sisi kanan).
# File yang tidak terdaftar di sini tidak di-crop.
CROPS = {
    "photo_2026-08-01_07-22-42.jpg": (0.052, 0.160, 0.505, 0.858),
    "photo_2026-08-01_07-22-49.jpg": (0.050, 0.212, 0.520, 0.756),
    "photo_2026-08-01_07-22-52.jpg": (0.047, 0.196, 0.503, 0.779),
    "photo_2026-08-01_07-22-56.jpg": (0.035, 0.154, 0.456, 0.886),
    "photo_2026-08-01_07-23-16.jpg": (0.027, 0.144, 0.506, 0.872),
    "photo_2026-08-01_07-23-21.jpg": (0.058, 0.306, 0.558, 0.650),
    "photo_2026-08-01_07-23-25.jpg": (0.035, 0.214, 0.491, 0.752),
    "photo_2026-08-01_07-23-32.jpg": (0.030, 0.158, 0.491, 0.912),
    "photo_2026-08-01_07-23-37.jpg": (0.024, 0.236, 0.562, 0.672),
    "photo_2026-08-01_07-23-43.jpg": (0.030, 0.204, 0.512, 0.759),
    "photo_2026-08-01_07-24-00.jpg": (0.500, 0.021, 0.961, 0.971),
}


def fit(im, max_w):
    """Perkecil proporsional bila lebih lebar dari max_w."""
    if im.width <= max_w:
        return im
    h = round(im.height * max_w / im.width)
    return im.resize((max_w, h), Image.LANCZOS)


def kb(path):
    return round(os.path.getsize(path) / 1024)


def trim_alpha(im):
    """Pangkas ruang transparan di sekeliling produk."""
    box = im.getbbox()
    return im.crop(box) if box else im


def to_canvas(im, size, fill=0.94):
    """Tempel di tengah kanvas transparan berukuran `size`, mengisi `fill` bagian."""
    cw, ch = size
    scale = min(cw * fill / im.width, ch * fill / im.height)
    im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.paste(im, ((cw - im.width) // 2, (ch - im.height) // 2), im)
    return canvas


def do_products():
    src_dir = os.path.join(ROOT, "Product")
    for name, (stem, canvas) in PRODUCTS.items():
        src = os.path.join(src_dir, name)
        if not os.path.exists(src):
            print(f"  ! lewati (tidak ada): {name}")
            continue

        im = Image.open(src)
        # RGBA wajib dipertahankan: latar transparan inilah yang membuat kotak
        # susu menempel mulus di atas kartu emas, tanpa kotak putih.
        if im.mode != "RGBA":
            im = im.convert("RGBA")

        im = trim_alpha(im)
        im = to_canvas(im, canvas) if canvas else fit(im, PRODUCT_MAX_W)

        webp = os.path.join(OUT, stem + ".webp")
        png = os.path.join(OUT, stem + ".png")
        im.save(webp, "WEBP", quality=86, method=6)
        im.save(png, "PNG", optimize=True)
        print(f"  {stem:22} {im.width}x{im.height}  webp {kb(webp)} KB  png {kb(png)} KB")


def do_testimonials():
    src_dir = os.path.join(ROOT, "Testimoni")
    for i, name in enumerate(sorted(os.listdir(src_dir)), start=1):
        if not name.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        im = Image.open(os.path.join(src_dir, name)).convert("RGB")

        box = CROPS.get(name)
        if box:
            left, top, right, bottom = box
            im = im.crop((
                round(left * im.width), round(top * im.height),
                round(right * im.width), round(bottom * im.height),
            ))
        else:
            print(f"  ! tanpa crop (belum terdaftar): {name}")

        im = fit(im, TESTI_MAX_W)

        stem = f"testi-{i:02d}"
        webp = os.path.join(OUT, stem + ".webp")
        jpg = os.path.join(OUT, stem + ".jpg")
        im.save(webp, "WEBP", quality=82, method=6)
        im.save(jpg, "JPEG", quality=84, optimize=True, progressive=True)
        print(f"  {stem:22} {im.width}x{im.height}  webp {kb(webp)} KB  jpg {kb(jpg)} KB")


def main():
    os.makedirs(OUT, exist_ok=True)
    print("Produk:")
    do_products()
    print("\nTestimoni (crop ke panel chat):")
    do_testimonials()
    print(f"\nSelesai. Hasil ada di {OUT}")


if __name__ == "__main__":
    main()
