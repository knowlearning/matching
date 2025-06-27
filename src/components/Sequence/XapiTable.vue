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

<style>
.elite-terminal-container {
  background-color: #ffffff;
  color: #333;
  font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  position: relative;
}

.elite-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  table-layout: auto;
  font-size: 0.7rem;
  color: #222;
}

.elite-table thead {
  background-color: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.elite-table th {
  padding: 0.75rem;
  color: #555;
  text-transform: none;
  letter-spacing: 0.5px;
  font-weight: 600;
  border-right: 1px solid #eee;
  font-size: 0.65rem;
}

.elite-table td {
  padding: 0.6rem 0.75rem;
  border-top: 1px solid #eee;
  border-right: 1px solid #f9f9f9;
  white-space: nowrap;
}

.just-arrived {
  background-color: #e0f7f1 !important;
  animation: flashIn 0.4s ease-out, fadeOut 1.1s ease-out 0.4s forwards;
}

@keyframes flashIn {
  0% {
    transform: translateY(-6px);
    opacity: 0;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  }
  100% {
    transform: none;
    opacity: 1;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
  }
}

@keyframes fadeOut {
  to {
    background-color: transparent;
  }
}
</style>
