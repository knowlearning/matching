<template>
  <image class="image-choice" :href="url" />
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'image-choice',
  props: {
    content: { // uuid for image
      type: String,
      required: true
    }
  },
  setup(props) {
    const url = ref(null)
    onMounted(async () => {
      const imageUrl = await Agent.download(props.content).url()
      url.value = imageUrl
    })
    return { url }
  }
}
</script>