<script setup>
import { reactive } from 'vue'
const props = defineProps(['id', 'mode'])

const data = reactive({
  content: null
})

const state = await Agent.state(props.id)
data.content = state

</script>

<template>
  <div class="text-entry-customizer">
    <div>Item Scope Id :: {{ id }} </div>
    <h3>Text Entry Item Customizer</h3>
    <label for="item-name">Item Name:</label>
    <textarea
      id="item-name"
      v-model="data.content.name"
    />
    <label for="question">Question:</label>
    <textarea
      id="question"
      v-model="data.content.question"
    />
    <label for="answer">Answer:</label>
    <textarea
      id="answer"
      v-model="data.content.answer"
    />
  </div>
</template>

<style scoped>
.text-entry-customizer {
  display: flex;
  flex-direction: column;
}
</style>