<template>
  <image
    :href="imageUrl"
    @click="toggleAudio"
    style="cursor: pointer"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
imageId: {
    type: String,
    required: true
},
audioId: {
    type: String,
    required: true
}
})

const audioUrl = ref(null)
const imageUrl = ref(null)
let audio = null    

Agent.download(props.imageId).url().then(url => imageUrl.value = url)
Agent.download(props.audioId).url().then(url => audioUrl.value = url)

function toggleAudio() {
if (audioUrl.value) {
    if (!audio) {
    audio = new Audio(audioUrl.value)
    audio.play()
    } else {
    if (audio.paused) {
        audio.play()
    } else {
        audio.pause()
        audio.currentTime = 0
    }
    }
}
}
</script>