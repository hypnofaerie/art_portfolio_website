let canvasSize = 1000  // twitter 720
let defaultSize = 1000
let scale = canvasSize / defaultSize

let d_width = 2195;
let d_height = 1092;
let width = window.innerWidth;
let height = window.innerHeight;
let scale_width = width / d_width;
let scale_height = height / d_height;

let blobbis = []
let is_looping = true;

function setup() {
    createCanvas(width, height);
    background(25)   // less trails

    noiseMax = random(2, 6) // 8

    for (let i = 0; i < 4; i++) {
        //   constructor(scale, angleInc, noiseMax, minR, maxR, minRr, maxRr, frameInc)
        blobbis[0] = new Blobbi(scale_width, scale_height, 0.01, noiseMax + 2.1, 100, 550, -10, 50, -0.05) //  4
        blobbis[1] = new Blobbi(scale_width, scale_height, 0.01, noiseMax + 1.4, 50, 375, -20, 50, 0.04)    //  3
        blobbis[2] = new Blobbi(scale_width, scale_height, 0.01, noiseMax + 0.7, 25, 200, 0, 50, -0.05)     // 4
        // blobbis[3] = new Blobbi(scale, 0.01, noiseMax, 5, 170, 10, 30, 0.04)        // 5
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

function draw() {
    background(0, 14)
    translate(width/2, height/2)

    for (let blobbi of blobbis) {
        blobbi.show()
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


class Blobbi {
    constructor(scale_w, scale_h, angleInc, noiseMax, minR, maxR, minRr, maxRr, frameInc) {
        this.scale_w = scale_w
        this.scale_h = scale_h
        this.posX = 0
        this.posY = 0
        this.angleInc = angleInc  // 0.04 0.1 smoother
        this.noiseMax = noiseMax  // 0.5 circle // floor?
        this.minR = minR    //20
        this.maxR = maxR   //400
        this.minRr = minRr    //-25
        this.maxRr = maxRr  //25
        this.frameInc = frameInc // 0.02 0.01 -0.02
        this.zOff = 0
        this.zInc = 0.01  //0.001 slower 0.01 faster
        this.lerpAmt = random(0.01, 0.2)

        this.palette = ['#7400B8','#5BFF98', '#0af5d9', '#f7ff0f', '#06ebf0', '#ceff1a', '#f20089']
        // purple og, green og , turqoise,  yellow, blue, lime, pink

        this.c1 = color(this.palette[floor(random(0,7))])
        this.c2 = color(this.palette[floor(random(0,7))])


        // this.palette = ['#7400B8', '#0af5d9', '#5BFF98'] // forcing it palette: purp turq green og
        // this.c1 = color(this.palette[floor(random(0,3))])  //7
        // this.c2 = color(this.palette[floor(random(0,3))])

    }

    createVertex(a){
        let xoff = map(cos(a), -1, 1, 0, this.noiseMax)
        let yoff = map(sin(a), -1, 1, 0, this.noiseMax)
        let radius = map(noise(xoff, yoff, this.zOff), 0, 1, this.minR, this.maxR) // 20 400
        let rotation = map(sin(a + frameCount * this.frameInc), 0, 1, this.minRr, this.maxRr) // rotate all vertices //multiply a 0.01 for breathing, mult by 5 to get star shape
        let r = radius + rotation
        let x = this.posX + r * cos(a)
        let y = this.posY + r * sin(a)
        return {
            x : x * this.scale_w,
            y : y * this.scale_h
        }
    }


    show(){
        push()
        let cols = lerpColor(this.c1, this.c2, abs(sin(frameCount * this.lerpAmt))) // 0.2 0.1 0.05 0.01  / 0.005

        stroke(cols)
        strokeWeight(1.5)
        fill(0,1)

        beginShape()
        let pointVertex = this.createVertex(0)
        vertex(pointVertex.x, pointVertex.y)

        for (let a = this.angleInc; a < TWO_PI; a += this.angleInc) {
            pointVertex = this.createVertex(a)
            curveVertex(pointVertex.x, pointVertex.y)
        }

        pointVertex = this.createVertex(0)
        curveVertex(pointVertex.x, pointVertex.y)

        pointVertex = this.createVertex(this.angleInc)
        curveVertex(pointVertex.x, pointVertex.y)


        endShape(CLOSE)

        this.zOff += this.zInc

        pop()

    }
}
