const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 400;

const menu = document.getElementById("menu");
const hud = document.getElementById("hud");
const gameOverUI = document.getElementById("gameOver");

let player, fruit, score, running = false;

/* START GAME */
function startGame(){

  menu.style.display = "none";
  gameOverUI.style.display = "none";
  hud.style.display = "block";
  canvas.style.display = "block";

  player = { x: 140, y: 360, w: 40, h: 10 };
  fruit = spawnFruit();
  score = 0;
  running = true;

  updateScore();
}

/* SCORE */
function updateScore(){
  document.getElementById("score").innerText = score;
}

/* FRUIT */
function spawnFruit(){
  return {
    x: Math.random() * (canvas.width - 20),
    y: -20,
    size: 20,
    speed: 3
  };
}

/* =========================
   CONTROL PALING STABIL
   ========================= */

function movePlayer(clientX){
  let rect = canvas.getBoundingClientRect();
  let x = clientX - rect.left;

  player.x = x - player.w / 2;
}

/* HP */
canvas.addEventListener("touchmove", e=>{
  movePlayer(e.touches[0].clientX);
}, {passive:true});

/* PC */
canvas.addEventListener("mousemove", e=>{
  movePlayer(e.clientX);
});

/* ========================= */

function gameLoop(){

  if(!running) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  /* PLAYER */
  ctx.fillStyle = "#00eaff";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  /* FRUIT */
  fruit.y += fruit.speed;

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(fruit.x, fruit.y, fruit.size/2, 0, Math.PI*2);
  ctx.fill();

  /* COLLECT */
  if(
    fruit.y > player.y &&
    fruit.x > player.x &&
    fruit.x < player.x + player.w
  ){
    score++;
    updateScore();
    fruit = spawnFruit();
  }

  /* MISS → GAME OVER */
  if(fruit.y > canvas.height){
    running = false;
    gameOverUI.style.display = "block";
  }

  requestAnimationFrame(gameLoop);
}

/* AUTO START LOOP (TAPI WAIT START BUTTON) */
function loop(){
  gameLoop();
  requestAnimationFrame(loop);
}

loop();
