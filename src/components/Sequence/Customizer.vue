<template>
	<div class="sequence-customizer" @click.shift="handleHideShowImageArea" >
		<AbsolutePreviewAndItemId :id="props.id" />

		<NameAndInstructions
			:content="data.content"
			hideInstructions
			style="width: 420px;"
		/>

		<ItemListCustomizer
			:items="data.content.items"
			@updateItems="data.content.items = $event"
		/>
		<v-btn
			class="ma-1"
			@click="addById"
			:text="t('add-by-id')"
		/>
		<v-checkbox
			v-model="data.content.quizMode"
			:label="t('quiz-mode')"
			hide-details="auto"
		></v-checkbox>
		<v-checkbox
			v-model="data.content.forcedMotionMode"
			:label="t('forced-motion-mode')"
			hide-details="auto"
		></v-checkbox>
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
import { useStore } from 'vuex'
import { copyItemSwal } from '../../helpers/swallows.js'

import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'
import ItemListCustomizer from './ItemListCustomizer.vue'

import SelectImage from './SelectImage.vue'
import KlImage from '../kl-image.vue'
import PickFileButton from '../PickFileButton.vue'

const store = useStore()
const t = slug => store.getters.t(slug)

const EMBED_DOMAINS = [
	'localhost:5113',
	'embed.knowlearning.systems'
]

const props = defineProps(['id'])

const state = await Agent.state(props.id)


async function addById() {
	const { value: id } = await copyItemSwal(t, true) // validates id and type, 2nd param is hacky for sequence only items
	const itemsCopy = JSON.parse(JSON.stringify(data.content.items))
	if (id) data.content.items =  [ ...itemsCopy, { id } ]
}

let showImageArea = ref(false)

const data = reactive({
	content: state
})

function handleHideShowImageArea({ offsetX, offsetY }) {
	if (offsetX < 20 && offsetY < 20) {
		showImageArea.value = !showImageArea.value	
	}
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