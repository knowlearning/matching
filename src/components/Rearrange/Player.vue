<template>
<div class="player">
    <h2 v-if= "item?.name"> Item Name: {{ item.name }}</h2>
    <h3 v-if="item?.instructions">Instructions: {{ item.instructions }}</h3>
    <div class="image-container">
      <div class="volume-icon" @click="toggleAudioPlayback">
          <i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'"/>
        </div>
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
    <button 
    class="submit" 
    @click="handleSubmit" 
    :disabled="submitted">{{ submitted ? 'Submitted' : 'Submit' }}
    </button>
</div>
</template>

<script setup>
import { defineProps, ref, reactive, onMounted, computed } from 'vue'
import draggable from 'vuedraggable'
import KlImage from './kl-image.vue'

const props = defineProps(['id'])
const item = await Agent.state(props.id)
const submitted = ref(false)
const userOrderedImages = ref(item.images)
const audioPlaying = ref(false)
let audio = null
const data = ref({ content: null })

Agent
  .state(props.id)
  .then(state => {
    if (!state.name) state.name = ''
    if (!state.instructions) state.instructions = ''
    if (!state.images) state.images = []
    data.value.content = state
  })

onMounted(() => {
  shuffleImages()
})

const audioId = computed(() => {
  if (data.value.content) {
    return data.value.content.audioId
  } else {
    return null
  }
})
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
  if (audio.paused) {
    audio.play();
    audioPlaying.value = true;
  } else {
    audio.pause();
    audioPlaying.value = false;
  }
}
function onDragEnd(event) {
    if (!event || !event.detail) {
        console.error('Event or event detail is null or undefined.');
        return;
    }

    const newOrder = event.detail.map(item => item.element);
    userOrderedImages.value = newOrder;
}

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
.image-and-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.choice {
  background: antiquewhite;
    object-fit: contain;
    padding: 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    margin: 15px;
    width: 100%;
}
.volume-icon {
    cursor: pointer;
    font-size: 2em;
    margin-bottom: 10px;
}
</style>
