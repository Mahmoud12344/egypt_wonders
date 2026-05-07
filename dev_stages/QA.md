## Questions & Answers — Exam Preparation

> **42 potential university exam questions with full answers.** Organized by topic. Each answer is detailed enough to satisfy an oral examination.

---

## Architecture & Structure

### Q1: What is the folder structure of this project?
The project has 6 HTML pages at the root, 4 CSS files in `css/`, 4 JS files in `js/`, and 3 JSON files + images/videos in `assets/`. CSS and JS are separated per page: `global.css` is shared by all pages, while `home.css`, `landmarks-grid.css`, and `landmark.css` each serve one specific page. `nav.js` and `reveal.js` are shared, while `region.js` and `landmark.js` are page-specific.

### Q2: Why are CSS and JS files separated per page?
To avoid a single massive file where styles for unrelated pages are tangled. Each page loads only what it needs. If a bug appears on the region page, you open `landmarks-grid.css` instead of searching through a monolithic file.

### Q3: Why are scripts loaded at the bottom of `<body>` instead of in `<head>`?
Scripts need DOM elements to exist before they can access them. If a script in `<head>` calls `document.getElementById('grid')`, it returns `null` because the grid HTML hasn't been parsed yet. Loading at the bottom of `<body>` ensures all elements are ready.

### Q4: Why is the nav bar copy-pasted into every HTML file?
Without a framework (React, Vue) or server-side rendering, there's no built-in way to share HTML components. The nav is only ~12 lines and rarely changes. Manual duplication is simpler and means the nav renders instantly without waiting for JavaScript.

---

## CSS & Design System

### Q5: What are CSS custom properties and why use them?
CSS variables declared with `--name` on `:root`, accessed with `var(--name)`. The project defines all colors, spacing, fonts, and radii as variables. Changing `--bg-body` from `#F4EFE6` to another color updates the background across every page.

### Q6: How does dark mode work without reloading the page?
JavaScript adds `data-mode="dark"` to `<body>`. CSS rules like `[data-mode="dark"] { --bg-body: #121212; }` override light-mode variables. Every element using `var(--bg-body)` automatically updates.

### Q7: How does dark mode persist across page reloads?
`localStorage.setItem('colorMode', 'dark')` saves the preference. On page load, `nav.js` reads `localStorage.getItem('colorMode')` and applies the attribute immediately.

### Q8: What is `box-sizing: border-box`?
By default, `width: 300px` + `padding: 20px` = 340px total. With `border-box`, padding counts inside the 300px. The element is always exactly 300px.

### Q9: What is `clamp()` and where is it used?
`clamp(min, preferred, max)` creates a responsive value. `font-size: clamp(2.5rem, 6vw, 4.5rem)` means: use 6% of viewport width, but stay between 2.5rem and 4.5rem. Eliminates media query breakpoints for typography.

### Q10: What is the `.container` class?
A wrapper with `max-width: 1280px` and `margin: 0 auto`. It constrains content width and centers it, preventing text from stretching edge-to-edge on wide screens.

### Q11: How do region accent colors work?
`region.js` sets `data-region="cairo"` on `<body>`. CSS `[data-region="cairo"] { --accent: #B85C3A; }` overrides the accent variable. Every element using `var(--accent)` — buttons, tags, bars — turns terracotta.

---

## Navigation

### Q12: Where is the nav bar defined and how does it work?
The nav HTML is in each page's `<header class="site-nav">`. It's styled in `global.css` with `position: fixed` to stay at top. `nav.js` handles active link highlighting and dark mode toggle.

### Q13: How does the active nav link get highlighted?
`nav.js` extracts the filename from `window.location.pathname.split('/').pop()` (e.g., `"blog.html"`). It compares against each link's `href`. The match gets `classList.add('active')`, styled with an accent underline.

### Q14: What is glassmorphism and how is it implemented?
A frosted-glass effect. The nav uses `background: rgba(255,255,255,0.75)` (semi-transparent) + `backdrop-filter: blur(12px)` (blurs content behind). This creates a translucent, premium feel.

### Q15: Why does the nav start transparent on the home page?
The hero has a full-screen video. A white nav would clash. The `.transparent` class gives dark glass with white text. After scrolling 50px, `nav.js` removes the class, transitioning to standard light glass.

---

## JavaScript

### Q16: What is `fetch()` and how is it used?
A built-in browser function for HTTP requests. Returns a Promise. `fetch('assets/landmarks.json')` sends a GET request. The response is parsed with `.json()`.

### Q17: What is `async/await`?
Modern Promise syntax. `async` on a function allows `await` inside. `await fetch(...)` pauses until the request completes, making async code read like sequential code.

### Q18: What is `Promise.all()` and why use it?
Takes an array of Promises, resolves when **all** complete. The landmark page needs two JSON files. `Promise.all` loads them simultaneously — total wait = the slower file, not the sum.

### Q19: What is event delegation?
Attaching one listener to a parent instead of many listeners on children. On the region page, one listener on `#landmark-grid` handles clicks for all 22+ cards using `event.target.closest('.landmark-card')`.

### Q20: What is `IntersectionObserver`?
A browser API that watches elements and fires callbacks when they enter/leave the viewport. `reveal.js` uses it to add `reveal-visible` when elements become 10% visible. `unobserve()` ensures one-shot animation.

### Q21: How does the `<dialog>` element work?
Native HTML5 modal. Hidden by default. `.showModal()` opens it with backdrop and focus trapping. `Escape` closes it. More accessible than a custom `<div>` modal.

### Q22: What does `URLSearchParams` do?
Parses the URL query string. `new URLSearchParams("?id=cairo").get('id')` returns `"cairo"`. This passes data between pages without a backend.

### Q23: What is `localStorage`?
Browser API storing key-value pairs permanently. Used for dark mode preference (`colorMode`) and community blog posts (`posts`). Data serialized with `JSON.stringify()`, deserialized with `JSON.parse()`.

---

## Data & JSON

### Q24: Why three separate JSON files?
Performance. The region page needs text data (105 KB) but not gallery paths (124 KB). Separating them prevents downloading unnecessary data.

### Q25: Why is landmarks.json pre-sorted?
`Array.filter()` preserves order. Pre-sorting by importance means filtered results are already sorted — no runtime `Array.sort()` needed.

### Q26: How do the three JSON files relate?
`regions.json.name` matches `landmarks.json.region` by display name. `landmarks.json.id` matches `landmark_images.json.id` by unique ID.

### Q27: Why are regions hardcoded in index.html?
Only 8 regions representing permanent geography. Hardcoding = zero JS needed, instant rendering. Landmarks (90+) are dynamic because the count can change.

---

## Animations & Effects

### Q28: How does the hero text animation work?
`@keyframes fadeInUp` moves from `opacity: 0; translateY(30px)` to visible. Three elements use it with staggered `animation-delay` (0.1s, 0.3s, 0.5s) for a cascading reveal.

### Q29: How does the region card hover animation work?
6 simultaneous effects: card lifts 10px, image zooms 10%, gradient darkens, hidden text slides down via `max-height`, tag/name slide up, arrow shifts right. All CSS transitions, no JavaScript.

### Q30: What is the SVG noise texture?
An inline SVG using `<feTurbulence>` to generate procedural noise. Embedded as a `data:` URL in `background-image`. Adds paper-like grain at 15% opacity.

### Q31: How does gallery image switching work?
Featured image opacity → 0 (CSS transition). After 200ms `setTimeout`, `src` swapped. Opacity → 1. Creates a smooth crossfade.

### Q32: What is `backdrop-filter`?
Applies Gaussian blur to content **behind** the element. Combined with semi-transparent background, creates frosted glass. Used on nav bar and CTA section.

---

## HTML5 & Semantics

### Q33: What semantic elements does the project use?
`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`, `<figure>`, `<aside>`, `<dialog>`. Each communicates the content's role to screen readers and search engines.

### Q34: What ARIA attributes are used?
`role="banner"` on headers, `role="contentinfo"` on footers, `aria-label` on sections/buttons, `aria-hidden="true"` on decorative elements, `tabindex="0"` on cards, `aria-modal="true"` on dialog.

### Q35: What is `loading="lazy"` on images?
Defers loading until the image nears the viewport. Improves initial load by not downloading all images at once.

### Q36: What is `inset: 0`?
Shorthand for `top: 0; right: 0; bottom: 0; left: 0`. Used on overlays to cover their parent.

---

## Responsive Design

### Q37: How does the layout adapt to mobile?
Three breakpoints: ≤800px home grid 2→1 columns, ≤900px landmark detail 2→1 columns, ≤600px nav shrinks. Plus `clamp()` for fluid typography scaling.

### Q38: What is `aspect-ratio: 4/5`?
Forces cards to a 4:5 portrait ratio. Height = `width × 5/4`. Ensures uniform proportions.

---

## Blog & Forms

### Q39: How does blog2.html save posts?
Posts stored as JSON in `localStorage`. `unshift()` adds to array front, `splice()` removes. `JSON.stringify()` for writing, `JSON.parse()` for reading.

### Q40: What does the contact form do?
Uses `action="mailto:..."` — opens the email client. For a real app, it would POST to a server. Demonstrates form semantics and accessibility.

---

## Performance

### Q41: What performance optimizations exist?
`loading="lazy"` on images, pre-sorted JSON (no runtime sort), `Promise.all()` for parallel fetching, separated CSS/JS per page, GPU-accelerated CSS transitions (`transform`, `opacity`), single Google Fonts request.

### Q42: Why CSS transitions over JS animations?
CSS transitions run on the browser's compositor thread (GPU-accelerated), independent of JavaScript. Animations stay smooth even if JS is busy. `transform` and `opacity` are the cheapest properties to animate.
