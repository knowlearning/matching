<template>
	<div
		class="item-list-wrapper"
		@dragover.prevent
		@drag.prevent
		@drop.prevent="handleDrop"
	>
		<h4>{{ t('drag-on-items-to-add') }}</h4>
		<div
			v-for="({ id:item }, i) in props.items"
			:key="item"
			class="item-row"
		>
			<v-btn
				icon="fa-solid fa-arrow-up"
				color="yellow"
				size="x-small"
				class="ma-1"
				@click="moveItemUp(i)"
			/>
			<v-btn
				icon="fa-solid fa-arrow-down"
				color="yellow"
				size="x-small"
				class="ma-1 mr-4"
				@click="moveItemDown(i)"
			/>
			<span>{{ i + 1 }}. </span>
			<ItemName
				:id="item"
				@click.shift="alertText(item)"
				draggable="true"
				style="cursor: grab;"
				@dragstart="$event.dataTransfer.setData('text', item)"
			/>
			<v-btn
				icon="fa-solid fa-remove"
				color="red"
				size="x-small"
				class="ml-auto"
				@click="removeItem(i)"
			/>
		</div>
	</div>
</template>

<script setup>
import { sequenceImportableTypes } from '../../helpers/questionTypes.js'
import {
	unsupportedTypeSwal,
	areYouSureSwal,
	alertTextSwal
} from '../../helpers/swallows.js'
import ItemName from '../ItemName.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const EMBED_DOMAINS = [
	'localhost:5113',
	'embed.knowlearning.systems'
]

const props = defineProps([ 'items' ])
const emits = defineEmits([ 'updateItems' ])

async function handleDrop(e) {
	const attemptedId = e.dataTransfer.getData('text')
	const { active_type, domain } = await Agent.metadata(attemptedId)
	if (!EMBED_DOMAINS.includes(domain) && !sequenceImportableTypes.includes(active_type)) {
		await unsupportedTypeSwal(t, attemptedId, active_type)
	} else {
		const itemsCopy = JSON.parse(JSON.stringify(props.items))
		emits('updateItems', [ ...itemsCopy, { id: attemptedId } ])
	}
}
async function removeItem(i) {
	const { isConfirmed } = await areYouSureSwal(t)
	if (!isConfirmed) return

	const itemsCopy = JSON.parse(JSON.stringify(props.items))
	itemsCopy.splice(i,1)
	emits('updateItems', itemsCopy)
}
function moveItemUp(i) {
	if (i === 0) return
	const itemsCopy = JSON.parse(JSON.stringify(props.items))
	const item=itemsCopy[i]
	itemsCopy.splice(i,1)
	itemsCopy.splice(i-1,0,item)
	emits('updateItems', itemsCopy)

}
function moveItemDown(i) {
	const itemsCopy = JSON.parse(JSON.stringify(props.items))
	if (i >= itemsCopy.length - 1) return
	const item=itemsCopy[i]
	itemsCopy.splice(i,1)
	itemsCopy.splice(i+1,0,item) // same index bc next el shifted
	emits('updateItems', itemsCopy)

}
async function alertText(text) {
	await alertTextSwal(text)
}

</script>

<style scoped>

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
.item-row {
	display: flex;
    width: 100%;
    align-items: center;
}
</style>