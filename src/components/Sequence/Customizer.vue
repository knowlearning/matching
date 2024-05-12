<template>
	<div class="sequence-customizer">
		<AbsolutePreviewAndItemId :id="props.id" />

		<NameAndInstructions
			:content="data.content"
			hideInstructions
			style="width: 420px;"
		/>

		<div
			class="item-list-wrapper"
			@dragover.prevent
			@drag.prevent
			@drop.prevent="handleDrop"
			@click.shift="handleHideShowImageArea"
		>
			<h4>{{ t('drag-on-items-to-add') }}</h4>
			<div
				v-for="({ id:item }, i) in data.content.items"
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
					:language="store.getters.language()"
					@click.shift="alertText(item)"
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
		<div class="preview-image-section" v-if="showImageArea">
			<SelectImage
				:active="data.content.image"
				@select="data.content.image = $event"
			/>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'

import { sequenceImportableTypes } from '../../helpers/questionTypes.js'
import {
	unsupportedTypeSwal,
	areYouSureSwal,
	alertTextSwal
} from '../../helpers/swallows.js'
import ItemName from '../ItemName.vue'
import SelectImage from './SelectImage.vue'
import KlImage from '../kl-image.vue'
import PickFileButton from '../PickFileButton.vue'

import { useStore } from 'vuex'

const EMBED_DOMAINS = [
	'localhost:5113',
	'embed.knowlearning.systems'
]

const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps(['id'])

const state = await Agent.state(props.id)

let showImageArea = ref(false)

const data = reactive({
	content: state
})

async function handleDrop(e) {
	const attemptedId = e.dataTransfer.getData('text')
	const { active_type, domain } = await Agent.metadata(attemptedId)
	if (!EMBED_DOMAINS.includes(domain) && !sequenceImportableTypes.includes(active_type)) {
		await unsupportedTypeSwal(t, attemptedId, active_type)
	} else {
		data.content.items.push({ id: attemptedId })		
	}
}
async function removeItem(i) {
	const { isConfirmed } = await areYouSureSwal(t)
	if (!isConfirmed) return

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
function handleHideShowImageArea({ offsetX, offsetY }) {
	if (offsetX < 20 && offsetY < 20) {
		showImageArea.value = !showImageArea.value	
	}
}
async function alertText(text) {
	await alertTextSwal(text)
}

</script>

<style scoped>
.sequence-customizer {
	display: flex;
	position: relative;
	height: 100%;
	flex-direction: column;
	align-items: center;
	padding-top: 56px;
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
.item-row {
	display: flex;
    width: 100%;
    align-items: center;
}
.preview-image-section
{
	min-width: 40px;
	min-height: 40px;
	background: antiquewhite;
	border-radius: 12px;
	margin: 16px;
	text-align: center;
}
</style>