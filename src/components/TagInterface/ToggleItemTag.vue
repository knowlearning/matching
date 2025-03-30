<template>
	<div>
		<ItemName :id="props.tag" />
		Is Tagged :: {{ isTagged === undefined ? 'waiting' : isTagged }}
		<v-btn @click="emits('addTagging', true)"> Tag</v-btn>
		<v-btn @click="emits('addTagging', null)"> Untag </v-btn>
	</div>
</template>


<script setup>
import { ref } from 'vue'
import ItemName from '../ItemName.vue'

const emits = defineEmits([ 'addTagging' ])
const props = defineProps({
	item: {
		required: true,
		type: String
	},
	tag: {
		required: true,
		type: String
	},
	partition: {
		type: String,
		required: true
	},
	domain: {
		type: String,
		required: true
	}
})

const isTagged = ref(await fetchIsTagged(props))

async function fetchIsTagged({ tag, partition, item, domain }) {
	const x = await Agent.query(
		'tagging-for-target',
		[ partition, tag, item],
		domain
	)
	return !!x.length
}

</script>

<style scoped>
</style>