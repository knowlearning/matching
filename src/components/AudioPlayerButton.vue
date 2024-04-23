<template>
    <v-btn
        @click="toggleAudioPlayback"
        size="small"
        class="ma-2"
        :icon="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'"
    />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const questionDef = await Agent.state(props.id)

let audio = null
const audioPlaying = ref(null)

watch(() => props.id, setLocalAudio)

setLocalAudio()

async function setLocalAudio() {
    const audioUrl = await Agent.download(props.id).url()
    audio = new Audio(audioUrl)
    audio.addEventListener('ended', () => {
        audioPlaying.value = false
    })
}

async function toggleAudioPlayback() {
    audioPlaying.value ? audio.pause() : audio.play()
    audioPlaying.value = !audioPlaying.value
}

</script>