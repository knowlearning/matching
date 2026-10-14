<template>
  <button
    v-for="state, i in states"
    :key="i"
    type="button"
    class="progress-dot"
    :class="state"
    :disabled="blockNav"
    :aria-label="`Item ${i + 1}: ${state.replace('-', ' ')}`"
    :aria-current="activeItemIndex === i ? 'step' : undefined"
    :title="`Item ${i + 1}: ${state.replace('-', ' ')}`"
    @click="$emit('select', i)"
  />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  activeItemIndex: { type: [Number, null], required: true },
  quizMode: { type: Boolean, default: false },
  blockNav: { type: Boolean, default: false }
})
defineEmits(['select'])

// Remember even visits shorter than the existing one-second timer, without
// adding fields to persisted sequence state. Saved time restores earlier visits.
const entered = ref(new Set())
watch(() => props.activeItemIndex, i => {
  if (Number.isInteger(i)) entered.value.add(i)
}, { immediate: true, flush: 'sync' })

const windowActive = ref(false)
let activityInterval
function updateActivity() {
  windowActive.value = document.visibilityState === 'visible' && document.hasFocus()
}
onMounted(() => {
  updateActivity()
  // Focus can move into a child application iframe without a window event.
  activityInterval = setInterval(updateActivity, 250)
})
onBeforeUnmount(() => clearInterval(activityInterval))

const states = computed(() => props.items.map(({ correct, time }, i) => {
  if (props.activeItemIndex === i && windowActive.value) return 'active'
  // Match the player's existing application-driven finish behavior. An
  // unsuccessful submission finishes a quiz item, but allows retries otherwise.
  if (correct === 'completed' || correct === true || (props.quizMode && correct === false)) return 'finished'
  if (entered.value.has(i) || time > 0 || correct === false) return 'entered'
  return 'not-entered'
}))
</script>

<style scoped>
.progress-dot {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  margin: 4px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
}
.progress-dot:disabled { cursor: default; opacity: 1; }
.progress-dot:focus-visible { outline: 2px solid white; outline-offset: 3px; }
.entered { background-color: grey; }
.finished { background-color: dodgerblue; }
.active {
  background-color: #ffd600;
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  50% { opacity: 0.3; }
}
@media (prefers-reduced-motion: reduce) {
  .active { animation: none; }
}
</style>
