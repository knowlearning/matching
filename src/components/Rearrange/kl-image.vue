<template>
    <img :src="imageUrl" style="width: 200px; height: 200px;"/>
</template>

<script setup>
    import { ref, watch } from 'vue'

    const props = defineProps({ id: String })
    const imageUrl = ref(null)

    watch(() => props.id, getURL)

    getURL()

    async function getURL() {
        console.log('FIRING!', props)
        const url = await Agent.download(props.id).url()
        imageUrl.value = url
    }
</script>