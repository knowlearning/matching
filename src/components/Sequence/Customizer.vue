<template>
	<div class="sequence-customizer">
		<SequenceHeader
			:items="correctMap"
			:activeItem="data.activeItem"
			@select="data.activeItem = $event"
		/>
	  <h3>Rearrange Column Customizer</h3>
		<h4>Item Scope Id :: {{ id }} </h4>
    	<label for="item-name">Item Name:</label>
    	<textarea
	      id="item-name"
	      v-model="data.content.name"
	    />
	    <pre>{{ data.content }}</pre>
	</div>
</template>


<script setup>
import { reactive, computed } from 'vue'
import SequenceHeader from './SequenceHeader.vue'

const props = defineProps(['id'])

const state = await Agent.state(props.id)

const data = reactive({
  content: state,
  activeItem: 'nop'
})

// for player, not customizer!
const correctMap = computed(() => {
  return data.content.items.reduce((acc, id) => {
    acc[id] = null
    return acc
  }, {})
})

</script>

<style scoped>
.sequence-customizer {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>