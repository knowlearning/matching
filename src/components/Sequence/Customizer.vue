<template>
	<div class="sequence-customizer">
		<h3>Sequence Customizer</h3>
		<h4>Scope Id :: {{ id }} </h4>
		<label for="item-name">Sequence Name:</label>
		<textarea
			id="item-name"
			v-model="data.content.name"
		/>
		<div
			class="item-list-wrapper"
			@dragover.prevent
			@drag.prevent
			@drop.prevent="handleDrop"
		>
			<h4>Drag Items on To Add</h4>
			<div v-for="({ id:item }, i) in data.content.items" :key="item">
				<button
					class="small-inline-button"
					@click="moveItemUp(i)"
				>&uarr;</button>
				<button
					class="small-inline-button"
					@click="moveItemDown(i)"
				>&darr;</button>
				<button
					class="small-inline-button remove"
					@click="removeItem(i)"
				>x</button>
				<span>{{ i + 1 }}. </span>
				<ItemName :id="item" />
			</div>
		</div>
	</div>
</template>


<script setup>
import { reactive, computed } from 'vue'
import { sequenceImportableTypes } from '../../helpers/questionTypes.js'
import { unsupportedTypeSwal } from '../../helpers/swallows.js'
import ItemName from '../ItemName.vue'

const props = defineProps(['id'])

const state = await Agent.state(props.id)

const data = reactive({
	content: state
})

async function handleDrop(e) {
	const attemptedId = e.dataTransfer.getData('text')
	const { active_type } = await Agent.metadata(attemptedId)
	if (!active_type || !sequenceImportableTypes.includes(active_type)) {
		await unsupportedTypeSwal(attemptedId, active_type)
	} else {
		data.content.items.push({ id: attemptedId })		
	}
}
function removeItem(i) {
	const itemsCopy = JSON.parse(JSON.stringify(data.content.items))
	itemsCopy.splice(i,1)
	data.content.items = itemsCopy
}
function moveItemUp(i) {
	if (i === 0) return
	const itemsCopy = JSON.parse(JSON.stringify(data.content.items))
	const item=itemsCopy[i]
	itemsCopy.splice(i,1)
	itemsCopy.splice(i-1,0,item)
	data.content.items = itemsCopy
}
function moveItemDown(i) {
	const itemsCopy = JSON.parse(JSON.stringify(data.content.items))
	if (i >= itemsCopy.length - 1) return
	const item=itemsCopy[i]
	itemsCopy.splice(i,1)
	itemsCopy.splice(i+1,0,item) // same index bc next el shifted
	data.content.items = itemsCopy
}
</script>

<style scoped>
.sequence-customizer {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.sequence-customizer > h3 {
	margin-bottom: 0;
}
.sequence-customizer > h4 {
	margin-top: 0;
}
.item-list-wrapper {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	font-family: monospace;
	min-height: 300px;
	min-width:600px;
	background: antiquewhite;
	padding: 20px;
	margin-top: 20px;
}
.item-list-wrapper > h4 {
	margin: 0;
	text-align: center;
	width: 100%;
}
button.small-inline-button {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	border: 2px solid black;
	margin: 4px;
	padding: 5px;
	height: 26px;
	width: 26px;
	background:yellow;
	font-size: 1.1rem;
}
button.small-inline-button:hover {
	background: grey;
}
button.small-inline-button.remove {
	background: lightcoral;
	font-size: 1rem;
	margin-right: 10px;
}
button.small-inline-button.remove:hover {
	background: red;
}

</style>