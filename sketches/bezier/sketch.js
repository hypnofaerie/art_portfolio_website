let tokenData = genTokenData(1235);
// let tokenData = {
//     hash: "0x11ac16678959949c12d5410212301960fc496813cbc3495bf77aeed738579738",
//     tokenId: "123000456"
// }
let hash = tokenData.hash;

let R;
let d_width = 2195;
let d_height = 1092;
let width = window.innerWidth;
let height = window.innerHeight;
let scale_width = width / d_width;
let scale_height = height / d_height;

let trail;          // features
let n;              // features // color scheme : 0 = black&white, 1 = lerping two colors from palette, 2 = glitchy, 3 = rainbow, 4 = rgb formulas colors
let stroke_w, col, c1, c2, amt, random_lerp;
let r, g, b, rgb_col;
let rgb_variations;
let angle, set_angle, angle_inc;
let total;
let spacing;      // features
let move;         // features

let bezier_points = {};

let random_points_x = [];
let random_points_y = [];

let anchors_max = [
    {x : 0, y : 0},
    {x : 0, y : 0},
];
let controls_max = [
    {x : 0, y : 0},
    {x : 0, y : 0},
];

let random_combo, random_values;             // features


let palette = ['#FFFFFF', '#F2F2F2', '#B100E8', '#0AFF37', '#F20089',  '#FFFF0A', '#0AFFF3', '#2D00F7'];
// white, grey, purple x 11, erin, magenta process, yellow, turquoise blue, blue

let interaction_level = [];                   // features
let is_looping = true;


function genTokenData(projectNum) {
    let data = {};
    let hash = "0x";
    for (var i = 0; i < 64; i++) {
        hash += Math.floor(Math.random() * 16).toString(16);
    }
    data.hash = hash;
    data.tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString();
    return data;
}


function setup() {

    createCanvas(width, height);
    background(0);
    R = new Random();
    n =  R.random_int(0, 4);      // color scheme

    colorMode(RGB, 255);
    if (n === 2 || n === 3) colorMode(HSB, 360);

    // x and y positions of points on bezier curve will be picked randomly, each position picked between a different interval 0 - width/i
    for (let i = 1; i <= 10; i++) {
        random_points_x.push(parseInt(width / i, 10));
        random_points_y.push(parseInt(height / i, 10));
    }


    // function created for on click interaction - only a few mints will have the posibility to get a completely new curve when the mouse is clicked
    resetSketch();

    document.addEventListener('keydown', keyboardEvent);

}

function resetSketch() {

    // random variables that will be reset everytime the mouse is clicked
    trail =  R.random_int(30, 70);
    total = R.random_int(1700, 2000);
    spacing = R.random_int(6, 20);
    move = R.random_num(0.035, 0.045);
    set_angle = R.random_dec();
    angle_inc = R.random_num(0.1, 2.9);
    stroke_w = R.random_num(0.25, 0.45);
    random_lerp = n < 2 ? R.random_num(0.01, 0.11) : R.random_num(0.1, 0.3);
    interaction_level = R.random_choice([0.014, 0.024, 0.044, 0.064]);
    rgb_variations = R.random_int(0, 3);


    // picking random x and y coordinates for each point on the bezier curve
    for (let i = 0; i < anchors_max.length; i++) {
        let rand_index = getRandomPoint(0, 9); // { x : 0, y : 1 }

        anchors_max[i].x = random_points_x[rand_index.x];
        anchors_max[i].y = random_points_y[rand_index.y];

        rand_index = getRandomPoint(0, 9);
        controls_max[i].x = random_points_x[rand_index.x];
        controls_max[i].y = random_points_y[rand_index.y];
    }

    bezier_points.x1 = R.random_int(0, anchors_max[0].x);
    bezier_points.y1 = R.random_int(0, anchors_max[0].y);
    bezier_points.x2 = R.random_int(0, controls_max[0].x);
    bezier_points.y2 = R.random_int(0, controls_max[0].y);
    bezier_points.x3 = R.random_int(0, controls_max[1].x);
    bezier_points.y3 = R.random_int(0, controls_max[1].y);
    bezier_points.x4 = R.random_int(0, anchors_max[1].x);
    bezier_points.y4 = R.random_int(0, anchors_max[1].y);

    random_combo = R.random_int(0, 5);


    // color scheme
    const temp_palette = [...palette];
    let index = R.random_int(2, 7);
    let glitchIndex = R.random_int(4, 7);
    if (n === 0) {
        c1 = color(temp_palette[0]);
        c2 = color(temp_palette[1]);
    } else if (n === 1) {
        c1 = color(temp_palette[index]);
        temp_palette.splice(index,1);
        index = R.random_int(2, 6);
        c2 = color(temp_palette[index]);
    } else if (n === 2) {
        c1 = color(temp_palette[glitchIndex]);
        temp_palette.splice(glitchIndex,1);
        glitchIndex = R.random_int(4, 6);
        c2 = color(temp_palette[glitchIndex]);
    }

}

function draw() {

    background(0, trail);
    angle = set_angle * PI;

    // color
    noFill();
    strokeWeight(stroke_w);
    if (n % 2 !== 0) strokeWeight(1.35 * stroke_w);

    amt = abs(sin(frameCount * random_lerp));

    if (n < 3) {
        col = lerpColor(c1, c2, amt);
        stroke(col);
    }

    for (let i = 0; i < total; i += spacing) {
        if (n === 3) {                                               // rainbow color scheme
            stroke(map(i, 0, total, 0, 360), 360, 360);
        }


        if (n === 4 && rgb_variations === 0) {                      // green orange + pink purple
            r = i % 255;
            g = 360 - noise(1 + frameCount * 0.025) * 360;
            b = noise(frameCount * 0.01) * 360;
        }


        if (n === 4 && rgb_variations === 1) {                       // green orange
            r = sin(i * 0.9) * 360;
            g = 360 - noise(i * 0.95) * 360;
            b = i % 100;

        }


        if (n === 4 && rgb_variations === 2) {                        // alternate rainbow
            r = sin(i * 5.9) * 400;
            g = 100 - noise(i * 2.95);
            b = i % 320;
        }


        if (n === 4 && rgb_variations === 3) {                         // green blue yellow
            r = sin(i * 4.2) * 220;
            g = 220 - noise(i * 4.2) *4.2;
            b = i % 220;
        }

        rgb_col = color(r,g,b);
        stroke(rgb_col);


        // drawing & animating the curve
        push();

        translate(width/2, height/2);
        scale(0.5)
        rotate(angle);
        rotate(map(mouseX, -width/2, width/2, -angle * interaction_level, angle * interaction_level));

        angle += angle_inc;

        drawCurve(i, random_combo);

        bezier_points.x1 += move;
        bezier_points.y2 -= move/2;
        bezier_points.y3 += move/2;
        bezier_points.x4 -= move;

        if (bezier_points.y3 >= height || bezier_points.y3 <= 0) {
            rotate(-angle);
            move = -move;
        }

        pop();
    }
}

function getRandomPoint(min, max) {
    return {
        x : R.random_int(min, max),
        y : R.random_int(min, max)
    }
}


function drawCurve(i, combination = 0) {
    // 4 x and y coordinates of two of the points on the curve will be incremented differently to get more diverse looking curves

    // the bezier curve has 2 anchor points (a1, a2) and two control points (c1, c2) resulting in 6 possible combinations of two points
    const combinations = [
        ['a1', 'a2'],
        ['c1', 'c2'],
        ['a1', 'c1'],
        ['a1', 'c2'],
        ['a2', 'c1'],
        ['a2', 'c2']
    ];

    // 6 types of increments for x and y coordinates
    const modifiers = [
        i/2,     // 0
        i,       // 1
        i*2,     // 2
        -i/2,    // 3
        -i,      // 4
        -i*2,    // 5
    ];

    // selected combinations of increments for each of the 4 coordinates
    const combination_modifiers = [
        [0, 2, 3, 5],
        [0, 1, 3, 4],
        [0, 2, 4, 3],
        [1, 1, 1, 1],
        [0, 3, 2, 4],
        [4, 0, 0, 4]
    ];


    const temp_points = {
        a1 : {
            x : scale_width  * bezier_points.x1,
            y : scale_height  * bezier_points.y1
        },
        a2 : {
            x : scale_width  * bezier_points.x4,
            y : scale_height  * bezier_points.y4
        },
        c1 : {
            x : scale_width  * bezier_points.x2,
            y : scale_height  * bezier_points.y2
        },
        c2 : {
            x : scale_width  * bezier_points.x3,
            y : scale_height  * bezier_points.y3
        }
    }


    let ct = 0;
    const current_mod = combination_modifiers[combination];
    combinations[combination].forEach((item, j) => {
        temp_points[item].x += modifiers[current_mod[ct]];
        ct += 1;
        temp_points[item].y += modifiers[current_mod[ct]];
        ct += 1;
    });

    bezier(
        temp_points.a1.x,
        temp_points.a1.y,
        temp_points.c1.x,
        temp_points.c1.y,
        temp_points.c2.x,
        temp_points.c2.y,
        temp_points.a2.x,
        temp_points.a2.y
    );
}

function windowResized() {
    width = windowWidth;
    height = windowHeight;
    scale_width = width / d_width;
    scale_height = height / d_height;

    resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked(event) {
    resetSketch();
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

class Random {
    constructor() {
        this.useA = false;
        let sfc32 = function (uint128Hex) {
            let a = parseInt(uint128Hex.substr(0, 8, 16));
            let b = parseInt(uint128Hex.substr(8, 8, 16));
            let c = parseInt(uint128Hex.substr(16, 8, 16));
            let d = parseInt(uint128Hex.substr(24, 8, 16));
            return function () {
                a |= 0; b |= 0; c |= 0; d |= 0;
                let t = (((a + b) | 0) + d) | 0;
                d = (d + 1) | 0;
                a = b ^ (b >>> 9);
                b = (c + (c << 3)) | 0;
                c = (c << 21) | (c >>> 11);
                c = (c + t) | 0;
                return (t >>> 0) / 4294967296;
            };
        };
        // seed prngA with first half of tokenData.hash
        this.prngA = new sfc32(tokenData.hash.substr(2, 32));
        // seed prngB with second half of tokenData.hash
        this.prngB = new sfc32(tokenData.hash.substr(34, 32));
        for (let i = 0; i < 1e6; i += 2) {
            this.prngA();
            this.prngB();
        }
    }
    // random number between 0 (inclusive) and 1 (exclusive)
    random_dec() {
        this.useA = !this.useA;
        return this.useA ? this.prngA() : this.prngB();
    }
    // random number between a (inclusive) and b (exclusive)
    random_num(a, b) {
        return a + (b - a) * this.random_dec();
    }
    // random integer between a (inclusive) and b (inclusive)
    // requires a < b for proper probability distribution
    random_int(a, b) {
        return Math.floor(this.random_num(a, b + 1));
    }
    // random boolean with p as percent likelihood of true
    random_bool(p) {
        return this.random_dec() < p;
    }
    // random value in an array of items
    random_choice(list) {
        return list[this.random_int(0, list.length - 1)];
    }
}
