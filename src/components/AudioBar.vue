<template>
	<div class="audio-bar">
		<PickFileButton
			fas-icon="fa-file-audio"
			acceptType="audio/*"
			@newFile="emits('change', $event)"
		/>

		<v-btn
			@click="toggleAudioPlayback"
			size="small"
			class="ma-2"
			:disabled="!props.id"
			:icon="audioPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-volume-up'"
		/>
		<v-btn
			@click="deleteAudio"
			size="small"
			class="ma-2"
			:color="props.id ? 'red' : ''"
			:disabled="!props.id"
			icon="fa-solid fa-trash"
		/>
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