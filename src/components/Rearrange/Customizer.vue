<template>
	<div class="rearrange-customizer">
    <h3>Rearrange Column Customizer</h3>
		<h4>Item Scope Id :: {{ id }} </h4>
    <label for="item-name">Item Name:</label>
    <textarea
      id="item-name"
      v-model="data.content.name"
    />
		<div
			v-for="(id,i) in data.content.items"
			:key="id"
			class="image-and-buttons"
		>

			<ImgById :id="id" class="choice" />
			<div class="buttons-wrapper">
				<button
					:disabled="i === 0"
					@click="moveArrayItem(data.content.items,i,-1)"
				>
					Up
				</button>
				<button
					:disabled="i === data.content.items.length - 1"
					@click="moveArrayItem(data.content.items, i,1)"
				>
					Down
				</button>
			</div>
		</div>
	</div>
</template>


<script setup>
import { reactive } from 'vue'
import ImgById from './ImgById.vue'

const props = defineProps(['id'])

const data = reactive({
  content: null
})

const state = await Agent.state(props.id)
data.content = state

function moveArrayItem(arr, i, delta) {
    let nIndex = i + delta
    
    if (nIndex < 0) nIndex = 0
    else if (nIndex >= arr.length) nIndex = arr.length - 1
        
    const item = arr.splice(i, 1)[0]
    arr.splice(nIndex, 0, item)
}

</script>

<style scoped>
.rearrange-customizer {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.image-and-buttons {
	background: antiquewhite;
	margin: 10px;
	padding: 10px;
	border-radius: 8px;

	display: flex;
	flex-direction: row;
}
.image-and-buttons .buttons-wrapper {
	display: flex;
	flex-direction: column;
	align-items: right;
	justify-content: center;
	margin-left: 30px;
}
img.choice {
	width: 200px;
}
</style>