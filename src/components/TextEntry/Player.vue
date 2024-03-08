<template>
  <div class="text-entry-player">
    <h3>{{ item.name }}</h3>
    <p>{{ item.question }}</p>
    <input v-model="data.userInput">
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
  }

  function isCorrect() {
    return item.answer === data.userInput
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