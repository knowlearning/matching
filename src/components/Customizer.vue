<script setup>
import { reactive } from 'vue'
import MatchSvg from './MatchSvg.vue'
const props = defineProps(['id'])

const data = reactive({ content: null })
const state = await Agent.state(props.id)
data.content = state

</script>

<template>
  <div class="customizer">
    <label for="instruction">Instructions:</label>
    <textarea
      id="instructions"
      v-model="data.content.instructions"
      placeholder="Enter matching instructions"
    />
    <label for="item-name">Item Name:</label>
    <textarea
      id="item-name"
      v-model="data.content.name"
    />
    <MatchSvg
      :toChoices="data.content.toChoices"
      :fromChoices="data.content.fromChoices"
      :connections="data.content.answerConnections"
      @updateConnections="data.content.answerConnections = $event"
    />
  </div>
</template>

<style scoped>
.customizer {
  display: flex;
  flex-direction: column;
}
</style>