<template>
  <div class="player">
    <h3 v-if="item?.instructions">{{ item.instructions }}</h3>
    <MatchSvg
      :toChoices="item.toChoices"
      :fromChoices="item.fromChoices"
      :connections="data.studentConnections"
      @updateConnections="data.studentConnections = $event"
    />
    <button class="submit" @click="handleSubmit"> Submit </button>
  </div>
</template>

<script setup>
  import { reactive } from 'vue'
  import MatchSvg from './MatchSvg.vue'
  import { sameConnection } from '../helpers/mathHelpers.js'

  const props = defineProps(['id'])
  let item = null
  item = await Agent.state(props.id)  

  const data = reactive({
    studentConnections: [], // each connection is [ nodeId, nodeId ]
  })

  function handleSubmit() {
    window.alert( isCorrect() ? 'woo' : 'boo' )
  }

  function isCorrect() {
    const every = data.studentConnections.every(c1 => item.answerConnections.some(c2 => sameConnection(c1, c2)))
    const only = item.answerConnections.every(c1 => data.studentConnections.some(c2 => sameConnection(c1, c2)))
    return every && only
  }
</script>


<style scoped>
svg {
  background: #eee;
  position: relative;
  border-radius: 8px;
}
svg.pointer:hover {
  cursor: pointer;
}
.from-choice, .to-choice {
  fill: transparent;
}
.button-wrapper > button {
  width: 200px;
  opacity: 0.8;
}
.button-wrapper > button:hover {
  width: 200px;
  opacity: 1;
}
button.submit {
  color: white;
  background: green;
}
</style>