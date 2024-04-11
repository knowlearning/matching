<template>
    <img
        :src="imageUrl"
        :style="{
            width: props.size.width,
            height: props.size.height
        }"
    />
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    size: {
        type: Object,
        required: false,
        default: () => ({ width: '110px', height: '110px' })
    }
})
const imageUrl = ref(null)

watch(() => props.id, getURL)

getURL()

async function getURL() {
    try {
        const url = await Agent.download(props.id).url()
        imageUrl.value = url
    } catch (error) {
        console.error('Error getting image URL:', error)
    }
}
</script>
