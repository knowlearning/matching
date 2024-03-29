<template>
<div class="player">
    <h2 v-if= "item?.name">{{ item.name }}</h2>
    <h3 v-if="item?.instructions">{{ item.instructions }}</h3>
    <div class="image-container">
        <i 
        :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" 
        style="cursor: pointer;"
        @click="toggleAudioPlayback"
        />
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
import { ref, reactive, onMounted } from 'vue'
import draggable from 'vuedraggable'
import KlImage from './kl-image.vue'


const props = defineProps(['id'])
const item = await Agent.state(props.id)

const data = reactive({
studentConnections: [],
})


const submitted = ref(false)
const userOrderedImages = ref(item.images)
const audioPlaying = ref(false)

onMounted(() => {
  shuffleImages()
})

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

  // Check if the submitted order matches the correct order
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



</style>
