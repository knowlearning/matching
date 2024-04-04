<template>
  <div class="row-editor" v-if="data.content">
    <div class="audio-area">
      <button @click="uploadAudio">
        <i class="fas fa-file-audio"></i>
      </button>
      <button
        @click="toggleAudioPlayback"
        :disabled="!data.content.audioId"
      >
        <i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" />
      </button>
    </div>
    <div class="item-area">
      <div
        v-for="choice,i in data.content.choices"
        :key="`choice-${i}`"
        :class="{ choice: true, correct: choice.correct }"
        @click="toggleCorrect"
      >
        <div class="choice-inner">
          <KlImage v-if="isUUID(choice.content)"
            :id="choice.content"
            :size="{ width: '100px', height: '100px' }"
          />
          <div v-else>{{ choice.content }}</div>
        </div>

        <div>
          <button
            @click.stop="changeChoice(i)"
          ><i class="fas fa-edit"></i></button>
          <button
            @click.stop="uploadImage(i)"
          ><i class="fas fa-upload"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { validate as isUUID } from 'uuid'
import { inputSwal, unsupportedTypeSwal } from '../../helpers/swallows.js'
import KlImage from '../kl-image.vue'

const props = defineProps(['id'])
const data = reactive({ content: null })
let audio = null
let audioPlaying = ref(false)

await Agent
  .state(props.id)
  .then(state => data.content = state )

setLocalAudio()

async function setLocalAudio() {
  const audioId = data.content.audioId
  if (!audioId) return

  const audioUrl = await Agent.download(audioId).url()
  audio = new Audio(audioUrl) // ready for audio.play()
  audio.addEventListener('ended', () => {
    audioPlaying.value = false
  })
}

async function uploadAudio() {
  const id = await Agent.upload({ browser: true, accept: 'audio/*' })
  data.content.audioId = id
  setLocalAudio()
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

async function changeChoice(i) {
  const { isConfirmed, value } = await inputSwal(data.content.choices[i].content)
  if (!isConfirmed) return
  if (!isUUID(value)) {
    data.content.choices[i].content = value
  } else { // check if image type
    const { active_type } = await Agent.metadata(value)
    if (!active_type || !active_type.startsWith('image')) {
      await unsupportedTypeSwal(value, active_type)
    } else {
      data.content.choices[i].content = value
    }
  }
}

function toggleCorrect() {
  // toggle both
  data.content.choices[0].correct = !data.content.choices[0].correct
  data.content.choices[1].correct = !data.content.choices[1].correct
}

async function uploadImage(i) {
  try {
    const id = await Agent.upload({ browser: true, accept: 'image/*' })
    data.content.choices[i].content = id
  } catch (error) {
    console.error('Error uploading image:', error)
    alert('Error uploading image.')
  }
}
</script>

<style scoped>
.row-editor {
  display: flex;
  justify-content: center;
  align-items: center;
}
.audio-area {
  margin-right: 30px;
  display: flex;
  flex-direction: column;
}
.item-area {
  width: 400px;
  height: 200px;
  border: 2px solid lightgrey;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.item-area .choice {
  width: 170px;
  height: 180px;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.correct {
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
  width: fit-content;
  cursor: initial;
}
button:not(:disabled):hover {
  background: #eeeeee;
  cursor: pointer;
}
</style>
