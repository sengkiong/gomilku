"""Static server untuk situs Go Milku.

http.server bawaan Python tidak mendukung HTTP Range, sehingga video besar
tidak bisa di-seek dan selalu diunduh utuh. Handler di bawah menambahkan
dukungan Range agar pemutaran video di halaman berjalan normal.

Jalankan:  python serve.py        (default port 5173)
           python serve.py 8080
"""

import os
import re
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)")


class RangeRequestHandler(SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler + dukungan HTTP Range (206 Partial Content)."""

    def send_head(self):
        header = self.headers.get("Range")
        if not header:
            return super().send_head()

        match = RANGE_RE.fullmatch(header.strip())
        if not match:
            return super().send_head()

        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        try:
            handle = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(handle.fileno()).st_size
        start_raw, end_raw = match.groups()

        if start_raw:
            start = int(start_raw)
            end = int(end_raw) if end_raw else size - 1
        else:
            # bentuk "bytes=-N": N byte terakhir
            if not end_raw:
                handle.close()
                self.send_error(400, "Invalid Range header")
                return None
            start = max(0, size - int(end_raw))
            end = size - 1

        end = min(end, size - 1)

        if start >= size or start > end:
            handle.close()
            self.send_response(416, "Requested Range Not Satisfiable")
            self.send_header("Content-Range", f"bytes */{size}")
            self.end_headers()
            return None

        handle.seek(start)
        self.send_response(206, "Partial Content")
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Last-Modified", self.date_time_string(os.fstat(handle.fileno()).st_mtime))
        self.end_headers()

        return _Slice(handle, end - start + 1)

    def end_headers(self):
        # aset dibaca langsung dari disk; jangan di-cache saat pengembangan
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            # browser membatalkan stream (mis. lightbox video ditutup) — bukan error
            pass

    def handle(self):
        try:
            super().handle()
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            pass


class _Slice:
    """Pembungkus file object yang berhenti setelah `remaining` byte."""

    def __init__(self, handle, remaining):
        self._handle = handle
        self._remaining = remaining

    def read(self, amount=-1):
        if self._remaining <= 0:
            return b""
        if amount < 0 or amount > self._remaining:
            amount = self._remaining
        chunk = self._handle.read(amount)
        self._remaining -= len(chunk)
        return chunk

    def close(self):
        self._handle.close()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
    root = os.path.dirname(os.path.abspath(__file__))
    handler = partial(RangeRequestHandler, directory=root)
    # threading: browser membuka beberapa koneksi keep-alive sekaligus
    # (video streaming + aset lain), server single-thread akan macet.
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print(f"Go Milku berjalan di http://localhost:{port}  (Ctrl+C untuk berhenti)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer dihentikan.")


if __name__ == "__main__":
    main()
