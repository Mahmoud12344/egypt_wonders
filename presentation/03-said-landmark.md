# 03. The Landmark Detail Page & Gallery (Deep Dive)
**Developer:** Said
**Core Files:** `landmark.html`, `css/landmark.css`, `js/landmark.js`

This document is a comprehensive, line-by-line textbook explaining every piece of code on the Landmark Detail page. This is the most content-rich page: a full-screen hero, an interactive image gallery with fade animation, a long description, a sticky metadata sidebar, and a Google Maps link — all built entirely from JSON data.

> **Key Design Decision:** Like the Region page, this page is ONE HTML template that serves ALL landmarks. The `?id=` URL parameter determines which landmark's data is loaded. This avoids creating 90+ separate HTML files.

---

## 1. The HTML Structure (Line-by-Line)

### The Dynamic Head
```html
<!-- Default title — landmark.js replaces this -->
<title>Landmark — Egypt Wonders</title>
<link rel="stylesheet" href="css/global.css?v=6">
<link rel="stylesheet" href="css/landmark.css?v=4">
```
- The `<title>` starts as a placeholder. JavaScript updates it to the landmark's name: `"Karnak Temple — Egypt Wonders"`.
- `landmark.css` contains styles specific to the detail page (hero, gallery, sidebar, two-column layout).

### The Dynamic Background Watermark
```html
<div class="bg-watermark" aria-hidden="true" id="landmark-watermark">LANDMARK</div>
```
- Has `id="landmark-watermark"` so JavaScript can update its text to the landmark name in uppercase: e.g., `"KARNAK TEMPLE"`.

### The Hero Section (Dynamic Background Image)
```html
<section class="landmark-hero" id="landmark-hero" aria-label="Landmark hero image">

    <!-- Darkening overlay -->
    <div class="landmark-hero-overlay" aria-hidden="true"></div>

    <!-- Text overlaid on the hero image -->
    <div class="landmark-hero-content container">

        <!-- Breadcrumb link back to the Region page -->
        <a class="landmark-breadcrumb" id="landmark-breadcrumb" href="index.html">
            ← Back
        </a>

        <!-- Category badge -->
        <div class="landmark-hero-badge">
            <span class="badge" id="landmark-hero-badge"></span>
        </div>

        <!-- Main heading -->
        <h1 class="landmark-hero-title" id="landmark-hero-title">Loading...</h1>
    </div>
</section>
```
- `id="landmark-hero"` — JavaScript sets the background image via `heroEl.style.backgroundImage = 'url("assets/...")'`. CSS then displays it.
- `<div class="landmark-hero-overlay">` — Empty `<div>` styled by CSS with a dark gradient to keep white text readable.
- `id="landmark-breadcrumb"` — Starts as `href="index.html"`. JavaScript updates both the `href` (to the correct region URL) and the `textContent` (to e.g. `← Cairo`).
- `id="landmark-hero-badge"` — Empty `<span>`. JavaScript fills it with the landmark's category (e.g., `"Ancient Temples"`).
- `id="landmark-hero-title"` — Starts as `"Loading..."`. JavaScript fills it with the landmark's name.

### The Two-Column Detail Layout
```html
<section class="landmark-detail" aria-label="Landmark details">
    <div class="container">
        <div class="landmark-detail-layout">

            <!-- LEFT COLUMN -->
            <div class="landmark-main-content">

                <!-- IMAGE GALLERY -->
                <figure class="gallery" aria-label="Landmark image gallery">

                    <!-- Featured large image -->
                    <img class="gallery-featured" id="gallery-featured"
                         src="" alt="" loading="eager">

                    <!-- Thumbnail strip -->
                    <div class="gallery-thumbnails" id="gallery-thumbnails"
                         role="list" aria-label="Gallery thumbnails">
                    </div>
                </figure>

                <!-- LONG DESCRIPTION -->
                <div class="landmark-description-section">
                    <span class="section-label">About This Landmark</span>
                    <p class="landmark-long-desc" id="landmark-long-desc"></p>
                </div>
            </div>

            <!-- RIGHT COLUMN — STICKY SIDEBAR -->
            <aside class="landmark-sidebar" aria-label="Landmark information">

                <div class="sidebar-accent-line" aria-hidden="true"></div>

                <div class="sidebar-item">
                    <span class="sidebar-label">Region</span>
                    <span class="sidebar-value" id="sidebar-region">—</span>
                </div>

                <div class="sidebar-item">
                    <span class="sidebar-label">Governorate</span>
                    <span class="sidebar-value" id="sidebar-governorate">—</span>
                </div>

                <div class="sidebar-item">
                    <span class="sidebar-label">Category</span>
                    <span class="sidebar-value" id="sidebar-category">—</span>
                </div>

                <!-- Importance progress bar -->
                <div class="sidebar-item">
                    <span class="sidebar-label">Significance</span>
                    <div class="importance-bar-wrapper">
                        <div class="importance-bar-track">
                            <div class="importance-bar-fill"
                                 id="importance-bar-fill"
                                 style="width: 0%"></div>
                        </div>
                        <span class="importance-score-text" id="importance-score-text">—</span>
                    </div>
                </div>

                <!-- Coordinates / Google Maps link -->
                <div class="sidebar-item" id="sidebar-coords">
                    <span class="sidebar-label">Location</span>
                    <span class="sidebar-value">Loading...</span>
                </div>

            </aside>
        </div>
    </div>
</section>
```
- `<figure>` — A semantic HTML5 element for self-contained media content (images, diagrams). Wrapping the gallery in `<figure>` is semantically more correct than a `<div>`.
- `loading="eager"` on the featured image — The OPPOSITE of `loading="lazy"`. The main gallery image is loaded immediately because it is the first thing users see.
- `id="gallery-thumbnails"` — Empty container. JavaScript generates and injects all thumbnail `<img>` elements here.
- `id="landmark-long-desc"` — Empty `<p>`. JavaScript fills it with the landmark's long description text from the JSON.
- `<aside>` — Semantic HTML5 tag for content that is related to but somewhat separate from the main content. The metadata sidebar is a perfect use case.
- `style="width: 0%"` on `importance-bar-fill` — Starts at zero width. JavaScript computes the correct percentage and sets it, causing the bar to fill up.
- `id="sidebar-coords"` — JavaScript completely replaces the inside of this `<div>` with formatted coordinate text and a Google Maps link.

---

## 2. The CSS Styling (Line-by-Line)

### The Hero Section
```css
.landmark-hero {
    height: 60vh;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: flex-end;
}

.landmark-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.2) 100%);
}

.landmark-hero-content {
    position: relative;
    z-index: 2;
    padding-bottom: var(--space-xl);
    color: white;
}
```
- `height: 60vh` — The hero is 60% of the screen height (not 100% like the home page hero). This leaves room for the detail content below without scrolling.
- `background-size: cover` — Scales the background image to cover the entire section without distortion. This works with the `backgroundImage` JavaScript sets.
- `background-position: center` — Centers the background image.
- `align-items: flex-end` — Pushes the content (`landmark-hero-content`) to the BOTTOM of the hero section. The title appears at the bottom of the image.
- `background: linear-gradient(to top, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.2) 100%)` — A gradient that is very dark (85% black) at the bottom (where the title is) fading to only slightly dark (20% black) at the top.

### The Two-Column Grid Layout
```css
.landmark-detail-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: var(--space-xl);
    align-items: start;
}

@media (max-width: 900px) {
    .landmark-detail-layout {
        grid-template-columns: 1fr;
    }
}
```
- `grid-template-columns: 1fr 340px` — Creates two columns. The left column takes all available space (`1fr`). The right column (sidebar) is a fixed 340px wide.
- `align-items: start` — Both columns start at the top. Without this, the sidebar would stretch to match the height of the left column.
- `@media (max-width: 900px)` — A "Media Query". This block of CSS only activates when the screen is 900px or narrower. The `1fr 340px` grid becomes `1fr` (one full-width column), stacking the sidebar below the main content on tablets and phones.

### The Sticky Sidebar
```css
.landmark-sidebar {
    position: sticky;
    top: calc(var(--nav-height) + 20px);
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    overflow: hidden;
}
```
- `position: sticky` — The sidebar scrolls with the page initially, but once it reaches `top: calc(...)`, it "sticks" in place. The user can then scroll the long description without losing sight of the metadata.
- `top: calc(var(--nav-height) + 20px)` — `calc()` is a CSS function that can do math. It positions the sticky point exactly below the fixed navbar height plus 20px of breathing room.

### The Gallery Featured Image
```css
.gallery-featured {
    width: 100%;
    height: 420px;
    object-fit: cover;
    border-radius: var(--radius-lg);
    transition: opacity 0.2s ease;
}
```
- `transition: opacity 0.2s ease` — This enables the fade animation. When JavaScript sets `opacity: '0'` then later `opacity: '1'`, CSS animates it over 200ms.

### The Thumbnail Strip
```css
.gallery-thumbnails {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 12px;
}

.gallery-thumb {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    opacity: 0.55;
    cursor: pointer;
    border: 2px solid transparent;
    transition: opacity 0.2s, border-color 0.2s;
}

.gallery-thumb.active,
.gallery-thumb:hover {
    opacity: 1;
    border-color: var(--accent);
}
```
- `display: flex; flex-wrap: wrap` — Thumbnails line up in a row and wrap to the next line if there are many.
- `opacity: 0.55` — All thumbnails start at 55% opacity (slightly faded), indicating they are not the currently displayed image.
- `border: 2px solid transparent` — All thumbnails always have a 2px border, but it starts as transparent (invisible). This prevents the layout from jumping when `.active` adds a colored border.
- `.gallery-thumb.active, .gallery-thumb:hover` — Both states (active = currently displayed; hover = mouse over) make the thumbnail fully opaque and show a golden border.

### The Importance Bar
```css
.importance-bar-track {
    height: 6px;
    background: var(--border-color);
    border-radius: 3px;
    overflow: hidden;
}

.importance-bar-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 3px;
    transition: width 0.6s ease;
}
```
- `.importance-bar-track` — The grey background track (the full 100% wide bar). `overflow: hidden` clips the fill bar to the track.
- `.importance-bar-fill` — The colored fill portion. Its `width` is set by JavaScript as a percentage.
- `transition: width 0.6s ease` — When JavaScript sets the width, it animates from 0% to the actual value over 0.6 seconds, creating a satisfying "loading bar" effect.

---

## 3. The JavaScript Logic (Line-by-Line)

### Step 1: Reading the Landmark ID
```javascript
const params     = new URLSearchParams(window.location.search);
const landmarkId = params.get('id');
```
- If the URL is `landmark.html?id=11959`, `params.get('id')` returns `"11959"`.

### Step 2: The Region Lookup Maps
```javascript
const REGION_CSS_MAP = {
    'Cairo':           'cairo',
    'Giza & Pyramids': 'giza_pyramids',
    // ... all regions
};

const REGION_URL_MAP = {
    'Cairo':           'cairo',
    // ... all regions
};
```
- `REGION_CSS_MAP` maps the landmark's JSON `region` field (e.g., `"Cairo"`) to the CSS `data-region` attribute value (e.g., `"cairo"`).
- `REGION_URL_MAP` maps it to the URL parameter value (e.g., `cairo` in `region.html?id=cairo`). They are the same values in this project, but separated for clarity.

### Step 3: The Gallery — setupGallery()
```javascript
function setupGallery() {
    const featuredImg = document.getElementById('gallery-featured');
    const thumbnails  = document.querySelectorAll('.gallery-thumb');

    if (!featuredImg || thumbnails.length === 0) return;

    thumbnails.forEach(function(thumb) {
        thumb.addEventListener('click', function() {

            // 1. Fade out the featured image
            featuredImg.style.opacity = '0';

            // 2. After 200ms (the CSS transition time), swap the image
            setTimeout(function() {
                featuredImg.src     = thumb.src;
                featuredImg.alt     = thumb.alt;
                featuredImg.style.opacity = '1'; // fade back in
            }, 200);

            // 3. Update which thumbnail is marked as active
            thumbnails.forEach(function(t) { t.classList.remove('active'); });
            thumb.classList.add('active');
        });
    });
}
```
- `thumbnails.length === 0` — If there are no thumbnails (e.g., only one image), exit the function immediately.
- `featuredImg.style.opacity = '0'` — Sets the CSS `opacity` property to `0`. The `transition: opacity 0.2s` on the element makes this animate smoothly.
- `setTimeout(function() { ... }, 200)` — Waits exactly 200 milliseconds (matching the CSS transition duration) before swapping the `src`. This times the image swap to happen when the fade-out is complete.
- `featuredImg.src = thumb.src` — Copies the thumbnail's image URL to the featured image's source.
- `featuredImg.style.opacity = '1'` — Fades the featured image back in, now showing the new image.
- `thumbnails.forEach(t => t.classList.remove('active'))` — Resets all thumbnails to inactive.
- `thumb.classList.add('active')` — Marks only the clicked thumbnail as active.

### Step 4: renderLandmarkPage() — Populating Everything
```javascript
function renderLandmarkPage(landmark, imageData) {
    // Apply the region accent color
    const regionCssId = REGION_CSS_MAP[landmark.region];
    if (regionCssId) document.body.setAttribute('data-region', regionCssId);

    // Update the browser tab title
    document.title = landmark.name + ' — Egypt Wonders';

    // Update the background watermark text
    document.getElementById('landmark-watermark').textContent = landmark.name.toUpperCase();

    // Set the hero background image via inline JavaScript style
    const heroEl  = document.getElementById('landmark-hero');
    const heroImg = landmark.imagePath || landmark.thumbnail || '';
    if (heroEl && heroImg) {
        heroEl.style.backgroundImage = 'url("assets/' + heroImg + '")';
    }

    // Update the breadcrumb link text and href
    const breadcrumbEl  = document.getElementById('landmark-breadcrumb');
    const regionUrlId   = REGION_URL_MAP[landmark.region] || '';
    breadcrumbEl.href        = 'region.html?id=' + regionUrlId;
    breadcrumbEl.textContent = '← ' + (landmark.region || 'Back');

    // Set the hero title and badge
    document.getElementById('landmark-hero-title').textContent = landmark.name;
    document.getElementById('landmark-hero-badge').textContent = landmark.category || '';
}
```
- `REGION_CSS_MAP[landmark.region]` — Square bracket notation. `landmark.region` is a string like `"Cairo"`. We use it as a key to look up the CSS ID `"cairo"`.
- `heroEl.style.backgroundImage = 'url("assets/' + heroImg + '")'` — Sets the CSS `background-image` property directly via JavaScript. The string must be formatted exactly as CSS expects: `url("path/to/image.jpg")`.
- `breadcrumbEl.href = 'region.html?id=' + regionUrlId` — Updates the link destination. The `+` concatenates strings.

### Step 5: Building the Gallery
```javascript
const images = (imageData && imageData.images && imageData.images.length > 0)
    ? imageData.images
    : [{ path: heroImg, filename: '0.jpg' }];

// Set the featured image to the first photo
featuredImg.src = 'assets/' + images[0].path;
featuredImg.alt = landmark.name;

// Build the thumbnail strip
thumbContainer.innerHTML = images.map(function(img, index) {
    const activeClass = index === 0 ? ' active' : '';
    return '<img'
        + ' class="gallery-thumb' + activeClass + '"'
        + ' src="assets/' + img.path + '"'
        + ' alt="' + landmark.name + ' — image ' + (index + 1) + '"'
        + ' loading="lazy"'
        + '>';
}).join('');

setupGallery();
```
- `(imageData && imageData.images && imageData.images.length > 0) ? ... : ...` — A ternary with multiple `&&` guards. Checks that `imageData` exists, has an `images` property, and that it has at least one item before using it.
- `images[0].path` — Accesses the `path` property of the first image object (index 0).
- `.map(function(img, index) {...})` — `.map()` transforms each image into an HTML string. The `index` is the position number (0, 1, 2...).
- `index === 0 ? ' active' : ''` — The first thumbnail gets the `active` class.
- `.join('')` — Merges all strings in the resulting array into one string.
- `setupGallery()` — Called AFTER the thumbnails are injected. If called before, there would be nothing for it to attach listeners to.

### Step 6: The Importance Bar
```javascript
const score = landmark.importance || 0;
document.getElementById('importance-bar-fill').style.width = (score / 10 * 100) + '%';
document.getElementById('importance-score-text').textContent = score + ' / 10';
```
- `landmark.importance || 0` — If `importance` is missing from the JSON, default to `0`.
- `(score / 10 * 100) + '%'` — Converts the 0–10 score to a 0–100% percentage string. A score of `8` becomes `'80%'`. The `transition: width 0.6s` in CSS animates this.
- `score + ' / 10'` — Concatenates the score with `" / 10"` to create the text `"8 / 10"`.

### Step 7: Building the Coordinates & Google Maps Link
```javascript
const coords = landmark.coordinates;
if (coords && (coords.latitude || coords.lat)) {
    const lat = coords.latitude || coords.lat;
    const lng = coords.longitude || coords.lng;
    const mapsUrl = 'https://maps.google.com/?q=' + lat + ',' + lng;

    coordsContainer.innerHTML =
        '<span class="sidebar-value">' + lat.toFixed(4) + '° N, ' + lng.toFixed(4) + '° E</span>'
        + '<a href="' + mapsUrl + '" target="_blank" rel="noopener" class="coordinates-link">'
        + '↗ View on Google Maps'
        + '</a>';
}
```
- `coords.latitude || coords.lat` — Some entries use `latitude`, others use `lat`. The `||` tries both.
- `.toFixed(4)` — Formats a number to exactly 4 decimal places. `30.0444` stays `30.0444`. `30` becomes `30.0000`.
- `'https://maps.google.com/?q=' + lat + ',' + lng` — Builds a Google Maps URL. Visiting this URL opens Google Maps centered on those coordinates.
- `target="_blank"` — Opens the link in a new browser tab, keeping the Egypt Wonders page open.
- `rel="noopener"` — A security attribute for `target="_blank"` links. Without it, the opened page could potentially control the original page via `window.opener`.

### Step 8: The Main Function with Promise.all()
```javascript
async function main() {
    if (!landmarkId) {
        showError('No landmark specified.');
        return;
    }

    try {
        // Fetch BOTH JSON files simultaneously
        const [landmarksResponse, imagesResponse] = await Promise.all([
            fetch('assets/landmarks.json'),
            fetch('assets/landmark_images.json')
        ]);

        if (!landmarksResponse.ok) throw new Error('Could not load landmarks data.');
        if (!imagesResponse.ok)   throw new Error('Could not load image data.');

        // Parse BOTH response bodies simultaneously
        const [allLandmarks, allImages] = await Promise.all([
            landmarksResponse.json(),
            imagesResponse.json()
        ]);

        // Find this landmark in the main database
        const landmark = allLandmarks.find(l => l.id === landmarkId);
        if (!landmark) {
            showError('Landmark not found.');
            return;
        }

        // Find this landmark's images in the images database
        const imageData = allImages.landmarks
            ? allImages.landmarks.find(l => l.id === landmarkId)
            : null;

        renderLandmarkPage(landmark, imageData);

    } catch (error) {
        showError('Failed to load landmark. ' + error.message);
    }
}

main();
```
- `Promise.all([fetch(file1), fetch(file2)])` — Starts BOTH fetch requests at the same time. Instead of waiting for the first file (say 100ms) and then waiting for the second (another 100ms) = 200ms total, both load in parallel and finish in ~100ms total.
- `const [landmarksResponse, imagesResponse] = await Promise.all(...)` — Destructuring assignment. The two results from the resolved Promise array are unpacked into two separate variables.
- `throw new Error(...)` — Manually throws an error inside `try`, which immediately jumps to the `catch` block.
- `allImages.landmarks` — `landmark_images.json` has a top-level `landmarks` key. We check it exists before calling `.find()` on it.
- `allImages.landmarks.find(l => l.id === landmarkId)` — Searches the images array for the entry matching our landmark ID. If not found, returns `undefined` (which is handled by passing `null` to `renderLandmarkPage`).

---

## 4. Interaction Summary

"My section delivers the most detailed user experience in the project through parallel data fetching, a synchronized fade animation, and a sticky metadata sidebar. **HTML** provides the two-column shell with a `<figure>` for the gallery, an empty thumbnail container (`id='gallery-thumbnails'`), an `<aside>` for the sidebar, and an importance bar with `style='width: 0%'` as a starting point. **CSS** uses `grid-template-columns: 1fr 340px` for the desktop two-column layout that collapses to one column at 900px via a media query, `position: sticky` on the sidebar so it stays in view while scrolling the description, and `transition: opacity 0.2s` on the featured image enabling the fade animation. **JavaScript** reads the `?id=` URL parameter, uses `Promise.all()` to simultaneously fetch both `landmarks.json` and `landmark_images.json`, then calls `renderLandmarkPage()` which sets the hero `backgroundImage` via inline style, populates all sidebar IDs with `.textContent`, builds the thumbnail strip using `.map().join('')`, and dynamically builds a Google Maps URL from the JSON coordinates. The `setupGallery()` function attaches click listeners to each thumbnail — clicking triggers a `setTimeout`-synchronized fade (opacity → 0 then swap src then opacity → 1) and updates the `.active` class."
