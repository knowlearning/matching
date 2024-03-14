<template>
  <image
    :href="imageUrl"
    @click="playAudio"
  />
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  const props = defineProps({
    imageId: {
      type: String,
      required: true
    },
    audioId: {
      type: String,
      required: true
    }
  })

  const audioUrl = ref(null)
  const imageUrl = ref(null)

  Agent.download(props.imageId).url().then(url => imageUrl.value = url)
  Agent.download(props.audioId).url().then(url => audioUrl.value = url)

  function playAudio() {
    var audio = new Audio(audioUrl.value)
    audio.play()
  }
</script>