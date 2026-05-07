# 05. The Community Blog System (Deep Dive)
**Developer:** Ahmad Salah
**Core Files:** `blog.html` (includes inline `<style>`), `js/blog.js`

This document is a comprehensive, line-by-line textbook explaining every piece of code on the Blog page. The page has TWO distinct sections: hardcoded editorial posts (static HTML) and a user-powered community wall (JavaScript + localStorage).

> **Why is CSS inside the HTML file?** Because this page has a small and self-contained style. The blog-specific styles are in a `<style>` block directly in the `<head>`. This avoids creating a whole new `.css` file for a few rules. `global.css` still handles colors, fonts, and the nav.

---

## 1. The HTML Structure (Line-by-Line)

### The Inline `<style>` Block
```html
<head>
    <link rel="stylesheet" href="css/global.css?v=6">
    <style>
        /* Blog-specific styles live here */
        .blog-header { ... }
        .blog-grid { ... }
        .blog-card { ... }
    </style>
</head>
```
- `<link rel="stylesheet" href="css/global.css?v=6">` — Loads the shared design system first (CSS variables, fonts, nav styles).
- `<style>` — A tag that allows writing CSS directly inside the HTML file. Styles here apply only to this page and are loaded with it, requiring no extra HTTP request.

### The Blog Page Header
```html
<header class="blog-header">
    <h1>Stories from the Nile</h1>
    <p>History, travel insights, and discoveries from Egypt's most extraordinary places.</p>
</header>
```
- `<header>` — Semantic HTML. Used here as a section header (not the site nav). Contains a title and subtitle for the blog section.
- `<h1>` — The most important heading on the page. There is only one per page.

### The Editorial Blog Cards (Static HTML)
```html
<div class="blog-grid">
    <article class="blog-card">
        <img class="blog-card-img"
             src="assets/images/Great_Pyramid_of_Giza/1.jpg"
             alt="Inside the Great Pyramid"
             loading="lazy">
        <div class="blog-card-body">
            <span class="blog-card-date">April 2026</span>
            <h2 class="blog-card-title">Inside Khufu's Pyramid: What the Builders Left Behind</h2>
            <p class="blog-card-excerpt">
                Walking through the Grand Gallery, the narrow shafts still echo...
            </p>
        </div>
    </article>
    <!-- 3 more articles ... -->
</div>
```
- `<div class="blog-grid">` — A CSS Grid container. The CSS inside the `<style>` block defines its column layout.
- `<article class="blog-card">` — `<article>` is the correct semantic tag for a self-contained piece of content (a blog post). Using `<div>` here would work visually, but `<article>` tells browsers and screen readers this is a standalone, meaningful post.
- `loading="lazy"` — Blog images are below the fold. `lazy` tells the browser not to download them until the user scrolls near them, improving initial page load speed.
- `<span class="blog-card-date">` — A `<span>` for the date. Used instead of `<time>` here, but `<time datetime="2026-04">April 2026</time>` would be even more semantic.
- `<h2 class="blog-card-title">` — A secondary heading (below the page's `<h1>`).
- `<p class="blog-card-excerpt">` — The preview text for the article.

### The Community Section
```html
<section class="community-section" id="community-section">

    <header class="blog-header" style="margin-top: var(--space-xxl);">
        <h2>Community Voices</h2>
        <p>Share your experiences, travel tips, and memories from Egypt.</p>
    </header>

    <!-- Post Creation Form -->
    <div class="community-form-box">
        <form id="community-form" novalidate>

            <!-- Name is hidden if logged in -->
            <div class="form-group" id="name-group">
                <input class="form-input" type="text"
                       id="post-name" placeholder="Your name">
            </div>

            <div class="form-group">
                <textarea class="form-input" id="post-content"
                          rows="4" placeholder="Write your experience...">
                </textarea>
            </div>

            <button class="btn-solid btn-black" type="submit" id="btn-post">
                Post
            </button>
        </form>
        <div id="post-message" class="form-message" role="alert"></div>
    </div>

    <!-- Grid for User Posts -->
    <div class="blog-grid" id="community-posts">
        <!-- Posts will be injected here by blog.js -->
    </div>

</section>
```
- `<section id="community-section">` — A dedicated section for the user-generated content. The `id` allows linking directly to it with `#community-section` in a URL.
- `style="margin-top: var(--space-xxl);"` — An inline style for a one-off spacing adjustment. This separates the editorial section from the community section visually.
- `id="community-form"` — JavaScript attaches a submit listener to this ID.
- `novalidate` — Disables browser-native error popups. JavaScript handles all validation.
- `id="name-group"` — The entire name input `<div>` has this ID so JavaScript can hide it (`style.display = 'none'`) when a user is already logged in.
- `type="text" id="post-name"` — A single-line text input for the poster's name.
- `<textarea id="post-content" rows="4">` — A multi-line input. `rows="4"` sets its initial height. Note: `<textarea>` has its own closing tag `</textarea>` unlike `<input>`.
- `</textarea>` — Must be on its own line with no content between it and the opening tag, or the empty line becomes the default text.
- `class="btn-solid btn-black"` — Two classes. `btn-solid` is from `global.css` (base button style). `btn-black` overrides it to be black.
- `type="submit"` — Clicking triggers the form's `submit` event.
- `role="alert"` — When JavaScript changes the text here (success or error), screen readers automatically announce it.
- `id="community-posts"` — An empty `<div>` where JavaScript injects post cards.

### Script Loading Order
```html
<script src="js/auth.js"></script>
<script src="js/nav.js"></script>
<script src="js/blog.js"></script>
```
- `auth.js` loads first — defines `getCurrentUser()`.
- `nav.js` loads second — handles active link and dark mode.
- `blog.js` loads last — waits for `DOMContentLoaded` before accessing any HTML elements.

---

## 2. The CSS Styling (Line-by-Line)

All blog CSS is in the inline `<style>` block in the `<head>`.

### The Blog Header
```css
.blog-header {
    padding: var(--space-lg) 0;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: var(--space-xl);
}

.blog-header h1 {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4vw, 2.8rem);
    margin-bottom: var(--space-xs);
}

.blog-header p {
    font-size: 1rem;
    color: var(--text-muted);
    font-weight: 300;
}
```
- `border-bottom: 1px solid var(--border-color)` — A horizontal separator line below the header.
- `font-family: var(--font-heading)` — Uses Playfair Display (the serif font defined in `global.css`).
- `clamp(2rem, 4vw, 2.8rem)` — Fluid typography: the font scales with the screen width (`4vw` = 4% of viewport width) but never goes below `2rem` or above `2.8rem`.
- `font-weight: 300` — A light/thin font weight for the subtitle paragraph.

### The Blog Grid
```css
.blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
}
```
- `display: grid` — Activates CSS Grid layout.
- `repeat(auto-fill, minmax(300px, 1fr))` — Creates as many columns as will fit. Each column is at least 300px wide but can grow. On wide screens: 3–4 columns. On phones: 1 column. This is fully responsive with NO media queries.
- `gap: var(--space-lg)` — Consistent spacing between all cards.

### The Blog Card
```css
.blog-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
}

.blog-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    border-color: var(--accent);
}
```
- `overflow: hidden` — The blog card image has no `border-radius`, but the card does. `overflow: hidden` clips the image to the card's rounded corners.
- `transition: transform ..., box-shadow ..., border-color ...` — All three properties will animate smoothly when they change (on hover).
- `.blog-card:hover { transform: translateY(-3px) }` — Lifts the card up 3px on hover. The shadow deepens and the border turns gold, reinforcing the 3D "lifting" effect.

### Blog Card Image
```css
.blog-card-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
}
```
- `height: 180px` — A fixed height ensures all editorial card images are the same size regardless of original dimensions.
- `object-fit: cover` — Crops and zooms the image to fill the 180px box without stretching.

### Blog Card Date
```css
.blog-card-date {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--accent);
    font-weight: 600;
    display: block;
}
```
- `display: block` — `<span>` is normally inline (sits next to text). `display: block` forces it to take its own full line.
- `color: var(--accent)` — The date text shows in the golden accent color.
- `letter-spacing: 1.5px` — Spreads letters apart for a premium look on uppercase text.

### Community Form Box & Inputs
```css
.community-form-box {
    background: #FFFFFF;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: var(--space-lg);
    max-width: 600px;
    margin: 0 auto var(--space-xl) auto;
}

.form-input {
    width: 100%;
    padding: 12px 15px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-family: var(--font-body);
    font-size: 1rem;
    box-sizing: border-box;
    background: #FFFFFF;
    color: var(--text-main);
    outline: none;
    transition: border-color var(--transition);
}

.form-input:focus {
    border-color: #888;
}
```
- `background: #FFFFFF` — Solid white, matching the user's requested form style.
- `max-width: 600px; margin: 0 auto` — Centers the form box at a maximum width.
- `box-sizing: border-box` — **Critical!** Without this, `padding` is added on TOP of `width: 100%`, causing the input to overflow. `border-box` includes padding inside the width calculation.
- `outline: none` — Removes the browser's default blue glow on focus.
- `.form-input:focus { border-color: #888 }` — Our custom focus indicator: a darker grey border.

### The Black Button
```css
.btn-black {
    width: 100%;
    padding: 14px;
    background: #222 !important;
    color: #FFF !important;
    border: none !important;
    border-radius: 6px !important;
    cursor: pointer;
}

.btn-black:hover {
    background: #000 !important;
}
```
- `!important` — Overrides rules from `btn-solid` class that would otherwise apply.
- `background: #222` — Very dark grey, close to black.
- `width: 100%` — Stretches across the full form width.

---

## 3. The JavaScript Logic (Line-by-Line)

### Initialization with DOMContentLoaded
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // All code lives inside here
    const form         = document.getElementById('community-form');
    const nameInput    = document.getElementById('post-name');
    const nameGroup    = document.getElementById('name-group');
    const contentInput = document.getElementById('post-content');
    const postsDiv     = document.getElementById('community-posts');
    const msgEl        = document.getElementById('post-message');

    let posts = [];

    init();
});
```
- `document.addEventListener('DOMContentLoaded', ...)` — JavaScript runs immediately when a `<script>` tag is parsed. But the HTML elements (like `#community-form`) may not yet exist. `DOMContentLoaded` fires only when the HTML is fully parsed, guaranteeing the elements exist.
- The `const` lines at the top "cache" the DOM references — find each element ONCE and store it in a variable. This is more efficient than calling `getElementById` repeatedly inside functions.
- `let posts = []` — The in-memory array of post objects. `let` is used instead of `const` because we reassign it from `localStorage`.

### The init() Function
```javascript
function init() {
    const saved = localStorage.getItem('community_posts');
    if (saved) {
        posts = JSON.parse(saved);
    }

    if (typeof getCurrentUser === 'function') {
        const user = getCurrentUser();
        if (user) {
            nameInput.value = user.name;
            nameGroup.style.display = 'none';
        }
    }

    renderPosts();
}
```
- `localStorage.getItem('community_posts')` — Reads the stored JSON string. Returns `null` if no posts have been saved yet.
- `JSON.parse(saved)` — Converts the JSON text string back into a JavaScript array of post objects.
- `typeof getCurrentUser === 'function'` — `typeof` is a JavaScript operator that returns the type of a value as a string. If `auth.js` didn't load, `getCurrentUser` would be `undefined`, not `'function'`. This prevents a crash.
- `nameInput.value = user.name` — Pre-fills the name input field with the logged-in user's name.
- `nameGroup.style.display = 'none'` — Hides the entire `#name-group` `<div>` (label + input) using inline CSS.
- `renderPosts()` — Immediately draws all saved posts to the screen.

### The renderPosts() Function
```javascript
function renderPosts() {
    if (!postsDiv) return;

    postsDiv.innerHTML = '';

    if (posts.length === 0) {
        postsDiv.innerHTML = '<p style="...">No community posts yet. Be the first to share!</p>';
        return;
    }

    posts.forEach((post, index) => {
        const cardHTML = `
            <article class="blog-card community-card">
                <div class="blog-card-body" style="height: 100%; display: flex; flex-direction: column;">

                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-xs);">
                        <span class="blog-card-date">${post.date}</span>
                        <div class="community-actions">
                            <button onclick="likePost(${index})" aria-label="Like post">
                                <span>👍</span> ${post.likes}
                            </button>
                            <button onclick="deletePost(${index})" aria-label="Delete post">
                                🗑️
                            </button>
                        </div>
                    </div>

                    <h2 class="blog-card-title" style="...">${escapeHTML(post.name)}</h2>
                    <p class="blog-card-excerpt" style="flex-grow: 1; white-space: pre-wrap;">${escapeHTML(post.content)}</p>
                </div>
            </article>
        `;
        postsDiv.insertAdjacentHTML('beforeend', cardHTML);
    });
}
```
- `postsDiv.innerHTML = ''` — Clears the grid before re-rendering. This prevents duplicate cards appearing.
- `posts.length === 0` — Checks if the array has no items. If true, shows the empty state message and exits early with `return`.
- `posts.forEach((post, index) => {...})` — Iterates through every post. `post` = the post object, `index` = its array position (0, 1, 2...).
- Template literals `` `...` `` — Multi-line strings that allow `${expression}` injection.
- `onclick="likePost(${index})"` — Embeds the index number directly into the button's click handler. When clicked in the browser, this calls e.g. `likePost(0)`.
- `${escapeHTML(post.name)}` — The post's text is sanitized before being inserted into the HTML. This prevents XSS attacks.
- `white-space: pre-wrap` — Preserves newline characters in the post content, so multi-line posts render correctly.
- `postsDiv.insertAdjacentHTML('beforeend', cardHTML)` — Appends the card HTML at the end of the posts container without destroying existing DOM events.

### Adding a New Post
```javascript
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = nameInput.value.trim();
    const content = contentInput.value.trim();

    if (!name || !content) {
        showMessage('Please fill out both your name and your experience.', 'error');
        return;
    }

    const newPost = {
        name:    name,
        content: content,
        likes:   0,
        date:    new Date().toLocaleDateString('en-US', {
                     month: 'short', day: 'numeric', year: 'numeric'
                 })
    };

    posts.unshift(newPost);
    savePosts();
    renderPosts();

    contentInput.value = '';
    if (nameGroup.style.display !== 'none') {
        nameInput.value = '';
    }

    showMessage('Your experience has been shared!', 'success');
});
```
- `e.preventDefault()` — Stops the form from doing its default action (reloading the page).
- `.trim()` — Removes spaces from both ends.
- `!name` — An empty string `""` is "falsy" in JavaScript. `!"" === true`, so this condition fails if the name is empty.
- `new Date()` — Creates a Date object for the current moment.
- `.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})` — Formats to e.g. `"May 7, 2026"`.
- `posts.unshift(newPost)` — `.unshift()` adds the new post at the BEGINNING of the array (position 0). This means the newest post appears first.
- `savePosts()` — Calls our helper to save the updated array to `localStorage`.
- `renderPosts()` — Immediately re-draws the grid with the new post at the top.
- `if (nameGroup.style.display !== 'none')` — Only clears the name input if it's visible (i.e., not logged in).

### Like and Delete
```javascript
window.likePost = function(index) {
    posts[index].likes++;
    savePosts();
    renderPosts();
};

window.deletePost = function(index) {
    if (confirm("Are you sure you want to delete this post?")) {
        posts.splice(index, 1);
        savePosts();
        renderPosts();
    }
};
```
- `window.likePost = ...` — Attaches the function to the global `window` object. This is required because `onclick="likePost(0)"` in the generated HTML runs in the global scope. A regular `function` inside `DOMContentLoaded` would not be accessible from there.
- `posts[index].likes++` — Square bracket notation accesses the post at `index`. `++` increments the `likes` property by 1.
- `confirm("...")` — Shows a browser dialog. Returns `true` (user clicked OK) or `false` (user clicked Cancel).
- `posts.splice(index, 1)` — `.splice(startIndex, deleteCount)`. Removes exactly `1` element starting at `index`.

### The savePosts() Helper
```javascript
function savePosts() {
    localStorage.setItem('community_posts', JSON.stringify(posts));
}
```
- `JSON.stringify(posts)` — Converts the JavaScript array into a JSON-formatted text string. `localStorage` cannot store arrays directly, only strings.
- `localStorage.setItem('community_posts', ...)` — Saves the string permanently under the key `'community_posts'`.

### The escapeHTML() Security Function
```javascript
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
```
- **Why is this critical?** Without this, if a user types `<script>alert('hacked')</script>` in the post box, and we use `.innerHTML` to render it, the browser would actually EXECUTE that script. This is called an XSS (Cross-Site Scripting) attack.
- `/[&<>'"]/g` — A Regular Expression (regex). The `/g` flag means "global" — replace ALL matches, not just the first. It matches the characters `&`, `<`, `>`, `'`, `"`.
- The object `{'&': '&amp;', '<': '&lt;', ...}` — A lookup map. `'<'` maps to the safe HTML entity `'&lt;'`. Browsers display `&lt;` as a literal `<` character but never parse it as the start of an HTML tag.

### The showMessage() Helper
```javascript
function showMessage(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = 'form-message visible ' + type;

    setTimeout(() => {
        msgEl.classList.remove('visible', 'error', 'success');
        msgEl.textContent = '';
    }, 3000);
}
```
- `msgEl.textContent = text` — Sets the visible text content.
- `msgEl.className = 'form-message visible ' + type` — Replaces ALL classes on the element with a new set. `type` is `'error'` or `'success'`, controlling the CSS color.
- `setTimeout(() => {...}, 3000)` — After 3 seconds (3000ms), removes the classes and clears the text, hiding the message automatically.

---

## 4. Interaction Summary

"My section delivers a hybrid static + dynamic blog page. **HTML** uses `<article>` tags for semantic editorial posts and a `<section>` for the community area, with an empty `<div id='community-posts'>` acting as the injection target. CSS is embedded in a `<style>` block — the `blog-grid` uses `repeat(auto-fill, minmax(300px, 1fr))` for automatic responsive columns, `overflow: hidden` on cards clips images to rounded corners, and the `btn-black` class uses `!important` to override base button styles. **JavaScript** wraps everything in `DOMContentLoaded` to wait for HTML parsing. On init, it loads posts from `localStorage` using `JSON.parse()` and checks `typeof getCurrentUser === 'function'` before calling it (protecting against `auth.js` not being loaded). New posts use `.unshift()` to appear first, and after every mutation the array is `JSON.stringify()`-ed back to `localStorage`. Like/delete functions live on `window` to be accessible from inline `onclick` handlers in generated HTML. All user text passes through `escapeHTML()` before `innerHTML` insertion, preventing XSS attacks."
