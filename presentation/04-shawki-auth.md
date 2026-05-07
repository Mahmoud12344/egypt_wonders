# 04. The Authentication System (Deep Dive)
**Developer:** Shawki
**Core Files:** `auth.html`, `css/auth.css`, `js/auth.js`

This document is a comprehensive, line-by-line textbook explaining every piece of code in the Authentication page. Because this project has no backend server, all user data is simulated using the browser's `localStorage`.

---

## 1. The HTML Structure (Line-by-Line)

### The Watermark & Main Container
```html
<div class="bg-watermark" aria-hidden="true">EGYPT</div>

<main class="auth-page">
    <div class="auth-card"> ... </div>
</main>
```
- `<div class="bg-watermark">EGYPT</div>` — A large decorative background word. Has no interactivity.
- `aria-hidden="true"` — Tells screen readers (accessibility tools for blind users) to skip this element entirely since it is purely visual.
- `<main class="auth-page">` — The `<main>` tag semantically marks the primary content. The `auth-page` class tells CSS to center everything inside it.

### The Tab Buttons
```html
<div class="auth-tabs" role="tablist">
    <button class="auth-tab active" id="tab-login"
            data-target="panel-login" aria-selected="true">
        Sign In
    </button>
    <button class="auth-tab" id="tab-signup"
            data-target="panel-signup" aria-selected="false">
        Sign Up
    </button>
</div>
```
- `role="tablist"` / `role="tab"` — ARIA accessibility attributes that tell screen readers these are tabs, not ordinary buttons.
- `class="auth-tab active"` — The Sign In button starts with `active` because the login panel is shown by default.
- `data-target="panel-login"` — A custom HTML attribute (prefixed `data-` to avoid conflicts). JavaScript reads this to know which panel to reveal.

### The Login Panel
```html
<div class="auth-panel visible" id="panel-login">
    <form class="auth-form" id="form-login" novalidate>

        <div class="auth-form-group">
            <label class="auth-label" for="login-email">Email Address</label>
            <input class="auth-input" type="email" id="login-email"
                   placeholder="your@email.com" autocomplete="email" required>
        </div>

        <div class="auth-form-group">
            <label class="auth-label" for="login-password">Password</label>
            <input class="auth-input" type="password" id="login-password"
                   placeholder="Your password" autocomplete="current-password" required>
        </div>

        <button class="btn-solid auth-submit" type="submit">Sign In →</button>
    </form>
    <div class="auth-message" id="msg-login" role="alert"></div>
</div>
```
- `class="auth-panel visible"` — The `visible` class makes this panel show. The Sign Up panel lacks this class, so CSS hides it.
- `novalidate` — Disables the browser's default ugly error popups. Our JavaScript handles all validation instead.
- `<label for="login-email">` — Links this label to the `id="login-email"` input. Clicking the label focuses the input.
- `type="email"` — Browser shows email keyboard on mobile and applies email format validation.
- `type="password"` — Automatically masks characters as dots `●●●●`.
- `placeholder="..."` — Hint text inside the empty input box, disappears when typing starts.
- `autocomplete="email"` — Hints to the browser's autofill what data type this is.
- `required` — Since we use `novalidate`, our JS enforces this, but it signals the intent.
- `type="submit"` — This button triggers the form's `submit` event when clicked or Enter is pressed.
- `role="alert"` — The feedback `<div>`. When its text changes, screen readers automatically announce it.

---

## 2. The CSS Styling (Line-by-Line)

### Centering the Card
```css
.auth-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-main);
    padding: var(--space-lg) var(--space-md);
}
```
- `min-height: 100vh` — `vh` = viewport height. `100vh` = the full screen height. Without this, the flex centering has no height to center within.
- `display: flex` — Activates Flexbox layout system.
- `flex-direction: column` — Children stack vertically.
- `align-items: center` — Horizontally centers children inside a column flex container.
- `justify-content: center` — Vertically centers children inside a column flex container.
- `var(--bg-main)` — Reads the CSS variable set in `global.css`. Automatically adapts to light/dark mode.

### The Glassmorphism Card
```css
.auth-card {
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--space-xl) var(--space-xl);
    width: 100%;
    max-width: 520px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.1);
}
```
- `rgba(255, 255, 255, 0.55)` — White (255,255,255) at 55% opacity. The transparency lets the background bleed through.
- `backdrop-filter: blur(20px)` — Blurs everything *behind* the card by 20 pixels. This combined with the transparency creates the "frosted glass" effect.
- `-webkit-backdrop-filter` — Same rule with a Safari browser prefix. Some CSS features need vendor prefixes for specific browsers.
- `max-width: 520px` — The card never grows wider than 520px. On mobile (`width: 100%`), it fills the screen.
- `box-shadow: 0 24px 60px rgba(0,0,0,0.1)` — `0` horizontal, `24px` below, `60px` blur radius, 10% black. Creates a soft shadow under the card to lift it off the background.

### Showing and Hiding Panels
```css
.auth-panel { display: none; }
.auth-panel.visible { display: block; }
```
- `display: none` — Completely hides the element. It takes up no space on the page.
- `.auth-panel.visible` — This CSS rule only activates on elements that have **both** classes. When JavaScript adds `visible`, CSS immediately shows it.

### The Active Tab
```css
.auth-tab.active {
    background: var(--text-main);
    color: #FDFBF7 !important;
}
```
- `background: var(--text-main)` — In light mode, `--text-main` is near-black, creating a dark pill for the active tab.
- `color: #FDFBF7 !important` — Hardcoded light text to ensure readability over the dark background. `!important` overrides any other conflicting CSS rules.

### Error/Success Messages
```css
.auth-message { display: none; }
.auth-message.visible { display: block; }
.auth-message.error {
    background: rgba(220, 53, 69, 0.1);
    color: #c0392b;
    border: 1px solid rgba(220, 53, 69, 0.25);
}
.auth-message.success {
    background: rgba(39, 174, 96, 0.1);
    color: #27ae60;
    border: 1px solid rgba(39, 174, 96, 0.25);
}
```
- Hidden by default. JavaScript adds `visible` + `error` or `success` class.
- `rgba(220, 53, 69, 0.1)` — A faint red background (10% opacity) for the error state.
- The combination of classes means one `<div>` can display as green or red, depending on context.

---

## 3. The JavaScript Logic (Line-by-Line)

### `auth.js` — The Data Layer

#### getUsers()
```javascript
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
```
- `localStorage.getItem('users')` — Reads the text string stored under the key `'users'`. Returns `null` if nothing is saved yet.
- `|| '[]'` — If the result is `null` (falsy), use the string `'[]'` instead. This represents an empty array.
- `JSON.parse(...)` — Converts the stored JSON text back into a real JavaScript array.

#### saveUsers()
```javascript
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
```
- `JSON.stringify(users)` — Converts the JavaScript array into a JSON text string because `localStorage` can only store strings.
- `localStorage.setItem('users', ...)` — Saves the text string with the key `'users'`.

#### getCurrentUser()
```javascript
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}
```
- Called by `nav.js` on every page to check if a user is logged in.
- Returns a user object `{ name, email }` if logged in, or `null` if not.

#### signUp() — Step by Step
```javascript
function signUp(name, email, password, confirmPassword) {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
        return { success: false, message: 'Please fill in all fields.' };
    }
    if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match.' };
    }
    if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
    }
    if (!email.includes('@') || !email.includes('.')) {
        return { success: false, message: 'Please enter a valid email address.' };
    }
    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = { name: name.trim(), email: email.toLowerCase().trim(), password };
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem('currentUser', JSON.stringify({ name: newUser.name, email: newUser.email }));
    return { success: true, message: 'Account created! Welcome to Egypt Wonders.' };
}
```
- `return { success: false, message: '...' }` — Returns a "Result Object" so the caller can check `result.success` and show `result.message`.
- `.trim()` — Removes leading/trailing spaces. `!name.trim()` is `true` if the trimmed string is empty.
- `password !== confirmPassword` — `!==` means "not exactly equal". Fails if the two passwords differ.
- `.find(u => u.email.toLowerCase() === email.toLowerCase())` — Searches the users array for a matching email (case-insensitively).
- `users.push(newUser)` — Adds the new user to the end of the array.
- We store only `name` and `email` in `currentUser` — **not the password** — for basic security.

#### signIn() — Step by Step
```javascript
function signIn(email, password) {
    if (!email.trim() || !password) {
        return { success: false, message: 'Please enter your email and password.' };
    }
    const users = getUsers();
    const matchedUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase().trim()
             && u.password === password
    );
    if (!matchedUser) {
        return { success: false, message: 'Incorrect email or password.' };
    }
    localStorage.setItem('currentUser', JSON.stringify({
        name: matchedUser.name,
        email: matchedUser.email
    }));
    return { success: true, message: `Welcome back, ${matchedUser.name}!` };
}
```
- `.find(u => ... && ...)` — Checks BOTH conditions must be true: email must match AND password must match.
- `!matchedUser` — If `.find()` found nothing, it returns `undefined`. `!undefined` is `true`, so we return an error.
- `` `Welcome back, ${matchedUser.name}!` `` — Template literal. The `${}` injects the actual user's name into the message string.

### UI Controller (Inside `auth.html`)

#### Redirect if Already Logged In
```javascript
if (getCurrentUser()) {
    window.location.href = 'index.html';
}
```
- If a logged-in user visits the auth page, they are immediately redirected home.

#### The Form Submit Handler
```javascript
document.getElementById('form-login').addEventListener('submit', function(event) {
    event.preventDefault();

    const email    = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const msgEl    = document.getElementById('msg-login');

    const result = signIn(email, password);

    if (result.success) {
        showMessage(msgEl, result.message, 'success');
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showMessage(msgEl, result.message, 'error');
    }
});
```
- `event.preventDefault()` — Cancels the browser's default form submit behavior (page reload).
- `.value` — Reads the text the user typed.
- `setTimeout(..., 1000)` — Waits 1 second (1000ms) before navigating, letting the user read the success message.
- `window.location.href = 'index.html'` — Navigates the browser to the home page.

---

## 4. Interaction Summary

"My section builds a complete frontend authentication system. **HTML** provides two form panels, controlled by tab buttons with custom `data-target` attributes linking them to their panels. **CSS** hides both panels by default (`display: none`) and shows only the active one using a `.visible` toggle class; the glassmorphism card is built with `rgba` transparency and `backdrop-filter: blur()`. **JavaScript** in `auth.js` uses `localStorage` as a pseudo-database, converting arrays with `JSON.stringify()` for storage and `JSON.parse()` for retrieval, while performing layered validation (empty fields, password match, length, email format, duplicate check) before creating a session. The `switchTab()` UI controller resets all tabs/panels to inactive, then activates the clicked one using `data-target`. Form submissions are intercepted with `event.preventDefault()`, delegated to the data functions, and results shown via dynamically styled feedback messages."
