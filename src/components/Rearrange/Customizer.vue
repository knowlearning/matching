<template>
<div class="rearrange-customizer" v-if="data.content">
	<button
		class="preview-button"
		@click="store.dispatch('previewContent', props.id)"
	>
		<i class="fas fa-eye" /> 
	</button>
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
		:id="data.content.audioId"
		@change="data.content.audioId = $event"
	/>
	<PickFileButton
		fasIcon="fa-plus"
		acceptType="image/*"
		@newFile="imageData.push({ id: $event })"
	/>
	<br>
	<div>
		<draggable
			v-model="data.content.images"
			group="images"
			@end="onDragEnd"
			item-key="imageUrl"
		>
			<template #item="{ element }">
				<div class="image-row">
					<div class="image-and-buttons">
						<button @click="removeImage(element.id)">
							<i class="fas fa-trash" />
						</button>
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
import PickFileButton from '../PickFileButton.vue'
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

function removeImage(id) {
	data.value.content.images = data.value.content.images
		.filter(obj => obj.id !== id)
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
cursor: grab;
position: relative;
}
.image-and-buttons > button {
	position: absolute;
	bottom: 0;
	right: 0;
}
.image-and-buttons > button:hover {
	color: red;
}

.choice {
width: 200px;
}

button {
margin-left: 10px;
}
</style>
