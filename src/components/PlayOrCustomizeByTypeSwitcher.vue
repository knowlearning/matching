<script setup>
import { reactive } from 'vue'
import questionTypes from '../helpers/questionTypes.js'

const props = defineProps(['id', 'mode'])

const { active_type } = await Agent.metadata(props.id)

</script>

<template>
  <component
    :is="questionTypes[active_type].components[props.mode]"
    :id="props.id"
  />
</template>