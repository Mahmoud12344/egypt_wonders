# 02. The Region Page & Dynamic Data Loading
**Developer:** Hossam
**Core Files:** `region.html`, `css/region.css`, `js/region.js`

## 1. Introduction
The Region Page is designed to display all landmarks associated with a specific area (e.g., Luxor, Giza). Instead of creating 6 different HTML pages for the 6 regions, I engineered a single `region.html` template. The content is dynamically injected via JavaScript by reading the URL parameters.

## 2. Data Flow
- **Input:** The URL parameter (e.g., `?id=luxor_thebes`).
- **Fetch:** The JavaScript makes an asynchronous HTTP Request to fetch the `assets/landmarks.json` database.
- **Output:** The filtered JSON objects are converted into HTML strings and injected into the DOM.

## 3. HTML Structure (The Shell)
`region.html` is essentially an empty shell. 
- `<h1 id="region-name">`: A placeholder text that initially says "Loading...".
- `<div class="region-meta">`: A placeholder for the total count of landmarks.
- `<div class="landmark-grid" id="landmark-grid">`: A completely empty container. This is where my JavaScript injects the cards.

## 4. CSS Styling (The Visuals)
The styling for this page is defined in `region.css` and inherits from `global.css`.
- **Card Layout (`.landmark-card`):** Unlike the home page, these cards have a distinct glassmorphism look (`backdrop-filter: blur()`).
- **Image Handling:** The images are set to `width: 100%; height: 250px; object-fit: cover;`. `object-fit: cover` is crucial—it ensures that regardless of the image's original aspect ratio, it fills the 250px box perfectly without stretching or distorting.
- **Badges:** The `<span class="badge">` uses `display: inline-block; border-radius: 20px;` to create the small pill-shaped categorization tags on the cards.

## 5. JavaScript Logic (The Brains)
My core contribution is `region.js`, which acts as the data engine.
- **URL Parsing:** The script uses `new URLSearchParams(window.location.search)` to extract the `id` from the URL.
- **Dictionary Mapping:** Because the JSON doesn't use the exact ID strings, I created a `regionMap` object that translates `luxor_thebes` into the official string `"Luxor Governorate"`.
- **Data Fetching:** 
  ```javascript
  fetch('assets/landmarks.json')
    .then(response => response.json())
    .then(data => { ... })
  ```
  This loads the massive array of landmarks.
- **Filtering & Injection:** The `.filter()` method is used to keep only the landmarks where `landmark.governorate` matches the mapped region name. Then, a `.forEach()` loop constructs a massive HTML string using template literals (backticks `` ` ``). It drops variables like `${lm.name}` and `${lm.thumbnail}` directly into the HTML structure.
- **DOM Update:** Finally, `document.getElementById('landmark-grid').innerHTML = htmlString;` forces the browser to render the new cards.

## 6. Interaction Summary
The HTML provides a blank canvas. The JavaScript reads the URL, fetches the local database, filters it, and writes new HTML into the canvas. The CSS immediately styles that new HTML, turning the raw data into beautiful, interactive cards.
