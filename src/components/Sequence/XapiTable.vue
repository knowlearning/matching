<template>
  <div class="elite-terminal-container">

    <div class="buttons-wrapper">
      <button @click="emits('close')">Close</button>
      <button @click="downloadXapiAsCSV">Download CSV</button>
    </div>

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
})

function downloadXapiAsCSV() {
  const csvString = toCSV(props.data)

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url); // cleanup
}

function toCSV(data) {
  if (!data.length) return "";

  // Extract all unique keys
  const keys = Array.from(
    new Set(data.flatMap(obj => Object.keys(obj)))
  )

  // Convert a single value into a safe CSV cell
  const escape = (value) => {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return `"${value.join(";")}"`;
    if (typeof value === "object") return `"${JSON.stringify(value)}"`;
    const str = String(value);
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  }

  // Build CSV
  const header = keys.join(",");
  const rows = data.map(obj =>
    keys.map(k => escape(obj[k])).join(",")
  )

  return [header, ...rows].join("\n");
}

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
}
.buttons-wrapper {
  display: flex;
  justify-content: center;
}
.buttons-wrapper button {
  padding: 3px 6px;
  background: revert;
  border-radius: 8px;
  border: revert;
  margin-right: 12px;
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
