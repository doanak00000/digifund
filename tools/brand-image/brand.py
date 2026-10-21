# Run from the repo root: python tools/brand-image/brand.py OUT.jpg SRC [SRC ...] [--w 1000 --h 1000]
# Puts product photo(s) on a white-background source onto the house product-photo style
# (soft lab-blue backdrop, floor glow, digifund wordmark top-left), like developertmah.jpg / cmp.jpg.
import argparse
from PIL import Image, ImageChops, ImageDraw, ImageFilter

LOGO = "assets/images/logo-1.jpg"


def wordmark(h):
    # logo-1.jpg is stacked (icon over text); lay icon and text side by side, white -> transparent
    src = Image.open(LOGO).convert("RGB")
    icon, text = src.crop((235, 80, 510, 420)), src.crop((60, 450, 640, 605))
    def alpha(im):
        a = ImageChops.invert(im.convert("L")).point(lambda v: min(255, v * 3))
        im = im.convert("RGBA"); im.putalpha(a); return im
    icon, text = alpha(icon), alpha(text)
    icon = icon.resize((round(icon.width * h / icon.height), h), Image.LANCZOS)
    th = round(h * 0.52)
    text = text.resize((round(text.width * th / text.height), th), Image.LANCZOS)
    out = Image.new("RGBA", (icon.width + h // 6 + text.width, h))
    out.alpha_composite(icon, (0, 0)); out.alpha_composite(text, (icon.width + h // 6, (h - th) // 2 + h // 20))
    return out


def clean_bg(im):
    # light, grey-ish pixels connected to the border (white or checkerboard backdrop) -> pure white,
    # so multiply onto the backdrop leaves no visible box
    im = im.convert("RGB")
    px, (w, h) = im.load(), im.size
    m = Image.new("L", im.size); mp = m.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            mp[x, y] = 255 if min(r, g, b) > 233 and max(r, g, b) - min(r, g, b) < 8 else 0
    for xy in [(x, 0) for x in range(0, w, 7)] + [(x, h - 1) for x in range(0, w, 7)] +               [(0, y) for y in range(0, h, 7)] + [(w - 1, y) for y in range(0, h, 7)]:
        if m.getpixel(xy) == 255:
            ImageDraw.floodfill(m, xy, 128)
    bgmask = m.point(lambda v: 255 if v == 128 else 0).filter(ImageFilter.GaussianBlur(0.8))
    im.paste((255, 255, 255), mask=bgmask)
    return im


def backdrop(w, h):
    bg = Image.new("RGB", (w, h))
    top, bot = (246, 249, 253), (222, 232, 245)
    d = ImageDraw.Draw(bg)
    for y in range(h):
        t = y / (h - 1)
        d.line([(0, y), (w, y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(top, bot)))
    glow = Image.new("L", (w, h)); ImageDraw.Draw(glow).ellipse((w * .1, h * .78, w * .9, h * .98), fill=150)
    bg.paste((255, 255, 255), mask=glow.filter(ImageFilter.GaussianBlur(w // 18)))
    return bg


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out"); ap.add_argument("src", nargs="+")
    ap.add_argument("--w", type=int, default=1000); ap.add_argument("--h", type=int, default=1000)
    ap.add_argument("--crop", help="l,t,r,b crop applied to every source")
    ap.add_argument("--same-height", action="store_true", help="scale sources to one height before layout")
    a = ap.parse_args()
    W, H = a.w, a.h
    bg = backdrop(W, H)
    srcs = []
    for s in a.src:
        im = Image.open(s)
        if a.crop: im = im.crop(tuple(int(v) for v in a.crop.split(",")))
        srcs.append(clean_bg(im))
    if a.same_height:
        hh = max(s.height for s in srcs)
        srcs = [s.resize((round(s.width * hh / s.height), hh), Image.LANCZOS) for s in srcs]
    # sources share the space below the logo, side by side, bottoms on one floor line
    area_w, area_h, gap = W * .86, H * .70, W * .04
    scale = min(area_h / max(s.height for s in srcs), (area_w - gap * (len(srcs) - 1)) / sum(s.width for s in srcs))
    srcs = [s.resize((round(s.width * scale), round(s.height * scale)), Image.LANCZOS) for s in srcs]
    x = round((W - sum(s.width for s in srcs) - gap * (len(srcs) - 1)) / 2)
    floor = round(H * .92)
    for s in srcs:
        y = floor - s.height
        patch = bg.crop((x, y, x + s.width, y + s.height))
        bg.paste(ImageChops.multiply(patch, s), (x, y))
        x += round(s.width + gap)
    logo = wordmark(round(H * .075))
    bg = bg.convert("RGBA"); bg.alpha_composite(logo, (round(W * .04), round(H * .045)))
    bg.convert("RGB").save(a.out, quality=88)


if __name__ == "__main__":
    main()
