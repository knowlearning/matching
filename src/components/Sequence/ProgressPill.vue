<template>
  <div class="progress-pill" :style="{ width: width + 'px', height: height + 'px' }">
    <div class="text">{{ text }}</div>
    <div class="shaded-area" :style="{ width: percentage + '%' }"></div>
    <div class="remaining-area"></div>
  </div>
</template>

<script>
function o(n) {
  return n<10 ? '0'+n : ''+n
}

export default {
  name: 'progress-pill',
  props: {
    width: {
      type: Number,
      required: false,
      default: 200
    },
    height: {
      type: Number,
      required: false,
      default: 30
    },
    textPrefix: {
      type: String,
      required: false,
      default: 'Attempted: '
    },
    numItems: {
      type: Number,
      required: true
    },
    numAttempted: {
      type: Number,
      required: true
    }
  },
  computed: {
    percentage() {
      return (this.numAttempted / this.numItems)*100
    },
    text() {
      return `${this.textPrefix}${o(this.numAttempted)} / ${o(this.numItems)}`
    }
  }
}
</script>

<style scoped>
.progress-pill {
  border-radius: 15px;
  overflow: hidden;
  display: flex;
}

.shaded-area {
  flex-grow: 0;
  flex-shrink: 0;
  background-color: #ccc;
}

.remaining-area {
  flex: 1;
  background-color: #fff;
}
.text {
  position: absolute;
  display: flex;
  top: 50%;
  margin-left: 12px;
  transform: translateY(-50%);
  z-index: 1;
  font-style: italic;
  color: #555;
  font-size: 0.95rem;
}
</style>