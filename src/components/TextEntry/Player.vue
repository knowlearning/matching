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

  const props = defineProps(['id'])
  const item = await Agent.state(props.id)  


  let userRunState
  if (Agent.embedded) {
    userRunState = await Agent.state(`play-${props.id}`)
    if (!userRunState.userInput) userRunState.userInput = ''
  } else {
    userRunState = { userInput: '' }
  }

  const data = reactive(userRunState)

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