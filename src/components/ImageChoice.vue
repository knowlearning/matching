<template>
  <image class="image-choice" :href="url" />
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
      url.value = await Agent.download(props.id).url();
    })

    return {
      url
    }
  }
}
</script>