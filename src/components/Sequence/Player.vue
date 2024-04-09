<template>
	<div class="sequence-player">
		<SequenceHeader
			:isCorrectArray="data.isCorrectArray"
			:activeItemIndex="data.activeItemIndex"
			@select="data.activeItemIndex = $event"
		/>
		<div
			v-for="item,i in questionDef.items"
			:key="`play-item-${i}`"
			v-show="i === data.activeItemIndex"
			class="embedded-question-wrapper"
		>
			<Suspense>
				<vueEmbedComponent
					:id="item.id"
					@close="handleClose(i, $event)"
					:namespace="`sequence-${id}-item-${i}`"
				/>
			</Suspense>
		</div>
		
	</div>
</template>


<script setup>

import { vueEmbedComponent } from '@knowlearning/agents/vue.js'
import { reactive, computed, onBeforeUnmount } from 'vue'
import SequenceHeader from './SequenceHeader.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps(['id'])

const questionDef = await Agent.state(props.id)

const data = reactive({
  activeItemIndex: 0,
  // both arrays below conventionally match index of items to the info
  // if a third comes, unify to an array of objects with isCorrect and time etc
  isCorrectArray: questionDef.items.map(el => null),
  timeOnTasks: questionDef.items.map(el => 0),
  totalTime: 0
})

const intervalId = setInterval(updateTimeTracking, 1000)

onBeforeUnmount(() => clearInterval(intervalId) )

function updateTimeTracking() {
	const i = data.activeItemIndex
	data.totalTime ++
	if (Number.isInteger(i)) data.timeOnTasks[i] ++

}

function handleClose(i, e) {
	// TODO: What about other "info"... not just close on correct?
	// Need state watching / reacting OR other messaging.
	data.isCorrectArray[i] = e.success
	data.activeItemIndex =  (i === data.isCorrectArray.length - 1) ? null : i + 1
}

</script>

<style>
.sequence-player {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.sequence-player .embedded-question-wrapper {
	margin-top: 14px;
	width: 100%;
	height: 100%;
}
.sequence-player .embedded-question-wrapper iframe {
	width: 600px;
	height: 600px;
}
</style>

