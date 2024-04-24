<template>
  <div class="row-editor">
    <AudioBar
      :id="props.audioId"
      @change="handleAudioChange"
      vertical
    />
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
          <v-btn
            @click.stop="changeChoice(i)"
            icon="fa-solid fa-edit"
            size="x-small"
          />
          <PickFileButton
            fasIcon="fa-upload"
            :size="'x-small'"
            acceptType="image/*"
            @newFile="handleNewImage(i, $event)"
          />
        </div>
      </div>
    </div>
    <v-btn
      @click="$emit('removeRow')"
      size="x-small"
      class="ml-2"
      color="red"
      icon="fa-solid fa-remove"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { validate as isUUID } from 'uuid'
import { inputSwal, unsupportedTypeSwal } from '../../../helpers/swallows.js'
import KlImage from '../../kl-image.vue'
import AudioBar from '../../AudioBar.vue'
import PickFileButton from '../../PickFileButton.vue'
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

function handleAudioChange(audioId) {
  emits('updateRow', {
    audioId,
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

async function handleNewImage(i, id) {
  const choicesCopy = copy(props.choices)
  choicesCopy[i].content = id
  emits('updateRow', {
    audioId: props.audioId,
    choices: choicesCopy
  })
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
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.item-area .choice {
  width: 170px;
  height: 180px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.correct {
  border-radius: 8px; 
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.7); 
  transition: background-color 0.5s ease;
  background-color: #3457D5;
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
