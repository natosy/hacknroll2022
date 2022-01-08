window.onload = init;
let mouseX = 0;
let mouseY = 0;
let duckX = 500;
let duckY = 500;
let duckRadius = 30;
let directionX = 1;
let directionY = 1;
const invisible_radius = 250; // If cursor dist is less than this distance, increase the speed
let step = 75;
const t = 0.12;  // Lerp t constant
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
var welcomeID;
var startID

// Insults
var insults = ["hehe", "haha", "noob", "loser"];
var insult;
var insult_text = document.getElementById("text-noob")
function init(){
    canvas = document.getElementById('canvas');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.onmousemove = getCursorXY;
    startID = window.requestAnimationFrame(start_animation);
}
function start_animation(){
    var duck = document.getElementById("duck");
    duckX = duck.getBoundingClientRect().left;
    duckY = duck.getBoundingClientRect().top;
    var deltaX = duckX - mouseX;
    var deltaY = mouseY - duckY;
    console.log(deltaX, deltaY);
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

    let classes = document.styleSheets[0].cssRules;
    for (var x = 0; x < classes.length; x++) {        
        if (classes[x].name == 'cursor') {
            classes[x].deleteRule([0, 33, 66, 100]);
            classes[x].appendRule('0% {cursor: url("./farmer_'+farmer_direction+'/frame_0.png") 35 35, auto;}');
            classes[x].appendRule('33% {cursor: url("./farmer_'+farmer_direction+'/frame_1.png") 35 35, auto;}');
            classes[x].appendRule('66% {cursor: url("./farmer_'+farmer_direction+'/frame_2.png") 35 35, auto;}');
            classes[x].appendRule('100% {cursor: url("./farmer_'+farmer_direction+'/frame_3.png") 35 35, auto;}');
        }         
    }
    startID = window.requestAnimationFrame(start_animation);
}
function start(){
    window.cancelAnimationFrame(startID);
    var audio = new Audio('./annoying.mp3');
    audio.play();
    start = document.getElementById("button");
    start.hidden = true;
    document.getElementById("duck").style.position='absolute';
    
    document.getElementById("ducku").style.animationName = 'title-ani';

    var app = document.getElementById('app');

    var typewriter = new Typewriter(app, {
      loop: true,
      delay: 75,
    });
    
    typewriter
      .typeString('Oh no - your duck has escaped!')
      .pauseFor(2000)
      .deleteAll()
      .typeString('Track it down with your mouse and click it to catch it.')
      .pauseFor(5000)
      .deleteAll()
      .pauseFor(4000)
      .typeString("It can't be that hard, right?")
      .pauseFor(2000)
      .deleteAll()
      .pauseFor(3000)
      .typeString("Good luck!")
      .pauseFor(2000)
      .deleteAll()
      .start();
    
    document.onmousedown = click;
    animationID = window.requestAnimationFrame(draw);
}

function setDefaultStep() {
    step = 75;
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
    var margin = 75;
    var dx = mouseX - duckX - 25;
    var dy = mouseY - duckY - 25;
    var dist = Math.sqrt(dx ** 2 + dy ** 2);
    console.log(dist);
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
        step += (invisible_radius - dist) * 2;
    } else {
        // Reset speed to normal
        setDefaultStep()
    }
    var nextX, nextY;
    // dx
    directionX = directionX * get_sign(0.9); //probability of moving in the same direction
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
    ctx.font = "80px 'HumanoidStraight'";
    ctx.fillText("Congratulations!", canvas.width / 2, canvas.height / 2)
    ctx.fillText("You have captured the duck.", canvas.width / 2, canvas.height / 2 + 75);
    var delay = 500;
    setTimeout(() => window.location.reload(), delay);
    return;
}

function win_animation() {
    
    var duck_wink = document.getElementById("duck-wink");
    var duck = document.getElementById("duck");
    var ducku = document.getElementById("ducku");
    var app = document.getElementById("app");
    app.style.opacity = 0;
    ducku.style.opacity = 1-opacity;
    duck_wink.style.left = duck.style.left;
    duck_wink.style.top = duck.style.top;
    duck.hidden = true;
    duck_wink.hidden = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,'+opacity+')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    opacity += 0.01;
    // Smoothly center and expand duck
    duck_wink.style.left = canvas.width / 2 - duckW / 2;
    duck_wink.style.top = canvas.height / 2 - duckW / 2;
    if(!(duckW >= canvas.width/4)){
        duckW = 30 + opacity * 150;
        duck_wink.style.width = duckW+'px';
    } else{
        text = document.getElementById("duck-u-text");
        text.style.left = canvas.width / 2 - duckW / 2 + 210;
        text.style.top = canvas.height / 2 - duckW / 2 - 120;
        text.hidden = false;
    }

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

    var duck = document.getElementById("duck");
    duck.style.left = duckX;
    duck.style.top = duckY;
    // Insult
    var chanceToInsult = 0.005
    var marginX = 20;
    var marginY = 20;
    if (Math.random() <= chanceToInsult && insult_text.hidden === true) {
        var audio = new Audio('./quack.mp3');
        audio.play();
        insult = "text-" + insults[Math.floor(Math.random() * insults.length)];
        insult_text = document.getElementById(insult);
        insult_text.style.left = duckX + marginX;
        insult_text.style.top = duckY - marginY;
        insult_text.hidden = false;
        setTimeout(() => insult_text.hidden = true, 1000);
    } else {
        insult_text.style.left = duckX + marginX;
        insult_text.style.top = duckY - marginY;
    }
    
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

    let classes = document.styleSheets[1].cssRules;
    for (var x = 0; x < classes.length; x++) {        
        if (classes[x].name == 'cursor') {
            classes[x].deleteRule([0, 33, 66, 100]);
            classes[x].appendRule('0% {cursor: url("./farmer_'+farmer_direction+'/frame_0.png") 35 35, auto;}');
            classes[x].appendRule('33% {cursor: url("./farmer_'+farmer_direction+'/frame_1.png") 35 35, auto;}');
            classes[x].appendRule('66% {cursor: url("./farmer_'+farmer_direction+'/frame_2.png") 35 35, auto;}');
            classes[x].appendRule('100% {cursor: url("./farmer_'+farmer_direction+'/frame_3.png") 35 35, auto;}');
        }         
    }
    animationID = window.requestAnimationFrame(draw);
}