# Stage 1 — Project Setup

**What we do in this stage:**
Create the folder structure and all empty files. No real code yet — just the skeleton.

**Why we do it first:**
Before writing a single line of CSS or HTML, you need to see the full shape of the project.
If the structure is wrong from the start, everything built on top of it will be messy.
Think of this like laying the floor plan of a building before you pour concrete.

---

## The Final Folder Structure

After this stage, the project looks like this:

```
project/
│
├── .git/                   ← Git version control (created automatically by `git init`)
├── .gitignore              ← Tells git which files to ignore
├── notes.md                ← Your team notes (already existed)
├── color-demo.html         ← Design review file (not part of final site)
│
├── index.html              ← EMPTY — Home page (will be filled in Stage 4)
├── region.html             ← EMPTY — Region page (Stage 5)
├── landmark.html           ← EMPTY — Landmark detail (Stage 6)
├── blog.html               ← EMPTY — Blog page (Stage 8)
├── contact.html            ← EMPTY — Contact page (Stage 8)
│
├── css/
│   ├── global.css          ← EMPTY — The design system (Stage 2)
│   ├── home.css            ← EMPTY — Home-only styles (Stage 4)
│   ├── region.css          ← EMPTY — Region-only styles (Stage 5)
│   └── landmark.css        ← EMPTY — Landmark-only styles (Stage 6)
│
├── js/
│   ├── nav.js              ← EMPTY — Shared navigation logic (Stage 3)
│   ├── region.js           ← EMPTY — Landmark grid logic (Stage 5)
│   └── landmark.js         ← EMPTY — Landmark detail logic (Stage 6)
│
├── assets/
│   ├── landmarks.json      ← Already exists. 90 landmarks.
│   ├── landmark_images.json← Already exists. Image lists.
│   ├── regions.json        ← Already exists. 9 regions.
│   └── images/             ← Already exists. All photos.
│
└── dev_stages/             ← This folder. Documentation only.
    ├── README.md
    ├── stage-00-design-decisions.md
    └── stage-01-project-setup.md   ← YOU ARE HERE
```

---

## Why Are There Separate CSS Files?

**One `global.css` + one CSS file per page.**

This is called **"separation of concerns"** — each file has one job and one job only.

| File | Its Only Job |
|---|---|
| `global.css` | Define fonts, colors (as CSS variables), the nav bar, the footer, buttons. Things used on EVERY page. |
| `home.css` | Layout rules that ONLY affect `index.html`. Hero section, region group layout, etc. |
| `region.css` | Layout rules ONLY for `region.html`. The landmark card grid, filter bar. |
| `landmark.css` | Layout rules ONLY for `landmark.html`. The gallery, the description block. |

**Why not one big `style.css`?**

Imagine you have a bug where a card on the region page looks wrong.
With one file, you search through 600+ lines of CSS.
With separated files, you open `region.css` (maybe 120 lines) and the problem is obvious.

Also: each HTML page only loads what it needs.
`index.html` loads `global.css` + `home.css`.
`region.html` loads `global.css` + `region.css`.
This keeps each page fast and clean.

---

## Why Are There Separate JS Files?

Same principle as CSS. Each JS file has one job.

| File | Its Only Job |
|---|---|
| `nav.js` | Highlight the currently active nav link. Used on all pages. |
| `region.js` | Read `landmarks.json`, filter by region ID from the URL, create landmark cards. |
| `landmark.js` | Read `landmarks.json` + `landmark_images.json`, find the right landmark by ID, build the gallery and description. |

**There is no `home.js`.** The home page (`index.html`) is 100% static HTML.
No JavaScript is needed to display a list of 9 hardcoded regions. This is intentional.
Less JS = simpler = better.

---

## Version Control — Git

We use **Git** to track every change to the project.

### What is Git?

Git is a tool that takes "snapshots" of your project at moments you choose.
Each snapshot is called a **commit**. If something breaks, you can go back to any previous snapshot.

### How we use it in this project

We commit after every meaningful stage. The commit history will look like:

```
chore: initialize project with design docs and color demo     ← Stage 0 (done)
chore: set up project folder structure                        ← Stage 1 (this stage)
feat: add global CSS design system                            ← Stage 2
feat: add navigation and footer                              ← Stage 3
feat: build home page                                        ← Stage 4
... and so on
```

### The commit message format

We use a simple prefix system (called "Conventional Commits"):

| Prefix | Meaning | Example |
|---|---|---|
| `feat:` | A new feature or page | `feat: build landmark detail page` |
| `fix:` | Fixing something broken | `fix: modal close button not working` |
| `chore:` | Setup, config, no visible change | `chore: add .gitignore` |
| `style:` | CSS changes only | `style: adjust card spacing` |
| `docs:` | Documentation only | `docs: add stage 2 explanation` |

This makes the history readable. Anyone on your team can look at the commit list
and understand what changed and why, without opening any files.

### The existing `.git` inside `assets/`

When you first explored the project, there was a `.git` folder inside `assets/`.
This was from a previous session. We initialized a **new, correct** git repository
at the **project root** level (`project/.git/`), which tracks everything:
HTML, CSS, JS, and the assets folder together.

Git is smart enough to ignore any `.git` folder inside a subdirectory (it's called a "submodule" situation and Git just skips it), so this does not cause any conflict.

---

## The Commands We Ran

```bash
# 1. Create the css/ and js/ folders
mkdir -p css js

# 2. Create all the empty HTML, CSS, and JS files at once
touch index.html region.html landmark.html blog.html contact.html
touch css/global.css css/home.css css/region.css css/landmark.css
touch js/nav.js js/region.js js/landmark.js

# 3. Initialize git at the project root
git init

# 4. Stage files for first commit (the . means "add everything")
git add .gitignore notes.md color-demo.html dev_stages/

# 5. Create the first commit
git commit -m "chore: initialize project with design docs and color demo"
```

**What does `touch` do?**
`touch filename` creates an empty file if it doesn't exist. That's all.
We use it here just to create the file placeholders so the structure is visible.

**What does `mkdir -p` do?**
`mkdir` = "make directory". The `-p` flag means "make parent directories too if needed".
So `mkdir -p css js` creates both the `css/` and `js/` folders in one command.

---

## ✅ Stage 1 Checklist

- [x] `css/` folder created
- [x] `js/` folder created
- [x] All 5 HTML files created (empty)
- [x] All 4 CSS files created (empty)a
- [x] All 3 JS files created (empty)
- [x] Git initialized at project root
- [x] First commit made
- [x] Stage committed to git

---

## Next: Stage 2 — The Global Design System (`global.css`)

In Stage 2 we fill `global.css` with:
- The font import (Google Fonts)
- All CSS custom properties (variables) for colors, spacing
- The CSS reset (removes browser default margins/paddings)
- The navigation bar styles
- The footer styles
- The button styles

This is the most important file in the project because everything else depends on it.
