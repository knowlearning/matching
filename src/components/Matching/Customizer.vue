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
      placeholder="Enter matching instructions"
    />
    <div class="add-buttons-wrapper">
      <button @click="openFilePicker('left','image')">Add Image</button>
      <button @click="openFilePicker('right','audio')">Add Audio</button>
    </div>

    <MatchSvg
      :toChoices="data.content.toChoices"
      :fromChoices="data.content.fromChoices"
      :connections="data.content.answerConnections"
      :editMode="data.editChoices"
      @updateConnections="data.content.answerConnections = copy($event)"
      @removeChoice="handleRemoveChoice"
      @editChoice="handleEditChoice"
      @move="handleMove"

    />
    <button @click="data.editChoices = !data.editChoices">
      {{ data.editChoices ? 'Hide' : 'Show'}} Edit Choices
    </button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { v4 as uuid, validate as isUUID } from 'uuid'
import MatchSvg from './MatchSvg/index.vue'
const copy = x => JSON.parse(JSON.stringify(x))


const props = defineProps(['id'])

const data = reactive({
  content: null,
  editChoices: false,
})

const state = await Agent.state(props.id)
data.content = state


function addChoice(side, type, content) {
  if (side === 'left') {
    data.content.fromChoices.push({
      type: type,
      content: content,
      nodeId: uuid()
    })
  } else {
    data.content.toChoices.push({
      type: type,
      content: content,
      nodeId: uuid()
    })
  }
}
function handleMove(nodeId, dir) {
  // tedious logic, made code-grosser by the reactivity situation
  // for right / left, ignore if already on that side, if not push to end of other choice array and remove from own.  
  const fromCopy = copy(data.content.fromChoices)
  const toCopy = copy(data.content.toChoices)

  const choiceCopy = copy([ ...fromCopy, ...toCopy].find(c => c.nodeId === nodeId))
  const inLeftColumn = fromCopy.some(c => c.nodeId === nodeId)
  const inRightColumn = !inLeftColumn // assume it somewhere!
  const choiceIndex = inLeftColumn ? fromCopy.findIndex(c => c.nodeId === nodeId) : toCopy.findIndex(c => c.nodeId === nodeId)

  if (inLeftColumn && dir === 'right') {
    removeConnectionsToId(nodeId)
    data.content.fromChoices = fromCopy.filter(c => c.nodeId !== nodeId)
    data.content.toChoices = [ ...toCopy, choiceCopy ]
  } else if (inRightColumn && dir === 'left') {
    removeConnectionsToId(nodeId)
    data.content.toChoices = toCopy.filter(c => c.nodeId !== nodeId)
    data.content.fromChoices = [ ...fromCopy, choiceCopy ]
  } else if (inLeftColumn && dir === 'up') {
    moveArrayElementUp(fromCopy, choiceIndex)
    data.content.fromChoices = fromCopy
  } else if (inRightColumn && dir === 'up') {
    moveArrayElementUp(toCopy, choiceIndex)
    data.content.toChoices = toCopy
  } else if (inLeftColumn && dir === 'down') {
    moveArrayElementDown(fromCopy, choiceIndex)
    data.content.fromChoices = fromCopy
  } else if (inRightColumn && dir === 'down') {
    moveArrayElementDown(toCopy, choiceIndex)
    data.content.toChoices = toCopy
  }

}
function moveArrayElementUp(arr, i) {
  if (i > 0 && i < arr.length) {
    [arr[i], arr[i-1]] = [arr[i-1], arr[i]]
  }
}
function moveArrayElementDown(arr, i) {
  if (i >= 0 && i < arr.length - 1) {
    [arr[i], arr[i+1]] = [arr[i+1], arr[i]]
  }
}

function handleEditChoice(nodeId) {
  const res = window.prompt('updating choice.  enter text or uuid of image')
  if (!res) return
  const newChoice = isUUID(res)
    ? { type: 'image', imageId: res, nodeId } 
    : { type: 'audio', audioId: res, nodeId}

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
  removeConnectionsToId(nodeId)
  data.editChoices = false
}
function removeConnectionsToId(nodeId) {
  data.content.answerConnections = copy(data.content.answerConnections)
    .filter(([to,from]) => to !== nodeId && from !== nodeId)
}

async function openFilePicker(side, fileType) {
  const id = uuid()
  await Agent.upload({ id, browser: true, accept : fileType === 'audio' ? 'audio/*' : 'image/*'})
  if (fileType === 'audio') {
    data.content.toChoices.push({
      type: 'audio',
      audioId: id,
      imageId: '60e5b5d1-5c48-43bd-b739-a47c58bc890a',
      nodeId: uuid()
    })
  } else {
    data.content.fromChoices.push({
      type: 'image',
      imageId: id,
      nodeId: uuid()
    })
  }
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
.audio-button {
  background: green;
  color: orange;
  opacity: 0.7;
}

</style>
