<template>
	<div>
		<p v-if="questionDef.instructions">{{ questionDef.instructions }}</p>
		<div class="audio-control">
			<AudioPlayerButton
				v-show="questionDef.audioId"
				:id="questionDef.audioId"
			/>
		</div>
		<Row
			class="row"
			v-for="r, i in questionDef.rows"
			:key="`row-${i}`"
			v-bind="r"
			:rowIndex="i"
			:wideItemArea="wideItemArea()"
			@entryIsCorrect="rowsCorrect[i] = $event"
		/>
		<button class="submit" @click="handleSubmit">{{ t('submit') }}</button>
	</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { validate as isUUID } from 'uuid'
import Row from './RowSelection/Player.vue'
import AudioPlayerButton from '../AudioPlayerButton.vue'
import { useStore } from 'vuex'

const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps({
	id: { type: String, required: true }
})

const questionDef = await Agent.state(props.id)
const rowsCorrect = reactive(questionDef.rows.map(r => false)) // init to array of false

function handleSubmit() {
	const isCorrect = rowsCorrect.every(el => el)
  if (Agent.embedded) Agent.close({ success: isCorrect })
  else window.alert( isCorrect ? t('correct') : t('incorrect') )
}

function wideItemArea() {
// we want ALL rows to have the same width, narrow or wide
// go through each row. get ALL choices to see if any force wide layout
  const allChoiceLengths = questionDef.rows.reduce((acc, currentRow) => {
  	const rowChoiceLengths = currentRow.choices.map(c => isUUID(c.content) ? 0 : c.content.length)
  	return [ ...acc, ...rowChoiceLengths]
  }, [ 0 ])
  const maxChars = Math.max( ...allChoiceLengths )
  return maxChars > 10
}
</script>

<style scoped>
.row { margin: 4px; }
.audio-control { text-align: center; }
</style>