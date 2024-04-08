<template>
  <div class="row-editor">
    <div class="audio-area">
      <button @click="uploadAudio">
        <i class="fas fa-file-audio"></i>
      </button>
      <button
        @click="toggleAudioPlayback"
        :disabled="!props.audioId"
      >
        <i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" />
      </button>
      <button
        @click="deleteAudio"
        :disabled="!props.audioId"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="item-area">
      <div
        v-for="choice,i in props.choices"
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
import { inputSwal, unsupportedTypeSwal } from '../../../helpers/swallows.js'
import KlImage from '../../kl-image.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const copy = x => JSON.parse(JSON.stringify(x))

const emits = defineEmits(['updateRow'])

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

async function setLocalAudio() {
  if (!props.audioId) return

  const audioUrl = await Agent.download(props.audioId).url()
  audio = new Audio(audioUrl) // ready for audio.play()
  audio.addEventListener('ended', () => {
    audioPlaying.value = false
  })
}

async function uploadAudio() {
  const id = await Agent.upload({ browser: true, accept: 'audio/*' })
  emits('updateRow', {
    audioId: id,
    choices: copy(props.choices)
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
function deleteAudio() {
  emits('updateRow', {
    audioId: null,
    choices: copy(props.choices)
  })
}

async function changeChoice(i) {
  const { isConfirmed, value } = await inputSwal(t, props.choices[i].content)
  if (!isConfirmed) return
  if (!isUUID(value)) {
    const choicesCopy = copy(props.choices)
    choicesCopy[i].content = value
    emits('updateRow', {
      audioId: props.audioId,
      choices: choicesCopy
    })
  } else { // check if image type
    const { active_type } = await Agent.metadata(value)
    if (!active_type || !active_type.startsWith('image')) {
      await unsupportedTypeSwal(t, value, active_type)
    } else {
      const choicesCopy = copy(props.choices)
      choicesCopy[i].content = value
      emits('updateRow', {
        audioId: props.audioId,
        choices: choicesCopy
      })
    }
  }
}

function toggleCorrect() {
  // toggle both
  const choicesCopy = copy(props.choices)
  choicesCopy[0].correct = !choicesCopy[0].correct
  choicesCopy[1].correct = !choicesCopy[1].correct
  emits('updateRow', {
    audioId: props.audioId,
    choices: choicesCopy
  })
}

async function uploadImage(i) {
  try {
    const id = await Agent.upload({ browser: true, accept: 'image/*' })
    const choicesCopy = copy(props.choices)
    choicesCopy[i].content = id
    emits('updateRow', {
      audioId: props.audioId,
      choices: choicesCopy
    })
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
  width: 70px;
  cursor: initial;
}
button:not(:disabled):hover {
  background: #eeeeee;
  cursor: pointer;
}
</style>
