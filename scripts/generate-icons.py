#!/usr/bin/env python3
"""
Generates the app's icon set from a single vector-ish definition.

The mark is a crescent with an eight-pointed star (khatim) set in its opening:
recognisably Islamic, legible down to a 48px notification tray, and simple
enough to survive the circular, rounded-square and monochrome masks that iOS
and Android apply.

Everything is drawn at 4x and downsampled, which is a cheap way to get clean
anti-aliased edges out of Pillow's hard-edged primitives.

Usage: python3 scripts/generate-icons.py
"""

import math
import os

from PIL import Image, ImageDraw

SUPERSAMPLE = 4

GREEN = (15, 81, 50, 255)      # theme primary
GOLD = (226, 190, 110, 255)    # warm gold, legible on the green
WHITE = (255, 255, 255, 255)

ASSETS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets")


def mark_mask(s, radius):
    """
    Alpha mask of the whole mark, drawn about the canvas centre.

    The crescent is a disc with a second, smaller disc subtracted from its
    upper right; that cutout is what gives the crescent its taper and leaves
    the opening the star sits in.
    """
    mask = Image.new("L", (s, s), 0)
    draw = ImageDraw.Draw(mask)

    cx = cy = s / 2

    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=255)

    cut_radius = radius * 0.82
    cut_cx = cx + radius * 0.34
    cut_cy = cy - radius * 0.12
    draw.ellipse(
        [cut_cx - cut_radius, cut_cy - cut_radius, cut_cx + cut_radius, cut_cy + cut_radius],
        fill=0,
    )

    # Eight-pointed star (khatim), set in the crescent's opening and kept small
    # enough that the crescent stays the dominant shape at tray sizes.
    star_cx = cx + radius * 0.66
    star_cy = cy - radius * 0.40
    outer = radius * 0.24
    inner = outer * 0.44

    points = []
    for index in range(16):
        angle = math.pi / 2 + index * math.pi / 8
        length = outer if index % 2 == 0 else inner
        points.append((star_cx + length * math.cos(angle), star_cy - length * math.sin(angle)))

    draw.polygon(points, fill=255)
    return mask


def centered_mask(s, radius):
    """
    Same mask, translated so its ink is optically centred.

    The crescent and the star pull the composition's weight left and right by
    different amounts, so centring the bounding box rather than the construction
    circles is what actually looks centred.
    """
    mask = mark_mask(s, radius)
    box = mask.getbbox()
    if not box:
        return mask

    dx = round((s - (box[0] + box[2])) / 2)
    dy = round((s - (box[1] + box[3])) / 2)

    shifted = Image.new("L", (s, s), 0)
    shifted.paste(mask, (dx, dy))
    return shifted


def compose(size, background, foreground, scale=0.78):
    """
    Paints the mark in `foreground` over `background` (None for transparent).

    `scale` is the fraction of the canvas width the mark spans. iOS icons want
    breathing room inside the rounded-square mask; Android adaptive foregrounds
    need far more, since the launcher may crop a third of the canvas away.
    """
    s = size * SUPERSAMPLE
    canvas = Image.new("RGBA", (s, s), background if background else (0, 0, 0, 0))

    mask = centered_mask(s, radius=s * scale / 2)
    canvas.paste(Image.new("RGBA", (s, s), foreground), (0, 0), mask)

    return canvas.resize((size, size), Image.LANCZOS)


def save(image, name):
    path = os.path.join(ASSETS, name)
    image.save(path, "PNG", optimize=True)
    print(f"  {name}  {image.size[0]}x{image.size[1]}")


def main():
    os.makedirs(ASSETS, exist_ok=True)
    print("Generating icons into assets/")

    # iOS/store icon: opaque, square, no rounded corners of its own.
    save(compose(1024, GREEN, GOLD), "icon.png")

    # Android adaptive foreground: the launcher may crop a third of the canvas
    # away, so the mark stays well inside the safe zone. The background is the
    # flat green set in app.json.
    save(compose(1024, None, GOLD, scale=0.52), "android-icon-foreground.png")

    # Themed-icon variant: shape only, tinted by the launcher.
    save(compose(1024, None, WHITE, scale=0.52), "android-icon-monochrome.png")

    # Splash: drawn on the green background supplied by the splash plugin.
    save(compose(512, None, GOLD, scale=0.86), "splash-icon.png")

    # Android notification icon: silhouette only. Android draws it as a
    # single-colour stencil, so anything but white-on-transparent is discarded.
    save(compose(96, None, WHITE, scale=0.86), "notification-icon.png")

    save(compose(48, GREEN, GOLD), "favicon.png")


if __name__ == "__main__":
    main()
