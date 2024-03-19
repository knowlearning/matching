<template>
  <div class="player">
    <h3 v-if="item?.instructions">{{ item.instructions }}</h3>
    <MatchSvg
      :toChoices="item.toChoices"
      :fromChoices="item.fromChoices"
      :connections="data.studentConnections"
      @updateConnections="data.studentConnections = $event"
    />
    <button class="submit" @click="handleSubmit" :disabled="!allConnectionsMade()"> Submit </button>
    <div v-if="submitted">{{ resultText() }}</div>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import { sameConnection } from '../../helpers/mathHelpers.js'
  import MatchSvg from './MatchSvg/index.vue'
  
  const props = defineProps(['id'])
  let item = null
  item = await Agent.state(props.id)  

  const submitted = ref(false)

  const data = reactive({
    studentConnections: [], // each connection is [ nodeId, nodeId ]
  })

  function handleSubmit() {
    if (allConnectionsMade()) {
      console.log('submitting', data.studentConnections);
      submitted.value = true;
    } else {
      alert('All connections are not made yet.');
    }
  }

  function allConnectionsMade() {
    const totalQuestions = item.fromChoices.length;
    return data.studentConnections.length === totalQuestions;
  }
 
  function resultText() {
    if (data.studentConnections.length === 0) return '';
  
    const totalAnswers = item.answerConnections.length;
    const correctAnswers = data.studentConnections.filter(connection => item.answerConnections.some(answer => sameConnection(connection, answer))).length;
  
    return `${correctAnswers} correct answers out of ${totalAnswers}`;
  }
</script>


<style scoped>
button.submit {
  color: white;
  background: green;
  opacity: 0.7;
}
button.submit:hover {
  opacity: 1;
}
</style>
