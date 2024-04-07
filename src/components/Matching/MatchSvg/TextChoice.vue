<template>
  <svg>
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
      <div>
        {{ content }}
      </div>
    </foreignObject>
  </svg>
</template>

<script>
export default {
  name: 'text-choice',
  props: {
    content: { // text string
      type: String,
      required: true
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
</style>