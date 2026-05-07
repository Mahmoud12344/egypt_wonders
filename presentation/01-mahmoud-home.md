# 01. The Home Page & Global Navigation
**Developer:** Mahmoud
**Core Files:** `index.html`, `css/global.css`, `js/nav.js`

## 1. Introduction
The Home Page is the entry point for "Egypt Wonders". It establishes the "Desert Minimalist" visual language and provides access to the 6 primary regions. My responsibility was building this initial structure and programming the global navigation bar, which is the only interactive component shared across all 7 pages.

## 2. Data Flow
- **Input:** User clicks and scroll events. The navigation bar checks `localStorage` to see if a user session exists (`currentUser`) to toggle the "Sign In" button into a "Hi, Name" greeting. It also checks `localStorage` for the `darkMode` preference.
- **Output:** The Dark Mode state is written back to `localStorage` when toggled.

## 3. HTML Structure (The Skeleton)
The semantic structure of `index.html` relies on modern HTML5 tags for accessibility and SEO:
- `<nav>`: The navigation wrapper. It contains a `<ul>` for links, an `<a id="nav-signin">` static button for authentication, and a `<button id="mode-toggle">` for the theme switch.
- `<header>`: The Hero section containing the massive background image and the main title.
- `<main>`: Contains the `.region-grid`, which uses `<a>` tags masquerading as cards. Wrapping the cards in `<a>` tags ensures the entire card is clickable, navigating the user to `region.html?id=...`.

## 4. CSS Styling (The Visuals)
The project uses a custom Design System built in `global.css`.
- **CSS Variables (`:root`)**: I established variables like `--bg-main`, `--text-main`, and `--accent`. When dark mode is triggered, these variables are swapped out for dark hex codes, instantly changing the theme across the entire site without needing to rewrite CSS classes.
- **CSS Grid:** The `.region-grid` uses `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));`. This is highly responsive. `auto-fit` forces the cards to wrap onto new lines on small screens automatically, without needing dozens of `@media` queries.
- **Hover Effects:** The cards feature a dark gradient overlay. When hovered, the `.region-card-hidden` element expands using a `max-height` transition, revealing the description and the "Explore Region" button.

## 5. JavaScript Logic (The Brains)
My core contribution is `nav.js`, which runs on every single page.
- **Active Link Highlighting:** The script reads `window.location.pathname`, extracts the current filename (e.g., `index.html`), and loops through the `<li><a>` tags in the navbar. If the `href` matches the filename, it adds the `.active` CSS class, highlighting the text in the golden accent color.
- **Dark Mode Engine:** 
  - On load, the script checks `localStorage.getItem('darkMode')`. If it's `'enabled'`, it applies `document.body.setAttribute('data-mode', 'dark')`.
  - An Event Listener is attached to the `#mode-toggle` button. Clicking it flips the attribute and saves the new preference to `localStorage`.
- **Dynamic Session UI:** It checks if `getCurrentUser()` (from `auth.js`) returns an object. If a user is logged in, it hides the `#nav-signin` button and injects a new `div` containing "Hi, [Name]" and a "Sign Out" button.

## 6. Interaction Summary
HTML provides the static buttons and grid structure. CSS makes the grid responsive and hides the card descriptions until hovered. JavaScript makes the Navigation bar "alive" by reading the URL to highlight the current page, checking memory to enforce dark mode, and checking memory to greet logged-in users.
