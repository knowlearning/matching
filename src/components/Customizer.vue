<template>
  <div class="customizer">
    <label for="item-name">Item Name:</label>
    <textarea
      id="item-name"
      v-model="data.content.name"
    />
    <label for="instruction">Instructions:</label>
    <textarea
      id="instructions"
      v-model="data.content.instructions"
      placeholder="Enter matching instructions"
    />
    <div class="add-buttons-wrapper">
      <button @click="attemptAddChoice('left')">Add Choice to Left</button>
      <button @click="attemptAddChoice('right')">Add Choice to Right</button>
    </div>
    <MatchSvg
      :toChoices="data.content.toChoices"
      :fromChoices="data.content.fromChoices"
      :connections="data.content.answerConnections"
      :editMode="data.editChoices"
      @updateConnections="data.content.answerConnections = copy($event)"
      @removeChoice="handleRemoveChoice"
      @editChoice="handleEditChoice"
    />
    <button @click="data.editChoices = !data.editChoices">
      {{ data.editChoices ? 'Hide' : 'Show'}} Edit Choices
    </button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { v4 as uuid, validate as isUUID } from 'uuid'
import MatchSvg from './MatchSvg.vue'
const copy = x => JSON.parse(JSON.stringify(x))

const props = defineProps(['id'])

const data = reactive({
  content: null,
  editChoices: false
})
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
function handleEditChoice(nodeId) {
  const res = window.prompt('updating choice.  enter text or uuid of image')
  if (!res) return
  const newChoice = isUUID(res)
    ? { type: 'image', imageId: res, nodeId } 
    : { type: 'text', textContent: res, nodeId }

  data.content.fromChoices = copy(data.content.fromChoices)
    .map(c => c.nodeId === nodeId ? newChoice : c)
  data.content.toChoices = copy(data.content.toChoices)
    .map(c => c.nodeId === nodeId ? newChoice : c)
  data.editChoices = false
}
function handleRemoveChoice(nodeId) {
  if (!confirm('are you sure you want to delete this choice?')) return

  data.content.fromChoices = copy(data.content.fromChoices)
    .filter(c => c.nodeId !== nodeId)
  data.content.toChoices = copy(data.content.toChoices)
    .filter(c => c.nodeId !== nodeId)
  data.content.answerConnections = copy(data.content.answerConnections)
    .filter(([to,from]) => to !== nodeId && from !== nodeId)
  data.editChoices = false
}
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
.add-buttons-wrapper {

}
</style>