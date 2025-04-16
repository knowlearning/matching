<template>
	<span>{{ name }}</span>
</template>

<script setup>
const props = defineProps([ 'id' ])
const ref = await Agent.state(props.id)
const name = ref.name
</script>