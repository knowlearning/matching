<template>
	<div class="customizer">
		<AbsolutePreviewAndItemId :id="props.id" />
		<NameAndInstructions
			:content="data.content"
			style="width: 420px; margin-top: 50px;"
		/>
		<div>{{ data.content }}</div>
	</div>
</template>

<script setup>
import { reactive } from 'vue'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'

import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'

const props = defineProps(['id'])
const data = reactive({
  content: null,
})

const state = await Agent.state(props.id)
data.content = state


</script>

<style scoped>
.customizer {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	height: 100%;
}
</style>