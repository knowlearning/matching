<template>
    <button
        v-show="!!props.audioId"
        @click="toggleAudioPlayback"
      >
        <i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" />
      </button>
</template>

<script setup>
import { ref,watch } from 'vue'

const props = defineProps({
    id: { type: String, required: true }
})

const questionDef = await Agent.state(props.id)

let audio = null
const audioPlaying = ref(null)

watch(() => props.id, setLocalAudio)

setLocalAudio()

async function setLocalAudio() {
    if (!props.id) return

    const audioUrl = await Agent.download(props.id).url()
    audio = new Audio(audioUrl)
    audio.addEventListener('ended', () => {
        audioPlaying.value = false
    })
}

async function toggleAudioPlayback() {
    if (audioPlaying.value) {
        audio.pause()
    } else {
        // getting here but without audio defined...
        audio.play()
    }
    audioPlaying.value = !audioPlaying.value
}


</script>