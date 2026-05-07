# 03. The Landmark Interactive Modal
**Developer:** Said
**Core Files:** `landmark.html`, `css/landmark.css`, `js/landmark.js`

## 1. Introduction
The Landmark Page provides the deep-dive experience for a specific monument. Similar to the Region page, it dynamically loads data. However, my main responsibility was the highly interactive user interface components: the fullscreen Image Gallery Slider and the popup Modal architecture.

## 2. Data Flow
- **Input:** URL parameter `?id=Landmark_Name`.
- **Fetch 1:** Reads `assets/landmarks.json` to get the text description.
- **Fetch 2:** Reads `assets/landmark_images.json` to get the array of gallery images.
- **State Management:** Keeps track of the `currentImageIndex` in JavaScript memory.

## 3. HTML Structure (The Skeleton)
- **The Modal (`<dialog>` or absolute div):** I used a fixed overlay (`div.modal-overlay`) that sits on top of the entire page (`z-index: 1000`). Inside it is the `.modal-content` box.
- **The Gallery Layout:** The gallery consists of two main parts:
  1. `.gallery-main`: A large `<img>` tag that displays the currently selected photo.
  2. `.gallery-thumbnails`: A CSS Grid container holding small thumbnail images.

## 4. CSS Styling (The Visuals)
- **Modal Positioning:** The modal uses `position: fixed; inset: 0;` to cover the entire screen. A semi-transparent dark background (`rgba(0,0,0,0.8)`) obscures the page behind it, focusing the user's attention.
- **Flexbox Centering:** The modal content is centered perfectly using Flexbox on the overlay (`display: flex; justify-content: center; align-items: center;`).
- **Thumbnail States:** The thumbnails have an `opacity: 0.6` by default. When clicked, JavaScript adds an `.active` class to the thumbnail, which CSS changes to `opacity: 1; border: 2px solid var(--accent);`, providing clear visual feedback on which image is currently being viewed.

## 5. JavaScript Logic (The Brains)
- **Opening the Modal:** When the user clicks "See Full Details" on a region card, `landmark.js` intercepts it, prevents navigation, fetches the specific landmark data, populates the modal's DOM elements, and removes the `.hidden` CSS class from the modal wrapper.
- **The Image Slider:**
  - I store the fetched array of image paths in a global variable.
  - When the user clicks a thumbnail, the `onclick` event passes the index (e.g., `2`) to a function.
  - The function updates the `src` attribute of the `.gallery-main` image to match index `2`.
  - It loops through all thumbnails, removing the `.active` class, and adds the `.active` class only to the clicked thumbnail.
- **Closing the Modal:** Clicking the 'X' button or clicking outside the `.modal-content` (on the overlay itself) adds the `.hidden` class back to the modal, instantly removing it from view.

## 6. Interaction Summary
HTML structures the modal and gallery components. CSS hides the modal by default and manages the visual feedback of the active thumbnail. JavaScript acts as the conductor: fetching the image arrays, unhiding the modal, listening for clicks on thumbnails, and dynamically swapping the `src` attribute of the main image.
