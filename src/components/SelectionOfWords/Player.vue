<template>
    <div class="player">
      <h2 v-if="itemState.configuration">Item Name: {{ itemState.configuration.name }}</h2>
      <h3 v-if="itemState.configuration">Instructions: {{ itemState.configuration.instructions }}</h3>
      <div>
        <div class="volume-icon" @click="toggleAudioPlayback">
          <i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'"/>
        </div>
        <div class="image-row">
          <div class="column-left">
            <div
              v-for="(image, index) in leftImages"
              :key="image.id"
              :id="image.id"
              @click="selectOption(index, 'left')"
              class="image"
            >
              <p style="color: black;">
                {{ leftAlphabetIndex[index] }}) <kl-image :id="image.id" />
              </p>
              <div class="option-circle" @click="isSelected(index, 'left')">
                <i
                  :class="{
                    'fas fa-check-circle': isSelected(index, 'left'),
                    'far fa-circle': !isSelected(index, 'left')
                  }"
                  style="font-size: 1.5em; color: black;"
                />
              </div>
            </div>
          </div>
          <div class="column-right">
            <div
              v-for="(image, index) in rightImages"
              :key="image.id"
              :id="image.id"
              @click="selectOption(index, 'right')"
              class="image"
            >
              <p style="color: black;">{{ rightAlphabetIndex[index] }}) <kl-image :id="image.id" /></p>
              <div class="option-circle" @click="isSelected(index, 'right')">
                <i
                  :class="{
                    'fas fa-check-circle': isSelected(index, 'right'),
                    'far fa-circle': !isSelected(index, 'right')
                  }"
                  style="font-size: 1.5em; color: black;"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <button 
        class="submit" 
        @click="handleSubmit" 
        :disabled="submitted">{{ submitted ? 'Submitted' : 'Submit' }}
      </button>
    </div>
  </template>
  
<script setup>
import { ref, reactive, computed } from 'vue'
import klImage from '../kl-image.vue'

const props = defineProps(['id'])
const itemState = reactive({ configuration: null })
const audioPlaying = ref(false)
let audio = null
const submitted = ref(false);

Agent
.state(`word-select-player-state-${props.id}`)
.then(state => {
    if (!state.selectedOptions) state.selectedOptions = {}
    playState.persistentKlState = state
    playState.selectedImages = state.selectedOptions
})

Agent
.state(props.id)
.then(state => itemState.configuration = state)

const playState = reactive({
    persistentKlState: null,
    selectedImages: {}
})
const leftImages = computed(() => {
    if (itemState.configuration) {
        return itemState.configuration.images.filter(({ type }) => type === 'left')
    } else return []
})
const rightImages = computed(() => {
    if (itemState.configuration) {
        return itemState.configuration.images.filter(({ type }) => type === 'right')
    } else return []
})
const audioId = computed(() => {
    if (itemState.configuration) {
        return itemState.configuration.audioId
    } else return null
})


function selectOption(id, side) {
const key = `${id}-${side}`;
const oppositeSide = side === 'left' ? 'right' : 'left';
const oppositeKey = `${id}-${oppositeSide}`;
const selectedOptions = playState.selectedImages;

if (selectedOptions[key]) {
    delete selectedOptions[key];
} else {
    delete selectedOptions[oppositeKey];
    selectedOptions[key] = true;
}}
function isSelected(id, side) {
return playState.selectedImages[`${id}-${side}`]
}
async function toggleAudioPlayback() {
const audioId = itemState.configuration.audioId;
if (!audioId) return;

const audioUrl = await Agent.download(audioId).url();

if (!audio) {
    audio = new Audio(audioUrl);
    audio.addEventListener('ended', () => {
        audioPlaying.value = false;
    });
}
if (audioPlaying.value) {
    audio.pause();
    audioPlaying.value = false;
} else {
    audio.play();
    audioPlaying.value = true;
}}

const leftAlphabetIndex = Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i));
const rightAlphabetIndex = Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i));

function handleSubmit() {
    const correctSelections = itemState.configuration.images.filter(({ type }) => type === 'left').map(({ id }) => id)
    const selectedImages = Object.keys(playState.selectedImages).map(key => key.split('-')[0])
    const isCorrect = JSON.stringify(correctSelections) === JSON.stringify(selectedImages)

    if (isCorrect) {
        alert('Correct!');
    } else {
        alert('Incorrect!');
    }
    submitted.value = true;
}
</script>

<style scoped>
.player {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.image-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    object-fit: contain;
}
.column-left, .column-right {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.image{
    background: antiquewhite;
    object-fit: contain;
    padding: 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    margin: 15px;
}
.volume-icon {
    cursor: pointer;
    font-size: 2em;
    margin-bottom: 10px;
}
.option-circle {
    cursor: pointer;
}
.additional-text {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 10px;
    float: left;
}
</style>
