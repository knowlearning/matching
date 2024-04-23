<template>
  <div class="customizer">
    <AbsolutePreviewAndItemId :id="props.id" />

    <NameAndInstructions
      :content="data.content"
      style="width: 420px; margin: 8px auto;"
    />

    <div class="local-customizer-area">
      <div class="add-buttons-wrapper">
        <PickFileButton
          fas-icon="fa-file-audio"
          acceptType="audio/*"
          @newFile="handleFileAdd('audio', $event)"
        />
        <PickFileButton
          fas-icon="fa-file-image"
          acceptType="image/*"
          @newFile="handleFileAdd('image', $event)"
        />


        <v-btn @click="addChoice">
          <span>{{ t('add-by-text-or-by-id') }}</span>
        </v-btn>


        <v-btn
          @click="data.content.textIsPlayable = !data.content.textIsPlayable"
          size="small"
          class="ma-2"
          :icon="data.content.textIsPlayable ? 'fas fa-volume-up' : 'fas fa-volume-mute' "
        />

      </div>
      <MatchSvg
        :toChoices="data.content.toChoices"
        :fromChoices="data.content.fromChoices"
        :connections="data.content.answerConnections"
        :editMode="data.editChoices"
        :textIsPlayable="data.content.textIsPlayable"
        @updateConnections="data.content.answerConnections = copy($event)"
        @removeChoice="handleRemoveChoice"
        @editChoice="handleEditChoice"
        @move="handleMove"
      />
      <v-btn
        @click="data.editChoices = !data.editChoices"
        size="small"
        icon="fas fa-pen"
      />

    </div>

  </div>
</template>

<script setup>
import { reactive} from 'vue'
import { v4 as uuid, validate as isUUID } from 'uuid'
import AbsolutePreviewAndItemId from '../SharedCustomizerComponents/AbsolutePreviewAndItemId.vue'
import NameAndInstructions from '../SharedCustomizerComponents/NameAndInstructions.vue'
import MatchSvg from './MatchSvg/index.vue'
import PickFileButton from '../PickFileButton.vue'
import { inputSwal,
  unsupportedTypeSwal,
  areYouSureSwal
} from '../../helpers/swallows.js'
import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const copy = x => JSON.parse(JSON.stringify(x))

const props = defineProps(['id'])

const data = reactive({
  content: null,
  editChoices: false,
})

const state = await Agent.state(props.id)
data.content = state

async function addChoice() {
  const { isConfirmed, value } = await inputSwal(t)
  if (!isConfirmed || !value) return

  if (!isUUID(value)) { // not uuid, add text choice
    data.content.fromChoices.push({
      type: 'text',
      content:value,
      nodeId: uuid()
    })
  } else { // is uuid, add type with guard if not found or not type
    const { active_type } = await Agent.metadata(value)
    let type // should 'audio' 'image', or undefined
    if (active_type.startsWith('audio')) type = 'audio'
    if (active_type.startsWith('image')) type = 'image'
    if (type === 'audio' || type === 'image') {
      data.content.fromChoices.push({
        type,
        nodeId: uuid(),
        content: value
      })
    } else {
      unsupportedTypeSwal(t, value, active_type)
    }
  }
}

function handleMove(nodeId, dir) {
  // tedious logic, made code-grosser by the reactivity situation
  // for right / left, ignore if already on that side, if not push to end of other choice array and remove from own.  
  const fromCopy = copy(data.content.fromChoices)
  const toCopy = copy(data.content.toChoices)

  const choiceCopy = copy([ ...fromCopy, ...toCopy].find(c => c.nodeId === nodeId))
  const inLeftColumn = fromCopy.some(c => c.nodeId === nodeId)
  const inRightColumn = !inLeftColumn // assume it somewhere!
  const choiceIndex = inLeftColumn ? fromCopy.findIndex(c => c.nodeId === nodeId) : toCopy.findIndex(c => c.nodeId === nodeId)

  if (inLeftColumn && dir === 'right') {
    removeConnectionsToId(nodeId)
    data.content.fromChoices = fromCopy.filter(c => c.nodeId !== nodeId)
    data.content.toChoices = [ ...toCopy, choiceCopy ]
  } else if (inRightColumn && dir === 'left') {
    removeConnectionsToId(nodeId)
    data.content.toChoices = toCopy.filter(c => c.nodeId !== nodeId)
    data.content.fromChoices = [ ...fromCopy, choiceCopy ]
  } else if (inLeftColumn && dir === 'up') {
    moveArrayElementUp(fromCopy, choiceIndex)
    data.content.fromChoices = fromCopy
  } else if (inRightColumn && dir === 'up') {
    moveArrayElementUp(toCopy, choiceIndex)
    data.content.toChoices = toCopy
  } else if (inLeftColumn && dir === 'down') {
    moveArrayElementDown(fromCopy, choiceIndex)
    data.content.fromChoices = fromCopy
  } else if (inRightColumn && dir === 'down') {
    moveArrayElementDown(toCopy, choiceIndex)
    data.content.toChoices = toCopy
  }

}
function moveArrayElementUp(arr, i) {
  if (i > 0 && i < arr.length) {
    [arr[i], arr[i-1]] = [arr[i-1], arr[i]]
  }
}
function moveArrayElementDown(arr, i) {
  if (i >= 0 && i < arr.length - 1) {
    [arr[i], arr[i+1]] = [arr[i+1], arr[i]]
  }
}

async function handleEditChoice(nodeId) {
  const previousValue = [ ...data.content.fromChoices, ...data.content.toChoices]
    .find(el => el.nodeId === nodeId)
    .content
  const { isConfirmed, value } = await inputSwal(t, previousValue)
  if (!isConfirmed || !value ) return

  let newChoice

  if (!isUUID(value)) { // handing text value
    newChoice = { type: 'text', content: value, nodeId }
  } else { // handling uuid value
    const { active_type } = await Agent.metadata(value)
    let type // 'audio' 'image', or undefined
    if (active_type.startsWith('audio')) type = 'audio'
    if (active_type.startsWith('image')) type = 'image'

    if (type === 'audio' || type === 'image') {
      newChoice = { type, nodeId, content: value }
    } else {
      await unsupportedTypeSwal(t, value, active_type)
      return
    }
  } 

  data.content.fromChoices = copy(data.content.fromChoices)
    .map(c => c.nodeId === nodeId ? newChoice : c)
  data.content.toChoices = copy(data.content.toChoices)
    .map(c => c.nodeId === nodeId ? newChoice : c)
  data.editChoices = false
}

async function handleRemoveChoice(nodeId) {
  const { isConfirmed } = await areYouSureSwal(t)
  if (!isConfirmed) return

  data.content.fromChoices = copy(data.content.fromChoices)
    .filter(c => c.nodeId !== nodeId)
  data.content.toChoices = copy(data.content.toChoices)
    .filter(c => c.nodeId !== nodeId)
  removeConnectionsToId(nodeId)
  data.editChoices = false
}
function removeConnectionsToId(nodeId) {
  data.content.answerConnections = copy(data.content.answerConnections)
    .filter(([to,from]) => to !== nodeId && from !== nodeId)
}

async function handleFileAdd(fileType, id) {
  if (fileType === 'audio') {
    data.content.toChoices.push({
      type: 'audio',
      content: id,
      nodeId: uuid()
    })
  } else if (fileType === 'image') {
    data.content.fromChoices.push({
      type: 'image',
      content: id,
      nodeId: uuid()
    })
  }
}
</script>

<style scoped>
.customizer {
  position: relative;
  height: 100%;
  margin: 0 auto;
  padding-top: 56px;
  flex-direction: column;
  align-items: center;
}
.audio-button {
  background: green;
  color: orange;
  opacity: 0.7;
}
</style>
