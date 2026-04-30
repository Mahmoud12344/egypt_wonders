# Stage 6 — Blog and Contact Pages (`blog.html`, `contact.html`)

**What we do in this stage:**
Build the two simpler static pages — Blog and Contact.

---

## Why These Pages Are Different

The Home, Region, and Landmark pages all required careful decisions about data, JS, and layout.
The Blog and Contact pages are deliberately simple. Here is why:

**Blog (`blog.html`)** — Assigned to: Salah
- Content is fixed — 4 hardcoded article cards
- No JSON data needed
- No page-specific CSS file — styles are in a `<style>` block inside the HTML

**Contact (`contact.html`)** — Assigned to: Mohamed Ahmed
- A single form with 4 fields
- No JS logic needed for a UI demo
- Styles also in a `<style>` block inside the HTML

---

## Why We Used Inline `<style>` Blocks (Not Separate CSS Files)

Our architecture rule was: **one CSS file per page** for complex pages.
But we made an exception for Blog and Contact, and here is the reasoning:

| When to use a separate CSS file | When a `<style>` block is fine |
|---|---|
| The page has complex, unique layout logic | The page has simple, few rules |
| The CSS rules might be reused elsewhere | The rules only apply to this one page |
| The file would be over ~50–60 lines | The total styles fit in < 40 lines |
| Other developers will extend the page | The page is a simple, stable form |

The Blog page's styles (card grid + card components) total ~60 lines.
The Contact page's styles (form fields + team grid) total ~80 lines.

Both could have separate files. But for this academic project, keeping them inline
avoids creating two small files that rarely change. The decision is a **pragmatic tradeoff**,
not a violation of the architecture.

> **Rule of thumb:** If you find yourself exceeding 80 lines in a `<style>` block,
> move it to a separate file.

---

## The Blog Page Layout

```
Blog Header (title + subtitle)
        ↓
Blog Grid (auto-fill, minmax 300px) — 2–3 columns depending on screen
    [Article Card]  [Article Card]
    [Article Card]  [Article Card]
        ↓
Footer
```

Each blog card is an `<article>` element — semantically correct because a blog post is
a standalone, self-contained piece of content (same reason landmark cards use `<article>`).

```html
<article class="blog-card">
    <img ...>
    <div class="blog-card-body">
        <span class="blog-card-date">April 2026</span>
        <h2 class="blog-card-title">...</h2>
        <p class="blog-card-excerpt">...</p>
    </div>
</article>
```

All 4 blog posts use **real landmark images** from the `assets/images/` folder.
This makes the page look live and connected to the project's data.

---

## The Contact Page — The HTML `<form>` Element

```html
<form
    action="mailto:contact@egyptwonders.edu"
    method="post"
    enctype="text/plain"
    novalidate>
```

For an academic project with no backend, `action="mailto:..."` is the correct approach.
When the user submits the form, the browser opens their default email client with the
form data pre-filled. No server is needed.

**`novalidate`** disables the browser's built-in validation popups.
This is used when you want to implement your own validation logic or, as in this case,
you just want the form to submit to the email client without enforcing strict rules.

### Form Input Attributes

```html
<input
    type="email"
    id="contact-email"
    name="email"
    autocomplete="email"
    required>
```

| Attribute | Purpose |
|---|---|
| `type="email"` | On mobile, opens the email keyboard. Browser validates format `x@x.x` |
| `id="contact-email"` | Links the `<label for="contact-email">` to this input — clicking the label focuses the input |
| `name="email"` | The key name sent with the form data |
| `autocomplete="email"` | Browser can auto-fill with the user's saved email |
| `required` | Field cannot be empty on submit |

### Why `<label for="...">` Matters

```html
<label class="form-label" for="contact-name">Full Name</label>
<input id="contact-name" ...>
```

The `for` attribute on `<label>` must match the `id` on the `<input>`.
This does two things:
1. **Accessibility** — screen readers announce the label when the input is focused
2. **UX** — clicking the label text focuses the input field (larger click target)

---

## The Team Section on Contact

The Contact page includes a team attribution section.
This fulfills the academic requirement and gives credit to all members.
The team cards use the hover effect (`border-color: var(--accent)`) from global.css
variables, so they automatically pick up the right color in any mode.

---

## Files Changed in Stage 6

- `blog.html` — 4 blog post cards with real landmark images
- `contact.html` — semantic form + team grid

## ✅ Stage 6 Checklist

- [x] `blog.html` written with 4 article cards, real images, semantic HTML
- [x] Blog card grid responsive with `auto-fill, minmax(300px, 1fr)`
- [x] `contact.html` written with full semantic form
- [x] All form fields have matching `<label for="">` and `id` attributes
- [x] Form uses `autocomplete` attributes for UX
- [x] Team attribution section lists all 6 team members with roles
- [x] Both pages use `global.css` and `nav.js` — consistent with all other pages

---

## Next: Stage 7 — Polish, Responsive Design, and Running the Project
