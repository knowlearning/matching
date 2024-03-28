<template>
  <div class="customizer" v-if="data.content">
    <h3> Selection of Words Column Customizer</h3>
    <h4>Item Scope Id :: {{ id }}</h4>
    <label for="item-name">Item Name:</label>
    <textarea 
      id="item-name" 
      v-model="data.content.name">
    </textarea>
    <label for="instruction">Instructions:</label>
    <textarea 
      id="instructions" 
      v-model="data.content.instructions" 
      placeholder="Enter instructions">
    </textarea>
    <br>
    <div class="upload-wrapper">
      <button @click="uploadImage('left')">Add Image Left</button>
      <button @click="uploadImage('right')">Add Image Right</button>
    </div>
    <button @click="uploadAudio">Add Audio</button>
    <br>
    <div>
      <div class="volume-icon" @click="toggleAudioPlayback">
        <i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'"/>
      </div>
      <div class="image-row">
        <div class="column-left">
          <div v-for="(option, index) in imageData[0]" :key="index" class="image-and-buttons-left">
            <p style="color: black;">{{ index + 1 }}) <kl-image :id="option.id" /></p>
            <div class="option-circle" @click="isSelected(index, 0)">
              <i :class="{ 'fas fa-check-circle': isSelected(index, 0), 'far fa-circle': !isSelected(index, 0) }" style="font-size: 1.5em; color: black;"></i>
            </div>
          </div>
        </div>
        <div class="column-right">
          <div v-for="(option, index) in imageData[1]" :key="index" class="image-and-buttons-right">
            <p style="color: black;">{{ index + 1 }}) <kl-image :id="option.id" /></p>
            <div class="option-circle" @click="isSelected(index, 0)">
              <i :class="{ 'fas fa-check-circle': isSelected(index, 1), 'far fa-circle': !isSelected(index, 1) }" style="font-size: 1.5em; color: black;"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, reactive } from 'vue'
import { v4 as uuid } from 'uuid'
import klImage from './kl-image.vue'

const props = defineProps(['id'])
const data = ref({ content: null })
const audioPlaying = ref(false)
const imageData = reactive([[], []])
let audio = null
const selectedOptions = new Map()


Agent
  .state(props.id)
  .then(state => {
    if (!state.name) state.name = ''
    if (!state.audioId) state.audioId = null
    if (!state.images) state.images = []
    data.value.content = state

    separateImages(data.value.content.images)
  })

async function uploadImage(side) {
  try {
    const id = uuid()
    const response = await Agent.upload({ id, browser: true, accept: 'image/*' })
    data.value.content.images.push({ id, url: response.url, type: side })

    separateImages(data.value.content.images)
  } catch (error) {
    console.error('Error uploading image:', error)
    alert('Error uploading image. Please try again.')
  }
}

function separateImages(images) {
  imageData[0] = []
  imageData[1] = []
  images.forEach(image => {
    if (image.type === 'left') {
      imageData[0].push(image)
    } else if (image.type === 'right') {
      imageData[1].push(image)
    }
  })
}

async function uploadAudio() {
	const id = uuid();
	await Agent.upload({ id, browser: true, accept: 'audio/*' });
	data.value.content.audioId = id;
}

async function toggleAudioPlayback() {
  const audioId = data.value.content.audioId;
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
  }
}

function selectOption(index, side) {
  const key = `${index}-${side}`
  if (selectedOptions.has(key)) {
    selectedOptions.delete(key)
  } else {
    selectedOptions.set(key, true)
  }
}

function isSelected(index, side) {
  return selectedOptions.has(`${index}-${side}`)
}




</script>

<style scoped>
.customizer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
label {
  font-weight: bolder;
}
textarea {
  width: 300px;
  margin-bottom: 12px;
}
textarea#item-name {
  text-align: center;
  height: 16px;
}
textarea#instructions {
  height: 150px;
}
.image-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  object-fit: contain;
}

.image-and-buttons-left, .image-and-buttons-right {
  background: antiquewhite;
  object-fit: contain;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin: 15px;
  object-fit: contain;
}
.column-left, .column-right {
  flex: 1;
}

.upload-wrapper {
  display: flex;
  align-items: center;
}

.upload-icon, .audio-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: antiquewhite;
  margin-right: 10px;
  color: grey;
}
.upload-icon {
  margin-right: 10px;
}

.audio-icon {
  margin-left: 100px;
  cursor: pointer;
}

.volume-icon {
  margin-left: 10px;
  color: grey;
  cursor: pointer;
}

button {
  margin-left: 10px;
}

.upload-icon i, .audio-icon i, .volume-icon i {
  font-size: 24px;
}
.image-row {
  gap: 10px;
}
</style>
