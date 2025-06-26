<template>
  <div class="data-viewer">
    <button style="display: inline-block;" @click="emits('close')">Close</button>

    <div class="tabs">
      <button
        v-for="(item, index) in items"
        :key="index"
        @click="selectedIndex = index"
        :class="['tab', { active: selectedIndex === index }]"
      >
        {{ item.name }}
      </button>
    </div>

    <div class="object-viewer">
      <pre>{{ prettyPrint(items[selectedIndex]?.data) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emits = defineEmits([ 'close' ])
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  }
})

const selectedIndex = ref(0)

function prettyPrint(data) {
  return JSON.stringify(data, null, 2)
}
</script>

<style scoped>
.data-viewer {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.4;
  padding: 1rem;
  box-sizing: border-box;
}

.data-viewer button {
  flex: 0 0 auto;
  width: auto;
  align-self: flex-start;
  flex-grow: 0;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: #eee;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: bold;
  color: #333;
  border: 1px solid #ccc;
}

.data-viewer button:hover {
  background-color: #ddd;
}

.tabs {
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tab {
  all: unset;
  padding: 0.5rem 1rem;
  background-color: #ddd;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: bold;
  color: #333;
}

.tab.active {
  background-color: #333;
  color: white;
}
.object-viewer {
	flex-grow: 1;
}
.object-viewer pre {
  height: 100%;
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 0.25rem;
  overflow: auto;
  border: 1px solid #ccc;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
