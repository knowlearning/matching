<template>
  <div class="row-player">
    <div class="audio-area">
      <button
        v-show="!!props.audioId"
        @click="toggleAudioPlayback"
      >
        <i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" />
      </button>
    </div>
    <div class="item-area">
      <div
        v-for="choice,i in props.choices"
        :key="`choice-${i}`"
        :class="{
            choice: true,
            selected: userSelected === i
        }"
        @click="handleChange(i)"
      >
        <div class="choice-inner">
          <KlImage v-if="isUUID(choice.content)"
            :id="choice.content"
            :size="{ width: '80px', height: '80px' }"
          />
          <div v-else>{{ choice.content }}</div>
        </div>
      </div>
    </div>
    <div class="placeholder"></div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { validate as isUUID } from 'uuid'
import KlImage from '../../kl-image.vue'

const emits = defineEmits(['entryIsCorrect'])

const props = defineProps({
  audioId: {
    type: [ String, null ],
    required: true
  },
  choices: {
    type: Array,
    required: true
  }
})

let audio = null
let audioPlaying = ref(false)
setLocalAudio()
let userSelected = ref(null)

async function setLocalAudio() {
  const audioId = props.audioId
  if (!audioId) return

  const audioUrl = await Agent.download(audioId).url()
  audio = new Audio(audioUrl) // ready for audio.play()
  audio.addEventListener('ended', () => {
    audioPlaying.value = false
  })
}

async function toggleAudioPlayback() {
  if (audioPlaying.value) {
    audio.pause()
    audioPlaying.value = false
  } else {
    audio.play()
    audioPlaying.value = true
  }
}
function handleChange(i) {
  userSelected.value = (userSelected.value === i ? null : i)
  const correctIndex = props.choices.findIndex(el => el.correct)
  const isCorrect = userSelected.value === correctIndex
  emits('entryIsCorrect', isCorrect)
}

</script>

<style scoped>
.row-player {
  display: grid;
  grid-template-columns: 1fr 420px 1fr;


}
.audio-area {
  align-self: center;
  justify-self: right;
}
.item-area {
  justify-self: center;
  width: 400px;
  height: 100px;
  border: 2px solid lightgrey;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.item-area .choice {
  width: 120px;
  height: 90px;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.selected {
  background: lightseagreen;
}
.choice-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}
button {
  width: 70px;
  cursor: initial;
}
button:not(:disabled):hover {
  background: #eeeeee;
  cursor: pointer;
}
</style>
