window.onload = init;
let mouseX = 0;
let mouseY = 0;
let duckX = 500;
let duckY = 500;
let duckRadius = 30;
let directionX = 1;
let directionY = 1;
let step = 10;

document.body.style.cursor = "url('./farmer_right.gif'), auto"


function init() {
    if (window.Event) {
        document.captureEvents(Event.MOUSEMOVE);
    }
    document.onmousemove = getCursorXY;
    window.requestAnimationFrame(draw);
}

function getCursorXY(e) {
    mouseX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    mouseY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
}

function get_sign(prob) {
    return Math.random() < prob ? 1 : -1;
}

function take_step() {
    // dx
    directionX = directionX * get_sign(0.8);
    duckX = duckX + step * directionX;
    if (duckX < 0) {
        duckX = canvas.width + duckX;
    } else if (duckX > canvas.width) {
        duckX = duckX - canvas.width;
    }
    // dy
    var moves_up = get_sign(0.1);
    if (moves_up == 1){
        directionY = directionY * get_sign(0.8);
        duckY = duckY + step * directionY;
    }
    if (duckY < 0) {
        duckY = canvas.height + duckY;
    } else if (duckY > canvas.height) {
        duckY = duckY - canvas.height;
    }
    return
}

function draw() {
    const canvas = document.getElementById('canvas');
    canvas.width = document.body.clientWidth; 
    canvas.height = document.body.clientHeight;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, 300, 300);

    take_step();

    var duck = document.getElementById("duck");
    duck.style.display = '';
    duck.style.position = 'absolute';
    duck.style.left = duckX + "px";
    duck.style.top = duckY + "px";

    window.requestAnimationFrame(draw);
}