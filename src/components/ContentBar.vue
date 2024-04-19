<template>
  <div>

    <div class="button-area">
      <button @click="$emit('addNew')">
        <i class="fas fa-plus" />
      </button>
      <button @click="$emit('copy')">
        <i class="fas fa-copy" />
      </button>
    </div>

    <div v-for="type in types" :key="`type-${type}`">
      <div
        class="select-type-row"
        @click="toggleShowType(type)"
      >
        <h4>
          <i :class="{
            'fas' : true,
            'fa-folder-plus' : !typesToShow.includes(type),
            'fa-folder-open' : typesToShow.includes(type)
          }"
        />
          <span>{{ t(type.split('=')[1]) }}</span>
        </h4>
      </div>

      <div
        v-if="typesToShow.includes(type)"
        v-for="item in itemsForType(type)"
        :key="`item-${itemId}`"
        :class="{
          'item-choice' : true,
          'active' : item === props.active
        }"
        @click="$emit('active', item)"
      >
        <Suspense>
          <ItemName :id="item"
            draggable="true"
            style="cursor: grab;"
            @dragstart="$event.dataTransfer.setData('text', item)"  
          />
        </Suspense>
        <span
          class="remove-symbol"
          @click.stop="$emit('removeItem', item)"
        >&#x2715;</span>
      </div>
    </div>
  </div>
</template>


<script setup>
import ItemName from './ItemName.vue'
import { ref, reactive, watch } from 'vue'
import questionTypes from '../helpers/questionTypes.js'
import { useStore } from 'vuex'
const store = useStore()
const t = slug => store.getters.t(slug)

const types = Object.keys(questionTypes)

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

let typesToShow = ref([])

let metadata = reactive({}) // { [id]: { name, type }, ... }

async function fetchItemMetadata(id) {
  const { active_type, owner } = await Agent.metadata(id)
  const { name } = await Agent.state(id)
  return { name, owner, type: active_type }
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

function itemsForType(type) {
  return props.items.filter(id => metadata?.[id]?.type === type)
}
function toggleShowType(type) {
  const wasActive = typesToShow.value.includes(type)
  if (wasActive) typesToShow.value = typesToShow.value.filter(t => t !== type)
  else typesToShow.value.push(type)
}

</script>


<style scoped>
.button-area {
  display: flex;
  justify-content: center;
  align-items: center;
}
.select-type-row {
  user-select: none;
  cursor: pointer;
  margin: 16px 0 0 0;
}
.select-type-row h4 {
  margin: 0;
}
.select-type-row i {
  margin-right: 8px;
}
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