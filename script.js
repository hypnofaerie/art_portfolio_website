const grid_button = document.querySelector("[name='grid-button']");
const menu = document.querySelector(".expanded-menu");
const close_button = document.querySelector("[name='close-button']");
const gallery = document.querySelector(".gallery-container");
const sketch = {
    title : document.querySelector("#sketch-title"),
    description: document.querySelector("#sketch-description"),
    container: document.querySelector("iframe"),
    name: document.querySelector(".name-container h1"),
    current: 0
};
const direction_buttons = document.querySelectorAll("[data-direction]");
const controls_container = document.querySelector(".controls-container");
const simpleBar = new SimpleBar(document.getElementById('gallery-scroll'), { autoHide: false });

function updateURL(new_hash) {
    console.log(new_hash);
    let myURL = new URL(document.URL);
    myURL.hash = '#' + new_hash;
    document.location.href = myURL.href;
}

function showMenu() {
    menu.classList.add("visible");
    const current_data = GALLERY_ITEMS[sketch.current];
    updateSketchInfo(current_data);
    simpleBar.recalculate();
    updateURL('gallery');
}

function hideMenu() {
    menu.classList.remove("visible");
    sketch.container.focus();
    const current_data = GALLERY_ITEMS[sketch.current];
    updateURL(current_data.anchor);
}

function updateSketchInfo(data) {
    sketch.title.innerHTML = data.title;
    sketch.description.innerHTML = data.description;
}

function initGallery() {
    let myURL = new URL(document.URL);
    const hash_index_found = GALLERY_ITEMS.findIndex(({ anchor }) => myURL.hash === '#' + anchor);
    if (myURL.hash == "#gallery") showMenu();

    for (let i = 0; i < GALLERY_ITEMS.length; i++) {
        const current_data = GALLERY_ITEMS[i];
        const item = createGalleryItem(current_data.image);

        item.addEventListener('mouseenter',  (event) => {
            updateSketchInfo(current_data);
        });
        item.addEventListener('click',  (event) => {
            updateCurrentSketch(i, false);

            hideMenu();
        });
        item.dataset.index = i;
        gallery.append(item);

        if ((hash_index_found == -1 && current_data.active) || hash_index_found == i) {
            item.classList.add('active');
            updateCurrentSketch(i);
        }
    }

    for (const current_button of direction_buttons) {
        current_button.addEventListener('click',  (event) => {
            const current_direction = event.target.dataset.direction;
            const index_modifier = current_direction == "left" ? -1 : 1;
            let current_index = sketch.current + index_modifier

            if (current_index < 0) {
                current_index = GALLERY_ITEMS.length - 1;
            }
            if (current_index > GALLERY_ITEMS.length - 1) {
                current_index = 0;
            }

            updateCurrentSketch(current_index);
        });
    }

}

function updateCurrentSketch(index, update_info = true) {
    const current_data = GALLERY_ITEMS[index];
    sketch.container.setAttribute("src", current_data.source);
    sketch.name.innerHTML = current_data.title;
    sketch.current = index;
    controls_container.innerHTML = current_data.controls;
    if (update_info == true) {
        updateSketchInfo(current_data);
    }
    sketch.container.focus();

    let old_active_item = document.querySelector(".gallery-item.active")
    old_active_item.classList.remove("active")
    let index_selector = "[data-index='" + index + "']"
    let new_active_item = document.querySelector(index_selector)
    new_active_item.classList.add("active")

    updateURL(current_data.anchor);
}

function createGalleryItem(image_src) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("gallery-item");
    const newA = document.createElement("a");
    const newImg = document.createElement("img");
    newImg.setAttribute("src", image_src);
    // newImg.setAttribute("src", item_data.image);

    newA.append(newImg);
    newDiv.append(newA);

    return newDiv;
}

initGallery();
grid_button.addEventListener('click', showMenu);
close_button.addEventListener('click', hideMenu);
