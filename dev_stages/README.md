# Egypt Wonders — Project Documentation

> **Read these documents and you will understand every file, every design decision, and every line of code in the project.**

---

## How to Run the Project

**You must use a local HTTP server.** Opening HTML files directly (`file://`) will break `fetch()` calls.

```bash
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

---

## Documentation Index

### Shared Components
| Document | Covers |
|:---|:---|
| [global-styles.md](global-styles.md) | `global.css` — Design tokens, dark mode, region accents, reset, nav CSS, footer CSS, buttons, watermark |
| [navigation.md](navigation.md) | `nav.js` — Active link detection, dark mode toggle, transparent scroll, nav HTML structure |
| [scroll-reveal.md](scroll-reveal.md) | `reveal.js` — IntersectionObserver scroll animations + CSS classes |
| [data-layer.md](data-layer.md) | `regions.json`, `landmarks.json`, `landmark_images.json` — Schemas and relationships |

### Pages
| Document | Covers |
|:---|:---|
| [home-page.md](home-page.md) | `index.html` + `home.css` — Hero video, CTA section, region card grid, all animations |
| [about-page.md](about-page.md) | `about.html` — Contributor glassmorphism grid, CSS line-by-line |
| [region-page.md](region-page.md) | `region.html` + `landmarks-grid.css` + `region.js` — Landmark grid, modal, event delegation |
| [landmark-page.md](landmark-page.md) | `landmark.html` + `landmark.css` + `landmark.js` — Gallery, sidebar, Promise.all |
| [blog-page.md](blog-page.md) | `blog.html` — Static editorial blog with inline styles |
| [community-blog-page.md](community-blog-page.md) | `blog2.html` — Interactive localStorage blog with inline JS |
| [contact-page.md](contact-page.md) | `contact.html` — Contact form, team section, form semantics |

### Exam Prep
| Document | Covers |
|:---|:---|
| [QA.md](QA.md) | 42+ potential exam questions with full answers |

---

## Quick Reference: Page → File Mapping

| Page | HTML | CSS | JS |
|:---|:---|:---|:---|
| Home | `index.html` | `global.css` + `home.css` | `nav.js` + `reveal.js` |
| Region | `region.html` | `global.css` + `landmarks-grid.css` | `nav.js` + `region.js` + `reveal.js` |
| Landmark Detail | `landmark.html` | `global.css` + `landmark.css` | `nav.js` + `landmark.js` + `reveal.js` |
| Blog | `blog.html` | `global.css` + inline `<style>` | `nav.js` |
| Community Blog | `blog2.html` | Inline `<style>` (standalone) | Inline `<script>` (standalone) |
| Contact | `contact.html` | `global.css` + inline `<style>` | `nav.js` |

---

## Folder Structure

```
project/
├── index.html                 ← Home page (entry point)
├── region.html                ← Region landmark grid (dynamic)
├── landmark.html              ← Landmark detail page (dynamic)
├── blog.html                  ← Static editorial blog
├── blog2.html                 ← Interactive community blog (standalone)
├── contact.html               ← Contact form + team credits
├── css/
│   ├── global.css             ← Shared design system (ALL pages)
│   ├── home.css               ← index.html only
│   ├── landmarks-grid.css     ← region.html only
│   └── landmark.css           ← landmark.html only
├── js/
│   ├── nav.js                 ← Shared: active link + dark mode + scroll
│   ├── reveal.js              ← Shared: IntersectionObserver scroll reveal
│   ├── region.js              ← region.html only
│   └── landmark.js            ← landmark.html only
├── assets/
│   ├── regions.json           ← 8 regions
│   ├── landmarks.json         ← 90 landmarks (master data)
│   ├── landmark_images.json   ← Image gallery paths per landmark
│   ├── images/                ← 76 subdirectories of JPG photos
│   └── videos/hero-bg.mp4    ← Hero background video
└── dev_stages/                ← This documentation folder
```
