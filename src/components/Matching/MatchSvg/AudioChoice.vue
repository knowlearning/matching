<template>
    <g id="group-for-hover-filter">
      <image
        :href="imageUrl"
        @click="toggleAudio"
      />
    </g>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    imageId: {
        type: String,
        required: false,
        // TODO: Remove for play icon in place
        default: '60e5b5d1-5c48-43bd-b739-a47c58bc890a'
    },
    content: { // uuid of audio file
        type: String,
        required: true
    }
})

const audioUrl = ref(null)
const imageUrl = ref(null)
let audio = null    

Agent.download(props.imageId).url().then(url => imageUrl.value = url)
Agent.download(props.content).url().then(url => audioUrl.value = url)

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

<style scoped>
:hover {
    cursor: pointer;
    filter: invert(0.5);
}
#group-for-hover-filter image {
    /*  card width is 140x100 magic numbers. hence magic numbers below to center */
    x: 35;
    y: 25;
    width: 50%;
    height: 50%;
}
</style>
