# Stage 8 — Video Hero Background

**What we do in this stage:**
Replace the static background image on the home page with a dynamic, autoplaying cinematic video.

---

## The Problem with Raw Video Files

The video provided (`f_b_a_ee_a_mp_.mp4`) was beautiful, but it had a few technical issues that make it unsuitable to be placed directly on a web page:
1. **Size:** It was 8.2 MB. This is too large for a hero background and would slow down the initial page load significantly, especially on mobile networks.
2. **Audio:** It contained an audio track. Browsers intentionally block videos with audio from autoplaying. To ensure a background video autoplays instantly, it must have no audio (or be strictly muted in the HTML tag).
3. **Moov Atom (Fast Start):** MP4 files often have their metadata at the *end* of the file. This means the browser has to download the entire 8 MB file before it can even start playing frame 1.

## The Solution: FFmpeg Preprocessing

We used the command-line tool `ffmpeg` to completely optimize the video for the web.

```bash
ffmpeg -i f_b_a_ee_a_mp_.mp4 \
  -vcodec libx264 -crf 28 -preset fast \
  -an \
  -movflags +faststart \
  assets/videos/hero-bg.mp4
```

**What this command did:**
- `-vcodec libx264 -crf 28`: Re-encoded the video using H.264 compression with a Constant Rate Factor of 28. This drastically reduced the file size from **8.2 MB down to 3.1 MB** while keeping the visual quality perfectly fine for a background element.
- `-an`: Completely stripped the audio track from the file.
- `-movflags +faststart`: Moved the "moov atom" (metadata) to the very beginning of the file. Now, the browser can start playing the video almost instantly while the rest streams in the background.

---

## HTML Implementation

In `index.html`, we removed the `background-image` from CSS and inserted a true `<video>` element.

```html
<video class="hero-video" autoplay loop muted playsinline poster="assets/images/Great_Pyramid_of_Giza/0.jpg">
    <source src="assets/videos/hero-bg.mp4" type="video/mp4">
</video>
```

**Key Attributes for Web Backgrounds:**
- `autoplay`: Starts immediately without user interaction.
- `loop`: Repeats endlessly.
- `muted`: Absolutely mandatory. Without this, Safari, Chrome, and iOS will block the autoplay.
- `playsinline`: Mandatory for iPhones. Without this, iOS tries to open the video in the native fullscreen media player instead of keeping it in the background of the page.
- `poster`: An image that displays for the split second before the video buffers, or permanently if the user has data-saver mode enabled and the browser refuses to load the video.

---

## CSS Implementation

In `css/home.css`, we needed the `<video>` to behave exactly like `background-size: cover`.

```css
.hero {
    position: relative;
    overflow: hidden; /* Prevents the video from breaking page layout */
}

.hero-video {
    position:   absolute;
    top:        50%;
    left:       50%;
    min-width:  100%;
    min-height: 100%;
    transform:  translate(-50%, -50%);
    object-fit: cover;
    z-index:    0;
}
```

**How it works:**
1. `position: absolute` with `top: 50%` and `left: 50%` places the absolute center of the video in the exact center of the hero section.
2. `transform: translate(-50%, -50%)` shifts the video back by half its own width and height, perfectly aligning it.
3. `min-width: 100%` and `min-height: 100%` ensure it never leaves blank space in the container.
4. `object-fit: cover` ensures the video scales correctly without stretching or distorting its aspect ratio. It crops the edges if necessary, exactly like `background-size: cover` does for images.

## ✅ Stage 8 Checklist
- [x] Compress and optimize MP4 video using `ffmpeg` (8.2MB → 3.1MB).
- [x] Strip audio and enable `faststart`.
- [x] Add `<video autoplay loop muted playsinline>` to `index.html`.
- [x] Configure fallback `poster` image.
- [x] Update `css/home.css` with object-fit absolute centering trick.
- [x] Verify text overlay remains completely readable over the moving video.
