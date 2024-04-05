<template>
	<div class="select-from-pairs-customizer">
		<h3>Select from Pairs Customizer</h3>
		<h4>Scope Id :: {{ id }} </h4>
		<label for="item-name">Item Name:</label>
		<textarea
			id="item-name"
			v-model="data.content.name"
		/>

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
import { reactive } from 'vue'
import Row from './RowSelection/Customizer.vue'
import newRowSchema from './newRowSchema.js'

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