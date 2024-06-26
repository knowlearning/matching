<template>
	<div class="sequence-player">
		<SequenceHeader class="header"
			:sequenceId="props.id"
			:activeItemIndex="data.activeItemIndex"
			:isCorrectArray="isCorrectArray"
			@select="data.activeItemIndex = $event"
			@close="handleClose"
		/>
		<div
			v-for="item,i in sequenceDef.items"
			:key="`play-item-${i}`"
			class="embedded-question-wrapper"
			v-show="i === data.activeItemIndex"
		>
			<vueEmbedComponent
				v-if="i === data.activeItemIndex"
				style="position: absolute; top: 0; left: 0;"
				:id="item.id"
				@close="handleItemSubmit(i, $event)"
				:namespace="{
					prefix: `sequence-${id}-item-${i}`,
					allow: [
						'pila/competencies',
						'pila/latest_competencies'
					]
				}"
				allow="camera;microphone;fullscreen"
			/>
		</div>

		<EndSequenceSummary
			class="embedded-question-wrapper"
			v-show="data.activeItemIndex === null"
			:sequenceDef="sequenceDef"
			:isCorrectArray="isCorrectArray"
			:timeOnTasks="timeOnTasks"
			@close="handleClose"
			@select="data.activeItemIndex = $event"
		/>

		<SequenceFooter class="footer"
			@previous="previous"
			@next="next"
			@goToSummary="data.activeItemIndex = null"
			:activeItemIndex="data.activeItemIndex"
			:isCorrectArray="isCorrectArray"
			:time="data.totalTime"
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

import { useStore } from 'vuex'
const store = useStore()
const t = slug =>store.getters.t(slug)

const emits = defineEmits(['close'])

const props = defineProps({
	id : {
		type: String,
		required: true
	}
})

const competencyDashboardData = ref(null)
const showCompetencyDashboard= ref(false)

const sequenceDef = await Agent.state(props.id)

const data = reactive(await Agent.state(`sequence-${props.id}`))

if (!data.itemInfo) { // bellwether for first init
	Object.assign(data, {
	  activeItemIndex: 0,
	  itemInfo: initialItemInfo(),  // { 'index/itemId' : { time, correct }, ... }
	  totalTime: 0
	})
} else { // if reattaching add any needed new keys
	data.activeItemIndex = 0
 	Object.entries(initialItemInfo())
 		.filter(([key, info]) => !data.itemInfo[key])
 		.forEach(([key, info]) => data.itemInfo[key] = info )
}

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
const timeOnTasks    = computed(() => activeItemInfo.value.map(obj => obj.time) )
const activeItemId = computed(() => sequenceDef.items[data.activeItemIndex].id)

const intervalId = setInterval(updateTimeTracking, 1000)

onBeforeUnmount(() => clearInterval(intervalId) )

function updateTimeTracking() {
	const i = data.activeItemIndex
	data.totalTime ++
	if (Number.isInteger(i)) {
		const key = `${i}/${sequenceDef.items[i].id}`
		data.itemInfo[key].time ++
	}
}
function next() {
	const i = data.activeItemIndex  // expect to be null
	if (i === null) data.activeItemIndex = 0
	else data.activeItemIndex = (i === sequenceDef.items.length - 1) ? null : i + 1
}
function previous() {
	const i = data.activeItemIndex
	if (i === null) data.activeItemIndex = sequenceDef.items.length - 1
	else data.activeItemIndex = (i <= 0) ? 0 : i - 1
}
async function handleItemSubmit(i, info={}) {
	const { success=null } = info
	const key = `${i}/${sequenceDef.items[i].id}`
	if (info.competencies) {
		competencyDashboardData.value = info.competencies
		showCompetencyDashboard.value = true
		//  TODO: compute correctness based on competencies
		const runWasSuccessful = competencySuccess(info.competencies)
		data.itemInfo[key].correct = data.itemInfo[key].correct || runWasSuccessful
		if (runWasSuccessful) {
			// wait until competency dashboard toggles off, then trigger next
			const unwatch = watch(
				showCompetencyDashboard,
				() => {
					unwatch()
					next()
				}
			)
		}
	}
	else {
		await itemFeedbackSwal(t, success)
		data.itemInfo[key].correct = success
		if (success) next()
	}
}
function handleClose() {
	Agent.close()
	emits('close')
}

function competencySuccess(competencies) {
	//  Remove attempts from score calculation
  const scores = JSON.parse(JSON.stringify(competencies))
  delete scores["general:attempts"]

  const numerator = Object.values(scores)
    .reduce((acc,cur) => acc + cur[0], 0)
  const denominator = Object.values(scores)
    .reduce((acc,cur) => acc + cur[1], 0)

  const meetsThreshold = 0.85 < (denominator ? numerator / denominator : 0)
  return meetsThreshold || null
}

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
.footer { bottom: 0; }
</style>

