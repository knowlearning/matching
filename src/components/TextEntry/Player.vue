<template>
  <div class="text-entry-player">
    <h3>{{ item.name }}</h3>
    <p>{{ item.question }}</p>
    <input
      @keyup.enter="handleSubmit"
      v-model="data.userInput"
    >
    <button class="submit" @click="handleSubmit"> Submit </button>
  </div>
</template>

<script setup>
  import { reactive } from 'vue'
  import translateScopeId from '../../helpers/translateScopeId.js'

  const props = defineProps(['id'])

  const language = store.getters.language()
  const item = await translateScopeId(props.id, language)
  
  const runstate = reactive(await Agent.state(`runstate-${props.id}`))
  if (!runstate.userInput) runstate.userInput = ''

  setTimeout(() => {
      runstate.xapi = {
          actor: props.id,
          verb: 'initialized',
          object: props.id,
          extensions: { language }
      }
  })

  function handleSubmit() {
    window.alert( isCorrect() ? 'woo' : 'boo' )
    if (isCorrect() && Agent.embedded) Agent.close({ success: true })

  }

  function isCorrect() {
    return item.answer.trim().toLowerCase() === data.userInput.trim().toLowerCase()
  }
</script>


<style scoped>
.text-entry-player {
  display: flex;
  flex-direction: column;
}
input {
  margin-bottom: 24px;
}
button.submit {
  color: white;
  background: green;
  opacity: 0.7;
}
button.submit:hover {
  opacity: 1;
}
</style>