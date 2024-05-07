<template>
	<div class="sequence-footer">
		<div class="left pill-wrapper">
			<ProgressPill
				v-if="props.showAttemptedPill"
				:numItems="numberItems"
				:numAttempted="numberSubmitted"
				:textPrefix="t('attempted')"
			/>
		</div>
		<div class="middle">
			<button @click="$emit('previous')">&#8249;</button>
			<span>{{ displayString }}</span>
			<button @click="$emit('next')">&#8250;</button>
		</div>
		<div class="right">
			<DisplayTime :time="time" />
			<i @click="$emit('goToSummary')" class="fas fa-chart-bar"></i>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import ProgressPill from './ProgressPill.vue'
import DisplayTime from './DisplayTime.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

function o(x) { return x<10 ? '0'+x : ''+x }

const props = defineProps({
	activeItemIndex: {
		required: true,
		type: [Number, null],
	},
	isCorrectArray: {
		type: Array,
		required: true
	},
	time: {
		type: Number,
		required: true
	},
	showAttemptedPill: {
		type: Boolean,
		required: false,
		default: false
	}
})

const numberItems = computed(() => props.isCorrectArray.length)
const numberSubmitted = computed(() => props.isCorrectArray.filter(x => x !== null).length)
const numberCorrect = computed(() => props.isCorrectArray.filter(x => x).length)
const percentage = computed(() => numberSubmitted.value / numberItems.value)
const displayString = computed(() => {
	if (props.activeItemIndex === null) return t('summary')

	const oneIndexed = o(props.activeItemIndex + 1)
	const nItems = o(numberItems.value)
	return oneIndexed + ' / ' + nItems
})
</script>

<style scoped>
.sequence-footer {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	height: 48px; /* so the font grow won't expand it */
	font-size: 1.1rem;
	overflow: hidden;
}
.left.pill-wrapper {
	display: flex;
	align-items: center;
}
.middle {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 42px;
}
.right {
	display: flex;
	font-size: 1.7rem;
	justify-content: flex-end;
	align-items: center;
}
.right i {
	margin: 0 8px;
	cursor: pointer;
}
.right .display-time {
	font-size: 1rem;
}
button {
	background-color: transparent;
	border: none;
	padding: 0;
	margin: 0 6px;
	font-size: 48px;
	cursor: pointer;
	color: inherit;
	text-decoration: none;
	transition: font-size 0.3s ease;
	width: 30px;
	transform: translateY(-5px);
}
button:hover {
  font-size: 66px;
}
</style>