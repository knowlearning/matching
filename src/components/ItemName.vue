<template>
    <span>{{ displayString }}</span>
</template>

<script setup>
    import { displayTranslatedContent } from '../helpers/nameAndTranslationForContent.js'

    const props = defineProps({
        id: {
            required: true,
            type: String
        },
        language: {
            required: false,
            type: String,
            default: 'en'
        }
    })

    const displayString = await displayTranslatedContent(props.id, props.language)
</script>