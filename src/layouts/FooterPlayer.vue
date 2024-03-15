<template>
  <Transition name="mpBox">
    <div ref="menu" class="player" v-show="props.show">
      <div class="visualizer-container" ref="visualizerContainer"></div>
      <div class="row no-wrap q-pa-md bg-dark text-white">
        <div class="column" style="min-width: 140px">
          <span class="setH1"> SETTING </span>
          <div class="equalizer">
            <p class="controler" v-for="i in ['high', 'mid1', 'mid2', 'low']">
              <q-slider
                v-model="equalizer[i]"
                :min="-40"
                :max="40"
                vertical
                reverse
                track-color="grey-8"
              />
              <span class="setH2">{{ i }}</span>
            </p>
          </div>
        </div>

        <q-separator vertical inset class="q-mx-sm" />

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
import { ref, watch, reactive } from 'vue';
const props = defineProps({
  audio: { type: Object },
  show: { type: Boolean, required: true },
  playerStat: { type: Object, required: true },
  list: { type: Array },
});
defineEmits(['onClickMusic']);

const makeBars = ref(false);
const menu = ref();

const visualizerContainer = ref();
const ctx = ref();

const audioSource = ref();

const equalizer = reactive({
  low: 0,
  mid1: 0,
  mid2: 0,
  high: 0,
});
const highPassFilter = ref();
const lowShelfFilter = ref();
const midFilter = ref();
const highShelfFilter = ref();

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

  ctx.value = new AudioContext();

  if (audioSource.value) {
    // 이미 연결된 MediaElementSourceNode가 있다면 연결 해제
    audioSource.value.disconnect();
  }

  highPassFilter.value = eqFilter(ctx.value, 'highpass', 80, equalizer.low);
  lowShelfFilter.value = eqFilter(ctx.value, 'lowshelf', 90, equalizer.mid1);
  midFilter.value = eqFilter(ctx.value, 'peaking', 10000, equalizer.mid2);
  highShelfFilter.value = eqFilter(
    ctx.value,
    'highshelf',
    10000,
    equalizer.high
  );

  audioSource.value = ctx.value.createMediaElementSource(props.audio);
  const analayzer = ctx.value.createAnalyser();

  audioSource.value.connect(analayzer);
  audioSource.value.connect(ctx.value.destination);
  audioSource.value.connect(highPassFilter.value);
  highPassFilter.value.connect(lowShelfFilter.value);
  lowShelfFilter.value.connect(highShelfFilter.value);
  highShelfFilter.value.connect(midFilter.value);
  midFilter.value.connect(ctx.value.destination);

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

function eqFilter(ctx, type, freq, gain, q) {
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  if (gain) {
    filter.gain.value = gain;
  }
  if (q) {
    filter.Q.value = q;
  }
  return filter;
}

watch(
  [
    () => equalizer.low,
    () => equalizer.mid1,
    () => equalizer.mid2,
    () => equalizer.high,
  ],
  ([low, mid1, mid2, high]) => {
    highShelfFilter.value.gain.value = high;
    midFilter.value.gain.value = mid1;
    highPassFilter.value.gain.value = mid2;
    lowShelfFilter.value.gain.value = low;
  }
);
</script>

<style scoped>
.player {
  position: absolute;
  right: 5px;
  bottom: 58px;
}
.mpBox-enter-active,
.mpBox-leave-active {
  transition: all 0.25s ease-in-out;
}
.mpBox-enter-from,
.mpBox-leave-to {
  opacity: 0;
}
.setH1 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.setH2 {
  font-size: 12px;
}
.setH2::first-letter {
  text-transform: uppercase;
}
.equalizer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 125px;
}
.equalizer p.controler {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
}
.equalizer p.controler span {
  margin-top: 5px;
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
</style>

<style>
.q-slider--v {
  height: 100px !important;
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
