<template>
	<div class="audio-bar">
		<PickFileButton
			fas-icon="fa-file-audio"
			acceptType="audio/*"
			@newFile="emits('change', $event)"
		/>

		<button
			@click="toggleAudioPlayback"
			:disabled="!props.id"
		>
			<i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" />
		</button>
		<button
			@click="deleteAudio"
			:disabled="!props.id"
		>
			<i class="fas fa-trash"></i>
		</button>
	</div>

</template>

<script setup>
import { ref, watch } from 'vue'
import PickFileButton from './PickFileButton.vue'

const emits = defineEmits(['change'])

const props = defineProps({
	id: {
		required: true,
		type: [ String, null ]
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