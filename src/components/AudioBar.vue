<template>
	<div class="audio-bar">
		<button @click="uploadAudio">
			<i class="fas fa-file-audio"></i>
		</button>
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
import { uploadSizeNotificationSwal } from '../helpers/swallows.js'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

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

async function validate(file) {
	const SIZE_LIMIT = 1000000
	if (file.size > SIZE_LIMIT) {
		console.warn('file too big')
		return false
	} else {
		return true
	}

}

async function uploadAudio() {
	await uploadSizeNotificationSwal(t)

	const id = await Agent.upload({ browser: true, accept: 'audio/*', validate })
	if (id) emits('change', id)
}

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