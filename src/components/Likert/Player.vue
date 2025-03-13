<template>
	<div class="player">
		Likert Player - {{ props. id }}
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