"""Mengompresi video Go Milku agar muat di repo dan bisa di-host sendiri.

Kenapa di-host sendiri: pemutar YouTube selalu menampilkan nama channel di
bilah atas dan itu tidak bisa dimatikan lagi (parameter modestbranding dan
showinfo sudah dihapus YouTube). Dengan file sendiri, pemutarnya bersih total.

Sumbernya sangat boros — video tenaga ahli direkam 60 fps dan video produksi
11,45 Mbps untuk 1080p. Turun ke 30 fps dengan resolusi secukupnya memangkas
ukuran drastis tanpa perbedaan yang terlihat di ukuran tampil situs.

Selain video, skrip ini juga mengambil satu frame sebagai poster — dipakai
jadi thumbnail kartu supaya tidak lagi berupa gradien polos.

Butuh ffmpeg:  winget install Gyan.FFmpeg
Jalankan:      python tools/compress_videos.py
"""

import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "video")

WINGET_BIN = os.path.join(
    os.environ.get("LOCALAPPDATA", ""),
    r"Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe"
    r"\ffmpeg-8.1.2-full_build\bin",
)

# (file sumber, nama hasil, lebar maks, tinggi maks, CRF, detik untuk poster)
JOBS = [
    ("Tenaga Ahli/WhatsApp Video 2025-10-06 at 12.43.25.mp4", "ahli-01", 540, 960, 27, 1.0),
    ("Tenaga Ahli/WhatsApp Video 2025-10-06 at 12.48.30.mp4", "ahli-02", 540, 960, 27, 1.0),
    ("Tenaga Ahli/WhatsApp Video 2025-10-06 at 12.48.32.mp4", "ahli-03", 540, 960, 27, 1.0),
    ("Tenaga Ahli/WhatsApp Video 2025-10-06 at 12.48.34.mp4", "ahli-04", 540, 960, 27, 1.0),
    ("Produksi GoMilku_1 Menit.mp4", "produksi", 1280, 720, 26, 2.0),
]


def tool(name):
    """Cari ffmpeg/ffprobe di PATH, lalu di lokasi pemasangan winget."""
    found = shutil.which(name)
    if found:
        return found
    candidate = os.path.join(WINGET_BIN, name + ".exe")
    if os.path.exists(candidate):
        return candidate
    sys.exit(f"{name} tidak ditemukan. Pasang dulu: winget install Gyan.FFmpeg")


FFMPEG = tool("ffmpeg")
FFPROBE = tool("ffprobe")


def probe(path):
    out = subprocess.run(
        [FFPROBE, "-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", path],
        capture_output=True, text=True, check=True,
    ).stdout
    data = json.loads(out)
    video = next(s for s in data["streams"] if s["codec_type"] == "video")
    return {
        "w": video["width"],
        "h": video["height"],
        "dur": float(data["format"]["duration"]),
        "mb": float(data["format"]["size"]) / 1024 / 1024,
    }


def run(args):
    subprocess.run(args, check=True, capture_output=True)


def mb(path):
    return os.path.getsize(path) / 1024 / 1024


def main():
    os.makedirs(OUT, exist_ok=True)
    total_src = total_out = 0.0

    for rel, stem, max_w, max_h, crf, poster_at in JOBS:
        src = os.path.join(ROOT, rel)
        if not os.path.exists(src):
            print(f"  ! lewati (tidak ada): {rel}")
            continue

        info = probe(src)
        total_src += info["mb"]

        # perkecil hanya kalau lebih besar; jaga rasio dan buat genap (wajib untuk h264)
        scale = (
            f"scale='min({max_w},iw)':'min({max_h},ih)'"
            f":force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2"
        )

        mp4 = os.path.join(OUT, stem + ".mp4")
        run([
            FFMPEG, "-y", "-i", src,
            "-vf", scale,
            "-r", "30",                      # 60 fps tidak perlu untuk video bicara
            "-c:v", "libx264", "-preset", "slow", "-crf", str(crf),
            "-profile:v", "high", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "96k", "-ac", "1",
            "-movflags", "+faststart",       # metadata di depan -> bisa diputar sambil unduh
            mp4,
        ])

        poster = os.path.join(OUT, stem + "-poster.webp")
        run([
            FFMPEG, "-y", "-ss", str(poster_at), "-i", src,
            "-vf", scale, "-frames:v", "1", "-quality", "80", poster,
        ])

        total_out += mb(mp4)
        print(
            f"  {stem:10} {info['w']}x{info['h']} {info['mb']:6.1f} MB"
            f"  ->  {mb(mp4):5.1f} MB   poster {mb(poster)*1024:.0f} KB"
        )

    saved = 100 * (1 - total_out / total_src) if total_src else 0
    print(f"\nTotal {total_src:.1f} MB -> {total_out:.1f} MB  (hemat {saved:.0f}%)")
    print(f"Hasil ada di {OUT}")


if __name__ == "__main__":
    main()
