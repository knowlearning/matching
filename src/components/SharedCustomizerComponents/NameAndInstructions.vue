<template>
	<div class="name-and-instructions-wrapper">
		<v-text-field
			v-model="props.content.name"
			:label="t('item-name')"
			class="vuetify-text-input"
		/>
		<v-textarea v-if="!props.hideInstructions"
			v-model="props.content.instructions"
			:label="t('instructions-optional')"
			rows="3"
			class="vuetify-text-input"
		/>
	</div>
</template>

<script setup>
	import { useStore } from 'vuex'
	const store = useStore()
	function t(slug) { return store.getters.t(slug) }

	const props = defineProps({
		content: {
			type: Object,
			required: true
		},
		hideInstructions: {
			type: Boolean,
			required: false,
			default: false
		}
	})

</script>

<style scoped>
.vuetify-text-input {
  margin: 8px auto;
}
</style>