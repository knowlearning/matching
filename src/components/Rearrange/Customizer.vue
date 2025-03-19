<template>
	<div class="rearrange-customizer" v-if="data?.content">

		<AbsolutePreviewAndItemId :id="props.id" />

		<div class="left-col">
			<NameAndInstructions
				:content="data.content"
				style="width: 420px;"
			/>
			<CustomizeFeedback
				:feedback="data.content.feedback"
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
					@newFile="data.content.images.push({ id: $event })"
				/>
			</div>
		</div>

		<div class="right-col">
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
import { reactive, watch } from 'vue'
import { v4 as uuid } from 'uuid'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'
import CustomizeFeedback from '../SharedCustomizerComponents/CustomizeFeedback.vue'

import AudioBar from '../AudioBar.vue'
import PickFileButton from '../PickFileButton.vue'
import draggable from 'vuedraggable'
import klImage from '../kl-image.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const copy = x => JSON.parse(JSON.stringify(x))

const props = defineProps(['id'])
const data = reactive({ content: null })

Agent
	.state(props.id)
	.then(state => {
		if (!state.name) state.name = ''
		if (!state.audioId) state.audioId = null
		if (!state.images) state.images = []
		if (!state.feedback) state.feedback = { correct: null, incorrect: null }
		if (!state.translations) updateTranslationPaths()
		data.content = state
	})

function updateTranslationPaths() {
  const source_language = store.getters.language()
  const paths = [
    [ "name" ],
    [ "instructions" ],
    [ "audioId" ],
    [ "feedback", "correct" ],
    [ "feedback", "incorrect" ]
  ]
  data.content.images.forEach((_,i) => paths.push([ "images", i, "id"]))
  data.content.translations = { source_language, paths }
}

watch(
	() => data.content ? data.content.images : data,
	updateTranslationPaths,
	{ deep: true }
)

function removeImage(id) {
	const imagesCopy = copy(data.content.images)
	const index = imagesCopy.findIndex(image => image.id === id)
	imagesCopy.splice(index, 1)
	data.content.images = imagesCopy
}

function onDragEnd(event) {
	// vue draggable maintains its own internal copy that it sets after
	// being set the first time
	data.content.images = copy(data.content.images)
}

</script>

<style scoped>
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

</style>
