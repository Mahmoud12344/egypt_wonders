# About Us Page Tutorial — `about.html` and `css/about.css`

> **What is this file?** This is an exhaustive, beginner-friendly tutorial explaining every single line of code used to build the "About Us" page. It explains the HTML (the structure) and the CSS (the styling) from the absolute basics.

---

## 1. The HTML Basics (The Structure)

HTML (HyperText Markup Language) is the skeleton of the website. It tells the browser what elements exist (like text, images, or links) before we add any styling.

### The `<head>` Section
The `<head>` is the invisible brain of the page. Nothing inside here is seen directly on the screen, but it tells the browser how to behave.

```html
<title>About Us — Egypt Wonders</title>
<meta name="description" content="Meet the team behind the Egypt Wonders project.">
<link rel="stylesheet" href="css/global.css?v=5">
<link rel="stylesheet" href="css/about.css?v=1">
```

* **`<title>`**: This tag defines the name of the page that appears in the browser tab at the very top of your screen.
* **`<meta name="description">`**: This provides a short summary of the page. Search engines like Google read this and show it under the link in search results.
* **`<link rel="stylesheet">`**: This tag connects our HTML file to our CSS styling files.
    * `href="css/global.css"` links to the main styles used across the whole site.
    * `href="css/about.css"` links to the specific styles just for this About page.

### The Background Watermark
```html
<div class="bg-watermark" aria-hidden="true">TEAM</div>
```
* **`<div>`**: Think of a `div` as an empty invisible box. We use it to group things or hold content.
* **`class="bg-watermark"`**: A "class" is a label we attach to an element so we can target it later in CSS to style it.
* **`aria-hidden="true"`**: This is an accessibility feature. It tells screen readers (software used by blind users) to ignore this text. We do this because the giant word "TEAM" is just for visual decoration.

### The Hero Section
```html
<header class="about-hero">
    <h1>Project Contributors</h1>
    <p>The team behind the Fourth Semester Web Project.</p>
</header>
```
* **`<header>`**: A semantic tag. It works exactly like a `div` (a box), but its name tells the browser "this box contains the introductory header content."
* **`<h1>`**: The "Heading 1" tag. It is the most important, largest heading on the page. There should usually only be one `<h1>` per page.
* **`<p>`**: The "Paragraph" tag. It is used for regular blocks of normal-sized text.

### The Contributor Cards Grid
```html
<div class="contributors-grid">
    <article class="contributor-card reveal-element">
        <span class="contributor-watermark">C</span>
        <h2 class="contributor-name">Ahmed Gamal Mohamed Ahmed</h2>
        <div class="contributor-id">ID: 2202086</div>
        <a href="mailto:2202086@studnt.eelu.edu.eg" class="contributor-email">✉ 2202086@studnt.eelu.edu.eg</a>
    </article>
</div>
```
* **`<article>`**: A semantic tag like a `div`, but used for content that could stand on its own (like a card or a blog post).
* **`<span>`**: Similar to a `div`, but while a `div` takes up the whole width of the screen (block level), a `span` only takes up as much width as the text inside it (inline). We use it here just to hold the faint background letter "C".
* **`<h2>`**: The "Heading 2" tag. It is slightly smaller than `<h1>` and is used for sub-headings.
* **`<a>`**: The "Anchor" tag. This creates a clickable link.
    * **`href="mailto:..."`**: The "Hypertext REFerence" attribute tells the link where to go. Starting it with `mailto:` tells the computer to open the user's default email app (like Outlook or Gmail) instead of going to a web page.

---

## 2. The CSS Basics (The Styling)

CSS (Cascading Style Sheets) is the paint and layout engine of the website. It takes the plain HTML skeleton and makes it look beautiful.

### About Hero Styling
```css
.about-hero {
    text-align: center;
    padding: var(--space-xl) 0 var(--space-lg);
    margin-bottom: var(--space-lg);
    border-bottom: 1px solid var(--border-color);
}
```
* **`.about-hero`**: The dot `.` means we are targeting an HTML element with `class="about-hero"`.
* **`text-align: center;`**: This centers all the text horizontally inside the box.
* **`padding`**: This adds empty space *inside* the box, pushing the content away from the edges.
    * `var(--space-xl)`: This is a variable holding a specific size (like 48 pixels). We use variables so the spacing is mathematically identical across the whole site.
* **`margin-bottom`**: This adds empty space *outside* the bottom of the box, pushing the next element further down the page.
* **`border-bottom`**: This draws a physical line at the bottom of the box. We made it `1px` (1 pixel) thick, `solid` (a continuous straight line), and used our variable for the border color.

### Formatting the Main Heading (`<h1>`)
```css
.about-hero h1 {
    font-family: var(--font-heading);
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    margin-bottom: var(--space-xs);
    color: var(--text-main);
}
```
* **`.about-hero h1`**: This targets any `<h1>` that is *inside* `.about-hero`.
* **`font-family`**: Tells the browser what font to use. We use a variable to load our elegant "Playfair Display" font.
* **`font-size`**: Controls how big the text is.
    * **`clamp(minimum, preferred, maximum)`**: This is an advanced trick for responsiveness. It says: "Make the font 5% of the screen width (`5vw`), but never let it get smaller than `2.5rem` on mobile phones, and never bigger than `3.5rem` on massive monitors."
* **`color`**: Changes the color of the text.

### The Grid Layout
```css
.contributors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-lg);
}
```
* **`display: grid;`**: This turns the empty box into a powerful grid system, allowing us to align items into rows and columns easily.
* **`grid-template-columns`**: This tells the grid how many columns to make.
    * **`repeat(auto-fill, ...)`**: Tells the browser to automatically create as many columns as will fit on the screen.
    * **`minmax(320px, 1fr)`**: Each column must be at least `320px` wide. If there is extra space, stretch them equally (`1fr` means 1 fraction of the available space).
* **`gap`**: This is the empty space (gutter) between the grid columns and rows. It keeps the cards from touching each other.

### The Glassmorphism Cards
```css
.contributor-card {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(16px);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    position: relative;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
}
```
* **`background: rgba(...)`**: Sets the background color. `rgb` stands for Red, Green, Blue. The `a` stands for Alpha (transparency). `255, 255, 255` is pure white, and `0.4` means it is 40% opaque (see-through).
* **`backdrop-filter: blur(16px);`**: This applies a Gaussian blur effect to whatever is *behind* the card. Combined with the see-through background, this creates the premium "frosted glass" look (Glassmorphism).
* **`border-radius`**: This curves the sharp outer corners of the card.
* **`position: relative;`**: This makes the card the "anchor point" for anything inside it that is told to move around absolutely.
* **`overflow: hidden;`**: If anything inside this box tries to spill out past its borders (like our giant background letter), this property acts like scissors and cuts the spilling parts off.
* **`transition`**: When we hover over the card, it changes state. Transition tells the browser to animate that change smoothly over `0.3s` (zero point three seconds) instead of snapping instantly.

### Card Hover Effects
```css
.contributor-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
    border-color: var(--accent);
}
```
* **`:hover`**: This is a pseudo-class. These styles ONLY apply when the user's mouse pointer is hovering over the card.
* **`transform: translateY(-8px);`**: This physically moves the card. `translateY` means moving on the vertical axis (up and down). `-8px` means move 8 pixels upwards (closer to the top of the screen).
* **`box-shadow`**: Creates a drop shadow behind the card. The values are: X-offset (0), Y-offset (15px down), Blur radius (35px soft blur), and Color (black at 8% opacity). It makes the card look like it's lifting off the page.

### The Contact Banner
```css
.contact-banner {
    text-align: center;
    position: relative;
    overflow: hidden;
}
.contact-email {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    transition: opacity 0.3s;
}
.contact-email:hover {
    opacity: 0.8;
}
```
* **`text-align: center;`**: Keeps the title and email perfectly centered in the banner.
* **`display: inline-flex;`**: Turns the link into a mini horizontal flexbox. This allows us to align the little envelope icon perfectly next to the text.
* **`align-items: center;`**: Centers the icon and text vertically with each other.
* **`font-weight: 600;`**: Makes the text thicker (bold). Regular text is usually 400. Bold is 700. 600 is semi-bold.
* **`opacity: 0.8;`**: When hovered, the link drops from 100% visible (1.0) to 80% visible (0.8), creating a subtle fading effect indicating it can be clicked.
