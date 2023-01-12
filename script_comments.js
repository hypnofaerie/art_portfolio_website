// returns the button element object with the name attribute "grid-button", store result in const
const grid_button = document.querySelector("[name='grid-button']"); // Element object
// stores - fuction returns div object with the class "expanded-menu"
const menu = document.querySelector(".expanded-menu");
// returns button object with name attribute "close-button"
const close_button = document.querySelector("[name='close-button']");
// returns div object with the class "gallery-container"
const gallery = document.querySelector(".gallery-container");
// ! sketch object
const sketch = {
    // property that returns h2 object with the id "sketch-title"
    title : document.querySelector("#sketch-title"),
    // returns p object with the id "sketch-description"
    description: document.querySelector("#sketch-description"),
    // returns iframe object
    container: document.querySelector("iframe"),
    // returns h1 object from a div the class "name-container"
    name: document.querySelector(".name-container h1"),
    // returns index of current visible sketch from array GALLERY_ITEMS
    current: 0
};
// returns ALL button objects with attribute "data-direction", all = node list element array
const direction_buttons = document.querySelectorAll("[data-direction]");

// toggles visibility of menu
function toggleMenu() {
    // toggles the class attribute "visible" of menu constant
    menu.classList.toggle("visible");
}

// updates(replaces) existing html elements contents
function updateSketchInfo(data) {
    // updates(replaces) sketch title content
    sketch.title.innerHTML = data.title;
    // updates(replaces) sketch description content
    sketch.description.innerHTML = data.description;
}

// creates & updates sketch gallery
function initGallery() {

    // loop through all existing objects from "GALLERY_ITEMS" array
    for (let i = 0; i < GALLERY_ITEMS.length; i++) {
        // stores current object from array
        const current_data = GALLERY_ITEMS[i];
        // create new div element and store it into var item (not appended yet to anything, only exists in memory)
        const item = createGalleryItem(current_data.image);
        // inserts item object as direct child to div (all appended will be direct children)
        gallery.append(item);

        // listens for mouseenter event within div
        item.addEventListener('mouseenter',  (event) => {
            // updates title & description when the mouse position is within that object
            updateSketchInfo(current_data);
        });

        // listens for click event on div
        item.addEventListener('click',  (event) => {
            // calls "updateCurrentSketch" function
            updateCurrentSketch(i, false);
            // calls "toggleMenu" function
            toggleMenu();
        });

        // checks if object has property "active"
        if (current_data.active) {
            // if object has "active" property calls "updateCurrentSketch" function
            updateCurrentSketch(i);
        }
    }

    // loops through direction buttons (left button, right button)
    for (const current_button of direction_buttons) {
        // listens for click event on button
        current_button.addEventListener('click',  (event) => {
            // access button direction
            const current_direction = event.target.dataset.direction;
            // returns value -1 if direction is left, value 1 if direction is right
            const index_modifier = current_direction == "left" ? -1 : 1;
            // returns current index of object from "GALLERY_ITEMS" array by adding or subtracting 1 to/from initial index everytime the mouse is clicked
            let current_index = sketch.current + index_modifier

            // make sure index stays between 0 - array length-1
            if (current_index < 0) {
                current_index = GALLERY_ITEMS.length - 1;
            }
            if (current_index > GALLERY_ITEMS.length - 1) {
                current_index = 0;
            }

            // stores item at current index
            const current_data = GALLERY_ITEMS[current_index];
            // calls "updateCurrentSketch" function
            updateCurrentSketch(current_index);
        });
    }
}

// updates info of current sketch, takes 2 parameters
// index = integer, index of array()
// boolean update_info - check if we update title and description too
function updateCurrentSketch(index, update_info = true) {
    // stores current sketch data
    const current_data = GALLERY_ITEMS[index];
    // sets source attribute of iframe element
    sketch.container.setAttribute("src", current_data.source);
    // updates title of sketch (h1 element)
    sketch.name.innerHTML = current_data.title;
    // updates index of current sketch
    sketch.current = index;
    // checks if boolean is true
    if (update_info == true) {
        // if true, calls function that updates title and description of sketch
        updateSketchInfo(current_data);
    }
}

// creates html elements
function createGalleryItem(image_src) {
    // creates new div element
    const newDiv = document.createElement("div");
    // adds class to div element
    newDiv.classList.add("gallery-item");
    // creates a element
    const newA = document.createElement("a");
    // creates img element
    const newImg = document.createElement("img");
    // sets source attribute to image
    newImg.setAttribute("src", image_src);
    // newImg.setAttribute("src", item_data.image);

    // inserts img element into a element
    newA.append(newImg);
    // inserts a element into div
    newDiv.append(newA);

    // returns div
    return newDiv;
}

// calls "initGallery" function
initGallery();
// listens for click event on grid button, toggles menu when clicked
grid_button.addEventListener('click', toggleMenu);
// listens for click event on close button, toggles menu when clicked
close_button.addEventListener('click', toggleMenu);
