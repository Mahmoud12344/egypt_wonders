# Home Page Tutorial — `index.html` and `home.js`

> **What is this file?** This is an exhaustive, beginner-friendly tutorial explaining the Home Page. The Home page  uses JavaScript to talk to our `regions.json` database, build HTML cards on the fly, and insert them into the page automatically!

---

## 1. The HTML Basics (The Structure)

### The Hero Section (The giant image at the top)
```html
<section class="hero" aria-label="Welcome">
    <div class="hero-content reveal-element">
        <h1>Discover Egypt's<br>Timeless Wonders</h1>
        <p>A journey through millennia of history, architecture, and culture.</p>
        <a href="#regions-section" class="btn-solid">Start Exploring ↓</a>
    </div>
</section>
```
* **`<section>`**: A semantic box. Just like a `<div>`, but it tells the browser "this box contains a major, distinct section of the webpage."
* **`aria-label="Welcome"`**: Tells blind users using screen readers that this section is the Welcome area.
* **`<br>`**: "Line Break". Forces the text to jump down to the next line.
* **`<a>` Button**: It has `class="btn-solid"` which we created in `global.css` to make it look like a beautiful pill-shaped button.
* **`href="#regions-section"`**: Normally `href` goes to a different page (`about.html`). But because it starts with a `#` hashtag, it tells the browser to stay on this page and automatically scroll down to the element that has `id="regions-section"`!

### The Empty Regions Container
```html
<section id="regions-section" class="container">
    <div class="section-header reveal-element">
        <h2>Regions of Egypt</h2>
    </div>
    
    <!-- JavaScript will inject cards here -->
    <div class="regions-grid" id="regions-grid">
        <!-- We left this empty on purpose! -->
    </div>
</section>
```
* **`<div id="regions-grid">`**: This is a completely empty box! We gave it an `id` so our JavaScript knows exactly where to find it. Our JavaScript will read the `regions.json` database and draw all the region cards inside this box automatically.

---

## 2. The CSS Basics (The Styling)

This page uses `css/home.css` for its specific styles.

### The Hero Background Image
```css
.hero {
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), 
                url('../assets/images/Great_Pyramid_of_Giza/0.jpg') center/cover;
    color: white;
}
```
* **`min-height: 90vh;`**: `vh` stands for Viewport Height. This forces the Hero section to take up exactly 90% of your screen's height, no matter how big your monitor is!
* **`display: flex; align-items: center; justify-content: center;`**: This flexbox combo perfectly traps the title text in the absolute dead-center of the giant box.
* **`background`**: This is a complex background. It has TWO layers:
    1. **`linear-gradient`**: Draws a shadow over the image so the white text is readable. It starts 30% black at the top and fades to 70% black at the bottom.
    2. **`url(...)`**: Loads the picture of the Pyramid. `center/cover` tells it to perfectly center the picture and crop it so it covers the entire box without stretching.
* **`color: white;`**: Forces all text inside the Hero to be white so it stands out against the dark image.

### The Dynamic Grid
```css
.regions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--space-lg);
}
```
* **`display: grid;`**: Turns the empty box into a grid system.
* **`repeat(auto-fit, minmax(320px, 1fr))`**: This magically makes the grid responsive. It says "Create as many columns as will fit, but never let a column get skinnier than 320 pixels. If it gets too skinny, drop it down to the next row."

---

## 3. The JavaScript Basics (The Brains)

This code lives in `js/home.js`. Its job is to download `regions.json` and build the HTML cards.

### Waiting for the Page
```javascript
document.addEventListener('DOMContentLoaded', () => {
    loadRegions();
});
```
* **`DOMContentLoaded`**: We wait until the HTML skeleton is finished drawing on the screen. Once it's ready, we run the `loadRegions()` function.

### Fetching the Data
```javascript
async function loadRegions() {
    try {
        const response = await fetch('assets/regions.json');
        const regions = await response.json();
```
* **`async function`**: "Async" means Asynchronous. It tells the computer "This function is going to do something that takes time (like downloading a file from the internet). Please don't freeze the website while we wait."
* **`try { ... }`**: A safety net. It says "Try to do this, but if it fails (like the internet is disconnected), don't crash the whole website."
* **`await fetch('assets/regions.json')`**: `fetch` is the browser's tool for downloading data. `await` tells it "Pause here and wait until the download is 100% finished before moving to the next line."
* **`await response.json()`**: The downloaded file is just plain text. This command translates the plain text back into a real JavaScript Array that we can use!

### Drawing the Cards
```javascript
        const grid = document.getElementById('regions-grid');
        grid.innerHTML = ''; 
```
* **`document.getElementById('regions-grid')`**: Finds our completely empty HTML box.
* **`grid.innerHTML = ''`**: Just to be safe, deletes anything that might be inside it.

```javascript
        regions.forEach((region, index) => {
            const delay = index * 0.1;
```
* **`.forEach(region, index)`**: Loops through every single region we just downloaded. `index` is the number of the loop (0, 1, 2, 3).
* **`const delay = index * 0.1`**: We want the cards to animate in one by one (a staggered effect). So card 0 delays by 0.0s, card 1 delays by 0.1s, card 2 delays by 0.2s, etc.

```javascript
            const cardHTML = `
                <a href="region.html?id=${region.id}" class="region-card reveal-element" style="transition-delay: ${delay}s">
                    <img src="assets/${region.thumbnail}" alt="${region.name}" class="region-img" loading="lazy">
                    <div class="region-content">
                        <h3>${region.name}</h3>
                        <p>${region.description}</p>
                        <span class="region-meta">Iconic: ${region.iconic_landmark}</span>
                    </div>
                </a>
            `;
            grid.insertAdjacentHTML('beforeend', cardHTML);
        });
```
* **`` `...` `` (Backticks)**: We use backticks to write a massive block of raw HTML inside our JavaScript.
* **`<a>` tag instead of `<div>`**: The ENTIRE card is wrapped in an `<a>` link tag! This means clicking anywhere on the picture or the text will click the link.
* **`href="region.html?id=${region.id}"`**: This is brilliant. If the region is Cairo, this link becomes `region.html?id=cairo`. When the user clicks it, it takes them to `region.html`, and attaches `?id=cairo` to the URL. The next page will read the URL to figure out what data to load!
* **`${region.name}`**: This syntax reaches into our downloaded JSON data and injects the name directly into the HTML string (e.g., `<h3>Greater Cairo</h3>`).
* **`insertAdjacentHTML('beforeend', cardHTML)`**: This command takes the raw HTML string we just built and injects it into our empty `grid` box right at the end. It repeats this loop until all the regions are drawn on the screen!

```javascript
    } catch (error) {
        console.error('Error loading regions:', error);
    }
}
```
* **`catch (error)`**: If the `try { ... }` block failed (e.g., the JSON file was deleted), this block catches the error and silently prints it to the developer console instead of breaking the website.
