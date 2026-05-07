# Static Blog Page Tutorial — `blog.html`

> **What is this file?** This is an exhaustive, beginner-friendly tutorial explaining every single line of HTML and CSS used to build the static Blog page. It assumes no prior knowledge and explains everything from scratch.

---

## 1. The HTML Basics (The Structure)

HTML is like the skeleton of a building. It creates the text, images, and links, but it doesn't make them look pretty.

### The `<head>` Section
The `<head>` is hidden from the user. It contains setup instructions for the web browser.

```html
<head>
    <title>Blog — Egypt Wonders</title>
    <meta name="description" content="Stories, history, and travel insights.">
    <link rel="stylesheet" href="css/global.css?v=5">
</head>
```
* **`<head>`**: Wraps all the hidden settings for the page.
* **`<title>`**: The text that appears in the little tab at the top of your web browser.
* **`<meta name="description">`**: A short description of the page that Google uses when displaying search results.
* **`<link rel="stylesheet">`**: Connects this HTML file to our CSS file (`global.css`). The CSS file contains all the design rules (colors, fonts, etc.).

### The Blog Header
```html
<header class="blog-header">
    <h1>Stories from the Nile</h1>
    <p>History, travel insights, and discoveries.</p>
</header>
```
* **`<header>`**: This acts exactly like a regular box (`<div>`), but its name tells the computer "this box contains introductory header content." This helps screen readers for blind users.
* **`class="blog-header"`**: We give this box a "class" (a label) so we can target it later in CSS and give it specific styling.
* **`<h1>`**: "Heading 1". The largest and most important title on the page.
* **`<p>`**: "Paragraph". Used for normal text.

### The Blog Post Card
```html
<article class="blog-card">
    <img class="blog-card-img" src="assets/images/1.jpg" alt="Inside the Pyramid" loading="lazy">
    <div class="blog-card-body">
        <span class="blog-card-date">April 2026</span>
        <h2 class="blog-card-title">Inside Khufu's Pyramid</h2>
        <p class="blog-card-excerpt">Walking through the Grand Gallery...</p>
    </div>
</article>
```
* **`<article>`**: Another semantic box. It means "this box contains an independent piece of content, like a blog post or a news article."
* **`<img>`**: The Image tag. It places a picture on the screen.
    * **`src="assets/images/1.jpg"`**: "Source". Tells the browser exactly where to find the picture file.
    * **`alt="Inside the Pyramid"`**: "Alternative text". If the image fails to load, or if a blind person is using a screen reader, this text describes the picture.
    * **`loading="lazy"`**: A performance trick. It tells the browser *not* to download the image until the user scrolls down and actually looks at it.
* **`<div>`**: A generic empty box used to group the date, title, and excerpt together.
* **`<span>`**: Similar to a `<div>`, but it only takes up as much horizontal space as the text inside it. Used here for the tiny date text.
* **`<h2>`**: "Heading 2". A smaller subtitle, used for the title of the individual blog post.

---

## 2. The CSS Basics (The Styling)

CSS paints the HTML skeleton, changing colors, sizes, and layouts. The blog uses an inline `<style>` block (CSS written directly inside the HTML file) for its specific rules.

### Styling the Header
```css
.blog-header {
    padding: var(--space-lg) 0;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: var(--space-xl);
}
```
* **`.blog-header`**: The dot tells CSS "find an HTML element that has `class="blog-header"`."
* **`padding`**: Adds empty breathing room *inside* the box. `var(--space-lg)` is a variable (like a shortcut) for a specific size (e.g., 40 pixels). The `0` means zero padding on the left and right.
* **`border-bottom`**: Draws a line at the bottom of the box. `1px` (1 pixel thick), `solid` (straight continuous line), and we use a variable for the color.
* **`margin-bottom`**: Adds empty space *outside* the bottom of the box, pushing the blog posts further down.

### The Grid Layout (Arranging the Cards)
```css
.blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-lg);
}
```
* **`display: grid;`**: This turns the container into a grid system, letting us place the blog cards in rows and columns automatically.
* **`grid-template-columns`**: Defines how many columns to make.
    * **`repeat(auto-fill, ...)`**: Automatically creates as many columns as will fit on your screen.
    * **`minmax(300px, 1fr)`**: Each column must be at least `300px` wide. If there is extra space, they all stretch equally (`1fr` means 1 fraction of the space). This makes the grid fully responsive for mobile and desktop without extra code!
* **`gap`**: The empty space between the rows and columns so the cards don't touch each other.

### Styling the Blog Card
```css
.blog-card {
    background: var(--bg-card);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
}
```
* **`background`**: The background color of the card.
* **`border-radius`**: Curves the sharp 90-degree corners into soft, rounded corners.
* **`overflow: hidden;`**: The image inside the card is square, but the card has rounded corners. This rule acts like scissors and cuts off the sharp corners of the image so it matches the card perfectly.
* **`transition`**: When we hover over the card, we want it to move and cast a shadow. `transition` tells the browser to make that change smoothly over 0.3 seconds, instead of teleporting instantly.

### The Card Hover Effect
```css
.blog-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    border-color: var(--accent);
}
```
* **`:hover`**: These rules ONLY activate when the user's mouse pointer is hovering over the card.
* **`transform: translateY(-3px);`**: Moves the card `3px` upwards on the Y (vertical) axis. It makes the card look like it's lifting towards the user.
* **`box-shadow`**: Creates a drop shadow under the card. The values are: X-offset (0), Y-offset (8px down), Blur radius (24px soft blur), and Color (black at 8% opacity).
* **`border-color`**: Changes the card's border to our gold accent color.

### The Card Image
```css
.blog-card-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
}
```
* **`width: 100%;`**: Forces the image to stretch all the way across the card.
* **`height: 180px;`**: Forces the image to be exactly 180 pixels tall.
* **`object-fit: cover;`**: Because we forced the width and height, the image might look stretched or squished. `cover` tells the browser to zoom in and crop the image perfectly so it fills the box without looking distorted.

### The Date Text
```css
.blog-card-date {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--accent);
    font-weight: 600;
}
```
* **`font-size: 0.72rem;`**: Makes the text very small. (`1rem` is normal size).
* **`text-transform: uppercase;`**: Forces all the letters to be CAPITALIZED, even if they were typed in lowercase in the HTML.
* **`letter-spacing: 1.5px;`**: Adds extra empty space between each individual letter, giving it a premium, magazine-like look.
* **`color: var(--accent);`**: Turns the text gold.
* **`font-weight: 600;`**: Makes the text semi-bold.

### The JavaScript
```html
<script src="js/nav.js"></script>
```
* **`<script>`**: This tag tells the browser to load JavaScript. JavaScript is the "muscle" of the website that makes things interactive.
* **`src="js/nav.js"`**: Links to our navigation script, which handles the dark mode toggle and highlights the active link in the menu. There is no page-specific JavaScript for the static blog.
