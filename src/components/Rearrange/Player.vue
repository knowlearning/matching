<template>
<div class="player">
    <h3 v-if="item?.instructions">Instructions:{{ item.instructions }}</h3>
    <div class="image-container">
        <div v-if="data.content?.audioId" class="audio-play-area">
            <i 
                :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" 
                style="cursor: pointer;"
                @click="toggleAudioPlayback"
            />
            <br>
            <input
                type="range"
                min="0"
                :max="audio ? audio.duration : 100"
                v-model="currentAudioTime"
                @input="seekAudio"
            >
        </div>


        <div class="content">
        <draggable v-model="userOrderedImages" @end="onDragEnd" item-key="id">
            <template #item="{ element }">
                <div class="image-row">
                    <div class="image-and-buttons">
                        <KlImage 
                        :id="element.id" 
                        alt="Placeholder Alt Text" 
                        cssClass="placeholder-css-class" 
                        class="choice" />
                    </div>
                </div>
            </template>
        </draggable>
      </div>
    </div>
    <button class="submit" @click="handleSubmit">
        {{ t('submit') }}
    </button>
</div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import KlImage from '../kl-image.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps(['id'])
const item = await Agent.state(props.id)

const submitted = ref(false)
const userOrderedImages = ref(item.images)
const audioPlaying = ref(false)
let audio = null
const currentAudioTime = ref(0)

const data = ref({ content: null })
Agent
  .state(props.id)
  .then(state => {
    if (!state.name) state.name = ''
    if (!state.instructions) state.instructions = ''
    if (!state.images) state.images = []
    data.value.content = state
  })

shuffleImages()

async function toggleAudioPlayback() {
    const audioId = data.value.content.audioId;
    if (!audioId) return;
    const audioUrl = await Agent.download(audioId).url();
    if (!audio) {
        audio = new Audio(audioUrl);
        audio.addEventListener('ended', () => {
            audioPlaying.value = false;
        });
        audio.addEventListener('timeupdate', () => {
            currentAudioTime.value = audio.currentTime;
        });
    }
    if (audio.paused) {
        audio.play();
        audioPlaying.value = true;
    } else {
        audio.pause();
        audioPlaying.value = false;
    }
}

function seekAudio() {
    if (audio) {
        audio.currentTime = currentAudioTime.value;
    }
}

function onDragEnd(event) {
    if (!event.detail) {
        console.error('Event detail is null or undefined.');
    return;
}
if (Array.isArray(event.detail)) {
    const newOrder = event.detail.map(item => item.element);
    userOrderedImages.value = newOrder;
} else {
    console.error('Unexpected format for event detail:', event.detail);
}}

function handleSubmit() {
  const correctOrder = item.images.map(image => image.id)
  const submittedOrder = userOrderedImages.value.map(image => image.id)

  const isCorrect = JSON.stringify(correctOrder) === JSON.stringify(submittedOrder)
    if (isCorrect) {
        alert('Correct order!');
    } else {
        alert('Incorrect order!');
    }
    submitted.value = true;
}

function shuffleImages() {
  const shuffledImages = [...userOrderedImages.value];
  for (let i = shuffledImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffledImages[i];
    shuffledImages[i] = shuffledImages[j];
    shuffledImages[j] = temp;
  }
  userOrderedImages.value = shuffledImages;
} 
</script>

<style scoped>
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
}
.image-and-buttons {
    background: antiquewhite;
    padding: 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
}
.choice {
    width: 200px;
}
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
}


</style>
