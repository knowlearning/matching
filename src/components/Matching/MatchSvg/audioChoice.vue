<template>
    <audio class="audio-choice" :src="url" controls></audio>
  </template>
  
<script>
  import { ref, onMounted } from 'vue'
  
  export default {
    name: 'audio-choice',
    props: {
      fileId: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const url = ref(null)
      onMounted(async () => {
        const { url: audioUrl } = await Agent.get(props.fileId)
        url.value = audioUrl
      })
      return { url }
    }
    }
</script>