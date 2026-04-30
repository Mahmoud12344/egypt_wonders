# Stage 7 — Polish, Responsive Design & Running the Project

**What we do in this stage:**
1. Solve a critical runtime requirement: the local server
2. Add responsive CSS for mobile screens
3. Final review of the complete project

---

## ⚠️ CRITICAL: Why You Cannot Open Files Directly

This is the most important thing to understand before testing the project.

**DO NOT open `index.html` by double-clicking it in your file manager.**

When you open a file directly, the browser uses the `file://` protocol:
```
file:///media/.../project/index.html   ← WRONG for this project
```

The home page will display correctly. But when you navigate to a region page,
`region.js` calls `fetch('assets/landmarks.json')`. The browser **blocks** this request
with the error:

```
Access to fetch at 'file:///assets/landmarks.json' from origin 'null'
has been blocked by CORS policy.
```

**Why?** Browsers treat `file://` as "no origin" for security reasons. `fetch()` — which
is used for loading JSON — requires an HTTP server with a real origin (`http://localhost`).

### The Solution: Run a Local HTTP Server

A local server serves your files over `http://localhost` exactly like a real web server.
It takes one command and requires no installation beyond what you already have.

---

## How to Run the Project (Mandatory)

Open a terminal, navigate to the project folder, and run ONE of these commands:

### Option 1: Python (installed on almost every system)
```bash
cd "/media/epic-dev/New Volume/The Matrix Archive/fourth_semester/matirial_new/web/project"
python3 -m http.server 8000
```
Then open your browser and go to: **http://localhost:8000**

### Option 2: Node.js `npx serve` (if Node is installed)
```bash
cd "/media/epic-dev/New Volume/The Matrix Archive/fourth_semester/matirial_new/web/project"
npx serve .
```
Then open: **http://localhost:3000** (or whatever port it shows)

### Option 3: VS Code Live Server Extension
If you use VS Code, right-click `index.html` and choose "Open with Live Server".
It automatically opens `http://127.0.0.1:5500`.

**To stop the server:** Press `Ctrl + C` in the terminal.

---

## Testing Checklist — Click Through the Entire Site

Once the server is running, test these flows:

```
☐ http://localhost:8000
    → Home page loads with hero image
    → 4 geographic groups with region cards visible
    → Dark mode toggle (🌙) switches to dark, page stays dark on refresh

☐ Click "Cairo" region card
    → region.html?id=cairo loads
    → 22 landmark cards appear, sorted by importance (9 → 5)
    → Cairo accent color (#B85C3A terracotta) applied to nav logo, badges
    → Click a landmark card → modal opens with image, name, description
    → Modal "See Full Details →" button navigates to landmark.html

☐ Click "See Full Details →" on any Cairo modal
    → landmark.html?id=XXXXX loads
    → Hero background image displayed
    → Gallery: featured image + thumbnail strip below
    → Click thumbnails → featured image switches with fade
    → Sidebar: region, governorate, category, importance bar, coordinates
    → "View on Google Maps" link opens a new tab at the correct location
    → "← Back to Cairo" breadcrumb returns to region.html?id=cairo

☐ Navigate to Blog via nav bar
    → 4 blog post cards visible
    → Images load correctly

☐ Navigate to Contact via nav bar
    → Form renders correctly
    → Team section visible below
```

---

## Responsive Design — What's Already Built and What to Watch

### Already Responsive (Zero Extra Code)

These work on mobile out of the box due to the CSS grid choices:

| Component | Why It's Responsive |
|---|---|
| Region card grid on home page | `minmax(220px, 1fr)` auto-fills to 1 column on phones |
| Landmark card grid on region page | `minmax(280px, 1fr)` collapses similarly |
| Blog card grid | Same pattern |
| Hero font size | `clamp(2.5rem, 6vw, 4.5rem)` — scales with viewport |

### Breakpoints Added

One explicit media query was added in `landmark.css` for the two-column layout:
```css
@media (max-width: 900px) {
    .landmark-detail-layout {
        grid-template-columns: 1fr; /* sidebar moves below content on tablets/phones */
    }
}
```

And in `region.css` for the modal:
```css
@media (max-width: 640px) {
    .modal-layout {
        grid-template-columns: 1fr; /* modal image stacks above text on phones */
    }
}
```

### Mobile Improvements Added in This Stage

The following tweaks are added to `global.css` to improve mobile experience:

```css
/* Reduce horizontal padding on small screens */
@media (max-width: 600px) {
    .container {
        padding: 0 var(--space-md); /* 24px instead of 40px */
    }
    .nav-links a {
        font-size: 0.75rem;
        letter-spacing: 0.5px;
    }
}
```

---

## Dark Mode — Verification

The dark mode toggle persists across page navigation via `localStorage`.

Test this: Enable dark mode on the home page → click a region → the region page should
also be in dark mode without any flicker.

This works because `nav.js` runs on every page and reads `localStorage` immediately:
```js
const savedMode = localStorage.getItem('colorMode');
if (savedMode === 'dark') {
    document.body.setAttribute('data-mode', 'dark'); // applied before paint
}
```

The key is that this runs **synchronously** before the browser paints the page.
"Before paint" means the dark background is set before any pixels are drawn to screen,
eliminating the white flash that would occur if this ran after paint.

---

## Final File Count

```
project/
├── index.html          ← Home page
├── region.html         ← Region / landmark grid
├── landmark.html       ← Landmark detail
├── blog.html           ← Blog
├── contact.html        ← Contact
├── color-demo.html     ← Design review (not part of the site)
│
├── css/
│   ├── global.css      ← 280 lines — the entire design system
│   ├── home.css        ← 160 lines — home page only
│   ├── region.css      ← 250 lines — region page + modal
│   └── landmark.css    ← 220 lines — landmark detail only
│
├── js/
│   ├── nav.js          ← 80 lines — shared across all pages
│   ├── region.js       ← 280 lines — full region page logic
│   └── landmark.js     ← 260 lines — full landmark detail logic
│
└── assets/
    ├── landmarks.json          ← 90 landmarks, pre-sorted by importance
    ├── landmark_images.json    ← 960 images across 76 landmarks
    └── regions.json            ← 9 regions
```

**Every JS file is under 300 lines. Every CSS file is under 300 lines.**
This is maintainable, readable, and follows the simplicity requirement.

---

## ✅ Stage 7 Checklist

- [x] Local server requirement documented clearly
- [x] All 3 server options provided (Python, Node, VS Code)
- [x] Full testing checklist written
- [x] Responsive behavior verified and documented
- [x] Mobile container padding tweak applied to `global.css`
- [x] Dark mode persistence verified
- [x] Final file inventory complete

---

## The Project is Complete ✓

```
Commit history:
7509ac3  perf: remove redundant runtime sort
e7d6339  feat: add blog and contact pages
33cd084  feat: add landmark detail page with gallery and sidebar
3a96575  feat: add region page with dynamic landmark grid and modal
4aa9268  feat: add design system, nav logic, and home page
9620277  chore: set up project folder structure and Stage 1 docs
2ef1387  chore: initialize project with design docs and color demo
```
