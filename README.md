# 🏛️ Egypt Wonders

A high-end, cinematic travel discovery website showcasing Egypt's most
remarkable landmarks across 9 geographic regions. Built with **pure
HTML5, CSS3, and vanilla JavaScript** — zero frameworks, zero build tools.

---

## 🚀 Getting Started

### Prerequisites

| Tool | Purpose | Check |
|------|---------|-------|
| **Python 3** | Local development server | `python3 --version` |
| **Modern browser** | Chrome, Firefox, or Edge | — |
| **Git** | Version control | `git --version` |

> **Why a server?** The project uses `fetch()` to load JSON data at
> runtime. Browsers block `fetch()` on `file://` URLs for security
> reasons, so you **must** serve the files over HTTP.

### Quick Start

```bash
# 1. Clone or navigate to the project directory
cd project/

# 2. Start a local server on port 8000
python3 -m http.server 8000

# 3. Open in your browser
#    http://localhost:8000
```

That's it. No `npm install`, no build step, no dependencies.

### Alternative Servers

```bash
# Node.js (if you prefer)
npx -y serve . -l 8000

# PHP
php -S localhost:8000
```

---

## 📁 Project Structure

```
project/
│
├── index.html              # Home page — hero video + 9 region cards
├── region.html              # Region page — dynamic landmark grid (loaded via ?id=)
├── landmark.html            # Landmark detail — gallery, description, sidebar
├── blog.html                # Blog page (static)
├── contact.html             # Contact page with form (static)
├── color-demo.html          # Design system color palette demo
│
├── css/
│   ├── global.css           # Design system — variables, nav, footer, utilities
│   ├── home.css             # Home page styles — hero, region cards, sidebar
│   ├── region.css           # Region page styles — landmark grid, modal
│   └── landmark.css         # Landmark detail styles — gallery, metadata sidebar
│
├── js/
│   ├── nav.js               # Shared — navigation, dark mode toggle, active links
│   ├── region.js            # Region page — fetch landmarks, build cards, modal
│   ├── landmark.js          # Landmark detail — fetch data, populate gallery/sidebar
│   └── reveal.js            # Shared — IntersectionObserver scroll-in animations
│
├── assets/
│   ├── data/
│   │   ├── regions.json     # 9 regions with metadata
│   │   └── landmarks.json   # 90+ landmarks, pre-sorted by importance
│   ├── images/              # Landmark photographs organized by folder
│   └── videos/
│       └── hero-bg.mp4      # Compressed hero background video
│
├── dev_stages/              # Step-by-step build documentation (11 stages)
│   ├── README.md            # Dev stages index and overview
│   ├── stage-00-design-decisions.md
│   ├── stage-01-project-setup.md
│   ├── stage-02-global-css.md
│   ├── stage-03-home-page.md
│   ├── stage-04-region-page.md
│   ├── stage-05-landmark-detail.md
│   ├── stage-06-blog-contact.md
│   ├── stage-07-polish.md
│   ├── stage-08-video-hero.md
│   ├── stage-09-cinematic-animations.md
│   └── stage-10-background-polish.md
│
└── .gitignore
```

---

## 🎨 Design System

| Token | Value | Purpose |
|-------|-------|---------|
| `--bg-body` | `#F4EFE6` (light) / `#121212` (dark) | Page background with SVG noise texture |
| `--accent` | `#D4AF37` (metallic gold) | Buttons, tags, active links |
| `--font-heading` | Playfair Display | Headings — elegant editorial serif |
| `--font-body` | Inter | Body text — modern readable sans-serif |
| `--radius-lg` | 16px | Card corners |
| `--transition` | 0.25s ease | Hover and toggle animations |

Each region overrides `--accent` with its own color (e.g., Cairo uses
terracotta `#B85C3A`, Alexandria uses Mediterranean blue `#2266AA`).

---

## ✨ Key Features

- **Cinematic Hero** — Full-screen autoplay video with staggered fade-in text
- **9 Region Cards** — Portrait cards with cinematic hover reveals (description slides up, image zooms)
- **Dynamic Landmark Grid** — 3-column grid populated from `landmarks.json` via `fetch()`
- **Quick Preview Modal** — Native `<dialog>` with `fadeInUp` animation, centered on screen
- **Landmark Detail Page** — Image gallery, sticky metadata sidebar, breadcrumb navigation
- **Dark Mode** — One-click toggle, persisted in `localStorage`, smooth CSS transitions
- **Desert Paper Texture** — SVG noise background generated in pure CSS (zero image files)
- **Giant Watermark Typography** — Faint background text that fills empty margins
- **Scroll Reveal Animations** — Elements fade and glide up via `IntersectionObserver`
- **Per-Region Accent Colors** — Automatic color theming based on `data-region` attribute

---

## 📖 Development Stages

The `dev_stages/` folder contains detailed documentation for every step
of the build process. Each stage explains **what** was built, **why** it
was designed that way, and **how** every CSS/JS technique works.

| # | Stage | What It Covers |
|---|-------|---------------|
| 0 | Design Decisions | Approved color palette, typography, layout architecture |
| 1 | Project Setup | Folder structure, empty files, git init |
| 2 | Global CSS | Design system: variables, fonts, dark mode, nav, footer |
| 3 | Home Page | `index.html` + `home.css` — hero section, geographic groups |
| 4 | Region Page | Dynamic landmark grid, modal, pre-sorted JSON data |
| 5 | Landmark Detail | Gallery, sticky sidebar, parallel fetch |
| 6 | Blog & Contact | Static pages, form semantics |
| 7 | Polish | Local server setup, responsive tweaks, testing checklist |
| 8 | Video Hero | `ffmpeg` compression, HTML5 video attributes, CSS `object-fit` |
| 9 | Cinematic Animations | CSS transitions & keyframes, cubic-bezier, card reveals |
| 10 | Background Polish | SVG noise textures, scroll reveals, watermark typography |

---

## 🔧 Git Commit History

```
c4b7cda  style: stronger desert background, noise texture, and watermark opacity
c87dca6  docs: add stage 10 explaining background textures and scroll reveals
63843db  feat: add premium paper noise, scroll reveal animations, and faint background watermarks
da4467b  style: update region grid to exactly 3 columns and fix text overlap
dccecd2  fix: remove huge SVG arrow and add CSS cache busting to region page
f0f0cb9  feat: apply cinematic animations to landmarks and document stage 09
a35c58a  feat: implement cinematic card reveal animations with descriptions
71786af  feat: layout refactor with full-height hero, sticky solid nav scroll, and 2-column sidebar grid
77ec37d  style: apply luxury travel design overhaul (typography, spacing, animations)
d719d07  feat: replace static hero background with optimized autoplay video
0b57d41  docs: complete all stage documentation and add mobile responsive polish
7509ac3  perf: remove redundant runtime sort — landmarks.json is pre-sorted by importance desc
e7d6339  feat: add blog and contact pages (Stage 6)
33cd084  feat: add landmark detail page with gallery and sidebar (Stage 5)
3a96575  feat: add region page with dynamic landmark grid and modal (Stage 4)
4aa9268  feat: add design system, nav logic, and home page (Stages 2-3)
9620277  chore: set up project folder structure and Stage 1 docs
2ef1387  chore: initialize project with design docs and color demo
```

---

## 📝 Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Structure | HTML5 | Semantic elements, `<dialog>`, `aria-*` attributes |
| Styling | CSS3 | Custom properties, Grid, Flexbox, `clamp()`, keyframes |
| Logic | Vanilla ES6+ JS | `fetch()`, `IntersectionObserver`, `localStorage` |
| Data | JSON | `regions.json`, `landmarks.json` — no database needed |
| Server | Python 3 `http.server` | Development only — any static server works |
| Fonts | Google Fonts | Playfair Display + Inter |

**Zero external dependencies. Zero build tools. Zero frameworks.**
