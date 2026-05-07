# Global Styles Tutorial — `global.css`

> **What is this file?** This is an exhaustive, beginner-friendly tutorial explaining our main CSS file. `global.css` is linked to every single HTML page on our website. It sets up the core design rules, colors, fonts, and dark mode so we don't have to rewrite them on every page!

---

## 1. CSS Variables (The Color Palette)

Variables are like shortcuts. Instead of typing `#B28D42` (our gold color) 100 times throughout the CSS, we save it in a variable called `--accent`. If we ever want to change our gold color to blue, we only change it in one place!

```css
:root {
    /* Main Typography */
    --font-heading: 'Playfair Display', serif;
    --font-body: 'Inter', sans-serif;

    /* Light Mode Colors (Default) */
    --bg-main: #FDFBF7;
    --bg-card: #FFFFFF;
    --text-main: #1A1A1A;
    --text-muted: #5A5A5A;
    --accent: #B28D42;
    --border-color: rgba(0, 0, 0, 0.08);

    /* Spacing System */
    --space-xs: 0.5rem;
    --space-sm: 1rem;
    --space-md: 1.5rem;
    --space-lg: 2.5rem;
    --space-xl: 4rem;

    /* Rounded Corners & Animation Speed */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 24px;
    --transition: 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}
```
* **`:root`**: This is CSS code for "apply these variables to the highest level of the website (the HTML tag) so everything can see them."
* **`--bg-main: #FDFBF7;`**: Creates a variable named `--bg-main` and sets it to a slightly warm, sandy off-white color (using a Hex code).
* **Spacing & Radius**: We use variables for empty space and curved corners so everything on the website looks perfectly mathematically consistent. `1rem` is usually equal to 16 pixels.
* **`--transition`**: This variable stores an animation speed (`0.3s`) and an easing curve (`cubic-bezier`). It means "animate over 0.3 seconds, start fast, and slow down at the end."

---

## 2. Dark Mode Switch

How does dark mode work? Simple! When the user clicks the moon icon, our JavaScript adds `data-mode="dark"` to the HTML. 

```css
[data-mode="dark"] {
    --bg-main: #121212;
    --bg-card: #1E1E1E;
    --text-main: #FDFBF7;
    --text-muted: #A0A0A0;
    --border-color: rgba(255, 255, 255, 0.08);
}
```
* **`[data-mode="dark"]`**: This tells CSS "If the HTML has this dark mode label on it, IGNORE the light mode variables above, and use these dark variables instead!"
* **`--bg-main: #121212;`**: Now, the background is a very dark gray instead of white.
* **`--text-main: #FDFBF7;`**: And the text is white instead of black. Every page on the website instantly updates!

---

## 3. Base Reset

Browsers (like Chrome or Safari) add their own ugly default margins and paddings to websites. We need to reset them to zero so we have full control.

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```
* **`*`**: The asterisk is a wild-card. It means "target EVERY SINGLE HTML ELEMENT on the page."
* **`margin: 0; padding: 0;`**: Deletes all browser default spacing.
* **`box-sizing: border-box;`**: This is a critical rule! Normally, if a box is 100px wide, and you add 20px of padding inside, the box stretches to 120px wide! `border-box` tells the computer to shrink the content inside instead, keeping the box perfectly at 100px.

---

## 4. The Body

```css
body {
    font-family: var(--font-body);
    background-color: var(--bg-main);
    color: var(--text-main);
    line-height: 1.6;
    overflow-x: hidden;
    transition: background-color var(--transition), color var(--transition);
}
```
* **`body`**: Targets the `<body>` tag, which holds everything visible on the website.
* **`font-family: var(--font-body);`**: Tells the body to use our "Inter" font variable.
* **`background-color` & `color`**: Applies our background and text color variables.
* **`line-height: 1.6;`**: Adds breathing room between lines of text so paragraphs are easier to read.
* **`overflow-x: hidden;`**: Sometimes elements accidentally stretch too wide and cause a horizontal scrollbar at the bottom of the screen. This cuts off anything that stretches too far right or left, preventing horizontal scrolling.
* **`transition`**: When the user clicks Dark Mode, this makes the background color fade smoothly to black instead of flashing instantly!

---

## 5. Typography (Headings)

```css
h1, h2, h3, h4 {
    font-family: var(--font-heading);
    font-weight: 700;
    line-height: 1.2;
}
```
* **`h1, h2, h3, h4`**: The commas mean "apply this to all these heading types at once."
* **`font-family: var(--font-heading);`**: Uses our elegant "Playfair Display" font variable.
* **`font-weight: 700;`**: Makes the titles bold.
* **`line-height: 1.2;`**: Titles are large, so they don't need as much space between lines as paragraphs do.

---

## 6. The Container System

Monitors are very wide nowadays. If text stretches all the way across a wide monitor, it's very hard to read. We use a container to trap the content in the middle of the screen.

```css
.container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--space-md);
}
```
* **`width: 100%;`**: Take up all the available space...
* **`max-width: 1280px;`**: ...BUT never grow wider than 1280 pixels!
* **`margin: 0 auto;`**: This is the magic centering trick! `0` means zero margin on top and bottom. `auto` tells the computer to split the remaining empty space equally on the left and right, trapping the box perfectly in the center of the screen!
* **`padding`**: Adds a little padding on the left and right so on small mobile phones, the text doesn't touch the edge of the glass screen.

---

## 7. Global Buttons

Instead of styling buttons on every single page, we create one `btn-solid` class here and use it everywhere.

```css
.btn-solid {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--text-main);
    color: var(--bg-main);
    padding: 12px 24px;
    border-radius: 30px;
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: transform var(--transition), opacity var(--transition);
}
```
* **`display: inline-flex; align-items: center; gap: 8px;`**: Makes the button a flexbox so if we put an icon and text inside it, they sit perfectly side-by-side.
* **`background: var(--text-main); color: var(--bg-main);`**: Inverses the colors! The background becomes black, and the text becomes white (or vice-versa in dark mode).
* **`border-radius: 30px;`**: Rounds the corners drastically to make it look like a pill.
* **`text-decoration: none; border: none;`**: Removes default browser button borders and link underlines.
* **`cursor: pointer;`**: Changes the user's mouse arrow into a pointing hand `👆` when hovering over the button.

```css
.btn-solid:hover {
    transform: translateY(-2px);
    opacity: 0.9;
}
```
* **`:hover`**: When hovered, it floats `2px` upward and becomes `90%` opaque (slightly see-through).
