#!/usr/bin/env python3
"""Tek dosyalık bir blog yazısını (HTML) siteye ekler.

Kullanım:
    python3 tools/yazi-ekle.py /Users/umutsarp/utku/bloglar/yazilar/2026-11-07-paraguay-ueno-krizi.html --kapak Noboa

Kaynak dosyaya dokunmaz. Yaptıkları:
  - _posts/YYYY-AA-GG-slug.html dosyasını yazar. Başlık, özet, etiket, okuma süresi ve
    kaynak sayısı yazının kendisinden okunur; blog listesi, ana sayfa ve RSS buradan beslenir.
  - Sayfaya gömülü (base64) görselleri blog/assets/slug/ klasörüne ayrı dosya olarak çıkarır.
  - <head>'e canonical adres, paylaşım önizlemesi (og:image) ve RSS linki ekler.
  - En üste siteye dönüş şeridi koyar, alt bilgideki blog adını site linkleriyle değiştirir.
  - Yazıda taslak kutusu (author-note / TASLAK) kalmışsa hiçbir şey yazmadan durur.

--kapak: paylaşım önizlemesinde kullanılacak görsel. Görselin alt metninden bir kelime
         (ör. "Noboa") ya da sayfadaki sırası (1'den başlar). Varsayılan: ilk görsel.
"""
import argparse
import base64
import html
import json
import re
import sys
from pathlib import Path

SITE = "https://utkucengizacar.net"
ROOT = Path(__file__).resolve().parent.parent
EXT = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif"}

SITE_BAR_CSS = """
  /* Siteye dönüş şeridi (tools/yazi-ekle.py ekler) */
  .site-bar { border-bottom: 1px solid var(--line, #dccbb0); font-family: var(--font-sans, system-ui, sans-serif); font-size: .82rem; }
  .site-bar .col { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .8rem 0; }
  .site-bar a { color: var(--ink-2, #5c4636); text-decoration: none; }
  .site-bar a:hover, .site-bar a:focus-visible { color: var(--konyak, #9a4a2e); }
  .site-bar .site-mark { color: var(--ink, #2b1d16); font-weight: 600; letter-spacing: .08em; }
"""

SITE_BAR_HTML = """
<nav class="site-bar" aria-label="Site">
  <div class="layout"><div class="col">
    <a class="site-mark" href="/">U.C.A.</a>
    <a href="/blog/">Tüm yazılar</a>
  </div></div>
</nav>
"""


def fail(msg):
    sys.exit(f"Durdu: {msg}")


def text_of(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()


def first(pattern, s, what):
    m = re.search(pattern, s, re.S)
    if not m:
        fail(f"{what} bulunamadı")
    return m.group(1)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("kaynak", help="bloglar/yazilar içindeki YYYY-AA-GG-kisa-baslik.html dosyası")
    ap.add_argument("--kapak", default="1", help="paylaşım görseli: alt metninden bir kelime ya da sırası (varsayılan: 1)")
    args = ap.parse_args()

    src = Path(args.kaynak).expanduser()
    m = re.fullmatch(r"(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)\.html", src.name)
    if not m:
        fail("dosya adı YYYY-AA-GG-kisa-baslik.html biçiminde olmalı (küçük harf, Türkçe karakter yok)")
    date, slug = m.groups()
    s = src.read_text(encoding="utf-8")

    if re.search(r'class="author-note"|<!--\s*TASLAK', s):
        fail("yazıda taslak kutusu var (author-note / TASLAK). Önce doldur ya da sil.")
    if "{% endraw %}" in s:
        fail("yazıda '{% endraw %}' metni var, Jekyll bunu işleyemez")

    title = text_of(first(r"<title>(.*?)</title>", s, "<title>"))
    description = html.unescape(first(r'<meta name="description" content="([^"]*)"', s, "meta description"))
    meta_line = text_of(first(r'<div class="meta">(.*?)</div>', s, "meta satırı (… dk okuma)"))
    kicker_m = re.search(r'<div class="kicker">(.*?)</div>', s, re.S)
    kicker = text_of(kicker_m.group(1)) if kicker_m else None
    okuma_m = re.search(r"(\d+)\s*dk okuma", meta_line)
    if not okuma_m:
        fail(f"meta satırında okuma süresi yok: {meta_line!r}")
    kaynak_m = re.search(r"(\d+)\s*kaynak", meta_line)

    # Gömülü görselleri ayrı dosyalara çıkar
    asset_dir = ROOT / "blog" / "assets" / slug
    asset_dir.mkdir(parents=True, exist_ok=True)
    for old in asset_dir.glob("gorsel-*"):
        old.unlink()
    images = []

    def extract(mo):
        ext = EXT[mo.group(1)]
        name = f"gorsel-{len(images) + 1}.{ext}"
        (asset_dir / name).write_bytes(base64.b64decode(re.sub(r"\s+", "", mo.group(2))))
        images.append(f"/blog/assets/{slug}/{name}")
        return images[-1]

    before = len(s.encode("utf-8"))
    s = re.sub(r"data:(image/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=\s]+)", extract, s)

    cover = None
    if images:
        if args.kapak.isdigit():
            n = int(args.kapak)
            if not 1 <= n <= len(images):
                fail(f"--kapak 1 ile {len(images)} arasında olmalı")
            cover = images[n - 1]
        else:
            for tag in re.findall(r"<img\b[^>]*>", s):
                src_m = re.search(r'\ssrc="([^"]+)"', tag)
                alt_m = re.search(r'\salt="([^"]*)"', tag)
                if src_m and src_m.group(1) in images and alt_m and args.kapak.casefold() in alt_m.group(1).casefold():
                    cover = src_m.group(1)
                    break
            if not cover:
                fail(f"alt metninde '{args.kapak}' geçen bir görsel yok")

    # <title> ve <head> eklemeleri
    s = re.sub(r"<title>(.*?)</title>", lambda mo: f"<title>{mo.group(1)} · Utku Cengiz Acar</title>", s, count=1, flags=re.S)
    url = f"{SITE}/blog/{slug}/"
    head = [
        f'<link rel="canonical" href="{url}">',
        f'<meta property="og:url" content="{url}">',
        '<meta property="og:site_name" content="Utku Cengiz Acar">',
        f'<meta property="article:published_time" content="{date}">',
        '<link rel="alternate" type="application/atom+xml" title="Utku Cengiz Acar · Blog" href="/blog/feed.xml">',
    ]
    if cover:
        head += [
            f'<meta property="og:image" content="{SITE}{cover}">',
            '<meta name="twitter:card" content="summary_large_image">',
        ]
    head_html = "\n".join(head) + f"\n<style>{SITE_BAR_CSS}</style>\n"
    if s.count("</head>") != 1:
        fail("</head> bulunamadı")
    s = s.replace("</head>", head_html + "</head>")

    # Siteye dönüş şeridi
    s, n = re.subn(r"(<body[^>]*>)", lambda mo: mo.group(1) + "\n" + SITE_BAR_HTML, s, count=1)
    if n != 1:
        fail("<body> bulunamadı")

    # Alt bilgi: blog adı yerine site linkleri
    def footer(mo):
        rest = re.sub(r"^\s*Hamle\s*·\s*", "", mo.group(2))
        links = '<a href="/blog/">Tüm yazılar</a> · <a href="/">Utku Cengiz Acar</a>'
        return mo.group(1) + links + (f" · {rest}" if rest else "") + mo.group(3)

    s = re.sub(r'(<footer>.*?<div class="col">)(.*?)(</div>)', footer, s, count=1, flags=re.S)

    # Jekyll front matter; içerik {% raw %} içinde, Liquid dokunmasın
    fm = {
        "layout": "none",
        "title": title,
        "description": description,
        "kicker": kicker,
        "okuma": int(okuma_m.group(1)),
        "kaynak": int(kaynak_m.group(1)) if kaynak_m else None,
        "image": cover,
        "excerpt_separator": "",
    }
    lines = ["---"]
    for key, value in fm.items():
        if value is not None:
            lines.append(f"{key}: {json.dumps(value, ensure_ascii=False)}")
    lines.append("---")
    out = "\n".join(lines) + "\n{% raw %}" + s + "{% endraw %}\n"

    post_path = ROOT / "_posts" / src.name
    post_path.parent.mkdir(exist_ok=True)
    post_path.write_text(out, encoding="utf-8")

    after = len(s.encode("utf-8"))
    print(f"Yazı:     {post_path.relative_to(ROOT)}")
    print(f"Adres:    {url}")
    print(f"Başlık:   {title}")
    print(f"Etiket:   {kicker} · {fm['okuma']} dk okuma · {fm['kaynak']} kaynak")
    print(f"Görseller: {len(images)} dosya → blog/assets/{slug}/ (kapak: {cover})")
    print(f"Sayfa boyutu: {before // 1024} KB → {after // 1024} KB")


if __name__ == "__main__":
    main()
