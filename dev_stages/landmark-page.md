# Landmark Page Tutorial — `landmark.html` and `landmark.js`

> **What is this file?** This is an exhaustive, beginner-friendly tutorial explaining the Landmark Detail Page. This page acts as a photo gallery. It reads the URL to find out which landmark was clicked, fetches the images from `landmark_images.json`, and builds a beautiful, interactive image gallery!

---

## 1. The HTML Basics (The Structure)

### The Header Area
```html
<header class="landmark-hero container">
    <a href="javascript:history.back()" class="back-link">← Back to Region</a>
    <h1 id="landmark-title">Loading Landmark...</h1>
    <p id="landmark-meta"></p>
</header>
```
* **`<h1 id="landmark-title">`**: Just like the Region page, we start with "Loading..." and our JavaScript will replace this text with the real landmark name (e.g., "Great Pyramid of Giza") almost instantly.
* **`href="javascript:history.back()"`**: This is a clever trick! Instead of linking to a specific page, this tells the browser to literally press the "Back" button for the user. It takes them right back to whichever region they just came from!

### The Empty Gallery Grid
```html
<main class="container">
    <div class="gallery-grid" id="gallery-grid">
        <!-- JavaScript will inject image elements here -->
    </div>
</main>
```
* **`<div id="gallery-grid">`**: This is a completely empty box. Our JavaScript will read the `landmark_images.json` database, find all the photos for this specific landmark, and inject an `<img>` tag into this box for every single photo!

---

## 2. The CSS Basics (The Styling)

This page uses an inline `<style>` block for its specific gallery styling.

### The Masonry-Style Gallery Grid
```css
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
}
```
* **`display: grid;`**: Turns the empty box into a powerful grid layout.
* **`grid-template-columns`**:
    * **`repeat(auto-fill, ...)`**: Automatically creates as many columns as will fit on your screen.
    * **`minmax(280px, 1fr)`**: Each column (and therefore, each photo) must be at least `280px` wide. If there is extra space on the screen, they stretch equally (`1fr`). This makes the photo gallery perfectly responsive on both mobile phones and giant desktop monitors without needing extra media queries!
* **`gap: var(--space-md);`**: Adds a nice, even gap (1.5rem, or 24px) between every single photo.

### Styling the Individual Images
```css
.gallery-item {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: var(--radius-md);
    cursor: zoom-in;
    transition: transform 0.3s, box-shadow 0.3s;
}
```
* **`.gallery-item`**: This is the class we will add to the `<img>` tags we generate in JavaScript.
* **`width: 100%; height: 300px;`**: Forces every single photo in the gallery to be exactly the same size. This makes the grid look perfectly neat and uniform.
* **`object-fit: cover;`**: Because we forced the width and height, a vertical portrait photo would look horribly squished if forced into a square box. `cover` tells the browser: "Zoom in and crop the edges off the photo so it fills the box perfectly without getting distorted!"
* **`border-radius`**: Rounds the sharp corners of the photos.
* **`cursor: zoom-in;`**: Normally the mouse arrow looks like a pointer `👆`. This changes the mouse arrow into a little magnifying glass `🔍` when hovering over a photo, hinting to the user that they can click it!
* **`transition`**: Prepares the photo to smoothly animate when hovered.

### The Image Hover Effect
```css
.gallery-item:hover {
    transform: scale(1.03);
    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}
```
* **`:hover`**: These rules ONLY apply when the user's mouse is hovering over the photo.
* **`transform: scale(1.03);`**: Physically zooms the entire photo container in by 3% (`1.03`). Because of the `transition` rule above, this zoom happens smoothly over 0.3 seconds.
* **`box-shadow`**: Casts a soft shadow behind the photo, making it look like it's lifting off the page towards the user!

---

## 3. The JavaScript Basics (The Brains)

The code in `js/landmark.js` is responsible for building the gallery.

### Step 1: Figuring Out What Landmark We Are On
When the user clicks the "View Full Gallery" button inside the modal on the Region page, the browser goes to `landmark.html?id=64325`.

```javascript
const urlParams = new URLSearchParams(window.location.search);
const landmarkId = urlParams.get('id');
```
* **`window.location.search`**: Grabs the `?id=64325` part of the URL.
* **`.get('id')`**: Extracts the exact number. Now the variable `landmarkId` holds the string `"64325"`.

### Step 2: Fetching the Data
```javascript
const [landmarksRes, imagesRes] = await Promise.all([
    fetch('assets/landmarks.json'),
    fetch('assets/landmark_images.json')
]);
const allLandmarks = await landmarksRes.json();
const imageData = await imagesRes.json();
```
* **`Promise.all([ ... ])`**: This is a massive performance boost. It tells the browser to download BOTH JSON files at the exact same time, rather than downloading one and waiting to start the next.
* **`await ... .json()`**: Translates the downloaded plain text files into real JavaScript Arrays and Objects.

### Step 3: Finding the Specific Data
```javascript
const landmarkInfo = allLandmarks.find(l => l.id === landmarkId);
const galleryInfo = imageData.landmarks.find(l => l.id === landmarkId);
```
* **`.find(l => l.id === landmarkId)`**: We search our giant list of 90 landmarks to find the one single object where the ID perfectly matches `"64325"`. Now we have all the text details (like the name) AND the list of images for this specific landmark!

### Step 4: Updating the Title
```javascript
document.getElementById('landmark-title').textContent = landmarkInfo.name;
document.getElementById('landmark-meta').textContent = 
    `${landmarkInfo.region} • ${landmarkInfo.category}`;
```
* **`document.getElementById(...)`**: Finds our `<h1>` and `<p>` tags that currently say "Loading...".
* **`.textContent = landmarkInfo.name`**: We delete "Loading..." and instantly replace it with the real name from our database (e.g., "Great Pyramid of Giza").
* **`${...}`**: This syntax (called template literals) allows us to inject variables directly into a string of text. We combine the region and category together separated by a bullet point `•`.

### Step 5: Building the Image Gallery
```javascript
const grid = document.getElementById('gallery-grid');
grid.innerHTML = '';
```
* **`document.getElementById('gallery-grid')`**: Finds our completely empty HTML box.
* **`grid.innerHTML = ''`**: Clears it out just to be safe.

```javascript
galleryInfo.images.forEach((img, index) => {
    const delay = index * 0.1;
    
    const imgHTML = `
        <img src="assets/${img.path}" 
             alt="${landmarkInfo.name} - Photo ${index + 1}" 
             class="gallery-item reveal-element"
             style="transition-delay: ${delay}s"
             loading="lazy">
    `;
    grid.insertAdjacentHTML('beforeend', imgHTML);
});
```
* **`galleryInfo.images.forEach((img, index) => ...)`**: We take the list of photos from our database and loop through it one by one. `img` represents the current photo, and `index` is a counter (0, 1, 2, 3...).
* **`const delay = index * 0.1;`**: We want the photos to fade onto the screen one after another (a stagger effect). Photo 0 gets a 0.0s delay, photo 1 gets a 0.1s delay, photo 2 gets a 0.2s delay, etc.
* **`` `...` `` (Backticks)**: We use backticks to write the raw HTML `<img ...>` tag right here in JavaScript!
* **`src="assets/${img.path}"`**: We inject the exact file path from our database directly into the `src` attribute. This tells the browser exactly where to download the photo from!
* **`alt="${landmarkInfo.name} - Photo ${index + 1}"`**: For blind users, we label every photo clearly (e.g., "Great Pyramid of Giza - Photo 1").
* **`loading="lazy"`**: A brilliant performance trick. If a gallery has 40 photos, this tells the browser "Don't download the photos at the bottom of the page until the user actually scrolls down to look at them!" This makes the page load instantly.
* **`grid.insertAdjacentHTML('beforeend', imgHTML);`**: We take the `<img>` tag we just built, and shove it into our empty `grid` box at the very end. The loop repeats until all photos are drawn on the screen!
