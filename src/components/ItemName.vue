<template>
  <span>
    <vueScopeComponent
      :id="props.id"
      :path="['name']"
    />
  </span>
</template>

<script setup>
  import { vueScopeComponent } from '@knowlearning/agents/vue.js'

  const props = defineProps(['id'])
</script>