# Scroll Reveal Animation Tutorial — `scroll-reveal.md`

> **What is this file?** This is an exhaustive, beginner-friendly tutorial explaining how we make elements smoothly animate and slide up the screen as the user scrolls down the page! We use CSS for the animation itself, and JavaScript to trigger it at the perfect moment.

---

## 1. The CSS Basics (The Animation)

In our CSS file (`global.css`), we prepare the elements to be animated.

### Setting Up the Element
```css
.reveal-element {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s, transform 0.8s;
}
```
* **`.reveal-element`**: We add this class to any HTML element we want to animate (like a card, a title, or an image).
* **`opacity: 0;`**: This makes the element completely invisible (0% visible).
* **`transform: translateY(40px);`**: This physically moves the element 40 pixels *downwards* from where it is supposed to be.
* **`transition`**: This is the magic rule! It tells the browser: "If the opacity or the transform changes, DO NOT change it instantly. Animate the change smoothly over `0.8s` (0.8 seconds)."

### The "Visible" State
```css
.reveal-element.reveal-visible {
    opacity: 1;
    transform: translateY(0);
}
```
* **`.reveal-element.reveal-visible`**: This targets an element that has BOTH classes at the same time.
* **`opacity: 1;`**: Changes the visibility to 100% visible.
* **`transform: translateY(0);`**: Moves the element back to exactly where it was originally supposed to be (0 pixels away).

**How it works together:** Because of the `transition` rule we wrote above, when the `reveal-visible` class is added, the element will spend 0.8 seconds slowly fading in (from 0 to 1 opacity) and sliding up (from 40px down to 0px).

---

## 2. The JavaScript Basics (The Trigger)

CSS handles the *how* it animates, but JavaScript handles the *when*. We want the animation to trigger exactly when the user scrolls down and looks at the element.

If we animated everything when the page loaded, the user wouldn't see the animations at the bottom of the page!

This code lives in `js/reveal.js`.

### Waiting for the Page to Load
```javascript
document.addEventListener('DOMContentLoaded', function() {
```
* **`document`**: Refers to the entire HTML web page.
* **`addEventListener(...)`**: Tells the browser to listen for a specific event.
* **`'DOMContentLoaded'`**: This event fires when the browser has finished reading the HTML skeleton. We wait for this because we cannot animate elements if they haven't been drawn yet!
* **`function() { ... }`**: The code inside here will run as soon as the HTML is ready.

### Creating the Observer
We use a tool built into modern web browsers called the `IntersectionObserver`. Think of it as a camera man whose only job is to watch the screen and yell out when an element walks into the camera frame.

```javascript
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
```
* **`const`**: Creates a variable that won't change.
* **`{ ... }`**: An object holding our settings for the camera man.
* **`root: null`**: Tells the camera man to watch the main browser window (the viewport).
* **`threshold: 0.1`**: This is the most important setting! It means "Yell out as soon as **10%** of the element is visible on the screen." If we set it to `1.0`, we would have to scroll until 100% of the element was visible before it animated.

```javascript
    const observer = new IntersectionObserver(function(entries, observer) {
```
* **`new IntersectionObserver(...)`**: This creates the actual camera man using our settings from above.
* **`function(entries, observer)`**: This is the action the camera man takes when he spots an element. `entries` is a list of all the elements he is currently looking at.

```javascript
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
```
* **`.forEach(...)`**: We loop through every single element the camera man is looking at.
* **`if (entry.isIntersecting)`**: We ask: "Is this specific element currently visible on the screen?"
* **`entry.target.classList.add('reveal-visible')`**: If it IS visible, we grab the element (`target`) and add our CSS class (`reveal-visible`) to it! This instantly triggers our CSS fade-in-up animation!
* **`observer.unobserve(entry.target);`**: We tell the camera man: "Okay, you animated this element. Stop watching it." If we didn't do this, the element would animate every single time we scrolled up and down past it, which is very annoying! This ensures the animation only happens *once*.

### Giving the Camera Man His Targets
We created the camera man and told him what to do, but we haven't told him *what* to watch yet!

```javascript
    const revealElements = document.querySelectorAll('.reveal-element');
```
* **`document.querySelectorAll('.reveal-element')`**: We search the entire HTML page and grab a list of EVERY single element that has the `class="reveal-element"`.

```javascript
    revealElements.forEach(function(el) {
        observer.observe(el);
    });
});
```
* **`.forEach(...)`**: We loop through our list of elements.
* **`observer.observe(el);`**: We point the camera man at each element and say: "Watch this one!"

Now, as the user scrolls down the page, the camera man watches. When an element crosses the 10% threshold, he adds the `reveal-visible` class, the CSS animation triggers, and the element beautifully slides onto the screen!
