<script setup>
import { reactive } from 'vue'
import componentsForTypes from '../helpers/componentsForTypes.js'

const props = defineProps(['id', 'mode'])

const { active_type } = await Agent.metadata(props.id)
const item = await Agent.state(props.id)

</script>

<template>
  <Suspense>
    <component
      :is="componentsForTypes[active_type][props.mode]"
      :id="props.id"
    />
  </Suspense>
</template>