<template>
  <foreignObject class="text-choice">
    <div>
      {{ textContent }}
    </div>
  </foreignObject>
</template>

<script>
export default {
  name: 'text-choice',
  props: {
    textContent: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return {

    }
  }
}
</script>

<style scoped>
.text-choice {
  pointer-events: none;
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
</style>