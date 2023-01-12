let num =  800 //1111   //1200
let x = []            // pos
let y = []
let vx = []           // vel
let vy = []
let ax = []           // acc
let ay = []
let attraction = 100  // 18 for lines closer to one another, 80 for more distance and ease of movement
let ct = 2
let radius = 2     // 1 - 2.5
let slower = 0.95


let d_width = 2195;
let d_height = 1092;
let width = window.innerWidth;
let height = window.innerHeight;
let scale_width = width / d_width;
let scale_height = height / d_height;

let is_looping = true;

function windowResized() {
    width = windowWidth;
    height = windowHeight;
    scale_width = width / d_width;
    scale_height = height / d_height;

    resizeCanvas(windowWidth, windowHeight);
    background(0);
    initPoints();
}

function setup() {
    createCanvas(width, height);
    background(0);
    noStroke();
    fill(0);
    initPoints();
    document.addEventListener('keydown', keyboardEvent);
}

function initPoints() {

        for (let i = 0; i < num; i++) {
            // x[i] = random(width)             // full
            // y[i] = random(height)

            // x[i] = random(width / 2, width / 2 + 420)    //  center horiz 420, 520
            // y[i] = random(height/2,height/2 )

            // x[i] = random(width / 2+200, width / 2 + 620)    //  custom
            // y[i] = random(height/2-120,height/2 -120)

            // x[i] = random(width / 2, width / 2 )    //  center vert 420, 520
            // y[i] = random(height/2,height/2 + 280 )

            // x[i] = random(100, width - 100 )    //  full screen w margin
            // y[i] = random(100, height - 100 )

            // x[i] = random(400, width - 400 )    //  full screen w margin
            // y[i] = random(400, height - 400 )
            //
            // x[i] = random(800, width - 800 )    //  full screen w margin
            // y[i] = random(800, height - 800 )
            //
            // x[i] = random(1000, width - 1000 )    //  full screen w margin
            // y[i] = random(1000, height - 1000 )

            // x[i] = random(width / 2 + 400, width / 2 + 400)    //  center vert 420, 520
            // y[i] = random(height / 2, height / 2 + 280)

            // x[i] = random(width)                    // down full
            // y[i] = random(height, height + 20)

            // x[i] = random(width/2, width/2 + 300)   // down smol
            // y[i] = random(height, height + 20)


            // x[i] = random(5)   // lateral full
            // y[i] = random(height)

            x[i] = random(3)   // lateral smol
            y[i] = random(height/3, height/3 + 400)


            //
            // x[i] = random(width)   // up full
            // y[i] = random(5)

            // x[i] = random(300, width-300)   // up smol
            // y[i] = 2

            // x[i] = random(600, 1400)   // up partial
            // y[i] = random(5)

            // x[i] = random(800, 1700)   // up partial
            // y[i] = random(5)

            vx[i] = 0
            vy[i] = 0
            ax[i] = 0
            ay[i] = 0
        }
}



function draw() {

    for (let i = 0; i < num; i++) {
        let distance = dist(mouseX, mouseY, x[i], y[i]) //dist(x1,y1,x2,y2) Function to find the distance between two points

        // acceleration is inversely proportional to the square of the distance from the center of attraction
        if (distance > 3) { // Do not update acceleration if too close to the mouse
            ax[i] = attraction * (mouseX - x[i]) / (distance * distance)
            ay[i] = attraction * (mouseY - y[i]) / (distance * distance)
        }

        vx[i] += ax[i] // acc in vel
        vy[i] += ay[i]

        vx[i] = vx[i] * slower
        vy[i] = vy[i] * slower

        x[i] += vx[i]  // vel in pos
        y[i] += vy[i]

        // let velocity = dist(0, 0, vx[i], vy[i])
        // let r = map(velocity, 0, 5, 0, 255)
        // let g = map(velocity, 0, 5, 64, 255)
        // let b = map(velocity, 0, 5, 128, 255)

        // let r = map(attraction, 0, 18, 0, 255)       // yellow euphoria
        // let g = map(x[1], 0, width, 244, 255)
        // let b = map(y[1], 0, height, 28, 255)

        // let r = map(attraction, 0, 18, 150, 255)     // pink - yellow scheme
        // let g = map(x[1], 0, width, 144, 255)
        // let b = map(y[1], 0, height, 28, 255)

        let r = map(attraction, 0, 18, 70, 255)          // magnetic pink
        let g = map(x[1], 0, width, 24, 255)
        let b = map(y[1], 0, height, 28, 255)

        fill(r, g, b, 32)
        ellipse(x[i] * scale_width, y[i] * scale_height, radius, radius)

    }
}

function keyboardEvent(event) {
    if (event.code === 'Space') {
        toggleLoop();
        is_looping ? loop() : noLoop();
    }
    if (event.code === 'KeyS') {
        saveCanvas('hypnosis','png')
    }
}

function toggleLoop() {
    is_looping = !is_looping;
}
