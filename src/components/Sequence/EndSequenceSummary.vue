<template>
	<div class="end-sequence-summary">
		{{ props.sequenceDef }}
		<h3>{{ t('finished') }}</h3>
		<button
			class="submit"
			@click="$emit('close')"
		>
			{{ t('close') }}
		</button>
	</div>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps({
	sequenceDef: {
		type: Object,
		required: true
	},
	isCorrectArray: {
		type: Array,
		required: true
	},
	timeOnTasks: {
		type: Array,
		required: true
	}
})

</script>