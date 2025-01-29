<template>
	<v-container class="customize-feedback-wrapper">
		<h3>{{ t('feedback') }}:</h3>
		<v-textarea
			v-model="props.feedback.correct"
			:label="t('feedback-if-correct')"
			rows="2"
			class="vuetify-text-input"
		/>
		<v-textarea
			v-model="props.feedback.incorrect"
			:label="t('feedback-if-incorrect')"
			rows="2"
			class="vuetify-text-input"
		/>
	</v-container>
</template>

<script setup>
	import { useStore } from 'vuex'
	const store = useStore()
	function t(slug) { return store.getters.t(slug) }

	const props = defineProps({
		feedback: {
			type: Object,
			required: true
		},
	})

</script>

