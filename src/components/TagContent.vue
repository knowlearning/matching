<template>
	<div class="tag-content">
		<h2>Tags for {{ props.id }}</h2>
		<v-btn @click="tag(true)"> Tag as Thai Expert Content</v-btn>
		<v-btn @click="tag(null)"> Untag as Thai Expert Content </v-btn>

		Is Thai Expert Content :: {{ isTagged === undefined ? 'waiting' : isTagged }}

	</div>
</template>

<script setup>
import { ref } from 'vue'
const TAGS_DOMAIN = 'tags.knowlearning.systems'
const PILA_EXPERT_TAG = '1a53db50-e248-11ee-ab5f-07f4a7408770'
const partition = 'PILA Thailand'


const props = defineProps([ 'id' ])

const isTagged = ref(await fetchIsTagged())
const tags = await Agent.state('tags')

async function fetchIsTagged() {
	const x = await Agent.query(
		'tagging-for-target',
		[ partition, PILA_EXPERT_TAG, props.id],
		TAGS_DOMAIN
	)
	return !!x.length
}

async function tag(value) {
	if (!tags[PILA_EXPERT_TAG]) {
		tags[PILA_EXPERT_TAG] = {}
	}
	tags[PILA_EXPERT_TAG][props.id] = { value, partition } 

	isTagged.value = undefined

	let newVal
	console.log('before while', !!newVal, value)
	while(newVal !== !!value) {
		await new Promise(r => setTimeout(r, 500))
		newVal = await fetchIsTagged()		
	}
	isTagged.value = newVal
}	

</script>

<style scoped>
	.tag-content {
		display: flex;
		flex-direction: column;

	}
</style>
