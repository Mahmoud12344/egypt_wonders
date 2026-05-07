# Authentication System Tutorial — `auth.html`, `js/auth.js`, `css/auth.css`

> **What is this feature?** This is an exhaustive, beginner-friendly tutorial explaining the Login and Sign-Up system. Because our project has no backend server, we simulate a user database using the browser's own built-in storage. This feature has three files that work together.

---

## 1. The Data Storage (How We Remember Users Without a Server)

Normally, a website stores user accounts in a server database (like MySQL or MongoDB). Since we have no server, we use **`localStorage`** — a key-value storage system built directly into every web browser.

Think of `localStorage` like a mini filing cabinet that lives inside the user's browser on their own computer.

### How We Store Data

We use two "drawers" in this cabinet:

| Key | Value | Purpose |
|:---|:---|:---|
| `"users"` | A list of all accounts | The full "user database" |
| `"currentUser"` | The logged-in user's info | The active "session" |

**Important limitation:** `localStorage` can only store text. It cannot store a JavaScript list (Array) or object directly. So we always use two tools:
- **`JSON.stringify(...)`** — Converts a real JavaScript object/array INTO a text string before saving.
- **`JSON.parse(...)`** — Converts the saved text string BACK INTO a real JavaScript object/array when reading.

---

## 2. `js/auth.js` — The Logic Engine

This JavaScript file exposes four functions that the rest of the project can use.

### `getUsers()` — Read the user list
```javascript
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
```
* **`localStorage.getItem('users')`**: Looks inside the browser's storage and gets whatever text is saved under the label `'users'`.
* **`|| '[]'`**: The `||` means "OR". If `getItem` returns `null` (nothing was saved yet because no one has signed up), we use `'[]'` instead, which is an empty list in JSON text form.
* **`JSON.parse(...)`**: Turns the text into a real JavaScript array we can use.

### `getCurrentUser()` — Check who is logged in
```javascript
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}
```
* Works exactly like `getUsers()`. Returns the logged-in user object, or `null` if nobody is logged in.
* This function is called by `nav.js` on every single page to decide whether to show "Sign In" or "Hi, Ahmed".

### `signUp(name, email, password, confirmPassword)` — Create a new account
```javascript
function signUp(name, email, password, confirmPassword) {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
        return { success: false, message: 'Please fill in all fields.' };
    }
```
* **`!name.trim()`**: The `!` means "NOT". `.trim()` removes empty spaces. So this checks: "Is the name empty (or only spaces)?"
* **`return { success: false, message: '...' }`**: Instead of crashing, the function returns an object with two pieces of information: `success` (true or false) and a `message` to show the user. The caller (our HTML form) decides what to do with this.

```javascript
    if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match.' };
    }
    if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
    }
```
* **`!==`**: The "strictly not equal to" operator. If the two passwords are different, we reject it.
* **`.length`**: Every string in JavaScript has a `.length` property that tells us how many characters it has.

```javascript
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return { success: false, message: 'An account with this email already exists.' };
    }
```
* **`.find(u => ...)`**: This loops through our `users` array. For each user `u`, it checks if the email matches. If it finds one, it returns that user. If not, it returns `undefined`.
* **`.toLowerCase()`**: Makes both emails lowercase before comparing so `Ahmed@gmail.com` and `ahmed@gmail.com` are treated as the same!

```javascript
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem('currentUser', JSON.stringify({ name: newUser.name, email: newUser.email }));
    return { success: true, message: 'Account created! Welcome.' };
}
```
* **`.push(newUser)`**: Adds the new user object to the END of our users array list.
* **`saveUsers(users)`**: Saves the updated list back to localStorage.
* **`localStorage.setItem('currentUser', ...)`**: Automatically logs the user in right after signing up. Notice we only save `name` and `email`, NOT the password in the session!

### `signIn(email, password)` — Log in
```javascript
const matchedUser = users.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim()
         && u.password === password
);
```
* **`&&`**: The "AND" operator. BOTH conditions must be true — the email AND the password must match.
* If `matchedUser` is `undefined` (nothing found), the credentials are wrong.

### `signOut()` — Log out
```javascript
function signOut() {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
}
```
* **`localStorage.removeItem('currentUser')`**: Deletes the active session from the browser's storage. The user is now logged out.
* **`window.location.href = 'auth.html'`**: This forces the browser to immediately navigate to the login page.

---

## 3. `auth.html` — The Login/Sign-Up Page

### The Two-Panel Tab Card
The page has one glassmorphism card with two panels inside it. Only one panel is visible at a time. A JavaScript function called `switchTab()` shows/hides them.

```html
<div class="auth-tabs">
    <button class="auth-tab active" id="tab-login" data-target="panel-login">Sign In</button>
    <button class="auth-tab"        id="tab-signup" data-target="panel-signup">Sign Up</button>
</div>
```
* **`data-target`**: A custom HTML attribute we invented! It stores the ID of the panel this button should activate. JavaScript reads this with `.getAttribute('data-target')`.

```html
<div class="auth-panel visible" id="panel-login"> ... </div>
<div class="auth-panel"         id="panel-signup"> ... </div>
```
* **`.visible`** class is toggled by JavaScript. The CSS says `display: none` by default and `display: block` when `.visible` is present.

### The Tab Switching Logic
```javascript
function switchTab(targetTabId) {
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-panel').forEach(panel => panel.classList.remove('visible'));
    const clickedTab = document.getElementById(targetTabId);
    clickedTab.classList.add('active');
    document.getElementById(clickedTab.getAttribute('data-target')).classList.add('visible');
}
```
* **Step 1**: Remove `.active` from ALL tabs (reset everyone).
* **Step 2**: Remove `.visible` from ALL panels (hide everyone).
* **Step 3**: Add `.active` only to the clicked tab.
* **Step 4**: Use `data-target` to find the matching panel and add `.visible` to it.

### Redirecting Logged-In Users
```javascript
if (getCurrentUser()) {
    window.location.href = 'index.html';
}
```
* The very first thing the page does when it loads: if a user is already logged in (there is a `currentUser` in storage), it immediately kicks them to the home page. There is no reason for a logged-in user to see the login form!

### Handling Form Submission
```javascript
document.getElementById('form-login').addEventListener('submit', function(event) {
    event.preventDefault();
```
* **`addEventListener('submit', ...)`**: Listens for when the user clicks the "Sign In" button.
* **`event.preventDefault()`**: A form's default behavior when submitted is to reload the page! We prevent this so our JavaScript can handle the submission cleanly without a reload.

---

## 4. `css/auth.css` — The Styling

### Centering the Card on Screen
```css
.auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
```
* **`min-height: 100vh;`**: `vh` = Viewport Height. Forces the background to fill 100% of the screen height.
* **`display: flex; align-items: center; justify-content: center;`**: This is the classic CSS trick for centering a child element both vertically and horizontally on the screen.

### The Glassmorphism Card
```css
.auth-card {
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    max-width: 440px;
}
```
* Same glassmorphism technique as the contributor cards on the About page. `rgba` = semi-transparent white + `backdrop-filter: blur()` = frosted glass effect over the background watermark.

### The Pill Tab Buttons
```css
.auth-tabs {
    display: flex;
    background: var(--bg-card);
    border-radius: 50px;
    padding: 4px;
}
.auth-tab.active {
    background: var(--text-main);
    color: var(--bg-main);
}
```
* The outer `.auth-tabs` container has `border-radius: 50px` making it a full pill shape.
* Each `.auth-tab` button also has `border-radius: 50px` to curve inside the container.
* The `.active` tab gets inverted colors (black background, white text), making it look selected.

---

## 5. Changes to `js/nav.js` (Part 4)

### The Session-Aware Button
`nav.js` now has a new Part 4 at the bottom. After every page loads, it calls `getCurrentUser()` and injects the correct HTML into the nav bar:

```javascript
if (typeof getCurrentUser === 'function') {
    const user = getCurrentUser();
    if (!user) {
        // inject "Sign In" link
    } else {
        // inject "Hi, FirstName" + "Sign Out" button
    }
}
```
* **`typeof getCurrentUser === 'function'`**: Before trying to call `getCurrentUser()`, we check it actually exists. This prevents errors if `auth.js` failed to load on a page.
* **`document.createElement('a')`**: Creates a brand new `<a>` HTML element entirely in JavaScript, without touching any HTML file!
* **`navRight.appendChild(signInBtn)`**: Attaches the newly created button to the end of `.nav-right`, making it appear as the rightmost item in the navigation bar.
