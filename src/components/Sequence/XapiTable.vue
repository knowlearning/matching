<template>
  <div class="elite-terminal-container">
    <button
      style="position: absolute; left: 30%;"
      @click="emits('close')"
    >Close</button>
    <div >{{ data.length }} statements</div>

    <table class="elite-table" v-if="headers.length">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="getRowKey(row, index)"
          :class="{ 'just-arrived': isFresh(getRowKey(row, index)) }"
        >
          <td v-for="header in headers" :key="header">
            {{ row[header] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-green-400">No data yet...</div>
  </div>
</template>

<script setup>
import { watch, ref, computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  showOnlyTheseKeys: {
    type: Array,
    required: false,
    default: null
  }
});
const emits = defineEmits(['close'])

const freshRowKeys = ref(new Set());

const getRowKey = (row, index) => row.id ?? index;

watch(
  () => props.data,
  (newData, oldData) => {
    const oldKeys = new Set((oldData || []).map(getRowKey));
    const newKeys = newData.map(getRowKey);
    newKeys.forEach((key) => {
      if (!oldKeys.has(key)) {
        freshRowKeys.value.add(key);
        setTimeout(() => freshRowKeys.value.delete(key), 1500); // fade after 1.5s
      }
    });
  },
  { deep: true }
);

const isFresh = (key) => freshRowKeys.value.has(key);

const headers = computed(() => {
  if (props.showOnlyTheseKeys && props.showOnlyTheseKeys.length) {
    return props.showOnlyTheseKeys;
  }
  return props.data.length > 0 ? Object.keys(props.data[0]) : [];
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.elite-terminal-container {
  background-color: #000;
  color: #00ff88;
  font-family: 'Share Tech Mono', monospace;
  padding: 2rem;
  border: 2px solid #00ff88;
  border-radius: 0.75rem;
  box-shadow: 0 0 30px #00ff8840;
  overflow-x: auto;
  position: relative;
}

.elite-terminal-container::after {
  content: '';
  pointer-events: none;
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(
    rgba(0, 255, 136, 0.05) 1px,
    transparent 1px
  );
  background-size: 100% 16px;
  mix-blend-mode: overlay;
  opacity: 0.15;
}

.elite-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  table-layout: auto;
}

.elite-table thead {
  background-color: #001d13;
  border-bottom: 2px solid #00ff88;
}

.elite-table th {
  padding: 0.75rem;
  color: #00ffaa;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-right: 1px solid #00ff88;
}

.elite-table td {
  padding: 0.5rem 0.75rem;
  font-size: 0.6rem;
  border-top: 1px solid #00ff8844;
  border-right: 1px solid #00ff8822;
  white-space: nowrap;
}

/* New row effect */
.just-arrived {
  background-color: rgba(0, 255, 136, 0.15) !important;
  animation: flashIn 0.4s ease-out, fadeOut 1.1s ease-out 0.4s forwards;
}

@keyframes flashIn {
  0% {
    transform: translateX(-10px) scaleX(0.98);
    opacity: 0;
    filter: drop-shadow(0 0 5px #00ff88);
  }
  100% {
    transform: none;
    opacity: 1;
  }
}

@keyframes fadeOut {
  to {
    background-color: transparent;
  }
}
</style>
