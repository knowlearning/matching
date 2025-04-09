<template>
	<v-chip
		:color="isTagged ? 'blue' : 'grey'"
		text-color="white"
		@click="emits('addTagging', isTagged ? null : true)"
		class="ma-2"
	>
		<ItemName :id="props.tag" />
	</v-chip>
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