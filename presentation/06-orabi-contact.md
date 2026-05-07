# 06. The Contact Page & Responsive Layouts
**Developer:** Orabi
**Core Files:** `contact.html`, `css/global.css`

## 1. Introduction
The Contact page is a crucial engagement tool for any website. My responsibility was building the dual-column layout containing the informational banner and the contact form itself. Furthermore, I focused heavily on the responsive behavior of this page and implementing the frontend simulation of the form submission process.

## 2. Data Flow
- **Input:** User fills out Name, Email, Subject, and Message.
- **Processing:** Inline JavaScript intercepts the form submission event.
- **Output:** The default page reload is halted, a success alert is presented to the user, and the form fields are cleared. (In a real-world scenario, this is where the `fetch()` API would send a POST request to a backend server).

## 3. HTML Structure (The Skeleton)
- **The Split Section (`.contact-section`):** The core of the page is wrapped in a container that holds two distinct elements side-by-side:
  1. `.contact-info`: A section containing the phone number, email address, physical location, and an embedded Google iframe map.
  2. `.contact-form-container`: The actual `<form>` containing standard inputs and a `<textarea>`.
- **Form Groups:** Each input is wrapped in a `.form-group` `<div>` alongside its `<label>`. This grouping is essential for accessibility (screen readers) and makes CSS spacing much easier to manage.

## 4. CSS Styling (The Visuals)
- **CSS Grid Dual-Column:** The layout magic happens via CSS Grid: `display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl);`. This perfectly divides the page 50/50 between the info banner and the form.
- **Responsive Stacking:** In the `@media (max-width: 768px)` query, I change the grid template to `grid-template-columns: 1fr;`. This means on mobile phones, the 50/50 split collapses, and the form stacks neatly directly underneath the contact info, preventing horizontal scrolling.
- **Input Styling:** The inputs use `width: 100%; box-sizing: border-box;` so they never overflow their parent container. The focus state uses a transition to smoothly change the border color to the project's golden `--accent` color, improving user feedback.

## 5. JavaScript Logic (The Brains)
Because there is no backend server to receive the contact email, I implemented a script to simulate the interaction and provide a complete frontend UX:
- **Event Listener:** `document.getElementById('contact-form').addEventListener('submit', function(e) { ... })`.
- **Prevent Default:** `e.preventDefault();` is the most important line. Native HTML forms try to navigate to an `action` URL and reload the page when submitted. This stops that behavior.
- **UX Feedback:** It triggers `alert('Thank you for reaching out! Your message has been sent successfully.');` to assure the user their action was registered.
- **Reset:** Finally, `this.reset();` is called on the form element, instantly wiping all inputs clean so the user can send another message if needed.

## 6. Interaction Summary
HTML structures the page into logical columns and labels the inputs clearly for accessibility. CSS uses Grid to split the screen 50/50 on desktop and stacks it linearly on mobile for readability. JavaScript simulates the backend by preventing page reloads and providing instant success feedback to the user.
