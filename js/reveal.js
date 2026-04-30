/* =============================================================
   reveal.js — Simple Scroll Animations
   =============================================================
   This script uses the browser's native IntersectionObserver
   to fade elements in smoothly as you scroll down.
   It is extremely lightweight and easy to understand.
   ============================================================= */

document.addEventListener('DOMContentLoaded', function () {
    /* 1. Create the observer */
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            /* If the element is visible on the screen */
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                /* Stop observing it so it doesn't animate out and in again */
                observer.unobserve(entry.target);
            }
        });
    }, {
        /* Trigger when 10% of the element is visible */
        threshold: 0.1
    });

    /* 2. Find all elements with the class 'reveal-element' */
    const elements = document.querySelectorAll('.reveal-element');

    /* 3. Tell the observer to watch them */
    elements.forEach(function (el) {
        observer.observe(el);
    });
});
