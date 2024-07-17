<template>
    <v-textarea
        @drop="handleAttemptedDrop"
        label="Markdown"
        rows="22"
    />
</template>

<script setup>
import { validate as isUUID } from 'uuid'
import { sequenceImportableTypes } from '../../../helpers/questionTypes.js'

const emit = defineEmits([ 'input' ])

async function handleAttemptedDrop(e) {
    const droppedText = e.dataTransfer.getData('text/plain').trim()
    if (isUUID(droppedText)) {
        try {
            const { active_type } = await Agent.metadata(droppedText)
            let supportedType = false
            const supportedTypePrefixes = [ 'audio', 'image', 'video' ]
            supportedTypePrefixes.forEach(type => {
                if (active_type.startsWith(type)) supportedType = true  
            })
            if (sequenceImportableTypes.includes(active_type)) {
                supportedType = true
            }
            if (!supportedType) { // if none set above
                alert('uuid not found or not supported type')
                return
            }
        } catch {
            console.warn('catching!!')
        }
  }
}

</script>