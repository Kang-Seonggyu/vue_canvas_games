<template>
  <q-menu
    ref="menu"
    transition-show="rotate"
    transition-hide="rotate"
    no-parent-event
    persistent
    class="player"
    :offset="[0, 15]"
    v-model="display"
    :class="props.show ? 'show' : 'hide'"
  >
    <div class="visualizer-container" ref="visualizerContainer"></div>
    <div class="row no-wrap q-pa-md bg-dark text-white">
      <div class="column" style="min-width: 140px">Setting</div>

      <q-separator vertical inset class="q-mx-lg" />

      <div class="column items-center">
        <ul>
          <li
            v-for="(music, idx) in props.list"
            :key="`${music.author}-${music.name}`"
          >
            <p>{{ music.author }} - {{ music.name }}</p>
          </li>
        </ul>
      </div>
    </div>
  </q-menu>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  audio: { type: Object },
  show: { type: Boolean, required: true },
  list: { type: Array },
});

const display = true;
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
  const BarNum = 65;

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
ul {
  padding: 0;
  margin: 0;
  height: 150px;
  list-style: none;
  overflow: auto;
}
</style>

<style>
.q-menu.player {
  position: relative;
  transition: opacity 500ms ease-in-out;
}
.q-menu.player.show {
  opacity: 1;
}
.q-menu.player.hide {
  opacity: 0;
}
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
