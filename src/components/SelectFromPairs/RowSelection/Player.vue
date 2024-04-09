<template>
  <div class="row-player">
    <div class="left-area">
      <button
        v-show="!!props.audioId"
        @click="toggleAudioPlayback"
      >
        <i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" />
      </button>
      <div> {{ getLabelForRowNumber() }}) </div>
    </div>

    <div
      :class="{
        'item-area' : true,
        'wide' : props.wideItemArea
      }"
    >
      <div class="choice"
        v-for="choice,i in props.choices"
        :key="`choice-${i}`"
        @click="handleChange(i)"
      >
        <div
          :class="{
            'choice-inner' : true,
            'selected': userSelected === i
          }"
        >
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

import { useStore } from 'vuex'
const store = useStore()

const emits = defineEmits(['entryIsCorrect'])

const props = defineProps({
  audioId: {
    type: [ String, null ],
    required: true
  },
  choices: {
    type: Array,
    required: true
  },
  wideItemArea: {
    type: Boolean,
    required: false,
    default: false
  },
  rowIndex: {
    type: Number,
    required: true
  }
})

let audio = null
let audioPlaying = ref(false)
setLocalAudio()
let userSelected = ref(null)


function getLabelForRowNumber() {
  const lang = store.getters.language()
  const choices = (lang === 'th') ?
    ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ', 'ฎ', 'ฏ'] : 
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']
  return choices[props.rowIndex]
}

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
  display: flex;
  justify-content: center;
  width: 100%;

}
.left-area, .placeholder {
  min-width: 100px;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 6px;
  font-weight: bolder;
}
.item-area {
  justify-self: center;
  height: 100px;
  border: 2px solid lightgrey;
  width: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-radius: 10px;
  padding: 8px;
  margin: 8px;
  
}
.item-area.wide {
  width: 100%;
  
}
.item-area .choice {
  padding: 8px;
  width: 95%;
  height: 90px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}
.item-area .choice:first-child {
  border-right: 2px solid lightgrey;  
}
.choice-inner {
  position: relative;
  transition: transform 0.5s ease;
}

.choice-inner:hover:not(.selected) {
  transform: scale(1.4);
  z-index: 1;
}

.selected {
  border-radius: 8px; 
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.7); 
  transition: background-color 0.5s ease;
  background-color: blue;
}

.choice-inner:not(.selected) {
  opacity: 0.6; 
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
