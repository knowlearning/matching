<template>
    <div class="play-audio">
        <AudioPlayerButton
            :id="props.id"
            @click="toggleAudioPlayback"
            :disabled="!props.id"
        />
        <audio-controls
            v-if="audioPlaying.value"
            :audio="audio"
            :playing="audioPlaying.value"
            @toggle="toggleAudioPlayback"
        />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emits = defineEmits(['change'])

const props = defineProps({
    id: {
        required: true,
        type: [String, null]
    }
})

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
    audioPlaying.value = false
  } else {
    audio.play()
    audioPlaying.value = true
  }
}

</script>