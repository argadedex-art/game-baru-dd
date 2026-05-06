const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const gameOverUI = document.getElementById("gameOverUI");
const hpFill = document.getElementById("hpFill");
const info = document.getElementById("info");

const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

canvas.width = 400;
canvas.height = 600;

/* STATE */
let player, bullets, enemies;
let gameState = "menu";
let score = 0;

/* JOYSTICK */
let joyX = 0;

/* ENEMY VARIATION */
const enemyTypes = [
  {emoji:"👾", speed:2},
  {emoji:"👽", speed:3},
  {emoji:"🤖", speed:1.5},
  {emoji:"🛸", speed:2.5}
];

/* START */
function startGame(){
  menu.style.display = "none";
  canvas.style.display = "block";
  joystick.style.display = "block";

  resetGame();
}

/* RESET */
function resetGame(){
  player = {x:200,y:520,hp:5};
  bullets = [];
  enemies = [];
  score = 0;
  gameState = "play";

  shootLoop();
  loop();
}

/* RESTART */
function restartGame(){
  resetGame();
  gameOverUI.classList.add("hidden");
}

/* JOYSTICK */
joystick.addEventListener("touchmove",(e)=>{
  if(gameState !== "play") return;

  e.preventDefault();

  let r = joystick.getBoundingClientRect();
  let x = e.touches[0].clientX - r.left - 60;

  if(x > 40) x = 40;
  if(x < -40) x = -40;

  joyX = x;

  stick.style.transform = `translate(${x}px,0px)`;
},{passive:false});

/* SHOOT */
function shootLoop(){
  if(gameState !== "play") return;

  bullets.push({x:player.x,y:player.y});
  setTimeout(shootLoop,250);
}

/* ENEMY SPAWN (FIX VARIASI) */
setInterval(()=>{
  if(gameState !== "play") return;

  let t = enemyTypes[Math.floor(Math.random()*enemyTypes.length)];

  enemies.push({
    x: Math.random()*380,
    y: -20,
    speed: t.speed,
    emoji: t.emoji,
    dir: Math.random()>0.5?1:-1
  });

},600);

/* LOOP */
function loop(){
  if(gameState !== "play") return;

  ctx.clearRect(0,0,400,600);

  /* PLAYER MOVE */
  player.x += joyX * 0.15;
  if(player.x < 20) player.x = 20;
  if(player.x > 380) player.x = 380;

  /* PLAYER */
  ctx.font = "30px Arial";
  ctx.fillText("😎", player.x, player.y);

  /* BULLET */
  bullets.forEach((b,i)=>{
    b.y -= 6;
    ctx.fillText("🏐", b.x, b.y);
    if(b.y < 0) bullets.splice(i,1);
  });

  /* ENEMY */
  enemies.forEach((e,ei)=>{
    e.y += e.speed;
    e.x += e.dir * 2;

    ctx.font = "28px Arial";
    ctx.fillText(e.emoji, e.x, e.y);

    /* HIT PLAYER */
    if(Math.abs(e.x-player.x)<20 && Math.abs(e.y-player.y)<20){
      enemies.splice(ei,1);
      player.hp--;

      if(player.hp <= 0) endGame();
    }

    /* HIT BULLET */
    bullets.forEach((b,bi)=>{
      if(Math.abs(b.x-e.x)<20 && Math.abs(b.y-e.y)<20){
        enemies.splice(ei,1);
        bullets.splice(bi,1);
        score++;
      }
    });
  });

  /* UI */
  hpFill.style.width = (player.hp/5)*100 + "%";
  info.innerText = "Score: " + score;

  requestAnimationFrame(loop);
}

/* GAME OVER */
function endGame(){
  gameState = "gameover";
  gameOverUI.classList.remove("hidden");
}
