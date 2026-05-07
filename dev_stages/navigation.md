# Navigation Bar Tutorial — `nav.js` and `global.css`

> **What is this file?** This is an exhaustive, beginner-friendly tutorial explaining how we build the Navigation Bar (the menu at the top of the screen) that appears on every single page. It explains the HTML layout, the CSS styling, and the JavaScript that controls the Dark Mode toggle button.

---

## 1. The HTML Basics (The Structure)

Every page on our website has this exact same block of HTML at the very top.

### The `<header>` and `<nav>` Elements
```html
<header class="site-nav" role="banner">
    <nav class="nav-inner container" aria-label="Main navigation">
```
* **`<header>`**: A semantic box used for introductory content. Because it is at the very top of the `<body>`, it represents the site's main header.
    * **`class="site-nav"`**: A label so we can style this exact header box.
    * **`role="banner"`**: An accessibility feature. It tells screen readers (software for blind users) "This is the main banner for the entire website."
* **`<nav>`**: A semantic box that means "Navigation". It tells the browser that this box contains major links to other pages.
    * **`aria-label="Main navigation"`**: Another accessibility feature. It announces "Main navigation" to screen readers so they know exactly what this menu is for.

### The Logo
```html
        <a href="index.html" class="nav-logo">Egypt Wonders</a>
```
* **`<a>`**: The anchor tag creates a clickable link.
* **`href="index.html"`**: Tells the link where to go. If a user clicks the logo, it takes them back to the Home page (`index.html`).

### The Navigation Links
```html
        <div class="nav-right">
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
```
* **`<ul>`**: Stands for "Unordered List". It creates a bulleted list.
* **`<li>`**: Stands for "List Item". Every item inside a `<ul>` must be wrapped in an `<li>`.
* **Why use a list for a menu?** Using a list for navigation links is a web standard. It helps screen readers count the links ("List, 4 items"), and it is easy to format with CSS. We will use CSS later to turn off the bullets and make them sit side-by-side!

### The Dark Mode Toggle Button
```html
            <button class="nav-mode-btn" id="mode-toggle" aria-label="Toggle dark mode">🌙</button>
        </div>
    </nav>
</header>
```
* **`<button>`**: A clickable button element.
* **`id="mode-toggle"`**: A unique identifier. We need this ID so our JavaScript can find this exact button and make it work.
* **`aria-label="Toggle dark mode"`**: Because the button only contains an emoji (`🌙`), blind users wouldn't know what it does. The `aria-label` provides a hidden text description for them.

---

## 2. The CSS Basics (The Styling)

We style the navigation bar in our `global.css` file so it looks identical on every page.

### Styling the Header Bar
```css
.site-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    transition: background-color 0.3s, border-color 0.3s;
}
```
* **`position: sticky; top: 0;`**: This is a powerful layout trick! Normally, when you scroll down, the menu disappears off the top of the screen. `sticky` tells the menu to stick to the top (`top: 0`) and travel down the page with you as you scroll!
* **`z-index: 100;`**: Think of the screen in 3D. `z-index` controls the layers. By giving it a high number (`100`), we ensure the menu always floats *above* the pictures and text as you scroll, instead of slipping behind them.
* **`background-color: rgba(...)`**: Creates a 75% solid white background.
* **`backdrop-filter: blur(12px);`**: Blurs anything passing *behind* the menu, creating a beautiful frosted glass effect (Glassmorphism).

### Flexbox Layout (Aligning the items)
```css
.nav-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
}
```
* **`display: flex;`**: Turns the navigation box into a "flexbox". This lets us align the items horizontally.
* **`justify-content: space-between;`**: Takes the items inside the box (the Logo on the left, and the links on the right) and pushes them as far apart as possible.
* **`align-items: center;`**: Centers them perfectly vertically (up and down).
* **`height: 70px;`**: Forces the navigation bar to be exactly 70 pixels tall.

### Styling the List
```css
.nav-links {
    list-style: none;
    display: flex;
    gap: var(--space-md);
}
```
* **`list-style: none;`**: This turns off the ugly default bullet points that come with `<ul>` lists!
* **`display: flex;`**: Turns the list into a flexbox, forcing the links to sit side-by-side horizontally instead of stacking vertically.
* **`gap`**: Adds empty space between each link so they don't touch.

### Styling the Links
```css
.nav-links a {
    text-decoration: none;
    color: var(--text-main);
    font-size: 0.9rem;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    transition: background-color 0.3s, color 0.3s;
}
```
* **`text-decoration: none;`**: Turns off the ugly default blue underline that comes with web links.
* **`padding`**: Adds breathing room around the text inside the link so it feels like a nice clickable button.
* **`border-radius`**: Rounds the corners of the background (which you only see when hovering).

### The Hover and Active States
```css
.nav-links a:hover,
.nav-links a.active {
    background: var(--bg-card);
    color: var(--accent);
}
```
* **`:hover`**: When the user's mouse hovers over a link, the background changes to a light gray (`var(--bg-card)`) and the text turns gold (`var(--accent)`).
* **`.active`**: We use JavaScript to add this class to the link of the page you are currently on. So if you are on the Blog page, the "Blog" link stays gold to show you where you are!

---

## 3. The JavaScript Basics (The Brains)

The `js/nav.js` file has two jobs:
1. Figure out which page the user is on and highlight the correct menu link.
2. Make the Dark Mode toggle button work.

### Job 1: Highlighting the Active Link
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
```
* **`window.location.pathname`**: This asks the browser: "What is the URL of the page we are looking at right now?" (e.g., `/blog.html`).
* **`document.querySelectorAll(...)`**: Gathers all the `<a>` links inside our menu into a list.

```javascript
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPath.includes(linkPath)) {
            link.classList.add('active');
        } else if (currentPath.endsWith('/') && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });
```
* **`.forEach(link => ...)`**: Loops through every link in our menu.
* **`.getAttribute('href')`**: Looks at the link and asks: "Where do you point to?" (e.g., `index.html` or `blog.html`).
* **`if (currentPath.includes(linkPath))`**: Asks: "Does the link you point to match the page we are currently on?"
* **`.classList.add('active')`**: If it matches, we add the `.active` CSS class to the link, turning it gold!
* **The `else if` part**: This is a special rule for the home page. Sometimes the home page is just `/` (like `www.egyptwonders.com/`) instead of `index.html`. This rule ensures the "Home" link still turns gold in that situation.

### Job 2: The Dark Mode Toggle
```javascript
    const toggleBtn = document.getElementById('mode-toggle');
```
* **`document.getElementById('mode-toggle')`**: Finds our moon icon button.

```javascript
    let currentMode = localStorage.getItem('themeMode');
```
* **`localStorage.getItem('themeMode')`**: Checks the browser's hard drive to see if the user previously saved a preference for dark mode. (If they visited yesterday and set it to dark mode, we want to remember it today!)

```javascript
    if (currentMode === 'dark') {
        document.documentElement.setAttribute('data-mode', 'dark');
        toggleBtn.textContent = '☀️';
    }
```
* **`document.documentElement`**: This grabs the `<html>` tag at the very top of the page.
* **`.setAttribute('data-mode', 'dark')`**: This adds a label (`data-mode="dark"`) to the whole HTML document. Our `global.css` file sees this label and instantly swaps all the color variables (like turning the background black and text white)!
* **`toggleBtn.textContent = '☀️'`**: Changes the moon icon to a sun icon.

```javascript
    toggleBtn.addEventListener('click', () => {
        const currentDataMode = document.documentElement.getAttribute('data-mode');
```
* **`addEventListener('click', ...)`**: Tells the browser: "Wait until the user clicks the toggle button, then run this code."
* **`getAttribute('data-mode')`**: Checks to see if the dark mode label is currently turned on.

```javascript
        if (currentDataMode === 'dark') {
            document.documentElement.removeAttribute('data-mode');
            localStorage.setItem('themeMode', 'light');
            toggleBtn.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-mode', 'dark');
            localStorage.setItem('themeMode', 'dark');
            toggleBtn.textContent = '☀️';
        }
    });
});
```
* **The `if / else` statement**: This is the switch!
    * **If it IS dark mode:** Remove the dark mode label (turning the page white), save 'light' to the hard drive, and change the icon to a moon.
    * **If it IS NOT dark mode:** Add the dark mode label (turning the page black), save 'dark' to the hard drive, and change the icon to a sun.
