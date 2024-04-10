<template>
	<div class="select-from-pairs-customizer">
		<h3>{{ t('select-from-pairs-customizer') }}</h3>
		<h4>{{ t('item-id') }}: {{ id }} </h4>
		<label for="item-name">{{ t('item-name') }}:</label>
		<input id="item-name" v-model="data.content.name" />
		<label for="instructions">{{ t('instructions-optional') }}:</label>
		<textarea id="instructions" v-model="data.content.instructions" />
		<div class="single-audio">
			<label for="audio">{{ t('audio-optional') }}:</label>
			<input
				id="audio"
				type="text"
				v-model="data.content.audio"
			/>
			<button @click="uploadAudio">
				<i class="fas fa-file-audio"></i>
			</button>
			<button
				@click="toggleAudioPlayback"
				:disabled="!data.content.audio"
			>
				<i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" />
			</button>
			<button
				@click="deleteAudio"
				:disabled="!data.content.audio"
			>
				<i class="fas fa-trash"></i>
			</button>
		</div>
		<div
			class="row-wrapper"
			v-for="r,i in data.content.rows"
			:key="`row-${i}`"
		>
			<Row
				v-bind="r"
				@updateRow="data.content.rows[i] = $event"
			/>
			<button @click="removeRow(i)" style="color: red;">x</button>
		</div>
		<button @click="addRow" style="color: green;">+</button>
	</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import Row from './RowSelection/Customizer.vue'
import newRowSchema from './newRowSchema.js'
import { useStore } from 'vuex'


const store = useStore()
function t(slug) { return store.getters.t(slug) }
const copy = x => JSON.parse(JSON.stringify(x))

const props = defineProps({
	id: { type: String, required: true }
})

const state = await Agent.state(props.id)
const data = reactive({ content: state })

let audio = null
let audioPlaying = ref(false)

async function toggleAudioPlayback() {
	if (audioPlaying.value) {
		audio.pause()
	} else {
		audio.play()
	}
	audioPlaying.value = !audioPlaying.value
}

async function setLocalAudio() {
	if (!data.content.audio) return

	const audioUrl = await Agent.download(data.content.audio).url()
	audio = new Audio(audioUrl)
	audio.addEventListener('ended', () => {
		audioPlaying.value = false
	})
}




function deleteAudio() {
	data.content.audio = null
	audio = null
	audioPlaying.value = false
}

async function uploadAudio() {
	const id = await Agent.upload({ browser: true, accept: 'audio/*' })
	data.content.audio = id
	setLocalAudio()
}

function updateRow(i,payload) {
	data.content.rows.push()
	const rowsCopy = copy(data.content.rows)
	rowsCopy[i] = payload
	data.content.rows = dataContentCopy
}
function addRow() {
	data.content.rows.push(copy(newRowSchema))
}
function removeRow(i) {
	const rowCopy = copy(data.content.rows)
	rowCopy.splice(i,1)
	data.content.rows = rowCopy
}
</script>

<style scoped>
.select-from-pairs-customizer {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
h3, h4, input, textarea {
	margin: 0 0 10px 0;
}
input, textarea {
	display: block;
	text-align: center;
	width: 400px;
}
</style>