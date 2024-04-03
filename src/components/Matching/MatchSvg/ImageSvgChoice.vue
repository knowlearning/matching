<template>
  <image class="image-choice" :href="url" />
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'image-choice',
  props: {
    imageId: {
      type: String,
      required: true
    },
    nodeId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const url = ref(null)
    onMounted(async () => {
      const imageUrl = await Agent.download(props.imageId).url()
      url.value = imageUrl
    })
    return { url }
  }
}
</script>