<template>
	<div class="sequence-footer">
		<div class="left pill-wrapper">
			<ProgressPill
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
			<i @click="$emit('goToSummary')" class="fas fa-chart-bar"></i>
		</div>
	</div>
</template>

<script setup>
import {ref, computed } from 'vue'
import ProgressPill from './ProgressPill.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps({
  activeItemIndex: {
    required: true,
    type: [Number, null],
  },
  isCorrectArray: {
    type: Array,
    required: true
  }
});

const numberItems = computed(() => props.isCorrectArray.length);
const numberSubmitted = computed(() => props.isCorrectArray.filter(x => x !== null).length);
const numberCorrect = computed(() => props.isCorrectArray.filter(x => x).length);
const percentage = computed(() => numberSubmitted.value / numberItems.value);
const displayString = computed(() => {
  if (props.activeItemIndex === null) return t('summary')

  let oneIndexed = props.activeItemIndex + 1;
  oneIndexed = (oneIndexed < 10) ? '0' + oneIndexed : '' + oneIndexed;
  let nItems = numberItems.value;
  nItems =  (nItems < 10) ? '0' + nItems : '' + nItems;
  return oneIndexed + ' / ' + nItems;
});
</script>

<style scoped>
.sequence-footer {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	height: 48px; /* so the font grow won't expand it */
	font-size: 1.1rem;
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
	margin-right: 8px;
	justify-content: flex-end;
	align-items: center;
}
.right i {
	cursor: pointer;
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