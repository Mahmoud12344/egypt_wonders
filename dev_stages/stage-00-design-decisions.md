# Stage 0 — All Design Decisions (Source of Truth)

> **This file is the final record of every design decision we made together.**
> Before writing any code, we reviewed and approved everything here.
> If something changes, this file gets updated first.

---

## 1. What This Project Is

- A **static frontend** web application
- Displays **Egyptian landmarks** organized by **geographic region**
- Built with **Vanilla HTML, CSS, and JavaScript only** — no frameworks, no libraries
- Not intended for production or publication — it is an academic project
- **Simplicity and clean architecture** are the highest priorities

---

## 2. Approved Technology Decisions

| Concern | Decision | Why |
|---|---|---|
| HTML | Semantic HTML5 (`<nav>`, `<main>`, `<article>`, `<section>`, `<dialog>`) | Readable, accessible, and correct |
| CSS | Vanilla CSS with Custom Properties (CSS variables) | No Tailwind, no Bootstrap. One `global.css` for the design system |
| JavaScript | Vanilla JS (ES6+) | No React, no jQuery. One JS file per page |
| Fonts | Google Fonts via `<link>` tag | No self-hosting needed for academic work |
| Data | JSON files read with `fetch()` | The browser has built-in `fetch`. No library needed |
| Navigation | URL query parameters (`?id=cairo`) | No router library needed. Native browser feature |
| Maps | Plain `<a>` link to Google Maps (`https://maps.google.com/?q=lat,lng`) | Stays vanilla. Useful. Zero complexity |
| Embedded CSS/JS | **Forbidden.** Everything in separate named files | Clean architecture, easy to find anything |

---

## 3. Approved File & Folder Structure

```
project/
│
├── index.html              ← Home page: geographic regions
├── region.html             ← Region page: landmark grid (filtered by URL param)
├── landmark.html           ← Landmark detail: gallery + description
├── blog.html               ← Blog page
├── contact.html            ← Contact page
│
├── css/
│   ├── global.css          ← Design system: variables, reset, nav, footer, buttons
│   ├── home.css            ← Styles ONLY for index.html
│   ├── region.css          ← Styles ONLY for region.html
│   └── landmark.css        ← Styles ONLY for landmark.html
│
├── js/
│   ├── nav.js              ← Shared: active link highlighting in the nav bar
│   ├── region.js           ← Logic for region.html (reads JSON, renders cards)
│   └── landmark.js         ← Logic for landmark.html (reads JSON, renders detail)
│
├── assets/
│   ├── landmarks.json          ← 90 landmarks with descriptions, categories, importance
│   ├── landmark_images.json    ← Image lists per landmark (up to 12 images each)
│   ├── regions.json            ← 9 regions with counts and thumbnails
│   └── images/                 ← All landmark photos
│       ├── Great_Pyramid_of_Giza/
│       ├── Cairo_Tower/
│       └── ...
│
└── dev_stages/             ← This folder. Documentation only.
    ├── README.md
    ├── stage-00-design-decisions.md  ← YOU ARE HERE
    └── stage-01-project-setup.md
```

---

## 4. Approved Color Mode

- **Default: Light Mode**
- Dark mode is available as a **toggle button** in the navigation bar
- The toggle is implemented with a `data-mode` attribute on `<body>`

---

## 5. Approved Typography

| Role | Font | Where Used |
|---|---|---|
| Headings | Playfair Display (weight 500, 700) | Page titles, landmark names, region names |
| Body | Inter (weight 300, 400, 600) | All paragraph text, labels, buttons, nav |

Both fonts come from **Google Fonts**, imported in `global.css`.

---

## 6. Approved Color System

### Base Colors (Light Mode — used on every page)

| CSS Variable | Value | Used For |
|---|---|---|
| `--bg-body` | `#F9F7F3` | Page background |
| `--bg-card` | `#FFFFFF` | Cards, modals |
| `--text-main` | `#1A1A1A` | Headings and primary text |
| `--text-muted` | `#666666` | Descriptions, secondary text |
| `--border-color` | `#E8E4DC` | Card borders, dividers |

### Dark Mode Overrides

| CSS Variable | Value |
|---|---|
| `--bg-body` | `#121110` |
| `--bg-card` | `#1E1D1B` |
| `--text-main` | `#F4F4F4` |
| `--text-muted` | `#A0A0A0` |
| `--border-color` | `#2D2A26` |

### Accent Colors — One Per Region (Light Mode)

These replace `--accent-color` when a region page is loaded.

| Region | Light Accent | Dark Accent | Inspiration |
|---|---|---|---|
| Giza & Pyramids | `#C9A84C` | `#D4B86A` | Pyramid limestone at sunset |
| Cairo | `#B85C3A` | `#D4724E` | Islamic terracotta brick |
| Luxor & Thebes | `#9C7D50` | `#B8956A` | Karnak sandstone columns |
| Aswan & Nubia | `#4A7A5A` | `#5E9670` | Nile palm groves |
| Alexandria | `#2266AA` | `#4D88CC` | Mediterranean sea |
| Sinai & Red Sea | `#B84040` | `#D45C5C` | Coral reefs |
| Western Desert | `#B8903A` | `#D4A84C` | Sahara sand dunes |
| Upper Egypt | `#7A5C40` | `#9E7A58` | Nubian earth and pottery |
| Suez Canal | `#1A4A7A` | `#2E6AAA` | Deep canal waters |

> These colors are PENDING your final approval after viewing `color-demo.html`.

---

## 7. Approved Page Flow (Navigation)

```
index.html
│   (Home — geographic region groups)
│
├── Click a region card
│       ↓
│   region.html?id=cairo
│   (Shows all landmarks for Cairo, loaded from landmarks.json)
│
│       ├── Click a landmark card
│       │       ↓
│       │   <dialog> modal opens (summary: image + name + short description)
│       │   Modal has a "See Full Details →" button
│       │       ↓
│       │   landmark.html?id=11959
│       │   (Full page: gallery + long description + coordinates link)
│       │
│       └── Back button → returns to region.html?id=cairo
│
└── Nav links → blog.html | contact.html
```

---

## 8. Approved Data Strategy

| Data | Strategy | Why |
|---|---|---|
| The 9 regions on the home page | **Hardcoded in `index.html`** | They are structural, permanent geography. No JS needed to display them. Simple is better. |
| Landmark cards on `region.html` | **Loaded from `landmarks.json` via `fetch()`** | 90 landmarks, filtered by region. JS is the right tool for filtering data. |
| Landmark detail on `landmark.html` | **Loaded from `landmarks.json` + `landmark_images.json` via `fetch()`** | The detail page needs both the description AND the full image list. |

---

## 9. Approved Gallery Strategy

- `landmark_images.json` contains **up to 12 images per landmark**
- The detail page shows a **full image gallery**
- Layout: **1 large featured image + a scrollable row of thumbnails below**
- Clicking a thumbnail makes it the large featured image
- This is 100% vanilla JS — no carousel library needed
- The page is balanced by giving the gallery and the text content equal visual weight

---

## 10. Approved Modal Behavior

- Clicking a landmark card on `region.html` opens a **native `<dialog>` element**
- The modal shows:
  - The landmark thumbnail image
  - The landmark name
  - The short `description` (from landmarks.json)
  - The region/category badge
  - A "See Full Details →" button that navigates to `landmark.html?id=...`
  - A close button (×)
- Clicking outside the modal closes it
- This is native HTML5 — no JS library needed for the modal itself

---

## 11. What "I need to understand every line" means for our process

For every stage, the documentation file will explain:

1. **WHAT** — What file or feature are we building
2. **WHY** — Why this approach over alternatives
3. **HOW** — How it works, including any JS concepts (like `fetch`, `URLSearchParams`, `querySelector`, etc.)
4. **THE CODE** — Key sections of the code with inline comments

If something is unclear, you ask and I explain before we move forward.
