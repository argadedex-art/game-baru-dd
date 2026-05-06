const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

const menu = document.getElementById("menu");
const gameOverUI = document.getElementById("gameOverUI");

const stats = document.getElementById("stats");
const hpFill = document.getElementById("hpFill");

const shootSound = document.getElementById("shootSound");
const boomSound = document.getElementById("boomSound");

let player, bullets, enemies;
let score, level, gameRunning;
let shake = 0;

/* INIT */
function startGame() {
  menu.style.display = "none";
  canvas.style.display = "block";
  gameOverUI.classList.add("hidden");

  player = { x: 200, y: 520, hp: 5 };
  bullets = [];
  enemies = [];

  score = 0;
  level = 1;
  gameRunning = true;

  shootLoop();
  gameLoop();
}

/* RESTART */
function restartGame() {
  startGame();
}

/* SOUND */
function playShoot() {
  shootSound.currentTime = 0;
  shootSound.play().catch(()=>{});
}

function playBoom() {
  boomSound.currentTime = 0;
  boomSound.play().catch(()=>{});
}

/* SHOOT */
function shootLoop() {
  if (!gameRunning) return;

  bullets.push({ x: player.x, y: player.y });
  playShoot();

  setTimeout(shootLoop, 300);
}

/* INPUT */
canvas.addEventListener("mousemove", e => {
  let r = canvas.getBoundingClientRect();
  player.x = e.clientX - r.left;
});

/* ENEMY SPAWN */
setInterval(() => {
  if (!gameRunning) return;

  enemies.push({
    x: Math.random() * 380,
    y: -20,
    speed: 2 + level * 0.2,
    dir: Math.random() > 0.5 ? 1 : -1
  });

}, 700);

/* SHAKE */
function addShake() {
  shake = 10;
}

/* LOOP */
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, 400, 600);

  /* shake effect */
  let offsetX = shake ? (Math.random() - 0.5) * shake : 0;
  let offsetY = shake ? (Math.random() - 0.5) * shake : 0;

  ctx.save();
  ctx.translate(offsetX, offsetY);

  /* player */
  ctx.font = "30px Arial";
  ctx.fillText("😎", player.x, player.y);

  /* bullets */
  bullets.forEach((b,i)=>{
    b.y -= 6;
    ctx.fillText("🏐", b.x, b.y);
    if (b.y < 0) bullets.splice(i,1);
  });

  /* enemies AI (zigzag) */
  enemies.forEach((e, ei)=>{
    e.y += e.speed;
    e.x += e.dir * 2;

    if (e.x < 0 || e.x > 400) e.dir *= -1;

    ctx.fillText("👾", e.x, e.y);

    /* hit player */
    if (Math.abs(e.x - player.x) < 20 && Math.abs(e.y - player.y) < 20) {
      enemies.splice(ei,1);
      player.hp--;
      playBoom();
      addShake();

      if (player.hp <= 0) endGame();
    }

    /* hit bullet */
    bullets.forEach((b, bi)=>{
      if (Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 20) {
        enemies.splice(ei,1);
        bullets.splice(bi,1);
        score++;
        playBoom();
      }
    });
  });

  ctx.restore();

  /* UI */
  stats.innerText = `Score: ${score} | Level: ${level}`;

  hpFill.style.width = (player.hp / 5) * 100 + "%";
  hpFill.style.background = player.hp > 2 ? "lime" : "red";

  shake *= 0.9;

  requestAnimationFrame(gameLoop);
}

/* GAME OVER */
function endGame() {
  gameRunning = false;
  gameOverUI.classList.remove("hidden");
}
