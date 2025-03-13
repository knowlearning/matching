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
				<v-col cols="2"
					v-for="(option, i) in radioOptions" :key="`label-${i}`"
				>
					{{ option.label }}
				</v-col>
				<v-col cols="1" />
			</v-row>
			<v-row no-gutters>
				<v-col cols="1" />
				<!-- one on each side, 5 of width 2 in the middle -->
				<v-col cols="2"
					v-for="(option, i) in radioOptions" :key="`option-${i}`"

				>
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

function t(slug) { return useStore().getters.t(slug) }

function handleSelection(e) {

	console.log(e.target.value)
}

const props = defineProps({
	id: {
		type: String,
		required: true
	}
})

const selectedValue = ref(null)

const questionDef = await Agent.state(props.id)

const radioOptions = computed(() => {
	if (selectedValue === null) return null
	const choices = likertCategories[questionDef.category]
	console.log(choices)
	return choices.map((el,i) => ({
		label: t(el),
		value: i + 1
	}))

})



</script>