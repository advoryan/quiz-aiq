Mobile-friendly Tailwind layout (light theme)

What you get
- `index.html` — mobile-first layout using the Tailwind CDN
- `styles.css` — tiny custom CSS (focus outlines, modal visible styles)
- `script.js` — vanilla JS for mobile menu + modal preview

How to run
Open `index.html` in your browser. For a simple local server (recommended):

```bash
# from the project folder
python3 -m http.server 8000
# then visit http://localhost:8000 in your browser
```

Notes
- Uses Tailwind via CDN for quick prototyping; for production, consider building Tailwind to purge unused CSS.
- Default is a light theme; classes are easy to switch to dark-mode if you want to add a toggle.

If you'd like, I can: add a dark-mode toggle, wire up a small sample quiz runner, or export the layout as React/Vue components.
