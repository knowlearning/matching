<script setup>
import { defineProps } from 'vue';
const props = defineProps(['id']);

</script>

<template>
  <div class="customizer">
    {{ id }}
  </div>
</template>

<style scoped>
.customizer {
  
}
</style>