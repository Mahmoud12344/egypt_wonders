# 07. The About Page & Contributor Grid
**Developer:** Ahmed Mohammed
**Core Files:** `about.html`, `css/about.css`

## 1. Introduction
The About Page serves as the credit section for our academic project, displaying the information of the 7 developers who built "Egypt Wonders". My responsibility was creating a unique, visually striking grid layout for the contributor cards that incorporated advanced CSS positioning and interactive hover animations.

## 2. Data Flow
- **Input:** Static HTML text containing the names, IDs, and emails of the 7 contributors.
- **Output:** A beautifully rendered, responsive grid of cards displayed to the user. No complex JavaScript data fetching is required here; the data is hardcoded for maximum performance and reliability.

## 3. HTML Structure (The Skeleton)
- **The Hero Section (`.about-hero`):** A distinct header at the top of the page with an `<h1>` declaring the page title, setting it apart from the standard navigation bar.
- **The Grid Container (`.contributors-grid`):** A wrapping `<div>` that holds all 7 cards.
- **The Contributor Cards (`.contributor-card`):** Each card is wrapped in an `<article>` tag for semantic meaning. Inside the card:
  - `<span class="contributor-watermark">`: A large, single letter (e.g., "M" for Mahmoud) used as a decorative background element.
  - `<h2>`, `<div>`, and `<a>`: Standard tags holding the specific developer data. The email uses an `href="mailto:..."` link so clicking it opens the user's default email client.

## 4. CSS Styling (The Visuals)
This page is heavily reliant on advanced CSS architecture (`about.css`):
- **Responsive CSS Grid:** The `.contributors-grid` uses `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));`. This means the 7 cards will automatically arrange themselves into 3 columns, 2 columns, or 1 column depending strictly on the width of the user's screen.
- **Absolute Positioning:** The `.contributor-watermark` is the most striking visual feature. It uses `position: absolute; right: -10px; bottom: -20px; font-size: 8rem; opacity: 0.05;`. By taking it out of the normal document flow (absolute positioning), it acts as a giant, faded background letter that doesn't push the actual text around.
- **Hover Animations:** The cards use a `transition: transform 0.3s ease, box-shadow 0.3s ease;`. When a user hovers their mouse over a card, it shifts up slightly (`transform: translateY(-5px)`) and the shadow deepens, creating a tactile "lifting" effect.

## 5. JavaScript Logic (The Brains)
While this page is primarily a showcase of HTML semantics and CSS layouts, it still deeply interacts with the global JavaScript logic:
- **Navigation active state:** `nav.js` detects the URL is `about.html` and highlights the "About Us" link.
- **Dark Mode Cascade:** When `nav.js` applies `data-mode="dark"` to the `<body>`, CSS variables automatically cascade down to the contributor cards. The background of the cards (`var(--bg-card)`) seamlessly shifts from white to dark gray, and the text shifts from dark to light, ensuring the entire page remains perfectly readable without writing any page-specific dark mode scripts.

## 6. Interaction Summary
HTML provides the semantic structure for the 7 developer profiles and creates functional `mailto:` links. CSS brings the page to life by organizing the profiles into a responsive grid, adding giant absolute-positioned watermarks, and creating tactile hover animations. The global JavaScript ensures the page respects the user's dark mode preference seamlessly.
