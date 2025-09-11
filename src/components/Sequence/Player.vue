<template>
  <xapi-table
    v-show="showXapiLog"
    :data="[...data.sequenceXapiLogMirror].reverse()"
    :showOnlyTheseKeys="[ 'actor', 'verb', 'object', 'source', 'stored', 'success', 'embed_path' ]"
    @close="showXapiLog = !showXapiLog"
  />
  <data-viewer
    v-show="showSeqAndSubItemDefs"
    :items="[
      { id: props.id, data: sequenceDef },
      ...Object.entries(subItemDefs).map(([id, data]) => ({ id, data }))
    ]"
    @close="showSeqAndSubItemDefs = !showSeqAndSubItemDefs"

  />
  <div class="sequence-player" v-show="!showXapiLog && !showSeqAndSubItemDefs">
    <SequenceHeader class="header"
      :sequenceId="props.id"
      :quizMode="sequenceDef.quizMode"
      :activeItemIndex="data.activeItemIndex"
      :isCorrectArray="isCorrectArray"
      :time="data.totalTime"
      @select="index => moveInSequence(index, 'user')"
      @close="handleClose"
      @dblclick.shift="activateXapiView"
      @click.shift.meta="showSeqAndSubItemDefs = !showSeqAndSubItemDefs"
    />
    <div
      v-for="item,i in sequenceDef.items"
      :key="`play-item-${i}`"
      class="embedded-question-wrapper"
      v-show="i === data.activeItemIndex"
    >
      <div
        v-if="i === data.activeItemIndex"
        class="embed-wrapper"
      >
        <div
          style="
            position: relative;
            flex-grow: 1;
          "
        >
          <vueEmbedComponent
            @mutate="handleXapiChanges(i,$event)"
            @close="handleItemSubmitViaClose(i, $event)"
            :style="{
              position: 'absolute',
              top: '0',
              left: '0',
              'pointer-events': data.quizFinished ? 'none' : 'auto'
            }"
            :id="item.id"
            :namespace="{
              prefix: `sequence-${id}-item-${i}`,
              allow: [
                'pila/competencies',
                'pila/latest_competencies',
                'my-' // TODO: Disable!
              ]
            }"
            :environmentProxy="sendEnvironment"
            allow="camera;microphone;fullscreen"
          />
        </div>
        <div
          v-if="showLLMChat"
          style="
            width: 33vw;
            border-left: 1px solid #BBB;
          "
        >
          <vueEmbedComponent
            id="https://ornate-heliotrope-39a730.netlify.app"
          />
        </div>
      </div>
      <div
        v-if="sequenceDef.quizMode && data.quizFinished"
        style="position: absolute; bottom: 2px; right: 6px;"
      >
        {{ t('review-mode-quiz-finished') }}
      </div>
    </div>

    <EndSequenceSummary
      class="embedded-question-wrapper"
      v-show="data.activeItemIndex === null"
      :sequenceDef="sequenceDef"
      :isCorrectArray="isCorrectArray"
      :timeOnTasks="timeOnTasks"
      @close="handleClose"
      @select="index => moveInSequence(index, 'user')"
    />

    <SequenceFooter class="footer"
      @previous="previous('user')"
      @next="next('user')"
      @goToSummary="moveInSequence(null, 'user')"
      @quizFinished="handleQuizFinished"
      :activeItemIndex="data.activeItemIndex"
      :quizMode="sequenceDef.quizMode"
      :quizFinished="data.quizFinished"
      :isCorrectArray="isCorrectArray"
      :time="data.totalTime"
      @dblclick.shift="showLLMChat = !showLLMChat"
    />
  </div>
  <v-overlay
    v-model="showCompetencyDashboard"
    class="align-center justify-center"
  >
    <CompetancyDashboard
      :content="activeItemId"
      :competencies="competencyDashboardData"
    />
  </v-overlay>
</template>

<script setup>

import { vueEmbedComponent } from '@knowlearning/agents/vue.js'
import { ref, reactive, computed, onBeforeUnmount, watch } from 'vue'
import SequenceHeader from './SequenceHeader.vue'
import SequenceFooter from './SequenceFooter.vue'
import EndSequenceSummary from './EndSequenceSummary.vue'
import { itemFeedbackSwal } from '../../helpers/swallows.js'
import CompetancyDashboard from './competency-dashboard.vue'
import XapiTable from './XapiTable.vue'
import DataViewer from './DataViewer.vue'
import translateScopeId from '../../helpers/translateScopeId.js'
import questionContexts from './questionContexts.js'
import questionContextShared from './questionContextShared.js'
import { useStore } from 'vuex'

const XAPI_HEARTBEAT_INTERVAL = 20000

const store = useStore()
const t = slug =>store.getters.t(slug)

const emits = defineEmits(['close'])

const props = defineProps({
  id : {
    type: String,
    required: true
  }
})
const showXapiLog = ref(false)
const showSeqAndSubItemDefs = ref(false)

const competencyDashboardData = ref(null)
const showCompetencyDashboard= ref(false)
const showLLMChat = ref(false)

const { auth: { user } } = await Agent.environment()

const language = store.getters.language()

// Get translated sequence and sub-item definitions
const sequenceDef = await translateScopeId(props.id, language)
const subItemIds = sequenceDef.items.map(el => el.id)
const res = await Promise.all(subItemIds.map(id => translateScopeId(id, language)))
const subItemDefs = Object.fromEntries(
  subItemIds.map((id, i) => [id, res[i]])
)

const localQuestionContexts = JSON.parse(JSON.stringify(questionContexts))
Object.entries(subItemDefs).forEach(([id, { testAiItemPrompt }]) => {
  if (testAiItemPrompt) {
    if (localQuestionContexts[id]) {
      localQuestionContexts[id] += `\n${testAiItemPrompt}`
    } else {
      localQuestionContexts[id] = testAiItemPrompt
    }
  }
})

Object.entries(localQuestionContexts).forEach(([id, prompt]) => {
  localQuestionContexts[id] = questionContextShared + prompt
})

const data = reactive(await Agent.state(`sequence-${props.id}`))
const chat = await Agent.state('chat')

if (!data.itemInfo) { // bellwether for first init
  Object.assign(data, {
    activeItemIndex: 0,
    itemInfo: initialItemInfo(), // { 'index/itemId' : { time, correct }, ... }
    totalTime: 0,
    quizFinished: null,
    sequenceXapiLogMirror: [] // for results of polling xapi on seq and sub items
  })
}
else if (!data.sequenceXapiLogMirror) {
  data.sequenceXapiLogMirror = []
}
else {
  // in case items removed from sequence
  data.activeItemIndex = Math.min(data.activeItemIndex, sequenceDef.items.length-1)
  // if reattaching add any needed new keys
  Object.entries(initialItemInfo())
    .filter(([key, info]) => !data.itemInfo[key])
    .forEach(([key, info]) => data.itemInfo[key] = info )
}

const activeItemInfo = computed(() => {
  return Object.entries(data.itemInfo)
    .reduce((acc, cur) => {
      const [ key, info ] = cur
      const [ i, id ] = key.split('/')
      const isActive = (id && id === sequenceDef.items[i]?.id)
      if (isActive) acc[i] = info
      return acc
    }, [])
})

const isCorrectArray = computed(() => activeItemInfo.value.map(obj => obj.correct) )
const timeOnTasks = computed(() => activeItemInfo.value.map(obj => obj.time) )
const activeItemId = computed(() => sequenceDef.items[data.activeItemIndex].id)

// For non-XAPI Heartbeat --- start timer, but only if not already locked
let oldIntervalId = undefined
if (!data.quizFinished) {
  oldIntervalId = setInterval(updateOldTimeTracking, 1000)
}

// For xapi sequence heartbeat. This gives us an "upper-guard" for analyzing the sequence xapi data. If we haven't seen an xapi log in more than the interval duration, we know it's inactive
let sequenceTimerHeartbeatPulsing = true

async function xApiHeartbeat() {
  await new Promise(res => setTimeout(res, XAPI_HEARTBEAT_INTERVAL))
  data.xapi = {
    actor: props.id,
    verb: 'heartbeat',
    object: props.id
  }
  if (sequenceTimerHeartbeatPulsing) xApiHeartbeat()
}

xApiHeartbeat()

const currentItemId = computed(() => sequenceDef.items[data.activeItemIndex]?.id)

setTimeout(() => {
  data.xapi = {
    actor: props.id,
    verb: 'initialized',
    object: props.id,
    authority: user,
    extensions: { language }
  }
  setTimeout(() => {
    data.xapi = {
      actor: props.id,
      verb: 'initialized',
      object: currentItemId.value,
      authority: user
    }
  })
})

onBeforeUnmount(() => {
  // for old dashboard heartbeat
  clearInterval(oldIntervalId)
  // for xapi heartbeat
  sequenceTimerHeartbeatPulsing = false
})

function initialItemInfo() {
  return sequenceDef.items
    .reduce((acc, cur, i) => {
      return { ...acc, [`${i}/${cur.id}`] : { time: 0, correct: null } }
    }, {})
}

function keyIsActive(key) {
  const [ i, id ] = key.split('/')
  return id && id === sequenceDef.items[i]?.id
}

function handleQuizFinished() {
  data.quizFinished = true
  moveInSequence(null, 'sequence')
  // for old timing
  clearInterval(oldIntervalId)
  // for xapi timing
  sequenceTimerHeartbeatPulsing = false
}

function updateOldTimeTracking() {
  const i = data.activeItemIndex
  data.totalTime ++
  if (Number.isInteger(i)) {
    const key = `${i}/${sequenceDef.items[i].id}`
    data.itemInfo[key].time ++
  }
}
function next(actor) {
  const i = data.activeItemIndex
  if (i === null) return // if on dashboard, do nothing. already at 'end'

  const onLastItem = (i === sequenceDef.items.length - 1)
  const activeQuiz = (sequenceDef.quizMode && !data.quizFinished)

  if (onLastItem && activeQuiz) {
    return // no dashboard yet
  } else if (onLastItem && !activeQuiz) {
    moveInSequence(null, actor)
  } else {
    moveInSequence(data.activeItemIndex+1, actor)
  }
}

function previous(actor) {
  const i = data.activeItemIndex
  if (i === null) {
    moveInSequence(sequenceDef.items.length-1, actor)
  }
  else {
    moveInSequence((i <= 0) ? 0 : i - 1, actor)
  }
}
async function handleItemSubmitViaClose(i, info={}) {
  // if basic/old items use close (no xapi), also sequence writes the xapi row for that sub-item
  const {
    success = null,
    message = null
  } = info

  const key = `${i}/${sequenceDef.items[i].id}`
  if (info.competencies) { // TODO: Rehab Candli Competencies for xAPI. info.competencies is bellwether
    competencyDashboardData.value = info.competencies
    showCompetencyDashboard.value = true
    // TODO: compute correctness based on competencies
    const runWasSuccessful = competencySuccess(info.competencies)
    data.itemInfo[key].correct = data.itemInfo[key].correct || runWasSuccessful
    if (runWasSuccessful) {
      // wait until competency dashboard toggles off, then trigger next
      const unwatch = watch(
        showCompetencyDashboard,
        () => {
          unwatch()
          next('sequence')
        }
      )
    }
  }
  else { // normal, non-Candli close flow
    if (sequenceDef.quizMode) {
      next('sequence')
    } else { // normal learn mode
        await itemFeedbackSwal(t, success, message)
        if (success) next('sequence')
    }
    // both learn and quiz mode
    // key below is of form `${index}/${itemId}``
    data.itemInfo[key].correct = success
    data.xapi = {
      verb: 'submitted',
      object: sequenceDef.items[i].id, // sub-item id
      result: { success },
      extensions: { message },
    }
  }
}

async function moveInSequence(toIndex, source) {
  const i = data.activeItemIndex
  const prevItem = i != null ? sequenceDef.items[i] : null
  const currItem = toIndex != null ? sequenceDef.items[toIndex] : null

  data.activeItemIndex = toIndex

  await new Promise(r => setTimeout(r, 1))

  data.xapi = {
    actor: source === 'user' ? user : props.id,
    verb: 'suspended',
    object: prevItem?.id || 'dashboard',
    authority: user
  }

  await new Promise(r => setTimeout(r, 1))

  data.xapi = {
    actor: source === 'user' ? user : props.id,
    verb: 'initialized',
    object: currItem?.id || 'dashboard',
    authority: user
  }

  if (localQuestionContexts[currItem?.id]) {
    chat.aiSystemMessage = localQuestionContexts[currItem.id]
  }
}

function handleClose() {
  Agent.close()
  emits('close')
}

function competencySuccess(competencies) {
  // Remove attempts from score calculation
  const scores = JSON.parse(JSON.stringify(competencies))
  delete scores["general:attempts"]

  const numerator = Object.values(scores)
  .reduce((acc,cur) => acc + cur[0], 0)
  const denominator = Object.values(scores)
  .reduce((acc,cur) => acc + cur[1], 0)

  const meetsThreshold = 0.85 < (denominator ? numerator / denominator : 0)
  return meetsThreshold || null
}

async function sendEnvironment(e) {
  return Agent.environment(e)
}

async function handleXapiChanges(i, e) {

  if (e.patch[0].path[0] === 'xapi') {
    // only handle xapi from immediate children
    // other wrappers won't have 'runstate' as next string
    if (!e.scope?.startsWith(`sequence-${props.id}-item-${i}/runstate`)) return

    const { verb, object, result, extensions } = e.patch[0].value
    const success = result?.success
    const message = extensions?.message

    const key = `${i}/${sequenceDef.items[i].id}`

    if (verb === 'submitted') {
      if (sequenceDef.quizMode) {
        next('sequence')
      } else { // normal learn mode
          await itemFeedbackSwal(t, success, message)
          if (success) next('sequence')
      }
      data.itemInfo[key].correct = success
    }
    if (verb === 'completed') {
      next('sequence')
      data.itemInfo[key].correct = 'completed' // this is hacky, correct as t/f/'completed', but this correctness is only for this display
    }

  }
}

async function activateXapiView() {
  try {
    const res = await Agent.query(
      'statements',
      [[user], [props.id]],
      'xapi.knowlearning.systems'
    )
    data.sequenceXapiLogMirror = res
    showXapiLog.value = !showXapiLog.value

  }
  catch (err) {
    console.error('Failed to fetch xAPI data:', err.message)
  }
}

/*
// START XAPI LOG POLLING
// data.sequenceXapiLogMirror is initialized with other data.whatever up above
let xapiLogPolling = true
let xapiPollTimeoutId

pollXapi( [user] , [props.id] )

async function pollXapi(users, empath) {

  if (!xapiLogPolling) return
  try {
    const newXapi = await fetchXapi(users, empath)
    const prev = data.sequenceXapiLogMirror
    // Append only new items
    if (newXapi.length > prev.length) {
      const delta = newXapi.slice(prev.length)
      data.sequenceXapiLogMirror.push(...delta)
    }
  }
  catch (err) { console.error('Failed to fetch xAPI data:', err.message) }
  xapiPollTimeoutId = setTimeout(() => pollXapi( users, empath), 2000)
}

async function fetchXapi(users, empath) {
  return await Agent.query('statements', [users, empath], 'xapi.knowlearning.systems')
}

onBeforeUnmount(() => {
  xapiLogPolling = false
  clearTimeout(xapiPollTimeoutId)
})

// END XAPI LOG POLLING
*/


</script>

<style scoped>
.sequence-player {
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sequence-player .embedded-question-wrapper {
  position: relative;
  flex-grow: 1;
  width: 100%;
  background-color: #f2f2f2;
}

.header, .footer {
  background-color: #333;
  color: #fff;
  width: 100%;
  padding: 2px 6px;
  box-sizing: border-box;
  text-align: center;
  position: sticky;
  z-index: 1000;
}
.header { top: 0; }
.footer {
  bottom: 0;
  user-select: none;
}

.embed-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>

