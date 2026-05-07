# Region Page Tutorial — `region.html` and `region.js`

> **What is this file?** This is an exhaustive, beginner-friendly tutorial explaining the Region Page. This page acts as a filter. When a user clicks "Cairo" on the Home page, this page loads, figures out they clicked Cairo, and searches the database to display only the landmarks inside Cairo!

---

## 1. The HTML Basics (The Structure)

### The Header Area (Title and Filter Buttons)
```html
<header class="region-header container">
    <div class="region-title-area">
        <a href="index.html" class="back-link">← Back to Regions</a>
        <h1 id="region-title">Loading Region...</h1>
        <p id="region-description"></p>
    </div>
    
    <div class="category-filters" id="category-filters">
        <button class="filter-btn active" data-category="all">All Landmarks</button>
        <!-- JavaScript will automatically add more buttons here! -->
    </div>
</header>
```
* **`<h1 id="region-title">Loading Region...</h1>`**: We put "Loading Region..." inside the `<h1>` because when the HTML first loads, it has no idea what region you clicked! Our JavaScript will instantly replace this text with the real name (e.g., "Greater Cairo") before you even see it.
* **`<div class="category-filters">`**: This is a container for our filter buttons (like "Ancient Egyptian", "Islamic", etc.). We only hardcode the "All Landmarks" button. JavaScript will read the database and create the rest of the buttons for us automatically so we don't have to type them all out!

### The Empty Grid
```html
<main class="container">
    <div class="landmarks-grid" id="landmarks-grid">
        <!-- JavaScript will inject cards here -->
    </div>
</main>
```
* Just like the Home page, we provide a completely empty `<div id="landmarks-grid">` box. Our JavaScript will build the HTML for every single landmark and inject it into this box.

### The Modal (Popup Window)
```html
<dialog id="landmark-modal" class="landmark-modal">
    <div class="modal-content">
        <button id="modal-close" class="modal-close" aria-label="Close">×</button>
        <div id="modal-body"></div>
    </div>
</dialog>
```
* **`<dialog>`**: This is a very special, powerful HTML tag. It represents a popup window! By default, it is completely invisible. When we use JavaScript to say `.showModal()`, it suddenly pops up in the middle of the screen and dims everything behind it!
* **`<button id="modal-close">×</button>`**: A simple button with an "X" to close the popup.

---

## 2. The CSS Basics (The Styling)

This page uses `css/landmarks-grid.css` for its specific styles.

### The Category Filter Buttons
```css
.category-filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: var(--space-md);
}
```
* **`display: flex;`**: Lines the buttons up horizontally next to each other.
* **`flex-wrap: wrap;`**: This is crucial for mobile phones! If there are too many buttons to fit on one line, `wrap` tells them to break down onto the next line instead of overflowing off the screen.

### The Filter Button Styling
```css
.filter-btn {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-main);
    padding: 6px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
}
.filter-btn.active, .filter-btn:hover {
    background: var(--text-main);
    color: var(--bg-main);
}
```
* **`border-radius: 20px;`**: Gives the buttons a nice pill shape.
* **`transition: all 0.2s;`**: Makes the color change smooth.
* **`.filter-btn.active`**: When a button has the `active` class (meaning it is currently selected), we invert the colors! The background becomes black and the text becomes white.

### The Landmark Card
```css
.landmark-card {
    border-radius: var(--radius-md);
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background: var(--bg-card);
    transition: transform 0.3s, box-shadow 0.3s;
}
.landmark-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}
```
* **`overflow: hidden;`**: This acts like scissors. Since the card has rounded corners (`border-radius`), any sharp square image placed inside it will stick out. This snips off the sharp corners of the image so it perfectly fits inside the card.
* **`transform: translateY(-5px);`**: When hovered, the card physically floats 5 pixels upwards, making it feel interactive.

### The Modal (Popup) Styling
```css
.landmark-modal {
    border: none;
    border-radius: var(--radius-lg);
    background: var(--bg-card);
    width: 90%;
    max-width: 860px;
    margin: auto;
}
.landmark-modal::backdrop {
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
}
```
* **`margin: auto;`**: This is a magic trick for the `<dialog>` element. It forces the popup to be perfectly centered on the screen vertically and horizontally.
* **`::backdrop`**: This is a pseudo-element created automatically by the `<dialog>` tag. It represents the "rest of the screen" behind the popup.
    * We give it a 55% black background and a blur. This creates a gorgeous, dark, frosted glass effect over the entire website, forcing the user to focus only on the popup window!

---

## 3. The JavaScript Basics (The Brains)

The code in `js/region.js` does a LOT of heavy lifting.

### Step 1: Figuring Out What Page We Are On
When the user clicks "Cairo" on the Home page, the browser goes to `region.html?id=cairo`.

```javascript
const urlParams = new URLSearchParams(window.location.search);
const regionId = urlParams.get('id');
```
* **`window.location.search`**: This grabs the `?id=cairo` part of the URL at the top of the browser.
* **`URLSearchParams`**: This is a built-in browser tool that easily reads those parameters.
* **`.get('id')`**: This extracts the exact value. Now the variable `regionId` holds the word `"cairo"`!

### Step 2: Fetching the Data
```javascript
const [regionsRes, landmarksRes] = await Promise.all([
    fetch('assets/regions.json'),
    fetch('assets/landmarks.json')
]);
const regions = await regionsRes.json();
const allLandmarks = await landmarksRes.json();
```
* **`Promise.all([ ... ])`**: `fetch` downloads files. Instead of downloading `regions.json`, waiting for it to finish, and THEN downloading `landmarks.json`, `Promise.all` downloads BOTH of them at the exact same time! This makes the website twice as fast!
* **`await ... .json()`**: Converts the downloaded plain text files into real JavaScript Arrays.

### Step 3: Filtering the Landmarks
```javascript
const regionData = regions.find(r => r.id === regionId);
let regionLandmarks = allLandmarks.filter(l => l.region === regionData.name);
```
* **`.find(r => r.id === regionId)`**: We search the `regions` list and find the exact object where the ID matches `"cairo"`. Now we have all the data about Cairo!
* **`.filter(l => l.region === regionData.name)`**: We take our massive list of all 90 landmarks, and we filter it! We tell the computer: "Only keep the landmarks where the region name equals 'Greater Cairo'". Now `regionLandmarks` ONLY holds landmarks in Cairo!

### Step 4: Building the Filter Buttons
```javascript
const categories = new Set(regionLandmarks.map(l => l.category));
```
* **`.map(l => l.category)`**: Extracts just the category name (like "Islamic" or "Pharaonic") from every single Cairo landmark.
* **`new Set(...)`**: A Set is a special list that automatically deletes duplicates! If 10 landmarks say "Islamic", the Set only keeps the word "Islamic" once.

```javascript
categories.forEach(cat => {
    filtersContainer.insertAdjacentHTML('beforeend', 
        `<button class="filter-btn" data-category="${cat}">${cat}</button>`
    );
});
```
* **`.forEach`**: We loop through our clean list of categories.
* **`insertAdjacentHTML`**: We inject a new `<button>` into the HTML for every category we found!

### Step 5: Opening the Modal
When the user clicks a landmark card, we want the `<dialog>` popup to open.

```javascript
function openModal(landmarkId) {
    const landmark = regionLandmarks.find(l => l.id === landmarkId);
    
    modalBody.innerHTML = `
        <h2>${landmark.name}</h2>
        <p>${landmark.description}</p>
        <p><strong>Tickets:</strong> ${landmark.ticket_price}</p>
        <a href="landmark.html?id=${landmark.id}" class="btn-solid">View Full Gallery</a>
    `;
    
    modal.showModal();
}
```
* **`.find(...)`**: We search our list to find the specific landmark the user clicked on.
* **`modalBody.innerHTML = ...`**: We build the HTML for the popup window, injecting the name, description, and ticket price directly from our JSON database.
* **`<a href="landmark.html?id=...">`**: We also build a button that takes the user to the final Landmark Gallery page, passing the exact ID in the URL!
* **`modal.showModal();`**: This is the magic command built into browsers. It instantly forces the invisible `<dialog>` element to pop up on the screen and dim the background!
