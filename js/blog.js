/* =====================================================================
   COMMUNITY BLOG LOGIC (blog.js)
   Handles user-generated posts: saving to localStorage, rendering,
   liking, and deleting. Matches the project's premium aesthetic.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function() {

    /* --- Elements --- */
    const form        = document.getElementById('community-form');
    const nameInput   = document.getElementById('post-name');
    const nameGroup   = document.getElementById('name-group');
    const contentInput= document.getElementById('post-content');
    const postsDiv    = document.getElementById('community-posts');
    const msgEl       = document.getElementById('post-message');

    /* --- State --- */
    let posts = [];

    /* -----------------------------------------------------------------
       1. INITIALIZATION
       Load existing posts from storage and handle logged-in users.
       ----------------------------------------------------------------- */
    function init() {
        // Load from localStorage
        const saved = localStorage.getItem('community_posts');
        if (saved) {
            posts = JSON.parse(saved);
        }

        // If user is logged in (using auth.js), auto-fill name and hide the input
        if (typeof getCurrentUser === 'function') {
            const user = getCurrentUser();
            if (user) {
                nameInput.value = user.name;
                nameGroup.style.display = 'none'; // Hide the input group entirely
            }
        }

        renderPosts();
    }

    /* -----------------------------------------------------------------
       2. RENDER POSTS
       Generates HTML for each post matching the .blog-card design.
       ----------------------------------------------------------------- */
    function renderPosts() {
        if (!postsDiv) return;

        postsDiv.innerHTML = '';

        if (posts.length === 0) {
            postsDiv.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center;">No community posts yet. Be the first to share!</p>';
            return;
        }

        posts.forEach((post, index) => {
            // We reuse the premium .blog-card CSS classes here.
            // We don't have user images, so we create a nice text-only card layout.
            const cardHTML = `
                <article class="blog-card community-card">
                    <div class="blog-card-body" style="height: 100%; display: flex; flex-direction: column;">
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-xs);">
                            <span class="blog-card-date">${post.date}</span>
                            <div class="community-actions">
                                <button class="action-btn like-btn" onclick="likePost(${index})" aria-label="Like post">
                                    <span style="font-size: 1.1rem;">👍</span> ${post.likes}
                                </button>
                                <button class="action-btn delete-btn" onclick="deletePost(${index})" aria-label="Delete post">
                                    🗑️
                                </button>
                            </div>
                        </div>

                        <h2 class="blog-card-title" style="margin-bottom: var(--space-xs); font-size: 1.3rem;">${escapeHTML(post.name)}</h2>
                        
                        <p class="blog-card-excerpt" style="flex-grow: 1; white-space: pre-wrap;">${escapeHTML(post.content)}</p>

                    </div>
                </article>
            `;
            postsDiv.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    /* -----------------------------------------------------------------
       3. ADD A NEW POST
       ----------------------------------------------------------------- */
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = nameInput.value.trim();
            const content = contentInput.value.trim();

            if (!name || !content) {
                showMessage('Please fill out both your name and your experience.', 'error');
                return;
            }

            const newPost = {
                name: name,
                content: content,
                likes: 0,
                // Create a nice readable date, e.g. "May 2026" or "May 7, 2026"
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };

            // Add to beginning of array so newest is first
            posts.unshift(newPost);
            
            // Save and refresh UI
            savePosts();
            renderPosts();

            // Clear the content box. If they aren't logged in, clear name too.
            contentInput.value = '';
            if (nameGroup.style.display !== 'none') {
                nameInput.value = '';
            }

            showMessage('Your experience has been shared!', 'success');
        });
    }

    /* -----------------------------------------------------------------
       4. LIKE & DELETE ACTIONS
       These must be attached to the window object so the inline 
       onclick="" handlers in the HTML string can find them.
       ----------------------------------------------------------------- */
    window.likePost = function(index) {
        posts[index].likes++;
        savePosts();
        renderPosts();
    };

    window.deletePost = function(index) {
        // Optional: Ask for confirmation
        if (confirm("Are you sure you want to delete this post?")) {
            posts.splice(index, 1);
            savePosts();
            renderPosts();
        }
    };

    /* -----------------------------------------------------------------
       HELPERS
       ----------------------------------------------------------------- */
    function savePosts() {
        localStorage.setItem('community_posts', JSON.stringify(posts));
    }

    function showMessage(text, type) {
        if (!msgEl) return;
        msgEl.textContent = text;
        msgEl.className = 'form-message visible ' + type; // Reuse form-message classes
        
        // Hide after 3 seconds
        setTimeout(() => {
            msgEl.classList.remove('visible', 'error', 'success');
            msgEl.textContent = '';
        }, 3000);
    }

    // Security: Escape HTML to prevent XSS attacks when rendering user input
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Start everything!
    init();

});
