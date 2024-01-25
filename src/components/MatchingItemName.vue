<template>
  <span class="matching-item-name">
    {{ displayName }}
  </span>
</template>

<script setup>
  import { ref } from 'vue'
  const props = defineProps(['id'])
  const content = ref(null)

  const res = await Agent.state(props.id)
  const displayName = res.name

</script>