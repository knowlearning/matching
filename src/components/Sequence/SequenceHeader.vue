<template>
	<div class="sequence-header">
		<div class="left">
			<i
				@click="$emit('close')"
				class="exit fas fa-arrow-left"
			/>	
			<PossibleUUIDStringToTranslate :possibleUUIDString="sequenceName" />
		</div>

		<div class="middle">
			<i
				v-for="isCorrect,i in props.isCorrectArray"
				:key="`icon-for-item-${i}`"
				@click="$emit('select',i)"
				:class="{
					'fas': true,
					'fa-circle-check': isCorrect,
					'fa-circle-minus': !isCorrect,
					'correct': isCorrect,
					'incorrect': isCorrect === false,
					'active' : props.activeItemIndex === i
				}"
			/>
		</div>
		<div class="right">{{ text }}</div>		
	</div>
</template>

<script setup>
import { computed } from 'vue'
import PossibleUUIDStringToTranslate from '../PossibleUUIDStringToTranslate.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const o = n => (n < 10 ? '0' + n : '' + n);

const props = defineProps({
	activeItemIndex: {
		type: [ Number, null ],
		required: true
	},
  sequenceName: {
    type: String,
    required: true,
    default: 'Missing Sequence Name'
  },
  isCorrectArray: {
  	type: Array,
  	required: true
  }
})

const numItems = computed(() => props.isCorrectArray.length)
const numCorrect = computed(() =>  props.isCorrectArray.filter(x => x).length)
const text = computed(() => `${t('correct')} : ${o(numCorrect.value)} / ${o(numItems.value)}`)


</script>


<style scoped>
.sequence-header {
	height: 40px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	align-items: center;
}
.left {
	text-align: left;
	margin-left: 8px;
}
.middle {
	display: flex;
	justify-content: center;
	align-items: center;
}
.right {
	text-align: right;
	margin-right: 8px;
}
i {
	cursor: pointer;
	margin: 0 2px;
	transition: font-size 150ms;
}
i.exit {
	margin-right: 12px;
}
i.correct {
	color: limegreen;
}
i.incorrect {
	color: orangered;
}
i.active {
	font-size: 1.6rem;
}
i:not(.active):hover {
	font-size: 1.2rem;
}
</style>