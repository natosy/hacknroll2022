window.onload = init;
let mouseX = 0;
let mouseY = 0;
let duckX = 500;
let duckY = 500;
let duckRadius = 30;
let directionX = 1;
let directionY = 1;
const invisible_radius = 200; // If cursor dist is less than this distance, increase the speed
let step = 50;
const t = 0.15;  // Lerp t constant
let difficulty = 2; //0=easy, 1=hard, 2=insane
let duckLifes = 3; // easy = 1, hard = 3, insane = 10
let farmer_direction;
let canvas;
let ctx;

function init() {
    if (window.Event) {
        document.captureEvents(Event.MOUSEMOVE);
    }
    document.onmousemove = getCursorXY;
    document.onmousedown = click;
    window.requestAnimationFrame(draw);
}

function setDefaultStep() {
    if (difficulty == 0) {
        step = 50
    } else if (difficulty == 1) {
        step = 100
    } else {
        step = 200
    }
}

function getCursorXY(e) {
    take_step();
    mouseX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    mouseY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
}

function click(e) {
    mouseX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    mouseY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    var margin = 1000;
    var dx = mouseX - duckX
    var dy = mouseY - duckY
    var dist = Math.sqrt(dx**2 + dy**2)
    if (dist < margin) {
        // Do something to win the game
        showWinText();
    }
}

function get_sign(prob) {
    return Math.random() < prob ? 1 : -1;
}

function lerp(start, end, t) {
    // Linear interpolation for smooth animation
    return start * (1 - t) + end * t;
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function take_step() {
    // Update speed based on how close cursor is to duck
    var dx = Math.abs(mouseX - duckX);
    var dy = Math.abs(mouseY - duckY);
    var dist = dx + dy;
    if (dist < invisible_radius) {
        // Get faster as cursor is closer
        step += (invisible_radius - dist);
    } else {
        // Reset speed to normal
        setDefaultStep()
    }
    var nextX, nextY;
    // dx
    directionX = directionX * get_sign(0.95); //probability of moving in the same direction
    nextX = (duckX + step * directionX);
    // dy
    var moves_up = get_sign(0.2); //moves 
    if (moves_up == 1) {
        directionY = directionY * get_sign(0.8);
        nextY = (duckY + step * directionY);
    } else {
        nextY = duckY;
    }
    // actual update
    duckX = mod(lerp(duckX, nextX, t), canvas.width);
    duckY = mod(lerp(duckY, nextY, t), canvas.height);
    return
}

function showWinText(){
    ctx.fillStyle = "#1B3022";
    ctx.textAlign = "center";
    console.log(ctx);
    console.log("in show win text");
    ctx.font = "80px 'HumanoidStraight'";
    ctx.fillText("Win!", canvas.width / 2 - 150, 150);
    return;
}

function showLevel(width) {
    ctx.fillStyle = "#1B3022";
    ctx.textAlign = "center";

    ctx.font = "80px 'HumanoidStraight'";
    ctx.fillText("<", width / 2 - 150, 75);
    if (difficulty == 0) {
        ctx.font = "60px 'HumanoidStraight'";
        ctx.fillText("easy", width / 2, 60);
    } else if (difficulty == 1) {
        ctx.font = "60px 'HumanoidStraight'";
        ctx.fillText("hard", width / 2, 60);
    } else {
        ctx.font = "60px 'HumanoidStraight'"; 
        ctx.fillText("insane", width / 2, 60);
    }

    ctx.font = "80px 'HumanoidStraight'";
    ctx.fillText(">", width / 2 + 150, 75);
}

function draw() {
    canvas = document.getElementById('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, 300, 300);

    const img = new Image();
    img.src = 'grass.png';
    img.addEventListener('load', () => {
        const ptrn = ctx.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
        ctx.fillStyle = ptrn;
        ctx.fillRect(0, 0, canvas.width, canvas.height); // context.fillRect(x, y, width, height);
    })

    showLevel(canvas.width);

    var duck = document.getElementById("duck");
    duck.style.left = duckX + "px";
    duck.style.top = duckY + "px";
    duck.style.transform= "scaleX("+ directionX + ")";

    var deltaX = duckX - mouseX;
    var deltaY = mouseY - duckY;
    var angle = Math.atan2(deltaY, deltaX);
    if(angle >= Math.PI/4 && angle < 3*Math.PI/4){
        farmer_direction = "up";
    } else if(angle >= -Math.PI/4 && angle < Math.PI/4){
        farmer_direction = "right";
    } else if(angle >= -3*Math.PI/4 && angle < -Math.PI/4){
        farmer_direction = "down";
    } else{
        farmer_direction = "left";
    }
    document.documentElement.style.setProperty('--frame_0', "url('./farmer_"+farmer_direction+"/frame_0_delay-0.1s.png')");
    document.documentElement.style.setProperty('--frame_1', "url('./farmer_"+farmer_direction+"/frame_1_delay-0.1s.png')");
    document.documentElement.style.setProperty('--frame_2', "url('./farmer_"+farmer_direction+"/frame_2_delay-0.1s.png')");
    document.documentElement.style.setProperty('--frame_3', "url('./farmer_"+farmer_direction+"/frame_3_delay-0.1s.png')");
    console.log(document.documentElement.style.getPropertyValue('--frame_0'));
    console.log(document.documentElement.style.getPropertyValue('--frame_1'));
    console.log(document.documentElement.style.getPropertyValue('--frame_2'));
    console.log(document.documentElement.style.getPropertyValue('--frame_3'));
    window.requestAnimationFrame(draw);
}