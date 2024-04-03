<template>
<div class="rearrange-customizer" v-if="data.content">
	<h3>Rearrange Column Customizer</h3>
	<h4>Item Scope Id :: {{ id }}</h4>
	<label for="item-name">Item Name:</label>
	<textarea 
		id="item-name" 
		v-model="data.content.name">
	</textarea>
	<label for="instruction">Instructions:</label>
	<textarea 
		id="instructions" 
		v-model="data.content.instructions" 
		placeholder="Enter matching instructions">
	</textarea>
	<br>
	<div class="upload-wrapper">
		<button
			@click="uploadImage"
		>
			Add Image
		</button>
		<button
			@click="uploadAudio"
		>
			Add Audio
		</button>
	</div>
	<br>
	<div>
		<div class="volume-icon" @click="toggleAudioPlayback">
			<i :class="audioPlaying ? 'fas fa-pause' : 'fas fa-volume-up'"/>
		</div>
		<draggable v-model="data.content.images" group="images" @end="onDragEnd" item-key="imageUrl">
			<template #item="{ element }">
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
import { reactive, ref } from 'vue'
import { v4 as uuid } from 'uuid'
import draggable from 'vuedraggable'
import klImage from '../kl-image.vue'


const props = defineProps(['id'])
const data = ref({ content: null })
const audioPlaying = ref(false)
let imageData = []
let audio = null

Agent
	.state(props.id)
	.then(state => {
		if (!state.name) state.name = ''
		if (!state.audioId) state.audioId = null
		if (!state.images) state.images = []
		data.value.content = state

		imageData = data.value.content.images
	})


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

async function toggleAudioPlayback() {
    const audioId = data.value.content.audioId;
    if (!audioId) return;

    const audioUrl = await Agent.download(audioId).url();

    if (!audio) {
        audio = new Audio(audioUrl);
        audio.addEventListener('ended', () => {
            audioPlaying.value = false;
        });
    }

    if (audioPlaying.value) {
        audio.pause();
        audioPlaying.value = false;
    } else {
        audio.play();
        audioPlaying.value = true;
    }
}





function onDragEnd(event) {
    const imageDataCopy = JSON.parse(JSON.stringify(imageData));
    const draggedElement = imageDataCopy.splice(event.oldIndex, 1)[0];
    imageDataCopy.splice(event.newIndex, 0, draggedElement);

    data.value.content.images = imageDataCopy;
    imageData = imageDataCopy;
}


// function onDragEnd(event) {
// 	const imageDataCopy = structuredClone(imageData)
// 	const draggedElement = imageDataCopy.splice(event.oldIndex, 1)[0];
// 	imageDataCopy.splice(event.newIndex, 0, draggedElement);

// 	data.value.content.images = imageDataCopy
// 	imageData = imageDataCopy
// }

</script>

<style scoped>
.rearrange-customizer {
display: flex;
flex-direction: column;
align-items: center;
}
label {
  font-weight: bolder;
}
textarea {
  width: 300px;
  margin-bottom: 12px;
}
textarea#item-name {
  text-align: center;
  height: 16px;
}
textarea#instructions {
  height: 150px;
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
margin-left: 10px;
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
