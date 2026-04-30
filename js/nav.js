/* =============================================================
   nav.js — Shared Navigation Logic
   =============================================================
   This file runs on EVERY page. It does two things:
   1. Highlights the active nav link for the current page
   2. Handles the dark/light mode toggle (and remembers the choice)

   HOW IT IS LOADED: Each HTML page includes this at the bottom
   of the <body> with: <script src="js/nav.js"></script>
   ============================================================= */


/* ─────────────────────────────────────────────────────────────
   PART 1: ACTIVE NAV LINK
   ─────────────────────────────────────────────────────────────
   The nav bar has links to: Home, Blog, Contact.
   We want the current page's link to appear highlighted (active).

   HOW IT WORKS:
   - window.location.pathname gives us the current page path.
     Example: "/project/region.html" or "/project/index.html"
   - We use .endsWith() to check which filename we're on.
   - We then find the matching <a> tag in the nav and add
     the CSS class "active" to it.
   - The "active" class is styled in global.css with an
     accent-colored underline.
   ───────────────────────────────────────────────────────────── */

/* Get the current page filename from the URL.
   pathname = "/some/path/region.html"
   split('/') = ["", "some", "path", "region.html"]
   pop() = takes the last item = "region.html"
   We default to "index.html" if the path ends with "/" or is empty */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

/* Select all anchor tags inside .nav-links */
const navLinks = document.querySelectorAll('.nav-links a');

/* Loop through each link and check if its href matches the current page */
navLinks.forEach(function(link) {
    /* link.getAttribute('href') returns the href value, e.g. "index.html" */
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active'); /* add the "active" CSS class */
    }
});


/* ─────────────────────────────────────────────────────────────
   PART 2: DARK / LIGHT MODE TOGGLE
   ─────────────────────────────────────────────────────────────
   The nav bar has a button with id="mode-toggle".
   Clicking it switches between light and dark mode.

   HOW IT WORKS:
   - Dark mode is applied by adding data-mode="dark" to <body>.
   - global.css has rules for [data-mode="dark"] that override
     the light-mode CSS variables. No JS styling needed.
   - We use localStorage to SAVE the user's choice in the browser.
     localStorage is a browser feature that stores key-value pairs
     permanently (until cleared). This means if the user prefers
     dark mode and refreshes the page, it stays dark.

   ICONS: 🌙 = dark mode button label, ☀️ = light mode button label
   ───────────────────────────────────────────────────────────── */

/* Get the toggle button element from the DOM */
const modeBtn = document.getElementById('mode-toggle');

/* --- Apply saved preference on page load ---
   When the page first loads, check if the user previously chose dark mode.
   localStorage.getItem('colorMode') returns "dark", "light", or null (never set). */
const savedMode = localStorage.getItem('colorMode');

if (savedMode === 'dark') {
    /* Apply dark mode immediately — before the page is visible — to avoid flash */
    document.body.setAttribute('data-mode', 'dark');
    /* Update button icon to show the sun (so user can switch back to light) */
    if (modeBtn) modeBtn.textContent = '☀️';
}
/* If savedMode is "light" or null, we do nothing because light is already the default */


/* --- Handle toggle button click ---
   When the button is clicked, we check the current mode and flip it. */
if (modeBtn) {
    modeBtn.addEventListener('click', function() {
        /* Read the current mode from the body attribute */
        const currentMode = document.body.getAttribute('data-mode');

        if (currentMode === 'dark') {
            /* Switch to light mode */
            document.body.removeAttribute('data-mode'); /* removing the attribute = light mode */
            modeBtn.textContent = '🌙';                 /* show moon icon (click to go dark) */
            localStorage.setItem('colorMode', 'light'); /* save preference */
        } else {
            /* Switch to dark mode */
            document.body.setAttribute('data-mode', 'dark');
            modeBtn.textContent = '☀️';                 /* show sun icon (click to go light) */
            localStorage.setItem('colorMode', 'dark');  /* save preference */
        }
    });
}
