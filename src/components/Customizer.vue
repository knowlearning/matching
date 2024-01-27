<script setup>
import { reactive } from 'vue'
import { v4 as uuid, validate as isUUID } from 'uuid'
import MatchSvg from './MatchSvg.vue'
const copy = x => JSON.parse(JSON.stringify(x))

const props = defineProps(['id'])

const data = reactive({ content: null })
const state = await Agent.state(props.id)
data.content = state

function attemptAddChoice(side) {
  let ref
  if (side === 'left') ref = data.content.fromChoices
  else ref = data.content.toChoices

  const res = window.prompt('enter text or uuid of image')
  if (isUUID(res)) {
    ref.push({
      type: 'image',
      imageId: res,
      nodeId: uuid()
    })
  } else {
    ref.push({
      type: 'text',
      textContent: res,
      nodeId: uuid()
    })
  }
}
function removeChoice({ nodeId }) {
  data.content.fromChoices = copy(data.content.fromChoices)
    .filter(c => c.nodeId !== nodeId)
  data.content.toChoices = copy(data.content.toChoices)
    .filter(c => c.nodeId !== nodeId)
  data.content.answerConnections = copy(data.content.answerConnections)
    .filter(([to,from]) => to !== nodeId && from !== nodeId)
}

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
      editMode
      @updateConnections="data.content.answerConnections = copy($event)"
      @removeChoice="removeChoice"
    />
    <button @click="attemptAddChoice('left')">Add Left</button>
    <button @click="attemptAddChoice('right')">Add Right</button>
  </div>
</template>

<style scoped>
.customizer {
  display: flex;
  flex-direction: column;
}
</style>