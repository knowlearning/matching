<template>
  <div class="text-entry-player">
    <h3>{{ item.name }}</h3>
    <p>{{ item.question }}</p>
    <input
      @keypress.enter="submit"
      v-model="data.userInput"
    >
    <button class="submit" @click="handleSubmit"> Submit </button>
  </div>
</template>

<script setup>
  import { reactive } from 'vue'

  const props = defineProps(['id'])
  const item = await Agent.state(props.id)  

  const data = reactive({
    userInput: ''
  })

  function handleSubmit() {
    window.alert( isCorrect() ? 'woo' : 'boo' )
    if (isCorrect()) Agent.close({ success: true })
    // TODO ... how to message up if incorrect? data watch?
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