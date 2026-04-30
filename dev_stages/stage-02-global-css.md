# Stage 2 — The Global Design System (`global.css`)

**What we do in this stage:**
Fill `css/global.css` with the entire design foundation that every page shares.

**Why this is the first real file we write:**
Every other file in the project depends on the variables and styles defined here.
If we built `index.html` first, we'd have no consistent colors, fonts, or spacing.
We always build the foundation before the walls.

---

## What is a Design System?

A design system is a set of **rules** that answer questions like:
- What font do we use for headings?
- What is our primary color?
- How much space goes between sections?
- What does a button look like?

Without a design system, each page would look slightly different because each developer makes their own choices. With a design system, every page looks like it belongs to the same project.

In our case, the design system lives entirely in `css/global.css`.

---

## CSS Custom Properties (Variables)

The most important concept in `global.css` is **CSS Custom Properties**, also called CSS variables.

```css
:root {
    --bg-body: #F9F7F3;
    --accent:  #C9A84C;
}
```

`:root` is a special selector that targets the very top of the HTML document — it is the highest ancestor of everything. Variables declared here are accessible to EVERY element on EVERY page.

**How to use a variable:**
```css
body {
    background-color: var(--bg-body); /* reads the value #F9F7F3 */
}
```

**Why variables instead of raw hex values?**
Without variables, if you decide to change the background from `#F9F7F3` to `#F5F2EC`, you must find and replace that hex code in every CSS file, every time it appears. With a variable, you change `--bg-body` in ONE place and the entire site updates.

---

## How Dark Mode Works — No Magic Involved

This is one of the most important concepts in the project. Read this carefully.

### Step 1: Define light mode as default in `:root`
```css
:root {
    --bg-body: #F9F7F3; /* light mode */
    --text-main: #1A1A1A;
}
```

### Step 2: Override those variables for dark mode
```css
[data-mode="dark"] {
    --bg-body: #121110; /* dark mode override */
    --text-main: #F4F4F4;
}
```
`[data-mode="dark"]` is an **attribute selector**. It means:
"Select any element that has the HTML attribute `data-mode` with the value `dark`."

### Step 3: JavaScript puts `data-mode="dark"` on the `<body>`
```js
document.body.setAttribute('data-mode', 'dark');
```

### The result:
- Light mode → `<body>` has no `data-mode` → `:root` values apply → light colors
- Dark mode → `<body data-mode="dark">` → `[data-mode="dark"]` overrides apply → dark colors

**JavaScript touches ONE attribute. CSS handles ALL the visual changes.**
This is clean, efficient, and the correct way to do theming.

---

## How Region Colors Work

Same exact mechanism as dark mode, but for region accent colors.

Each region page sets `data-region="cairo"` on its `<body>`:
```html
<body data-region="cairo">
```

In `global.css`:
```css
[data-region="cairo"] { --accent: #B85C3A; }
```

Now every element using `var(--accent)` — nav logo, card badges, buttons, decorative lines —
automatically shows Cairo's terracotta color. No per-element JS needed.

---

## The CSS Reset — Why We Need It

Browsers have built-in default styles. Chrome gives `<h1>` a different margin than Firefox.
A CSS reset removes all browser defaults so we start from zero and control everything ourselves.

```css
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
```

`box-sizing: border-box` is particularly important. By default (without it):
```
element total width = width + padding + border  ← confusing!
```
With `border-box`:
```
element total width = width  ← padding and border count INSIDE
```
This makes sizing elements predictable and is considered standard practice.

---

## The `.container` Class

```css
.container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--space-lg);
}
```

`max-width: 1280px` — On a wide monitor, content stops expanding at 1280px.
Without this, text would stretch across the full width of a 27" monitor and become unreadable.

`margin: 0 auto` — Centres the container horizontally.
When left and right margins are both `auto`, the browser splits the remaining space equally.

`padding: 0 var(--space-lg)` — Adds horizontal breathing room (40px each side) on all screens.

Every page wraps its content in `<div class="container">`.

---

## Navigation Bar — Fixed Positioning

```css
.site-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}
```

`position: fixed` removes the nav from the normal document flow.
It always stays at the top of the VIEWPORT (the visible screen area), not the page.
When you scroll, the nav stays. The page content scrolls under it.

`z-index: 1000` controls stacking order. Higher z-index = in front.
1000 is a high enough number to ensure the nav is always in front of everything else.

**The problem this creates:** The first piece of page content would hide behind the nav.
**The solution:** We add `padding-top: var(--nav-height)` to `.page-content`.
This pushes the content down by exactly the height of the nav bar.

---

## Files Changed in Stage 2

- `css/global.css` — Written from empty to complete design system
- `js/nav.js` — Written: active link detection + dark mode toggle

## ✅ Stage 2 Checklist

- [x] Google Fonts imported via `@import`
- [x] All CSS custom properties defined (light + dark)
- [x] Region accent colors defined (light + dark variants)
- [x] CSS reset applied
- [x] `.container` layout utility
- [x] Navigation bar fully styled
- [x] Footer fully styled
- [x] Shared button styles (solid + outline)
- [x] Shared badge/tag style
- [x] `nav.js` written with active link detection and persistent dark mode toggle

---

## Next: Stage 3 — Home Page (`index.html` + `home.css`)
