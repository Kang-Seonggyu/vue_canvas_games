<template>
  <div style="text-align: center">
    <canvas ref="canvas" width="1080px" height="720px"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

let timer = 0;
const cactusArr = [];
const gameStats = {
  start: false,
  positX: 200,
  ground: 550,
  charHeight: 50,
};
let jumpState = false;
let jumpTimer = 0;
let TrexFrame = null;

const canvas = ref();

const createCanvas = () => {
  const ctx = canvas.value.getContext('2d');

  canvas.width = window.innerWidth - 100;
  canvas.height = window.innerHeight - 100;

  const imgSet = new Image();
  imgSet.src = '/src/assets/dino0.png';

  const dino = {
    x: gameStats.positX,
    y: gameStats.ground - gameStats.charHeight,
    width: 50,
    height: gameStats.charHeight,
    draw() {
      ctx.fillStyle = 'brown';
      // ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.drawImage(
        imgSet,
        0,
        0,
        590,
        686,
        this.x,
        this.y,
        this.width,
        this.height
      );
    },
  };

  const newCactus = () => {
    return {
      x: 1000,
      y: gameStats.ground - gameStats.charHeight,
      width: 25,
      height: gameStats.charHeight,
      draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // ctx.drawImage(
        //   imgSet,
        //   2820,
        //   0,
        //   400,
        //   700,
        //   this.x,
        //   this.y,
        //   this.width,
        //   this.height
        // );
      },
    };
  };

  function updateCactuses() {
    if (timer % 150 === 0) {
      const cactus = newCactus();
      cactusArr.push(cactus);
    }
  }

  function drawCactuses() {
    cactusArr.forEach((cactus, i, o) => {
      if (cactus.x < 20) {
        o.splice(i, 1);
      } else if (collisionDetection(dino, cactus) < 0) {
        o.splice(i, 1);
      }
      cactus.x = cactus.x - 2;
      cactus.draw();
    });
  }

  function canvasPlay() {
    TrexFrame = requestAnimationFrame(canvasPlay);
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateCactuses();
    drawCactuses();

    // Jump
    if (jumpState) {
      jumpTimer++;
      if (jumpTimer <= 40) {
        dino.y -= 3;
      } else if (jumpTimer < 80 && dino.y < gameStats.ground) {
        dino.y += 3;
      } else {
        jumpState = false;
      }
    } else {
      dino.y = gameStats.ground - gameStats.charHeight;
      jumpTimer = 0;
    }

    dino.draw();

    ctx.font = '48px serif';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score : ${parseInt(timer / 10)}`, 760, 100);
    // Ground Line
    ctx.beginPath();
    ctx.moveTo(20, gameStats.ground);
    ctx.lineTo(1060, gameStats.ground);
    ctx.stroke();
  }

  const collisionDetection = (dino, cactus) => {
    let xValue = cactus.x - (dino.x + dino.width);
    let yValue = cactus.y - (dino.y + dino.height);
    if (xValue < 0 && yValue < 0) {
      if (cactus.x + cactus.width > dino.x) {
        alert('게임오버');
        gameStats.start = false;
        cancelAnimationFrame(TrexFrame);
        jumpState = false;
        timer = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return -1;
      }
    } else {
      return 1;
    }
  };

  return canvasPlay;
};

document.addEventListener('keydown', (e) => {
  if (e.code == 'Space') {
    if (!gameStats.start) {
      gameStats.start = true;
      createCanvas()();
    } else if (gameStats.start) {
      jumpState = true;
    }
  }
});

onMounted(() => {});
</script>

<style scoped>
canvas {
  border: 1px solid #333;
  margin: 2rem;
}
</style>
