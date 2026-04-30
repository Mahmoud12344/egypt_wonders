# Stage 3 — Home Page (`index.html` + `home.css`)

**What we do in this stage:**
Build the complete home page — the first page a visitor sees.

---

## What the Home Page Contains

```
┌─────────────────────────────────────────┐
│  NAV: Egypt Wonders    Home Blog Contact 🌙 │
├─────────────────────────────────────────┤
│                                         │
│   HERO — background image of Giza       │
│   [dark overlay]                        │
│                                         │
│   "Discover Egypt"  ← eyebrow text      │
│   "Seven Thousand Years of Wonder"      │
│   "From the last surviving wonder..."   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  The Nile Valley ─────────────────      │
│  [Cairo] [Giza & Pyramids] [Luxor]      │
│  [Aswan & Nubia] [Upper Egypt]          │
│                                         │
│  The Mediterranean ───────────────      │
│  [Alexandria]                           │
│                                         │
│  The Eastern Frontier ────────────      │
│  [Sinai & Red Sea] [Suez Canal]         │
│                                         │
│  The Western Desert ──────────────      │
│  [Western Desert]                       │
│                                         │
├─────────────────────────────────────────┤
│  FOOTER: Egypt Wonders · 2026           │
└─────────────────────────────────────────┘
```

---

## Why is the home page FULLY STATIC (no JavaScript)?

The home page shows 9 region cards. Those 9 regions are hardcoded directly in the HTML.

**There is no JavaScript on this page (except nav.js which handles the mode toggle).**

Why? Because the 9 regions are:
- Fixed — they will never change during this project's lifetime
- Structural — they are the navigation categories, not data records
- Simple — 9 items do not need programmatic rendering

Compare this to the landmark cards on `region.html`:
- There are 90 landmarks that need filtering by region
- They need to be sorted by importance
- They come from a JSON file with complex nested data

JavaScript is the right tool for that. For 9 static regions? HTML is the right tool.

**Rule: Never use JavaScript to do what HTML can do more simply.**

---

## The Hero Section

```html
<section class="hero" aria-label="Hero banner">
    <div class="hero-overlay" aria-hidden="true"></div>
    <div class="hero-content">
        <span class="hero-eyebrow">Discover Egypt</span>
        <h1 class="hero-title">Seven Thousand Years<br>of Wonder</h1>
        <p class="hero-subtitle">...</p>
    </div>
</section>
```

### The background image technique

The hero background is set in CSS, not as an `<img>` tag:
```css
.hero {
    background-image: url('../assets/images/Great_Pyramid_of_Giza/0.jpg');
    background-size: cover;
    background-position: center;
}
```

Why CSS background instead of `<img>`?
- CSS `background-size: cover` automatically crops and fills the entire section
  regardless of image dimensions — this is the correct technique for "full bleed" images
- An `<img>` tag would need complex positioning to achieve the same result
- The image is decorative, not content — CSS backgrounds are semantically correct for decorative images

### The Overlay

```html
<div class="hero-overlay" aria-hidden="true"></div>
```

```css
.hero-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.45);
}
```

`aria-hidden="true"` tells screen readers to ignore this element — it is purely visual.

`rgba(0, 0, 0, 0.45)` = black at 45% opacity.
This darkens the image just enough so that white text is always readable,
regardless of how light or dark the underlying photo is.

### `clamp()` — Responsive Font Size Without Media Queries

```css
font-size: clamp(2.5rem, 6vw, 4.5rem);
```

`clamp(min, preferred, max)` — the font size:
- Is never smaller than `2.5rem` (on tiny screens)
- Ideally wants to be `6vw` (6% of the viewport width)
- Is never larger than `4.5rem` (on massive monitors)

`vw` = viewport width unit. `6vw` on a 1200px wide screen = 72px.
`6vw` on a 400px phone screen = 24px.

This makes the heading automatically scale to fit any screen with a single line of CSS.

---

## The Geographic Region Groups

Each group has:
1. A `<h2 class="group-title">` with a decorative line after it
2. A `<div class="region-grid">` containing the region cards

### The Decorative Line After the Title

```css
.group-title {
    display: flex;
    align-items: center;
    gap: var(--space-md);
}

.group-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
}
```

`::after` is a **pseudo-element** — an invisible element the browser inserts at the end of
the selected element's content. We make it a 1px tall line and use `flex: 1` to make it
stretch and fill all remaining horizontal space. This creates the "Title ─────────" effect.

### The Responsive Grid

```css
.region-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: var(--space-md);
}
```

`auto-fill` — "fill the row with as many columns as you can"
`minmax(220px, 1fr)` — "each column is minimum 220px wide, maximum 1 fraction of space"

**On a 1280px container:** (1280 - gaps) / 220 ≈ 5 columns
**On a 768px tablet:** ≈ 3 columns  
**On a 380px phone:** ≈ 1-2 columns

The grid is fully responsive with zero `@media` queries.

---

## The Region Card

```html
<a class="region-card" href="region.html?id=cairo" aria-label="Explore Cairo region">
    <img class="region-card-img" src="..." alt="..." loading="lazy">
    <div class="region-card-overlay" aria-hidden="true"></div>
    <div class="region-card-body">
        <h3 class="region-card-name">Cairo</h3>
        <p class="region-card-count">22 Landmarks</p>
    </div>
</a>
```

**Key decisions explained:**

`<a>` as the card root — The entire card is a link. Using `<a>` as the outer element
is semantically correct (this is a navigation element) and makes the whole card
clickable without any JavaScript.

`loading="lazy"` — The browser loads images only when they are about to scroll into view.
This makes the initial page load much faster, especially when there are many images.

`aria-label="Explore Cairo region"` — Screen readers read the `alt` text of the image
AND the text content. The `aria-label` on the `<a>` gives screen reader users a clear
description of where this link goes.

`href="region.html?id=cairo"` — The `?id=cairo` part is a query parameter.
When the user clicks this card, `region.js` will read this value from the URL
to know which region's landmarks to load and display.

---

## The `?id=cairo` Pattern — How Pages Pass Data

This is a critical concept for the whole project. There is no server, no database.
Data is passed between pages using the URL itself.

When you click a Cairo card:
1. Browser navigates to `region.html?id=cairo`
2. `region.js` runs and reads the URL:
   ```js
   const params = new URLSearchParams(window.location.search);
   const regionId = params.get('id'); // "cairo"
   ```
3. It filters `landmarks.json` where `landmark.region === "Cairo"`
4. It sorts by `importance` descending
5. It renders the cards

The URL is the communication channel between pages.

---

## Files Changed in Stage 3

- `index.html` — Complete home page written
- `css/home.css` — Hero + region group + region card styles

## ✅ Stage 3 Checklist

- [x] `index.html` written with full semantic HTML5 structure
- [x] Nav bar HTML (same across all pages)
- [x] Hero section with overlay and responsive title
- [x] 4 geographic groups, 9 region cards, all hardcoded
- [x] Footer HTML
- [x] `home.css` written: hero, group title with line, responsive grid, card hover effects
- [x] All images have descriptive `alt` text
- [x] All images use `loading="lazy"`
- [x] All links use correct `href` with `?id=` query parameters

---

## Next: Stage 4 — Region Page (`region.html` + `region.css` + `region.js`)

This is where JavaScript first becomes necessary. `region.js` will:
1. Read `?id=cairo` from the URL
2. `fetch()` the `landmarks.json` file
3. Filter to only Cairo's landmarks
4. **Sort by `importance` descending** (10 first, 1 last)
5. Build and insert the landmark cards into the page
