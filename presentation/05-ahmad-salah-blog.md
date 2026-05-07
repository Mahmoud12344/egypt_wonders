# 05. The Community Blog System
**Developer:** Ahmad Salah
**Core Files:** `blog.html`, `css/global.css`, `js/blog.js`

## 1. Introduction
The Blog page serves two purposes: it displays beautiful editorial articles (hardcoded), and it allows users to post their own travel stories (dynamic). My responsibility was migrating the project's simple blog posting logic into the premium UI of the main application, resulting in a fully functional, persistent Community Voices section.

## 2. Data Flow
- **Input:** User types their name and experience into the Community Form.
- **Processing:** `blog.js` creates a post object with a timestamp and 0 likes.
- **Output:** The post is unshifted (added to the top) of an array, saved to `localStorage` under `community_posts`, and instantly rendered to the DOM as a new HTML card.

## 3. HTML Structure (The Skeleton)
- **Editorial vs Community:** The top half of the page uses standard `<article>` tags for the static editorial posts. The bottom half contains the `#community-section`.
- **The Form:** Inside `.community-form-box`, there is a `<form>` containing an `<input>` for the name and a `<textarea>` for the multi-line experience story. 
- **The Empty Grid:** Below the form is `<div class="blog-grid" id="community-posts"></div>`. This is the empty container where JavaScript injects the user-generated posts.

## 4. CSS Styling (The Visuals)
- **Form Layout:** I designed the form to be clean and modern. The `.form-input` elements have `width: 100%; box-sizing: border-box;` to ensure they span the full container without spilling over. They have solid `#FFFFFF` backgrounds and subtle gray borders.
- **The Black Button:** The submit button (`.btn-black`) uses `background: #222;` to create a strong, high-contrast call-to-action that matches standard modern web forms.
- **Community Cards:** The generated posts reuse the `.blog-card` CSS from the editorial section to maintain design consistency, but they lack images. I added a `.community-actions` flexbox row to perfectly align the "Like" and "Delete" buttons at the top right of each text card.

## 5. JavaScript Logic (The Brains)
- **Smart User Detection:** When `blog.js` initializes, it checks if `getCurrentUser()` exists (meaning the user is logged in). If they are, it automatically fills the Name input with their real name and completely hides the Name input field (`display: none;`), vastly improving UX.
- **Post Rendering Engine (`renderPosts`):** 
  - It clears the `#community-posts` grid.
  - It maps over the `posts` array from `localStorage`.
  - For each post, it builds a massive HTML string using template literals, injecting `${post.name}`, `${post.content}`, and `${post.likes}` into the `.blog-card` structure.
- **Interactive Actions:** I attached `window.likePost(index)` and `window.deletePost(index)` functions to the buttons on the cards. Clicking "Like" targets the specific index in the array, increments the `likes` integer, saves the array back to `localStorage`, and instantly re-renders the grid so the number goes up visually.

## 6. Interaction Summary
HTML provides the form inputs and the empty grid. CSS styles the form to be highly readable and ensures the generated text-cards match the site's premium aesthetic. JavaScript ties it all together by reading the form, saving the data permanently to the browser, and generating complex HTML structures on the fly to display the growing community wall.
