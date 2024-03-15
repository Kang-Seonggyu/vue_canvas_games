<template>
  <div>Home</div>
  <div class="ttsBox bg-grey-4 q-pa-md q-ma-sm rounded-borders">
    <h2>TTS</h2>
    <q-input label="Text" v-model="Text" />
    <q-select
      v-model="voiceSelect"
      :options="voices.map((e) => e.name)"
      label="Voice"
    />
    <div class="row justify-around">
      <q-btn
        class="bg-grey-6 q-mt-sm"
        icon="info"
        @click="console.log(voices)"
      />
      <q-btn class="bg-grey-6 q-mt-sm" icon="play_arrow" @click="g_gout()" />
      <q-btn class="bg-grey-6 q-mt-sm" icon="stop" @click="pause()" />
    </div>
  </div>

  <div class="ttsBox bg-grey-4 q-pa-md q-ma-sm rounded-borders">
    <h2>STT</h2>
    <div class="container">
      <div class="my-3">
        <q-btn icon="keyboard_voice" class="bg-grey-6" @click="enable_stt()">
          음성인식
        </q-btn>
        <q-btn class="bg-grey-6 d-none" icon="stop" @click="disable_stt()">
          중지하기
        </q-btn>
        <p ref="message">버튼을 누르고 말씀하세요.</p>
      </div>

      <form action="" method="post" id="stt-form">
        <div class="my-3">
          <textarea ref="content" class="form-control"></textarea>
        </div>
        <input type="submit" class="btn btn-primary" />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const Text = ref('이곳에 원하는 값을 넣어주자');
const voiceSelect = ref();
const voices = ref();
const utterThis = ref();
function setVoiceList() {
  voices.value = window.speechSynthesis.getVoices();
}

setVoiceList();

if (window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = setVoiceList;
}
function speech(txt) {
  if (!window.speechSynthesis) {
    alert(
      '음성 재생을 지원하지 않는 브라우저입니다. 크롬, 파이어폭스 등의 최신 브라우저를 이용하세요'
    );
    return;
  }

  const lang = 'ko-KR';
  utterThis.value = new SpeechSynthesisUtterance(txt);

  utterThis.value.onend = function (event) {
    console.log('end');
  };

  utterThis.value.onerror = function (event) {
    console.log('error', event);
  };

  let voiceFound = false;

  for (var i = 0; i < voices.value.length; i++) {
    if (
      voices.value[i].lang.indexOf(lang) >= 0 ||
      voices.value[i].lang.indexOf(lang.replace('-', '_')) >= 0
    ) {
      utterThis.value.voice = voices.value[i];
      voiceFound = true;
    }
  }

  utterThis.value.voice = voices.value[12];
  if (!voiceFound) {
    alert('voice not found');
    return;
  }

  utterThis.value.lang = lang;
  utterThis.value.pitch = 1.1;
  utterThis.value.rate = 1.1; //속도

  window.speechSynthesis.speak(utterThis.value);
}
function pause() {
  window.speechSynthesis.cancel();
}
function g_gout() {
  speech(Text.value);
}

/** STT 영역 */
const message = ref();
const content_field = ref();
let content_field_value = ''; // STT 재시작시마다 results 값이 초기화됩니다.

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const speech_recognition = new SpeechRecognition();
speech_recognition.lang = 'ko-kr';
speech_recognition.continuous = true;

function enable_stt() {
  // content_field_value = content_field.value.value;
  console.log(content_field.value)

  speech_recognition.start();
  message.value.innerHTML = '음성인식 중...';
}

function disable_stt() {
  speech_recognition.stop();
  message.value.innerHTML = '버튼을 누르고 말씀하세요.';
}

// stt_start_button이 <form> 안에 있다면 submit 동작을 가지게 됩니다.
// 그런데 다른 STT동작을 해야지, form submit을 해서는 안 되는 것이잖아요.
// 아래 click handler에서 e.preventDefault(); 를 호출하여 원래 동작(form submit)을 안하게 하든지.
// stt_start_button은 <form> 외부로 빼시는 것이 낫습니다.
speech_recognition.onresult = function (e) {
  console.log(e.results);
  // disable_stt();

  // 매 result 반환 시마다 e.results의 개수가 늘어납니다.
  const transcript = Array.from(e.results)
    .map((result) => result[0])
    .map((speech) => speech.transcript)
    .join(' ');

  console.log('transcript :', transcript);
  content_field.value.innerHTML = content_field_value + ' ' + transcript;
};

speech_recognition.onerror = function (e) {
  console.error(e);
  disable_stt();
};
</script>

<style scoped>
.ttsBox {
  max-width: 400px;
  text-align: center;
}
h2 {
  margin: 5px;
  font-size: 1.5rem;
  line-height: 1.5rem;
}
</style>
<style></style>
