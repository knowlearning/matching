<template>
  <component v-if="questionTypes[active_type]"
    :is="questionTypes[active_type].components[props.mode]"
    :id="props.id"
    @close="emits('close')"
  />
  <vueEmbedComponent v-else :id="props.id" />
</template>

<script setup>
import { vueEmbedComponent } from '@knowlearning/agents/vue.js'
import questionTypes from '../helpers/questionTypes.js'

const emits = defineEmits(['close'])

const props = defineProps(['id', 'mode'])
const { active_type } = await Agent.metadata(props.id)

</script>
