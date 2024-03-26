<template>
	<div class="customizer">
    <div>Item Scope Id :: {{ id }} </div>
    <label for="item-name">Item Name:</label>
    <textarea
      id="item-name"
      v-model="data.content.name"
    />
    <label for="instruction">Instructions:</label>
    <textarea
      id="instructions"
      v-model="data.content.instructions"
      placeholder="Enter instructions"
    />
    <div class="add-buttons-wrapper">
        <button>Add Image</button>
        <button>Add Audio</button>
    </div>
</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { v4 as uuid } from 'uuid'

const props = defineProps(['id'])
const data = reactive({
  content: null,
})
const state = await Agent.state(props.id)

</script>

<style scoped>
.customizer {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
}
label {
  font-weight: bolder;
}
textarea {
  width: 300px;
  margin-bottom: 12px;
}
textarea#item-name {
  text-align: center;
  height: 16px;
}
textarea#instructions {
  height: 150px;
}
</style>