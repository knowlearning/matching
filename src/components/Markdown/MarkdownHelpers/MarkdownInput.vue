<template>
    <v-textarea
        @drop="handleAttemptedDrop"
        :label="props.label"
    />
</template>

<script setup>
import { validate as isUUID } from 'uuid'

const props = defineProps(['label'])
const emit = defineEmits([ 'input' ])

async function handleAttemptedDrop(e) {
    const droppedText = e.dataTransfer.getData('text/plain').trim()
    if (isUUID(droppedText)) {
        try {
            const { active_type } = await Agent.metadata(droppedText)
            let typeName = null
            const supportedTypePrefixes = [ 'audio', 'image', 'video' ]
            supportedTypePrefixes.forEach(type => {
                if (active_type.startsWith(type)) typeName = type
            })
            if (!typeName) { // if none set above
                alert('uuid not found or not supported type')
                return
            }
        } catch {
            console.warn('catching!!')
        }
  }
}

</script>