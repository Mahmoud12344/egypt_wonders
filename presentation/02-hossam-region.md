# 02. The Region Page & Dynamic Data (Deep Dive)
**Developer:** Hossam
**Core Files:** `region.html`, `css/landmarks-grid.css`, `js/region.js`

This document is a comprehensive, line-by-line textbook explaining every piece of code on the Region page. This is the most technically sophisticated page — it uses URL parameters, `async/await`, event delegation, and a native `<dialog>` modal.

> **Key Design Decision:** Instead of creating 8 separate HTML files (one per region), we have ONE template page that reads the URL to know which region to load. This is "the DRY principle" — Don't Repeat Yourself.

---

## 1. The HTML Structure (Line-by-Line)

### The Page Shell
```html
<!-- Default title — region.js updates this to the real region name -->
<title>Region — Egypt Wonders</title>

<link rel="stylesheet" href="css/global.css?v=6">
<link rel="stylesheet" href="css/landmarks-grid.css?v=5">
```
- The `<title>` starts as a generic placeholder. As soon as JavaScript loads the data, it updates the title to e.g. `"Cairo — Egypt Wonders"` using `document.title = config.label + ' — Egypt Wonders'`.
- `?v=5` — Cache-busting suffix. Forces browsers to download the latest CSS file instead of an outdated cached copy.

### The Background Watermark
```html
<div class="bg-watermark" aria-hidden="true" id="region-watermark">REGION</div>
```
- Unlike other pages, this watermark has an `id="region-watermark"`. JavaScript updates its text from `"REGION"` to the actual region name in uppercase (e.g., `"CAIRO"`).
- `aria-hidden="true"` — Screen readers skip this completely.

### The Dynamic Region Header
```html
<section class="region-header">
    <div class="region-header-accent-bar" aria-hidden="true"></div>
    <div class="container">
        <a href="index.html" style="...">← All Regions</a>

        <!-- Region name — filled by region.js -->
        <h1 class="region-name" id="region-name">Loading...</h1>

        <div class="region-meta">
            <span class="region-landmark-count" id="region-count"></span>
        </div>
    </div>
</section>
```
- `<div class="region-header-accent-bar">` — A thin 3px colored stripe. Its color is determined by `var(--accent)`, which changes per region when JavaScript sets `data-region` on `<body>`.
- The back link `← All Regions` uses inline `style="..."` CSS directly on the element. This is acceptable for one-off styles that are unique to a single element.
- `id="region-name"` — Starts as "Loading...". JavaScript targets this ID and replaces the text with the real region name.
- `id="region-count"` — An empty `<span>`. JavaScript fills it with e.g. `"22 Landmarks"`.

### The Empty Grid Container
```html
<section class="landmarks-section" aria-label="Landmark cards">
    <div class="container">
        <p class="loading-indicator" id="loading-indicator">
            Loading landmarks...
        </p>
        <div class="landmark-grid" id="landmark-grid" role="list">
            <!-- Cards are injected here by region.js -->
        </div>
    </div>
</section>
```
- `id="loading-indicator"` — A `<p>` tag showing "Loading landmarks..." while the JSON fetch is in progress. JavaScript hides it with `style.display = 'none'` once data arrives.
- `id="landmark-grid"` — An empty `<div>` acting as a blank canvas. JavaScript fills it with card HTML.
- `role="list"` — An ARIA attribute. Since we are dynamically injecting `<article>` elements, this tells screen readers to treat the container as a list.

### The Native `<dialog>` Modal
```html
<dialog class="landmark-modal" id="landmark-modal"
        aria-modal="true" aria-labelledby="modal-title">

    <div class="modal-layout">
        <img class="modal-image" id="modal-image" src="" alt="" loading="lazy">

        <div class="modal-body">
            <button class="modal-close-btn" id="modal-close-btn"
                    aria-label="Close preview">
                &times; <!-- HTML entity for the × symbol -->
            </button>

            <p class="modal-category" id="modal-category"></p>
            <h2 class="modal-title" id="modal-title"></h2>
            <p class="modal-desc" id="modal-desc"></p>
            <div class="modal-divider" aria-hidden="true"></div>

            <a class="btn-solid modal-detail-link" id="modal-detail-link" href="#">
                See Full Details →
            </a>
        </div>
    </div>
</dialog>
```
- `<dialog>` — A semantic HTML5 element specifically for popup dialogs and modals. The browser hides it completely by default. It only shows when `.showModal()` is called in JavaScript.
- `aria-modal="true"` — Tells screen readers that when this modal is open, the content behind it should be ignored.
- `aria-labelledby="modal-title"` — Links the dialog to its heading. Screen readers will announce the modal's title (`id="modal-title"`) when the dialog opens.
- `&times;` — An HTML entity for the × character (×). HTML entities start with `&` and end with `;`.
- All the `id` fields inside (`modal-image`, `modal-title`, etc.) are empty placeholders. JavaScript fills them when a card is clicked.
- `href="#"` on the detail link — A placeholder `href` pointing to `#` (nothing). JavaScript updates it to `landmark.html?id=XXXXX` before the modal opens.

---

## 2. The CSS Styling (Line-by-Line)

### The Landmark Card
```css
.landmark-card {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    aspect-ratio: 4 / 3;
    cursor: pointer;
}

.landmark-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.landmark-card:hover .landmark-card-img {
    transform: scale(1.06);
}

.landmark-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.9) 30%, transparent 100%);
    display: flex;
    align-items: flex-end;
}
```
- `aspect-ratio: 4 / 3` — Forces cards to a landscape (wider than tall) 4:3 ratio.
- `overflow: hidden` — Critical for the zoom hover effect. When the image scales up, it doesn't overflow outside the rounded card.
- `cursor: pointer` — The mouse cursor shows a hand icon over the card.
- `position: absolute; inset: 0` — The overlay stretches to fill the entire card.
- `background: linear-gradient(to top, rgba(0,0,0,0.9) 30%, transparent 100%)` — A gradient from near-opaque black at the bottom to completely transparent at the top.

### The Hidden Reveal Content
```css
.landmark-card-hidden {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease;
    opacity: 0;
    transition: max-height 0.4s ease, opacity 0.3s ease;
}

.landmark-card:hover .landmark-card-hidden {
    max-height: 150px;
    opacity: 1;
}
```
- `max-height: 0; overflow: hidden` — When max-height is 0 and overflow is hidden, the content is completely invisible and takes no space.
- `transition: max-height 0.4s ease, opacity 0.3s ease` — Two properties animate simultaneously. The content expands (max-height) and fades in (opacity) over 0.4 and 0.3 seconds respectively.

### Importance Dots
```css
.importance-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.6);
    background: transparent;
}

.importance-dot.filled {
    background: var(--accent);
    border-color: var(--accent);
}
```
- `border-radius: 50%` — Turns the square `<span>` into a perfect circle (50% border radius on all corners = circle).
- `border: 1.5px solid ...` — An unfilled dot shows as an empty circle outline.
- `.importance-dot.filled` — A filled dot has the accent color background.

### The Native `<dialog>` Modal Styling
```css
.landmark-modal {
    border: none;
    border-radius: var(--radius-lg);
    padding: 0;
    max-width: 760px;
    width: 90%;
    box-shadow: 0 30px 80px rgba(0,0,0,0.3);
}

.landmark-modal::backdrop {
    background: rgba(0, 0, 0, 0.6);
}
```
- The browser applies default `<dialog>` styling. We remove all of it: `border: none; padding: 0;`.
- `.landmark-modal::backdrop` — A special CSS pseudo-element provided by the browser for `<dialog>`. It covers the page behind the dialog when `.showModal()` is called. We style it as a semi-transparent black overlay.

---

## 3. The JavaScript Logic (Line-by-Line)

### Step 1: Reading the URL Parameter
```javascript
const params   = new URLSearchParams(window.location.search);
const regionId = params.get('id');
```
- `window.location.search` — The "query string" of the URL. For `region.html?id=cairo`, this returns `"?id=cairo"`.
- `new URLSearchParams(...)` — A built-in browser API that parses the query string into a usable object.
- `.get('id')` — Retrieves the value for the key `id`. Returns `"cairo"`.

### Step 2: The REGION_CONFIG Object
```javascript
const REGION_CONFIG = {
    cairo:          { label: 'Cairo',           cssId: 'cairo' },
    giza_pyramids:  { label: 'Giza & Pyramids', cssId: 'giza_pyramids' },
    luxor_thebes:   { label: 'Luxor & Thebes',  cssId: 'luxor_thebes' },
    aswan_nubia:    { label: 'Aswan & Nubia',   cssId: 'aswan_nubia' },
    alexandria:     { label: 'Alexandria',      cssId: 'alexandria' },
    sinai_red_sea:  { label: 'Sinai & Red Sea', cssId: 'sinai_red_sea' },
    western_desert: { label: 'Western Desert',  cssId: 'western_desert' },
    upper_egypt:    { label: 'Upper Egypt',     cssId: 'upper_egypt' },
};
```
- This is a JavaScript **object** acting as a lookup table. The keys (like `cairo`) are the URL parameter values. Each value is another object with `label` (for display text) and `cssId` (for the CSS accent color).
- `REGION_CONFIG[regionId]` — Square bracket notation accesses an object property using a variable. If `regionId === 'cairo'`, this returns `{ label: 'Cairo', cssId: 'cairo' }`.

### Step 3: Applying the Region's Accent Color
```javascript
function applyRegionTheme(config) {
    document.body.setAttribute('data-region', config.cssId);
}
```
- `document.body.setAttribute('data-region', 'cairo')` — Adds `data-region="cairo"` to the `<body>` tag.
- In `global.css`, there are rules like: `[data-region="cairo"] { --accent: #B85C3A; }`. Applying this attribute instantly changes the accent color for all elements using `var(--accent)` on this page.

### Step 4: Updating the Page Header
```javascript
function renderRegionHeader(config, count) {
    document.title = config.label + ' — Egypt Wonders';

    const nameEl = document.getElementById('region-name');
    if (nameEl) nameEl.textContent = config.label;

    const watermarkEl = document.getElementById('region-watermark');
    if (watermarkEl) watermarkEl.textContent = config.label.toUpperCase();

    const countEl = document.getElementById('region-count');
    if (countEl) countEl.textContent = count + ' Landmarks';
}
```
- `document.title = ...` — Directly sets the browser tab title. The `+` concatenates two strings together.
- `if (nameEl) nameEl.textContent = ...` — The `if` guard prevents a crash if the element doesn't exist. `.textContent` sets the visible text content inside the element.
- `.toUpperCase()` — Converts all letters to uppercase. `"Cairo"` → `"CAIRO"`.

### Step 5: Building Importance Dots
```javascript
function buildImportanceDots(importance) {
    const filledCount = Math.min(Math.round(importance / 2), 5);
    const totalDots   = 5;
    let dotsHTML = '';

    for (let i = 1; i <= totalDots; i++) {
        const filledClass = i <= filledCount ? ' filled' : '';
        dotsHTML += '<span class="importance-dot' + filledClass + '"></span>';
    }
    return dotsHTML;
}
```
- `Math.round(importance / 2)` — Converts the 1–10 importance score to a 1–5 dot scale.
- `Math.min(..., 5)` — Ensures the result never exceeds 5 (even if data has importance > 10).
- `for (let i = 1; i <= totalDots; i++)` — A classic for-loop. Starts at 1, runs while `i` is 5 or less, increments by 1 each iteration.
- `i <= filledCount ? ' filled' : ''` — A ternary operator (compact if/else). If this dot's position (`i`) is within the filled count, add the `' filled'` class; otherwise add nothing.
- `dotsHTML +=` — `+=` appends the new HTML to the existing string.

### Step 6: Building a Landmark Card (Template Literals)
```javascript
function buildLandmarkCard(landmark) {
    const imgSrc  = landmark.imagePath || landmark.thumbnail || '';
    const dotsHTML = buildImportanceDots(landmark.importance || 0);

    return `
        <article
            class="landmark-card cinematic-card"
            data-id="${landmark.id}"
            role="button"
            tabindex="0"
            aria-label="View details for ${landmark.name}">

            <img class="landmark-card-img"
                 src="assets/${imgSrc}"
                 alt="${landmark.name}"
                 loading="lazy">

            <div class="landmark-card-overlay">
                <div class="landmark-card-content">
                    <div class="landmark-card-top">
                        <span class="landmark-card-tag">${landmark.category}</span>
                        <div class="importance-dots">${dotsHTML}</div>
                    </div>
                    <h2 class="landmark-card-name">${landmark.name}</h2>
                    <div class="landmark-card-hidden">
                        <p class="landmark-card-desc">${landmark.description || ''}</p>
                        <span class="landmark-card-btn">Quick Preview →</span>
                    </div>
                </div>
            </div>
        </article>
    `;
}
```
- `landmark.imagePath || landmark.thumbnail || ''` — The `||` chain tries `imagePath` first; if it's falsy (null/undefined), tries `thumbnail`; if that's also falsy, uses an empty string.
- `` `...` `` — Template literals allow multi-line strings and use `${expression}` to embed variable values.
- `data-id="${landmark.id}"` — Stores the landmark ID as a data attribute on the card. JavaScript later reads this to know which landmark was clicked.
- `role="button"` — Since this is an `<article>` (not a native `<button>`), we add this ARIA role so screen readers know it is clickable.
- `tabindex="0"` — Makes the card focusable via keyboard Tab key, enabling keyboard navigation.
- `loading="lazy"` — Browser will not download this image until the user scrolls near it. Critical for performance with 22+ cards.

### Step 7: Rendering the Grid & Event Delegation
```javascript
function renderLandmarkGrid(landmarks) {
    const grid = document.getElementById('landmark-grid');
    if (!grid) return;

    const loader = document.getElementById('loading-indicator');
    if (loader) loader.style.display = 'none';

    grid.innerHTML = landmarks.map(buildLandmarkCard).join('');

    grid.addEventListener('click', function(event) {
        const card = event.target.closest('.landmark-card');
        if (card) {
            const landmarkId = card.dataset.id;
            const landmark   = landmarks.find(l => l.id === landmarkId);
            if (landmark) openModal(landmark);
        }
    });

    grid.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            const card = event.target.closest('.landmark-card');
            if (card) {
                event.preventDefault();
                const landmarkId = card.dataset.id;
                const landmark   = landmarks.find(l => l.id === landmarkId);
                if (landmark) openModal(landmark);
            }
        }
    });
}
```
- `landmarks.map(buildLandmarkCard)` — `.map()` calls `buildLandmarkCard` for EVERY landmark in the array and collects the HTML strings into a new array.
- `.join('')` — Combines all the HTML strings in the array into one single long string, with no separator between them.
- `grid.innerHTML = ...` — Sets the entire inner content of the grid in one operation. The browser parses the HTML string and renders all cards simultaneously.
- **Event Delegation:** Instead of attaching a click listener to each of 22 cards individually, we attach ONE listener to the parent `grid`. When any card is clicked, the click event "bubbles up" to the grid, where we catch it.
- `event.target.closest('.landmark-card')` — `.closest()` walks UP the DOM tree from the element that was actually clicked (e.g., the `<img>` or `<h2>` inside the card) until it finds an ancestor with the class `landmark-card`.
- `card.dataset.id` — Reads the `data-id` attribute. `.dataset` is a special property that maps all `data-*` attributes.
- `event.key === 'Enter' || event.key === ' '` — Keyboard support. Pressing Enter or Space on a focused card opens the modal.

### Step 8: Opening & Closing the Native Dialog Modal
```javascript
const modal = document.getElementById('landmark-modal');

function openModal(landmark) {
    const imgSrc = landmark.imagePath || landmark.thumbnail || '';
    document.getElementById('modal-image').src = 'assets/' + imgSrc;
    document.getElementById('modal-image').alt = landmark.name;
    document.getElementById('modal-category').textContent = landmark.category || '';
    document.getElementById('modal-title').textContent    = landmark.name;
    document.getElementById('modal-desc').textContent     = landmark.description || '';
    document.getElementById('modal-detail-link').href     = 'landmark.html?id=' + landmark.id;

    modal.showModal();
}

function closeModal() {
    modal.close();
}

// Close when clicking the backdrop (outside the modal box)
modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

document.getElementById('modal-close-btn').addEventListener('click', closeModal);
```
- `modal.showModal()` — A native `<dialog>` method. Opens it as a "modal" — this means a backdrop is automatically applied and focus is trapped inside the dialog.
- `modal.close()` — The native close method.
- `if (event.target === modal)` — The `===` checks if the click landed directly on the `<dialog>` element itself (its backdrop area), not on an element inside it. If `event.target` is a child (like `modal-title`), this condition is false.

### Step 9: The Main Async Function
```javascript
async function main() {
    if (!regionId || !REGION_CONFIG[regionId]) {
        showError('Region not found.');
        return;
    }

    const config = REGION_CONFIG[regionId];
    applyRegionTheme(config);

    try {
        const response = await fetch('assets/landmarks.json');

        if (!response.ok) {
            throw new Error('Could not load landmarks data.');
        }

        const allLandmarks = await response.json();

        const regionLandmarks = allLandmarks.filter(function(landmark) {
            return landmark.region === config.label;
        });

        renderRegionHeader(config, regionLandmarks.length);
        renderLandmarkGrid(regionLandmarks);

    } catch (error) {
        showError('Failed to load landmarks. ' + error.message);
    }
}

main();
```
- `async function main()` — The `async` keyword marks this function as asynchronous, enabling use of `await` inside it.
- `await fetch(...)` — `fetch()` sends an HTTP GET request for the JSON file. `await` pauses this function until the response arrives. Other code in the browser continues running — the page doesn't freeze.
- `response.ok` — A boolean (`true`/`false`) property on the fetch response. `true` means HTTP status 200 (success). `false` means 404, 500, etc.
- `throw new Error(...)` — Manually creates and throws an error. This immediately jumps to the `catch` block.
- `await response.json()` — Parses the response body text as JSON into a JavaScript object. Also requires `await` because it is asynchronous.
- `.filter(...)` — Loops through all 90+ landmarks and keeps only those whose `region` property matches `config.label`.
- `try { ... } catch (error) { ... }` — If anything inside `try` throws an error (network failure, JSON parse error, etc.), execution jumps to `catch` and we handle the error gracefully instead of crashing.
- `main()` — The last line. Calls the function to start the whole process.

---

## 4. Interaction Summary

"My section eliminates page duplication using URL parameters and dynamic data fetching. **HTML** provides empty placeholder shells: an `<h1>` with `id='region-name'` starting as 'Loading...', an empty `<div id='landmark-grid'>`, and a native `<dialog>` element that stays hidden until called. **CSS** handles the card hover reveal using `max-height: 0` to `max-height: 150px` transition, the zoom effect with `transform: scale(1.06)`, and the modal backdrop using the native `::backdrop` pseudo-element. **JavaScript** does the heavy lifting: reads the `id` URL parameter with `URLSearchParams`, uses an `REGION_CONFIG` lookup table to get the display name, applies a `data-region` attribute to `<body>` for CSS-driven accent color theming, then uses `async/await` with `fetch()` to load the JSON file asynchronously. After filtering the 90+ landmark array down to region-specific items, it calls `.map(buildLandmarkCard).join('')` to generate all card HTML in a single string and assigns it to `innerHTML`. Clicks are handled via event delegation — one listener on the grid uses `.closest()` to identify clicked cards regardless of which child element was clicked. The native `<dialog>` modal is opened with `.showModal()` and closed via the close button or a click on the `::backdrop`."
