let suns = []
let is_looping = true;

let d_width = 2195;
let d_height = 1092;
let width = window.innerWidth;
let height = window.innerHeight;
let scale_width = width / d_width;
let scale_height = height / d_height;

function windowResized() {
    width = windowWidth;
    height = windowHeight;
    scale_width = width / d_width;
    scale_height = height / d_height;

    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    createCanvas(windowWidth, windowHeight)
    background(1)
    repeat()     // repeat version - lots of suns
    suns.push(new Sun(0, 0, random(0.4, 0.9), random(0.4, 0.9), random(0.4, 0.9), random(0.4, 0.4), random(0.4, 3), 1))
    // suns.push(new Sun(0, 0, random(0.4, 0.9), random(0.4, 0.9), random(0.4, 0.9), random(0.4, 0.4), random(0.4, 3), 1))   // double sun version
    document.addEventListener('keydown', keyboardEvent);
}

function draw() {
    translate(width / 2, height / 2)

    for (let sun of suns) {
        sun.move()
        sun.show()
    }
    repeat()
}

repeat = function () {
    if (frameCount % 200 === 0) {
        clear()
        background(1)
        suns.push(new Sun(0, 0, random(0.4, 0.9), random(0.4, 0.9), random(0.4, 0.9), random(0.4, 0.4), random(0.4, 3), 1))
        scale(-2.5)
    }
}


class Sun {
    constructor(pX, pY, aI, i, n, b, nI, s) {
        this.posX = pX
        this.posY = pY
        this.angleInc = aI
        this.inc = i
        this.n = n
        this.b = b
        this.nInc = nI
        this.scale = s
        this.x, this.y
        this.startW = 0.15 * width
        this.startH = 0.15 * height
        this.a

        this.electricPalette = ['#17ff0f', '#f7ff0f', '#06ebf0', '#ceff1a', '#f20089', '#8900f2']
        // green, yellow, blue, lime, pink, purple
        this.electricCol = color(this.electricPalette[5])
        this.c1 = color(this.electricPalette[2])
        this.c2 = color(this.electricPalette[5])
        this.amt
        this.lerpCol
    }


    move() {
        this.n += this.nInc        // 0.71 0.77 illusion 0.9 // 1.23 5.23  6.23 scoica 7.18
    }

    show() {
        noFill()
        strokeWeight(1.2)
        if (this.angleInc >= 0.8 && this.angleInc <= 0.899) {
            strokeWeight(2.8)
        }

        // stroke(this.electricCol)     // mono electric

        this.amt = sin(frameCount * 0.009 )     // 0.001 slow changes 0.01 super fast
        this.lerpCol = lerpColor(this.c1,this.c2,this.amt)
        stroke(this.lerpCol)

        push()
        translate(this.posX, this.posY)

        beginShape()
        for (this.a = 0; this.a < TWO_PI; this.a += this.angleInc) {
            let k = this.n * this.inc * this.b / this.a
            this.x = (0.1 * width + (sqrt(cos(this.a)) * k)) * this.scale
            this.y = (sqrt(sin(this.a)) * k) * this.scale
            vertex(this.x * scale_width, this.y * scale_height)
            rotate(this.n * 2)
        }
        endShape(CLOSE)

        pop()

        // console.log(this.a)
    }
}

function keyboardEvent(event) {
    // console.log(event);
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
