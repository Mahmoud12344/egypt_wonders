/* =============================================================
   landmark.js — Logic for landmark.html
   =============================================================
   This file builds the complete landmark detail page.

   It does the following:
   1. Reads the landmark ID from the URL (?id=11959)
   2. Fetches both landmarks.json AND landmark_images.json
      simultaneously (at the same time, for speed)
   3. Finds the matching landmark by ID in both files
   4. Applies the region's accent color to the page
   5. Builds the hero section (background image + title)
   6. Builds the full image gallery
   7. Builds the long description section
   8. Builds the metadata sidebar (region, category, coordinates)

   KEY CONCEPT: Promise.all()
   We need data from TWO JSON files. Instead of fetching them
   one after the other (slow), we fetch them simultaneously
   using Promise.all(), which waits for ALL promises to resolve.
   ============================================================= */


/* ─────────────────────────────────────────────────────────────
   STEP 1: READ THE LANDMARK ID FROM THE URL
   landmark.html?id=11959 → landmarkId = "11959"
   ───────────────────────────────────────────────────────────── */
const params     = new URLSearchParams(window.location.search);
const landmarkId = params.get('id');


/* ─────────────────────────────────────────────────────────────
   REGION CONFIG — Same as region.js
   Maps region display names to their CSS data-region IDs.
   Used to apply the correct accent color for this landmark's region.
   ───────────────────────────────────────────────────────────── */
const REGION_CSS_MAP = {
    'Cairo':           'cairo',
    'Giza & Pyramids': 'giza_pyramids',
    'Luxor & Thebes':  'luxor_thebes',
    'Aswan & Nubia':   'aswan_nubia',
    'Alexandria':      'alexandria',
    'Sinai & Red Sea': 'sinai_red_sea',
    'Western Desert':  'western_desert',
    'Upper Egypt':     'upper_egypt',
    'Suez Canal':      'suez_canal'
};

/* Maps region display names to the URL id used in region.html links */
const REGION_URL_MAP = {
    'Cairo':           'cairo',
    'Giza & Pyramids': 'giza_pyramids',
    'Luxor & Thebes':  'luxor_thebes',
    'Aswan & Nubia':   'aswan_nubia',
    'Alexandria':      'alexandria',
    'Sinai & Red Sea': 'sinai_red_sea',
    'Western Desert':  'western_desert',
    'Upper Egypt':     'upper_egypt',
    'Suez Canal':      'suez_canal'
};


/* ─────────────────────────────────────────────────────────────
   GALLERY — FEATURED IMAGE SWITCHING
   ─────────────────────────────────────────────────────────────
   When the user clicks a thumbnail, we:
   1. Set the featured image src to the clicked thumbnail's src
   2. Remove "active" class from all thumbnails
   3. Add "active" class to the clicked thumbnail

   Brief opacity fade (defined in CSS as transition: opacity 0.2s)
   makes the switch feel smooth.
   ───────────────────────────────────────────────────────────── */
function setupGallery() {
    const featuredImg  = document.getElementById('gallery-featured');
    const thumbnails   = document.querySelectorAll('.gallery-thumb');

    if (!featuredImg || thumbnails.length === 0) return;

    thumbnails.forEach(function(thumb) {
        thumb.addEventListener('click', function() {
            /* Brief fade out */
            featuredImg.style.opacity = '0';

            /* After the fade (200ms = same as CSS transition), swap the image */
            setTimeout(function() {
                featuredImg.src = thumb.src;
                featuredImg.alt = thumb.alt;
                featuredImg.style.opacity = '1'; /* fade back in */
            }, 200);

            /* Update active state */
            thumbnails.forEach(function(t) { t.classList.remove('active'); });
            thumb.classList.add('active');
        });
    });
}


/* ─────────────────────────────────────────────────────────────
   RENDER — BUILD THE ENTIRE PAGE
   ─────────────────────────────────────────────────────────────
   This function receives the landmark data and image list,
   then populates every element on the page.
   ───────────────────────────────────────────────────────────── */
function renderLandmarkPage(landmark, imageData) {
    /* ── Apply region accent color ──────────────────────────── */
    const regionCssId = REGION_CSS_MAP[landmark.region];
    if (regionCssId) {
        document.body.setAttribute('data-region', regionCssId);
    }

    /* ── Browser tab title ──────────────────────────────────── */
    document.title = landmark.name + ' — Egypt Wonders';

    /* ── Hero section ────────────────────────────────────────── */
    const heroEl = document.getElementById('landmark-hero');
    const heroImg = landmark.imagePath || landmark.thumbnail || '';
    if (heroEl && heroImg) {
        /* Set the background image via inline style */
        heroEl.style.backgroundImage = 'url("assets/' + heroImg + '")';
    }

    /* Hero: breadcrumb link back to the region page */
    const breadcrumbEl = document.getElementById('landmark-breadcrumb');
    if (breadcrumbEl) {
        const regionUrlId = REGION_URL_MAP[landmark.region] || '';
        breadcrumbEl.href        = 'region.html?id=' + regionUrlId;
        breadcrumbEl.textContent = '← ' + (landmark.region || 'Back');
    }

    /* Hero: landmark name */
    const titleEl = document.getElementById('landmark-hero-title');
    if (titleEl) titleEl.textContent = landmark.name;

    /* Hero: category badge */
    const badgeEl = document.getElementById('landmark-hero-badge');
    if (badgeEl) badgeEl.textContent = landmark.category || '';

    /* ── Gallery ──────────────────────────────────────────────
       imageData comes from landmark_images.json.
       It has an "images" array with {filename, path} objects.
       We show the first image in the featured slot.
       All images appear as clickable thumbnails below.
    ───────────────────────────────────────────────────────────── */
    const featuredImg    = document.getElementById('gallery-featured');
    const thumbContainer = document.getElementById('gallery-thumbnails');

    /* Get the images array — fallback to a single thumbnail if no imageData */
    const images = (imageData && imageData.images && imageData.images.length > 0)
        ? imageData.images
        : [{ path: heroImg, filename: '0.jpg' }];

    /* Set the featured image to the first image */
    if (featuredImg && images.length > 0) {
        featuredImg.src = 'assets/' + images[0].path;
        featuredImg.alt = landmark.name;
    }

    /* Build thumbnail strip HTML */
    if (thumbContainer) {
        thumbContainer.innerHTML = images.map(function(img, index) {
            /* First image gets the "active" class by default */
            const activeClass = index === 0 ? ' active' : '';
            return '<img'
                + ' class="gallery-thumb' + activeClass + '"'
                + ' src="assets/' + img.path + '"'
                + ' alt="' + landmark.name + ' — image ' + (index + 1) + '"'
                + ' loading="lazy"'
                + '>';
        }).join('');

        /* Attach click listeners now that thumbnails are in the DOM */
        setupGallery();
    }

    /* ── Long Description ────────────────────────────────────── */
    const longDescEl = document.getElementById('landmark-long-desc');
    if (longDescEl) {
        longDescEl.textContent = landmark.long_description || landmark.description || '';
    }

    /* ── Sidebar Metadata ────────────────────────────────────── */

    /* Region */
    const sidebarRegion = document.getElementById('sidebar-region');
    if (sidebarRegion) sidebarRegion.textContent = landmark.region || '—';

    /* Governorate */
    const sidebarGov = document.getElementById('sidebar-governorate');
    if (sidebarGov) sidebarGov.textContent = landmark.governorate || '—';

    /* Category */
    const sidebarCat = document.getElementById('sidebar-category');
    if (sidebarCat) sidebarCat.textContent = landmark.category || '—';

    /* Importance bar — filled width = (importance / 10) * 100% */
    const importanceFill = document.getElementById('importance-bar-fill');
    const importanceText = document.getElementById('importance-score-text');
    const score          = landmark.importance || 0;
    if (importanceFill) importanceFill.style.width = (score / 10 * 100) + '%';
    if (importanceText) importanceText.textContent  = score + ' / 10';

    /* Coordinates — build a Google Maps link if coordinates exist */
    const coordsContainer = document.getElementById('sidebar-coords');
    if (coordsContainer) {
        /* Coordinates can be stored as {latitude, longitude} or {lat, lng} */
        const coords = landmark.coordinates;
        if (coords && (coords.latitude || coords.lat)) {
            const lat = coords.latitude || coords.lat;
            const lng = coords.longitude || coords.lng;
            const mapsUrl = 'https://maps.google.com/?q=' + lat + ',' + lng;

            coordsContainer.innerHTML =
                '<span class="sidebar-value">' + lat.toFixed(4) + '° N, ' + lng.toFixed(4) + '° E</span>'
                + '<a href="' + mapsUrl + '" target="_blank" rel="noopener" class="coordinates-link">'
                + '↗ View on Google Maps'
                + '</a>';
        } else {
            coordsContainer.innerHTML = '<span class="sidebar-value">Coordinates not available</span>';
        }
    }
}


/* ─────────────────────────────────────────────────────────────
   SHOW ERROR
   If the landmark is not found or the fetch fails.
   ───────────────────────────────────────────────────────────── */
function showError(message) {
    document.title = 'Error — Egypt Wonders';
    const content = document.getElementById('landmark-page-content');
    if (content) {
        content.innerHTML =
            '<div style="text-align:center; padding: 6rem 2rem;">'
            + '<p style="color: var(--text-muted); font-size: 1rem;">' + message + '</p>'
            + '<a href="index.html" style="color: var(--accent); font-weight: 600; margin-top: 1rem; display: inline-block;">← Return Home</a>'
            + '</div>';
    }
}


/* ─────────────────────────────────────────────────────────────
   MAIN — ENTRY POINT
   ─────────────────────────────────────────────────────────────
   FETCHING TWO FILES SIMULTANEOUSLY WITH Promise.all()

   fetch() returns a Promise for each file.
   Promise.all([promise1, promise2]) takes an ARRAY of Promises
   and returns a new Promise that resolves when ALL of them resolve.
   The result is an array of responses in the same order.

   This is faster than sequential fetching:

   Sequential (slow):
     response1 = await fetch(file1)  ← waits for file1
     response2 = await fetch(file2)  ← only starts after file1 done

   Parallel (fast, using Promise.all):
     [r1, r2] = await Promise.all([fetch(file1), fetch(file2)])
     ← both files load at the same time
   ───────────────────────────────────────────────────────────── */
async function main() {
    if (!landmarkId) {
        showError('No landmark specified. Please navigate from a region page.');
        return;
    }

    try {
        /* Fetch both JSON files at the same time */
        const [landmarksResponse, imagesResponse] = await Promise.all([
            fetch('assets/landmarks.json'),
            fetch('assets/landmark_images.json')
        ]);

        /* Check both responses succeeded */
        if (!landmarksResponse.ok) throw new Error('Could not load landmarks data.');
        if (!imagesResponse.ok)   throw new Error('Could not load image data.');

        /* Parse both JSON bodies — also done simultaneously */
        const [allLandmarks, allImages] = await Promise.all([
            landmarksResponse.json(),
            imagesResponse.json()
        ]);

        /* Find the landmark matching our ID in landmarks.json */
        const landmark = allLandmarks.find(function(l) {
            return l.id === landmarkId;
        });

        if (!landmark) {
            showError('Landmark not found. The ID "' + landmarkId + '" does not exist.');
            return;
        }

        /* Find the image data for this landmark in landmark_images.json.
           The images file has a "landmarks" array — we search it by ID. */
        const imageData = allImages.landmarks
            ? allImages.landmarks.find(function(l) { return l.id === landmarkId; })
            : null;

        /* Build the page */
        renderLandmarkPage(landmark, imageData);

    } catch (error) {
        showError('Failed to load landmark. ' + error.message);
    }
}

main();
