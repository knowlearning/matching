<template>
	<div class="tag-interface">
		<h2>
			Tags for
			<ItemName :id="props.id" />
		</h2>
		<TagFilters
			v-model="selectedTags"
			:partition="PILA_PARTITION"
			:roots="[TAGS_TO_TAG_ITEMS_WITH]"
			select-leaves-only
			:LabelComponent="TagTranslation"
		/>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ItemName from '../ItemName.vue'
import { Filters as TagFilters } from '@knowlearning/tags'

const TAGS_DOMAIN = 'tags.knowlearning.systems'
const TAGS_TO_TAG_ITEMS_WITH = "c025ade0-0cc9-11f0-973f-1565207095e0"
const PILA_PARTITION = 'PILA'
const PUBLIC_TAGS_PARTITION = 'Public Tags'

const props = defineProps([ 'id' ])

const tags = await Agent.state('tags')

const tagsForId = ref(
	await Agent.query(
		'taggings-for-target',
		[ PUBLIC_TAGS_PARTITION, props.id],
		TAGS_DOMAIN
	)
	.then(taggings => taggings.map(({ tag }) => tag))
	.catch(error => {
		console.log('error getting tags for target', error)
		return []
	})
)

const selectedTags = computed({
	get() {
		return tagsForId.value
	},
	set(selectedTags) {
		const { added, removed } = diffIds(tagsForId.value, selectedTags)

		tagsForId.value.splice(0,tagsForId.value.length)
		selectedTags.forEach(id => tagsForId.value.push(id))

		added.forEach(id => addTagging(id, true))
		removed.forEach(id => addTagging(id, null))
	}
})

function diffIds(oldIds, newIds) {
  const oldSet = new Set(oldIds)
  const newSet = new Set(newIds)
  return {
    added: newIds.filter(id => !oldSet.has(id)),
    removed: oldIds.filter(id => !newSet.has(id))
  }
}

async function addTagging(tag, value) {
	if (!tags[tag]) tags[tag] = {}

	tags[tag][props.id] = {
		value,
		partition: PUBLIC_TAGS_PARTITION
	}
}

</script>