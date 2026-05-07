# 04. The Authentication System & Security
**Developer:** Shawki
**Core Files:** `auth.html`, `css/auth.css`, `js/auth.js`

## 1. Introduction
The Authentication page handles the user login and registration process. Because this is a frontend-only academic project without a backend database like SQL or MongoDB, I engineered a pseudo-backend using the browser's native `localStorage` API. My responsibility was ensuring users can register securely (in a simulated environment) and that their session state is respected across the site.

## 2. Data Flow
- **Input:** User types email, password, and name into the HTML forms.
- **Processing:** `auth.js` validates the inputs (e.g., do the passwords match? is the email already registered?).
- **Output:** If valid, the user object is pushed to a JSON array and saved permanently to `localStorage` under the key `users`. A second key, `currentUser`, is created to track the active session.

## 3. HTML Structure (The Skeleton)
- **The Dual-Form Architecture:** I placed two distinct `<form>` tags inside the main card—one for Login (`#form-login`) and one for Sign Up (`#form-signup`). 
- **Tab Buttons:** Above the forms are two `<button>` elements acting as tabs. They use `data-target` attributes to specify which form they control.
- **Validation Attributes:** I heavily utilized HTML5 native validation. Inputs use `type="email"` (which forces browser-level email regex checking) and `required` attributes to prevent empty submissions before JavaScript even runs.

## 4. CSS Styling (The Visuals)
- **Glassmorphism Card:** The `.auth-card` uses `background: rgba(255, 255, 255, 0.4);` combined with `backdrop-filter: blur(15px);` to create a stunning frosted glass effect over the giant "EGYPT" watermark background.
- **Tab Toggling Logic:** In `auth.css`, both panels have `display: none;` by default. When JavaScript adds the `.visible` class to a panel, CSS changes it to `display: block;`, instantly swapping the forms without reloading the page.
- **Focus States:** The `.auth-input:focus` selector adds a golden border when the user clicks an input, providing essential accessibility feedback.

## 5. JavaScript Logic (The Brains)
- **The Tab Controller:** I wrote a `switchTab()` function that removes the `.active` class from all tabs and the `.visible` class from all forms, then adds those classes only to the specific tab the user clicked.
- **The Registration Engine (`signUp`):**
  1. Reads the `users` array from `localStorage` (or creates an empty one).
  2. Checks if the submitted email already exists using `.some()`.
  3. Validates that `password === confirmPassword`.
  4. If successful, creates a user object `{ name, email, password }`, pushes it to the array, and uses `JSON.stringify()` to save it back to `localStorage`.
- **The Login Engine (`signIn`):**
  1. Finds the user in the array using `.find(u => u.email === email)`.
  2. Checks if `u.password === password`.
  3. If successful, creates a `currentUser` key in `localStorage`.
  4. Redirects the user to `index.html` using `window.location.href`.

## 6. Interaction Summary
HTML provides the strict, secure input fields. CSS hides the inactive form and makes the active one look like premium glass. JavaScript acts as the gatekeeper: intercepting the form submissions (`event.preventDefault()`), checking the inputs against the `localStorage` pseudo-database, and managing the state of the tabs.
