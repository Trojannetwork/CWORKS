# CWORKS Website

TEMPORARY SITE: https://trojannetwork.github.io/CWORKS/

Static single-page landing site. HTML + CSS + vanilla JS. No build tools required.

## Run locally
No install needed — this is plain HTML/CSS/JS. Any static server works:

    python3 -m http.server 8000

Then open http://localhost:8000 in a browser.

(Alternatively, use the VS Code "Live Server" extension, or just open
index.html directly in a browser — most of the site will work without
a server, except the contact form submit handler.)

## Folder structure
```
cworks-website/
├── index.html              ← Single landing page with all sections
├── assets/
│   ├── css/
│   │   ├── variables.css   ← Color/type/spacing tokens
│   │   ├── reset.css       ← Minimal CSS reset
│   │   ├── global.css      ← Nav, footer, buttons, cards, grid
│   │   └── main.css        ← All section-specific styles
│   ├── js/
│   │   ├── nav.js          ← Mobile nav + anchor smooth-scroll
│   │   ├── reveal.js       ← IntersectionObserver scroll-reveal
│   │   └── contact-form.js ← Form validation + submit handling
│   ├── images/
│   └── fonts/
└── favicon.ico
```

## Before launch checklist
- [ ] Replace all [ bracketed placeholders ] in the HTML with real
      copy: team names/photos, email, phone, socials.
- [ ] Wire contact-form.js to a real form endpoint (Formspree, or a
      custom backend) — currently a placeholder handler.
- [ ] Add real favicon.ico and og-image.png.
- [ ] Test at 375px (mobile), 768px (tablet), and 1440px (desktop) widths.
- [ ] Run a Lighthouse pass — target 90+ on Performance and SEO.
- [ ] Check prefers-reduced-motion disables scroll-reveal and smooth-scroll.

## Deploy
Any static host works: Netlify, Vercel, GitHub Pages, or a plain
Apache/Nginx server. Just upload the folder as-is.
