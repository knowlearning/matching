<template>
	<div class="select-from-pairs-customizer">
		<AbsolutePreviewAndItemId :id="props.id" />

		<div class="left-col">
			<NameAndInstructions :content="data.content" />
			<v-btn
				@click="addRow"
				color="green"
				class="mb-6"
				size="small"
				append-icon="fa-solid fa-plus"
			>
				<span>Add Row</span>
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
const data = reactive({ content: state })

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