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
const t = 0.1;  // Lerp t constant
let difficulty = 2; //0=easy, 1=hard, 2=insane
let farmer_direction;
let canvas;
let ctx;
let win = false;
let lastScrollValue = window.scrollY; // Keep track of whether scroll up or down
let animationID;
let winID;
let opacity = 0;
let duckW = 30;

function init() {
    var audio = new Audio('./annoying.mp3');
    audio.play();
    if (window.Event) {
        document.captureEvents(Event.MOUSEMOVE);
    }
    document.onmousemove = getCursorXY;
    document.onmousedown = click;
    animationID = window.requestAnimationFrame(draw);
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

function changeDifficulty() {
    var st = window.scrollY;
    if (st > lastScrollValue) {
        difficulty = mod(difficulty + 1, 3);
    } else {
        difficulty = mod(difficulty - 1, 3);
    }
}


function getCursorXY(e) {
    take_step();
    mouseX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    mouseY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
}

function click(e) {
    if (win) {
        return
    }
    mouseX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    mouseY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    var margin = 1000;
    var dx = mouseX - duckX
    var dy = mouseY - duckY
    var dist = Math.sqrt(dx ** 2 + dy ** 2)
    if (dist < margin) {
        win = true;
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

function showWinText() {
    ctx.fillStyle = "#1B3022";
    ctx.textAlign = "center";
    console.log(ctx);
    console.log("in show win text");
    ctx.font = "80px 'HumanoidStraight'";
    ctx.fillText("Congratulations!", canvas.width / 2, canvas.height / 2)
    ctx.fillText("You have captured the duck.", canvas.width / 2, canvas.height / 2 + 75);
    var delay = 500;
    setTimeout(() => window.location.reload(), delay);
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
    ctx.fillText(">\n", width / 2 + 150, 75);
    ctx.font = "30px 'HumanoidStraight'"
    ctx.fillText("Your mischievous duck has escaped your farm!", width / 2, canvas.height / 5);
    ctx.fillText("Left click the duck to bring him back home.", width / 2, canvas.height / 5 + 25);
}



function win_animation() {
    
    var duck_wink = document.getElementById("duck-wink");
    var duck = document.getElementById("duck");
    duck.hidden = true;
    duck_wink.hidden = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,'+opacity+')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    opacity += 0.01;
    // Smoothly center and expand duck
    duck.style.left = canvas.width / 2 - duckW / 2;
    duck.style.top = canvas.height / 2 - duckW / 2;
    if(!(duckW >= canvas.width/4)){
        duckW = 30 + opacity * 150;
        duck.style.width = duckW+'px';
    } else{
        text = document.getElementById("duck-u-text");
        text.style.left = canvas.width / 2 - duckW / 2 + 210;
        text.style.top = canvas.height / 2 - duckW / 2 - 120;
        text.hidden = false;
    }
    console.log(duckW);
    if(opacity >= 1){
        
        window.cancelAnimationFrame(winID);
    }

    winID = window.requestAnimationFrame(win_animation);
}
function draw() {
    canvas = document.getElementById('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    showLevel(canvas.width);

    var duck = document.getElementById("duck");
    duck.style.left = duckX;
    duck.style.top = duckY;
    duck.style.transform = "scaleX(" + directionX + ")";

    if (win) {
        window.cancelAnimationFrame(animationID);
        winID = window.requestAnimationFrame(win_animation);
        var delay = 7000;
        setTimeout(() => window.location.reload(), delay);
        return;
    }

    var deltaX = duckX - mouseX;
    var deltaY = mouseY - duckY;
    var angle = Math.atan2(deltaY, deltaX);
    if (angle >= Math.PI / 4 && angle < 3 * Math.PI / 4) {
        farmer_direction = "up";
    } else if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
        farmer_direction = "right";
    } else if (angle >= -3 * Math.PI / 4 && angle < -Math.PI / 4) {
        farmer_direction = "down";
    } else {
        farmer_direction = "left";
    }
    document.documentElement.style.setProperty('--frame_0', "url('./farmer_" + farmer_direction + "/frame_0_delay-0.1s.png')");
    document.documentElement.style.setProperty('--frame_1', "url('./farmer_" + farmer_direction + "/frame_1_delay-0.1s.png')");
    document.documentElement.style.setProperty('--frame_2', "url('./farmer_" + farmer_direction + "/frame_2_delay-0.1s.png')");
    document.documentElement.style.setProperty('--frame_3', "url('./farmer_" + farmer_direction + "/frame_3_delay-0.1s.png')");
    animationID = window.requestAnimationFrame(draw);
}