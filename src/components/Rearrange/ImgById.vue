<template>
  <img class="image-choice" :src="url" />
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'image-choice',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const url = ref(null);

    onMounted(async () => {
      const imageUrl = await Agent.download(props.id).url()
      url.value = imageUrl
    })

    return {
      url
    }
  }
}
</script>

<style scoped>
.image-choice {
  width: 200px; /* İstenilen boyut */
}

</style>
