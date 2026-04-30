# Egypt Wonders — Dev Stages Index

This folder contains one `.md` file per development stage.
Each file explains **what** was built, **why** it was done that way,
and **how** every part of the code works.

---

## Stages Overview

| Stage | File | What It Covers | Status |
|---|---|---|---|
| 0 | `stage-00-design-decisions.md` | All approved design decisions — the single source of truth | ✅ Done |
| 1 | `stage-01-project-setup.md` | Folder structure, empty files, git initialization | ✅ Done |
| 2 | `stage-02-global-css.md` | The design system: CSS variables, fonts, dark mode, nav, footer | ✅ Done |
| 3 | `stage-03-home-page.md` | `index.html` + `home.css` — hero, geographic region groups | ✅ Done |
| 4 | `stage-04-region-page.md` | `region.html` + `region.css` + `region.js` — dynamic landmark grid, modal, pre-sorted data | ✅ Done |
| 5 | `stage-05-landmark-detail.md` | `landmark.html` + `landmark.css` + `landmark.js` — gallery, sidebar, parallel fetch | ✅ Done |
| 6 | `stage-06-blog-contact.md` | `blog.html` + `contact.html` — static pages, form semantics | ✅ Done |
| 7 | `stage-07-polish.md` | Local server setup, responsive tweaks, dark mode, full testing checklist | ✅ Done |
| 8 | `stage-08-video-hero.md` | `ffmpeg` video compression, HTML5 background video attributes, CSS object-fit | ✅ Done |

---

## ⚠️ Critical: How to Run the Project

**Do NOT open HTML files directly.** `fetch()` requires an HTTP server.

```bash
# Navigate to the project folder, then run:
python3 -m http.server 8000
```

Then open: **http://localhost:8000** in your browser.

See `stage-07-polish.md` for full server options and testing checklist.

---

## Git Commit History

```
7509ac3  perf: remove redundant runtime sort — JSON is pre-sorted by importance desc
e7d6339  feat: add blog and contact pages (Stage 6)
33cd084  feat: add landmark detail page with gallery and sidebar (Stage 5)
3a96575  feat: add region page with dynamic landmark grid and modal (Stage 4)
4aa9268  feat: add design system, nav logic, and home page (Stages 2-3)
9620277  chore: set up project folder structure and Stage 1 docs
2ef1387  chore: initialize project with design docs and color demo
```
