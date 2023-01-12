let oscillators = []
let is_looping = true;

let d_width = 2195;
let d_height = 1092;
let width = window.innerWidth;
let height = window.innerHeight;
let scale_width = width / d_width;
let scale_height = height / d_height;

function setup() {
    createCanvas(width, height)

    if (frameCount < 60) {
        background(0)
    }

    colorMode(HSB, 360, 100, 100, 100)
    // blendMode(DIFFERENCE)    //LIGHTEST DIFFERENCE 1 - 360 SCREEN  OVERLAY, HARD_LIGHT , DODGE - INTERESTING EFFECT FOR LIMITED TIME
    for (let i = 0; i < 5; i++) {
        // oscillators[i] = new Oscillator(width/6 * i + width/6, height/2, 1.7, 1.5)
        oscillators[i] = new Oscillator(0.5 * (i - 0.3), 0.5 * (i - 0.3))  // 1.1 0.9
    }

    document.addEventListener('keydown', keyboardEvent);
}

function windowResized() {
    width = windowWidth;
    height = windowHeight;
    scale_width = width / d_width;
    scale_height = height / d_height;

    resizeCanvas(windowWidth, windowHeight);
}

function draw() {   // switch fill - stroke
    background(0, 10)
    translate(width/2, height/2)

    for (let oscillator of oscillators) {
        oscillator.show()
        oscillator.move()
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

class Oscillator {
    constructor(amp1, amp2) {  // 1.9 1.5
        this.x = 0
        this.y = 0
        this.amp1 = (amp1 * width) / 2
        this.amp2 = (amp2 * height) / 2
        this.angle1 = 0
        this.angle2 = 0
        // this.angleV1 = 0.013        // og version
        // this.angleV2 = 0.018        // og version
        this.angleV1 = random(0.001, 0.03)
        this.angleV2 = random(0.001, 0.03)
        this.r1 = 0
        this.r2 = 0
        this.h = 0
        this.s = 0
        this.b = 0
        // this.c1 = 222        // og version
        // this.c2 = 314        // og version
        this.c1 = floor(random(1, 360))
        this.c2 = floor(random(1, 360))
    }


    move() {
        this.angle1 += this.angleV1
        this.angle2 += this.angleV2
    }

    show(){
        this.r1 =  map(cos(this.angle1), -1, 1, -this.amp1, this.amp1)
        this.r2 =  map(sin(this.angle2), -1, 1, -this.amp2, this.amp2)
        this.h = map(this.r1, 0, width, this.c1, this.c2) //this.r1
        this.s = map(this.r2, 0, width, 80, 100)   // 80
        this.b = map(this.r1, 0, width, 70, 100)   // 70

        stroke(this.h, this.s, this.b, 100)
        noFill()
        strokeWeight(4.2)  //2.2
        ellipse(this.x * scale_width, this.y * scale_height, this.r1, this.r2)
    }

}
