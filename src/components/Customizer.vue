<script setup>
import { defineProps, reactive } from 'vue';
const props = defineProps(['id']);

const data = reactive({ content: null })

Agent
  .state(props.id)
  .then(state => data.content = state)

</script>

<template>
  <div class="customizer">
    <div v-if="data.content">
      <h1>Instructions</h1>
      <textarea v-model="data.content.instructions" placeholder="Enter matching instructions"></textarea>
    </div>
  </div>
</template>

<style scoped>
.customizer {
  
}
</style>