# Stage 4 — Region Page (`region.html` + `region.css` + `region.js`)

**What we do in this stage:**
Build the landmark grid page — the first truly dynamic page in the project.

---

## What Makes This Page Different From the Home Page

The home page is 100% static HTML. This page is **dynamic** — the content is generated
by JavaScript at runtime. Here is the sequence of events when you visit `region.html?id=cairo`:

```
1. Browser loads region.html (the empty shell)
2. Browser applies global.css + region.css (styling)
3. Browser runs nav.js (active link + dark mode)
4. Browser runs region.js:
   a. Reads "cairo" from the URL
   b. Applies Cairo's accent color (#B85C3A) to <body>
   c. Shows "Loading landmarks..."
   d. Fetches assets/landmarks.json (network request)
   e. Filters: keeps only landmarks where region === "Cairo"
   f. Sorts by importance DESCENDING (22 → 9 → 8 → ... → 5)
   g. Renders 22 landmark cards into the grid
   h. Hides the loading indicator
   i. Attaches click listeners to open the modal
```

---

## The `async/await` Pattern — How JS Fetches Files

This is the most important technical concept in `region.js`. Read carefully.

### The Problem: Loading Files Takes Time

When JavaScript runs `fetch('assets/landmarks.json')`, it sends a request to load the file.
This takes time — even if the file is local, it is not instant.

JavaScript is **single-threaded** — it can only do one thing at a time.
If we blocked and waited for the file, the entire browser would freeze during the wait.

### The Solution: Promises and async/await

A **Promise** is an object that says "I don't have the value yet, but I promise I'll have it soon."
`async/await` lets us write code that waits for a Promise without freezing the browser.

```js
// Without async/await (callback style — harder to read):
fetch('assets/landmarks.json')
    .then(function(response) { return response.json(); })
    .then(function(data) { /* use data */ })
    .catch(function(error) { /* handle error */ });

// With async/await (our approach — reads like normal code):
async function main() {
    const response = await fetch('assets/landmarks.json'); // wait here
    const data     = await response.json();                // wait here
    // now use data normally
}
```

`await` pauses execution of the `async` function until the Promise resolves.
The rest of the browser (UI, other events) keeps working during the wait.

---

## Filtering the Landmarks

```js
const regionLandmarks = allLandmarks.filter(function(landmark) {
    return landmark.region === config.label;
});
```

`Array.filter()` creates a **new array** containing only elements where the
callback function returns `true`. The original `allLandmarks` array is unchanged.

For Cairo: `config.label = "Cairo"`, so this keeps only landmarks where
`landmark.region === "Cairo"` — reducing 90 landmarks to 22.

---

## Sorting by Importance (The User's Requirement)

```js
regionLandmarks.sort(function(a, b) {
    return (b.importance || 0) - (a.importance || 0);
});
```

`Array.sort()` sorts in-place (modifies the array directly).
It takes a comparison function with two parameters `(a, b)`:
- If the function returns **negative** → `a` comes before `b` (a is first)
- If the function returns **positive** → `b` comes before `a` (b is first)
- If it returns **zero** → order doesn't matter

`b.importance - a.importance` = descending order (highest importance first):
- Pyramid (importance 10), Sphinx (10), KV62 (10) appear first
- Coloured Canyon (importance 5) appears last

The `|| 0` is a safety fallback: if a landmark has no importance field, treat it as 0.

---

## Event Delegation — One Listener for 22 Cards

Instead of attaching a click listener to each of the 22 cards individually:
```js
// BAD — 22 listeners:
cards.forEach(card => card.addEventListener('click', handler));
```

We attach ONE listener to the parent grid:
```js
// GOOD — 1 listener:
grid.addEventListener('click', function(event) {
    const card = event.target.closest('.landmark-card');
    if (card) openModal(card);
});
```

**Why this works:** When you click anywhere on a page, the click event travels
UP through the DOM tree (this is called "event bubbling"). Clicking a card image
bubbles up: image → card-body → landmark-card → landmark-grid. We catch it at
the grid level and use `.closest('.landmark-card')` to find which card was clicked,
even if the user clicked the image or text inside the card.

**Benefits:**
- More efficient (1 listener vs 22)
- Works for cards added dynamically (the listeners don't need to be re-attached)
- Simpler code

---

## The Native `<dialog>` Modal

```html
<dialog class="landmark-modal" id="landmark-modal">
    ...content...
</dialog>
```

The `<dialog>` element is a built-in HTML element for popup dialogs.

```js
modal.showModal(); // opens it as a blocking modal with backdrop
modal.close();     // closes it
```

When opened with `.showModal()`:
- The browser automatically dims the background (via `::backdrop`)
- Focus is trapped inside the dialog (keyboard users can't tab outside)
- Pressing Escape automatically closes it
- Screen readers announce it as a modal dialog

We get all this behavior for FREE from the browser — no JavaScript modal library needed.

The `::backdrop` pseudo-element is generated by the browser automatically.
We style it in `region.css`:
```css
.landmark-modal::backdrop {
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
}
```

---

## The Importance Dots

The 5-dot indicator converts the 1–10 importance score into a visual representation.

```js
function buildImportanceDots(importance) {
    const filledCount = Math.min(Math.round(importance / 2), 5);
    ...
}
```

| importance | Math.round(x/2) | dots filled |
|---|---|---|
| 10 | 5 | ●●●●● |
| 9  | 5 (round(4.5)=5) | ●●●●● |
| 8  | 4 | ●●●●○ |
| 6  | 3 | ●●●○○ |
| 5  | 3 (round(2.5)=3) | ●●●○○ |
| 4  | 2 | ●●○○○ |

---

## Files Changed in Stage 4

- `region.html` — Complete region page shell
- `css/region.css` — Region header, landmark grid, card, modal styles
- `js/region.js` — Full dynamic logic: fetch, filter, sort, render, modal

## ✅ Stage 4 Checklist

- [x] `region.html` written with all placeholder elements
- [x] `region.css` written: header, cards, modal, responsive
- [x] `region.js` written with full comments
- [x] URL query parameter reading (`?id=cairo`)
- [x] Region accent color applied via `data-region` on `<body>`
- [x] `fetch()` with `async/await` and error handling
- [x] Filter by region label
- [x] **Sort by importance DESCENDING** (as required)
- [x] Card grid rendered with event delegation
- [x] Importance dots (1–5 visual scale)
- [x] Native `<dialog>` modal with backdrop
- [x] Modal fills with clicked landmark's data
- [x] "See Full Details →" link built with correct `?id=` parameter
- [x] Keyboard accessibility (Enter/Space opens modal, Escape closes)

---

## Next: Stage 5 — Landmark Detail Page (`landmark.html` + `landmark.css` + `landmark.js`)
