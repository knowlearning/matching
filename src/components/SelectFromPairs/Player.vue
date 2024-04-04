<template>
	<div>
		<p>{{ questionDef.instructions }}</p>
		<Row
			v-for="r, i in questionDef.rows"
			:key="`row-${i}`"
			v-bind="r"
			@entryIsCorrect="rowsCorrect[i] = $event"
		/>
		<button @click="handleSubmit">Submit</button>
	</div>
</template>

<script setup>
import { reactive } from 'vue'
import Row from './RowSelection/Player.vue'

const props = defineProps({
	id: { type: String, required: true }
})

const questionDef = await Agent.state(props.id)
const rowsCorrect = reactive(questionDef.rows.map(r => false)) // init to array of false

function handleSubmit() {
	const isCorrect = rowsCorrect.every(el => el)
	alert(isCorrect ? 'woo' : 'boo')
}
</script>