<template>
  <h3>벽돌깨기 !</h3>
  <div class="gamePlace">
    <canvas ref="canvas" width="640" height="480"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const canvas = ref();

onMounted(() => {
  const ctx = canvas.value.getContext('2d');

  let timer = 0;

  // 게임 시작 전
  let buttonColor = '#0095DD';

  function drawStartBtn() {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    ctx.fillStyle = buttonColor;
    ctx.fillRect(120, 120, 400, 100);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Game Start !', 270, 180);
  }
  drawStartBtn();

  const gameStart = () => {
    if (timer === 0) {
      draw();
    }
  };

  canvas.value.addEventListener('click', (e) => {
    const rect = canvas.value.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (mouseX >= 120 && mouseX <= 520 && mouseY >= 120 && mouseY <= 220) {
      gameStart();
    }
  });

  // 공
  const ballRadius = 10;
  let x = canvas.value.width / 2;
  let y = canvas.value.height - 30;
  let dx = -3;
  let dy = -2;

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  }

  // 판자
  const paddleHeight = 10;
  const paddleWidth = 90;
  const paddleOffset = 10;
  let paddleX = (canvas.value.width - paddleWidth) / 2;
  let rightPressed = false;
  let leftPressed = false;
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(
      paddleX,
      canvas.value.height - paddleHeight - paddleOffset,
      paddleWidth,
      paddleHeight
    );
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  }

  // 벽돌
  const brick = {
    row: 3,
    col: 5,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 40,
    offsetLeft: 110,
  };
  const bricks = [];
  for (let c = 0; c < brick.col; c++) {
    bricks[c] = [];
    for (let r = 0; r < brick.row; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
  function drawBricks() {
    for (let c = 0; c < brick.col; c++) {
      for (let r = 0; r < brick.row; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          const brickX = c * (brick.width + brick.padding) + brick.offsetLeft;
          const brickY = r * (brick.height + brick.padding) + brick.offsetTop;
          b.x = brickX;
          b.y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brick.width, brick.height);
          ctx.fillStyle = '#0095DD';
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  // 이벤트
  let score = 0;
  let lives = 3;

  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);
  canvas.value.addEventListener('mousemove', mouseMoveHandler, false);

  function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      leftPressed = false;
    }
  }

  function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.value.offsetLeft;
    const rect = canvas.value.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (mouseX >= 120 && mouseX <= 520 && mouseY >= 120 && mouseY <= 220) {
      if (timer === 0) {
        canvas.value.style.cursor = 'pointer';
      }
      buttonColor = '#0075BD';
    } else {
      canvas.value.style.cursor = 'default';
      buttonColor = '#0095DD';
    }
    if (relativeX > 0 && relativeX < canvas.value.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
    drawStartBtn();
  }

  function collisionDetection() {
    for (let c = 0; c < brick.col; c++) {
      for (let r = 0; r < brick.row; r++) {
        const b = bricks[c][r];

        // 깨지지 않은 벽돌의 경우 이벤트 실행
        if (b.status >= 1) {
          if (
            (x + ballRadius > b.x || x - ballRadius > b.x) &&
            (x + ballRadius < b.x + brick.width ||
              x - ballRadius < b.x + brick.width) &&
            (y + ballRadius > b.y || y - ballRadius > b.y) &&
            (y + ballRadius < b.y + brick.height ||
              y - ballRadius < b.y + brick.height)
          ) {
            console.log(
              Math.abs(x - b.x),
              Math.abs(x - (b.x + brick.width)),
              Math.abs(y - b.y),
              Math.abs(y - (b.y + brick.height))
            );
            dy = -dy;
            b.status -= 1;
            score++;

            if (score === brick.row * brick.col) {
              alert('You Win, Congraturations!');
            }
          }
        }
      }
    }
  }

  function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095dd';
    ctx.fillText(`Score : ${score}`, 15, 25);
  }
  function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`Lives: ${lives}`, canvas.value.width - 75, 25);
  }

  function draw() {
    timer++;
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

    drawBall();
    drawBricks();
    drawPaddle();

    collisionDetection();
    drawScore();
    drawLives();

    if (
      // 좌우측 벽
      x + dx > canvas.value.width - ballRadius / 2 ||
      x + dx < ballRadius / 2
    ) {
      dx = -dx;
    }
    if (y + dy < ballRadius / 2) {
      // 상단측 벽
      dy = -dy;
    } else if (
      // 하단측 이벤트
      y + dy >
        canvas.value.height - paddleOffset - paddleHeight - ballRadius / 2 &&
      y + dy < canvas.value.height - paddleOffset - ballRadius / 2
    ) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      }
    } else if (y + dy > canvas.value.height - ballRadius / 2) {
      lives--;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        x = canvas.value.width / 2;
        y = canvas.value.height - 30;
        paddleX = (canvas.value.width - paddleWidth) / 2;
      }
    }

    if (rightPressed) {
      paddleX = Math.min(paddleX + 7, canvas.value.width - paddleWidth);
    } else if (leftPressed) {
      paddleX = Math.max(paddleX - 7, 0);
    }

    x += dx;
    y += dy;

    const brickGame = requestAnimationFrame(draw);
  }
});
</script>

<style scoped>
h3 {
  text-align: center;
}
.gamePlace {
  text-align: center;
}
canvas {
  border: 1px solid black;
}
</style>
