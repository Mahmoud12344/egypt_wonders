# 07. The About Page & Contributor Grid (Deep Dive)
**Developer:** Ahmed Mohammed
**Core Files:** `about.html`, `css/about.css`, `js/reveal.js`

This document is a comprehensive, line-by-line textbook explaining every piece of code in the About page. This page showcases the 7 project contributors in a responsive grid of glassmorphism cards, and introduces the scroll-reveal animation system.

---

## 1. The HTML Structure (Line-by-Line)

### The `<head>` Block
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us — Egypt Wonders</title>
    <meta name="description" content="Meet the team behind the Egypt Wonders project.">
    <link rel="stylesheet" href="css/global.css?v=6">
    <link rel="stylesheet" href="css/about.css?v=1">
</head>
```
- `<meta charset="UTF-8">` — Tells the browser to interpret text in UTF-8 encoding. This supports all characters including Arabic letters, accents, and emoji.
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — Without this, mobile browsers would scale the desktop layout down to a tiny size. This tells the browser to use the device's actual screen width.
- `<title>About Us — Egypt Wonders</title>` — Text appearing in the browser tab and in Google search results.
- `<meta name="description" ...>` — Search engine description shown below the title in Google results.
- `<link rel="stylesheet" href="css/global.css?v=6">` — Loads the shared design system (colors, fonts, navigation styles, footer).
- `<link rel="stylesheet" href="css/about.css?v=1">` — Loads page-specific styles for the contributor cards and hero section.

### The Watermark Background
```html
<div class="bg-watermark" aria-hidden="true">TEAM</div>
```
- A decorative `<div>` containing the word "TEAM". It is styled with giant, near-invisible text in the background of the page.
- `aria-hidden="true"` — Screen readers (for blind users) will skip this entirely. It conveys no information.

### The Navigation Bar
```html
<header class="site-nav" role="banner">
    <nav class="nav-inner container" aria-label="Main navigation">
        <a href="index.html" class="nav-logo">Egypt Wonders</a>
        <div class="nav-right">
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
            <a href="auth.html" id="nav-signin" class="nav-auth-btn btn-solid"
               aria-label="Sign in to your account">Sign In</a>
            <button class="nav-mode-btn" id="mode-toggle" aria-label="Toggle dark mode">🌙</button>
        </div>
    </nav>
</header>
```
- `<header role="banner">` — The semantic `<header>` tag marks a section of introductory content. `role="banner"` is an ARIA attribute specifying this is the site-wide header (not a section header).
- `<nav aria-label="Main navigation">` — The `<nav>` tag tells browsers and screen readers "this contains navigation links". `aria-label` provides a label for screen readers when multiple nav elements exist on a page.
- `<a href="index.html" class="nav-logo">` — An anchor tag `<a>` is used for the logo as well, making it a clickable link back to the home page.
- `<ul class="nav-links">` — Navigation links are placed in an `<ul>` (Unordered List) because semantically, a navigation menu is just a list of links.
- `<li>` — List Item. Each link is its own list item.
- `id="nav-signin"` — Gives this button a unique ID. `nav.js` targets this ID: if the user is logged in, it hides this `<a>` and creates a greeting element in its place.
- `<button id="mode-toggle">🌙</button>` — The dark/light mode toggle. A `<button>` is used (not a `<div>`) because it is natively keyboard-accessible and fires click events.

### The Hero Section
```html
<main class="page-content">
    <div class="container">
        <header class="about-hero">
            <h1>Project Contributors</h1>
            <p>The team behind the Fourth Semester Web Project.</p>
        </header>
```
- `<main class="page-content">` — The primary content of the page. A page should only have one `<main>` tag.
- `<div class="container">` — A CSS class from `global.css` that applies a max-width and centers content horizontally.
- `<header class="about-hero">` — A `<header>` can be used inside sections, not just at the top of the page. Here it acts as a "hero" introduction for the contributors section.
- `<h1>Project Contributors</h1>` — The one and only primary heading on this page. There should never be more than one `<h1>` per page for proper SEO and accessibility.
- `<p>` — A paragraph tag for the subtitle text below the heading.

### A Single Contributor Card
```html
<div class="contributors-grid">
    <article class="contributor-card reveal-element">
        <span class="contributor-watermark">C</span>
        <h2 class="contributor-name">Mahmoud Mohsen Hashem</h2>
        <div class="contributor-id">ID: 2402637</div>
        <a href="mailto:2402637@studnt.eelu.edu.eg" class="contributor-email">
            ✉ 2402637@studnt.eelu.edu.eg
        </a>
    </article>
    <!-- 6 more cards ... -->
</div>
```
- `<div class="contributors-grid">` — The parent container for all 7 cards. CSS Grid is applied to this element.
- `<article class="contributor-card reveal-element">` — The `<article>` tag is semantic HTML. It is used for self-contained pieces of content that make sense on their own (like a newspaper article or, here, a person's profile).
- `class="reveal-element"` — A special class detected by `reveal.js`. When the card scrolls into view, JavaScript adds the `visible` class, triggering a CSS animation.
- `<span class="contributor-watermark">C</span>` — A single letter `<span>`. CSS gives it a giant font-size and positions it in the background of the card.
- `<span>` — An inline container with no semantic meaning. Used when you want to style a piece of text without using a block-level element.
- `<h2 class="contributor-name">` — A secondary heading (below the page's `<h1>`).
- `<div class="contributor-id">` — A non-semantic box for the ID badge.
- `<a href="mailto:2402637@studnt.eelu.edu.eg">` — An anchor tag with a `mailto:` URL. When clicked, it opens the user's default email application pre-addressed to this email.

---

## 2. The CSS Styling (Line-by-Line)

### The Hero Section Styles
```css
.about-hero {
    text-align: center;
    padding: var(--space-xl) 0 var(--space-lg);
    margin-bottom: var(--space-lg);
    border-bottom: 1px solid var(--border-color);
}
.about-hero h1 {
    font-family: var(--font-heading);
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    color: var(--text-main);
}
.about-hero p {
    color: var(--text-muted);
    font-weight: 300;
}
```
- `text-align: center` — Centers all text content horizontally.
- `padding: var(--space-xl) 0 var(--space-lg)` — Top padding uses `--space-xl`, left/right use `0`, bottom uses `--space-lg`. CSS shorthand: `top right bottom left`, but with 3 values it becomes `top left-right bottom`.
- `border-bottom: 1px solid var(--border-color)` — Draws a thin horizontal separator line below the hero.
- `clamp(2.5rem, 5vw, 3.5rem)` — A CSS function that creates fluid typography. The font will be `5vw` (5% of screen width) but **never smaller than 2.5rem** and **never larger than 3.5rem**. On small phones it's `2.5rem`, on large screens it grows but stops at `3.5rem`.
- `font-weight: 300` — Very light/thin font weight for the subtitle.

### The Responsive Grid
```css
.contributors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
}
```
- `display: grid` — Enables the CSS Grid layout system on this container.
- `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))` — This one line creates a fully automatic responsive layout:
  - `auto-fill`: Tells the grid to create as many columns as will fit.
  - `minmax(320px, 1fr)`: Each column must be at least 320px wide, but can grow to fill available space.
  - On a 1400px screen: `1400 / 320 = 4.37` → 4 columns fit.
  - On a 768px screen: `768 / 320 = 2.4` → 2 columns fit.
  - On a 375px phone: `375 / 320 = 1.17` → 1 column, full width.
- `gap: var(--space-lg)` — Creates consistent spacing between rows and columns.

### The Glassmorphism Card
```css
.contributor-card {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    position: relative;
    overflow: hidden;
    transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
}

[data-mode="dark"] .contributor-card {
    background: rgba(255, 255, 255, 0.03);
}
```
- `background: rgba(255, 255, 255, 0.4)` — 40% opaque white. The partial transparency lets the page background show through.
- `backdrop-filter: blur(16px)` — Blurs the background behind the card. Combined with transparency, this creates the "frosted glass" appearance.
- `-webkit-backdrop-filter` — Same rule with a prefix for Safari browser compatibility.
- `position: relative` — **Critical!** Required for the watermark `<span>` inside to be positioned with `position: absolute` relative to this card.
- `overflow: hidden` — Clips anything that extends outside the card's boundaries. This is how the giant watermark letter is partially hidden behind the card edge.
- `transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition)` — Multiple properties will animate. When any of these change (on hover), they transition smoothly.
- `[data-mode="dark"] .contributor-card` — A descendant CSS selector. When `<body data-mode="dark">` exists, cards inside it get a very dark transparent background. JavaScript sets this attribute; CSS reacts automatically.

### The Hover Animation
```css
.contributor-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
    border-color: var(--accent);
}
```
- `:hover` — A CSS "pseudo-class" that activates when the mouse cursor is over the element.
- `transform: translateY(-8px)` — Moves the card **8 pixels upward** (`-` means up). This creates the "lifting" effect. The `transition` property on the card makes this a smooth animation.
- `box-shadow: 0 15px 35px rgba(0,0,0,0.08)` — A larger, deeper shadow appears on hover, reinforcing the illusion of the card lifting off the page.
- `border-color: var(--accent)` — The border turns golden on hover.

### The Giant Watermark Letter
```css
.contributor-watermark {
    position: absolute;
    top: -15px;
    right: -10px;
    font-family: var(--font-heading);
    font-size: 9rem;
    font-weight: 700;
    color: var(--text-main);
    opacity: 0.04;
    pointer-events: none;
    user-select: none;
    z-index: 0;
}
```
- `position: absolute` — Removes the element from normal document flow. Its position is now relative to the nearest `position: relative` ancestor (which is `.contributor-card`).
- `top: -15px; right: -10px` — Positions it 15px above the card top and 10px outside the card's right edge. Combined with `overflow: hidden` on the card, the part outside gets clipped.
- `font-size: 9rem` — 9 × 16px = 144px tall. A massive letter.
- `opacity: 0.04` — Only 4% visible. This is why it appears as a very faint background texture.
- `pointer-events: none` — The cursor events (like clicks) pass through this element as if it doesn't exist. Without this, the invisible letter could block clicks on the card.
- `user-select: none` — Users cannot accidentally select/copy this decorative text by clicking and dragging.
- `z-index: 0` — This element sits at the "back" of the card's stacking context. The name, ID, and email have `z-index: 1`, so they always appear above the watermark.

---

## 3. The JavaScript Logic (Line-by-Line)

### Shared Scripts (from nav.js and auth.js)
```html
<script src="js/auth.js"></script>
<script src="js/nav.js"></script>
<script src="js/reveal.js"></script>
```
- `auth.js` — Must load first. Defines `getCurrentUser()` so `nav.js` can use it.
- `nav.js` — Highlights "About Us" in the navigation, applies dark mode, and shows user session state.
- `reveal.js` — The scroll animation library.

### How nav.js Works on This Page
When `nav.js` runs on `about.html`:
```javascript
// Inside nav.js
const currentPage = window.location.pathname.split('/').pop();
// currentPage === 'about.html'

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active'); // Adds gold styling to "About Us" link
    }
});
```
- `window.location.pathname` — Returns the URL path, e.g., `/web/project/about.html`.
- `.split('/')` — Splits by `/`, producing `['', 'web', 'project', 'about.html']`.
- `.pop()` — Removes and returns the last element: `'about.html'`.
- The loop then finds the `<a href="about.html">About Us</a>` link and adds `class="active"`, which turns the link gold.

### Dark Mode Cascade (No Extra JS Needed)
This page demonstrates a powerful CSS-JavaScript cooperation:
```javascript
// Inside nav.js — applies data-mode to the <body> tag
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.setAttribute('data-mode', 'dark');
}
```
```css
/* Inside about.css — reacts to the body attribute automatically */
[data-mode="dark"] .contributor-card {
    background: rgba(255, 255, 255, 0.03);
}
```
- JavaScript does ONE thing: sets `<body data-mode="dark">`.
- CSS handles everything else: every element on the page that has a `[data-mode="dark"]` rule instantly updates its colors. Ahmed Mohammed did not need to write any dark-mode JavaScript specifically for `about.html`.

### The Scroll Reveal Animation (reveal.js)
```javascript
// Inside reveal.js
const revealElements = document.querySelectorAll('.reveal-element');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => observer.observe(el));
```
- `document.querySelectorAll('.reveal-element')` — Finds all 7 contributor cards (they have this class).
- `new IntersectionObserver(...)` — Creates a browser-native observer that watches elements and fires a callback whenever they enter or leave the viewport.
- `entry.isIntersecting` — `true` when at least part of the element is visible on screen.
- `entry.target.classList.add('visible')` — Adds the `visible` class to the card that just scrolled into view.
- `threshold: 0.1` — The callback fires when at least 10% of the element is visible.
- The CSS for `.reveal-element` starts cards as `opacity: 0; transform: translateY(20px);` (invisible, shifted down). Adding `visible` transitions them to `opacity: 1; transform: translateY(0);` — they fade in while sliding up.

---

## 4. Interaction Summary

"My section creates the project's team showcase page. **HTML** uses semantic tags throughout: `<header>` for the hero, `<article>` for each contributor card (a semantically correct tag for self-contained profile content), `<ul>`/`<li>` for navigation links, and `<a href='mailto:...'>` for clickable email addresses. **CSS** powers the visual spectacle: `repeat(auto-fill, minmax(320px, 1fr))` creates a fully automatic responsive grid with no media queries, `position: absolute` with `opacity: 0.04` places a barely-visible giant letter in the background of each card, `overflow: hidden` clips it cleanly, and `transform: translateY(-8px)` with `transition` creates the smooth card-lifting hover effect. The `[data-mode='dark']` selector automatically rethemes cards when the body attribute changes. **JavaScript** contributes via three loaded scripts: `auth.js` provides the session layer, `nav.js` highlights 'About Us' by matching the URL filename and toggles dark mode via `localStorage`, and `reveal.js` uses `IntersectionObserver` to detect when each card scrolls into view and adds a CSS class that triggers a fade-and-slide entrance animation."
