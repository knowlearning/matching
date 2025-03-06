<template>
    <span>{{ displayString }}</span>
</template>

<script setup>
    import displayTranslatedContent from '../helpers/nameAndTranslationForContent.js'
    import { watch, ref, onBeforeUnmount } from 'vue'
    import { useStore } from 'vuex'

    const store = useStore()
    const lang = store.getters.language()

    const props = defineProps({
        id: {
            required: true,
            type: String
        },
        language: {
            required: false,
            type: String,
        }
    })

    const displayString = ref(await displayTranslatedContent(props.id, props.language || lang))

    const unwatch = Agent.watch(
        [props.id, 'name'],
        async (res) => {
            displayString.value = await displayTranslatedContent(props.id, props.language || lang)
        }
    )

    onBeforeUnmount(() => {
        if (unwatch) unwatch()
    })

</script>