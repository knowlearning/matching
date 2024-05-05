<template>
  <svg
    :class="{ playable }"
    @click="playable && playText()"
    style="width: 100%; height: 100%;"
  >
    <rect
      width="100%"
      height="100%"
      fill="transparent"
    />
    <foreignObject
      width="100%"
      height="100%"
      class="text-choice"
      pointer-events="none"
    >
      <div style="position: fixed;">
          <span>{{ content }}</span>
          <i
            v-if="playable"
            class="fas fa-volume-up"
            style="position: absolute; bottom: 5%; right: 5%;"
          />
      </div>
    </foreignObject>
  </svg>
</template>

<script>
function hasThaiCharacters(text) {
    // Thai characters Unicode range: 0E00–0E7F
    const thaiRegex = /[\u0E00-\u0E7F]/;
    return thaiRegex.test(text);
}

export default {
  name: 'text-choice',
  mounted() {
    window.speechSynthesis.getVoices() // annoying, but otherwise doesn't work on first play below
  },
  props: {
    content: { // text string
      type: String,
      required: true
    },
    playable: { // Boolean to determine if text is clickable / playable
      type: Boolean,
      default: true
    }
  },
  methods: {
    playText() {
      const utterance = new SpeechSynthesisUtterance(this.content)

      utterance.rate = 0.9

      if (hasThaiCharacters(this.content)) {
        utterance.lang = "th-TH"
      }  else {
        const voices = window.speechSynthesis.getVoices()
        const newVoice = voices.find(v => v.name === 'Arthur')
        if (newVoice) utterance.voice = newVoice
      }

      window.speechSynthesis.speak(utterance);
    }
  }
}
</script>

<style scoped>
.text-choice {
  user-select: none;
}
.text-choice div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: lightgrey;
  border-radius: 6px;
}
.playable {
  cursor: pointer;
}
.playable:hover {
  filter: invert(0.2);
}
</style>