<template>
	<div class="sequence-header">
		<div class="left">
			<i
				@click="$emit('close')"
				v-if="props.showBackOrCloseArrow"
				class="exit fas fa-arrow-left"
			/>	
			<ItemName :id="sequenceId" />
		</div>

		<div class="middle">
			<i
				v-for="isCorrect,i in props.isCorrectArray"
				:key="`icon-for-item-${i}`"
				@click="$emit('select',i)"
				:class="{
					'fas': true,
					'always-grey' : props.quizMode,
					'fa-circle-check': isCorrect || (props.quizMode && isCorrect !== null),
					'fa-circle-minus': !isCorrect,
					'correct': isCorrect === true,
					'incorrect': isCorrect === false,
					'completed': isCorrect === 'completed',
					'active' : props.activeItemIndex === i
				}"
			/>
		</div>
		<div class="right">
			<span class="wide" v-if="!props.quizMode">
				{{ wideDisplayText }}
			</span>
			<DisplayTime
				class="mobile"
				:time="props.time"
			/>
		</div>		

	</div>
</template>

<script setup>
import { computed } from 'vue'
import DisplayTime from './DisplayTime.vue'
import ItemName from '../ItemName.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const o = n => (n < 10 ? '0' + n : '' + n);

const props = defineProps({
	time: {
		type: Number,
		required: true
	},
	activeItemIndex: {
		type: [ Number, null ],
		required: true
	},
  sequenceId: {
    type: String,
    required: true,
  },
  isCorrectArray: {
  	type: Array,
  	required: true
  },
  quizMode: {
  	type: Boolean,
  	required: false,
	  default: false
  },
  showBackOrCloseArrow: {
  	type: Boolean,
  	required: false,
  	default: false
  }
})

const numItems = computed(() => props.isCorrectArray.length)
const numCorrect = computed(() =>  props.isCorrectArray.filter(x => x).length)
const wideDisplayText = computed(() => `${t('correct')} : ${o(numCorrect.value)} / ${o(numItems.value)}`)


</script>


<style scoped>
.sequence-header {
	min-height: 40px;
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
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;

}
.right {
	text-align: right;
	margin-right: 8px;
}
.right .mobile { /*toggle in media query */
	display: none;
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
i.completed {
	color: dodgerblue;
}
i.always-grey.correct,
i.always-grey.incorrect {
	color: grey;
}
i.active {
	font-size: 1.6rem;
}
i:not(.active):hover {
	font-size: 1.2rem;
}
@media only screen and (max-width: 600px) {
	.sequence-header { 
		grid-template-columns: 4fr 1fr 0fr;
	}
	.left { display: none;  }
	.right .mobile { display: unset; }
	.right .wide { display: none; }
}

</style>