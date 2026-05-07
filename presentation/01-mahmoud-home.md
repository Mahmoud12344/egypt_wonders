# 01. The Home Page & Global Navigation (Deep Dive)
**Developer:** Mahmoud
**Core Files:** `index.html`, `css/global.css`, `css/home.css`, `js/nav.js`, `js/reveal.js`

This document is a comprehensive, line-by-line textbook explaining every piece of code used on the Home Page and the shared Navigation bar. This page acts as the entry point of the entire project.

> **Why are the regions hardcoded in HTML (not loaded from JSON)?**
> Because there are only 8 regions that never change. Hardcoding them means the page needs zero JavaScript to display — it loads instantly and is simpler to understand. The 90+ landmarks ARE dynamic and use JS + JSON (see Hossam's section).

---

## 1. The HTML Structure (Line-by-Line)

### The `<head>` Block
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Egypt Wonders — Explore the Heritage</title>
    <meta name="description" content="Explore Egypt's most remarkable landmarks...">
    <link rel="stylesheet" href="css/global.css?v=6">
    <link rel="stylesheet" href="css/home.css?v=4">
</head>
```
- `<!DOCTYPE html>` — Tells the browser to use HTML5 (modern standard). Without it, the browser might use an older "quirks mode" that renders things differently.
- `<html lang="en">` — The root element. `lang="en"` tells search engines and screen readers the page is in English.
- `<meta charset="UTF-8">` — Declares the character encoding. UTF-8 supports every language character including Arabic and emoji.
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — Makes the site responsive on mobile. Without this, mobile browsers would shrink the entire desktop layout to fit the small screen, making text tiny.
- `<title>` — Text shown in the browser tab and used by Google as the clickable link title in search results.
- `<meta name="description">` — The short description shown below the title in Google results.
- Two `<link rel="stylesheet">` tags — Load CSS files. Order matters: `global.css` must come first because `home.css` depends on variables defined inside it. The `?v=6` suffix "cache-busts" the file — it tricks the browser into re-downloading the latest version instead of using an old saved copy.

### The Background Watermark
```html
<div class="bg-watermark" aria-hidden="true">WONDERS</div>
```
- A decorative `<div>` containing the word "WONDERS" that appears as a giant faint background element.
- `aria-hidden="true"` — Instructs screen readers (assistive tools for blind users) to completely ignore this element.

### The Navigation Bar
```html
<header class="site-nav transparent" role="banner">
    <nav class="nav-inner container" aria-label="Main navigation">

        <a href="index.html" class="nav-logo">Egypt Wonders</a>

        <div class="nav-right">
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>

            <a href="auth.html" id="nav-signin"
               class="nav-auth-btn btn-solid"
               aria-label="Sign in to your account">Sign In</a>

            <button class="nav-mode-btn" id="mode-toggle"
                    aria-label="Toggle dark mode">🌙</button>
        </div>
    </nav>
</header>
```
- `<header role="banner">` — Semantic tag marking the site header. `role="banner"` tells screen readers this is the site-wide header, not a section header.
- `class="site-nav transparent"` — Has two classes. `site-nav` applies the base fixed-position styling. `transparent` makes the nav clear initially on the home page hero (see JS section). On other pages, only `site-nav` is applied.
- `<nav aria-label="Main navigation">` — Semantic tag for navigation links. The `aria-label` gives it a name so screen readers can distinguish it.
- `class="nav-inner container"` — `container` is a shared CSS class from `global.css` that applies a maximum width and centers the content.
- `<a href="index.html" class="nav-logo">` — An `<a>` tag is used for the logo so the entire word is a clickable link back home.
- `<ul class="nav-links">` — Unordered List (like a bulleted list). Semantically, navigation is "a list of links."
- `<li>` — List Item. Each nav link lives in its own item.
- `id="nav-signin"` — This specific ID is critical. `nav.js` targets it to hide the button and replace it with a user greeting when a session is detected.
- `aria-label="Sign in..."` — Describes the button's purpose for screen readers (since the button text alone might not be enough context).
- `<button id="mode-toggle">` — A `<button>` element is used (not `<div>`) because it is natively keyboard-accessible. Users can tab to it and press Enter.

### The Hero Section
```html
<section class="hero" aria-label="Hero banner">

    <video class="hero-video" autoplay loop muted playsinline
           poster="assets/images/Great_Pyramid_of_Giza/0.jpg">
        <source src="assets/videos/hero-bg.mp4" type="video/mp4">
    </video>

    <div class="hero-overlay" aria-hidden="true"></div>

    <div class="hero-content">
        <span class="hero-eyebrow">Discover Egypt</span>
        <h1 class="hero-title">Seven Thousand Years<br>of Wonder</h1>
        <p class="hero-subtitle">From the last surviving Wonder of the Ancient World...</p>
    </div>
</section>
```
- `<section aria-label="Hero banner">` — Semantic tag grouping the hero content. `aria-label` names this section.
- `<video autoplay loop muted playsinline>` — Four important attributes:
  - `autoplay` — The video starts playing immediately when the page loads.
  - `loop` — When the video ends, it starts again from the beginning.
  - `muted` — **Required for autoplay!** Browsers block autoplaying videos unless they are muted. This respects user audio settings.
  - `playsinline` — On iPhones, prevents the video from going fullscreen automatically.
- `poster="..."` — A fallback image shown while the video loads. If the video fails entirely, this static image is displayed.
- `<source src="..." type="video/mp4">` — The actual video file path. Having a separate `<source>` tag allows specifying multiple video formats for cross-browser support.
- `<div class="hero-overlay" aria-hidden="true">` — An empty `<div>` that CSS fills with a semi-transparent dark color. This darkens the video so the white text on top remains readable. It is purely decorative.
- `<span class="hero-eyebrow">` — A `<span>` is an inline container with no semantic meaning. Used for the small "Discover Egypt" text above the heading.
- `<h1 class="hero-title">` — The most important heading on the page. There is only ONE `<h1>` per page for proper SEO.
- `<br>` — A line break tag. Forces "of Wonder" to a new line.

### A Region Card
```html
<div class="region-grid">
    <a class="region-card" href="region.html?id=cairo"
       aria-label="Explore Cairo region">

        <img class="region-card-img"
             src="assets/images/Cairo_Tower/0.jpg"
             alt="Cairo Tower, the iconic landmark of modern Cairo"
             loading="lazy">

        <div class="region-card-overlay" aria-hidden="true">
            <div class="region-card-content">
                <span class="region-card-tag">22 Landmarks</span>
                <h3 class="region-card-name">Cairo</h3>
                <div class="region-card-hidden">
                    <p class="region-card-desc">The vibrant heart of modern Egypt...</p>
                    <span class="region-card-btn">Explore Region
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3">
                            </path>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    </a>
</div>
```
- `<a class="region-card" href="region.html?id=cairo">` — The entire card is wrapped in an `<a>` tag, making the whole card area clickable. The `href` sends the user to `region.html` with `?id=cairo` — a URL parameter that tells the Region page which data to load.
- `loading="lazy"` — A powerful performance attribute. The browser will NOT download this image until the user scrolls close to it. With 8 cards each having an image, this saves significant bandwidth on page load.
- `alt="Cairo Tower..."` — Alternative text for accessibility (for blind users) and for when the image fails to load.
- `aria-hidden="true"` on the overlay — The overlay contains decorative content only; screen readers should skip it.
- `<h3 class="region-card-name">` — A third-level heading. Sits below the page's `<h1>` in the heading hierarchy.
- `<div class="region-card-hidden">` — This `<div>` wraps the description and button. CSS hides it by default with `max-height: 0; overflow: hidden;` and the hover state makes it expand.
- `<svg>` — An inline SVG (Scalable Vector Graphic) used for the arrow icon. SVG icons scale perfectly to any size without becoming blurry, unlike traditional image files.
- `<path d="M17 8l4 4...">` — The mathematical path that defines the shape of the arrow.

### The Footer
```html
<footer class="site-footer" role="contentinfo">
    <div class="container">
        <p>
            Egypt Wonders
            <span class="footer-separator">·</span>
            Fourth Semester Web Project
            <span class="footer-separator">·</span>
            2026
        </p>
    </div>
</footer>
```
- `<footer role="contentinfo">` — Semantic tag for the page footer. `role="contentinfo"` is the ARIA label for a site-wide footer.
- `<span class="footer-separator">·</span>` — A `<span>` containing the middle dot separator character. CSS may style it grey or give it spacing.

### The Script Loading Order
```html
<script src="js/auth.js"></script>
<script src="js/nav.js"></script>
<script src="js/reveal.js"></script>
```
- Scripts are loaded at the **bottom of `<body>`**, after all HTML. This is critical — if they were in `<head>`, the JS would run before elements like `<button id="mode-toggle">` existed, causing errors.
- `auth.js` loads first — it defines `getCurrentUser()` and `signOut()` which `nav.js` needs.
- `nav.js` loads second — can now safely call `getCurrentUser()`.
- `reveal.js` loads last — scans the page for `.reveal-element` classes.

---

## 2. The CSS Styling (Line-by-Line)

### The CSS Variable System (`global.css`)
```css
:root {
    --bg-main:      #F4EFE6;
    --bg-card:      #FDFBF7;
    --text-main:    #1A1A1A;
    --text-muted:   #6B6560;
    --accent:       #D4AF37;
    --border-color: rgba(0, 0, 0, 0.08);
    --font-heading: 'Playfair Display', Georgia, serif;
    --font-body:    'Inter', system-ui, sans-serif;
    --radius-sm:    6px;
    --radius-lg:    16px;
    --space-xs:     0.5rem;
    --space-sm:     1rem;
    --space-md:     1.5rem;
    --space-lg:     2.5rem;
    --space-xl:     4rem;
    --transition:   0.25s ease;
}
```
- `:root` — The highest-level element in the CSS hierarchy (equivalent to `<html>`). Variables defined here are available everywhere in the stylesheet.
- `--variable-name: value` — CSS Custom Properties (variables). The double dash `--` is required.
- By setting all colors and sizes as variables, changing a single value here updates the entire site's design. This is the foundation of the theming system.
- `clamp(min, preferred, max)` — Used in some typography rules. The font scales with the viewport but stays within limits.

### Dark Mode Override
```css
[data-mode="dark"] {
    --bg-main:      #121212;
    --bg-card:      #1E1E1E;
    --text-main:    #F0EAE0;
    --text-muted:   #9E9890;
    --border-color: rgba(255, 255, 255, 0.08);
}
```
- `[data-mode="dark"]` — An attribute selector. It matches any element that has the attribute `data-mode` set to the value `"dark"`. When JavaScript sets `document.body.setAttribute('data-mode', 'dark')`, this entire block activates.
- The CSS variables are simply overridden with dark versions. Every element in the page that uses `var(--bg-main)` automatically gets the dark color. No JavaScript styling needed.

### Fixed Navigation Bar
```css
.site-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background: rgba(244, 239, 230, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-color);
    transition: background var(--transition), border-color var(--transition);
}
```
- `position: fixed` — Detaches the element from the normal page flow and anchors it to the screen. It stays visible even when the user scrolls.
- `top: 0; left: 0` — Glues it to the top-left corner of the viewport.
- `width: 100%` — Stretches across the entire screen width.
- `z-index: 1000` — Ensures the nav sits "on top" of all other elements (images, text, cards). Higher z-index = closer to the viewer.
- `backdrop-filter: blur(12px)` — The frosted glass effect on the nav bar. Blurs what is behind it.

### Transparent Nav (Home page only)
```css
.site-nav.transparent {
    background: transparent;
    border-bottom-color: transparent;
    backdrop-filter: none;
}
```
- Only applies when the nav has BOTH `site-nav` AND `transparent` classes.
- On the home page, the nav starts fully transparent so it blends with the hero video. When the user scrolls down, JavaScript removes the `transparent` class (see nav.js Part 3).

### The Hero Section
```css
.hero {
    position: relative;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    text-align: center;
    color: white;
}

.hero-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
}

.hero-content {
    position: relative;
    z-index: 2;
}
```
- `height: 100vh` — The hero takes up the full screen height (`vh` = viewport height, `100vh` = 100% of the screen).
- `display: flex; align-items: center; justify-content: center` — Centers everything inside both horizontally and vertically.
- `position: absolute; inset: 0` — `inset: 0` is shorthand for `top: 0; right: 0; bottom: 0; left: 0`. It stretches the element to fill its `position: relative` parent completely.
- `object-fit: cover` on the video — Same as images: zooms and crops the video to fill its box without distortion.
- `background: rgba(0, 0, 0, 0.5)` on the overlay — 50% black over the video. Dark enough to keep white text readable.
- `z-index: 2` on content — Ensures the text appears ABOVE the video (z-index 0) and overlay (z-index 1).

### The Region Card & Hover Reveal
```css
.region-card {
    position: relative;
    display: block;
    border-radius: var(--radius-lg);
    overflow: hidden;
    aspect-ratio: 3 / 4;
    text-decoration: none;
}

.region-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}

.region-card:hover .region-card-img {
    transform: scale(1.07);
}

.region-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 40%, transparent 100%);
    display: flex;
    align-items: flex-end;
}

.region-card-hidden {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease;
}

.region-card:hover .region-card-hidden {
    max-height: 200px;
}
```
- `aspect-ratio: 3 / 4` — Forces the card to always be taller than wide (portrait format, like 3:4). This guarantees all cards are the same shape regardless of image dimensions.
- `overflow: hidden` — Clips the image when it scales up on hover, so it doesn't overflow outside the card.
- `transition: transform 0.6s ease` — When `transform` changes (on hover), it animates over 0.6 seconds.
- `.region-card:hover .region-card-img` — A "descendant + hover" CSS selector. This says: when `.region-card` is hovered, apply this style to the `.region-card-img` that is INSIDE it.
- `transform: scale(1.07)` — Scales the image up by 7%. Since `overflow: hidden` clips it, this creates a zoom-in effect without the card growing larger.
- `background: linear-gradient(to top, ...)` — A gradient from dark black at the bottom to transparent at the top. This ensures card text is always readable against the image.
- `max-height: 0; overflow: hidden` — The trick for the sliding reveal. When `max-height` is `0`, the content is invisible and takes no space. Setting it to `200px` on hover makes CSS animate it smoothly from 0 to 200px.

---

## 3. The JavaScript Logic (Line-by-Line)

All JavaScript for this page comes from `nav.js`. The home page has NO page-specific JavaScript.

### Part 1: Active Link Detection
```javascript
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(function(link) {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});
```
- `window.location.pathname` — Returns the path part of the URL. E.g., for `http://localhost:8000/project/index.html`, this returns `/project/index.html`.
- `.split('/')` — Splits the string at every `/` character. Returns an array: `['', 'project', 'index.html']`.
- `.pop()` — Removes and returns the last item from the array: `'index.html'`.
- `|| 'index.html'` — OR fallback. If the URL ends with just `/` (no filename), `.pop()` returns an empty string. The `||` replaces it with `'index.html'`.
- `document.querySelectorAll('.nav-links a')` — Selects ALL `<a>` elements that are inside an element with class `nav-links`. Returns a NodeList (array-like).
- `.forEach(function(link) {...})` — Loops through every link in the list.
- `link.getAttribute('href')` — Reads the `href` attribute value of the link (e.g., `"index.html"`).
- `=== currentPage` — Strict equality check. If both strings are exactly equal, the condition is true.
- `link.classList.add('active')` — Adds the class `active` to the matching link. CSS styles this as a gold underline.

### Part 2: Dark Mode Toggle
```javascript
const modeBtn = document.getElementById('mode-toggle');
const savedMode = localStorage.getItem('colorMode');

if (savedMode === 'dark') {
    document.body.setAttribute('data-mode', 'dark');
    if (modeBtn) modeBtn.textContent = '☀️';
}

if (modeBtn) {
    modeBtn.addEventListener('click', function() {
        const currentMode = document.body.getAttribute('data-mode');

        if (currentMode === 'dark') {
            document.body.removeAttribute('data-mode');
            modeBtn.textContent = '🌙';
            localStorage.setItem('colorMode', 'light');
        } else {
            document.body.setAttribute('data-mode', 'dark');
            modeBtn.textContent = '☀️';
            localStorage.setItem('colorMode', 'dark');
        }
    });
}
```
- `document.getElementById('mode-toggle')` — Finds the button with `id="mode-toggle"` in the HTML.
- `localStorage.getItem('colorMode')` — Reads the user's saved preference from the browser's permanent storage. Returns `"dark"`, `"light"`, or `null` if never set.
- `document.body.setAttribute('data-mode', 'dark')` — Sets the attribute `data-mode="dark"` on the `<body>` tag. The CSS rule `[data-mode="dark"] { ... }` immediately activates.
- `if (modeBtn) modeBtn.textContent = '☀️'` — The `if (modeBtn)` guard prevents a crash if the button doesn't exist. `.textContent` sets the visible text (the emoji icon).
- `modeBtn.addEventListener('click', function() {...})` — Attaches a listener. Every time the button is clicked, the function inside runs.
- `document.body.getAttribute('data-mode')` — Reads the current mode attribute from the body.
- `document.body.removeAttribute('data-mode')` — Removing the attribute puts the body back in default state (light mode, since all light styles are the defaults in CSS).
- `localStorage.setItem('colorMode', 'dark')` — Saves the preference. `setItem(key, value)` stores a key-value pair. This survives page refreshes and browser restarts.

### Part 3: Transparent Nav Scroll Listener
```javascript
const siteNav = document.querySelector('.site-nav');
if (siteNav && siteNav.classList.contains('transparent')) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            siteNav.classList.remove('transparent');
        } else {
            siteNav.classList.add('transparent');
        }
    });
}
```
- `document.querySelector('.site-nav')` — Finds the first element with class `site-nav`.
- `siteNav.classList.contains('transparent')` — Checks if the nav currently has the `transparent` class. This is only true on the home page, so this entire block only runs on `index.html`.
- `window.addEventListener('scroll', ...)` — Fires every time the user scrolls the page.
- `window.scrollY` — The number of pixels the page has been scrolled vertically from the top.
- `if (window.scrollY > 50)` — Once the user scrolls more than 50 pixels, remove `transparent`. The nav gains its solid frosted glass background. Scrolling back up restores it.

### Part 4: Session-Aware Auth Button
```javascript
(function() {
    if (typeof getCurrentUser !== 'function') return;

    const user       = getCurrentUser();
    const signInLink = document.getElementById('nav-signin');
    const navRight   = document.querySelector('.nav-right');

    if (user && signInLink && navRight) {
        signInLink.style.display = 'none';

        const userArea  = document.createElement('div');
        userArea.className = 'nav-user-area';

        const firstName = user.name.split(' ')[0];
        const greeting  = document.createElement('span');
        greeting.className   = 'nav-user-name';
        greeting.textContent = `Hi, ${firstName}`;

        const signOutBtn = document.createElement('button');
        signOutBtn.className   = 'nav-auth-btn btn-solid';
        signOutBtn.textContent = 'Sign Out';

        signOutBtn.addEventListener('click', function() {
            signOut();
        });

        userArea.appendChild(greeting);
        userArea.appendChild(signOutBtn);
        navRight.appendChild(userArea);
    }
}());
```
- `(function() { ... }())` — An IIFE (Immediately Invoked Function Expression). A function that runs itself immediately. Creates a private scope so the variables inside don't pollute the global scope.
- `typeof getCurrentUser !== 'function'` — A safety check. `typeof` returns the type of a value. If `auth.js` didn't load, `getCurrentUser` would be `undefined`. This prevents a crash.
- `return` — Exits the function early if the guard condition is true.
- `getCurrentUser()` — Returns the logged-in user object `{ name, email }` or `null` (defined in `auth.js`).
- `signInLink.style.display = 'none'` — Directly sets the CSS `display` property to `none` on the Sign In link, hiding it.
- `document.createElement('div')` — Creates a new `<div>` element in JavaScript memory. It is NOT in the page yet.
- `user.name.split(' ')[0]` — Splits the full name by spaces and takes index `[0]` (the first word). "Mahmoud Mohsen" → "Mahmoud".
- `` `Hi, ${firstName}` `` — Template literal. The `${firstName}` injects the variable value into the string.
- `userArea.appendChild(greeting)` and `userArea.appendChild(signOutBtn)` — Puts the greeting span and button INSIDE the `userArea` div.
- `navRight.appendChild(userArea)` — Finally attaches the entire assembled user area to the actual page, making it visible.

---

## 4. Interaction Summary
If a professor asks you how your section works as a whole, this is the summary:

"My section forms the architectural foundation of the entire application. The **HTML** uses semantic tags throughout (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`) and uses an `<a>` wrapper around each region card so the entire card area is clickable. The hero video uses `autoplay muted loop` attributes and `poster` for a fallback image. Region cards use `loading='lazy'` on images to improve performance.

**CSS** builds the visual experience: CSS variables in `:root` create the entire theming system, and the dark mode is activated simply by overriding those variables when `[data-mode='dark']` is present on the body. The nav uses `position: fixed` and `z-index: 1000` to stay on top of all content. The hero takes `height: 100vh` and layers video, overlay, and text using `position: absolute` with `z-index` management. The card hover reveal uses the `max-height` animation trick (0 to 200px) which CSS can animate smoothly.

**JavaScript** in `nav.js` does four jobs: (1) detects the current page from `window.location.pathname.split('/').pop()` and adds the `active` class to the matching nav link; (2) manages the dark mode by reading/writing `localStorage` and toggling the `data-mode` body attribute; (3) listens for scroll events to remove the `transparent` class when the user scrolls past 50px; and (4) runs an IIFE on every page that checks for a logged-in session from `getCurrentUser()`, hides the static Sign In link, and injects a personalized greeting with a Sign Out button."
