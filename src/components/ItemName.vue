<template>
    <span>{{ displayString }}</span>
</template>

<script setup>
    import displayTranslatedContent from '../helpers/nameAndTranslationForContent.js'
    import { useStore } from 'vuex'
    const store = useStore()

    const props = defineProps({
        id: {
            required: true,
            type: String
        },
        language: {
            required: false,
            type: String,
            default: store.getters.language()
        }
    })

    const displayString = await displayTranslatedContent(props.id, props.language)
</script>