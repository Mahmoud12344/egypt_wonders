# Contact Page Tutorial — `contact.html`

> **What is this file?** This is an exhaustive, beginner-friendly tutorial explaining every single line of HTML and CSS used to build the Contact page and its form.

---

## 1. The HTML Basics (The Structure)

### The Contact Header
```html
<header class="contact-header">
    <h1>Get in Touch</h1>
    <p>Have a question about a landmark? We'd love to hear from you.</p>
</header>
```
* **`<header>`**: A semantic box used to group introductory content. It acts just like a `<div>`, but helps screen readers (software for blind users) understand the layout.
* **`<h1>`**: "Heading 1". The largest title on the page.
* **`<p>`**: "Paragraph". Used for normal text.

### The Form Element
A form is how websites collect information from users (like a message, an email, or a password).

```html
<form class="contact-form" action="mailto:contact@egyptwonders.edu" method="post" enctype="text/plain" novalidate>
```
* **`<form>`**: The invisible wrapper that holds all the text boxes and submit buttons together.
* **`action="mailto:..."`**: This tells the form where to send the data when the user clicks submit. Using `mailto:` tells the computer to open the user's default email app (like Outlook or Gmail) to send the message. (In a real professional website, this would point to a backend server database).
* **`method="post"`**: Tells the browser to send the data secretly in the background, rather than attaching it to the URL at the top of the browser.
* **`enctype="text/plain"`**: Formats the data as plain readable text so it looks nice in the email.
* **`novalidate`**: Turns off the browser's ugly default red error messages when a user leaves a box empty.

### A Form Group (Label + Input)
We group every input box with a label so they stay together nicely.

```html
<div class="form-group">
    <label class="form-label" for="contact-name">Full Name</label>
    <input class="form-input" type="text" id="contact-name" name="name" placeholder="Your full name" required>
</div>
```
* **`<div>`**: An empty box used to group the label and the input together.
* **`<label>`**: The text that tells the user what to type.
    * **`for="contact-name"`**: This connects the label directly to the input box. If you click the word "Full Name", the computer will automatically put your typing cursor into the text box.
* **`<input>`**: The actual box where the user types.
    * **`type="text"`**: Means this is a standard, single-line text box.
    * **`id="contact-name"`**: A unique identifier. The `<label for="contact-name">` looks for this exact ID to connect them.
    * **`name="name"`**: This is the "key" used when the data is sent. The email will say `name = Hossam`.
    * **`placeholder="Your full name"`**: The faint gray text that appears inside the box before the user starts typing to give them a hint.
    * **`required`**: Tells the browser "the user is not allowed to submit the form if this box is empty."

### The Email Input
```html
<input class="form-input" type="email" id="contact-email" name="email" required>
```
* **`type="email"`**: This is special. If a user is on a mobile phone, using `type="email"` tells their phone's keyboard to automatically show the `@` symbol and `.com` buttons, making it much easier to type!

### The Message Box
```html
<textarea class="form-textarea" id="contact-message" name="message" required></textarea>
```
* **`<textarea>`**: An `<input>` only allows one single line of text. A `<textarea>` is a large box that allows multiple lines (paragraphs) of text, perfect for long messages. Unlike input, it requires a closing `</textarea>` tag.

### The Submit Button
```html
<button class="btn-solid form-submit" type="submit">Send Message →</button>
```
* **`<button>`**: A clickable button.
* **`type="submit"`**: Tells the button "when clicked, collect all the data in the `<form>` and trigger the `action` (which opens the email app)."

---

## 2. The CSS Basics (The Styling)

### Stacking the Form
```css
.contact-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}
```
* **`display: flex;`**: Turns the form into a "flexbox". This is a powerful layout system that makes aligning things extremely easy.
* **`flex-direction: column;`**: By default, flexbox aligns things horizontally side-by-side. `column` tells it to stack the form fields vertically, one on top of the other.
* **`gap`**: Adds empty space (24 pixels) between each form group, so they aren't squished together.

### Styling the Inputs
```css
.form-input, .form-textarea {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    padding: 0.75rem 1rem;
    width: 100%;
    outline: none;
    transition: border-color 0.3s;
}
```
* **`.form-input, .form-textarea`**: The comma means "apply these exact same rules to BOTH the inputs and the textarea."
* **`background`**: Sets the color inside the box.
* **`border`**: Draws a 1-pixel solid line around the box.
* **`border-radius`**: Rounds the sharp corners slightly.
* **`padding`**: Adds breathing room inside the box so the text you type doesn't touch the borders.
* **`width: 100%;`**: Forces the boxes to stretch all the way across the screen.
* **`outline: none;`**: By default, web browsers put an ugly thick blue ring around a text box when you click it. This turns that blue ring off so we can make our own.
* **`transition`**: Prepares the box to smoothly animate its border color when clicked.

### The Focus Effect (When you click the box)
```css
.form-input:focus, .form-textarea:focus {
    border-color: var(--accent);
}
```
* **`:focus`**: This pseudo-class ONLY activates when the user has clicked inside the text box and is ready to type.
* **`border-color: var(--accent);`**: We change the border color to our gold accent color. Because we added `transition` above, the color fades in smoothly instead of snapping.

### Making the Textarea Taller
```css
.form-textarea {
    min-height: 160px;
    resize: vertical;
}
```
* **`min-height: 160px;`**: Makes the message box starting size much taller than the single-line inputs so it looks like a place to write paragraphs.
* **`resize: vertical;`**: Most browsers put a little drag-handle in the corner of textareas so users can stretch them. This rule says "you are only allowed to stretch it taller (vertical). You cannot stretch it wider, because that would break our beautiful layout!"

### The Submit Button Alignment
```css
.form-submit {
    align-self: flex-start;
}
```
* **`align-self: flex-start;`**: Because the form is a vertical flexbox, it normally stretches everything to 100% width. We don't want a giant, massive submit button. `flex-start` tells the button "stop stretching, just be your normal size and sit on the left side (the start)."
