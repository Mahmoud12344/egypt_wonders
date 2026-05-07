# 06. The Contact Page & Form Logic (Deep Dive)
**Developer:** Orabi
**Core Files:** `contact.html` (includes inline `<style>` and `<script>`)

This document is a comprehensive, line-by-line textbook explaining the Contact page. It is notable for including its CSS inside a `<style>` block within the HTML file itself, which is a valid approach for simple, self-contained pages.

---

## 1. The HTML Structure (Line-by-Line)

### The `<head>` and Inline Styles
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact — Egypt Wonders</title>
    <meta name="description"
        content="Get in touch with the Egypt Wonders team.">
    <link rel="stylesheet" href="css/global.css?v=6">

    <style>
        /* Page-specific CSS lives here */
        .contact-section { ... }
    </style>
</head>
```
- `<meta charset="UTF-8">` — Defines the character encoding. UTF-8 supports all world characters (Arabic, emoji, etc.).
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — Makes the page responsive on mobile. Without this, mobile browsers would shrink the desktop layout to fit the small screen.
- `<title>Contact — Egypt Wonders</title>` — Text shown in the browser tab. Also used by search engines as the link title.
- `<meta name="description" content="...">` — A description shown in Google search results under the page link.
- `<link rel="stylesheet" href="css/global.css?v=6">` — Loads the shared global styles (colors, fonts, navigation, footer). `?v=6` forces browser to fetch the latest version instead of using a cached copy.
- `<style> ... </style>` — All page-specific CSS is written directly inside the HTML file. This is fine for pages with minimal unique styling.

### The Contact Form
```html
<main class="page-content">
    <div class="container">
        <div class="contact-section">

            <header class="contact-header">
                <h1>Get in Touch</h1>
                <p>Have a question about a landmark...</p>
            </header>

            <form class="contact-form" id="contact-form"
                  action="mailto:contact@egyptwonders.edu"
                  method="post" enctype="text/plain" novalidate>

                <div class="form-group">
                    <label class="form-label" for="contact-name">Full Name</label>
                    <input class="form-input" type="text" id="contact-name"
                           name="name" placeholder="Your full name"
                           autocomplete="name" required>
                </div>

                <div class="form-group">
                    <label class="form-label" for="contact-email">Email Address</label>
                    <input class="form-input" type="email" id="contact-email"
                           name="email" placeholder="your@email.com"
                           autocomplete="email" required>
                </div>

                <div class="form-group">
                    <label class="form-label" for="contact-subject">Subject</label>
                    <input class="form-input" type="text" id="contact-subject"
                           name="subject" placeholder="What is your message about?" required>
                </div>

                <div class="form-group">
                    <label class="form-label" for="contact-message">Message</label>
                    <textarea class="form-textarea" id="contact-message"
                              name="message" placeholder="Write your message here..." required>
                    </textarea>
                </div>

                <button class="btn-solid form-submit" type="submit">
                    Send Message →
                </button>
            </form>
        </div>
    </div>
</main>
```
- `<main class="page-content">` — Semantic HTML5 tag for the primary page content.
- `<div class="container">` — A global CSS class from `global.css` that sets a maximum width and centers it.
- `<h1>Get in Touch</h1>` — Only one `<h1>` per page. It is the main heading.
- `action="mailto:contact@egyptwonders.edu"` — If the form submits normally (without JS), the browser opens the user's email app with the data pre-filled. In our case, JS intercepts the submit.
- `method="post"` — Specifies how form data is sent. `post` puts data in the request body.
- `enctype="text/plain"` — Required for `mailto:` forms to format the data correctly.
- `novalidate` — Disables browser popup error messages. We handle validation with JavaScript.
- `<div class="form-group">` — Each `<div>` groups a `<label>` and `<input>` together, making CSS spacing and alignment easy.
- `<label for="contact-name">` — Linked to the input with `id="contact-name"`. Clicking the label focuses the input (accessibility feature).
- `name="name"`, `name="email"` — Used to identify fields when the form data is sent (or in the `mailto:` format).
- `autocomplete="name"` / `autocomplete="email"` — Browser autofill hints.
- `<textarea>` — A multi-line text input for the message. Unlike `<input>`, it has an explicit closing `</textarea>` tag. Any text between the tags becomes the default content.
- `type="submit"` — Triggers the form submit event when clicked.

---

## 2. The CSS Styling (Line-by-Line)

### Section Layout
```css
.contact-section {
    padding: var(--space-xl) 0;
    max-width: 680px;
    margin: 0 auto;
}
```
- `padding: var(--space-xl) 0` — Adds space above and below the section. `0` on the sides (no horizontal padding).
- `max-width: 680px` — Limits the form width for good readability. Very wide form inputs are hard to read.
- `margin: 0 auto` — `auto` on left and right centers the section horizontally.

### The Form Layout
```css
.contact-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}
```
- `display: flex; flex-direction: column` — Activates Flexbox. `column` means child elements (the form groups) stack vertically, one below the other.
- `gap: var(--space-md)` — Creates equal spacing between every form group.

### Form Group: Label + Input Together
```css
.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
```
- Each field group (`<div class="form-group">`) is its own flex column.
- `gap: 6px` — Adds 6 pixels of space between the `<label>` and the `<input>` below it.

### The Label Styling
```css
.form-label {
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text-muted);
}
```
- `font-size: 0.78rem` — Smaller than the body text. Labels are secondary information.
- `text-transform: uppercase` — Converts the text to ALL CAPS regardless of how it's written in HTML.
- `letter-spacing: 1.5px` — Adds 1.5 pixels between each character, a common technique for uppercase labels to improve readability.
- `var(--text-muted)` — A muted/grey text color from `global.css`.

### The Input Styling
```css
.form-input,
.form-textarea {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: 0.75rem 1rem;
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--text-main);
    width: 100%;
    transition: border-color var(--transition), background-color var(--transition);
    outline: none;
}

.form-input:focus,
.form-textarea:focus {
    border-color: var(--accent);
}
```
- `.form-input, .form-textarea { ... }` — A comma separates multiple selectors that share the same styles.
- `background: var(--bg-card)` — A slightly different background from the page itself.
- `border: 1px solid var(--border-color)` — The visible border around each input.
- `padding: 0.75rem 1rem` — `0.75rem` (12px) vertical, `1rem` (16px) horizontal.
- `font-family: var(--font-body)` — Without this, `<textarea>` would use a default monospace font. We force it to use the project's font.
- `width: 100%` — Stretches to fill the form group.
- `outline: none` — Removes the browser's default blue glow focus ring.
- `transition: border-color var(--transition)` — When the border changes color (on focus), it animates smoothly.
- `.form-input:focus { border-color: var(--accent) }` — On focus, the border turns the project's golden color.

### The Textarea
```css
.form-textarea {
    min-height: 160px;
    resize: vertical;
    line-height: 1.6;
}
```
- `min-height: 160px` — The textarea has a minimum height. It will never be shorter than 160px.
- `resize: vertical` — Allows the user to drag the bottom edge to make the textarea taller. Disables horizontal resizing to prevent layout breaking.
- `line-height: 1.6` — Sets the space between lines of text inside the textarea (1.6× the font size).

---

## 3. The JavaScript Logic (Line-by-Line)

The contact page's JavaScript is loaded from shared scripts (`auth.js`, `nav.js`) plus any form submission handling.

### Shared Scripts Loaded
```html
<script src="js/auth.js"></script>
<script src="js/nav.js"></script>
```
- `auth.js` — Loads first. Defines `getCurrentUser()` and session logic. Used by `nav.js`.
- `nav.js` — Runs second. Finds the active navigation link, sets up dark mode toggle, and conditionally shows the Sign In button or user greeting.

### Form Submit Simulation (Optional Enhancement)
If a JavaScript form handler were added, it would look like this:
```javascript
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields before sending.');
        return;
    }

    alert('Thank you! Your message has been sent successfully.');
    this.reset();
});
```
- `e.preventDefault()` — Stops the `mailto:` form from opening the email client.
- `.trim()` — Removes spaces from both ends of the user's input.
- `!name || !email || ...` — Validation: fails if ANY field is empty.
- `alert('...')` — Shows the browser's built-in popup dialog.
- `this.reset()` — `this` refers to the form element itself. `.reset()` is a built-in method that clears all inputs back to their default values.

### How nav.js Interacts with This Page
Even though `contact.html` has no page-specific JavaScript, `nav.js` still runs on it and does important work:
1. Reads `window.location.pathname` to identify we are on `contact.html`.
2. Finds `<a href="contact.html">Contact</a>` in the nav links and adds the `active` CSS class, turning it gold.
3. Reads `localStorage` for `darkMode` preference and applies `data-mode="dark"` to the `<body>` if needed.
4. Reads `getCurrentUser()` and hides the Sign In button, replacing it with "Hi, [Name]" if a user is logged in.

---

## 4. Interaction Summary

"My section provides the project's user communication interface. **HTML** uses semantic form elements (`<form>`, `<label>`, `<input>`, `<textarea>`) with accessibility attributes (`for`/`id` label linking, `autocomplete` hints) and a `mailto:` fallback for environments without JavaScript. The page-specific CSS is embedded in a `<style>` block for simplicity, using **CSS Flexbox** (`flex-direction: column`) to stack form groups vertically with consistent `gap` spacing. Input styling uses `width: 100%` with `outline: none` and custom focus states via `border-color: var(--accent)` for a consistent premium look. **JavaScript** from the shared `nav.js` file handles active link highlighting and dark mode persistence, while an optional submit handler can prevent the default `mailto:` behavior, perform client-side validation, display a success alert, and reset the form with `this.reset()`."
