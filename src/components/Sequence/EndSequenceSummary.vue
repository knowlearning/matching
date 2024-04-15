<template>
	<div class="end-sequence-summary">
		<h3>{{ t('finished') }}</h3>
		<button class="submit" @click="handleSubmit">{{ t('submit') }}</button>
	</div>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }
</script>