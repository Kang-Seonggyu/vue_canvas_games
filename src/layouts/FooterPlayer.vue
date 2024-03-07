<template>
  <Transition name="mpBox">
    <div ref="menu" class="player" v-show="props.show">
      <div class="visualizer-container" ref="visualizerContainer"></div>
      <div class="row no-wrap q-pa-md bg-dark text-white">
        <div class="column" style="min-width: 140px">
          <span class="setH1">SETTING</span>
          <div></div>
        </div>

        <q-separator vertical inset class="q-mx-lg" />

        <div class="column items-center">
          <ul>
            <li
              v-for="(music, idx) in props.list"
              :key="`${music.author}-${music.name}`"
              :class="{ current: idx === $props.playerStat.track }"
              @click.stop="$emit('onClickMusic', idx)"
            >
              <div class="img">
                <img :src="music.albumImgURL" />
              </div>
              <p>{{ music.author }} - {{ music.name }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  audio: { type: Object },
  show: { type: Boolean, required: true },
  playerStat: { type: Object, required: true },
  list: { type: Array },
});

const makeBars = ref(false);
const menu = ref();

const audioSource = ref();

const visualizerContainer = ref();

watch(
  () => props.show,
  (show) => {
    if (show) {
      if (!makeBars.value) {
        makeBars.value = true;
        createBars();
      }
    }
  }
);

const createBars = () => {
  const BarNum = 80;

  const ctx = new AudioContext();

  if (audioSource.value) {
    // 이미 연결된 MediaElementSourceNode가 있다면 연결 해제
    audioSource.value.disconnect();
  }
  audioSource.value = ctx.createMediaElementSource(props.audio);
  const analayzer = ctx.createAnalyser();

  audioSource.value.connect(analayzer);
  audioSource.value.connect(ctx.destination);

  const frequencyData = new Uint8Array(analayzer.frequencyBinCount);
  analayzer.getByteFrequencyData(frequencyData);

  for (let i = 0; i < BarNum; i++) {
    const bar = document.createElement('DIV');
    bar.setAttribute('id', 'bar' + i);
    bar.setAttribute('class', 'visualizer-container__bar');
    visualizerContainer.value.appendChild(bar);
  }

  function renderFrame() {
    analayzer.getByteFrequencyData(frequencyData);
    for (let i = 0; i < BarNum; i++) {
      const index = (i + 10) * 2;
      const fd = frequencyData[index];

      const bar = document.querySelector('#bar' + i);
      if (!bar) {
        continue;
      }

      const barHeight = Math.max(3, fd || 0);
      bar.style.height = barHeight / 2 + 'px';
    }

    window.requestAnimationFrame(renderFrame);
  }

  renderFrame();
};
</script>

<style scoped>
.player {
  position: absolute;
  right: 5px;
  bottom: 58px;
}
.mpBox-enter-active,
.mpBox-leave-active {
  transition: all 0.5s ease-in-out;
}
.mpBox-enter-from,
.mpBox-leave-to {
  opacity: 0;
}

ul {
  padding: 0;
  margin: 0;
  height: 150px;
  list-style: none;
  overflow: auto;
}
ul::-webkit-scrollbar {
  width: 10px;
}
ul::-webkit-scrollbar-thumb {
  background-color: #2f3542;
  border-radius: 10px;
}
ul::-webkit-scrollbar-track {
  background-color: grey;
  border-radius: 10px;
  box-shadow: inset 0px 0px 5px white;
}
ul li {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin: 4px;
  cursor: pointer;
}
ul li.current .img::after {
  position: absolute;
  display: block;
  content: '▶';
  text-align: center;
  line-height: 32px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  opacity: 0.8;
}
ul li img {
  width: 32px;
  height: 32px;
  vertical-align: middle;
}
ul li .img {
  position: relative;
  height: 32px;
}
ul li:hover .img::after {
  position: absolute;
  display: block;
  content: '▶';
  text-align: center;
  line-height: 32px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  opacity: 0.8;
}
ul li p {
  position: relative;
  width: 200px;
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.setH1 {
  font-size: 1rem;
  font-weight: 600;
}
</style>

<style>
.q-toolbar__title {
  display: flex;
}
.visualizer-container {
  position: absolute;
  bottom: 5px;
  right: 0;
  left: 0;
  text-align: center;
}

.visualizer-container__bar {
  display: inline-block;
  background: white;
  z-index: -1;
  opacity: 0.3;
  margin: 0 1px;
  width: 3px;
}
</style>
