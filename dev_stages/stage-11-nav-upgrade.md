# Stage 11: Navigation Glassmorphism Upgrade

In this stage, we upgraded the navigation bar from a basic solid-color design to a premium **glassmorphism** effect and fixed a critical white-on-white visibility bug.

---

## The Bug We Fixed

On the **home page**, the nav started with a `.transparent` class so it would overlay the hero video. The CSS set all nav text to white (`#FFFFFF`). However, the background was also transparent, meaning:

- If the video hadn't loaded yet → white text on white/light page = **invisible**
- If the video was bright → white text was very hard to read
- The transition from transparent to solid was abrupt, with no smooth animation

## What is Glassmorphism?

Glassmorphism is a modern UI design trend where elements appear as **frosted glass panels**. The key CSS property is `backdrop-filter: blur()`.

```css
.glass-element {
    background-color: rgba(255, 255, 255, 0.75); /* semi-transparent white */
    backdrop-filter: blur(12px);                   /* blurs content BEHIND the element */
}
```

### How `backdrop-filter` Works

Unlike regular `filter` (which blurs the element itself), `backdrop-filter` blurs everything **behind** the element. Think of it like looking through a frosted bathroom window — you can see shapes and colors but not details.

The combination of a semi-transparent background color + blur creates the "glass" illusion:
1. `rgba(255, 255, 255, 0.75)` → 75% opaque white tint
2. `blur(12px)` → everything behind the nav is softly blurred
3. Together → the nav looks like a panel of frosted glass floating over the page

---

## What We Changed

### Default State (All Pages)
```css
.site-nav {
    background-color: rgba(255, 255, 255, 0.75);  /* light frosted glass */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);           /* Safari needs the prefix */
    border-bottom: 1px solid rgba(0, 0, 0, 0.06); /* ultra-subtle divider */
}
```

### Dark Mode State
```css
[data-mode="dark"] .site-nav {
    background-color: rgba(18, 18, 18, 0.8);              /* dark frosted glass */
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);   /* faint light border */
}
```

### Transparent State (Home Page Hero)
```css
.site-nav.transparent {
    background-color: rgba(0, 0, 0, 0.2);     /* dark tinted glass over the video */
    backdrop-filter: blur(10px);                /* blur the video behind the nav */
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
```

This is the key fix: instead of `background: transparent` (which gave us zero contrast), we now use `rgba(0, 0, 0, 0.2)` + `blur(10px)`. This creates a subtle dark frosted glass panel over the hero video, guaranteeing white text is **always readable**.

---

## Browser Support

`backdrop-filter` is supported by all modern browsers:
- Chrome 76+ ✅
- Firefox 103+ ✅
- Safari 9+ ✅ (with `-webkit-` prefix)
- Edge 17+ ✅

We include both the standard and `-webkit-` prefixed versions for maximum compatibility.
