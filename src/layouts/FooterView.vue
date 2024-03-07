<template>
  <q-footer elevated class="bg-dark column text-white">
    <audio
      ref="audio"
      :src="musicList[musicPlayer.track].src"
      controls
      @ended="playEndListener"
    ></audio>
    <q-slider
      v-model="playTime"
      color="pink"
      class="py-0"
      :min="0"
      :max="musicPlayer.duration"
      :step="1"
      thumb-size="6px"
      @change="onChangeTime"
    />
    <q-toolbar>
      <q-toolbar-title>
        <q-btn flat round size="sm" icon="fast_rewind" @click="prevTrack" />
        <q-btn
          flat
          round
          size="sm"
          :icon="musicPlayer.status === 'play' ? 'pause' : 'play_arrow'"
          @click="startToggle"
        />
        <q-btn flat round size="sm" icon="fast_forward" @click="nextTrack" />
        <div class="q-ml-md">
          <div class="musicInfo text-weight-bold">
            {{ musicList[musicPlayer.track].name }}
          </div>
          <div class="musicInfo text-grey-5">
            {{ musicList[musicPlayer.track].author }}
          </div>
        </div>
      </q-toolbar-title>
      <div class="row items-center" style="width: 120px">
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
          class="cursor-pointer q-ml-xs"
          size="xs"
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
        size="sm"
        class="cursor-pointer q-ml-xs"
        round
        :icon="musicPlayer.replay === 'one' ? 'repeat_one' : 'repeat'"
        :text-color="musicPlayer.replay === 'no-replay' ? 'grey-8' : 'white'"
        @click="onClickReplay"
      />
      <q-btn
        size="sm"
        class="cursor-pointer q-mr-xs"
        round
        icon="mdi-shuffle-variant"
        :text-color="musicPlayer.shuffle ? 'white' : 'grey-8'"
        @click="onClickShuffle"
      />
      <q-btn
        color="brown-5"
        :icon="mdiMusicBox"
        @click="playerShow = !playerShow"
      >
        <FooterPlayer
          :audio="audio"
          :show="playerShow"
          :playerStat="musicPlayer"
          :list="musicList"
          @onClickMusic="onClickMusic"
        />
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
    src: '/music/king_around_here.mp3',
    albumImgURL:
      'https://cdn.pixabay.com/audio/2022/04/13/11-20-13-185_200x200.jpg',
    License: 'Music by AlexGrohl from Pixabay',
  },
  {
    name: 'Futuristic Beat',
    author: 'Nver Avetyan',
    src: '/music/futuristic_beat.mp3',
    albumImgURL:
      'https://cdn.pixabay.com/audio/2023/04/17/09-17-55-729_200x200.jpg',
    License: 'Music by Nver Avetyan from Pixabay',
  },
  {
    name: 'Guitar Electro Sport Trailer',
    author: 'Gvidon',
    src: '/music/guitar_electro_sport_trailer.mp3',
    albumImgURL:
      'https://cdn.pixabay.com/audio/2023/02/20/13-18-40-936_200x200.png',
    License: 'Music by Gvidon from Pixabay',
  },
  {
    name: 'Titanium',
    author: 'AlisiaBeats',
    src: '/music/titanium.mp3',
    albumImgURL:
      'https://cdn.pixabay.com/audio/2023/10/06/12-10-40-317_200x200.png',
    License: 'Music by AlisiaBeats from Pixabay',
  },
];

const musicPlayer = reactive({
  status: 'pause', // ['play','pause']
  volume: 100,
  track: 0,
  replay: 'no-replay', // ['no-replay','all','one']
  shuffle: false,
  duration: 0,
});
const playTime = ref(0);

/** 좌측 영역 */
const prevTrack = () => {
  if (musicPlayer.track === 0) {
    musicPlayer.track = musicList.length - 1;
  } else {
    musicPlayer.track--;
  }
  playTime.value = 0;
};
const startToggle = () => {
  if (musicPlayer.status !== 'play') {
    musicPlayer.status = 'play';
  } else {
    musicPlayer.status = 'pause';
  }
};
const nextTrack = () => {
  if (musicPlayer.track === musicList.length - 1) {
    musicPlayer.track = 0;
  } else {
    musicPlayer.track++;
  }
  playTime.value = 0;
};

/** 우측 영역 */
const onClickReplay = () => {
  if (musicPlayer.replay === 'one') {
    musicPlayer.replay = 'no-replay';
  } else if (musicPlayer.replay === 'all') {
    musicPlayer.replay = 'one';
  } else {
    musicPlayer.replay = 'all';
  }
};
const onClickShuffle = () => {
  musicPlayer.shuffle = !musicPlayer.shuffle;
};
const onClickMusic = (idx) => {
  musicPlayer.track = idx;
  musicPlayer.status = 'play';
};

/** 이벤트 영역 */
const playListener = (e) => {
  playTime.value = e.target?.currentTime;
};
const onChangeTime = (e) => {
  audio.value.currentTime = e;
};
const playEndListener = (e) => {
  if (musicPlayer.replay === 'one') {
    audio.value.currentTime = 0;
    audio.value.play();
    musicPlayer.status = 'play';
  } else if (
    musicPlayer.replay === 'no-replay' &&
    musicPlayer.track === musicList.length - 1
  ) {
    musicPlayer.status = 'pause';
  } else {
    nextTrack();
  }
};

watch(
  () => musicPlayer.status,
  (x) => {
    console.log('status변경 :', x);
    if (x === 'play') {
      audio.value.play();
      musicPlayer.duration = audio.value.duration;
      audio.value.onloadeddata = () => {
        audio.value.play();
        musicPlayer.duration = audio.value.duration;
      };
      audio.value.addEventListener('timeupdate', playListener);
    } else if (x !== 'play') {
      audio.value.pause();
      audio.value.removeEventListener('timeupdate', playListener);
    }
  }
);
watch(
  () => musicPlayer.volume,
  (x) => {
    audio.value.volume = x / 100;
  }
);
</script>

<style scoped>
audio {
  display: none;
}
.musicInfo {
  font-size: 12px;
}
</style>
<style>
.py-0 .q-slider__track-container {
  padding: 0 !important;
}
.py-0:hover .q-slider__thumb-shape {
  transform: scale(3);
}
</style>
