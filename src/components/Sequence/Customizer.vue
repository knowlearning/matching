<template>
	<div class="sequence-customizer">
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
import { reactive } from 'vue'

const props = defineProps(['id'])

const data = reactive({
  content: null
})

const state = await Agent.state(props.id)
data.content = state

</script>

<style scoped>
.sequence-customizer {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>