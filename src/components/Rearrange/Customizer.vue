<template>
<div class="rearrange-customizer">
	<h3>Rearrange Column Customizer</h3>
	<h4>Item Scope Id :: {{ id }}</h4>
	<label for="item-name">Item Name:</label>
	<textarea id="item-name" v-model="data.content.name"></textarea>
	<br>
		<div>
		<draggable v-model="imageData" group="images" @end="onDragEnd" item-key="imageUrl">
			<template #item="{ element, index }">
			<div class="image-row">
				<div class="image-and-buttons">
				<img :src="element.imageUrl" class="choice" v-if="element.imageUrl" />
					<div class="upload-wrapper">
						<div class="upload-icon" @click="uploadImage" v-if="!element.imageUrl">
						<i class="fas fa-image"></i>
						</div>
						<div class="audio-icon" @click="uploadAudio" v-if="!element.imageUrl && !element.audioUrl">
						<i class="fas fa-music"></i>
						</div>
						<div class="volume-icon" @click="toggleAudioPlayback(index)" v-if="element.audioUrl">
						<i :class="audioPlaying[index] ? 'fas fa-pause' : 'fas fa-volume-up'"></i>
						</div>
					</div>
				</div>
			</div>
			</template>
		</draggable>
		</div>
</div>
</template>

<script setup>
import { reactive } from 'vue'
import { v4 as uuid } from 'uuid'
import draggable from 'vuedraggable'

const props = defineProps(['id'])

const data = reactive({
content: {
	name: '',
	images: []
}
})

let audio = null;
const audioPlaying = reactive({}); 

async function uploadImage() {
const id = uuid();
await Agent.upload({ id, browser: true, accept: 'image/*' });
data.content.images.push(id);
addNewRow();
const imageUrl = await Agent.download(id).url();
imageData[imageData.length - 1].imageUrl = imageUrl;
}

async function uploadAudio() {
const id = uuid();
await Agent.upload({ id, browser: true, accept: 'audio/*' });
data.content.audioId = id;
const audioUrl = await Agent.download(id).url();
imageData[0].audioUrl = audioUrl;
}

function toggleAudioPlayback(index) {
if (audioPlaying[index]) {
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
audioPlaying[index] = !audioPlaying[index];
}

function addNewRow() {
imageData.push({ imageUrl: '' });
}

const imageData = reactive([
{ imageUrl: '', audioUrl: '' }
]);

function onDragEnd(event) {
const draggedElement = imageData.splice(event.oldIndex, 1)[0];
imageData.splice(event.newIndex, 0, draggedElement);
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
