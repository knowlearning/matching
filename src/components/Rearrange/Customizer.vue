<template>
<div class="rearrange-customizer" v-if="data.content">
	<h3>{{ t('rearrange-column-customizer') }}</h3>
	<h4>{{ t('item-id') }}: {{ id }}</h4>
	<label for="item-name">{{ t('item-name') }}:</label>
	<textarea 
		id="item-name" 
		v-model="data.content.name">
	</textarea>
	<label for="instruction">{{ t('instructions-optional') }}:</label>
	<textarea 
		id="instructions" 
		v-model="data.content.instructions" 
	>
	</textarea>
	<AudioBar
		:key="`audio-bar-${data.content.audioId}`"
		:audioId="data.content.audioId"
		@change="data.content.audioId = $event"
	/>

	<div class="upload-wrapper">
		<button
			@click="uploadImage"
		>
			{{ t('add-image') }}
		</button>
		<button
			@click="uploadAudio"
		>
			{{ t('add-audio') }}
		</button>
	</div>
	<br>
	<div>
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
import AudioBar from '../AudioBar.vue'
import draggable from 'vuedraggable'
import klImage from '../kl-image.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps(['id'])
const data = ref({ content: null })
let imageData = []

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

function onDragEnd(event) {
    const imageDataCopy = JSON.parse(JSON.stringify(imageData));
    const draggedElement = imageDataCopy.splice(event.oldIndex, 1)[0];
    imageDataCopy.splice(event.newIndex, 0, draggedElement);

    data.value.content.images = imageDataCopy;
    imageData = imageDataCopy;
}

// function onDragEnd(event) {
//     const imageDataCopy = structuredClone(imageData)
//     const draggedElement = imageDataCopy.splice(event.oldIndex, 1)[0];
//     imageDataCopy.splice(event.newIndex, 0, draggedElement);

//     data.value.content.images = imageDataCopy
//     imageData = imageDataCopy
// }


</script>

<style scoped>
.rearrange-customizer {
display: flex;
flex-direction: column;
align-items: center;
}
h3, h4 {
	margin: 6px 0 0 0;
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
  height: 40px;
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

.upload-icon {
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

.choice {
width: 200px;
}

button {
margin-left: 10px;
}

.upload-icon i {
font-size: 24px;
}

</style>
