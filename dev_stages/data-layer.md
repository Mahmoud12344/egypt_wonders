# Data Layer Tutorial — `landmarks.json` and `regions.json`

> **What is this file?** This is an exhaustive, beginner-friendly tutorial explaining the "Data Layer" of our application. Instead of hardcoding all our landmarks directly into HTML files, we store them in a structured text format called JSON. This allows our JavaScript to fetch the data dynamically and build the pages for us!

---

## 1. What is JSON?

**JSON** stands for "JavaScript Object Notation". It is simply a way to write data (like a list of cities, or details about a landmark) into a plain text file using a very specific set of rules.

Because the rules are so strict, computers (and JavaScript) can read these files extremely quickly and easily turn them into usable data.

Here are the strict rules of JSON:
1. **Objects** are wrapped in curly braces `{}`. They hold specific details about one thing.
2. **Arrays (Lists)** are wrapped in square brackets `[]`. They hold a list of multiple objects.
3. **Strings (Text)** must always be wrapped in "double quotes". Single quotes are not allowed.
4. **Keys and Values** are separated by a colon `:`. (e.g., `"name": "Ahmed"`). The key (label) MUST be in double quotes.
5. **Numbers and Booleans** (true/false) do not use quotes. (e.g., `"age": 25`).
6. **Separation**: Items in a list or details in an object must be separated by a comma `,`, but the *last* item is not allowed to have a comma!

---

## 2. The Regions File (`assets/regions.json`)

This file contains a list of all the major geographical regions in Egypt.

### The Structure
```json
[
  {
    "id": "cairo",
    "name": "Greater Cairo",
    "description": "The bustling capital region, home to the Pyramids and Islamic history.",
    "thumbnail": "images/Great_Pyramid_of_Giza/0.jpg",
    "iconic_landmark": "Giza Necropolis"
  },
  {
    "id": "nile-valley",
    "name": "Nile Valley",
    "description": "The agricultural heartland of ancient Egypt, featuring Luxor and Aswan.",
    "thumbnail": "images/Temple_of_Karnak/0.jpg",
    "iconic_landmark": "Luxor Temple"
  }
]
```

### Line-by-Line Explanation
* **`[`**: The opening square bracket at the very top. This tells the computer: "I am about to give you a List (Array) of items."
* **`{`**: The opening curly brace. This means: "I am creating an Object. Everything inside this object belongs to one single Region."
* **`"id": "cairo"`**: This is a Key-Value pair.
    * `"id"` is the Key (the label).
    * `"cairo"` is the Value (the data).
    * We use this simple `id` in our URLs (like `region.html?id=cairo`) so our JavaScript can search this file and find the exact region the user clicked on.
* **`"name": "Greater Cairo"`**: The human-readable name we print on the screen.
* **`"description": "..."`**: A paragraph of text explaining the region.
* **`"thumbnail": "images/..."`**: A text string containing the file path to an image. Our JavaScript will take this string and put it inside an HTML `<img>` tag (`<img src="images/...">`).
* **`"iconic_landmark": "Giza Necropolis"`**: Just a cool fact we display on the region card.
* **`},`**: The closing curly brace ends the object for Cairo. The comma `,` means: "Wait! There is another region coming next."
* **`{ ... }`**: The object for the Nile Valley. Notice there is NO comma after this object, because it is the last item in the list!
* **`]`**: The closing square bracket. This tells the computer: "The list is finished."

---

## 3. The Landmarks File (`assets/landmarks.json`)

This file contains the giant database of all 90 landmarks! It is much larger, but follows the exact same rules.

### The Structure
```json
[
  {
    "id": "64325",
    "name": "Great Pyramid of Giza",
    "description": "The oldest and largest of the three pyramids in the Giza Necropolis.",
    "governorate": "Giza Governorate",
    "coordinates": {
      "lat": 29.9792,
      "lng": 31.1342
    },
    "imagePath": "images/Great_Pyramid_of_Giza/0.jpg",
    "category": "Ancient Egyptian & Pharaonic",
    "region": "Greater Cairo",
    "ticket_price": "200 EGP",
    "visiting_hours": "08:00 AM - 05:00 PM"
  }
]
```

### Line-by-Line Explanation
* **`[`**: Opening the Array list.
* **`{`**: Opening the Object for the Great Pyramid.
* **`"id": "64325"`**: We use numbers for the ID here. This ID matches the `landmark_images.json` file so we can find galleries for it later.
* **`"name"`, `"description"`, `"governorate"`**: Standard text strings used to populate the UI cards.
* **`"coordinates": { ... }`**: This is an Object *inside* an Object! It allows us to group related data.
    * **`"lat": 29.9792`**: The latitude coordinate. Notice there are no quotes around `29.9792`. This tells the computer it is a Math Number, not text.
    * **`"lng": 31.1342`**: The longitude coordinate. We use these numbers if we ever wanted to plot the landmark on a Google Map.
* **`"category": "Ancient Egyptian & Pharaonic"`**: We use these categories in `index.html` to filter landmarks. If the user clicks "Pharaonic", our JavaScript searches this file for all objects that have this exact category string.
* **`"region": "Greater Cairo"`**: This is a very important connection (relational data). If the user clicks on the "Greater Cairo" region card, our JavaScript opens `region.html`, looks at `landmarks.json`, and searches for every single landmark that has `"region": "Greater Cairo"` to display on that page.
* **`"ticket_price"` and `"visiting_hours"`**: Practical information we show on the Landmark Detail page.

---

## 4. The Gallery File (`assets/landmark_images.json`)

This file is a bit different. Instead of just a list `[]`, it starts as an Object `{}` with some helpful metadata, and *then* provides the list.

### The Structure
```json
{
  "metadata": {
    "total_landmarks": 90,
    "total_images": 960
  },
  "landmarks": [
    {
      "id": "64325",
      "name": "Great Pyramid of Giza",
      "image_count": 12,
      "images": [
        { "filename": "0.jpg", "path": "images/Great_Pyramid_of_Giza/0.jpg" },
        { "filename": "1.jpg", "path": "images/Great_Pyramid_of_Giza/1.jpg" }
      ]
    }
  ]
}
```

### Line-by-Line Explanation
* **`{`**: Starts the main Object.
* **`"metadata": { ... }`**: This is a small group of numbers telling us facts about the file. It tells us there are 90 landmarks and 960 images total. We don't show this to the user; it's just helpful for developers.
* **`"landmarks": [`**: This is the Key for our giant list of galleries.
    * **`{`**: Opens the Object for the Great Pyramid gallery.
    * **`"id": "64325"`**: This perfectly matches the ID in `landmarks.json`! This is how we connect them.
    * **`"image_count": 12`**: Tells us there are 12 photos available.
    * **`"images": [`**: A list *inside* an object, *inside* a list! This is an array of objects representing each individual photo.
        * **`{ "filename": "0.jpg", "path": "images/Great_Pyramid_of_Giza/0.jpg" }`**: An object containing the exact file path to one specific image.
        * Our JavaScript reads this list and creates an HTML `<img src="...">` tag for every single item, creating the beautiful photo gallery carousel on the Landmark page!
