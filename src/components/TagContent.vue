<template>
	<div class="tag-content">
		<h2>Tags for {{ props.id }}</h2>
		<p>Coming Soon</p>
	</div>
</template>

<script setup>

const props = defineProps({
	id: {
		type: String,
		required: true
	}
})
</script>