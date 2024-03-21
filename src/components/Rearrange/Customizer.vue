<template>
<div class="rearrange-customizer" v-if="data.content">
	<h3>Rearrange Column Customizer</h3>
	<h4>Item Scope Id :: {{ id }}</h4>
	<label for="item-name">Item Name:</label>
	<textarea id="item-name" v-model="data.content.name"></textarea>
	<br>
	<div class="upload-wrapper">
		<div
			class="upload-icon"
			@click="uploadImage"
		>
			<i class="fas fa-image" />
		</div>
		<div
			class="audio-icon"
			@click="uploadAudio"
		>
			<i class="fas fa-music" />
		</div>
		<div class="volume-icon" @click="toggleAudioPlayback">
			<i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'" />
		</div>
	</div>
	<div>
		<draggable v-model="data.content.images" group="images" @end="onDragEnd" item-key="imageUrl">
			<template #item="{ element, index }">
				<div class="image-row">
					<div class="image-and-buttons">
						<klImage
							:id="element.id"
							class="choice"
						/>
					</div>
				</div>
			</template>
		</draggable>
	</div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { v4 as uuid } from 'uuid'
import draggable from 'vuedraggable'
import klImage from './kl-image.vue'

const props = defineProps(['id'])

const data = ref({
	content: null
})

let imageData

Agent
	.state(props.id)
	.then(state => {
		if (!state.name) state.name = ''
		if (!state.audioId) state.audioId = null
		if (!state.images) state.images = []
		data.value.content = state

		imageData = data.value.content.images
	})

let audio = null;
const audioPlaying = ref(false); 

async function uploadImage() {
	const id = uuid();
	await Agent.upload({ id, browser: true, accept: 'image/*' });
	imageData.push({ id })
}

async function uploadAudio() {
	const id = uuid();
	await Agent.upload({ id, browser: true, accept: 'audio/*' });
	data.value.content.audioId = id;
}

function toggleAudioPlayback() {
	if (audioPlaying.value) {
		audio.pause();
	} else {
		if (!audio) {
			audio = new Audio(imageData[0].audioUrl);
		}
		if (audio.paused) {
			audio.play();
		} else {
			audio.pause();
			audio.currentTime = 0;
		}
	}
	audioPlaying.value = !audioPlaying.value;
}

function onDragEnd(event) {
	const imageDataCopy = structuredClone(imageData)
	const draggedElement = imageDataCopy.splice(event.oldIndex, 1)[0];
	imageDataCopy.splice(event.newIndex, 0, draggedElement);

	data.value.content.images = imageDataCopy
	imageData = imageDataCopy
}
</script>

<style scoped>
.rearrange-customizer {
display: flex;
flex-direction: column;
align-items: center;
}

.image-row {
display: flex;
align-items: center;
margin-bottom: 10px;
}

.image-and-buttons {
background: antiquewhite;
padding: 20px;
border-radius: 12px;
display: flex;
align-items: center;
justify-content: space-between;
width: 100%;
cursor: pointer;
}

.upload-wrapper {
display: flex;
align-items: center;
}

.upload-icon, .audio-icon {
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
width: 50px;
height: 50px;
border-radius: 50%;
background-color: antiquewhite;
margin-right: 10px;
color: grey;
}

.upload-icon {
margin-right: 10px;
}

.audio-icon {
margin-left: 100px;
cursor: pointer;
}

.volume-icon {
margin-left: 100px;
color: grey;
cursor: pointer;
}

.choice {
width: 200px;
}

button {
margin-left: 10px;
}

.upload-icon i, .audio-icon i, .volume-icon i {
font-size: 24px;
}

</style>
