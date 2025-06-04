<template>
	<v-container class="player">
		<v-row
			cols="12"
			class="mt-1"
			style="justify-content: center; font-weight: 600;"
		>
			{{ questionDef.instructions }}
		</v-row>

			<v-row>
				<v-col cols="1" />
				<!-- one on each side, 5 of width 2 in the middle -->
				<v-col cols="2" v-for="(option, i) in radioOptions" :key="`label-${i}`">
					{{ option.label }}
				</v-col>
				<v-col cols="1" />
			</v-row>
			<v-row no-gutters>
				<v-col cols="1" />
				<!-- one on each side, 5 of width 2 in the middle -->
				<v-col cols="2" v-for="(option, i) in radioOptions" :key="`option-${i}`">
					<v-radio
						v-model="runstate.selectedValue"
						style="justify-content: center;"
						:value="option.value"
						@focus="event => {
							const value = parseInt(event.target.value)
							runstate.xapi = {
								actor: user,
								authority: user,
								verb: 'answered',
								object: props.id,
								result: {
									score: {
										min: 1,
										max: 5,
										raw: value
									}
								}
							}
							runstate.selectedValue = value
						}"
					/>
				</v-col>
				<v-col cols="1" />
			</v-row>

			<v-row>
				<v-btn color="green" @click="handleNext" class="mx-auto">
					{{ t('next') }}
				</v-btn>
			</v-row>
	</v-container>
</template>


<script setup>
import likertCategories from './likertCategories.js'
import { ref, computed, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import translateScopeId from '../../helpers/translateScopeId.js'

const { auth: { user} } = await Agent.environment()
const store = useStore()
function t(slug) { return  store.getters.t(slug) }

const props = defineProps({
	id: {
		type: String,
		required: true
	}
})

const language = store.getters.language()
const questionDef = await translateScopeId(props.id, language)

const runstate = reactive(await Agent.state(`runstate-${props.id}`))

if (runstate.selectedValue === undefined) runstate.selectedValue = null

const radioOptions = computed(() => {
	const choices = likertCategories[questionDef.category]
	return choices.map((el,i) => ({
		label: t(el),
		value: i + 1
	}))
})

setTimeout(() => {
    runstate.xapi = {
        actor: props.id,
        verb: 'initialized',
        object: props.id,
        extensions: { language }
    }
})

function handleNext() {
	runstate.xapi = {
		actor: user,
		authority: user,
		verb: 'completed',
		object: props.id,
		result: {
			score: {
				min: 1,
				max: 5,
				raw: runstate.selectedValue
			}
		}
	}
}
</script>