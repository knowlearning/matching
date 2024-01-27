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
function removeChoice(nodeId, side) {
  console.log(nodeId, side)

  // WORKS, BUT NEEDS DESIGN IMPLEMENTATION
  
  // let ref
  // if (side === 'left') ref = data.content.fromChoices
  // else ref = data.content.toChoices

  // const i = ref.findIndex(choice => choice.nodeId === nodeId)
  // if (i === -1) return

  // // remove any connections to that choice
  // data.content.answerConnections = copy(data.content.answerConnections)
  //   .filter(([to,from]) => to !== nodeId && from !== nodeId)

  // const newChoices = copy(ref)
  // newChoices.splice(i,1)
  // if (side === 'left') data.content.fromChoices = newChoices
  // else data.content.toChoices = newChoices

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
      @updateConnections="data.content.answerConnections = copy($event)"
      @handleChoiceClick="removeChoice"
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