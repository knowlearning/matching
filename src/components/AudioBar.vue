<template>
	<div class="audio-bar">
		<button @click="uploadAudio">
			<i class="fas fa-file-audio"></i>
		</button>
		<button
			@click="toggleAudioPlayback"
			:disabled="!props.audioId"
		>
			<i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" />
		</button>
		<button
			@click="deleteAudio"
			:disabled="!props.audioId"
		>
			<i class="fas fa-trash"></i>
		</button>
	</div>

</template>

<script setup>
import { ref } from 'vue'

let audio = ref(null)
const audioPlaying = ref(null)

const props = defineProps({
	audioId: {
		required: true,
		type: [ String, null ]
	}
})
const emits = defineEmits(['change'])

setLocalAudio()

async function uploadAudio() {
	const id = await Agent.upload({ browser: true, accept: 'audio/*' })
	emits('change', id)
}

async function setLocalAudio() {
	if (!props.audioId) return

	const audioUrl = await Agent.download(props.audioId).url()
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

function deleteAudio() {
	emits('change', null)
	audio = null
	audioPlaying.value = false
}

</script>