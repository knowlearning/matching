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
						v-model="selectedValue"
						style="justify-content: center;"
						:value="option.value"
						@focus="selectedValue = $event.target.value"
					/>
				</v-col>
				<v-col cols="1" />
			</v-row>
	</v-container>
</template>


<script setup>
import likertCategories from './likertCategories.js'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import translateScopeId from '../../helpers/translateScopeId.js'

const store = useStore()
function t(slug) { return  store.getters.t(slug) }

const props = defineProps({
	id: {
		type: String,
		required: true
	}
})

const lang = store.getters.language()
const questionDef = await translateScopeId(props.id, lang)

const selectedValue = ref(null)

const radioOptions = computed(() => {
	if (selectedValue === null) return null
	const choices = likertCategories[questionDef.category]
	return choices.map((el,i) => ({
		label: t(el),
		value: i + 1
	}))
})
</script>