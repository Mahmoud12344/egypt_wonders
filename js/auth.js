/* =============================================================
   auth.js — Authentication Logic (localStorage-based)
   =============================================================
   This file handles the full login / sign-up lifecycle:

   STORAGE MODEL (localStorage):
     "users"       → JSON array of all registered accounts
                     [{ name, email, password }, ...]
     "currentUser" → JSON object of the logged-in user
                     { name, email }   (no password in session)

   This script is loaded on EVERY page (before nav.js) so that
   the nav bar can call getCurrentUser() to render the correct
   user state button.
   ============================================================= */


/* ─────────────────────────────────────────────────────────────
   HELPER: Read all users from localStorage.
   Returns an empty array if none have signed up yet.
   ───────────────────────────────────────────────────────────── */
function getUsers() {
    /* localStorage only stores text, so we parse the JSON string
       back into a real JavaScript array with JSON.parse().
       If 'users' was never saved, getItem returns null, so we
       default to an empty array '[]'. */
    return JSON.parse(localStorage.getItem('users') || '[]');
}


/* ─────────────────────────────────────────────────────────────
   HELPER: Save the full users array back to localStorage.
   We must JSON.stringify() to convert the array to a text string
   because localStorage cannot store arrays directly.
   ───────────────────────────────────────────────────────────── */
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}


/* ─────────────────────────────────────────────────────────────
   PUBLIC: Get the currently logged-in user.
   Returns the user object { name, email } or null if not logged in.
   Called by nav.js on every page to render the nav button.
   ───────────────────────────────────────────────────────────── */
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}


/* ─────────────────────────────────────────────────────────────
   PUBLIC: Sign Up a new user.
   Parameters:
     name     — full name string
     email    — email string (must be unique)
     password — plain text password string
     confirmPassword — must equal password

   Returns an object: { success: true/false, message: '...' }
   ───────────────────────────────────────────────────────────── */
function signUp(name, email, password, confirmPassword) {

    /* --- Validate: all fields must be filled in --- */
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
        return { success: false, message: 'Please fill in all fields.' };
    }

    /* --- Validate: passwords must match --- */
    if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match.' };
    }

    /* --- Validate: password must be at least 6 characters --- */
    if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
    }

    /* --- Validate: email format (basic check) --- */
    if (!email.includes('@') || !email.includes('.')) {
        return { success: false, message: 'Please enter a valid email address.' };
    }

    /* --- Check: email must not already be registered ---
       .find() loops through every user and returns the first match.
       .toLowerCase() makes the comparison case-insensitive. */
    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return { success: false, message: 'An account with this email already exists.' };
    }

    /* --- Create the new user object and store it --- */
    const newUser = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password  /* stored plain text — academic project only */
    };
    users.push(newUser);   /* add to the array */
    saveUsers(users);       /* write array back to localStorage */

    /* --- Automatically log in the user after sign-up ---
       We only store name + email in the session (NOT the password). */
    localStorage.setItem('currentUser', JSON.stringify({
        name: newUser.name,
        email: newUser.email
    }));

    return { success: true, message: 'Account created! Welcome to Egypt Wonders.' };
}


/* ─────────────────────────────────────────────────────────────
   PUBLIC: Sign In an existing user.
   Parameters:
     email    — email string
     password — plain text password string

   Returns an object: { success: true/false, message: '...' }
   ───────────────────────────────────────────────────────────── */
function signIn(email, password) {

    /* --- Validate: both fields must be filled --- */
    if (!email.trim() || !password) {
        return { success: false, message: 'Please enter your email and password.' };
    }

    /* --- Find a user that matches BOTH the email AND the password ---
       We use .find() to search through all registered users.
       Both email and password must match exactly (email is case-insensitive). */
    const users = getUsers();
    const matchedUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase().trim()
             && u.password === password
    );

    /* --- If no match found, credentials are wrong --- */
    if (!matchedUser) {
        return { success: false, message: 'Incorrect email or password.' };
    }

    /* --- Valid credentials: save session to localStorage ---
       Only store name + email (NOT password) in the session. */
    localStorage.setItem('currentUser', JSON.stringify({
        name: matchedUser.name,
        email: matchedUser.email
    }));

    return { success: true, message: `Welcome back, ${matchedUser.name}!` };
}


/* ─────────────────────────────────────────────────────────────
   PUBLIC: Sign Out the current user.
   Removes the currentUser session and redirects to auth.html.
   ───────────────────────────────────────────────────────────── */
function signOut() {
    localStorage.removeItem('currentUser');

    /* Redirect to the auth page after signing out.
       window.location.href changes the browser's current URL. */
    window.location.href = 'auth.html';
}
