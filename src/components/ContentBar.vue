<template>
  <div class="content-bar">
    <div class="native-items-folders-wrapper">
      <h3>{{ t('customize-items') }}</h3>
      <ExpandableFolderForType
        v-for="type,i in nativeQuestionTypes"
        :key="`folder-rows-${type}`"
        :displayName="t(type.split('=')[1])"
        :active="props.active"
        :items="itemsForType(type)"
        :show="typesToShow.includes(type)"
        @toggle="toggleShowType(type)"
        @remove="$emit('removeItem', $event)"
        @active="$emit('active', $event)"
      />
    </div>
    <div class="foreign-item-folder-wrapper">
      <h3>{{ t('foreign-items') }}</h3>
      <ExpandableFolderForType
        v-for="type,i in foreignQuestionTypes"
        :key="`folder-rows-${type}`"
        :displayName="t(type.split('=')[1])"
        :active="props.active"
        :items="itemsForType(type)"
        :show="typesToShow.includes(type)"
        @toggle="toggleShowType(type)"
        @remove="$emit('removeItem', $event)"
        @active="store.dispatch('previewContent', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import ExpandableFolderForType from './ExpandableFolderForType.vue'
import ItemName from './ItemName.vue'
import { ref, reactive, watch } from 'vue'
import questionTypes from '../helpers/questionTypes.js'

import { useStore } from 'vuex'
const store = useStore()
const t = slug => store.getters.t(slug)

const nativeQuestionTypes = Object.keys(questionTypes)
const foreignQuestionTypes   = [ 'application/json;type=karel-task&version=1.0.1' ]

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

watch(
  () => props.items,
  fetchNeededMetadataSet,
  { immediate: true, deep: true }
)
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
  () => props.active,
  openFolderByContentId
)
async function openFolderByContentId(id) {
  const { active_type: type } = await Agent.metadata(id)
  if (!typesToShow.value.includes(type)) typesToShow.value.push(type)
}

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
.content-bar {
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 40px 0 20px 0;
}
.content-bar h3 {
  border-bottom: 1px solid slategrey;
  margin: 0;
}
.foreign-item-folder-wrapper {
  margin-top: auto;
  height: 160px;
}
</style>