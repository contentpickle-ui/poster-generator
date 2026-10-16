# Saraswati Puja Poster Generator — corrected full files

This folder contains the full website and the poster template. The generated PNG is exactly 1080 × 1920 pixels.

## Files
- `index.html` — website interface
- `script.js` — preview, logo, corrected name/designation positions, PNG download
- `poster-template.jpg` — your poster background
- `README.md` — these instructions

## Test
Keep all files in the same folder. Open `index.html`. If the image doesn't load from disk, open a terminal in this folder and run:
`python3 -m http.server 8000`
Then visit `http://localhost:8000`.

## Publish free with GitHub Pages
1. Create a public repository at https://github.com/new.
2. Upload all four files to the repository root.
3. Go to Settings → Pages.
4. Select “Deploy from a branch”, choose branch `main` and folder `/(root)`, then Save.
5. Open the URL shown by GitHub Pages and share it.

## If you need to fine-tune the text
In `script.js`, inside `drawPersonalization()`, adjust:
- `H * 0.742` for the name's vertical position
- `H * 0.771` for the designation's vertical position

Higher y values move the text lower on the poster. The white masking rectangle is limited to the text area to avoid wiping out the decorative separator lines.

Names and uploaded logos are processed locally in the visitor's browser; no server or database is used.
