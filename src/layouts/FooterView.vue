<template>
  <q-footer elevated class="bg-dark text-white">
    <audio ref="audio" src="/music/king_around_here.mp3" controls></audio>
    <q-linear-progress :value="0.6" color="pink" />
    <q-toolbar>
      <q-toolbar-title>
        <q-btn flat round size="sm" icon="fast_rewind" />
        <q-btn
          flat
          round
          size="sm"
          :icon="musicPlayer.status === 'play' ? 'pause' : 'play_arrow'"
          @click="
            musicPlayer.status !== 'play'
              ? (musicPlayer.status = 'play')
              : (musicPlayer.status = 'pause')
          "
        />
        <q-btn flat round size="sm" icon="fast_forward" />
        <div class="q-ml-md">
          <div class="musicInfo text-weight-bold">The Walker</div>
          <div class="musicInfo text-grey-5">Fitz & The Tantrums</div>
        </div>
      </q-toolbar-title>
      <div class="row items-center q-mr-sm" style="width: 120px">
        <q-slider
          class="q-mx-sm"
          style="flex: 1"
          v-model="musicPlayer.volume"
          track-color="grey-8"
          color="white"
          :label-value="musicPlayer.volume"
          :min="0"
          :max="100"
          label
          label-color="black"
        />
        <q-icon
          class="cursor-pointer text-left q-ml-xs"
          size="sm"
          :name="
            musicPlayer.volume === 0
              ? 'volume_off'
              : musicPlayer.volume < 40
              ? 'volume_down_alt'
              : 'volume_up'
          "
          @click="
            musicPlayer.volume !== 0
              ? (musicPlayer.volume = 0)
              : (musicPlayer.volume = 100)
          "
        />
      </div>
      <q-btn
        color="brown-5"
        :icon="mdiMusicBox"
        @click="playerShow = !playerShow"
      >
        <FooterPlayer :audio="audio" :show="playerShow" :list="musicList" />
      </q-btn>
    </q-toolbar>
  </q-footer>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { mdiMusicBox } from '@quasar/extras/mdi-v6';
import FooterPlayer from './FooterPlayer.vue';

const audio = ref();
const playerShow = ref(false);

const musicList = [
  {
    name: 'ElectronicRock (King Around Here)',
    author: 'AlexGrohl',
    albumImgURL:
      'https://cdn.pixabay.com/audio/2022/04/13/11-20-13-185_200x200.jpg',
    License: 'Music by AlexGrohl from Pixabay',
  },
  {
    name: 'Futuristic Beat',
    author: 'Nver Avetyan',
    albumImgURL:
      'https://cdn.pixabay.com/audio/2023/04/17/09-17-55-729_200x200.jpg',
    License: 'Music by Nver Avetyan from Pixabay',
  },
  {
    name: 'Guitar Electro Sport Trailer',
    author: 'Gvidon',
    albumImgURL:
      'https://cdn.pixabay.com/audio/2023/02/20/13-18-40-936_200x200.png',
    License: 'Music by Gvidon from Pixabay',
  },
  {
    name: 'Titanium',
    author: 'AlisiaBeats',
    albumImgURL:
      'https://cdn.pixabay.com/audio/2023/10/06/12-10-40-317_200x200.png',
    License: 'Music by AlisiaBeats from Pixabay',
  },
];

const musicPlayer = reactive({
  status: 'stop',
  volume: 100,
});

watch(musicPlayer, (x) => {
  console.log(x);
  console.log(audio.value);
  if (x.status === 'play') {
    audio.value.play();
  } else {
    audio.value.pause();
  }
});
</script>

<style scoped>
audio {
  display: none;
}
.musicInfo {
  font-size: 12px;
}
</style>
