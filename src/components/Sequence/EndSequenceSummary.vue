<template>
	<div class="end-sequence-summary">

		<table>
			<tbody>
				<tr
					v-for="item, i in props.sequenceDef.items"
					:key="`row-${i}-${item.id}`"
				>
					<td>{{	numDisplay(i) }}</td>
					<td>
						<vueScopeComponent :id="item.id" :path="['name']" />
					</td>
					<td>
						<DisplayTime :time="props.timeOnTasks[i]" />
					</td>
					<td>
						<i
							:class="{
								'fas': true,
								'fa-check-circle': true,
								'correct': props.isCorrectArray[i],
								'incorrect': props.isCorrectArray[i] === false,
							}"
						/>
					</td>
				</tr>
			</tbody>
		</table>




		<button
			class="submit"
			@click="$emit('close')"
		>
			{{ t('close') }}
		</button>
	</div>
</template>

<script setup>
import { vueScopeComponent } from '@knowlearning/agents/vue.js'
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
	background: white;
	}
th, td {
	text-align: left;
	padding: 8px;
}
th {
	background-color: #f2f2f2;
}
i {
	color: grey;
	font-size: 1.2rem;
	padding-left: 8px;
}
i.correct {
	color: limegreen;
}
i.incorrect {
	color: orangered;
}
</style>