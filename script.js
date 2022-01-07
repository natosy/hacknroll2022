window.onload = init;
let mouseX = 0;
let mouseY = 0;
let duckX = 500;
let duckY = 500;
let duckRadius = 30;
let directionX = 1;
let directionY = 1;
const invisible_radius = 100; // If cursor dist is less than this distance, increase the speed
let step = 50;
const t = 0.15;  // Lerp t constant
difficulty = 0 //0=easy, 1=hard, 2=insane

document.body.style.cursor = "url('./farmer_right.gif'), auto"


function init() {
    if (window.Event) {
        document.captureEvents(Event.MOUSEMOVE);
    }
    document.onmousemove = getCursorXY;
    window.requestAnimationFrame(draw);
}

function getCursorXY(e) {
    take_step();
    mouseX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    mouseY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
}

function get_sign(prob) {
    return Math.random() < prob ? 1 : -1;
}

function lerp(start, end, t) {
    // Linear interpolation for smooth animation
    return start * (1 - t) + end * t;
}

function take_step() {
    // Update speed based on how close cursor is to duck
    var dx = (mouseX - duckX);
    var dy = (mouseY - duckY);
    var dist = dx * dx + dy * dy;
    if (dist < invisible_radius) {
        // Get faster as cursor is closer
        step += (invisible_radius - dist);
    } else {
        // Reset speed to normal
        step = 50;
    }
    var nextX, nextY;
    // dx
    directionX = directionX * get_sign(0.8);
    nextX = duckX + step * directionX;
    if (nextX < 0) {
        nextX = canvas.width + duckX;
    } else if (nextX > canvas.width) {
        nextX = duckX - canvas.width;
    }
    // dy
    var moves_up = get_sign(0.1);
    if (moves_up == 1){
        directionY = directionY * get_sign(0.8);
        nextY = duckY + step * directionY;
    } else {
        nextY = duckY + step * directionY;
    }
    if (nextY < 0) {
        nextY = canvas.height + duckY;
    } else if (nextY > canvas.height) {
        nextY = duckY - canvas.height;
    }
    // actual update
    duckX = lerp(duckX, nextX, t);
    duckY = lerp(duckY, nextY, t);
    return
}
function showLevel(ctx, width){
    ctx.fillStyle = "#408020"; 
    ctx.textAlign = "center"; 

    ctx.font = "80px 'HumanoidStraight'"; 
    ctx.fillText("<",width/2-150,75);

    ctx.font = "60px 'HumanoidStraight'"; 
    ctx.fillText("easy",width/2,60); 

    ctx.font = "80px 'HumanoidStraight'"; 
    ctx.fillText(">",width/2+150,75);
}
function draw() {
    const canvas = document.getElementById('canvas');
    canvas.width = document.body.clientWidth; 
    canvas.height = document.body.clientHeight;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, 300, 300);

    const img = new Image();
    img.src = 'grass.png';
    img.addEventListener('load', () => {
        const ptrn = ctx.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 0, canvas.width, canvas.height); // context.fillRect(x, y, width, height);
      })

    showLevel(ctx, canvas.width);


    var duck = document.getElementById("duck");
    duck.style.display = '';
    duck.style.position = 'absolute';
    duck.style.left = duckX + "px";
    duck.style.top = duckY + "px";

    window.requestAnimationFrame(draw);
}