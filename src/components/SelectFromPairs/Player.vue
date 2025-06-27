<template>
	<div class="player">
		<div
			v-if="item?.instructions"
			class="instructions"
		>
			<span class="instructions-prefix">{{ t('instructions') }}:</span>
			{{ item.instructions }}
		</div>
		<div class="audio-control">
			<AudioPlayerButton
				v-if="item.audioId"
				:id="item.audioId"
			/>
		</div>
		<Row
			class="row"
			v-for="r, i in item.rows"
			:key="`row-${i}`"
			v-bind="r"
			:rowIndex="i"
			:wideItemArea="wideItemArea()"
			@entryIsCorrect="runstate.rowsCorrect[i] = $event"
		/>
		<v-btn
			@click="handleSubmit"
			color="green"
		>
			<span>{{ t('submit') }}</span>
		</v-btn>
	</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { validate as isUUID } from 'uuid'
import { itemFeedbackSwal } from '../../helpers/swallows.js'
import Row from './RowSelection/Player.vue'
import AudioPlayerButton from '../AudioPlayerButton.vue'
import { useStore } from 'vuex'
import translateScopeId from '../../helpers/translateScopeId.js'

const store = useStore()
function t(slug) { return store.getters.t(slug) }

const props = defineProps({
	id: { type: String, required: true }
})

const language = store.getters.language()
const item = await translateScopeId(props.id, language)
const { auth: { user } } = await Agent.environment()

const runstate = reactive(await Agent.state(`runstate-${props.id}`))

if (runstate.rowsCorrect === undefined || runstate.rowsCorrect.length !== item.rows.length) {
	runstate.rowsCorrect = item.rows.map(r => false)
}

setTimeout(() => {
  runstate.xapi = {
    actor: props.id,
    verb: 'initialized',
    object: props.id,
    extensions: { language }
  }
})

async function handleSubmit() {
  const success = runstate.rowsCorrect.every(el => el)
  const message = getMessage(success)
  if (Agent.embedded) {
    runstate.xapi = {
      actor: user,
      authority: user,
      verb: 'submitted',
      object: props.id,
      result: { success },
      extensions: { message }
    }
  }

  const notInWrapper = (await Agent.environment()).context.length === 1
  if (notInWrapper) await itemFeedbackSwal(t, success, message)
}

function wideItemArea() {
// we want ALL rows to have the same width, narrow or wide
// go through each row. get ALL choices to see if any force wide layout
  const allChoiceLengths = item.rows.reduce((acc, currentRow) => {
  	const rowChoiceLengths = currentRow.choices.map(c => isUUID(c.content) ? 0 : c.content.length)
  	return [ ...acc, ...rowChoiceLengths]
  }, [ 0 ])
  const maxChars = Math.max( ...allChoiceLengths )
  return maxChars > 10
}

function getMessage(isCorrect) {
  if (isCorrect && item.feedback?.correct) return item.feedback.correct 
  else if (!isCorrect && item.feedback?.incorrect) return item.feedback.incorrect
  else return undefined
}

</script>

<style scoped>
.player {
	max-width: 100%;
	padding: 0 8px;
}
.row { margin: 4px; }
.audio-control { text-align: center; }
</style>