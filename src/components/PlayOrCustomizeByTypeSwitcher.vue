<template>
  <component v-if="questionTypes[active_type]"
    :is="questionTypes[active_type].components[props.mode]"
    :id="props.id"
    @close="emits('close')"
  />
  <vueEmbedComponent
    v-else :id="props.id"
    allow="camera;microphone;fullscreen"
  />
</template>

<script setup>
import { vueEmbedComponent } from '@knowlearning/agents/vue.js'
import questionTypes from '../helpers/questionTypes.js'

const emits = defineEmits(['close'])

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  mode : {
    type: String,
    required: true,
    validator: val => ['customizer', 'player'].includes(val)
  }
})
const { active_type } = await Agent.metadata(props.id)

</script>
