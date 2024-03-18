<template>
	<div class="rearrange-customizer">
		Rearrange
		<div
			v-for="id in data.content.items"
			:key="id"
		>
			<div>{{ id }}</div>
			<button @click="rearrange(id,1)">Up</button>
			<button @click="rearrange(id,-1)">Down</button>
		</div>
	</div>
</template>


<script setup>
import { reactive } from 'vue'
const props = defineProps(['id'])

const data = reactive({
  content: null
})

const state = await Agent.state(props.id)
data.content = state

function rearrange(id, n) {
	const firstEl = data.content.items[0]
	data.content.items.push(firstEl)

}

</script>