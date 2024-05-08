<template>
<div class="player">
    <div
        v-if="item?.instructions"
        class="instructions"
    >
        <span class="instructions-prefix">{{ t('instructions') }}:</span>
        {{ item.instructions }}
    </div>
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
            <draggable
                :class="{ 'layout-horizontal' : props.layoutHorizontal }"
                v-model="userOrderedImages"
                @end="onDragEnd"
                item-key="id"
            >
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
    <v-btn color="green" @click="handleSubmit">
        {{ t('submit') }}
    </v-btn>
</div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { itemFeedbackSwal } from '../../helpers/swallows.js'

import KlImage from '../kl-image.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    layoutHorizontal: {
        type: Boolean,
        required: false,
        default: false
    }
})

const item = await Agent.state(props.id)

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

async function handleSubmit() {
  const correctOrder = item.images.map(image => image.id)
  const submittedOrder = userOrderedImages.value.map(image => image.id)
  const isCorrect = JSON.stringify(correctOrder) === JSON.stringify(submittedOrder)
  if (Agent.embedded) {
    Agent.close({ success: isCorrect })
  } else {
    await itemFeedbackSwal(t, isCorrect)
  }
}

function shuffleImages() {
    const shuffledImages = [...userOrderedImages.value];
    const correctOrder = item.images.map(image => image.id);

    do {
        // Resimleri karıştır
        shuffledImages.sort(() => Math.random() - 0.5);
    } while (arraysMatch(correctOrder, shuffledImages.map(image => image.id)));

    userOrderedImages.value = shuffledImages;
}

function arraysMatch(arr1, arr2) {
    // Eğer diziler aynı uzunluktaysa ve her elemanı eşleşiyorsa true döndür
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}


</script>

<style scoped>
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
    cursor: grab;
}
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.layout-horizontal {
    display: flex;
    flex-direction: row;
}
.layout-horizontal > * { margin: 0px 4px 16px 4px; }


</style>
