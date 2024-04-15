<template>
	<div class="sequence-player">
		<SequenceHeader class="header"
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
					@close="handleItemClose(i, $event)"
					:namespace="`sequence-${id}-item-${i}`"
				/>
			</Suspense>
		</div>
		<div v-show="data.activeItemIndex === null">
			<h3>{{ t('finished') }}</h3>
			<button class="submit" @click="handleSubmit">{{ t('submit') }}</button>
		</div>
		<SequenceFooter class="footer"
			@previous="previous"
			@next="next"
			:activeItemIndex="data.activeItemIndex"
			:isCorrectArray="data.isCorrectArray"
		/>	
	</div>
</template>


<script setup>

import { vueEmbedComponent } from '@knowlearning/agents/vue.js'
import { reactive, computed, onBeforeUnmount } from 'vue'
import SequenceHeader from './SequenceHeader.vue'
import SequenceFooter from './SequenceFooter.vue'


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
function next() {
	const i = data.activeItemIndex
	data.activeItemIndex = (i === data.isCorrectArray.length - 1) ? null : i + 1
}
function previous() {
	const i = data.activeItemIndex
	data.activeItemIndex = (i <= 0) ? 0 : i - 1
}
function handleItemClose(i, e) {
	// TODO: What about other "info"... not just close on correct?
	// Need state watching / reacting OR other messaging.
	data.isCorrectArray[i] = e.success
	next()
}
function handleSubmit() {
	Agent.close()
}
</script>

<style>
.sequence-player {
	min-height: 100%;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.sequence-player .embedded-question-wrapper {
	flex: 1;
	width: 100%;
  background-color: #f2f2f2;
}
.sequence-player .embedded-question-wrapper iframe {
	width: 600px;
	height: 600px;
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

