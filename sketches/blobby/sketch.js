let d_width = 2195;
let d_height = 1092;
let width = window.innerWidth;
let height = window.innerHeight;
let scale_width = width / d_width;
let scale_height = height / d_height;

let noiseMax = 1.1; //0.5 circle
let phase = 0;
let zoff = 0;
let xoff;
let yoff;
let rInc = 1;

// random var
let rGrow, lerpAmount, sw
let c1, c2
let palette = ['#7400B8','#5BFF98', '#0af5d9', '#f7ff0f', '#06ebf0', '#ceff1a', '#f20089']
// purple og, green og , turqoise,  yellow, blue, lime, pink

let is_looping = true;

function setup() {
  createCanvas(width, height);
  background(0);    // v2 with no fill

   rGrow = random(0.001, 0.07)     //0.07 , 0.01 for older version captures (3.02)        // lower max limit to 0.01 for slower blob
   lerpAmount = random(0.005, 0.1)
   sw = random(1, 3.2)

   c1 = color(palette[floor(random(0,7))])
   c2 = color(palette[floor(random(0,7))])

   document.addEventListener('keydown', keyboardEvent);
}

function draw() {
  translate(width / 2, height / 2);
  noFill();
  strokeWeight(sw); //1.5

  let cols = lerpColor(c1, c2, abs(sin(frameCount * lerpAmount))) // 0.2 0.1 0.05 0.01  / 0.005
  stroke(cols)

  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.01) {  // 0.01  0.1 smoother a - amount of vertices
    // let xoff = cos(a) + 1;  // +1 so we don't get negative values
    let xoff = map(cos(a+phase), -1, 1, 0, noiseMax); // + phase rotation
    let yoff = map(sin(a+phase), -1, 1, 0, noiseMax);
    let radius = map(noise(xoff, yoff, zoff), 0, 1, 20,400);
    // let radius = map(noise(xoff, yoff, zoff), 0, 1, 20,300);    // radius test for more randomness
    let rotation = map(sin(a + frameCount * 0.02), 0, 1, -25, 25); // rotate all vertices //multiply a 0.01 for breathing, mult by 5 to get star shape
    let r = (radius + rotation) * rInc;  // for no rotate, switch rad = r
    let x = r * cos(a);   // *0.01 triangle
    let y = r * sin(a);   // a . 0.2 0.3 both
    vertex(scale_width * x, scale_height * y);
  }
  endShape(CLOSE);

  zoff += 0.01;
  rInc += rGrow;     // inc radius in time  0.001
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

function windowResized() {
    zoff = 0;
    rInc = 1;
    width = window.innerWidth;
    height = window.innerHeight;
    scale_width = width / d_width;
    scale_height = height / d_height;

    resizeCanvas(windowWidth, windowHeight);
    background(0);
}
