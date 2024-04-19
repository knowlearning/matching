<template>
  <div>
    MD: {{ metadata }}
    <div
      v-for="itemId in props.items"
      :key="itemId"
      :class="{
        'item-choice' : true,
        'active' : itemId === props.active
      }"
      @click="$emit('active', itemId)"
    >
      <Suspense>
        <ItemName :id="itemId"
          draggable="true"
          style="cursor: grab;"
          @dragstart="$event.dataTransfer.setData('text', itemId)"  
        />
      </Suspense>
      <span
        class="remove-symbol"
        @click.stop="$emit('removeItem', itemId)"
      >&#x2715;</span>
    </div>
  </div>
</template>


<script setup>
import ItemName from './ItemName.vue'
import { reactive, watch } from 'vue'
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  active: {
    type: [ String, null ],
  required: true
  }
})

let metadata = reactive({}) // { [id]: { name, type }, ... }

async function fetchItemMetadata(id) {
  const { active_type } = await Agent.metadata(id)
  const { name } = await Agent.state(id)
  return { name, type: active_type }
}

async function fetchNeededMetadataSet() {
  const neededIds = props.items.filter(id => !Object.keys(metadata).includes(id))
  const removedIds = Object.keys(metadata).filter(id => !props.items.includes(id))
  // remove metadata
  removedIds.forEach(id => delete metadata[id])
  // add metadata
  const promisesArray = neededIds.map(fetchItemMetadata)
  const res = await Promise.all(promisesArray)
  res.forEach((r,i) => metadata[neededIds[i]] = r)
}

watch(
  () => props.items,
  fetchNeededMetadataSet,
  { immediate: true, deep: true }
)

</script>


<style scoped>
.item-choice {
  font-family: monospace;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-choice:hover {
  background: rgba(255,255,0,0.1);
}
.item-choice.active {
  background: rgba(255,255,0,0.33);
}
.item-choice .remove-symbol {
  font-size: 1rem;
  font-weight: bolder;
  padding-right: 4px;
  color: red;
  cursor: pointer ;
  opacity: 0.2;
}
.item-choice .remove-symbol:hover {
  opacity: 1;
}
</style>