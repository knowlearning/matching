<template>
	<div class="tag-interface">
		<h2>Tags for {{ props.id }}</h2>
		<div v-if="loading">Loading</div>
		<div v-else>
			<ToggleItemTag
				v-for="tag in tagsToTagItemsWith"
				:key="`toggle-tag-${tag}-on-item-${props.id}`"
				:item="props.id"
				:tag="tag"
				:partition="PILA_PARTITION"
				:domain="TAGS_DOMAIN"
				@addTagging="addTagging(tag, $event)"
			/>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import ToggleItemTag from './ToggleItemTag.vue'
const TAGS_DOMAIN = 'tags.knowlearning.systems'
const TAGS_TO_TAG_ITEMS_WITH = "c025ade0-0cc9-11f0-973f-1565207095e0"
const PILA_PARTITION = 'PILA'

const props = defineProps([ 'id' ])
let loading = ref(false)

// populates the LIST of tags that items could possibly be tagged with
// no need for reactivity
const tagsToTagItemsWith = ( await Agent.query(
    'taggings-for-tag',
    [ PILA_PARTITION, TAGS_TO_TAG_ITEMS_WITH ],
    TAGS_DOMAIN
  ).catch(err => {
    console.warn(err)
    return []
  })).map(obj => obj?.target)

const tags = await Agent.state('tags')

async function addTagging(tag, value) {
	loading.value = true
	if (!tags[tag]) tags[tag] = {}	
	tags[tag][props.id] = {
		value,
		partition: PILA_PARTITION
	} 
	let newVal
	while (newVal !== !!value) {
		await new Promise(r => setTimeout(r, 500))
		newVal = await fetchIsTagged({
			tag,
			partition: PILA_PARTITION,
			item: props.id,
			domain: TAGS_DOMAIN
		})
	}
	loading.value = false
}	

async function fetchIsTagged({ tag, partition, item, domain }) {
	const x = await Agent.query(
		'tagging-for-target',
		[ partition, tag, item],
		domain
	)
	return !!x.length
}

</script>