# Stage 10: Background Polish & Scroll Reveals

In this stage, we cured the "empty, clinical white" feeling of the project. High-end editorial and documentary websites rarely use pure `#FFFFFF` because it can feel harsh and uninviting. Furthermore, static pages can feel lifeless.

Instead of adding heavy third-party animation libraries or massive background image files, we achieved a premium feel using three high-impact, low-complexity techniques:

---

## 1. Desert Bone & SVG CSS Noise (Zero Images)

To make the background feel like premium documentary paper, we did two things:

1. **Warmed the Color:** We changed the primary background variable (`--bg-body`) from pure white to `#FCFAF8` (Desert Bone).
2. **Added Micro-Noise:** We used an incredibly powerful CSS trick to generate static "grain" or "noise" without needing to download a `.png` or `.jpg` file.

```css
body {
    /* We use an inline SVG data URI. The SVG contains a <feTurbulence> filter
       which generates mathematical fractal noise. We set it to 4% opacity. */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
    
    background-color: var(--bg-main);
    background-attachment: fixed; /* Ensures the noise stays still while scrolling */
}
```

This trick has **zero performance impact** because the browser natively renders the math, resulting in a beautiful organic texture.

---

## 2. Giant Scrolling Watermark (Zero Logic)

To fill the vast empty margins on large desktop screens, we added massive, faint typography to the background.

```html
<div class="bg-watermark" aria-hidden="true" id="region-watermark">REGION</div>
```

```css
.bg-watermark {
    position:       fixed;
    top:            50%;
    left:           50%;
    transform:      translate(-50%, -50%); /* Perfectly center it */
    font-size:      clamp(8rem, 20vw, 25rem); /* Scales infinitely with the window */
    opacity:        0.02; /* Extremely faint */
    z-index:        -1;   /* Stays behind all content */
    pointer-events: none; /* Prevents it from blocking clicks on links */
}
```

On the home page, this is hardcoded to say "WONDERS". On the `region.html` and `landmark.html` pages, we update the text dynamically using JavaScript (`watermarkEl.textContent = regionName.toUpperCase()`) so the background matches the page you are viewing.

---

## 3. IntersectionObserver Scroll Reveals

We wanted elements (like the region grid and footer) to smoothly glide up and fade in only when the user scrolls down to them.

Instead of a heavy library like GSAP, we wrote a tiny 15-line vanilla JavaScript file (`js/reveal.js`) using the modern `IntersectionObserver` API.

### How it works:
1. **The CSS:** We created a class called `.reveal-element` that hides the element and pushes it down `40px`. We created another class called `.reveal-visible` that restores it to normal.
2. **The JavaScript:** The `IntersectionObserver` watches all `.reveal-element`s. When an element enters the viewport (threshold `0.1` means 10% visible), the observer adds the `.reveal-visible` class and then stops watching that element (so it only animates once).

```javascript
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target); 
        }
    });
}, { threshold: 0.1 });

// Tell observer to watch all hidden elements
document.querySelectorAll('.reveal-element').forEach(function(el) {
    observer.observe(el);
});
```

By applying `<section class="... reveal-element">` in our HTML, the entire page now feels dynamic and alive, responding instantly to the user's scroll position.
