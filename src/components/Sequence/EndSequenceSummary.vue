<template>
	<div class="end-sequence-summary">

		<table style="color: #444444;"><!-- see https://github.com/pila-project/pila-platform/issues/130 -->
			<tbody>
				<tr
					v-for="item, i in props.sequenceDef.items"
					:key="`row-${i}-${item.id}`"
				>
					<td>{{	numDisplay(i) }}</td>
					<td>
						<i
							class="fas fa-play-circle"
							@click="$emit('select', i)"
						/>
					</td>
					<td>
						<ItemName :id="item.id" />
					</td>
					<td>
						<DisplayTime :time="props.timeOnTasks[i]" />
					</td>
					<td>
						<i
							:class="{
								'fas': true,
								'fa-check-circle': true,
								'correct': props.isCorrectArray[i] === true,
								'incorrect': props.isCorrectArray[i] === false,
								'completed': props.isCorrectArray[i] === 'completed'
							}"
						/>
					</td>
				</tr>
			</tbody>
		</table>

		<v-btn @click="$emit('close')" color="green">
			{{ t('close') }}
		</v-btn>
	</div>
</template>

<script setup>
import ItemName from '../ItemName.vue'
import DisplayTime from './DisplayTime.vue'

import { useStore } from 'vuex'
const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps({
	sequenceDef: {
		type: Object,
		required: true
	},
	isCorrectArray: {
		type: Array,
		required: true
	},
	timeOnTasks: {
		type: Array,
		required: true
	}
})
function numDisplay(i) {
	let n = i+1
	n = (n<10) ? '0'+n : ''+n
	return n + '.	'
}

</script>


<style scoped>
.end-sequence-summary {
	display: flex;
	flex-direction: column;
	align-items: center;
}
table {
	margin: 20px 0;
	border-collapse: collapse;
	width: 80%;
	max-width: 600px;
	background: white;
	}
th, td {
	text-align: left;
	padding: 8px;
}
th {
	background-color: #f2f2f2;
}
i.fa-play-circle {
	color: grey;
	cursor: pointer;
	font-size: 1.3rem;
}
i.fa-play-circle:hover {
	color: limegreen;
}
i.fa-check-circle {
	color: grey;
	font-size: 1.2rem;
	padding-left: 8px;
}
i.fa-check-circle.correct {
	color: limegreen;
}
i.fa-check-circle.incorrect {
	color: orangered;
}
i.fa-check-circle.completed {
	color: dodgerblue;
}
</style>