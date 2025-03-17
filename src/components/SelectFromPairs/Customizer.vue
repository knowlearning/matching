<template>
	<div class="select-from-pairs-customizer">
		<AbsolutePreviewAndItemId :id="props.id" />

		<div class="left-col">
			<NameAndInstructions
				:content="data.content"
				style="width: 300px;"
			/>
			<CustomizeFeedback
				:feedback="data.content.feedback"
				style="width: 300px;"
			/>
			<v-btn
				@click="addRow"
				color="green"
				class="mb-6"
				size="small"
				append-icon="fa-solid fa-plus"
			>
				<span>{{ t('add-row') }}</span>
			</v-btn>
			<AudioBar
				:id="data.content.audioId"
				@change="data.content.audioId = $event"
			/>
		</div>

		<div class="right-col">
			<div
				class="row-wrapper"
				v-for="r,i in data.content.rows"
				:key="`row-${i}`"
			>
				<RowCustomizer
					v-bind="r"
					@updateRow="data.content.rows[i] = $event"
					@removeRow="removeRow(i)"
				/>
			</div>

		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'
import CustomizeFeedback from '../SharedCustomizerComponents/CustomizeFeedback.vue'
import RowCustomizer from './RowSelection/Customizer.vue'
import AudioBar from '../AudioBar.vue'
import newRowSchema from './newRowSchema.js'
import { useStore } from 'vuex'

const store = useStore()
function t(slug) { return store.getters.t(slug) }
const copy = x => JSON.parse(JSON.stringify(x))

const props = defineProps({
	id: { type: String, required: true }
})

const state = await Agent.state(props.id)
// rehab old content
if (!state.feedback) state.feedback = { correct: null, incorrect: null }
if (!state.translations) updateTranslationPaths()

function updateTranslationPaths() {
  const source_language = store.getters.language()
  const paths = [
    [ "name" ],
    [ "instructions" ],
    [ "audioId" ],
    [ "feedback", "correct" ],
    [ "feedback", "incorrect" ],
    // [ "rows", 0, "audioId" ],
    // [ "rows", 0, "choices", 0, "content" ],
    // [ "rows", 0, "choices", 1, "content" ],
    // [ "rows", 1, "audioId" ],
    // [ "rows", 1, "choices", 0, "content" ],
    // [ "rows", 1, "choices", 1, "content" ],
    // [ "rows", 2, "audioId" ],
    // [ "rows", 2, "choices", 0, "content" ],
    // [ "rows", 2, "choices", 1, "content" ],
  ]
  state.rows.forEach((row,i) => {
  	paths.push([ "rows", i, "audioId"])
  	row.choices.forEach((_,j) => {
  		paths.push([ "rows", i, "choices", j, "content"])
  	})
  })
  // the payoff
  state.translations = { source_language, paths }
}

const data = reactive({ content: state })

function updateRow(i,payload) {
	data.content.rows.push()
	const rowsCopy = copy(data.content.rows)
	rowsCopy[i] = payload
	data.content.rows = dataContentCopy
	updateTranslationPaths()
}
function addRow() {
	data.content.rows.push(copy(newRowSchema))
	updateTranslationPaths()
}
function removeRow(i) {
	const rowCopy = copy(data.content.rows)
	rowCopy.splice(i,1)
	data.content.rows = rowCopy
	updateTranslationPaths()
}
</script>

<style scoped>
.select-from-pairs-customizer {
	position: relative;
	display: flex;
	height: 100%;
	justify-content: space-around;
}
.left-col,
.right-col {
	padding: 8px;
}
.left-col {
	margin-top: 52px;
}
.right-col .row-wrapper {
	margin: 6px 0;
}


</style>