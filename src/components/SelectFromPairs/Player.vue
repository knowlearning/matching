<template>
	<div>
		<p v-if="questionDef.instructions">{{ questionDef.instructions }}</p>
		<Row
			class="row"
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
	if (isCorrect && Agent.embedded) Agent.close({ success: true })
}
</script>

<style scoped>
.row { margin: 4px; }
</style>