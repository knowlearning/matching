<template>
  <span>
    <span v-if="fallback"> {{ fallback }}</span>
    <vueScopeComponent
      v-else
      :id="props.id"
      :path="['name']"
    />
  </span>
</template>

<script setup>
  import { vueScopeComponent } from '@knowlearning/agents/vue.js'
  const props = defineProps(['id'])

  const fallback = await translationFallbackFound()

  async function translationFallbackFound() {
    const r1 = await Agent.state(props.id)
    if (!r1 || !r1.name) return false
    const { source_string } = await Agent.state(r1.name)
    return source_string || false
  }

</script>