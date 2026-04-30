# Stage 5 — Landmark Detail Page (`landmark.html` + `landmark.css` + `landmark.js`)

**What we do in this stage:**
Build the richest, most complex page in the project — the full detail view for one landmark.

---

## What the Landmark Detail Page Contains

```
┌──────────────────────────────────────────────────────┐
│  NAV                                                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│  HERO — background image, 45vh tall                  │
│  [← Back to Cairo]  [Ancient Temples badge]          │
│  Cairo Citadel                                       │
│                                                      │
├──────────────────────────────────────────────────────┤
│                        │                             │
│  GALLERY               │  SIDEBAR (sticky)           │
│  ┌──────────────────┐  │  ─────────────────          │
│  │                  │  │  Region: Cairo              │
│  │  Featured image  │  │  Governorate: Cairo Gov.    │
│  │                  │  │  Category: Palaces          │
│  └──────────────────┘  │  Significance: ████████░░  │
│  [🖼][🖼][🖼][🖼][🖼]  │                  9 / 10     │
│                        │  Location: 30.0280°N        │
│  About This Landmark   │  ↗ View on Google Maps     │
│  Long description...   │                             │
│  ...more text...       │                             │
│  ...more text...       │                             │
│                        │                             │
├──────────────────────────────────────────────────────┤
│  FOOTER                                              │
└──────────────────────────────────────────────────────┘
```

---

## The Two-Column Layout

```css
.landmark-detail-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: var(--space-xl);
    align-items: start;
}
```

`1fr 340px` means:
- Left column: takes all remaining space (`1fr` = 1 fraction of available space)
- Right column: fixed at 340px — the sidebar

`align-items: start` prevents the sidebar from stretching to the full height of the
content column. Without this, the sidebar card would stretch to match the description text height.

On screens narrower than 900px, this collapses to a single column via a `@media` query.

---

## Fetching TWO Files at the Same Time — `Promise.all()`

This page needs data from TWO JSON files:
1. `landmarks.json` — for the name, description, coordinates, category, importance
2. `landmark_images.json` — for the full list of images (up to 12 per landmark)

### The Wrong Way (Sequential — slow)
```js
const landmarksRes = await fetch('assets/landmarks.json');   // wait...
const landmarks    = await landmarksRes.json();              // wait...
const imagesRes    = await fetch('assets/landmark_images.json'); // THEN start this
const images       = await imagesRes.json();                 // wait again...
```
Total time = time for file 1 + time for file 2 (added together).

### The Right Way (Parallel — using `Promise.all()`)
```js
const [landmarksRes, imagesRes] = await Promise.all([
    fetch('assets/landmarks.json'),
    fetch('assets/landmark_images.json')
]);
```
`Promise.all()` takes an **array of Promises** and starts ALL of them at the same time.
It returns a new Promise that resolves when ALL of them are done.
The result is an array of responses in the same order as the input.

Total time = time for the SLOWER of the two files (they run in parallel).
For typical file sizes, this is roughly 2× faster than sequential.

---

## How `Array.find()` Works

```js
const landmark = allLandmarks.find(function(l) {
    return l.id === landmarkId;
});
```

`Array.find()` searches through the array and returns the **first element** where the
callback returns `true`. It stops as soon as it finds a match (unlike `filter()` which
checks every element). This is the correct method when you know there is exactly one match.

`landmarkId` comes from the URL: `landmark.html?id=11959` → `landmarkId = "11959"`.

---

## The Image Gallery — How Thumbnail Switching Works

The gallery has two parts:
1. A large **featured image** (`<img id="gallery-featured">`)
2. A scrollable row of **thumbnail images** (built by JS into `#gallery-thumbnails`)

When the user clicks a thumbnail:

```js
thumb.addEventListener('click', function() {
    featuredImg.style.opacity = '0';          // 1. fade out (CSS: transition: opacity 0.2s)

    setTimeout(function() {
        featuredImg.src = thumb.src;          // 2. swap the image source (invisible, faded out)
        featuredImg.alt = thumb.alt;
        featuredImg.style.opacity = '1';      // 3. fade back in
    }, 200);                                  // 200ms = same as CSS transition duration

    thumbnails.forEach(function(t) { t.classList.remove('active'); }); // 4. clear active
    thumb.classList.add('active');            // 5. mark this thumb as active
});
```

Why the `setTimeout`?
The CSS `transition: opacity 0.2s` makes the fade take 200ms.
If we swapped `src` immediately while the image is still visible, the viewer would see
the image flicker. By waiting 200ms (the exact fade duration), we swap `src` while the
image is invisible, then fade it back in — a smooth crossfade effect.

---

## The Sticky Sidebar

```css
.landmark-sidebar {
    position: sticky;
    top: calc(var(--nav-height) + var(--space-md));
}
```

`position: sticky` is a hybrid between `relative` and `fixed`.
- When the sidebar hasn't reached the `top` threshold: it scrolls normally with the page
- When the sidebar reaches the `top` value: it sticks and stays in view while the content scrolls

`calc(var(--nav-height) + var(--space-md))` = 68px + 24px = 92px from the top of the viewport.
This ensures the sticky sidebar never hides behind the fixed navigation bar.

This is particularly useful on this page because the long description can be very long
(several paragraphs), while the sidebar metadata is short. Without sticky, the user would
lose sight of the metadata while reading.

---

## The Importance Bar

```html
<div class="importance-bar-track">
    <div class="importance-bar-fill" id="importance-bar-fill" style="width: 0%"></div>
</div>
```

```js
const score = landmark.importance || 0;
if (importanceFill) importanceFill.style.width = (score / 10 * 100) + '%';
```

`score / 10 * 100` converts the 1–10 score to a 0–100% width:
- importance 10 → width: 100%
- importance 9  → width: 90%
- importance 5  → width: 50%

The CSS `transition: width 0.4s ease` makes the bar animate in smoothly when the page loads.

---

## The Coordinates → Google Maps Link

```js
const lat = coords.latitude || coords.lat;
const lng = coords.longitude || coords.lng;
const mapsUrl = 'https://maps.google.com/?q=' + lat + ',' + lng;
```

`https://maps.google.com/?q=lat,lng` is a standard Google Maps deep link.
Opening this URL in a new tab takes the user directly to that coordinate on Google Maps.

`target="_blank"` opens in a new tab.
`rel="noopener"` is a security attribute — without it, the opened tab can access
the `window.opener` object of our page (a potential security risk).

We use `lat.toFixed(4)` to display the coordinates with 4 decimal places:
`30.028018` → `30.0280` — clean and readable.

---

## The Hero Background Image — Inline Style Technique

```js
heroEl.style.backgroundImage = 'url("assets/' + heroImg + '")';
```

We set the background image via JavaScript's inline style, not in CSS.
Why? Because the image path is dynamic — it changes with every landmark.
We cannot write it in CSS (which is static). The JS reads the path from the JSON
and sets it directly on the element's `style` attribute.

The equivalent HTML result looks like:
```html
<section class="landmark-hero" style="background-image: url('assets/images/Cairo_Citadel/0.jpg')">
```

---

## Files Changed in Stage 5

- `landmark.html` — Complete detail page shell
- `css/landmark.css` — Hero, two-column layout, gallery, sidebar, importance bar
- `js/landmark.js` — Full dynamic logic: parallel fetch, find, render gallery, sticky sidebar, Google Maps link

## ✅ Stage 5 Checklist

- [x] `landmark.html` written with all placeholder elements
- [x] `css/landmark.css` written: hero, two-column grid, gallery, thumbnail strip, sticky sidebar, importance bar
- [x] `js/landmark.js` written with full comments
- [x] `Promise.all()` for parallel JSON fetching (faster than sequential)
- [x] `Array.find()` to locate the landmark by ID
- [x] Region accent color applied via `data-region` on `<body>`
- [x] Hero background image set via JS inline style
- [x] Breadcrumb link built dynamically: `← Cairo` → `region.html?id=cairo`
- [x] Full gallery: featured image + thumbnail strip
- [x] Thumbnail click → smooth 200ms crossfade to new image
- [x] Active thumbnail highlighted with accent border
- [x] Long description rendered from `long_description` field
- [x] Sticky sidebar with region, governorate, category metadata
- [x] Importance shown as animated progress bar
- [x] Coordinates → Google Maps deep link with `rel="noopener"`

---

## Next: Stage 6 — Blog and Contact Pages
