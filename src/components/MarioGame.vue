<template>
  <div>마리오 !</div>
  <div class="gamePlace">
    <canvas ref="canvas" width="640" height="480"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { map1 } from '../data/mario/maps';

const canvas = ref();

const tileSet = new Image();
tileSet.src = '/src/assets/tiles.png';

const drawTile = (ctx, tileX, tileY, positX, positY) => {
  const tileSize = 16;

  ctx.drawImage(
    tileSet,
    16 * tileX,
    16 * tileY,
    16,
    16,
    tileSize * positX, // canvas에서의 x 좌표
    tileSize * positY, // canvas에서의 y 좌표
    tileSize,
    tileSize
  );
};

onMounted(() => {
  const ctx = canvas.value.getContext('2d');

  tileSet.onload = () => {
    // drawTile(ctx, 0, 0, 0, 0);
    // drawTile(ctx, 1, 0, 1, 0);
    // drawTile(ctx, 0, 1, 0, 1);
    // drawTile(ctx, 1, 1, 1, 1);
    // ctx.drawImage(tileSet, 0, 0, 16, 16, 0, 0, 16, 16);
    // ctx.drawImage(tileSet, 16, 16, 16, 16, 16, 16, 16, 16);
    // ctx.drawImage(tileSet, 32, 32, 16, 16, 32, 32, 16, 16);

    ctx.fillStyle = map1.bgColor;
    ctx.fillRect(0, 0, 640, 480);
    map1.bgTiles.map((row, positY) => {
      row.map((tile, positX) =>
        drawTile(ctx, tile[0], tile[1], positX, positY)
      );
    });
    // ctx.drawImage(tileSet, 0, 0);
  };
});
</script>

<style scoped>
.gamePlace {
  text-align: center;
}
canvas {
  border: 1px solid black;
}
</style>
