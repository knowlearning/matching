<template>
	<div class="rearrange-customizer" v-if="data?.content">

		<AbsolutePreviewAndItemId :id="props.id" />

		<div class="left-col">
			<NameAndInstructions
				:content="data.content"
				style="width: 420px;"
			/>
			<div class="audio-area">
				<AudioBar
					:id="data.content.audioId"
					@change="data.content.audioId = $event"
				/>
				<PickFileButton
					fasIcon="fa-plus"
					acceptType="image/*"
					@newFile="imageData.push({ id: $event })"
				/>
			</div>
		</div>

		<div class="right-col">
			<draggable
				class="draggable"
				v-model="butterflyImages1"
				group="images"
				@end="onDragEnd"
				item-key="imageUrl"
			>

				<template #item="{ element }">
					<div class="image-and-buttons">
						<button @click="removeImage(element.id)">
							<i class="fas fa-trash" />
						</button>
						<klImage
							:id="element.id"
							class="choice"
						/>
					</div>
				</template>
			</draggable>
			<draggable
				class="draggable"
				v-model="butterflyImages2"
				group="images"
				@end="onDragEnd"
				item-key="imageUrl"
			>

				<template #item="{ element }">
					<div class="image-and-buttons">
						<button @click="removeImage(element.id)">
							<i class="fas fa-trash" />
						</button>
						<klImage
							:id="element.id"
							class="choice"
						/>
					</div>
				</template>
			</draggable>
		</div>
		
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { v4 as uuid } from 'uuid'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'
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


const butterflyImages1 = [
    {
        "id": "9c9058e0-f8ec-11ee-95b9-47b383c910e1"
    },
    {
        "id": "e6e76a00-f8ec-11ee-95b9-47b383c910e1"
    },
    {
        "id": "39d545c0-f8ed-11ee-95b9-47b383c910e1"
    },
    {
        "id": "4dd57870-f8ec-11ee-8881-b3d50f9242a3"
    }
]

const butterflyImages2 = [
    {
        "id": "9c9058e0-f8ec-11ee-95b9-47b383c910e1"
    },
    {
        "id": "e6e76a00-f8ec-11ee-95b9-47b383c910e1"
    },
    {
        "id": "39d545c0-f8ed-11ee-95b9-47b383c910e1"
    },
    {
        "id": "4dd57870-f8ec-11ee-8881-b3d50f9242a3"
    }
]



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
	const imageDataCopy = JSON.parse(JSON.stringify(imageData));
	const index = imageDataCopy.findIndex(image => image.id === id);
	imageDataCopy.splice(index, 1);

	data.value.content.images = imageDataCopy;
	imageData = imageDataCopy;
}

function onDragEnd(event) {
	console.log(event)
    const imageDataCopy = JSON.parse(JSON.stringify(imageData));
    const draggedElement = imageDataCopy.splice(event.oldIndex, 1)[0];
    imageDataCopy.splice(event.newIndex, 0, draggedElement);

    data.value.content.images = imageDataCopy;
    imageData = imageDataCopy;
}

</script>




<style scoped>
@media (width <= 820px) {
  .rearrange-customizer {
  	flex-direction: column;
  	align-items: center;
  }
  .draggable {
  	display: inline-block;
  }
}


.rearrange-customizer {
	display: flex;
	
	justify-content: space-around;
	position: relative;
	height: 100%;
}
.rearrange-customizer .left-col,
.rearrange-customizer .right-col {
	padding: 8px;
}
.rearrange-customizer .left-col {
	margin-top: 52px;
}
.image-and-buttons {
	background: antiquewhite;
	padding: 20px;
	margin: 8px;
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

</style>
