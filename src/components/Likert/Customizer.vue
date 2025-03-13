<template>
	<div class="customizer">
		<AbsolutePreviewAndItemId :id="props.id" />
		<NameAndInstructions
			:content="content"
			class="name-instructions"
		/>
		<v-select
			v-model="content.category"
        	style="width: 560px; flex-grow: 0;"
			:label="t('select-likert-category')"
			:items="Object.keys(likertCategories).map(el => ({
				title: t(el),
				value: el
			}))"

		/>
		<span> {{ displayPreview }}</span>
	</div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'
import likertCategories from './likertCategories.js'
import { useStore } from 'vuex'

function t(slug) { return useStore().getters.t(slug) }

const props = defineProps({
	id: {
		type: String,
		required: true
	}
})

const content = reactive(await Agent.state(props.id))

const displayPreview = computed(() => {
	const userChoicesArray = likertCategories[content.category]
	return userChoicesArray.map(t).join('  --  ')
})


</script>

<style scoped>
.customizer {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	height: 100%;
}

.name-instructions {
    width: 560px;
    margin-top: 50px;
}
</style>