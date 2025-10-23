<template>
	<div class="end-sequence-summary">

		<table style="color: #444444;"><!-- see https://github.com/pila-project/pila-platform/issues/130 -->
			<tbody>
				<tr
					v-for="(item, i) in props.sequenceDef.items"
					:key="`row-${i}-${item.id}`"
				>
					<td>{{  numDisplay(i) }}</td>
					<td>
						<i
							class="fas fa-play-circle"
							@click="navTo(i)"
						/>
					</td>
					<td>
						<span v-if="oneOffNameTranslations(item.id,lang)">
							{{ oneOffNameTranslations(item.id,lang) }}
						</span>
						<ItemName v-else :id="item.id" />
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
import { ref } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

function t(slug) { return store.getters.t(slug) }

const emits = defineEmits([ 'select' ])
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
	},
	blockNav: {
		type: Boolean,
		required: false,
		default: false
	}
})
function numDisplay(i) {
	let n = i+1
	n = (n<10) ? '0'+n : ''+n
	return n + '.   '
}
function navTo(i) {
	if (!props.blockNav) {
		emits('select', i)
	}
}

const lang = ref(store.getters.language())

function oneOffNameTranslations(id,lang) {
	return ({
		"90bcfef0-88a2-11f0-88df-85a6aa210518": {
			fr: "Technologie / Logistique et expérience des enseignants",
			pl: "Technologia / Logistyka i doświadczenie nauczycieli"
		},
		"e05dc0a0-8d86-11f0-a3c1-932b943e9869": {
			fr: "Expérience d’enseignement",
			pl: "Doświadczenie w nauczaniu"
		},
		"e1f450e0-8fd0-11f0-8573-8560827b0258": {
			fr: "Formation",
			pl: "Szkolenie"
		},
		"576227c0-8fd2-11f0-955d-ef53957d83fb": {
			fr: "Logistique",
	pl: "Logistyka"
		},
		"d3b68130-8fd3-11f0-b3d2-07cea6e9fae5": {
			fr: "Interface",
			pl: "Interfejs"
		},
		"23bc13a0-8fe0-11f0-9694-81ddfdfbee46": {
			fr: "Contenu et mise en œuvre",
			pl: "Treść i wdrożenie"
		},
		"b0e2c2f0-8fe1-11f0-ba24-27ddde911b10": {
			fr: "Recommandations et effets indirects",
			pl: "Rekomendacje i efekty uboczne"
		},
		"f71fdd40-9dfe-11f0-8034-4f4240962adc": {
			fr: "Chaque session, identification de la séquence",
			pl: "Każda sesja, identyfikacja sekwencji"
		},
		"3583e3b0-8d88-11f0-9be5-79e35292c4fe": {
			fr: "Chaque session",
			pl: "Każda sesja"
		},
		"480af070-8fe3-11f0-bfc6-e5f1bb3dab10": {
			fr: "Évaluation de lecture",
			pl: "Ocena czytania"
		},
		"61303f40-8fe5-11f0-a0c1-fd5fc5cbfff8": {
			fr: "Évaluation de dactylographie",
			pl: "Ocena pisania na klawiaturze"
		},
		"e05f2560-8fe5-11f0-a46a-030e170d5745": {
			fr: "Autoévaluation en mathématiques",
			pl: "Samoocena z matematyki"
		},
		"7479efa0-9207-11f0-99c9-051bc92e65c3": {
			fr: "Autre",
			pl: "Inne"
		},
		"61a0d7d0-9208-11f0-92a5-f756a9db5d96": {
			fr: "Anxiété",
			pl: "Lęk"
		},
		"f7b95e80-9213-11f0-bf94-dff5188b8e0d": {
			fr: "Plateforme",
			pl: "Platforma"
		},
		"25fc4170-9216-11f0-8c8e-4fbf7a2196fc": {
			fr: "Amusement, instructions et réflexion",
			pl: "Zabawa, instrukcje i refleksja"
		},
		"3c83a950-9217-11f0-a10b-a764de191fe1": {
			fr: "Chatbot (traitement)",
			pl: "Chatbot (grupa eksperymentalna)"
		}
	})[id]?.[lang]
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