/* =============================================================
   region.js — Logic for region.html
   =============================================================
   This file does everything dynamic on the region page:

   1. Reads the region ID from the URL (?id=cairo)
   2. Fetches landmarks.json from the assets folder
   3. Filters landmarks to only those matching the region
   4. Sorts them by IMPORTANCE (highest first, as requested)
   5. Renders each landmark as a card in the grid
   6. Opens/closes the quick-preview modal on card click
   7. Sets data-region on <body> so the accent color applies

   HOW TO READ THIS FILE:
   Follow the code top to bottom. The main() function at the
   bottom calls everything in order.

   PATH NOTE: This JS file lives in /js/region.js
   The JSON files live in /assets/landmarks.json
   Since we are one level up from /js/, the path is:
   '../assets/landmarks.json'
   ============================================================= */


/* ─────────────────────────────────────────────────────────────
   STEP 1: READ THE REGION ID FROM THE URL
   ─────────────────────────────────────────────────────────────
   When the user clicks "Cairo" on the home page, the browser
   navigates to:  region.html?id=cairo

   window.location.search gives us the query string: "?id=cairo"
   URLSearchParams parses that string into a usable object.
   .get('id') extracts the value for the key 'id' → "cairo"
   ───────────────────────────────────────────────────────────── */
const params = new URLSearchParams(window.location.search);
const regionId = params.get('id'); /* e.g., "cairo", "giza_pyramids" */


/* ─────────────────────────────────────────────────────────────
   REGION CONFIGURATION
   ─────────────────────────────────────────────────────────────
   We need two things per region:
   1. The display name (e.g., "Cairo") — to match against JSON data
   2. The CSS data-region value — to apply the accent color

   The JSON uses the display name in the "region" field.
   The CSS uses the data-region attribute on <body>.

   This object maps the URL id to both values.
   ───────────────────────────────────────────────────────────── */
const REGION_CONFIG = {
    cairo: { label: 'Cairo', cssId: 'cairo' },
    giza_pyramids: { label: 'Giza & Pyramids', cssId: 'giza_pyramids' },
    luxor_thebes: { label: 'Luxor & Thebes', cssId: 'luxor_thebes' },
    aswan_nubia: { label: 'Aswan & Nubia', cssId: 'aswan_nubia' },
    alexandria: { label: 'Alexandria', cssId: 'alexandria' },
    sinai_red_sea: { label: 'Sinai & Red Sea', cssId: 'sinai_red_sea' },
    western_desert: { label: 'Western Desert', cssId: 'western_desert' },
    upper_egypt: { label: 'Upper Egypt', cssId: 'upper_egypt' },
    suez_canal: { label: 'Suez Canal', cssId: 'suez_canal' }
};


/* ─────────────────────────────────────────────────────────────
   STEP 2: APPLY THE REGION ACCENT COLOR
   ─────────────────────────────────────────────────────────────
   Setting data-region on <body> triggers the CSS rules in
   global.css like: [data-region="cairo"] { --accent: #B85C3A; }
   Every element using var(--accent) on this page now uses
   Cairo's terracotta color automatically.
   ───────────────────────────────────────────────────────────── */
function applyRegionTheme(config) {
    document.body.setAttribute('data-region', config.cssId);
}


/* ─────────────────────────────────────────────────────────────
   STEP 3: UPDATE THE PAGE HEADER
   ─────────────────────────────────────────────────────────────
   The region header (region name, count) is in the HTML as
   empty placeholders. This function fills them in.
   ───────────────────────────────────────────────────────────── */
function renderRegionHeader(config, count) {
    /* Update the browser tab title */
    document.title = config.label + ' — Egypt Wonders';

    /* Update the header text */
    const nameEl = document.getElementById('region-name');
    if (nameEl) nameEl.textContent = config.label;

    /* Update the giant background watermark */
    const watermarkEl = document.getElementById('region-watermark');
    if (watermarkEl) watermarkEl.textContent = config.label.toUpperCase();

    /* Update the landmark count */
    const countEl = document.getElementById('region-count');
    if (countEl) countEl.textContent = count + ' Landmarks';
}


/* ─────────────────────────────────────────────────────────────
   STEP 4: CALCULATE IMPORTANCE DOTS
   ─────────────────────────────────────────────────────────────
   Landmarks have an importance score from 1–10.
   We display this as 5 dots where each dot = 2 importance points.

   importance 10 → 5 filled dots (max)
   importance 8  → 4 filled dots
   importance 6  → 3 filled dots
   importance 4  → 2 filled dots
   importance 2  → 1 filled dot

   We use Math.round(importance / 2) to convert 1-10 to 1-5.
   Math.min(..., 5) ensures we never show more than 5 dots.
   ───────────────────────────────────────────────────────────── */
function buildImportanceDots(importance) {
    /* Convert the 1–10 score to a 1–5 dot count */
    const filledCount = Math.min(Math.round(importance / 2), 5);
    const totalDots = 5;

    /* Build the HTML string for the dot elements */
    let dotsHTML = '';
    for (let i = 1; i <= totalDots; i++) {
        /* If this dot's position is within the filled count, add "filled" class */
        const filledClass = i <= filledCount ? ' filled' : '';
        dotsHTML += '<span class="importance-dot' + filledClass + '"></span>';
    }
    return dotsHTML;
}


/* ─────────────────────────────────────────────────────────────
   STEP 5: BUILD A SINGLE LANDMARK CARD
   ─────────────────────────────────────────────────────────────
   This function receives one landmark object from the JSON and
   returns an HTML string for its card.

   WHY build HTML as a string?
   It is the simplest, most readable approach for vanilla JS.
   We build the full HTML string and then insert it all at once,
   which is also more performant than creating elements one by one.

   The card is an <article> because it represents a standalone,
   self-contained piece of content (one landmark).
   ───────────────────────────────────────────────────────────── */
function buildLandmarkCard(landmark) {
    /* Use imagePath if available, otherwise fall back to thumbnail */
    const imgSrc = landmark.imagePath || landmark.thumbnail || '';

    /* Safe alt text: the landmark name */
    const altText = landmark.name;

    /* Build the importance dots HTML */
    const dotsHTML = buildImportanceDots(landmark.importance || 0);

    /* Truncate category label if too long */
    const category = landmark.category || '';

    /* The card's click handler calls openModal() with this landmark's ID.
       We use a data attribute (data-id) to store the ID on the element,
       then read it in the event listener. This avoids inline onclick="". */
    return `
        <article
            class="landmark-card cinematic-card"
            data-id="${landmark.id}"
            role="button"
            tabindex="0"
            aria-label="View details for ${landmark.name}">

            <!-- Thumbnail image — lazy loaded for performance -->
            <img
                class="landmark-card-img"
                src="assets/${imgSrc}"
                alt="${altText}"
                loading="lazy">

            <div class="landmark-card-overlay">
                <div class="landmark-card-content">
                    <!-- Top row: category badge + importance indicator -->
                    <div class="landmark-card-top">
                        <span class="landmark-card-tag">${category}</span>
                        <div class="importance-dots" aria-label="Importance: ${landmark.importance} out of 10">
                            ${dotsHTML}
                        </div>
                    </div>

                    <!-- Landmark name -->
                    <h2 class="landmark-card-name">${landmark.name}</h2>

                    <!-- Hidden reveal content -->
                    <div class="landmark-card-hidden">
                        <p class="landmark-card-desc">${landmark.description || ''}</p>
                        <span class="landmark-card-btn">Quick Preview →</span>
                    </div>
                </div>
            </div>
        </article>
    `;
}


/* ─────────────────────────────────────────────────────────────
   STEP 6: RENDER ALL LANDMARK CARDS INTO THE GRID
   ─────────────────────────────────────────────────────────────
   This function takes the filtered + sorted array of landmarks
   and inserts all their card HTML into the #landmark-grid div.

   innerHTML = the content inside an element.
   We build all cards as one big string and set it in one shot.
   ───────────────────────────────────────────────────────────── */
function renderLandmarkGrid(landmarks) {
    const grid = document.getElementById('landmark-grid');
    if (!grid) return;

    /* Hide the loading indicator now that we have data */
    const loader = document.getElementById('loading-indicator');
    if (loader) loader.style.display = 'none';

    if (landmarks.length === 0) {
        /* Edge case: no landmarks found for this region */
        grid.innerHTML = '<p class="error-message">No landmarks found for this region.</p>';
        return;
    }

    /* Build all card strings, join them into one string, insert into the DOM */
    grid.innerHTML = landmarks.map(buildLandmarkCard).join('');

    /* After inserting cards, attach click event listeners.
       We use event delegation: one listener on the grid handles
       all card clicks. This is more efficient than one listener per card.

       HOW EVENT DELEGATION WORKS:
       When you click a card, the event "bubbles up" from the card
       to its parent (#landmark-grid). We catch it at the grid level
       and check which card was clicked using event.target.closest(). */
    grid.addEventListener('click', function (event) {
        /* .closest('.landmark-card') walks UP the DOM tree from the clicked
           element until it finds an ancestor with class "landmark-card".
           This works even if the user clicked the image or the text INSIDE the card. */
        const card = event.target.closest('.landmark-card');
        if (card) {
            const landmarkId = card.dataset.id; /* reads data-id attribute */
            /* Find the landmark in our array by its ID */
            const landmark = landmarks.find(function (l) { return l.id === landmarkId; });
            if (landmark) openModal(landmark);
        }
    });

    /* Support keyboard navigation: allow Enter/Space to open modal on focused card */
    grid.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            const card = event.target.closest('.landmark-card');
            if (card) {
                event.preventDefault();
                const landmarkId = card.dataset.id;
                const landmark = landmarks.find(function (l) { return l.id === landmarkId; });
                if (landmark) openModal(landmark);
            }
        }
    });
}


/* ─────────────────────────────────────────────────────────────
   STEP 7: MODAL — OPEN AND CLOSE
   ─────────────────────────────────────────────────────────────
   The modal is a native <dialog> element.
   .showModal() opens it as a blocking modal (with backdrop).
   .close() closes it.

   We populate the modal's content with the clicked landmark's data
   before opening it.
   ───────────────────────────────────────────────────────────── */

/* Get the modal element — it exists in the HTML, hidden by default */
const modal = document.getElementById('landmark-modal');

function openModal(landmark) {
    /* Fill the modal image */
    const modalImg = document.getElementById('modal-image');
    const imgSrc = landmark.imagePath || landmark.thumbnail || '';
    if (modalImg) {
        modalImg.src = 'assets/' + imgSrc;
        modalImg.alt = landmark.name;
    }

    /* Fill the category label */
    const modalCategory = document.getElementById('modal-category');
    if (modalCategory) modalCategory.textContent = landmark.category || '';

    /* Fill the landmark name */
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.textContent = landmark.name;

    /* Fill the short description */
    const modalDesc = document.getElementById('modal-desc');
    if (modalDesc) modalDesc.textContent = landmark.description || '';

    /* Update the "See Full Details" link with this landmark's ID.
       This navigates to landmark.html?id=11959 (for example). */
    const detailLink = document.getElementById('modal-detail-link');
    if (detailLink) detailLink.href = 'landmark.html?id=' + landmark.id;

    /* Open the modal — .showModal() is the native <dialog> method */
    modal.showModal();
}

function closeModal() {
    modal.close(); /* native <dialog> close method */
}

/* Close modal when clicking the backdrop (the dimmed area outside the modal).
   The <dialog> fires a 'click' event. If the click target IS the dialog itself
   (not an element inside it), the user clicked the backdrop. */
if (modal) {
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

/* The close button inside the modal calls closeModal() */
const closeBtn = document.getElementById('modal-close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}


/* ─────────────────────────────────────────────────────────────
   STEP 8: SHOW ERROR STATE
   ─────────────────────────────────────────────────────────────
   If the fetch fails or the region is not recognized, we show
   a clear error message instead of a broken empty page.
   ───────────────────────────────────────────────────────────── */
function showError(message) {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.textContent = message;
        loader.classList.add('error-message');
    }
}


/* ─────────────────────────────────────────────────────────────
   MAIN — THE ENTRY POINT
   ─────────────────────────────────────────────────────────────
   This is called when the page loads. It orchestrates all steps.

   fetch() is a built-in browser function to load files.
   It returns a Promise — an object that represents a value
   that will be available in the future (asynchronous).

   async/await is the modern way to write Promises.
   'await' pauses execution until the Promise resolves.
   This makes async code look and read like normal code.

   SORTING BY IMPORTANCE:
   After filtering, we sort the landmarks array by importance
   descending (highest importance = shown first).
   Array.sort() takes a comparison function:
   - If (a - b) returns negative, a comes before b
   - If (a - b) returns positive, b comes before a
   - We use (b.importance - a.importance) for descending order
   ───────────────────────────────────────────────────────────── */
async function main() {
    /* Validate that we have a recognized region ID */
    if (!regionId || !REGION_CONFIG[regionId]) {
        showError('Region not found. Please go back and select a region.');
        return;
    }

    const config = REGION_CONFIG[regionId];

    /* Apply the region's accent color to the whole page */
    applyRegionTheme(config);

    try {
        /* fetch() loads the JSON file. We await the response. */
        const response = await fetch('assets/landmarks.json');

        /* Check if the request succeeded (HTTP 200 OK) */
        if (!response.ok) {
            throw new Error('Could not load landmarks data.');
        }

        /* .json() parses the response body as JSON. We await this too. */
        const allLandmarks = await response.json();

        /* Filter: keep only landmarks whose region matches our label.
           The JSON "region" field uses display names like "Cairo",
           "Giza & Pyramids", etc. — we match using config.label.

           IMPORTANT — Data contract:
           landmarks.json is pre-sorted by importance DESCENDING globally.
           Array.filter() preserves the source array's order, so the
           filtered result is also sorted by importance descending.
           NO runtime sort is needed — and none is performed here.

           If landmarks.json is ever modified, whoever adds a new entry
           MUST insert it at the correct position (by importance score)
           to maintain this contract. */
        const regionLandmarks = allLandmarks.filter(function (landmark) {
            return landmark.region === config.label;
        });

        /* Update the header with the real count */
        renderRegionHeader(config, regionLandmarks.length);

        /* Render the cards */
        renderLandmarkGrid(regionLandmarks);

    } catch (error) {
        /* If anything goes wrong (network error, bad JSON, etc.), show the error */
        showError('Failed to load landmarks. ' + error.message);
    }
}

/* Run the main function when this script executes */
main();
