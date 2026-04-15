# Traybar App Assets

This directory contains the icon assets for the Claude Limits Widget traybar application.

## Icons Required

### Mac (macOS)
- `tray-icon-mac.png` - 16x16 or 22x22 pixels (for high-DPI support: 32x32 or 44x44)
  - Template icons with transparent background recommended
  - Should be black or dark color that contrasts with menubar

### Windows
- `tray-icon-win.png` - 16x16 or 32x32 pixels
  - Standard PNG with transparent background
  - Icon will be displayed in the system tray

## Icon Design Recommendations

- Use a simple clock or API indicator design
- Keep it minimal and recognizable at small sizes
- Ensure good contrast for visibility in the system tray
- For macOS, consider using a template icon format

## Tools to Create Icons

You can create these icons using:
- [ImageMagick](https://imagemagick.org/) - command line image processing
- [Figma](https://www.figma.com/) - design tool with export to PNG
- Online tools like [Canva](https://www.canva.com/)
- Adobe Illustrator or similar vector tools

## Example: Creating a Simple Icon with ImageMagick

```bash
# Create a 16x16 dark clock icon for macOS
convert -size 16x16 xc:transparent \
  -fill black \
  -draw "circle 8,8 2,8" \
  tray-icon-mac.png
```

Once you've created the icons, place them in this directory and rebuild the Electron app.
