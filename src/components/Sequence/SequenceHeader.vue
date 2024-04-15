<template>
	<div class="sequence-header">
		<div class="left"> {{ sequenceName }} </div>
		<div>
			<i
				v-for="isCorrect,i in props.isCorrectArray"
				:key="`icon-for-item-${i}`"
				@click="$emit('select',i)"
				:class="{
					'fas': true,
					'fa-check-circle': true,
					'correct': isCorrect,
					'incorrect': isCorrect === false
				}"
			/>
		</div>
		<div class="right">{{ text }}</div>		
	</div>
</template>

<script setup>
import { computed } from 'vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const o = n => (n < 10 ? '0' + n : '' + n);

const props = defineProps({
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
const text = computed(() => `${t('correct')} : ${numCorrect.value} / ${numItems.value}`)

</script>


<style scoped>
.sequence-header {
	height: 40px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	align-content: center;
}
.left {
	text-align: left;
	margin-left: 8px;
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
i.correct {
	color: limegreen;
}
i.incorrect {
	color: orangered;
}
i:hover {
	font-size: 1.3rem;
}
</style>